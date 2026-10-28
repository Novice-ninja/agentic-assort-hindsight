import type { CaseRecord, Dataset, PairFact, Scope } from '../data';
import { scopeSignature, selectScopedPairs } from '../data';

export const QUEUES = ['Shortages', 'Coverage/excess', 'New item', 'Nonproductive', 'Bulk out', 'Lifecycle/exit'] as const;
export type QueueName = typeof QUEUES[number];
export type RuleMetric = 'salesChange' | 'sellableOh' | 'wos' | 'sales' | 'sourceMip';
export type RuleOperator = 'lt' | 'lte' | 'eq' | 'gte' | 'gt' | 'between' | 'missing' | 'no-positive-base';
export interface ReviewRule {
  id: string; name: string; metric: RuleMetric; metricId: string; definitionVersion: string; operator: RuleOperator; threshold: string; upper: string;
  window: string; unit: string; minExposure: string; rangedOnly: boolean; stockOnly: boolean; excludedItemIds: string[];
  severity: CaseRecord['priority']; queue: QueueName; effectiveFrom: string; effectiveTo: string;
  owner: string; sourceRecipe: boolean;
}
export interface RulePreview {
  signature: string; evaluatedAt: string; datasetVersion: string; scannedPairs: number; pairIds: string[];
  itemIds: string[]; caseIds: string[]; ohCost: number | null; unknownCount: number; errors: string[];
}
export interface PublishedRule {
  id: string; version: number; rule: ReviewRule; preview: RulePreview; publishedAt: string; publishedBy: string;
}
export const RULE_METRICS: { id: RuleMetric; catalogueId: string; label: string; unit: string; definition: string }[] = [
  { id: 'sellableOh', catalogueId: 'K06', label: 'Sellable on-hand quantity', unit: 'compatible quantity', definition: 'Exact selected inventory snapshot; a valid zero is distinct from missing or negative stock.' },
  { id: 'salesChange', catalogueId: 'K01:growth', label: 'Sales change versus comparison', unit: '%', definition: 'Derived from K01 net sales. Relative growth is available only for a positive comparable sales base.' },
  { id: 'wos', catalogueId: 'K14', label: 'Backward weeks of supply', unit: 'weeks', definition: 'Snapshot-aligned R4 compatible net quantity. No positive demand or missing facts remain unavailable.' },
  { id: 'sales', catalogueId: 'K01', label: 'Net sales', unit: 'USD', definition: 'Signed net sales for the rule’s selected completed fiscal window.' },
  { id: 'sourceMip', catalogueId: 'K63', label: 'Source MIP · definition pending', unit: 'source value', definition: 'Preserves the exact S11 source predicate MIP ≥ 6 and not blank. The business meaning of MIP is not inferred.' },
];
export function newReviewRule(scope: Scope): ReviewRule {
  return { id: 'ranged-zero-sellable', name: 'Ranged stockout review', metric: 'sellableOh', metricId: 'K06', definitionVersion: 'proposed-base-v2', operator: 'eq', threshold: '0', upper: '', window: scope.window, unit: scope.uom, minExposure: '0', rangedOnly: true, stockOnly: false, excludedItemIds: [], severity: 'Critical', queue: 'Shortages', effectiveFrom: scope.rangeAsOf, effectiveTo: '', owner: '', sourceRecipe: false };
}
export function sourceMipRule(scope: Scope): ReviewRule {
  return { ...newReviewRule(scope), id: 's11-nonproductive', name: 'S11 source cohort · MIP ≥ 6 and not blank', metric: 'sourceMip', metricId: 'K63', operator: 'gte', threshold: '6', unit: 'source value', queue: 'Nonproductive', rangedOnly: false, severity: 'High', sourceRecipe: true };
}
export function validDate(value: string): boolean { return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value; }
export function ruleErrors(rule: ReviewRule): string[] {
  const errors: string[] = [];
  if (!rule.name.trim() || !rule.id.trim()) errors.push('Provide a rule name and stable ID.');
  if (!rule.owner.trim()) errors.push('Assign a rule owner.');
  if (!validDate(rule.effectiveFrom) || (rule.effectiveTo && !validDate(rule.effectiveTo))) errors.push('Provide valid effective dates.');
  if (rule.effectiveTo && rule.effectiveTo < rule.effectiveFrom) errors.push('Effective end must be on or after the start.');
  if (!['missing', 'no-positive-base'].includes(rule.operator) && (!rule.threshold.trim() || !Number.isFinite(Number(rule.threshold)))) errors.push('Enter a numeric threshold.');
  if (rule.metric === 'sellableOh' && rule.unit === 'mixed' && !(rule.operator === 'missing' || rule.operator === 'eq' && Number(rule.threshold) === 0)) errors.push('Choose one compatible quantity unit for a nonzero stock threshold.');
  if (rule.operator === 'no-positive-base' && rule.metric !== 'salesChange') errors.push('No-positive-base applies to the sales comparison metric. Choose a supported condition for this metric.');
  if (rule.operator === 'between' && (!rule.upper.trim() || !Number.isFinite(Number(rule.upper)) || Number(rule.upper) < Number(rule.threshold))) errors.push('Enter an upper threshold at or above the lower threshold.');
  if (!rule.minExposure.trim() || !Number.isFinite(Number(rule.minExposure)) || Number(rule.minExposure) < 0) errors.push('Minimum pair exposure must be zero or positive.');
  if (rule.sourceRecipe && (rule.metric !== 'sourceMip' || rule.operator !== 'gte' || Number(rule.threshold) !== 6)) errors.push('The S11 source recipe must retain MIP ≥ 6 and not blank. Create a separate rule for a different policy.');
  return errors;
}
export function matchesRuleNumber(value: number | null, rule: ReviewRule, state?: string): boolean {
  if (rule.operator === 'missing') return value === null;
  if (rule.operator === 'no-positive-base') return state === 'no-positive-base' || state === 'negative-base';
  if (value === null || !Number.isFinite(value)) return false;
  const threshold = Number(rule.threshold);
  return rule.operator === 'eq' ? value === threshold : rule.operator === 'gt' ? value > threshold : rule.operator === 'gte' ? value >= threshold : rule.operator === 'lt' ? value < threshold : rule.operator === 'lte' ? value <= threshold : value >= threshold && value <= Number(rule.upper);
}
export function rulePreviewSignature(rule: ReviewRule, scope: Scope, dataset: Dataset): string { return JSON.stringify([rule, scopeSignature(scope), dataset.version]); }
export function previewReviewRule(rule: ReviewRule, scope: Scope, dataset: Dataset, evaluatedAt = new Date().toISOString()): RulePreview {
  const ruleScope = { ...scope, window: rule.window as Scope['window'], weekIds: rule.window === scope.window ? scope.weekIds : undefined };
  const pairs = selectScopedPairs(ruleScope, dataset), errors = ruleErrors(rule);
  if (rule.metric === 'sourceMip' && !dataset.products.some(product => typeof (product as unknown as { sourceMip?: number }).sourceMip === 'number')) errors.push('Source MIP values are not connected. The preserved S11 recipe cannot be evaluated from product names or inferred months.');
  const value = (pair: PairFact): number | null => rule.metric === 'sourceMip' ? typeof (pair.item as unknown as { sourceMip?: number }).sourceMip === 'number' ? (pair.item as unknown as { sourceMip: number }).sourceMip : null : pair[rule.metric].value;
  const eligible = pairs.filter(pair => !rule.excludedItemIds.includes(pair.itemId) && (rule.metric !== 'sellableOh' || !rule.unit || rule.unit === 'mixed' || pair.item.uom === rule.unit) && (!rule.rangedOnly || pair.range === 'ranged') && (!rule.stockOnly || (pair.sellableOh.value !== null && pair.sellableOh.value > 0)) && (pair.exposureWeeks.value ?? 0) >= Number(rule.minExposure));
  const matches = errors.length ? [] : eligible.filter(pair => matchesRuleNumber(value(pair), rule, rule.metric === 'sourceMip' ? undefined : pair[rule.metric].state));
  const pairIds = [...new Set(matches.map(pair => pair.id))].sort(), itemIds = [...new Set(matches.map(pair => pair.itemId))].sort();
  const caseIds = [...new Set(dataset.cases.filter(record => record.state !== 'Resolved' && pairIds.includes(`${record.itemId}:${record.storeId}`)).map(record => record.id))].sort();
  return { signature: rulePreviewSignature(rule, scope, dataset), evaluatedAt, datasetVersion: dataset.version, scannedPairs: pairs.length, pairIds, itemIds, caseIds, ohCost: matches.some(pair => pair.ohCost.value === null) ? null : matches.reduce((sum, pair) => sum + (pair.ohCost.value ?? 0), 0), unknownCount: eligible.filter(pair => value(pair) === null).length, errors };
}
export function publishReviewRule(versions: readonly PublishedRule[], rule: ReviewRule, preview: RulePreview | null, scope: Scope, dataset: Dataset, actor: string, allowed: boolean, now = new Date().toISOString()): { versions: PublishedRule[]; record?: PublishedRule; errors: string[] } {
  const errors = ruleErrors(rule);
  if (!allowed) errors.push('Rule publishing requires administrator permission.');
  if (!preview || preview.signature !== rulePreviewSignature(rule, scope, dataset)) errors.push('Preview the current rule and scope before publishing.');
  if (preview?.errors.length) errors.push(...preview.errors);
  if (errors.length || !preview) return { versions: [...versions], errors: [...new Set(errors)] };
  const record: PublishedRule = { id: rule.id, version: Math.max(0, ...versions.filter(version => version.id === rule.id).map(version => version.version)) + 1, rule: structuredClone(rule), preview: structuredClone(preview), publishedAt: now, publishedBy: actor };
  return { versions: [...versions, record], record, errors: [] };
}
export function caseMatchesQueue(record: CaseRecord, queue: string, pair?: PairFact): boolean {
  if (!queue || queue === 'All') return true;
  if (String(record.queue) === queue) return true;
  return queue === 'New item' && !!pair?.item.focusGroups.some(group => /^NPI$/i.test(group));
}
