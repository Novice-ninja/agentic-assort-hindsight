import type { Dataset, FiscalWeek, ItemStoreWeek, MetricValue, OriginalPair, Product, RangeEvent, Scenario, Store } from './types';

export const SNAPSHOT_DATE = '2026-03-29';
export const PLR_END_DATE = '2026-02-22';
export const REVIEW_ID = 'PLR-FLOORING-26';
export const DATA_VERSION = 'illustrative-coherent-demo-v1';
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
const productNames = ['Northport White Oak', 'Woodland Reserve Oak', 'Hillside Hickory', 'Seashell Acacia'];
export const controlProducts: Product[] = productNames.map((name, i) => ({
  id: `P10${i + 1}`, name, description: `${name} flooring · illustrative canonical SKU`,
  category: 'Hardwood', subcategory: i === 0 ? 'Water Resistant Engineered' : 'Solid Hardwood',
  brand: ['Westridge', 'Woodland Reserve', 'Hillside', 'Seashell'][i],
  color: ['Natural', 'Gray', 'Honey', null][i], finish: ['Distressed', 'Wire Brushed', 'Smooth', null][i],
  species: ['White Oak', 'White Oak', 'Hickory', 'Acacia'][i],
  gbb: (['Best', 'Better', 'Good', 'Opening Price Point'] as const)[i], uom: 'SQFT',
  lifecycle: i === 3 ? 'Leaving Program' : 'Active', focusGroups: i === 3 ? ['Bulk Out', 'OP'] : i === 0 ? ['NPI'] : [],
  vendor: `Demo vendor ${i + 1}`, provenance: 'illustrative-demo',
}));
export const controlStores: Store[] = ['North', 'East', 'South', 'West'].map((name, i) => ({
  id: `S10${i + 1}`, name, region: i < 2 ? 'Eastern Region' : 'Western Region',
  district: `District ${i < 2 ? 1 : 2}`, market: `${name} Market`, cluster: i % 2 === 0 ? 'Cluster 1' : 'Cluster 2',
  openedOn: '2018-01-01', channel: 'Store',
}));
const products = controlProducts;
const stores = controlStores;
const datePlus = (date: string, days: number) => new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const weeks: FiscalWeek[] = [2025, 2026].flatMap((year) => Array.from({ length: 13 }, (_, i) => ({
  id: `FY${year}-W${String(i + 1).padStart(2, '0')}`,
  start: datePlus(year === 2026 ? '2025-12-29' : '2024-12-30', i * 7),
  end: datePlus(year === 2026 ? '2025-12-29' : '2024-12-30', i * 7 + 6),
  fiscalMonth: `FY${year}-M${String(Math.min(3, Math.floor(i / 4) + 1)).padStart(2, '0')}`,
  lyWeekId: `FY${year - 1}-W${String(i + 1).padStart(2, '0')}`, complete: true,
})));
export const R4_WEEKS = weeks.filter(w => w.id.startsWith('FY2026') && Number(w.id.slice(-2)) >= 10).map(w => w.id);
export const PLR_WEEKS = weeks.filter(w => w.id.startsWith('FY2026') && Number(w.id.slice(-2)) <= 8).map(w => w.id);
// Cells not fixed in the specification are explicitly derived demo allocations.
const salesGrid = [[3600, 1800, 1800, 0], [2400, 2400, 2400, 2400], [600, 1200, 600, 2400], [600, 600, 0, 1200]];
const lyGrid = [[4200, 2400, 2400, 0], [2100, 2700, 2400, 2400], [600, 1200, 600, 2400], [600, 600, 600, 1200]];
const ohCostGrid = [[1000, 0, 2000, 0], [1000, 1500, 1000, 1500], [1000, 1000, 2000, 0], [1000, 500, 0, 2500]];
const isRanged = (i: number, j: number) => !((i === 0 && j >= 2) || (i === 1 && j === 3) || (i === 3 && j === 2));
const lyRanged = (i: number, j: number) => !((i === 0 && j === 3) || (i === 1 && j === 2) || (i === 3 && (j === 1 || j === 2)));
const pairList = products.flatMap((item, i) => stores.map((store, j) => ({ item, store, i, j })));
const originalPairs: OriginalPair[] = pairList.filter(p => p.i < 3).map(({ item, store }) => ({
  itemId: item.id, storeId: store.id, targetLaunch: '2025-12-29', historyKnown: true,
  approvedColor: item.color, approvedGbb: item.gbb,
}));
function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const values = weights.map(w => Math.floor(total * w / sum));
  let remaining = total - values.reduce((a, b) => a + b, 0);
  for (let i = 0; remaining > 0; i = (i + 1) % values.length) if (weights[i] > 0) { values[i] += 1; remaining -= 1; }
  return values;
}
const originalWeights = pairList.filter(p => p.i < 3).map(p => salesGrid[p.i][p.j]);
const actualPlrQty = allocate(8000, originalWeights);
const demandPlanQty = allocate(10000, originalWeights.map(w => w || 1000));
const approvedPairBuys = allocate(12000, demandPlanQty);
const plannedEndQty = allocate(2000, demandPlanQty);
const openingQty = allocate(2000, originalWeights);
const receiptsQty = allocate(10000, originalWeights);
const endQty = openingQty.map((q, i) => q + receiptsQty[i] - actualPlrQty[i]);
const rangeEvents: RangeEvent[] = [];
for (const { item, store, i, j } of pairList) {
  const id = `${item.id}:${store.id}`;
  rangeEvents.push({ id: `${id}:ly`, itemId: item.id, storeId: store.id, effectiveOn: '2024-12-01', range: lyRanged(i, j) ? 'ranged' : 'never-ranged', eligibility: 'eligible', kind: 'history', source: 'Illustrative range history', note: 'Explicit historical membership, not inferred from sales.' });
  const never = i === 0 && j === 3;
  const late = i === 1 && j === 3;
  rangeEvents.push({ id: `${id}:launch`, itemId: item.id, storeId: store.id,
    effectiveOn: late ? '2026-01-12' : i === 3 ? '2026-01-19' : '2025-12-29',
    range: never || (i === 3 && j === 2) ? 'never-ranged' : 'ranged', eligibility: never ? 'ineligible' : 'eligible',
    kind: never || (i === 3 && j === 2) ? 'eligibility' : 'activation', source: 'Illustrative range execution feed',
    note: late ? 'Activated after the original target launch.' : never ? 'Original approved pair never activated.' : 'Dated activation record.' });
  if (i === 0 && j === 2) rangeEvents.push({ id: `${id}:exit`, itemId: item.id, storeId: store.id, effectiveOn: '2026-02-02', range: 'exited', eligibility: 'ineligible', kind: 'exit', source: 'Illustrative range change', note: 'Week-6 exit; original approved cohort stays unchanged.' });
  if (i === 1 && j === 3) rangeEvents.push({ id: `${id}:unrange`, itemId: item.id, storeId: store.id, effectiveOn: '2026-03-01', range: 'not-ranged', eligibility: 'eligible', kind: 'eligibility', source: 'Illustrative range change', note: 'Eligible but not currently ranged; stock and transactions remain exposed.' });
}
const facts: ItemStoreWeek[] = [];
for (const { item, store, i, j } of pairList) for (const week of weeks) {
  const year = Number(week.id.slice(2, 6));
  const n = Number(week.id.slice(-2));
  let sales = 0, quantity = 0, gmRate = [0.3, 0.35, 0.3, 0.3][i];
  if (year === 2026 && n >= 10) { sales = salesGrid[i][j] / 4; quantity = sales / 6; }
  if (year === 2025 && n >= 10) { sales = lyGrid[i][j] / 4; quantity = sales / 6; }
  if (year === 2026 && n <= 8 && i < 3) { quantity = actualPlrQty[i * 4 + j] / 8; sales = quantity * 6; gmRate = 0.32; }
  if (year === 2026 && n >= 4 && n <= 8 && i === 3 && j !== 2) { sales = [2700, 1500, 0, 1800][j] / 5; quantity = sales / 6; gmRate = 0.3; }
  facts.push({ itemId: item.id, storeId: store.id, weekId: week.id, netSales: sales, netQuantity: quantity,
    recognizedCogs: sales * (1 - gmRate), uom: 'SQFT', transactionCount: sales === 0 ? 0 : 1,
    rangedOpenDays: year === 2026 && n >= 10 ? (isRanged(i, j) ? 7 : 0) : year === 2025 ? (lyRanged(i, j) ? 7 : 0) : (i < 3 && !(i === 0 && j === 3) ? 7 : 0),
    quality: 'complete', sourceVersion: DATA_VERSION });
}
const inventory = pairList.map(({ item, store, i, j }) => ({ itemId: item.id, storeId: store.id, asOf: SNAPSHOT_DATE,
  physical: ohCostGrid[i][j] / 4, sellable: ohCostGrid[i][j] / 4, cost: ohCostGrid[i][j], uom: item.uom,
  quality: 'complete' as const, refreshedAt: '2026-03-30T06:00:00Z' }));
