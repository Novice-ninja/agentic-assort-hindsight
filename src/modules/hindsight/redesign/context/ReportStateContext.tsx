import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/** Explicit local rehearsal states. These do not represent a production request. */
export type ReportPhase = 'ready' | 'loading' | 'failure' | 'retained-failure';
export interface ReportComponent { id: string; title: string; }
export interface ReportLifecycle {
  phase: ReportPhase;
  evidenceDate: string;
  retryCount: number;
}
interface ScopedReportLifecycle extends ReportLifecycle { scopeKey: string; }
interface RegisteredReport extends ReportComponent { instances: number; }
export interface ReportStateValue {
  components: ReportComponent[];
  getState: (id: string) => ReportLifecycle;
  setPhase: (id: string, phase: ReportPhase) => void;
  retry: (id: string) => void;
  register: (component: ReportComponent) => () => void;
}
const ReportStateContext = createContext<ReportStateValue | null>(null);
const validPhases = new Set<ReportPhase>(['ready', 'loading', 'failure', 'retained-failure']);

/** Keep this provider mounted across scope changes. Old rehearsal states never cross a scope boundary. */
export function ReportStateProvider({ children, scopeKey, evidenceDate }: { children: ReactNode; scopeKey: string; evidenceDate: string }) {
  const [registered, setRegistered] = useState<Record<string, RegisteredReport>>({});
  const [states, setStates] = useState<Record<string, ScopedReportLifecycle>>({});
  const previousScope = useRef(scopeKey);
  useEffect(() => { if (previousScope.current !== scopeKey) { previousScope.current = scopeKey; setStates({}); } }, [scopeKey]);
  const register = useCallback((component: ReportComponent) => {
    setRegistered(previous => ({ ...previous, [component.id]: { ...component, instances: (previous[component.id]?.instances ?? 0) + 1 } }));
    return () => setRegistered(previous => {
      const existing = previous[component.id];
      if (!existing) return previous;
      const next = { ...previous };
      if (existing.instances > 1) next[component.id] = { ...existing, instances: existing.instances - 1 };
      else delete next[component.id];
      return next;
    });
  }, []);
  const getState = useCallback((id: string): ReportLifecycle => {
    const state = states[id];
    return state?.scopeKey === scopeKey ? state : { phase: 'ready', evidenceDate, retryCount: 0 };
  }, [states, scopeKey, evidenceDate]);
  const setPhase = useCallback((id: string, phase: ReportPhase) => {
    if (!id || !validPhases.has(phase)) return;
    setStates(previous => ({ ...previous, [id]: { phase, scopeKey, evidenceDate, retryCount: previous[id]?.scopeKey === scopeKey ? previous[id].retryCount : 0 } }));
  }, [scopeKey, evidenceDate]);
  const retry = useCallback((id: string) => {
    setStates(previous => {
      const current = previous[id];
      if (!current || current.scopeKey !== scopeKey || !['failure', 'retained-failure'].includes(current.phase)) return previous;
      return { ...previous, [id]: { ...current, phase: 'ready', retryCount: current.retryCount + 1 } };
    });
  }, [scopeKey]);
  const components = useMemo(() => Object.values(registered).map(({ id, title }) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id)), [registered]);
  const value = useMemo(() => ({ components, getState, setPhase, retry, register }), [components, getState, setPhase, retry, register]);
  return <ReportStateContext.Provider value={value}>{children}</ReportStateContext.Provider>;
}

/** Null outside the redesigned workspace, leaving the preserved preview unchanged. */
export function useReportStates() { return useContext(ReportStateContext); }
export function useReportLifecycle(id: string | undefined, title: string) {
  const context = useReportStates();
  const register = context?.register;
  useEffect(() => id && register ? register({ id, title }) : undefined, [id, title, register]);
  return { ...(id && context ? context.getState(id) : { phase: 'ready' as const, evidenceDate: '', retryCount: 0 }), retry: () => { if (id) context?.retry(id); } };
}

/** Semantic IDs are stable across renders; callers may provide reportId for non-text or repeated titles. */
export function reportIdForTitle(title: string) { return `report-${title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`; }
