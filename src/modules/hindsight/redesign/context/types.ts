import type { CaseRecord, Dataset, DecisionRecord, Learning, Mode, Scope, Observation as DataObservation, SessionState } from '../data';
import type { DecisionTransition } from '../data/session';

export type PrimaryWorkspaceView = 'overview' | 'deep-dive' | 'decisions';
export type DeepDivePreset = 'items' | 'stores' | 'matrix' | 'breadth' | 'attributes' | 'custom';
/** items/stores/mix are accepted compatibility destinations and normalize to the three primary views. */
export type WorkspaceView = PrimaryWorkspaceView | 'items' | 'stores' | 'mix' | 'item' | 'store' | 'pair' | 'case';
export interface WorkspaceRoute {
  view: WorkspaceView;
  preset?: DeepDivePreset;
  /** Item, store or case ID. Pair routes use id for the item and storeId for the store. */
  id?: string;
  storeId?: string;
  subview?: string;
  /** Focus/highlight only; never changes the applied population. */
  focusItemId?: string;
}
export interface ViewConfiguration { scope: Scope; route: WorkspaceRoute; localSelection: LocalSelection | null; viewState: Record<string, unknown> }
export interface LocalSelection { label: string; itemIds?: string[]; storeIds?: string[]; pairIds?: string[]; caseIds?: string[]; attribute?: { lens: string; value: string }; week?: string; weekIds?: string[]; metricId?: string; }
export interface ExplainInput { title: string; metricId?: string; selection?: LocalSelection | Record<string, unknown>; evidence?: string | string[]; }
export type WorkspaceRole = 'viewer' | 'merchant' | 'approver' | 'administrator';
export type DecisionDraft = DecisionRecord & { status: DecisionRecord['state'] };
export type Observation = DataObservation;
export interface Notice { id: string; message: string; tone: 'success' | 'warning' | 'danger' | 'neutral'; }
export interface WorkspaceContextValue {
  scope: Scope;
  dataset: Dataset;
  mode: Mode;
  route: WorkspaceRoute;
  /** Stable semantic identity for data, applied filters, role and saved context. */
  contextVersion: string;
  scopeRevision: number;
  setMode: (mode: Mode) => void;
  applyScope: (scope: Scope, options?: { access?: Scope['access']; role?: WorkspaceRole }) => void;
  patchScope: (patch: Partial<Scope>) => void;
  resetScope: () => void;
  resetDemo: () => void;
  localSelection: LocalSelection | null;
  setLocalSelection: (selection: LocalSelection | null) => void;
  captureViewConfiguration: () => ViewConfiguration;
  applyViewConfiguration: (snapshot: ViewConfiguration) => boolean;
  navigate: (target: WorkspaceRoute, options?: { scope?: Scope; localSelection?: LocalSelection | null; viewState?: Record<string, unknown> }) => void;
  back: () => void;
  canGoBack: boolean;
  getViewState: <T>(key: string, initial: T) => T;
  saveViewState: <T>(key: string, value: T) => void;
  cases: CaseRecord[];
  createCase: (input: Partial<CaseRecord> & { itemId: string; storeId: string }) => CaseRecord | null;
  updateCase: (id: string, patch: Partial<CaseRecord> & Record<string, unknown>) => void;
  drafts: DecisionDraft[];
  saveDraft: (draft: Partial<DecisionDraft> & Record<string, unknown>) => DecisionDraft | null;
  transitionDecision: (id: string, event: DecisionTransition) => DecisionDraft | null;
  session: SessionState;
  learnings: Learning[];
  saveLearning: (learning: Partial<Learning> & Record<string, unknown>) => void;
  observations: Observation[];
  addObservation: (observation: Partial<Observation> & { text: string }) => void;
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  can: (permission: string) => boolean;
  notices: Notice[];
  addNotice: (message: string, tone?: Notice['tone']) => void;
  dismissNotice: (id: string) => void;
  activePanel: 'filters' | 'definition' | 'customize' | 'saved' | null;
  setActivePanel: (panel: WorkspaceContextValue['activePanel']) => void;
  explainView: (input: ExplainInput) => void;
  openDefinition: (metricId: string) => void;
}
