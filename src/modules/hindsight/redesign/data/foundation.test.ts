import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import story from './control-story-contract.json';
import { aggregatePairs, comparisonWeekIds, coverageWeekIds, createDefaultScope, getBreadth, getItemRows, getMixRows, getPairFact, getPlrReview, getStoreRows, getTrend, resolveWorkspace, scopeSignature, selectScopedPairs, withSession } from './controlApi';
import { controlDataset as demoDataset, getControlScenarioDataset as getScenarioDataset } from './controlFixtures';
import { advanceDecision, createInitialSession, saveDecisionDraft, saveLearning, saveObservation } from './controlApi';
import catalogue from './catalogue.json';
import type { Dataset, Scope } from './types';

const checks: string[] = [];
function check(name: string, fn: () => void) { fn(); checks.push(name); }
const near = (actual: number | null, expected: number) => { assert(actual !== null && Math.abs(actual - expected) < 1e-6, `${actual} != ${expected}`); };
const scope = createDefaultScope(), plrScope = createDefaultScope('plr');
check('One tactical cohort reconciles Overview, item rows, store rows and pair leaves.', () => {
  const view = resolveWorkspace(scope);
  assert.equal(new Set(demoDataset.facts.map(f => `${f.itemId}:${f.storeId}:${f.weekId}`)).size, demoDataset.facts.length);
  assert.equal(new Set(demoDataset.inventory.map(i => `${i.itemId}:${i.storeId}:${i.asOf}`)).size, demoDataset.inventory.length);
  near(view.overview.sales.value, story.tactical.sales); near(view.overview.quantity.value, 4000); near(view.overview.gmDollars.value, 7680); near(view.overview.gmRate.value, 32); near(view.overview.ohCost.value, 16000);
  for (const field of ['sales', 'ohCost', 'gmDollars'] as const) {
    near(view.items.reduce((n, row) => n + row[field].value!, 0), view.overview[field].value!);
    near(view.stores.reduce((n, row) => n + row[field].value!, 0), view.overview[field].value!);
  }
  assert.equal(view.pairs.length, 15); assert.equal(view.overview.rangedPairCount, 12); assert.equal(view.overview.rangedStoreCount, 4); assert.equal(view.overview.rangedSkuCount, 4);
  near(aggregatePairs([...view.pairs, ...view.pairs]).sales.value, 24000);
});
check('Exact proposed product/store totals and all 16 matrix states match the shared story contract.', () => {
  const items = getItemRows(scope), stores = getStoreRows(scope);
  story.productTotals.forEach(expected => { const row = items.find(r => r.id === expected.id)!; near(row.sales.value, expected.sales); near(row.quantity.value, expected.quantity); near(row.gmRate.value, expected.gmPercent); near(row.ohCost.value, expected.onHandCost); assert.equal(row.rangedStoreCount, expected.rangedStores); });
  story.storeTotals.forEach(expected => { const row = stores.find(r => r.id === expected.id)!; near(row.sales.value, expected.sales); near(row.ohCost.value, expected.onHandCost); assert.equal(row.rangedSkuCount, expected.rangedSkus); });
  story.matrixStates.forEach((row, i) => row.forEach((state, j) => assert.equal(getPairFact(`P10${i + 1}`, `S10${j + 1}`, scope)!.matrixState, state)));
});
check('Bidirectional item/store drills use identical pair facts, separate inbound and one shared DC pool.', () => {
  const a = getItemRows(scope).find(r => r.id === 'P101')!.pairs.find(p => p.storeId === 'S102')!;
  const b = getStoreRows(scope).find(r => r.id === 'S102')!.pairs.find(p => p.itemId === 'P101')!;
  assert.deepEqual(a, b); near(a.sales.value, 1800); near(a.lySales.value, 2400); near(a.salesChange.value, -25); near(a.sellableOh.value, 0); near(a.openInbound.value, 200);
  assert.equal(demoDataset.supply.filter(s => s.kind === 'dc-pool').length, 1); assert.equal(a.supply.find(s => s.kind === 'dc-pool')!.quantity, 900);
  near(resolveWorkspace(scope).overview.physicalOh.value, 4000); // 900 DC is never added to store stock.
});
check('Range exposure retains exits and LY-only zero TY activity; candidate-only nonmember is excluded.', () => {
  const pairs = selectScopedPairs(scope); assert(pairs.some(p => p.id === 'P101:S103')); assert(pairs.some(p => p.id === 'P104:S103')); assert(!pairs.some(p => p.id === 'P101:S104'));
  near(pairs.find(p => p.id === 'P104:S103')!.sales.value, 0); near(pairs.find(p => p.id === 'P104:S103')!.lySales.value, 600);
  assert.equal(selectScopedPairs({ ...scope, population: 'all-candidates' }).length, 16); assert.equal(selectScopedPairs({ ...scope, population: 'current-range' }).length, 12);
  near(aggregatePairs(selectScopedPairs({ ...scope, population: 'current-range' })).sales.value, 19800);
  const zero = selectScopedPairs({ ...scope, scenario: 'zero-sales' }).find(p => p.id === 'P103:S103')!; near(zero.sales.value, 0); assert.equal(zero.range, 'ranged');
});
check('Transaction presence retains zero-net activity; a zero net is not an absence predicate.', () => {
  const data: Dataset = structuredClone(demoDataset);
  data.facts.filter(f => f.itemId === 'P104' && f.storeId === 'S103').forEach(f => { f.netSales = 0; f.netQuantity = 0; f.transactionCount = 2; });
  assert(selectScopedPairs(scope, data).some(p => p.id === 'P104:S103'));
});
check('Exposure normalization exposes the 3300/48 denominator and differs from store-week productivity.', () => {
  const a = resolveWorkspace(scope).overview, p101 = getItemRows(scope)[0];
  near(a.qualifyingQuantity.value, 3300); near(a.exposureWeeks.value, 48); near(a.velocity.value, 68.75);
  near(p101.qualifyingQuantity.value, 900); near(p101.exposureWeeks.value, 8); near(p101.velocity.value, 112.5);
  near(a.storeExposureWeeks.value, 16); near(a.quantityPerStoreWeek.value, 250); near(a.salesPerStoreWeek.value, 1500);
});
check('Ratios are ratios of totals; monthly GM is recomputed from weighted facts.', () => {
  assert.notEqual((30 + 35 + 30 + 30) / 4, resolveWorkspace(scope).overview.gmRate.value);
  const data: Dataset = structuredClone(demoDataset);
  const week = data.facts.find(f => f.itemId === 'P101' && f.storeId === 'S101' && f.weekId === 'FY2026-W10')!; week.netSales += 3000;
  const raw = data.facts.filter(f => f.weekId >= 'FY2026-W10' && f.weekId <= 'FY2026-W13');
  const expected = raw.reduce((n, f) => n + f.netSales - f.recognizedCogs!, 0) / raw.reduce((n, f) => n + f.netSales, 0) * 100;
  near(getTrend(scope, 'gmRate', 'month', data)[0].actual.value, expected);
  near(getTrend(scope, 'sales').reduce((n, point) => n + point.actual.value!, 0), 24000);
  data.facts.find(f => f.itemId === 'P101' && f.storeId === 'S101' && f.weekId === 'FY2025-W10')!.recognizedCogs = null;
  assert.equal(getTrend(scope, 'gmRate', 'month', data)[0].comparison.value, null);
});
check('Color/finish/GBB bind real grouping and include Unknown; Gray is 40/25 =1.60.', () => {
  const rows = getMixRows(scope, 'color'), gray = rows.find(r => r.id === 'Gray')!;
  near(gray.sales.value, 9600); near(gray.salesShare.value, 40); near(gray.skuShare.value, 25); near(gray.productivityIndex.value, 1.6);
  assert(rows.some(r => r.id === 'Unknown')); near(rows.reduce((n, r) => n + r.salesShare.value!, 0), 100);
  assert(!getMixRows(scope, 'finish').some(r => r.id === 'Gray')); assert.equal(getMixRows(scope, 'unsupported').length, 0);
  assert(getMixRows(scope, 'gbb').some(r => r.id === 'Opening Price Point'));
});
check('Changing window changes sales and fiscal comparisons while the stock snapshot remains fixed.', () => {
  const a = resolveWorkspace(scope), b = resolveWorkspace({ ...scope, window: 'R13' });
  assert.notEqual(a.overview.sales.value, b.overview.sales.value); near(b.overview.ohCost.value, 16000); assert(b.pairs.every(p => p.stockAsOf === '2026-03-29'));
  assert.deepEqual(comparisonWeekIds(scope), ['FY2025-W10', 'FY2025-W11', 'FY2025-W12', 'FY2025-W13']);
  assert.notEqual(scopeSignature(scope), scopeSignature({ ...scope, window: 'R13' }));
  assert.equal(scopeSignature({ ...scope, productIds: ['P102', 'P101'] }), scopeSignature({ ...scope, productIds: ['P101', 'P102'] }));
});
check('K14 backward R4 cover follows the stock snapshot independently of the sales display window.', () => {
  const pair = getPairFact('P101', 'S101', scope)!, wider = getPairFact('P101', 'S101', { ...scope, window: 'R13' })!;
  near(pair.wos.value, 250 / (600 / 4)); assert.deepEqual(wider.wos, pair.wos);
  assert.deepEqual(coverageWeekIds(scope), ['FY2026-W10', 'FY2026-W11', 'FY2026-W12', 'FY2026-W13']);
  assert.deepEqual(coverageWeekIds(plrScope), ['FY2026-W05', 'FY2026-W06', 'FY2026-W07', 'FY2026-W08']);
  const data: Dataset = structuredClone(demoDataset);
  data.facts = data.facts.filter(f => !(f.itemId === 'P101' && f.storeId === 'S101' && f.weekId === 'FY2026-W10'));
  assert.equal(getPairFact('P101', 'S101', { ...scope, weekIds: ['FY2026-W13'] }, data)!.wos.value, null);
  assert.equal(getPairFact('P101', 'S101', { ...scope, scenario: 'stale-feed' })!.wos.state, 'stale');
});
check('Original PLR reconciles 48k/50k,46k revision,6k later adds,8000/12000 and ending16k.', () => {
  const r = getPlrReview(plrScope);
  near(r.actualSales.value, 48000); near(r.originalSalesPlan.value, 50000); near(r.revisedSalesPlan.value, 46000); near(r.salesVariance.value, -2000); near(r.laterAdditionSales.value, 6000); near(r.totalRealizedSales.value, 54000);
  near(r.actualQuantity.value, 8000); near(r.demandPlanQuantity.value, 10000); near(r.gmDollars.value, 15360); near(r.gmRate.value, 32); near(r.gmGapPp.value, 2);
  near(r.approvedBuyQuantity.value, 12000); near(r.openingQuantity.value, 2000); near(r.receivedQuantity.value, 10000); near(r.openOrderQuantity.value, 2000); near(r.supplyAvailable.value, 12000); near(r.sellThrough.value, 8000 / 12000 * 100); near(r.endingInventoryCost.value, 16000); near(r.plannedEndingInventoryCost.value, 8000);
  assert.equal(r.duePairs, 12); assert.equal(r.onTimePairs, 10); assert.equal(r.latePairs, 1); assert.equal(r.notActivatedPairs, 1);
});
check('Original cohort is immutable under a week6 exit, revision selection, closures and later additions.', () => {
  assert(Object.isFrozen(demoDataset.versions[0].pairs));
  const revised = getPlrReview({ ...plrScope, version: 'v2' }); near(revised.originalSalesPlan.value, 50000); assert.equal(revised.originalPairCount, 12);
  const exit = selectScopedPairs(plrScope).find(p => p.id === 'P101:S103')!; assert.equal(exit.range, 'exited'); assert(exit.sales.value! > 0);
  const closed = getPlrReview({ ...plrScope, scenario: 'closed-store' }); assert.equal(closed.originalPairCount, 12); assert.equal(closed.duePairs, 12);
});
check('Elapsed review uses phased weeks; future due and unknown history are separate from failed launches.', () => {
  const firstFour = demoDataset.versions[0].weekIds.slice(0, 4); const partial = getPlrReview({ ...plrScope, weekIds: firstFour }); near(partial.originalSalesPlan.value, 25000); near(partial.actualSales.value, 24000); assert.equal(partial.elapsedWeeks, 4);
  const unknown = getPlrReview({ ...plrScope, scenario: 'unknown-history' }); assert.equal(unknown.unknownHistoryPairs, 1); assert.equal(unknown.notActivatedPairs, 0); assert.equal(unknown.executionRate.value, null); near(unknown.executionBounds.lower, 10 / 12 * 100); near(unknown.executionBounds.upper, 11 / 12 * 100);
  const data: Dataset = structuredClone(demoDataset); data.versions.forEach(v => { v.pairs.find(p => p.itemId === 'P101' && p.storeId === 'S104')!.targetLaunch = '2026-03-02'; });
  const future = getPlrReview(plrScope, data); assert.equal(future.notYetDuePairs, 1); assert.equal(future.duePairs, 11); assert.equal(future.notActivatedPairs, 0);
});
check('Historical stock is exact-date only and a missing original plan is not replaced by LY.', () => {
  const missingStock = getPlrReview({ ...plrScope, stockAsOf: '2026-02-21' }); assert.equal(missingStock.endingInventoryCost.value, null);
  const missingPlan = getPlrReview({ ...plrScope, scenario: 'missing-plan' }); assert.equal(missingPlan.connected, false); assert.equal(missingPlan.originalSalesPlan.value, null); assert.equal(missingPlan.actualQuantity.value, null); assert.equal(missingPlan.receivedQuantity.value, null); assert.equal(selectScopedPairs({ ...plrScope, scenario: 'missing-plan' }).length, 0);
});
check('Zero/negative comparison bases retain signed deltas without invalid percent growth.', () => {
  const zero = getPairFact('P101', 'S102', { ...scope, scenario: 'zero-base' })!; assert.equal(zero.salesChange.state, 'no-positive-base'); near(zero.salesDelta.value, 1800);
  const negative = getPairFact('P101', 'S102', { ...scope, scenario: 'negative-base' })!; assert.equal(negative.salesChange.state, 'negative-base'); near(negative.salesDelta.value, 2200);
});
check('Negative stock is reconciliation, missing stock is unknown and no positive demand is not Infinity.', () => {
  const negative = resolveWorkspace({ ...scope, scenario: 'negative-stock' }); const p = negative.pairs.find(p => p.id === 'P101:S102')!; assert.equal(p.matrixState, '!'); assert.equal(p.wos.state, 'reconcile'); assert.equal(negative.overview.stockoutPairCount, 1);
  const absent = getPairFact('P101', 'S102', { ...scope, scenario: 'missing-inventory' })!; assert.equal(absent.sellableOh.value, null); assert.equal(absent.matrixState, '?');
  assert.equal(getPairFact('P104', 'S103', scope)!.wos.state, 'no-positive-base');
});
check('Mixed UOM splits quantity and suppresses aggregate ASP; stale feeds remain dated nonzero facts.', () => {
  const mixed = resolveWorkspace({ ...scope, scenario: 'mixed-uom', uom:'mixed' }).overview; near(mixed.sales.value, 24000); assert.equal(mixed.quantity.value, null); assert.equal(mixed.asp.value, null); assert.deepEqual(mixed.quantityByUom, { SQFT: 3600, EA: 400 });
  const stale = resolveWorkspace({ ...scope, scenario: 'stale-feed' }); near(stale.overview.sales.value, 24000); assert.equal(stale.overview.sales.state, 'stale'); assert.equal(stale.overview.quantity.state, 'stale'); assert(stale.warnings.length > 0);
});
check('Unknown membership is distinct and closures retain selected stores with explicit fractional exposure.', () => {
  assert.equal(getPairFact('P101', 'S104', { ...scope, scenario: 'unknown-history' })!.matrixState, '?');
  const closed = resolveWorkspace({ ...scope, scenario: 'closed-store' }); assert.equal(closed.stores.length, 4); assert(closed.overview.storeExposureWeeks.value! < 16); assert(closed.warnings.some(w => w.includes('closed')));
});
check('Margin restriction propagates to totals, mix, trend, PLR and raw drill projection.', () => {
  const restricted: Scope = { ...scope, access: 'restricted-margin' }, view = resolveWorkspace(restricted);
  assert.equal(view.overview.gmDollars.value, null); assert.equal(view.overview.gmRate.state, 'restricted'); assert(view.pairs.every(p => p.weeks.every(w => w.recognizedCogs === null)));
  assert(getMixRows(restricted, 'color').every(r => r.gmRate.value === null)); assert(getTrend(restricted, 'gmRate').every(p => p.actual.value === null && p.comparison.value === null)); assert.equal(getPlrReview({ ...plrScope, access: 'restricted-margin' }).gmGapPp.value, null);
});
check('Case counts use distinct case IDs, pairs and products; filtering reconciles the destination.', () => {
  const view = resolveWorkspace(scope); assert.equal(view.overview.openCaseCount, 3); assert.equal(view.overview.impactedPairCount, 3); assert.equal(view.overview.impactedSkuCount, 2);
  const p101 = resolveWorkspace({ ...scope, productIds: ['P101'] }); assert.equal(p101.cases.length, 2); assert.equal(p101.overview.openCaseCount, 2);
  const state = createInitialSession(); state.cases[0].state = 'Resolved'; assert.equal(resolveWorkspace(scope, withSession(demoDataset, state)).overview.openCaseCount, 2);
});
check('Draft validation prevents duplicate commitments, missing evidence, wrong units and excess chase.', () => {
  const state = createInitialSession(), input = { caseId: 'Q01', action: 'Chase existing inbound' as const, pairIds: ['P101:S102'], quantity: 200, uom: 'SQFT' as const, reason: 'Follow existing inbound', owner: 'Merchant', effectiveDate: '2026-04-01', reviewDate: '2026-04-03', evidenceIds: ['PO-200'] };
  const saved = saveDecisionDraft(state, input); assert(saved.ok); assert.equal(state.decisions.length, 0); assert.equal(saved.record!.state, 'Draft'); assert.equal(saved.record!.executionRef, undefined);
  assert(!saveDecisionDraft(saved.state, input).ok); assert(!saveDecisionDraft(state, { ...input, quantity: 201 }).ok); assert(!saveDecisionDraft(state, { ...input, evidenceIds: [] }).ok); assert(!saveDecisionDraft(state, { ...input, uom: 'EA' }).ok);
  const mixed = getScenarioDataset('mixed-uom'); const ea = { ...input, caseId: 'Q03', action: 'Bulk out' as const, pairIds: ['P104:S101'], uom: 'EA' as const, quantity: 10, evidenceIds: ['P104:S101'] }; assert(saveDecisionDraft(state, ea, undefined, mixed).ok); assert(!saveDecisionDraft(state, { ...ea, uom: 'SQFT' }, undefined, mixed).ok);
});
check('Approval is distinct from execution; acknowledgements preserve partial failures and audit history.', () => {
  let state = saveDecisionDraft(createInitialSession(), { caseId: 'Q01', action: 'Keep', pairIds: ['P101:S102', 'P101:S103'], reason: 'Review evidence', owner: 'Merchant', effectiveDate: '2026-04-01', reviewDate: '2026-04-03', evidenceIds: ['P101:S102'] }).state;
  state = advanceDecision(state, 'D001', { type: 'submit' }, { id: 'Merchant' }).state;
  assert(!advanceDecision(state, 'D001', { type: 'approve' }, { id: 'Viewer' }).ok);
  state = advanceDecision(state, 'D001', { type: 'approve' }, { id: 'Approver', canApprove: true }).state; assert.equal(state.decisions[0].state, 'Approved'); assert.equal(state.decisions[0].executionRef, undefined);
  state = advanceDecision(state, 'D001', { type: 'await-execution' }, { id: 'Merchant' }).state;
  assert(!advanceDecision(state, 'D001', { type: 'execution-ack' }, { id: 'Executor', canExecute: true }).ok);
  state = advanceDecision(state, 'D001', { type: 'execution-ack', executionRef: 'DEMO-ACK-001', completedPairIds: ['P101:S102'], failedPairIds: ['P101:S103'] }, { id: 'Executor', canExecute: true }).state;
  assert.equal(state.decisions[0].state, 'Partially executed'); assert.equal(state.decisions[0].failedPairIds.length, 1); assert(state.decisions[0].history.length >= 5);
});
check('ISO note timestamps and reviewed learnings save without rewriting the approved plan.', () => {
  const initial = createInitialSession(), before = JSON.stringify(demoDataset.versions);
  const note = saveObservation(initial, { text: 'Delivery observed', author: 'Merchant', observedOn: '2026-03-29', recordedOn: '2026-03-29T12:00:00Z', itemIds: ['P101'], storeIds: ['S102'], source: 'Demo field note', evidenceClass: 'merchant-observation' }); assert(note.ok); assert.equal(initial.observations.length, 1);
  const learning = saveLearning(note.state, { ...initial.learnings[0], state: 'Accepted', reviewedBy:'Reviewer', conclusion: 'Reviewed with stated limitations.' }); assert(learning.ok); assert.equal(JSON.stringify(demoDataset.versions), before);
  assert.equal(catalogue.length, 87); assert(catalogue.find(m => m.id === 'K63')!.base_definition.includes('Opaque client metric'));
});
check('Breadth totals use distinct membership rather than adding store counts or inventing identity.', () => {
  const rows = getBreadth(scope); assert.deepEqual(rows.map(r => r.ty), [4, 4, 2, 2]); assert.equal(rows.reduce((n, r) => n + r.ty, 0), 12); assert.equal(resolveWorkspace(scope).overview.rangedSkuCount, 4);
});

await writeFile('src/modules/hindsight/redesign/data/control-test-results.json', JSON.stringify({ status: 'passed', checkCount: checks.length, checks, dataVersion: demoDataset.version, illustrativeNotClientData: true }, null, 2));
console.log(JSON.stringify({ status: 'passed', checkCount: checks.length, checks }, null, 2));
