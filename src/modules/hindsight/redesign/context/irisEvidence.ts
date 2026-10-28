import { observationMatchesPair } from './observationScope';
import { aggregatePairs, freezeCompCohort, formatMetric, getItemRows, getMixRows, getPlrReview, getStoreRows, selectScopedPairs } from '../data';
import { caseMatchesQueue } from '../views/decisionRules';
import { matchesNumeric, pairMatchesSelection, scopeForSelection } from '../views/tableModel';
import type { TableState } from '../views/viewHelpers';
import type { Dataset, Scope } from '../data';
import type { LocalSelection, WorkspaceContextValue, WorkspaceRoute } from './types';
export interface FrozenContext { scope: Scope; route: WorkspaceRoute; selection: LocalSelection | null; title: string; metricId?: string; signature: string; dataVersion: string; definitionVersion: string; viewState?: Record<string, unknown>; dataset: Dataset }
export function irisViewState(workspace: WorkspaceContextValue): Record<string, unknown> {
  const route = workspace.route;
  const keys = route.view === 'deep-dive' ? ['by-item-table', 'by-item-working-decision-filter', 'by-store-table', 'store-matrix-v2', 'store-breadth-v2', 'mix-table', 'mix-settings', 'deep-dive-custom-base'] : route.view === 'item' ? [`item-stores-lens-${route.id}`] : route.view === 'store' ? [`store-population-${route.id}`] : route.view === 'overview' ? ['overview-cards', 'overview-trend', 'mix-table', 'mix-settings'] : route.view === 'decisions' ? ['decision-queue-filters', 'decision-queue-sort', 'decision-log-filters', 'decision-rule-preview', 'decision-rule-draft'] : [];
  return Object.fromEntries(keys.map(key => [key, workspace.getViewState<unknown>(key, null)]));
}
/** Header entry freezes the same filtered leaf cohort as the active table, across all filtered pages. */
export function irisVisibleSelection(workspace: WorkspaceContextValue): LocalSelection | null {
  const route = workspace.route, base = workspace.localSelection, state = irisViewState(workspace);
  const scope = scopeForSelection(workspace.scope, base), dataset = workspace.dataset;
  const preset = route.preset === 'custom' ? workspace.getViewState('deep-dive-custom-base', 'items') : route.preset;
  if (route.view === 'decisions') {
    const scopedPairs = selectScopedPairs(scope, dataset).filter(pair => pairMatchesSelection(pair, base)), ids = new Set(scopedPairs.map(pair => pair.id));
    if (route.subview === 'log') { const filters = state['decision-log-filters'] as { state:string;search:string } | null; const records = workspace.drafts.filter(record => record.pairIds.some(id => ids.has(id)) && (!filters || (filters.state === 'All' || record.state === filters.state) && `${record.id} ${record.action} ${record.owner} ${record.caseId} ${record.pairIds.join(' ')}`.toLowerCase().includes(filters.search.toLowerCase()))); return { ...base, label:'Filtered decision log', pairIds:[...new Set(records.flatMap(record => record.pairIds).filter(id => ids.has(id)))] }; }
    if (!route.subview || route.subview === 'queue') { const filters = state['decision-queue-filters'] as { queue:string;search:string;priority:string;state:string;owner:string } | null; const records = workspace.cases.filter(record => ids.has(`${record.itemId}:${record.storeId}`) && (!base?.caseIds || base.caseIds.includes(record.id)) && (!filters || caseMatchesQueue(record,filters.queue,scopedPairs.find(pair => pair.id === `${record.itemId}:${record.storeId}`)) && (filters.state === 'All' || filters.state === 'Open cases' ? filters.state === 'All' || record.state !== 'Resolved' : record.state === filters.state) && (filters.priority === 'All' || record.priority === filters.priority) && (filters.owner === 'All' || record.owner === filters.owner) && `${record.id} ${record.title} ${record.itemId} ${record.storeId} ${record.owner} ${record.observation}`.toLowerCase().includes(filters.search.toLowerCase()))); return { ...base, label:'Filtered decision queue', caseIds:records.map(record => record.id) }; }
    return base;
  }
  if (route.view !== 'deep-dive' || !['items', 'stores', 'attributes', 'matrix'].includes(preset ?? '')) return base;
  let pairs = selectScopedPairs(scope, dataset).filter(pair => pairMatchesSelection(pair, base));
  if (preset === 'matrix') {
    const matrix = state['store-matrix-v2'] as { itemSearch:string;storeSearch:string;candidates:boolean } | null;
    if (matrix) pairs = selectScopedPairs({ ...scope, population:matrix.candidates && scope.mode !== 'plr' ? 'all-candidates' : scope.population },dataset).filter(pair => pairMatchesSelection(pair,base) && `${pair.itemId} ${pair.item.name} ${pair.item.brand}`.toLowerCase().includes(matrix.itemSearch.toLowerCase()) && `${pair.storeId} ${pair.store.name} Cluster ${pair.store.cluster}`.toLowerCase().includes(matrix.storeSearch.toLowerCase()));
  } else  if (preset === 'items' || preset === 'stores') {
    const table = state[preset === 'items' ? 'by-item-table' : 'by-store-table'] as TableState | null;
    if (table) {
      const rows = preset === 'items' ? getItemRows(scope, dataset) : getStoreRows(scope, dataset);
      const visible = rows.map(row => { const children = row.pairs.filter(pair => pairMatchesSelection(pair, base)); return { ...row, ...aggregatePairs(children, dataset), pairs: children }; }).filter(row => row.pairs.length > 0);
      const decisionFilter = workspace.getViewState('by-item-working-decision-filter', 'all');
      pairs = visible.filter(row => {
        const raw = row as unknown as Record<string, unknown>, product = raw.product as Record<string, unknown> | undefined, store = raw.store as Record<string, unknown> | undefined;
        const text = `${row.id} ${row.name} ${product?.brand ?? ''} ${product?.subcategory ?? ''} ${store?.region ?? ''} ${store?.district ?? ''} Cluster ${store?.cluster ?? ''}`;
        const working = workspace.drafts.filter(draft => draft.pairIds.some(id => row.pairs.some(pair => pair.id === id)) && !['Cancelled', 'Superseded'].includes(draft.state)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
        return text.toLowerCase().includes(table.search.toLowerCase()) && matchesNumeric(raw, table.filters, table.filterJoin) && (preset !== 'items' || decisionFilter === 'all' || working?.action === decisionFilter || decisionFilter === 'none' && !working);
      }).flatMap(row => row.pairs);
    }
  } else {
    const table = state['mix-table'] as TableState | null, settings = state['mix-settings'] as { lens: string; view: string } | null;
    if (table?.search && settings) { const rows = getMixRows(scope, settings.view === 'gbb' ? 'gbb' : settings.lens, dataset, pairs).filter(row => row.label.toLowerCase().includes(table.search.toLowerCase())); const ids = new Set(rows.flatMap(row => row.itemIds)); pairs = pairs.filter(pair => ids.has(pair.itemId)); }
  }
  return { ...base, label: base?.label ? `${base.label} · current filtered table` : 'Current filtered table · all filtered pages', pairIds: pairs.map(pair => pair.id) };
}
export function evidenceScope(context: FrozenContext): Scope {
  const result: Scope = freezeCompCohort(structuredClone(context.scope), context.dataset), selection = context.selection;
  if (context.route.view === 'deep-dive' && context.route.preset === 'matrix' && context.scope.mode !== 'plr' && (context.viewState?.['store-matrix-v2'] as { candidates?:boolean } | undefined)?.candidates) result.population = 'all-candidates';
  const reviewCase = context.route.view === 'case' ? context.dataset.cases.find(record => record.id === context.route.id) : undefined;
  if (context.route.view === 'case') result.pairIds = reviewCase ? [`${reviewCase.itemId}:${reviewCase.storeId}`].filter(id => !result.pairIds || result.pairIds.includes(id)) : [];
  const restrict = (kind: 'product' | 'store', ids: string[]) => {
    const current = kind === 'product' ? result.productIds : result.storeIds, mode = kind === 'product' ? result.productSelection : result.storeSelection;
    const kept = mode === 'none' || mode === 'selected' && !current.length ? [] : ids.filter(id => !current.length || current.includes(id));
    if (kind === 'product') { result.productIds = kept; result.productSelection = 'selected'; } else { result.storeIds = kept; result.storeSelection = 'selected'; }
  };
  if (context.route.view === 'item' || context.route.view === 'pair') restrict('product', context.route.id ? [context.route.id] : []);
  if (context.route.view === 'store') restrict('store', context.route.id ? [context.route.id] : []);
  if (context.route.view === 'pair') restrict('store', context.route.storeId ? [context.route.storeId] : []);
  if (selection?.pairIds) result.pairIds = selection.pairIds.filter(id => !result.pairIds || result.pairIds.includes(id));
  if (selection?.itemIds) restrict('product', selection.itemIds);
  if (selection?.storeIds) restrict('store', selection.storeIds);
  if (selection?.caseIds) result.pairIds = context.dataset.cases.filter(record => selection.caseIds!.includes(record.id)).map(record => `${record.itemId}:${record.storeId}`).filter(id => !result.pairIds || result.pairIds.includes(id));
  if (selection?.attribute) { if (result.localFilters.attribute && (result.localFilters.attribute.lens !== selection.attribute.lens || result.localFilters.attribute.value !== selection.attribute.value)) result.pairIds = []; else result.localFilters = { ...result.localFilters, attribute: selection.attribute }; }
  if (context.viewState?.[`item-stores-lens-${context.route.id}`] === 'current-range') result.population = 'current-range';
  if (context.viewState?.[`store-population-${context.route.id}`] === 'current-range') result.population = 'current-range';
  if (selection?.weekIds) { result.window = 'CUSTOM'; result.weekIds = selection.weekIds; }
  if (selection?.week) { result.window = 'CUSTOM'; result.weekIds = [selection.week]; }
  return result;
}
export function computedEvidence(context: FrozenContext, question: string): { facts: string[]; hypothesis: string; clarification?: string; evidenceIds: string[] } {
  if (/pwps|293.*294|294.*293/i.test(question)) return { facts: ['S15 / E2: 97,018 ÷ 4 ÷ 294 = 82.4983 quantity PWPS; $593,104.23 ÷ 4 ÷ 293 = $506.0616 sales PWPS.', 'This is a one-row source inference with different observed location fields. H2 / K2 / L2 / N2 / AT2 identify related source aliases; they do not establish a universal DAX formula.'], hypothesis: 'Ask the source owner to confirm qualifying location counts, the complete-week count, unit and denominator before governing PWPS.', evidenceIds: ['S15:E2', 'H2', 'K2', 'L2', 'N2', 'AT2'] };
  if (/compare|versus|vs\b/i.test(question) && context.scope.comparison === 'none') return { facts: [], hypothesis: '', clarification: 'Which comparator should be used: matched LY, previous equal period, or an approved plan? Select it in Filters, then use current context.', evidenceIds: [] };
  const scope = evidenceScope(context), pairs = selectScopedPairs(scope, context.dataset), aggregate = aggregatePairs(pairs, context.dataset);
  if (!pairs.length) return { facts: ['The frozen selection contains no canonical SKU–store pairs. No broader population was substituted.'], hypothesis: '', evidenceIds: [] };
  const facts = [`Frozen selection: ${aggregate.itemCount} distinct SKUs, ${aggregate.storeCount} stores and ${aggregate.pairCount} canonical pairs. Net sales ${formatMetric(aggregate.sales)}; quantity ${formatMetric(aggregate.quantity, { includeUnit: true })}.`, `${aggregate.stockoutPairCount} currently ranged pairs have known zero sellable stock. Store OH cost ${formatMetric(aggregate.ohCost)} at ${scope.stockAsOf}; unallocated DC pools are not immediately available store stock.`];
  if (scope.mode === 'plr') { const review = getPlrReview(scope, context.dataset); facts.push(`Original-cohort actual sales ${formatMetric(review.actualSales)} against original approved plan ${formatMetric(review.originalSalesPlan)}. Later-addition sales ${formatMetric(review.laterAdditionSales)} remain separate. Original approval ${review.originalVersionId} is pinned; selected overlay ${review.selectedVersionId}.`, `${review.onTimePairs} of ${review.duePairs} due original pairs activated on time; ${review.unknownHistoryPairs} have unknown history. Approved buy ${formatMetric(review.approvedBuyQuantity, { includeUnit: true })} and receipts ${formatMetric(review.receivedQuantity, { includeUnit: true })} describe supply, not consumer demand.`); }
  if (/margin|gross|\bgm\b|cogs/i.test(question + ' ' + (context.metricId ?? ''))) facts.push(`Gross margin ${formatMetric(aggregate.gmRate)} is recomputed from summed GM dollars and net sales, never the average of row percentages.`);
  if (/pair[ -]week|ranged[ -](?:pair|sku)/i.test(question)) facts.push(`Ranged-pair velocity uses qualifying ranged quantity ${formatMetric(aggregate.qualifyingQuantity, {includeUnit:true})} divided by ${formatMetric(aggregate.exposureWeeks)} ranged open pair-weeks: ${formatMetric(aggregate.velocity, {includeUnit:true})}. It is not a distinct-store denominator.`);
  if (/store[ -]week/i.test(question)) facts.push(`Store-week productivity uses ${formatMetric(aggregate.storeExposureWeeks)} open store-weeks: sales ${formatMetric(aggregate.salesPerStoreWeek)} and compatible quantity ${formatMetric(aggregate.quantityPerStoreWeek, {includeUnit:true})} per open store-week. It is separate from SKU–store exposure.`);
  if (/denominator/i.test(question) && /gross[ -]margin|\bgm\b/i.test(question)) facts.push(`Gross margin uses ${formatMetric(aggregate.gmDollars)} summed GM dollars divided by ${formatMetric(aggregate.sales)} signed net sales. The ratio is unavailable for a nonpositive sales base; restricted inputs remain restricted.`);
  const linked = context.dataset.observations.filter(note => pairs.some(pair => observationMatchesPair(note, pair)));
  if (linked.length) facts.push(`Field observation (${linked[0].author}, observed ${linked[0].observedOn}; ${linked[0].evidenceClass}): ${linked[0].text} This remains separate from measured facts.`);
  return { facts, hypothesis: aggregate.stockoutPairCount ? 'Availability or receipt timing may qualify realized sales. Inspect dated pair evidence before attributing the shortfall to demand or committing another buy.' : 'Inspect distribution, mix and source completeness before treating an observed change as a causal result.', evidenceIds: pairs.map(pair => pair.id) };
}
