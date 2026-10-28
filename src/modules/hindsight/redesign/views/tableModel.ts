import { freezeCompCohort, type Dataset } from '../data';
import type { MetricValue, PairFact } from '../data/types';
import type { NumericFilter, Sort } from './viewHelpers';
import type { LocalSelection } from '../context/types';

export function numericValue(row: Record<string, unknown>, field: string): number | null {
  const value = row[field === 'cases' ? 'openCaseCount' : field];
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value && typeof value === 'object' && 'value' in value) {
    const metric = value as MetricValue;
    return metric.value !== null && Number.isFinite(metric.value) && !['restricted', 'missing', 'unknown', 'not-applicable'].includes(metric.state) ? metric.value : null;
  }
  return null;
}
export function filterError(filter: NumericFilter): string | null {
  if (['missing', 'no-positive-base', 'negative-base'].includes(filter.operator)) return null;
  if (!filter.value.trim() && !(filter.valueTo ?? '').trim()) return null;
  if (!filter.value.trim() || !Number.isFinite(Number(filter.value))) return 'Enter a valid number.';
  if (filter.operator === 'between' && (!(filter.valueTo ?? '').trim() || !Number.isFinite(Number(filter.valueTo)))) return 'Between requires two valid bounds.';
  if (filter.operator === 'between' && Number(filter.value) > Number(filter.valueTo)) return 'Lower bound must not exceed upper bound.';
  return null;
}
export function matchesNumeric(row: Record<string, unknown>, filters: NumericFilter[], join: 'and' | 'or'): boolean {
  const active = filters.filter(filter => ['missing', 'no-positive-base', 'negative-base'].includes(filter.operator) || filter.value.trim() !== '' || (filter.valueTo ?? '').trim() !== '');
  if (!active.length) return true;
  const results = active.map(filter => {
    if (filterError(filter)) return false;
    const field = filter.field === 'cases' ? 'openCaseCount' : filter.field, raw = row[field];
    const metric = raw && typeof raw === 'object' && 'state' in raw ? raw as MetricValue : undefined;
    if (filter.operator === 'missing') return metric?.state === 'missing' || metric?.state === 'unknown' || raw === undefined || raw === null;
    if (filter.operator === 'no-positive-base' || filter.operator === 'negative-base') return metric?.state === filter.operator;
    const n = numericValue(row, filter.field), target = Number(filter.value);
    return n !== null && (filter.operator === 'gte' ? n >= target : filter.operator === 'lte' ? n <= target : filter.operator === 'gt' ? n > target : filter.operator === 'lt' ? n < target : filter.operator === 'between' ? n >= target && n <= Number(filter.valueTo) : n === target);
  });
  return join === 'and' ? results.every(Boolean) : results.some(Boolean);
}
export function stableSort<Row extends { id: string }>(rows: Row[], sort: Sort, getValue: (row: Row, key: string) => string | number | null): Row[] {
  return [...rows].sort((a, b) => {
    const av = getValue(a, sort.key), bv = getValue(b, sort.key);
    if (av === null && bv !== null) return 1;
    if (bv === null && av !== null) return -1;
    const result = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
    return (sort.direction === 'asc' ? result : -result) || a.id.localeCompare(b.id);
  });
}
/** A present empty drill is NONE. It never falls back to the complete population. */
export function pairMatchesSelection(pair: PairFact, selection: LocalSelection | null | undefined): boolean {
  return !selection || ((!selection.itemIds || selection.itemIds.includes(pair.itemId)) && (!selection.storeIds || selection.storeIds.includes(pair.storeId)) && (!selection.pairIds || selection.pairIds.includes(pair.id)) && (!selection.attribute || String((pair.item as unknown as Record<string, unknown>)[selection.attribute.lens] ?? 'Unknown') === selection.attribute.value));
}
export function paginate<T>(rows: readonly T[], page: number, pageSize: number) {
  const pages = Math.max(1, Math.ceil(rows.length / pageSize)), current = Math.min(Math.max(0, page), pages - 1);
  return { rows: rows.slice(current * pageSize, (current + 1) * pageSize), page: current, pages, start: rows.length ? current * pageSize + 1 : 0, end: Math.min(rows.length, (current + 1) * pageSize), total: rows.length };
}
/** Local interval is an analysis cut. It does not rewrite the applied PLR approval. */
export function scopeForSelection(scope: import('../data/types').Scope, selection: LocalSelection | null | undefined, dataset?:Dataset): import('../data/types').Scope {
  scope=freezeCompCohort(scope,dataset);
  if (!selection?.weekIds) return scope;
  return { ...scope, weekIds:[...selection.weekIds], ...(selection.weekIds.length ? {} : { pairIds:[] }) };
}

export function aggregateExportRows<Row extends {id:string;name:string;openCaseCount:number}>(rows:Row[],keys:string[]):Record<string,unknown>[] {
  return rows.map(row=>{const raw=row as unknown as Record<string,unknown>,product=raw.product as Record<string,unknown>|undefined,store=raw.store as Record<string,unknown>|undefined;return Object.fromEntries([['id',row.id],['name',row.name],...keys.filter(key=>!['item','store','actions'].includes(key)).map(key=>[key,key.startsWith('source-')?'Definition pending; source label retained':key==='focus'?product?.focusGroups??[]:key==='cases'?row.openCaseCount:raw[key]??product?.[key]??store?.[key]??null])]);});
}

/** Legacy subview URLs resolve to the same preset without a duplicate navigation row. */
export function storePresentation(route: import('../context/types').WorkspaceRoute) {
  const tab=route.subview==='matrix'||route.subview==='breadth'?route.subview:route.preset==='matrix'?'matrix':route.preset==='breadth'?'breadth':route.subview==='map'?'map':'performance';
  return {tab,title:tab==='matrix'?'Item × Store matrix':tab==='breadth'?'Breadth TY / LY':tab==='map'?'Store network and clusters':'By Store',showStoreSwitch:(route.preset==='stores'||route.view==='stores')&&(tab==='performance'||tab==='map'),exportStoreTable:tab==='performance'} as const;
}
