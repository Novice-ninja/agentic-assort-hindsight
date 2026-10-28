import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { advanceDecision, anchorCompPolicyScope, getCompPolicyResult, createDefaultScope, createInitialSession, dateValid, editDecisionDraft, getDefaultDataset, getScenarioDataset, isContiguousReviewPrefix, metricCatalogue, projectDataset, saveDecisionDraft, saveLearning as saveDataLearning, saveObservation, scopeSignature, selectScopedPairs, withSession } from '../data';
import type { CaseRecord, DecisionRecord, Learning, Mode, Scope, SessionState } from '../data';
import type { DecisionTransition, DraftInput } from '../data/session';
import type { DecisionDraft, ExplainInput, LocalSelection, Notice, WorkspaceContextValue, WorkspaceRole, WorkspaceRoute, ViewConfiguration } from './types';
import { normalizeWorkspaceRoute, parentWorkspaceRoute, parseWorkspaceRoute, routePath, WORKSPACE_BASE, workspaceRouteKey, workspaceUrl } from './navigation';
import { canWorkspace, projectAuthoredValue, projectCase, projectDecision, projectSession } from './permissions';
import { affectedObservationPairs } from './observationScope';
export type * from './types';
export { routePath, parseWorkspaceRoute } from './navigation';

const STORAGE = 'assort-hindsight-workspace-v3';
const MODES: Mode[] = ['in-season', 'plr'];
const ROLES: WorkspaceRole[] = ['viewer', 'merchant', 'approver', 'administrator'];
interface ModeContext { scope: Scope; revision: number; localSelection: LocalSelection | null; viewState: Record<string, unknown>; lastRoute: WorkspaceRoute }
interface NavFrame { route: WorkspaceRoute; scope: Scope; localSelection: LocalSelection | null; viewState: Record<string, unknown>; scrollTop: number }
interface StoredWorkspace { schema: 3; datasetId: string; datasetVersion: string; activeMode: Mode; contexts: Record<Mode, ModeContext>; records: SessionState; recordsRevision: number; role: WorkspaceRole; access: Scope['access']; history: NavFrame[]; scroll: Record<string, number>; snapshots: Record<string, NavFrame> }
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
const clone = <T,>(value: T): T => structuredClone(value);
const durableViewKeys = ['saved-workspace-views', 'decision-rule-versions'];
const frameViewState = (viewState: Record<string, unknown>) => clone(Object.fromEntries(Object.entries(viewState).filter(([key]) => !durableViewKeys.includes(key))));
const restoredViewState = (current: Record<string, unknown>, frame: Record<string, unknown>) => ({ ...clone(frame), ...Object.fromEntries(durableViewKeys.filter(key => current[key] !== undefined).map(key => [key, current[key]])) });
const urlMode = (search: string): Mode | undefined => { const value = new URLSearchParams(search).get('mode'); return MODES.includes(value as Mode) ? value as Mode : undefined; };
const initialMode = (mode: Mode): ModeContext => ({ scope: createDefaultScope(mode), revision: 0, localSelection: null, viewState: {}, lastRoute: { view: 'overview' } });
function fresh(): StoredWorkspace {
  const dataset = getDefaultDataset();
  return { schema: 3, datasetId: dataset.id, datasetVersion: dataset.version, activeMode: 'in-season', contexts: { 'in-season': initialMode('in-season'), plr: initialMode('plr') }, records: createInitialSession(), recordsRevision: 0, role: 'merchant', access: 'full', history: [], scroll: {}, snapshots: {} };
}
function normalizeScope(scope: Scope, access: Scope['access']): Scope {
  const dataset = getScenarioDataset(scope.scenario);
  const allowedProducts = new Set(dataset.products.map(item => item.id)), allowedStores = new Set(dataset.stores.map(store => store.id));
  const productIds = [...new Set(Array.isArray(scope.productIds) ? scope.productIds : [])].filter(id => allowedProducts.has(id));
  const storeIds = [...new Set(Array.isArray(scope.storeIds) ? scope.storeIds : [])].filter(id => allowedStores.has(id));
  return { ...createDefaultScope(scope.mode), ...clone(scope), access, productIds, storeIds,
    productSelection: scope.productIds?.length ? productIds.length ? 'selected' : 'none' : scope.productSelection ?? 'all',
    storeSelection: scope.storeIds?.length ? storeIds.length ? 'selected' : 'none' : scope.storeSelection ?? 'all',
    localFilters: { ...scope.localFilters },
  };
}
function restore(): StoredWorkspace {
  const fallback = fresh();
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE) ?? 'null');
    if (raw?.schema !== 3 || raw.datasetId !== fallback.datasetId || raw.datasetVersion !== fallback.datasetVersion || !MODES.every(mode => raw.contexts?.[mode]?.scope) || !['cases', 'decisions', 'learnings', 'observations'].every(key => Array.isArray(raw.records?.[key]))) return fallback;
    const access = raw.access === 'restricted-margin' ? 'restricted-margin' : 'full';
    const result: StoredWorkspace = { ...fallback, ...raw, access, role: ROLES.includes(raw.role) ? raw.role : 'viewer', history: Array.isArray(raw.history) ? raw.history.slice(-40) : [], snapshots: raw.snapshots ?? {}, scroll: raw.scroll ?? {} };
    for (const mode of MODES) result.contexts[mode] = { ...fallback.contexts[mode], ...raw.contexts[mode], scope: normalizeScope({ ...raw.contexts[mode].scope, mode }, access), lastRoute: normalizeWorkspaceRoute(raw.contexts[mode].lastRoute ?? { view: 'overview' }) };
    return result;
  } catch { return fallback; }
}
const scrollContainer = () => typeof document === 'undefined' ? null : document.getElementById('main-content');
const asDraft = (record: DecisionRecord): DecisionDraft => ({ ...record, status: record.state });
export function useWorkspace() { const value = useContext(WorkspaceContext); if (!value) throw new Error('useWorkspace requires WorkspaceProvider'); return value; }
export function useViewState<T>(key: string, initial: T): [T, (next: T | ((previous: T) => T)) => void] {
  const { getViewState, saveViewState } = useWorkspace();
  return [getViewState(key, initial), useCallback((next: T | ((previous: T) => T)) => saveViewState(key, typeof next === 'function' ? (next as (value: T) => T)(getViewState(key, initial)) : next), [getViewState, saveViewState, key, initial])];
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const location = useLocation(), navigationType = useNavigationType(), routerNavigate = useNavigate();
  const [stored, setStored] = useState(restore), stateRef = useRef(stored);
  const locationRef = useRef(location); locationRef.current = location;
  const mode = urlMode(location.search) ?? stored.activeMode;
  const modeRef = useRef(mode); modeRef.current = mode;
  const route = useMemo(() => parseWorkspaceRoute(location.pathname, location.search), [location.pathname, location.search]);
  const [activePanel, setActivePanel] = useState<WorkspaceContextValue['activePanel']>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const pendingScroll = useRef<number | null>(null), storageWarned = useRef(false);
  const commit = useCallback((update: (state: StoredWorkspace) => StoredWorkspace) => {
    const next = update(stateRef.current); stateRef.current = next; setStored(next);
    try { window.sessionStorage.setItem(STORAGE, JSON.stringify(next)); } catch { if (!storageWarned.current) { storageWarned.current = true; setNotices(current => [...current, { id: 'storage-unavailable', message: 'Local storage is unavailable or full. This session remains usable, but changes will not survive reload.', tone: 'warning' }]); } }
  }, []);
  const addNotice = useCallback((message: string, tone: Notice['tone'] = 'success') => setNotices(current => [...current.slice(-3), { id: `notice-${Date.now()}-${Math.random()}`, message, tone }]), []);
  const can = useCallback((permission: string) => canWorkspace(permission, stateRef.current.role, stateRef.current.access), []);
  const capture = useCallback((): NavFrame => {
    const state = stateRef.current, current = state.contexts[modeRef.current];
    return { route: parseWorkspaceRoute(locationRef.current.pathname, locationRef.current.search), scope: clone(current.scope), localSelection: clone(current.localSelection), viewState: frameViewState(current.viewState), scrollTop: scrollContainer()?.scrollTop ?? 0 };
  }, []);
  const navigate = useCallback((input: WorkspaceRoute, options?: { scope?: Scope; localSelection?: LocalSelection | null; viewState?: Record<string, unknown> }) => {
    if (options?.scope?.mode === 'plr' && (options.scope.window !== 'PLR' || !isContiguousReviewPrefix(options.scope, options.scope.scenario === 'missing-plan' ? getDefaultDataset() : getScenarioDataset(options.scope.scenario)))) { addNotice('A PLR review must retain its approved calendar and contiguous selling-window cutoff. Use a local interval drill for analysis.', 'warning'); return; }
    if (options?.scope?.compPolicyId && !getCompPolicyResult(options.scope, getScenarioDataset(options.scope.scenario)).valid) { addNotice('That Demo Comp evidence scope no longer has a valid matching policy/window anchor.', 'danger'); return; }
    const frame = capture(), target = normalizeWorkspaceRoute(input), nextMode = options?.scope?.mode ?? modeRef.current;
    commit(state => ({ ...state, activeMode: nextMode, history: [...state.history.slice(-39), frame], snapshots: { ...state.snapshots, [locationRef.current.key]: frame }, scroll: { ...state.scroll, [workspaceRouteKey(frame.scope.mode, frame.route)]: frame.scrollTop }, contexts: { ...state.contexts, [nextMode]: { ...state.contexts[nextMode], lastRoute: target, ...(options?.viewState ? { viewState: clone(options.viewState) } : {}), ...(options?.scope ? { scope: normalizeScope(options.scope, state.access), revision: state.contexts[nextMode].revision + 1 } : {}), ...(options && 'localSelection' in options ? { localSelection: clone(options.localSelection ?? null) } : {}) } } }));
    pendingScroll.current = stateRef.current.scroll[workspaceRouteKey(nextMode, target)] ?? 0;
    setActivePanel(null); routerNavigate(workspaceUrl(nextMode, target), { state: { hindsightWorkspace: true } });
  }, [capture, commit, routerNavigate, addNotice]);
  const captureViewConfiguration = useCallback((): ViewConfiguration => {
    const frame = capture();
    return projectAuthoredValue({ scope: frame.scope, route: frame.route, localSelection: frame.localSelection, viewState: Object.fromEntries(Object.entries(frame.viewState).filter(([key]) => !['saved-workspace-views', 'decision-rule-versions', 'decision-rule-preview', 'decision-rule-errors', '__definition'].includes(key))) }, stateRef.current.access);
  }, [capture]);
  const applyViewConfiguration = useCallback((snapshot: ViewConfiguration): boolean => {
    if (!snapshot?.scope || !snapshot.route || !snapshot.viewState || !MODES.includes(snapshot.scope.mode)) { addNotice('This saved view does not have a supported workspace configuration.', 'danger'); return false; }
    const data = getScenarioDataset(snapshot.scope.scenario), productIds = new Set(data.products.map(item => item.id)), storeIds = new Set(data.stores.map(store => store.id));
    const selection = snapshot.localSelection;
    const target = normalizeWorkspaceRoute(snapshot.route);
    if (target.view === 'item' && !productIds.has(target.id ?? '') || target.view === 'store' && !storeIds.has(target.id ?? '') || target.view === 'pair' && (!productIds.has(target.id ?? '') || !storeIds.has(target.storeId ?? '')) || target.view === 'case' && !stateRef.current.records.cases.some(record => record.id === target.id)) { addNotice('This saved workspace target is no longer available.', 'danger'); return false; }
    const invalid = !Array.isArray(snapshot.scope.productIds) || !Array.isArray(snapshot.scope.storeIds) || snapshot.scope.productIds.some(id => !productIds.has(id)) || snapshot.scope.storeIds.some(id => !storeIds.has(id)) || selection?.itemIds?.some(id => !productIds.has(id)) || selection?.storeIds?.some(id => !storeIds.has(id)) || [...(snapshot.scope.pairIds ?? []), ...(selection?.pairIds ?? [])].some(id => { const [item,store,...extra] = id.split(':'); return extra.length || !productIds.has(item) || !storeIds.has(store); });
    if (invalid) { addNotice('This saved view contains unavailable canonical products, stores or pairs. Review its saved scope before applying.', 'danger'); return false; }
    const metricIds = new Set([...metricCatalogue.map(metric => metric.id), 'ranged-out']), cards = snapshot.viewState['overview-cards'] as string[] | undefined;
    if (cards && (!Array.isArray(cards) || cards.length !== 6 || new Set(cards).size !== 6 || cards.some(id => !metricIds.has(id))) || snapshot.scope.metricFilters?.rules.some(rule => !['sales', 'quantity', 'gmRate', 'sellableOh', 'wos'].includes(rule.metric))) { addNotice('This saved view references retired or unsupported metric IDs.', 'danger'); return false; }
    if (snapshot.scope.mode === 'plr' && (snapshot.scope.calendarId !== data.reviews?.find(review => review.id === snapshot.scope.reviewId)?.calendarId || snapshot.scope.window !== 'PLR' || !isContiguousReviewPrefix(snapshot.scope, snapshot.scope.scenario === 'missing-plan' ? getDefaultDataset() : data))) { addNotice('The saved PLR calendar is not a valid approved selling-window prefix.', 'danger'); return false; }
    if (snapshot.scope.compPolicyId && (!snapshot.scope.compPolicyAnchor || !getCompPolicyResult(snapshot.scope, data).valid)) { addNotice('The saved Demo Comp policy/window anchor is missing or no longer valid. Reapply global filters to establish a current cohort before saving again.', 'danger'); return false; }
    const current = stateRef.current.contexts[snapshot.scope.mode].viewState;
    const viewState = { ...clone(snapshot.viewState) };
    for (const key of ['saved-workspace-views', 'decision-rule-versions', 'decision-rule-preview', 'decision-rule-errors']) { delete viewState[key]; if (current[key] !== undefined) viewState[key] = current[key]; }
    navigate(snapshot.route, { scope: { ...snapshot.scope, access: stateRef.current.access }, localSelection: snapshot.localSelection, viewState }); return true;
  }, [addNotice, navigate]);
  const back = useCallback(() => {
    const frame = stateRef.current.history.at(-1);
    if (frame && (locationRef.current.state as { hindsightWorkspace?: boolean } | null)?.hindsightWorkspace) { pendingScroll.current = frame.scrollTop; routerNavigate(-1); return; }
    if (!frame) { navigate(parentWorkspaceRoute(parseWorkspaceRoute(locationRef.current.pathname, locationRef.current.search))); return; }
    commit(state => ({ ...state, activeMode: frame.scope.mode, history: state.history.slice(0, -1), contexts: { ...state.contexts, [frame.scope.mode]: { ...state.contexts[frame.scope.mode], scope: normalizeScope(frame.scope, state.access), localSelection: frame.localSelection, viewState: restoredViewState(state.contexts[frame.scope.mode].viewState, frame.viewState), lastRoute: frame.route } } }));
    pendingScroll.current = frame.scrollTop; setActivePanel(null); routerNavigate(workspaceUrl(frame.scope.mode, frame.route), { replace: true, state: { hindsightWorkspace: true } });
  }, [navigate, commit, routerNavigate]);
  const setMode = useCallback((next: Mode) => {
    if (next === modeRef.current) return;
    const context = stateRef.current.contexts[next];
    navigate(context.lastRoute, { scope: context.scope, localSelection: context.localSelection });
  }, [navigate]);
  useEffect(() => { if (mode !== stateRef.current.activeMode) commit(state => ({ ...state, activeMode: mode })); }, [mode, commit]);
  useLayoutEffect(() => {
    const known = stateRef.current.snapshots[location.key];
    if (navigationType === 'POP' && known && routePath(known.route) === routePath(parseWorkspaceRoute(location.pathname, location.search))) {
      commit(state => { const index = state.history.map(frame => workspaceRouteKey(frame.scope.mode, frame.route)).lastIndexOf(workspaceRouteKey(known.scope.mode, known.route)); return { ...state, activeMode: known.scope.mode, history: index >= 0 ? state.history.slice(0, index) : state.history, contexts: { ...state.contexts, [known.scope.mode]: { ...state.contexts[known.scope.mode], scope: normalizeScope(known.scope, state.access), localSelection: clone(known.localSelection), viewState: restoredViewState(state.contexts[known.scope.mode].viewState, known.viewState), lastRoute: known.route } } }; });
      pendingScroll.current ??= known.scrollTop;
    }
    const target = pendingScroll.current ?? stateRef.current.scroll[workspaceRouteKey(modeRef.current, parseWorkspaceRoute(location.pathname, location.search))] ?? 0;
    pendingScroll.current = null;
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => { const main = scrollContainer(); if (main) main.scrollTop = target; }); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [location.key, commit, navigationType, location.pathname, location.search]);
  useEffect(() => {
    const main = scrollContainer(); if (!main) return;
    let timer: ReturnType<typeof setTimeout>;
    const save = () => { clearTimeout(timer); timer = setTimeout(() => { const frame = capture(), state = stateRef.current; const next = { ...state, scroll: { ...state.scroll, [workspaceRouteKey(frame.scope.mode, frame.route)]: frame.scrollTop }, snapshots: { ...state.snapshots, [locationRef.current.key]: frame } }; stateRef.current = next; try { window.sessionStorage.setItem(STORAGE, JSON.stringify(next)); } catch { /* Scrolling must remain usable when storage is unavailable. */ } }, 100); };
    main.addEventListener('scroll', save, { passive: true });
    const departing = () => { const frame = capture(); stateRef.current.snapshots[locationRef.current.key] = frame; };
    window.addEventListener('popstate', departing);
    return () => { clearTimeout(timer); main.removeEventListener('scroll', save); window.removeEventListener('popstate', departing); };
  }, [capture, commit]);
  const applyScope = useCallback((input: Scope, options?: { access?: Scope['access']; role?: WorkspaceRole }) => {
    if (input.mode === 'plr' && (input.window !== 'PLR' || !isContiguousReviewPrefix(input, input.scenario === 'missing-plan' ? getDefaultDataset() : getScenarioDataset(input.scenario)))) { addNotice('PLR review stays pinned to its approved calendar and a contiguous complete-week cutoff.', 'warning'); return; }
    const access = options?.access ?? stateRef.current.access;
    const data = getScenarioDataset(input.scenario), nextScope = anchorCompPolicyScope(normalizeScope(input, access), data);
    const comp = getCompPolicyResult(nextScope, data);
    if (!comp.valid) { addNotice(comp.reason, 'danger'); return; }
    commit(state => ({ ...state, access, role: options?.role ?? state.role, activeMode: nextScope.mode, contexts: { ...state.contexts, [nextScope.mode]: { ...state.contexts[nextScope.mode], scope: nextScope, revision: state.contexts[nextScope.mode].revision + 1, localSelection: null } } }));
    setActivePanel(null);
  }, [commit, addNotice]);
  const patchScope = useCallback((patch: Partial<Scope>) => applyScope({ ...stateRef.current.contexts[modeRef.current].scope, ...patch }), [applyScope]);
  const setLocalSelection = useCallback((selection: LocalSelection | null) => commit(state => ({ ...state, contexts: { ...state.contexts, [modeRef.current]: { ...state.contexts[modeRef.current], localSelection: clone(selection) } } })), [commit]);
  const getViewState = useCallback(<T,>(key: string, initial: T): T => projectAuthoredValue((stateRef.current.contexts[modeRef.current].viewState[key] as T | undefined) ?? initial, stateRef.current.access), []);
  const saveViewState = useCallback(<T,>(key: string, value: T) => {
    if (key === 'decision-rule-versions') {
      if (!can('publish-rules')) { addNotice('This role cannot publish rule versions.', 'warning'); return; }
      const previous = getViewState<unknown[]>(key, []), next = value as unknown[];
      if (!Array.isArray(next) || next.length !== previous.length + 1 || JSON.stringify(next.slice(0, previous.length)) !== JSON.stringify(previous)) { addNotice('Published rule history is immutable; append one reviewed version.', 'danger'); return; }
    }
    commit(state => ({ ...state, contexts: { ...state.contexts, [modeRef.current]: { ...state.contexts[modeRef.current], viewState: { ...state.contexts[modeRef.current].viewState, [key]: clone(value) } } } }));
  }, [commit, can, addNotice, getViewState]);
  const updateRecords = useCallback((records: SessionState) => commit(state => ({ ...state, records, recordsRevision: state.recordsRevision + 1 })), [commit]);
  const currentDataset = useCallback(() => { const state = stateRef.current; return withSession(getScenarioDataset(state.contexts[modeRef.current].scope.scenario), state.records); }, []);
  const allowedPairIds = useCallback(() => new Set(selectScopedPairs({ ...stateRef.current.contexts[modeRef.current].scope, population: 'all-candidates' }, currentDataset()).map(pair => pair.id)), [currentDataset]);
  const createCase = useCallback((input: Partial<CaseRecord> & { itemId: string; storeId: string }): CaseRecord | null => {
    if (!can('draft')) { addNotice('This role can inspect evidence but cannot open a review case.', 'warning'); return null; }
    if (!allowedPairIds().has(`${input.itemId}:${input.storeId}`)) { addNotice('Choose a canonical product–store pair inside the applied global scope.', 'danger'); return null; }
    const records = stateRef.current.records, scope = stateRef.current.contexts[modeRef.current].scope;
    const trigger = { ruleId: input.ruleId ?? 'manual-review', ruleVersion: input.ruleVersion ?? 'manual-v1', metric: input.metric ?? 'Merchant review', actual: input.actual ?? { value: null, state: 'not-applicable' as const, unit: '', reason: 'Manual evidence review; no automated threshold asserted.' }, threshold: input.threshold ?? 'Manual review', evidenceIds: input.evidenceIds ?? [`${input.itemId}:${input.storeId}`], evaluatedAt: new Date().toISOString() };
    const existing = records.cases.find(record => record.itemId === input.itemId && record.storeId === input.storeId && record.state !== 'Resolved');
    if (existing) {
      const signals = existing.signals ?? [{ ruleId: existing.ruleId, ruleVersion: existing.ruleVersion, metric: existing.metric, actual: existing.actual, threshold: existing.threshold, evidenceIds: existing.evidenceIds, evaluatedAt: '' }];
      const duplicate = signals.some(signal => signal.ruleId === trigger.ruleId && signal.ruleVersion === trigger.ruleVersion && signal.metric === trigger.metric && signal.threshold === trigger.threshold && JSON.stringify(signal.actual) === JSON.stringify(trigger.actual) && JSON.stringify(signal.evidenceIds) === JSON.stringify(trigger.evidenceIds));
      const updated = { ...existing, signals: duplicate ? signals : [...signals, trigger], evidenceIds: [...new Set([...existing.evidenceIds, ...trigger.evidenceIds])] };
      updateRecords({ ...records, cases: records.cases.map(record => record.id === existing.id ? updated : record) });
      addNotice(`Case ${existing.id} retains the merged evidence for this pair. No duplicate case was counted.`); return projectCase(updated, stateRef.current.access);
    }
    const id = `Q${String(Math.max(0, ...records.cases.map(record => Number(record.id.replace(/\D/g, '')) || 0)) + 1).padStart(3, '0')}`;
    const record: CaseRecord = { id, itemId: input.itemId, storeId: input.storeId, title: input.title ?? 'Merchant review', priority: input.priority ?? 'Watch', queue: input.queue ?? 'Coverage/excess', state: 'Open', owner: input.owner ?? 'Unassigned', reviewDate: input.reviewDate ?? scope.rangeAsOf, ruleId: trigger.ruleId, ruleVersion: trigger.ruleVersion, metric: trigger.metric, actual: trigger.actual, threshold: trigger.threshold, observation: input.observation ?? '', hypothesis: input.hypothesis ?? '', evidenceIds: trigger.evidenceIds, signals: [trigger], evaluatedAt: trigger.evaluatedAt, evaluationScope: { ...scope, dataVersion: currentDataset().version } };
    updateRecords({ ...records, cases: [...records.cases, record] }); addNotice(`Case ${id} created as a local review. No assortment or supply execution occurred.`); return projectCase(record, stateRef.current.access);
  }, [can, addNotice, allowedPairIds, updateRecords, currentDataset]);
  const updateCase = useCallback((id: string, patch: Partial<CaseRecord>) => {
    if (!can('draft')) { addNotice('This role cannot edit review cases.', 'warning'); return; }
    const records = stateRef.current.records, existing = records.cases.find(record => record.id === id);
    if (!existing) return;
    if (patch.state === 'Resolved' && !records.decisions.some(record => record.caseId === id && record.state === 'Reviewed')) { addNotice('Record a reviewed decision outcome before resolving this case.', 'warning'); return; }
    if (patch.owner !== undefined && !patch.owner.trim()) { addNotice('Assign an accountable case owner.', 'warning'); return; }
    if (patch.state === 'Resolved' && records.decisions.some(record => record.caseId === id && !['Reviewed', 'Cancelled', 'Superseded'].includes(record.state))) { addNotice('Review or explicitly cancel the linked decisions before resolving this case. Approval is not execution.', 'warning'); return; }
    if (patch.reviewDate && !dateValid(patch.reviewDate)) { addNotice('Choose a valid case review date.', 'danger'); return; }
    if (patch.state && !['Open', 'In review', 'Resolved'].includes(patch.state)) { addNotice('Choose a valid review state.', 'danger'); return; }
    const allowed: Partial<CaseRecord> = {};
    for (const key of ['title', 'priority', 'state', 'owner', 'reviewDate', 'observation', 'hypothesis', 'evidenceIds'] as const) if (patch[key] !== undefined) (allowed as Record<string, unknown>)[key] = clone(patch[key]);
    updateRecords({ ...records, cases: records.cases.map(record => record.id === id ? { ...record, ...allowed } : record) });
  }, [can, addNotice, updateRecords]);
  const saveDraft = useCallback((input: Partial<DecisionDraft> & Record<string, unknown>): DecisionDraft | null => {
    if (!can('draft')) { addNotice('This role cannot save a decision draft.', 'warning'); return null; }
    const records = stateRef.current.records, existing = records.decisions.find(record => record.id === input.id);
    if ((input.state && input.state !== 'Draft') || (input.status && input.status !== 'Draft') || (existing && existing.state !== 'Draft')) { addNotice('Use the explicit decision lifecycle action; approval and execution cannot be merged into a draft.', 'danger'); return null; }
    const incoming = { ...existing, ...input };
    const draftKeys: (keyof DraftInput)[] = ['caseId', 'action', 'pairIds', 'quantity', 'uom', 'reason', 'owner', 'effectiveDate', 'reviewDate', 'evidenceIds', 'outgoingItemId', 'incomingItemId', 'destinationStoreId', 'linkedSupplyId', 'linkedDecisionId', 'beforeScope', 'afterScope'];
    const merged = Object.fromEntries(draftKeys.filter(key => incoming[key] !== undefined).map(key => [key, clone(incoming[key])])) as unknown as DraftInput;
    merged.author = existing?.author ?? `Demo ${stateRef.current.role}`;
    merged.recordedAt = existing?.recordedAt ?? new Date().toISOString();
    merged.scope = existing?.scope ?? clone(stateRef.current.contexts[modeRef.current].scope);
    merged.visibility = existing?.visibility ?? 'Review team';
    const permitted = allowedPairIds();
    if (merged.pairIds?.some(id => !permitted.has(id))) { addNotice('The decision contains a pair outside the applied scope.', 'danger'); return null; }
    const result = existing ? editDecisionDraft(records, existing.id, merged, new Date().toISOString(), currentDataset()) : saveDecisionDraft(records, merged, new Date().toISOString(), currentDataset());
    if (!result.ok || !result.record) { addNotice(result.errors.join(' ') || 'Draft could not be saved.', 'danger'); return null; }
    updateRecords(result.state); addNotice(`${result.record.id} saved as Draft. Nothing has been approved or executed.`); return asDraft(projectDecision(result.record, stateRef.current.access));
  }, [can, addNotice, updateRecords, currentDataset, allowedPairIds]);
  const transitionDecision = useCallback((id: string, event: DecisionTransition): DecisionDraft | null => {
    const current = stateRef.current.records.decisions.find(record => record.id === id);
    const permission = event.type === 'approve' || event.type === 'await-execution' ? 'approve' : event.type === 'execution-ack' ? 'record-execution' : ['cancel', 'supersede'].includes(event.type) && current && !['Draft', 'Awaiting approval'].includes(current.state) ? 'approve' : 'draft';
    if (!can(permission)) { addNotice(`This role cannot record ${event.type}.`, 'warning'); return null; }
    const result = advanceDecision(stateRef.current.records, id, event, { id: `Demo ${stateRef.current.role}`, canApprove: can('approve'), canExecute: can('record-execution') }, new Date().toISOString());
    if (!result.ok || !result.record) { addNotice(result.errors.join(' '), 'danger'); return null; }
    updateRecords(result.state); addNotice(`${id}: ${result.record.state}. Local acknowledgement only; no external execution was called.`); return asDraft(projectDecision(result.record, stateRef.current.access));
  }, [can, addNotice, updateRecords]);
  const saveLearning = useCallback((input: Partial<Learning> & Record<string, unknown>) => {
    if (!can('author-learning') || (input.state === 'Accepted' && !can('accept-learning'))) { addNotice('This role cannot record that learning state.', 'warning'); return; }
    const records = stateRef.current.records, existing = records.learnings.find(record => record.id === input.id);
    if (existing && (input.reviewId && input.reviewId !== existing.reviewId || input.version && input.version !== existing.version)) { addNotice('A learning retains its original review and version.', 'danger'); return; }
    const learningState = input.state ?? existing?.state ?? 'Pending';
    if (learningState === 'Accepted' && !can('accept-learning')) { addNotice('An accepted learning requires review permission, including subsequent edits.', 'warning'); return; }
    const learningInput = { ...existing, ...input, author: existing?.author ?? `Demo ${stateRef.current.role}`, recordedAt: existing?.recordedAt ?? new Date().toISOString(), scope: existing?.scope ?? clone(stateRef.current.contexts[modeRef.current].scope), visibility: existing?.visibility ?? 'Review team', ...(learningState === 'Accepted' ? { reviewedBy: `Demo ${stateRef.current.role}`, reviewedAt: new Date().toISOString() } : {}) };
    const connected = currentDataset().versions.some(version => version.reviewId === learningInput.reviewId && version.id === learningInput.version);
    if (!connected) { addNotice('Choose a connected approved PLR review and version for this learning.', 'danger'); return; }
    const base = existing ? { ...records, learnings: records.learnings.filter(record => record.id !== existing.id) } : records;
    const result = saveDataLearning(base, learningInput as any);
    if (!result.ok || !result.record) { addNotice(result.errors.join(' '), 'danger'); return; }
    const record = existing ? { ...result.record, id: existing.id } : result.record;
    updateRecords({ ...result.state, learnings: existing ? records.learnings.map(previous => previous.id === existing.id ? record : previous) : result.state.learnings }); addNotice('Learning saved with its original review and evidence links.');
  }, [can, addNotice, updateRecords, currentDataset]);
  const addObservation = useCallback((input: Parameters<WorkspaceContextValue['addObservation']>[0]) => {
    if (!can('comment')) { addNotice('This role cannot add field observations.', 'warning'); return; }
    const state = stateRef.current, scope = state.contexts[modeRef.current].scope, pairs = selectScopedPairs(scope, currentDataset());
    const affected = affectedObservationPairs(pairs, input);
    if (affected.errors.length) { addNotice(affected.errors.join(' '), 'danger'); return; }
    const result = saveObservation(state.records, { author: `Demo ${state.role}`, observedOn: scope.rangeAsOf, recordedOn: new Date().toISOString(), source: 'Design-session merchant note', evidenceClass: 'merchant-observation', ...input, itemIds: [...new Set(affected.pairs.map(pair => pair.itemId))], storeIds: [...new Set(affected.pairs.map(pair => pair.storeId))], pairIds: affected.pairs.map(pair => pair.id), scope: clone(scope) } as any);
    if (!result.ok) { addNotice(result.errors.join(' '), 'danger'); return; } updateRecords(result.state); addNotice('Field observation saved separately from measured facts and causal conclusions.');
  }, [can, addNotice, updateRecords, currentDataset]);
  const explainView = useCallback((input: ExplainInput) => { setActivePanel(null); window.dispatchEvent(new CustomEvent('hindsight-redesign-iris-open', { detail: input })); }, []);
  const rawDataset = useMemo(() => withSession(getScenarioDataset(stored.contexts[mode].scope.scenario), stored.records), [stored.contexts[mode].scope.scenario, stored.records]);
  const visibleSession = useMemo(() => projectSession(stored.records, stored.access), [stored.records, stored.access]);
  const dataset = useMemo(() => projectDataset(withSession(rawDataset, visibleSession), stored.access), [rawDataset, visibleSession, stored.access]);
  const scope = useMemo(() => ({ ...stored.contexts[mode].scope, access: stored.access }), [stored.contexts[mode].scope, stored.access]);
  const value: WorkspaceContextValue = {
    scope, dataset, mode, route, scopeRevision: stored.contexts[mode].revision, contextVersion: `${dataset.version}|${scopeSignature(scope)}|${stored.contexts[mode].revision}|${stored.recordsRevision}|${stored.role}|${stored.access}`,
    setMode, applyScope, patchScope, resetScope: () => applyScope(createDefaultScope(modeRef.current)),
    resetDemo: () => { commit(() => fresh()); setActivePanel(null); setNotices([]); window.dispatchEvent(new Event('hindsight-redesign-reset')); pendingScroll.current = 0; routerNavigate(workspaceUrl('in-season', { view: 'overview' }), { replace: true }); addNotice('Local demonstration data and personal settings restored.'); },
    localSelection: projectAuthoredValue(stored.contexts[mode].localSelection, stored.access), setLocalSelection, captureViewConfiguration, applyViewConfiguration, navigate, back, canGoBack: stored.history.length > 0, getViewState, saveViewState,
    cases: visibleSession.cases, createCase, updateCase, session: visibleSession, drafts: visibleSession.decisions.map(asDraft), saveDraft, transitionDecision, learnings: visibleSession.learnings, saveLearning, observations: visibleSession.observations, addObservation,
    role: stored.role, setRole: role => { if (ROLES.includes(role)) commit(state => ({ ...state, role })); }, can, notices: projectAuthoredValue(notices, stored.access), addNotice, dismissNotice: id => setNotices(current => current.filter(notice => notice.id !== id)), activePanel, setActivePanel, explainView,
    openDefinition: metricId => { saveViewState('__definition', metricId); setActivePanel('definition'); },
  };
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