originalPairs.forEach((pair, i) => inventory.push({ ...pair, asOf: PLR_END_DATE, physical: endQty[i], sellable: endQty[i], cost: endQty[i] * 4, uom: 'SQFT', quality: 'complete', refreshedAt: '2026-02-23T06:00:00Z' }));
const m = (value: number, unit: string): MetricValue => ({ value, unit, state: 'ok' });
export const controlDataset: Dataset = deepFreeze({
  id: 'hindsight-proposed-demo', version: DATA_VERSION, label: 'Illustrative design-session dataset · not client facts',
  products, stores, weeks, facts, inventory, rangeEvents,
  supply: [
    ...originalPairs.flatMap((pair, i) => [
      { id: `opening-${i}`, ...pair, kind: 'opening' as const, quantity: openingQty[i], uom: 'SQFT' as const, date: '2025-12-29', status: 'Recorded', sourceRef: `DEMO-OPEN-${i}`, reviewId: REVIEW_ID },
      { id: `receipt-${i}`, ...pair, kind: 'receipt' as const, quantity: receiptsQty[i], uom: 'SQFT' as const, date: '2026-01-05', status: 'Received', sourceRef: `DEMO-RECEIPT-${i}`, reviewId: REVIEW_ID },
    ]),
    { id: 'PLR-OPEN-2000', itemId: 'P102', storeId: 'S102', kind: 'open-order', quantity: 2000, uom: 'SQFT', date: '2026-01-01', eta: '2026-02-23', status: 'Open · not due in review', sourceRef: 'DEMO-PLR-PO', reviewId: REVIEW_ID },
    { id: 'PO-200', itemId: 'P101', storeId: 'S102', dcId: 'DC01', kind: 'open-order', quantity: 200, uom: 'SQFT', date: SNAPSHOT_DATE, eta: '2026-04-02', allocated: 200, status: 'Open · allocated', sourceRef: 'DEMO-PO-200' },
    { id: 'DC-P101-900', itemId: 'P101', dcId: 'DC01', kind: 'dc-pool', quantity: 900, uom: 'SQFT', date: SNAPSHOT_DATE, allocated: 200, status: 'Shared pool · counted once', sourceRef: 'DEMO-DC-900' },
  ],
  versions: (['v1', 'v2'] as const).map(id => ({ reviewId: REVIEW_ID, id, name: id === 'v1' ? 'Original approved v1' : 'Approved revision v2', approvedOn: id === 'v1' ? '2025-12-15' : '2026-01-26', original: id === 'v1',
    weekIds: PLR_WEEKS, pairs: originalPairs,
    phasedPlan: originalPairs.flatMap((pair, i) => PLR_WEEKS.map(weekId => ({ itemId: pair.itemId, storeId: pair.storeId, weekId, sales: demandPlanQty[i] * (id === 'v1' ? 5 : 4.6) / 8, demandQuantity: demandPlanQty[i] / 8, gmDollars: demandPlanQty[i] * (id === 'v1' ? 5 : 4.6) * 0.3 / 8 }))),
    approvedBuyQuantity: 12000, approvedBuyCost: 48000, plannedEopQuantity: 2000, plannedEopCost: 8000,
    pairPlans: originalPairs.map((pair, i) => ({ itemId: pair.itemId, storeId: pair.storeId, approvedBuyQuantity: approvedPairBuys[i], endingQuantity: plannedEndQty[i], endingCost: plannedEndQty[i] * 4 })) })),
  cases: [
    { id: 'Q01', title: 'P101 out of stock at East', itemId: 'P101', storeId: 'S102', priority: 'Critical', queue: 'Shortages', state: 'Open', owner: 'Category merchant', reviewDate: '2026-04-03', ruleId: 'ranged-zero-sellable', ruleVersion: '1.0', metric: 'K06', actual: m(0, 'SQFT'), threshold: 'Ranged and sellable OH = 0', observation: 'R4 sales $1,800 vs $2,400 LY; sellable OH is zero. Existing inbound is 200 sq ft.', hypothesis: 'Availability may constrain sales; no lost-sales estimate is established.', evidenceIds: ['P101:S102', 'PO-200', 'DC-P101-900'] },
    { id: 'Q02', title: 'P101 exited stock at South', itemId: 'P101', storeId: 'S103', priority: 'High', queue: 'Lifecycle/exit', state: 'Open', owner: 'Inventory merchant', reviewDate: '2026-04-06', ruleId: 'exit-stock', ruleVersion: '1.0', metric: 'K56', actual: m(2000, 'USD'), threshold: 'Exited with OH cost > 0', observation: 'Exited pair retains $2,000 inventory cost.', hypothesis: 'Review transfer or bulk-out options before committing a disposition.', evidenceIds: ['P101:S103'] },
    { id: 'Q03', title: 'P104 needs lifecycle review', itemId: 'P104', storeId: 'S101', priority: 'Watch', queue: 'Coverage/excess', state: 'Open', owner: 'Category merchant', reviewDate: '2026-04-07', ruleId: 'lifecycle-stock', ruleVersion: '1.0', metric: 'K14', actual: m(10, 'weeks'), threshold: 'Leaving Program and stock exposure', observation: 'A ranged Leaving Program pair has positive stock.', hypothesis: 'Review coverage, saleability and exit timing; no Drop has been approved.', evidenceIds: ['P104:S101'] },
  ],
  observations: [{ id: 'O01', text: 'East associate reported a delayed replenishment delivery.', author: 'Demo field merchant', observedOn: '2026-03-27', recordedOn: SNAPSHOT_DATE, itemIds: ['P101'], storeIds: ['S102'], source: 'Illustrative field note · no client attachment', evidenceClass: 'merchant-observation' }],
  learnings: [{ id: 'L01', reviewId: REVIEW_ID, version: 'v1', question: 'Was original depth supported by launch and supply execution?', evidenceIds: ['P101:S103', 'PLR-OPEN-2000'], hypothesis: 'Launch timing and later exits qualify observed demand realization.', conclusion: '', owner: 'Category lead', confidence: 'Pending review', pairIds: ['P101:S103'], nextReviewId: 'PLR-FLOORING-27', state: 'Pending' }],
  feeds: { sales: 'complete', inventory: 'complete', range: 'complete', refreshedAt: '2026-03-30T06:00:00Z' },
});

