import assert from 'node:assert/strict';
import { createDefaultScope, demoDataset, selectScopedPairs } from '../data';
import { matchesRuleNumber, newReviewRule, previewReviewRule, publishReviewRule, sourceMipRule, validDate } from './decisionRules';

const scope = createDefaultScope('in-season');
const rule = { ...newReviewRule(scope), owner: 'Design-session rule owner' };
const checks: string[] = [];
const check = (name: string, run: () => void) => { run(); checks.push(name); };
check('Stockout preview uses exact scoped ranged pairs and preserves zero values', () => {
  const preview = previewReviewRule(rule, scope, demoDataset, '2026-10-28T12:00:00Z');
  const expected = selectScopedPairs(scope, demoDataset).filter(pair => pair.range === 'ranged' && pair.sellableOh.value === 0).map(pair => pair.id).sort();
  assert.deepEqual(preview.errors, []); assert.deepEqual(preview.pairIds, expected);
  assert.equal(preview.scannedPairs, selectScopedPairs(scope, demoDataset).length);
  assert.equal(new Set(preview.pairIds).size, preview.pairIds.length);
});
check('S11 exact threshold includes six, excludes 5.9 and blank; missing source never becomes a fabricated preview', () => {
  const recipe = { ...sourceMipRule(scope), owner: 'Source owner' };
  assert.equal(matchesRuleNumber(6, recipe), true); assert.equal(matchesRuleNumber(5.9, recipe), false); assert.equal(matchesRuleNumber(null, recipe), false);
  const unavailable = { ...structuredClone(demoDataset), products: demoDataset.products.map(product => ({ ...product, sourceMip: null })) };
  const preview = previewReviewRule(recipe, scope, unavailable);
  assert(preview.errors.some(error => error.includes('not connected'))); assert.equal(preview.pairIds.length, 0);
});
check('Typed numeric conditions preserve negative/zero values and explicit missing/between semantics', () => {
  assert.equal(matchesRuleNumber(0, { ...rule, threshold: '0', operator: 'eq' }), true);
  assert.equal(matchesRuleNumber(-25, { ...rule, threshold: '-20', operator: 'lte' }), true);
  assert.equal(matchesRuleNumber(null, { ...rule, operator: 'missing' }), true);
  assert.equal(matchesRuleNumber(0, { ...rule, operator: 'missing' }), false);
  assert.equal(matchesRuleNumber(4, { ...rule, operator: 'between', threshold: '3', upper: '5' }), true);
  assert.equal(matchesRuleNumber(5.1, { ...rule, operator: 'between', threshold: '3', upper: '5' }), false);
});
check('Preview is read-only and stock review never applies a minimum-sales gate', () => {
  const before = JSON.stringify(demoDataset), result = previewReviewRule({ ...rule, metric: 'sales', operator: 'gte', threshold: '0', rangedOnly: false, stockOnly: true }, scope, demoDataset);
  const expected = selectScopedPairs(scope, demoDataset).filter(pair => (pair.sellableOh.value ?? 0) > 0 && pair.sales.value !== null && pair.sales.value >= 0);
  assert.equal(result.pairIds.length, expected.length); assert.equal(JSON.stringify(demoDataset), before);
  assert(result.pairIds.every(id => expected.some(pair => pair.id === id)));
});
check('Publishing requires current preview and administrator permission', () => {
  const preview = previewReviewRule(rule, scope, demoDataset);
  assert(publishReviewRule([], rule, preview, scope, demoDataset, 'merchant', false).errors.length);
  assert(publishReviewRule([], { ...rule, threshold: '1' }, preview, scope, demoDataset, 'admin', true).errors.some(error => error.includes('Preview')));
  assert(publishReviewRule([], rule, preview, { ...scope, stockAsOf: '1900-01-01' }, demoDataset, 'admin', true).errors.some(error => error.includes('Preview')));
});
check('Published rule versions retain frozen rule, scope and matched IDs; new versions never rewrite prior cases', () => {
  const before = JSON.stringify(demoDataset.cases), preview = previewReviewRule(rule, scope, demoDataset);
  const first = publishReviewRule([], rule, preview, scope, demoDataset, 'administrator', true);
  assert.equal(first.record?.version, 1);
  const secondRule = { ...rule, name: 'Revised name' }, secondPreview = previewReviewRule(secondRule, scope, demoDataset);
  const second = publishReviewRule(first.versions, secondRule, secondPreview, scope, demoDataset, 'administrator', true);
  assert.equal(second.record?.version, 2); assert.equal(second.versions[0].rule.name, rule.name);
  secondRule.name = 'Unsaved mutation'; secondPreview.pairIds.push('invalid-pair');
  assert.equal(second.versions[1].rule.name, 'Revised name'); assert(!second.versions[1].preview.pairIds.includes('invalid-pair'));
  assert.equal(JSON.stringify(demoDataset.cases), before);
});
check('Invalid thresholds, ownership, exposure and calendar dates block evaluation', () => {
  assert.equal(validDate('2026-02-30'), false); assert.equal(validDate('2026-02-28'), true);
  const preview = previewReviewRule({ ...rule, owner: '', threshold: 'abc', minExposure: '-1', effectiveFrom: '2026-02-30' }, scope, demoDataset);
  assert(preview.errors.length >= 4); assert.equal(preview.pairIds.length, 0);
});
check('Cross-unit nonzero stock thresholds require one unit; no-positive-base is a typed sales-comparison state', () => {
  const mixed = previewReviewRule({ ...rule, unit: 'mixed', threshold: '5' }, scope, demoDataset);
  assert(mixed.errors.some(error => error.includes('compatible quantity unit')));
  assert.equal(matchesRuleNumber(null, { ...rule, metric: 'salesChange', operator: 'no-positive-base' }, 'no-positive-base'), true);
  assert.equal(matchesRuleNumber(null, { ...rule, metric: 'salesChange', operator: 'no-positive-base' }, 'missing'), false);
});
console.log(JSON.stringify({ kind: 'Pure typed rule workflow checks; not browser acceptance', passed: checks.length, checks }, null, 2));
