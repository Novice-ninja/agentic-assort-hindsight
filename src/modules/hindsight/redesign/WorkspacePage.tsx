import { useEffect, useRef, useState } from 'react';
import { useSetBreadcrumbAction, useSetBreadcrumbs } from '@app/layouts';
import { Modal } from '@shared/components/primitives';
import { useToast } from '@shared/components/primitives/Toast';
import { HindsightFilterStrip } from '../components/HindsightFilterStrip';
import type { FilterStripGroup } from '../types/filterStrip';
import { ButtonGroup, ImpactTabs } from '@shared/components/vendor/impact-ui';
import { metricCatalogue, metricDefinitions, getCompPolicyResult, selectedMasters, selectedWeekIds, selectScopedPairs } from './data';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { ReportStateProvider } from './context/ReportStateContext';
import type { DeepDivePreset, WorkspaceView } from './context/types';
import { GlobalFilterDrawer } from './components/GlobalFilterDrawer';
import { IrisWorkspace } from './components/IrisWorkspace';
import { Button, DesignPopover, Pill } from './components/ui';
import { exportRows, pairExportRows } from './helpers/exportWorkbook';
import { OverviewView } from './views/OverviewView';
import { ByItemView } from './views/ByItemView';
import { ByStoreView } from './views/ByStoreView';
import { MixView } from './views/MixView';
import { DecisionsView } from './views/DecisionsView';
import { ItemDetailView } from './views/ItemDetailView';
import { StoreDetailView } from './views/StoreDetailView';
import { PairDetailView } from './views/PairDetailView';
import { CaseDetailView } from './views/CaseDetailView';
import { ConfigurationDialog } from './views/ConfigurationDialog';
import styles from './components/workspace.module.css';