export function getControlScenarioDataset(scenario: Scenario = 'baseline'): Dataset {
  if (scenario === 'baseline') return controlDataset;
  const data: Dataset = structuredClone(controlDataset);
  data.id += `:${scenario}`;
  data.label += ` · scenario: ${scenario}`;
  if (scenario === 'unknown-history') {
    data.versions.forEach(v => { const pair = v.pairs.find(p => p.itemId === 'P101' && p.storeId === 'S104'); if (pair) pair.historyKnown = false; });
    data.rangeEvents.push({ id: 'unknown-P101-S104', itemId: 'P101', storeId: 'S104', effectiveOn: '2025-01-01', range: 'unknown', eligibility: 'unknown', kind: 'history', source: 'Missing membership feed', note: 'History unavailable; not a failed launch.' });
    data.rangeEvents = data.rangeEvents.filter(e => !(e.itemId === 'P101' && e.storeId === 'S104' && e.id !== 'unknown-P101-S104'));
  }
  if (scenario === 'negative-stock') { const row = data.inventory.find(i => i.itemId === 'P101' && i.storeId === 'S102' && i.asOf === SNAPSHOT_DATE)!; row.physical = -5; row.sellable = -5; row.cost = -20; }
  if (scenario === 'missing-inventory') { data.inventory = data.inventory.filter(i => !(i.itemId === 'P101' && i.storeId === 'S102')); data.feeds.inventory = 'missing'; }
  if (scenario === 'stale-feed') { data.feeds.sales = 'stale'; data.facts.filter(f => R4_WEEKS.includes(f.weekId)).forEach(f => { f.quality = 'stale'; }); }
  if (scenario === 'mixed-uom') { data.products.find(p => p.id === 'P104')!.uom = 'EA'; data.facts.filter(f => f.itemId === 'P104').forEach(f => { f.uom = 'EA'; }); data.inventory.filter(i => i.itemId === 'P104').forEach(i => { i.uom = 'EA'; }); }
  if (scenario === 'zero-base' || scenario === 'negative-base') data.facts.filter(f => f.itemId === 'P101' && f.storeId === 'S102' && f.weekId.startsWith('FY2025')).forEach(f => { f.netSales = scenario === 'zero-base' ? 0 : -100; f.netQuantity = scenario === 'zero-base' ? 0 : -10; f.recognizedCogs = scenario === 'zero-base' ? 0 : -80; f.transactionCount = 1; });
  if (scenario === 'zero-sales') data.facts.filter(f => f.itemId === 'P103' && f.storeId === 'S103' && R4_WEEKS.includes(f.weekId)).forEach(f => { f.netSales = 0; f.netQuantity = 0; f.recognizedCogs = 0; f.transactionCount = 0; });
  if (scenario === 'closed-store') {
    data.stores.find(s => s.id === 'S104')!.closedOn = '2026-03-15';
    data.facts.filter(f => f.storeId === 'S104' && R4_WEEKS.includes(f.weekId)).forEach(f => {
      const week = data.weeks.find(w => w.id === f.weekId)!;
      if (f.rangedOpenDays > 0) f.rangedOpenDays = Array.from({ length: 7 }, (_, i) => datePlus(week.start, i)).filter(day => day < '2026-03-15').length;
    });
  }
  if (scenario === 'missing-plan') data.versions = [];
  return deepFreeze(data);
}
