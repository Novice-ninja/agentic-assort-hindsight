import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, IconButton } from '@shared/components';
import { AIStrip } from '@shared/components/primitives/AIStrip/AIStrip';
import { EmptyChartError } from '../../api/getRegularPromoSalesChart';
import { getStoreHexMapChart, type StoreHexMapData, type StoreHexMapEntry } from '../../api/getStoreHexMapChart';
import { usePlanFilterStrip } from '../../hooks';
import { toPlanHierarchyFilters } from '../../services/visualHierarchy';
import { filterStoreRows, sortStoreRows, storeClusterCommentary, type StorePerformanceSortKey as SortKey } from '../../services/storePerformanceTable';
import styles from './StoreHexMapWidget.module.css';

export interface StoreHexMapWidgetProps { planCode?: string; seasonCode?: number | null }
type ChartState = { status: 'idle' | 'loading' | 'empty' | 'failed' } | { status: 'ready'; data: StoreHexMapData };
const currency = (value: number | undefined) => value === undefined ? 'Not connected' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const quantity = (value: number | undefined) => value === undefined ? 'Not connected' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const percent = (value: number | undefined) => value === undefined ? 'Not connected' : `${value.toFixed(1)}%`;

/** Retains the chart endpoint and store identities; C3 replaces only its visual presentation. */
export function StoreHexMapWidget({ planCode, seasonCode }: StoreHexMapWidgetProps) {
  const strip = usePlanFilterStrip(planCode);
  const [chartState, setChartState] = useState<ChartState>({ status: 'idle' });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inFlightRequestKeyRef = useRef<string | null>(null), latestRequestKeyRef = useRef<string | null>(null);
  const stripGroupsRef = useRef(strip.groups); stripGroupsRef.current = strip.groups;
  const filterScopeKey = strip.groups.map(group => `${group.key}:${group.values.map(value => value.id).join(',')}`).join('|');
  const requestChart = useCallback(async () => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined || strip.status !== 'succeeded') return;
    const requestKey = `${planCode}:${seasonCode}:sell_thru_pct:${filterScopeKey}`;
    if (inFlightRequestKeyRef.current === requestKey) return;
    inFlightRequestKeyRef.current = requestKey; latestRequestKeyRef.current = requestKey; setChartState({ status: 'loading' });
    try {
      const next = await getStoreHexMapChart({ planCode, seasonCode, metric: 'sell_thru_pct', hierarchyScope: toPlanHierarchyFilters(stripGroupsRef.current) });
      if (latestRequestKeyRef.current === requestKey) setChartState({ status: 'ready', data: next });
    } catch (error) { if (latestRequestKeyRef.current === requestKey) setChartState({ status: error instanceof EmptyChartError ? 'empty' : 'failed' }); }
    finally { if (inFlightRequestKeyRef.current === requestKey) inFlightRequestKeyRef.current = null; }
  }, [planCode, seasonCode, filterScopeKey, strip.status]);
  useEffect(() => { void requestChart(); }, [requestChart]);
  useEffect(() => { setSelectedId(null); }, [filterScopeKey, planCode, seasonCode]);
  const stores = chartState.status === 'ready' ? chartState.data.stores : [];
  const rows = useMemo(() => sortStoreRows(filterStoreRows(stores, search), sort.key, sort.direction), [stores, search, sort]);
  const selected = stores.find(store => store.storeId === selectedId);
  const insight = useMemo(() => storeClusterCommentary(stores), [stores]);
  const isLoading = chartState.status === 'idle' || chartState.status === 'loading';
  const hasStoreData = chartState.status === 'ready' && stores.length > 0;
  const scopeIsEmpty = chartState.status === 'empty' || (chartState.status === 'ready' && stores.length === 0);
  const sortBy = (key: SortKey) => setSort(current => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
  return <div className={styles.wrapper} data-testid="store-performance-table"><div className={styles.card}>
    <div className={styles.header}><h3 className={styles.title}>Store Performance</h3><span className={styles.scopeLabel}>ST% · synthetic data</span></div>
    {(isLoading || hasStoreData) && <AIStrip iconOnly text={insight} loading={isLoading} showAskButton={false}/>}
    {hasStoreData && <div className={styles.toolbar}><label htmlFor="store-performance-search" className={styles.srOnly}>Search stores or clusters</label><input id="store-performance-search" type="search" placeholder="Search store or cluster" value={search} onChange={event => setSearch(event.target.value)}/><span>{rows.length} of {stores.length} stores</span></div>}
    {!isLoading && rows.length > 0 && <div className={styles.tableRegion} role="region" aria-label="Store performance table" tabIndex={0}><table className={styles.table}><caption className={styles.srOnly}>The same stores as the original map. Sort by store, store ID, cluster or sell-through. Open a store for details.</caption><thead><tr>{([['name', 'Store'], ['storeId', 'Store ID'], ['cluster', 'Cluster'], ['value', 'ST%']] as [SortKey, string][]).map(([key, label]) => <th key={key} scope="col" aria-sort={sort.key === key ? sort.direction === 'asc' ? 'ascending' : 'descending' : undefined}><button type="button" onClick={() => sortBy(key)}>{label}<span aria-hidden="true">{sort.key === key ? sort.direction === 'asc' ? '↑' : '↓' : '↕'}</span></button></th>)}</tr></thead><tbody>{rows.map(store => <tr key={store.storeId}><td><button type="button" className={styles.storeLink} onClick={() => setSelectedId(store.storeId)}>{store.name}<span aria-hidden="true">↗</span></button></td><td>{store.storeId}</td><td><span className={styles.cluster}>Cluster {store.cluster}</span></td><td><span className={[styles.sellThrough, store.value >= 70 ? styles.strong : store.value >= 55 ? styles.moderate : styles.low].join(' ')}>{percent(store.value)}</span></td></tr>)}</tbody></table></div>}
    {isLoading && <div className={styles.placeholder} role="status">Loading store performance…</div>}
    {chartState.status === 'failed' && <div className={styles.placeholder} role="alert"><span>Store performance could not load.</span><Button onClick={() => { inFlightRequestKeyRef.current = null; void requestChart(); }}>Retry</Button></div>}
    {scopeIsEmpty && <div className={styles.placeholder} role="status" data-testid="store-performance-scope-empty">No store data is available for this scope.</div>}
    {hasStoreData && !rows.length && <div className={styles.placeholder} role="status">No stores match “{search}”. <Button onClick={() => setSearch('')}>Clear search</Button></div>}
    {hasStoreData && <div className={styles.footer}><span>Demo shading: <i className={styles.strong}/> ≥70% <i className={styles.moderate}/> 55–&lt;70% <i className={styles.low}/> &lt;55%</span><span>ST% definition TBC</span></div>}
  </div>{selected && <StoreDetails store={selected} onClose={() => setSelectedId(null)}/>}</div>;
}