const TABS: { value: WorkspaceView; label: string }[] = [{ value: 'overview', label: 'Overview' }, { value: 'deep-dive', label: 'Deep Dive' }, { value: 'decisions', label: 'Decisions' }];
const PRESETS: { value: DeepDivePreset; label: string }[] = [{ value: 'items', label: 'By Item' }, { value: 'stores', label: 'By Store' }, { value: 'matrix', label: 'Item × Store' }, { value: 'breadth', label: 'Breadth' }, { value: 'attributes', label: 'Attributes' }, { value: 'custom', label: 'Custom' }];
const POPULATIONS: Record<string,string> = { exposure: 'Assortment + inventory and sales exposure', 'current-range': 'Current range only', 'all-candidates': 'All candidate combinations', original: 'Original approved SKU–store cohort' };
const COMPARISONS: Record<string,string> = { ly: 'Matched LY fiscal weeks', original: 'Original approved v1', revision: 'Revision v2 · named overlay', previous: 'Previous equal period', none: 'No comparison' };
function WorkspaceFrame() {
  const workspace = useWorkspace();
  const { route, scope, dataset, mode, navigate, back, activePanel, setActivePanel, getViewState, localSelection, setLocalSelection } = workspace;
  const { showToast } = useToast(); const announcedNotices = useRef(new Set<string>());
  useEffect(() => { for (const notice of workspace.notices) { if (notice.id === 'storage-unavailable' || announcedNotices.current.has(notice.id)) continue; announcedNotices.current.add(notice.id); showToast({message:notice.message,variant:notice.tone==='danger'?'error':notice.tone==='warning'?'warning':notice.tone==='neutral'?'info':'success',autoHideDuration:notice.tone==='success'?2000:4000,position:'top-right'}); } }, [workspace.notices, showToast]);
  const [menu, setMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const setBreadcrumbAction = useSetBreadcrumbAction();
  const current = useRef(workspace); current.current = workspace;
  useEffect(() => { document.documentElement.dataset.hindsightRedesign = 'true'; return () => { delete document.documentElement.dataset.hindsightRedesign; }; }, []);
  const primary: WorkspaceView = ['item', 'store', 'pair', 'items', 'stores', 'deep-dive'].includes(route.view) ? 'deep-dive' : route.view === 'case' ? 'decisions' : 'overview' === route.view || route.view === 'mix' ? 'overview' : route.view;
  const detail = ['item','store','pair','case'].includes(route.view);
  const product = dataset.products.find(item => item.id === route.id);
  const store = dataset.stores.find(item => item.id === (route.view === 'pair' ? route.storeId : route.id));
  const detailLabel = route.view === 'item' ? `${product?.name ?? route.id}` : route.view === 'store' ? `${store?.id ?? route.id} ${store?.name ?? ''}` : route.view === 'pair' ? `${route.id} × ${route.storeId}` : route.view === 'case' ? route.id : '';
  useSetBreadcrumbs([{ type: 'home', label: 'Home', onClick: () => navigate({ view: 'overview' }) }, { type: 'hindsight', label: 'Hindsight', onClick: detail ? () => navigate({ view: primary }) : undefined }, ...(detail ? [{ type: 'workspace-detail', label: detailLabel ?? '' }] : [])]);
  const weekIds = selectedWeekIds(scope, dataset); const weeks = dataset.weeks.filter(week => weekIds.includes(week.id));
  const salesWindow = `${scope.weekIds?.length ? `${scope.weekIds.length} complete weeks` : scope.window} · ${weeks[0]?.start ?? 'Unavailable'} – ${weeks.at(-1)?.end ?? 'Unavailable'}`;
  const masters = selectedMasters(scope, dataset), comp = getCompPolicyResult(scope, dataset);
  const review = dataset.reviews?.find(review => review.id === scope.reviewId);
  const original = dataset.versions.find(version => version.reviewId === scope.reviewId && version.original);
  const tagValues = (labels: string[]) => [...new Set(labels)].map(label => ({ id: label, label }));
  const filterGroups: FilterStripGroup[] = [
    { key: 'division', label: 'Division', mandatory: true, values: tagValues(['Flooring']) },
    { key: 'categories', label: 'Category', mandatory: true, values: tagValues(masters.products.length ? masters.products.map(item => item.category) : ['None']) },
    { key: 'products', label: 'Products', mandatory: false, values: tagValues(scope.productIds.length ? masters.products.map(item => item.name) : [`${masters.products.length} styles`]) },
    { key: 'stores', label: 'Stores', mandatory: false, values: tagValues(scope.storeIds.length ? masters.stores.map(store => store.name) : [`${masters.stores.length} stores`]) },
    { key: 'period', label: mode === 'plr' ? 'Review' : 'Period', mandatory: true, values: tagValues([mode === 'plr' ? `${review?.name ?? 'Approved PLR'} · through ${weeks.at(-1)?.end ?? 'unavailable'}` : salesWindow]) },
    { key: 'population', label: 'Population', mandatory: false, values: tagValues([POPULATIONS[scope.population]]) },
    ...(scope.compPolicyId ? [{key:'comp-policy',label:'Location policy',mandatory:false,values:tagValues([`Demo Comp · ${comp.cohortStoreIds.length} included stores · ${comp.policy?.version ?? 'unavailable'}`])}] : []),
    ...Object.entries(scope.productFacets ?? {}).filter(([key]) => key !== 'categories').map(([key,labels]) => ({ key, label: ({ subcategories:'Subcategory', brands:'Brand', colors:'Color', finishes:'Finish', species:'Species', gbb:'Good / Better / Best', lifecycles:'Lifecycle', focusGroups:'Focus group', vendors:'Vendor' } as Record<string,string>)[key] ?? key, mandatory:false, values:tagValues(labels?.length ? labels : ['None']) })),
    ...Object.entries(scope.locationFacets ?? {}).map(([key,labels]) => ({ key, label: ({regions:'Region',districts:'District',clusters:'Cluster',markets:'Market'} as Record<string,string>)[key] ?? key, mandatory:false, values:tagValues(labels?.length ? labels : ['None']) })),
  ];
  const customBase = getViewState<'items' | 'stores' | 'attributes'>('deep-dive-custom-base', 'items');
  const definitionId = getViewState<string>('__definition', 'K01');
  const definition = (metricCatalogue as any[]).find(metric => metric.id === definitionId) ?? (metricCatalogue as any[]).find(metric => metric.id === ({sales:'K01',quantity:'K02',gmRate:'K04',ohCost:'K56',wos:'K14'} as Record<string,string>)[definitionId]);
  const fallbackDefinition = metricDefinitions.find(metric => metric.id === definitionId);
  const renderView = () => {
    switch (route.view) {
      case 'deep-dive': return route.preset === 'attributes' || route.preset === 'custom' && customBase === 'attributes' ? <MixView /> : ['stores', 'matrix', 'breadth'].includes(route.preset ?? '') || route.preset === 'custom' && customBase === 'stores' ? <ByStoreView /> : <ByItemView />;
      case 'items': return <ByItemView />; case 'stores': return <ByStoreView />; case 'mix': return <MixView />;
      case 'decisions': return <DecisionsView />; case 'item': return <ItemDetailView />; case 'store': return <StoreDetailView />;
      case 'pair': return <PairDetailView />; case 'case': return <CaseDetailView />; default: return route.subview === 'sales-mix' ? <MixView /> : <OverviewView />;
    }
  };
  useEffect(() => { if (!menu) return; const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [menu]);
  useEffect(() => { setBreadcrumbAction(<div className={styles.breadcrumbControls}><ButtonGroup aria-label="Review mode" options={[{value:'plr',label:'PLR Review'},{value:'in-season',label:'In-season Review'}]} selectedOption={mode} onChange={(_event,value) => { if(value === 'plr' || value === 'in-season') current.current.setMode(value); }} /><div className={styles.pageMenu}><Button aria-label="Hindsight page options" aria-expanded={menu} onClick={event => { setMenuAnchor(event.currentTarget); setMenu(value => !value); }}>•••</Button><DesignPopover open={menu} anchorEl={menuAnchor} title="Hindsight" onClose={() => setMenu(false)}><div className={styles.pageOptions}><Button variant="ghost" onClick={() => { setMenu(false); current.current.explainView({ title: detail ? `${detailLabel} evidence` : `${primary} workspace`, selection: undefined }); }}>Explain this view</Button><Button variant="ghost" onClick={() => { setMenu(false); setActivePanel('saved'); }}>Saved views</Button><Button variant="ghost" onClick={() => { setMenu(false); setActivePanel('customize'); }}>Customize</Button><Button variant="ghost" onClick={() => { setMenu(false); const {scope,dataset}=current.current; const pairs = selectScopedPairs(scope,dataset); exportRows('Applied scope pair evidence',pairExportRows(pairs),scope,{dataset,contributingPairs:pairs}); current.current.addNotice('Export contains applied-scope pair facts, definitions and dates. View toolbars export their locally filtered rows.'); }}>Export applied scope</Button><a href="/assort/hindsight/legacy">Open preserved three-tab preview</a><Button variant="ghost" onClick={() => { setMenu(false); current.current.resetDemo(); }}>Reset local design session</Button></div></DesignPopover></div></div>); return () => setBreadcrumbAction(null); }, [setBreadcrumbAction, mode, menu, menuAnchor, detail, detailLabel, primary, setActivePanel]);
  return <div className={styles.page} data-testid="hindsight-redesign">
    <div className={styles.filtersStrip}><HindsightFilterStrip groups={filterGroups} status="succeeded" planSeasonName={scope.seasonId ?? review?.seasonId ?? 'SS26'} onAllFiltersClick={() => setActivePanel('filters')} /><div className={styles.contextLine}><span>Stock {scope.stockAsOf}</span><span>Range {scope.rangeAsOf}</span><span>Compare: {COMPARISONS[scope.comparison]}</span>{mode === 'plr' && <span>{original?.name ?? 'Original approval not connected'}</span>}<span>Refreshed {dataset.feeds.refreshedAt.slice(0,10)}</span><span>{scope.uom === 'SELLING_UNIT_TBC' ? 'Selling units · definition TBC' : scope.uom === 'mixed' ? 'Separate unit subtotals' : scope.uom === 'SQFT' ? 'Square feet' : 'Each'}</span><span>Demo data · definitions TBC</span>{scope.access !== 'full' && <span>Margin restricted</span>}</div>{localSelection && <div className={styles.localChip}><span>Selected: {localSelection.label}</span><Button variant="ghost" onClick={() => setLocalSelection(null)}>Clear selection</Button></div>}</div>
    <nav className={styles.tabs} aria-label="Hindsight views"><ImpactTabs tabNames={TABS} tabPanels={TABS.map(() => null)} value={primary} isBlueBg={false} onChange={(_event,value) => navigate({ view: value as WorkspaceView, ...(value === 'deep-dive' ? { preset: 'items' as const } : {}) }, { localSelection: null })} /></nav>
    {primary === 'overview' && !detail && <div className={styles.subviewBar}><ButtonGroup aria-label="Overview section" options={[{ value: 'summary', label: 'Summary' }, { value: 'sales-mix', label: 'Sales Mix' }]} selectedOption={route.subview === 'sales-mix' ? 'sales-mix' : 'summary'} onChange={(_event, value) => navigate({ view: 'overview', subview: value === 'sales-mix' ? 'sales-mix' : undefined })} /></div>}
    {primary === 'deep-dive' && !detail && <div className={styles.subviewBar}><ButtonGroup aria-label="Deep Dive preset" options={PRESETS} selectedOption={route.preset ?? 'items'} onChange={(_event,value) => navigate({ view: 'deep-dive', preset: value as DeepDivePreset })} />{route.preset === 'custom' && <div className={styles.customBase}><ButtonGroup aria-label="Custom view base" options={[{value:'items',label:'Items'},{value:'stores',label:'Stores'},{value:'attributes',label:'Attributes'}]} selectedOption={customBase} onChange={(_event,value) => workspace.saveViewState('deep-dive-custom-base', value)} /></div>}</div>}
    {workspace.notices.filter(notice=>notice.id==='storage-unavailable').map(notice => <div className={styles.notice} data-tone={notice.tone} key={notice.id} role={notice.tone === 'danger' ? 'alert' : 'status'}><span>{notice.message}</span><button aria-label="Dismiss notification" onClick={() => workspace.dismissNotice(notice.id)}>×</button></div>)}
    <div className={styles.content} key={route.view + ':' + (route.preset ?? '') + ':' + (route.id ?? '') + ':' + (route.storeId ?? '')}>{renderView()}</div>
    <GlobalFilterDrawer />
    <ConfigurationDialog open={activePanel === 'customize' || activePanel === 'saved'} section={activePanel === 'saved' ? 'saved' : 'customize'} onClose={() => setActivePanel(null)} />
    <Modal open={activePanel === 'definition'} onClose={() => setActivePanel(null)} title={definitionId === 'ranged-out' ? 'Currently ranged, zero sellable stock' : definition?.name ?? fallbackDefinition?.label ?? 'Metric definition'} dialogClassName={styles.definitionDialog}><div className={styles.definitionBody}><Pill tone="warning">{definition?.evidence_status ?? 'Proposed base definition'}</Pill><p>{definitionId === 'ranged-out' ? 'Count distinct canonical SKU–store pairs that are currently ranged and have known sellable inventory equal to zero at the independently selected range and stock dates. Missing or negative inventory is excluded and disclosed separately. This is a pair count, never a SKU or store count.' : definition?.base_definition ?? fallbackDefinition?.definition ?? 'This metric requires a governed definition and source-owner validation.'}</p><dl><dt>Metric ID</dt><dd>{definition?.id ?? definitionId}</dd><dt>Grain and unit</dt><dd>{definitionId === 'ranged-out' ? 'Distinct SKU–store pairs · count' : definition?.grain_unit ?? fallbackDefinition?.unit ?? 'See source definition'}</dd><dt>Aggregation</dt><dd>{definition?.aggregation_guards ?? 'Recompute ratios from contributing facts. Distinct counts never sum group subtotals.'}</dd><dt>Source aliases</dt><dd>{definition?.source_labels || 'Proposed metric; no confirmed source alias'}</dd><dt>Evidence</dt><dd>{definition?.evidence ?? 'Illustrative design-session facts'}</dd><dt>Open question</dt><dd>{definition?.decisions_questions ?? 'Client validation is required before production use.'}</dd></dl></div><div className={styles.definitionClose}><Button onClick={() => setActivePanel(null)}>Close</Button></div></Modal>
    <IrisWorkspace />
  </div>;
}
function WorkspaceRuntime() { const {scope,localSelection,dataset}=useWorkspace(); return <ReportStateProvider scopeKey={JSON.stringify({scope,localSelection})} evidenceDate={dataset.feeds.refreshedAt}><WorkspaceFrame /></ReportStateProvider>; }
export function HindsightWorkspacePage() { return <WorkspaceProvider><WorkspaceRuntime /></WorkspaceProvider>; }
