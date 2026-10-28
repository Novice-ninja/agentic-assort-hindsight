import type { CaseRecord, DecisionRecord, Scope, SessionState } from '../data';
import { projectDataset } from '../data';
import type { Dataset } from '../data';
import type { WorkspaceRole } from './types';

const inspection = new Set(['view', 'view-detail', 'export', 'explain', 'save-personal-view']);
const authoring = new Set(['draft', 'comment', 'author-learning']);
const administration = new Set(['publish-rules', 'publish-view', 'configure-metrics', 'record-execution']);
export function canWorkspace(permission: string, role: WorkspaceRole, access: Scope['access']): boolean {
  if (inspection.has(permission)) return true;
  if (['view-margin', 'margin', 'gm'].includes(permission)) return access === 'full';
  if (authoring.has(permission)) return role !== 'viewer';
  if (['approve', 'accept-learning'].includes(permission)) return role === 'approver' || role === 'administrator';
  if (administration.has(permission)) return role === 'administrator';
  return false;
}

/** Free-text records are not a bypass around denied financial fields. */
export function permittedText(text: string, access: Scope['access']): string {
  return access === 'restricted-margin' && /gross[\s_-]*margin|\b(?:gm|cogs)(?=\b|\d|[%$:])|margin|gross[\s_-]*profit/i.test(text)
    ? '[Restricted margin evidence]' : text;
}
const authoredProjections = new WeakMap<object, Map<string, unknown>>();
/** Project every authored text leaf, including extra metadata and cached forms.
 * Stable structural identifiers and canonical metric names remain usable; free-form
 * references containing financial values are text, not permission-bypassing IDs.
 * The raw session is retained separately and is never mutated by projection.
 */
export function projectAuthoredValue<T>(value: T, access: Scope['access'], key = ''): T {
  if (access === 'full') return value;
  if (typeof value === 'string') {
    const identity = /(?:^id$|Ids?$|Refs?$|Version$|^(?:beforeScope|afterScope|version|schema|metric|metricId|uom|access|state|action|queue|priority|evidenceClass|visibility)$)/.test(key);
    if (identity && (/^[A-Za-z0-9._:\/-]+$/.test(value) || key === 'metric' && !/[\d$€£]/.test(value))) return value;
    return permittedText(value, access) as T;
  }
  if (!value || typeof value !== 'object') return value;
  const cached = authoredProjections.get(value)?.get(key);
  if (cached !== undefined) return cached as T;
  const projected: unknown[] | Record<string, unknown> = Array.isArray(value) ? [] : {};
  const entries = authoredProjections.get(value) ?? new Map<string, unknown>();
  entries.set(key, projected); authoredProjections.set(value, entries);
  if (Array.isArray(value)) value.forEach(item => (projected as unknown[]).push(projectAuthoredValue(item, access, key)));
  else Object.entries(value).forEach(([field, item]) => { (projected as Record<string, unknown>)[field] = projectAuthoredValue(item, access, field); });
  return projected as T;
}
export function projectDecision(record: DecisionRecord, access: Scope['access']): DecisionRecord {
  return projectAuthoredValue(record, access);
}
export function projectCase(record: CaseRecord, access: Scope['access']): CaseRecord {
  if (access === 'full') return record;
  const restricted = (metric: string) => /gross.?margin|\bgm\b|\bcogs\b|margin|K0[34]/i.test(metric);
  const metric = (name: string, actual: CaseRecord['actual']) => restricted(name) ? { value: null, state: 'restricted' as const, unit: actual.unit, reason: 'Margin access is restricted.' } : actual;
  const safe = projectAuthoredValue(record, access);
  return { ...safe, actual: metric(record.metric, safe.actual), threshold: restricted(record.metric) ? '[Restricted threshold]' : safe.threshold,
    signals: safe.signals?.map((signal, index) => ({ ...signal, actual: metric(record.signals![index].metric, signal.actual), threshold: restricted(record.signals![index].metric) ? '[Restricted threshold]' : signal.threshold })),
  };
}
export function projectSession(state: SessionState, access: Scope['access']): SessionState {
  if (access === 'full') return state;
  return {
    cases: state.cases.map(record => projectCase(record, access)),
    decisions: state.decisions.map(record => projectDecision(record, access)),
    learnings: state.learnings.map(record => projectAuthoredValue(record, access)),
    observations: state.observations.map(record => projectAuthoredValue(record, access)),
  };
}
/** Earlier frozen Iris datasets must project authored records as well as numeric facts. */
export function projectEvidenceDataset(data: Dataset, access: Scope['access']): Dataset {
  if (access === 'full') return data;
  const numeric = projectDataset(data, access);
  const records = projectSession({ cases: numeric.cases, observations: numeric.observations, learnings: numeric.learnings, decisions: [] }, access);
  return { ...numeric, cases: records.cases, observations: records.observations, learnings: records.learnings };
}