function StoreDetails({ store, onClose }: { store: StoreHexMapEntry; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null), close = useRef<HTMLButtonElement>(null);
  useEffect(() => { const origin = document.activeElement as HTMLElement | null; close.current?.focus(); return () => origin?.focus(); }, []);
  const kpis = [['Sales', currency(store.sales), 'Synthetic net sales'], ['Sales units', quantity(store.quantity), 'Synthetic units · definition TBC'], ['Gross margin', percent(store.gmRate), 'Synthetic gross margin rate'], ['Inventory cost', currency(store.onHandCost), 'Synthetic stock snapshot'], ['Sellable inventory', quantity(store.sellableQty), 'Synthetic units · definition TBC'], ['Sell-through', percent(store.value), 'ST% definition TBC']];
  return createPortal(<div className={styles.backdrop} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><aside ref={panel} className={styles.sidePanel} role="dialog" aria-modal="true" aria-labelledby="store-detail-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } if (event.key === 'Tab') { const focusable = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]'); if (!focusable?.length) return; const first = focusable[0], last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } }}>
    <div className={styles.panelHeader}><div><p>Store details</p><h2 id="store-detail-title">{store.name}</h2><span>{store.storeId} · Cluster {store.cluster}</span></div><IconButton ref={close} aria-label="Close store details" onClick={onClose}><span aria-hidden="true">×</span></IconButton></div>
    <div className={styles.panelContent}><div className={styles.panelScope}>{store.sourceLabel ?? 'Selected assortment and season'}<span>{store.definitionStatus ?? 'Synthetic · definition TBC'}</span></div><div className={styles.kpiGrid}>{kpis.map(([label, value, helper]) => <div className={styles.kpiCard} key={label}><span>{label}</span><strong>{value}</strong><small>{helper}</small></div>)}</div><h3>Store information</h3><dl className={styles.details}><div><dt>Store ID</dt><dd>{store.storeId}</dd></div><div><dt>Cluster</dt><dd>Cluster {store.cluster}</dd></div><div><dt>Location</dt><dd>{store.name}</dd></div><div><dt>Source</dt><dd>{store.sourceLabel ?? 'Local preview store dataset'}</dd></div></dl><p className={styles.note}>These figures are synthetic for the design walkthrough. ST% is a rate, not a sales change. The definition and shaded bands require F&amp;D confirmation.</p></div><div className={styles.panelFooter}><Button onClick={onClose}>Close details</Button></div>
  </aside></div>, document.body);
}
