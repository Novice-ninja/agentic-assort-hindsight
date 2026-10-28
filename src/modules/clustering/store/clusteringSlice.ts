import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { HttpError } from '@shared/services/http';
import type { LoadStatus } from '@shared/types';
import {
  approveClusterPlan,
  confirmVariants,
  createClusterPlan,
  createCustomVariant,
  deleteClusterPlans as deleteClusterPlansApi,
  generateVariants,
  getClusterVariants,
  getAttributes,
  getAuthMe,
  getStoreAssignments,
  getCandidates,
  getCandidateView,
  getCatalogues,
  getConfig,
  getGeneratedVariants,
  getPermissionScope,
  getPlan,
  getPlans,
  getPerformanceInfo,
  getClusterPlans,
  getKpiBreakdown,
  attributeInfoCacheKey,
  getAttributeInfo,
  getAttributeProductList,
  getReferencePeriods,
  getRun,
  getSelectedClusterPlanVariant,
  getSignificanceScore,
  getVariants,
  invokeRun,
  patchPlan,
  patchVariants,
  postSeasonInfos,
  postSignificanceScore,
  putStateTransition,
  putFinalAttributes,
  selectClusterPlanVariant,
  runClusterPlan,
  summarizeAttributeGrades,
  summarizeClusterPerformance,
  summarizeClusterVariants,
  type AttributeSignificanceScore,
  type AuthenticatedUser,
  type ClusterApprovalResponse,
  type ClusterRunRequest,
  type ClusterRunResponse,
  type CreateClusterPlanRequest,
  type Gate2Decision,
  type GenerateVariantsResponse,
  type AttributeInfoResponse,
  type AttributeProductListResponse,
  type ClusterPlansResponse,
  type KpiBreakdownResponse,
  type PerformanceInfoResponse,
  type SeasonInfosRequest,
  type StoreAssignmentsResponse,
  type SeasonInfosResponse,
  type PatchPlanBody,
} from '../api';
import {
  toFinalAttributesPayload,
  withAttributeOverrides,
} from '../services/finalAttributesPayload';
import {
  defaultFirstSelected,
  mapClusterRunCandidates,
} from '../services/mapClusterRunCandidates';
import {
  hasCustomVariant,
  mapGeneratedVariant,
  mapGeneratedVariants,
} from '../services/mapGeneratedVariants';
import { mapSignificanceScore } from '../services/mapSignificanceScore';
import {
  applyReferenceCoverage,
  initialReferenceCoverage,
} from '../services/referenceCoverage';
import {
  buildClusterVariantSummarizePayload,
  type ClusterVariantSummary,
} from '../services/clusterVariantSummary';
import { buildClusterPerformanceSummarizePayload } from '../services/clusterPerformanceSummary';
import { buildAttributeGradesSummarizePayload } from '../services/attributeGradesSummary';
import type {
  ApprovalGate,
  CandidateView,
  ClusterDraft,
  ClusterPlan,
  ClusterPlanTabKey,
  ClusterResultCandidate,
  ClusteringAttribute,
  ClusteringPermissionScope,
  ClusteringRun,
  ClusteringTenantConfig,
  ReferencePeriod,
  ScopeCatalogues,
  SignOffContext,
  Variant,
} from '../types';
import { emptyDraft, selectedPeriodIdsFromDraft } from '../types';

function rebalanceReferenceCoverage(
  state: ClusteringState,
  edited?: { key: string; value: number },
) {
  state.referenceCoverage = applyReferenceCoverage({
    seasonInfos: state.seasonInfos,
    checked: state.referencePeriodChecked,
    selectedKeys: state.selectedPeriodIds,
    coverage: state.referenceCoverage,
    edited,
  });
}

function samePeriodSelection(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((id) => right.includes(id));
}

function syncPeriodSelection(state: ClusteringState, draft: ClusterDraft | null) {
  if (!draft) {
    state.selectedPeriodIds = [];
    state.selectedPeriodId = null;
    state.overriddenPeriodIds = [];
    return;
  }
  const ids = selectedPeriodIdsFromDraft(draft);
  state.selectedPeriodIds = ids;
  state.selectedPeriodId = ids[0] ?? null;
  state.overriddenPeriodIds = draft.overriddenPeriodIds ?? [];
}

function applyDraft(state: ClusteringState, draft: ClusterDraft | null) {
  state.draft = draft
    ? {
        ...emptyDraft(draft.planId),
        ...draft,
        selectedPeriodIds: selectedPeriodIdsFromDraft(draft),
        overriddenPeriodIds: draft.overriddenPeriodIds ?? [],
      }
    : null;
  syncPeriodSelection(state, state.draft);
}

/**
 * Drops in-memory wizard session fields and keeps listing + tenant config.
 * Used on unmount, Create, and when opening another plan so visits never share step data.
 */
function clearWizardSession(state: ClusteringState) {
  state.draft = null;
  state.plan = null;
  state.attributes = [];
  state.variants = [];
  state.periods = [];
  state.insufficientHistory = false;
  state.run = null;
  state.candidates = [];
  state.view = null;
  state.gates = [];
  state.signOff = null;
  state.wizardStatus = 'idle';
  state.createStatus = 'idle';
  state.createError = undefined;
  state.attributeScore = null;
  state.attributeScoreStatus = 'idle';
  state.generatedVariants = null;
  state.generatedVariantsStatus = 'idle';
  state.customVariantAttributes = [];
  state.customVariantAttributesStatus = 'idle';
  state.customVariantSaveStatus = 'idle';
  state.clusterRun = null;
  state.clusterRunStatus = 'idle';
  state.variantSummary = null;
  state.clusterApproval = null;
  state.clusterApprovalStatus = 'idle';
  state.selectedVariant = null;
  state.selectedVariantStatus = 'idle';
  state.finalSignOffStatus = 'idle';
  state.approver = null;
  state.approverStatus = 'idle';
  state.gate2DecisionStatus = 'idle';
  state.finaliseStatus = 'idle';
  clearSeasonInfosState(state);
  state.selectedPeriodId = null;
  state.selectedPeriodIds = [];
  state.overriddenPeriodIds = [];
}

function wizardThunkCode(arg: unknown): string | undefined {
  if (typeof arg === 'string') return arg;
  if (typeof arg === 'object' && arg !== null && 'clusterPlanCode' in arg) {
    const code = (arg as { clusterPlanCode: unknown }).clusterPlanCode;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

/** True when this thunk belongs to the plan currently in the wizard. */
function isActiveWizardPlan(
  state: ClusteringState,
  clusterPlanCode: string | undefined,
): boolean {
  return Boolean(clusterPlanCode && state.draft?.clusterPlanCode === clusterPlanCode);
}

/** Skip a duplicate in-flight GET for this plan; never skip because another plan is loading. */
function shouldSkipWizardFetch(
  clustering: ClusteringState,
  clusterPlanCode: string,
  status: LoadStatus,
  loadedCode: string | undefined,
): boolean {
  if (status === 'loading' && clustering.draft?.clusterPlanCode === clusterPlanCode) {
    return true;
  }
  return status === 'succeeded' && loadedCode === clusterPlanCode;
}

const ZERO_COUNTS: Record<ClusterPlanTabKey, number> = {
  all: 0,
  awaitingApproval: 0,
  inputNeeded: 0,
  approved: 0,
};

/** One variant's store assignments request: status, the parsed response, and the error. */
export interface StoreAssignmentsEntry {
  status: LoadStatus;
  data: StoreAssignmentsResponse | null;
  error: string | null;
}

/** One variant's performance scatter request: status, the parsed response, and the error. */
export interface PerformanceInfoEntry {
  status: LoadStatus;
  data: PerformanceInfoResponse | null;
  error: string | null;
}

/** One variant's cluster-summary request: status, the parsed rows, and the error. */
export interface ClusterPlansEntry {
  status: LoadStatus;
  data: ClusterPlansResponse | null;
  error: string | null;
}

/** One variant's KPI breakdown request: status, the parsed rows, and the error. */
export interface KpiBreakdownEntry {
  status: LoadStatus;
  data: KpiBreakdownResponse | null;
  error: string | null;
}

/** One variant's attribute dropdown: status, the parsed options, and the error. */
export interface AttributeProductListEntry {
  status: LoadStatus;
  data: AttributeProductListResponse | null;
  error: string | null;
}

/** One variant + attribute grades chart: status, the parsed series, and the error. */
export interface AttributeInfoEntry {
  status: LoadStatus;
  data: AttributeInfoResponse | null;
  error: string | null;
}

/** Finalize "Cluster Plans" AI summary (`cardType: 'cluster_performance'`) for one variant. */
export interface ClusterPerformanceSummaryEntry {
  status: LoadStatus;
  data: string | null;
  error: string | null;
}

/** Finalize "Attribute Grades" AI summary (`cardType: 'cluster_attribute'`) for one chart. */
export interface AttributeGradesSummaryEntry {
  status: LoadStatus;
  data: string | null;
  error: string | null;
}

/** Finalize "3 Best" AI summary (`POST /v1/summarize`, `cardType: 'cluster'`) for one plan. */
export interface ClusterVariantSummaryEntry {
  clusterPlanCode: string;
  status: LoadStatus;
  data: ClusterVariantSummary | null;
  error: string | null;
}

export interface ClusteringState {
  plans: ClusterPlan[];
  tabCounts: Record<ClusterPlanTabKey, number>;
  listStatus: LoadStatus;
  activeTab: ClusterPlanTabKey;
  selectedPlanIds: string[];
  draft: ClusterDraft | null;
  plan: ClusterPlan | null;
  catalogues: ScopeCatalogues | null;
  attributes: ClusteringAttribute[];
  variants: Variant[];
  periods: ReferencePeriod[];
  insufficientHistory: boolean;
  selectedPeriodId: string | null;
  selectedPeriodIds: string[];
  overriddenPeriodIds: string[];
  run: ClusteringRun | null;
  candidates: ClusterResultCandidate[];
  view: CandidateView | null;
  gates: ApprovalGate[];
  signOff: SignOffContext | null;
  config: ClusteringTenantConfig | null;
  /** `GET` config + permission scope + catalogues. Skips a second load once succeeded. */
  configStatus: LoadStatus;
  scope: ClusteringPermissionScope | null;
  wizardStatus: LoadStatus;
  /** `POST /v1/clustering/plans` from the Scope step. `loading` blocks a second submit. */
  createStatus: LoadStatus;
  createError?: string;
  /**
   * Scope → Review: bodyless `POST .../significance-score/{code}`. Raw payload plus the
   * mapped checkbox rows. Tagged with the plan so a retry can skip a completed hop.
   */
  attributeScore: AttributeScoreResult | null;
  attributeScoreStatus: LoadStatus;
  /**
   * Result of Review & Run's "Confirm and Generate Variant": the variants POST body,
   * tagged with the plan it belongs to. `null` keeps Attribute Picks — Impact hidden.
   */
  generatedVariants: GeneratedVariantsResult | null;
  /** Covers the whole PUT → POST chain; `loading` blocks a second confirm. */
  generatedVariantsStatus: LoadStatus;
  /** GET significance-score catalog for the Custom Variant panel only. */
  customVariantAttributes: ClusteringAttribute[];
  customVariantAttributesStatus: LoadStatus;
  customVariantSaveStatus: LoadStatus;
  /**
   * Review & Run → Finalize: the complete `POST .../plans/{code}/runs` response, tagged with
   * the plan it belongs to. While it matches the draft's plan, `candidates` are derived from it
   * and the mock candidate endpoints are bypassed.
   */
  clusterRun: ClusterRunResult | null;
  /** Covers the whole PUT confirm → POST runs chain; `loading` blocks a second Finalise. */
  clusterRunStatus: LoadStatus;
  /**
   * Finalize → "3 Best — With Evidence": AI narration from `POST /v1/summarize` built from the
   * generated variants. Tagged with the plan; dropped whenever the variant set changes.
   */
  variantSummary: ClusterVariantSummaryEntry | null;
  /**
   * Sign-Off ("Sign-Off & Save" / "Save"): the complete `POST .../plans/{code}/approved`
   * response — the finally approved variant — tagged with the plan it belongs to.
   */
  clusterApproval: ClusterApprovalResult | null;
  /** `loading` blocks a second `/approved` request while one is in flight. */
  clusterApprovalStatus: LoadStatus;
  /**
   * Sign-Off Gate 2: `GET .../plans/{code}/selected-variant` for the variant the user
   * picked on Finalize. Tagged with the plan so a resume never shows another plan's winner.
   */
  selectedVariant: ClusterApprovalResult | null;
  selectedVariantStatus: LoadStatus;
  /**
   * Finalize → Sign-Off ("Final Sign Off"): `POST .../plans/{code}/selected-variant`
   * with `{ variantId }`. `loading` blocks a second click while it is in flight.
   */
  finalSignOffStatus: LoadStatus;
  /**
   * Sign-Off: the authenticated user from `GET /v1/auth/me`, shown as the Gate 3 approver.
   * Fetched when the Sign-Off step becomes active; never substituted with mock data.
   */
  approver: AuthenticatedUser | null;
  approverStatus: LoadStatus;
  /**
   * Finalize → Store Assignments panel: `POST /v1/clustering/plans/{code}/store_assignments`
   * per "3 Best" variant, keyed by `variantId`. Cleared whenever a new run replaces the cards.
   */
  storeAssignments: Record<string, StoreAssignmentsEntry>;
  /**
   * Finalize → Performance Clusters scatter: `POST /v1/clustering/performance/info`
   * per selected variant, keyed by `variantId`. Cleared with `storeAssignments`.
   */
  performanceInfo: Record<string, PerformanceInfoEntry>;
  clusterPlans: Record<string, ClusterPlansEntry>;
  /**
   * Finalize → Cluster Plans AI strip: `POST /v1/summarize` built from `clusterPlans`,
   * keyed by `variantId`. Cleared with `clusterPlans`.
   */
  clusterPerformanceSummary: Record<string, ClusterPerformanceSummaryEntry>;
  kpiBreakdown: Record<string, KpiBreakdownEntry>;
  /**
   * Finalize → Attribute Grades dropdown: `POST /v1/clustering/attributes/product-list`
   * per selected variant, keyed by `variantId`.
   */
  attributeProductList: Record<string, AttributeProductListEntry>;
  /**
   * Finalize → Attribute Grades chart: `POST /v1/clustering/attributes/info`
   * keyed by `variantId:attribute`. Cleared with `performanceInfo`.
   */
  attributeInfo: Record<string, AttributeInfoEntry>;
  /**
   * Finalize → Attribute Grades AI strip: `POST /v1/summarize` built from `attributeInfo`,
   * keyed by `variantId:attribute`. Cleared with `attributeInfo`.
   */
  attributeGradesSummary: Record<string, AttributeGradesSummaryEntry>;
  /**
   * Scope → Reference Period: `POST /v1/clustering/season_info` for the selected season,
   * keyed as the backend returns it (`ly`, `lly`, …). `seasonInfosSeasonCode` records which
   * season the data (or in-flight request) belongs to so a stale response is never applied.
   */
  seasonInfos: SeasonInfosResponse | null;
  seasonInfosStatus: LoadStatus;
  seasonInfosSeasonCode: number | null;
  /** User edits to a reference period's coverage %, keyed like `seasonInfos`. */
  referenceCoverage: Record<string, number>;
  /**
   * Per-card "include this reference period" checkbox, keyed like `seasonInfos`. Independent
   * of the dropdown (which only filters the visible cards). Missing key = checked.
   */
  referencePeriodChecked: Record<string, boolean>;
  /** Gate 2 Approve / Reject: `POST .../plans/state-transition/{code}` (`gate_2_approval`). */
  gate2DecisionStatus: LoadStatus;
  /** Gate 3 "Sign-Off & Save": `POST .../plans/{code}/approved` with the selected variantId. */
  finaliseStatus: LoadStatus;
}

export interface ClusterRunResult {
  clusterPlanCode: string;
  data: ClusterRunResponse;
}

export interface ClusterApprovalResult {
  clusterPlanCode: string;
  data: ClusterApprovalResponse;
}

/** True when the stored run belongs to the plan currently in the wizard. */
export function hasLiveClusterRun(state: ClusteringState): boolean {
  return (
    state.clusterRun !== null &&
    Boolean(state.draft?.clusterPlanCode) &&
    state.clusterRun.clusterPlanCode === state.draft?.clusterPlanCode
  );
}

/** True when the stored `/approved` response belongs to the plan currently in the wizard. */
export function hasLiveClusterApproval(state: ClusteringState): boolean {
  return (
    state.clusterApproval !== null &&
    Boolean(state.draft?.clusterPlanCode) &&
    state.clusterApproval.clusterPlanCode === state.draft?.clusterPlanCode
  );
}

/** True when GET selected-variant belongs to the plan currently in the wizard. */
export function hasLiveSelectedVariant(state: ClusteringState): boolean {
  return (
    state.selectedVariant !== null &&
    Boolean(state.draft?.clusterPlanCode) &&
    state.selectedVariant.clusterPlanCode === state.draft?.clusterPlanCode
  );
}

export interface AttributeScoreResult {
  clusterPlanCode: string;
  data: AttributeSignificanceScore;
}

export interface GeneratedVariantsResult {
  clusterPlanCode: string;
  data: GenerateVariantsResponse;
}

/** Which hop of the confirm chain failed, so the page can pick the matching message. */
export type ConfirmVariantsFailure = {
  stage: 'finalise' | 'generate';
  message?: string;
};

/** Which hop of Finalise Cluster failed (PUT confirm vs POST runs). */
export type ClusterRunFailure = {
  stage: 'confirm' | 'run';
  message?: string;
};

const initialState: ClusteringState = {
  plans: [],
  tabCounts: { ...ZERO_COUNTS },
  listStatus: 'idle',
  activeTab: 'all',
  selectedPlanIds: [],
  draft: null,
  plan: null,
  catalogues: null,
  attributes: [],
  variants: [],
  periods: [],
  insufficientHistory: false,
  selectedPeriodId: null,
  selectedPeriodIds: [],
  overriddenPeriodIds: [],
  run: null,
  candidates: [],
  view: null,
  gates: [],
  signOff: null,
  config: null,
  configStatus: 'idle',
  scope: null,
  wizardStatus: 'idle',
  createStatus: 'idle',
  attributeScore: null,
  attributeScoreStatus: 'idle',
  generatedVariants: null,
  generatedVariantsStatus: 'idle',
  customVariantAttributes: [],
  customVariantAttributesStatus: 'idle',
  customVariantSaveStatus: 'idle',
  clusterRun: null,
  clusterRunStatus: 'idle',
  variantSummary: null,
  clusterApproval: null,
  clusterApprovalStatus: 'idle',
  selectedVariant: null,
  selectedVariantStatus: 'idle',
  finalSignOffStatus: 'idle',
  approver: null,
  approverStatus: 'idle',
  storeAssignments: {},
  performanceInfo: {},
  clusterPlans: {},
  clusterPerformanceSummary: {},
  kpiBreakdown: {},
  attributeProductList: {},
  attributeInfo: {},
  attributeGradesSummary: {},
  seasonInfos: null,
  seasonInfosStatus: 'idle',
  seasonInfosSeasonCode: null,
  referenceCoverage: {},
  referencePeriodChecked: {},
  gate2DecisionStatus: 'idle',
  finaliseStatus: 'idle',
};

function clearSeasonInfosState(state: ClusteringState) {
  state.seasonInfos = null;
  state.seasonInfosStatus = 'idle';
  state.seasonInfosSeasonCode = null;
  state.referenceCoverage = {};
  state.referencePeriodChecked = {};
}

export const deleteClusterPlans = createAsyncThunk(
  'clustering/deleteClusterPlans',
  async (clusterPlanCodes: string[]) => {
    const response = await deleteClusterPlansApi(clusterPlanCodes);
    const deleted = new Set(
      response.results.filter((result) => result.deleted).map((result) => result.clusterPlanCode),
    );
    const requested = clusterPlanCodes.map((code) => code.trim()).filter((code) => code.length > 0);
    if (requested.length === 0 || requested.some((code) => !deleted.has(code))) {
      throw new Error('Failed to delete cluster plans');
    }
    return requested;
  },
);

export const fetchPlans = createAsyncThunk(
  'clustering/fetchPlans',
  async () => getPlans(),
  {
  condition: (_, { getState }) => {
    const { clustering } = getState() as { clustering: ClusteringState };
    return clustering.listStatus !== 'loading';
  },
  },
);

export const fetchConfigAndScope = createAsyncThunk(
  'clustering/fetchConfigAndScope',
  async () => {
  const [config, scope, catalogues] = await Promise.all([
    getConfig(),
    getPermissionScope(),
    getCatalogues(),
  ]);
  return { config, scope, catalogues };
  },
  {
    condition: (_, { getState }) => {
      const { configStatus } = (getState() as { clustering: ClusteringState }).clustering;
      return configStatus !== 'loading' && configStatus !== 'succeeded';
    },
  },
);

export const fetchPlanDetail = createAsyncThunk(
  'clustering/fetchPlanDetail',
  async (planId: string) => {
  const detail = await getPlan(planId);
  const [attributes, variants, periods] = await Promise.all([
    getAttributes(planId),
    getVariants(planId),
    getReferencePeriods(planId),
  ]);
    return {
      detail,
      attributes: attributes.attributes,
      variants: variants.variants,
      periods,
    };
  },
);

/**
 * Creates the cluster plan on the backend when Scope is submitted. Mirrors planning's
 * `submitPlan`: failures become a `rejectWithValue` message for the toast, and `condition`
 * refuses to start while a previous request is still in flight.
 */
export const submitClusterPlan = createAsyncThunk(
  'clustering/submitClusterPlan',
  async (body: CreateClusterPlanRequest, { rejectWithValue }) => {
    try {
      return await createClusterPlan(body);
    } catch (err) {
      // HTTP / network failures carry a user-facing message from `apiClient`; a malformed
      // body does not, and the page falls back to the translated generic text.
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.createStatus !== 'loading';
    },
  },
);

/**
 * Second hop of the Scope submit: bodyless POST significance-score for the plan the create
 * call returned. Same failure contract as `submitClusterPlan` so the page can toast the message.
 */
export const loadAttributeSignificance = createAsyncThunk(
  'clustering/loadAttributeSignificance',
  async (clusterPlanCode: string, { rejectWithValue }) => {
    try {
      const data = await postSignificanceScore(clusterPlanCode);
      return {
        clusterPlanCode,
        data,
        attributes: mapSignificanceScore(data),
      };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.attributeScoreStatus !== 'loading';
    },
  },
);

/** Resume Review: GET significance-score. Does not POST. */
export const fetchAttributeSignificance = createAsyncThunk(
  'clustering/fetchAttributeSignificance',
  async (clusterPlanCode: string, { rejectWithValue }) => {
    try {
      const data = await getSignificanceScore(clusterPlanCode);
      return {
        clusterPlanCode,
        data,
        attributes: mapSignificanceScore(data),
      };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (clusterPlanCode, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return !shouldSkipWizardFetch(
        clustering,
        clusterPlanCode,
        clustering.attributeScoreStatus,
        clustering.attributeScore?.clusterPlanCode,
      );
    },
  },
);

/** Resume Review Attribute Picks: GET already-generated variants. */
export const fetchGeneratedVariants = createAsyncThunk(
  'clustering/fetchGeneratedVariants',
  async (clusterPlanCode: string, { rejectWithValue }) => {
    try {
      const data = await getGeneratedVariants(clusterPlanCode);
      return { clusterPlanCode, data, variants: mapGeneratedVariants(data) };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (clusterPlanCode, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return !shouldSkipWizardFetch(
        clustering,
        clusterPlanCode,
        clustering.generatedVariantsStatus,
        clustering.generatedVariants?.clusterPlanCode,
      );
    },
  },
);

/** Resume Sign-Off: GET selected-variant for the Gate 2 winner panel. */
export const fetchSelectedVariant = createAsyncThunk(
  'clustering/fetchSelectedVariant',
  async (clusterPlanCode: string, { rejectWithValue }) => {
    try {
      const data = await getSelectedClusterPlanVariant(clusterPlanCode);
      return { clusterPlanCode, data };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (clusterPlanCode, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return !shouldSkipWizardFetch(
        clustering,
        clusterPlanCode,
        clustering.selectedVariantStatus,
        clustering.selectedVariant?.clusterPlanCode,
      );
    },
  },
);

/** Resume Finalize: GET cluster-variants (same body as POST runs). */
export const fetchClusterVariants = createAsyncThunk(
  'clustering/fetchClusterVariants',
  async (clusterPlanCode: string, { rejectWithValue }) => {
    try {
      const data = await getClusterVariants(clusterPlanCode);
      return { clusterPlanCode, data };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (clusterPlanCode, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return !shouldSkipWizardFetch(
        clustering,
        clusterPlanCode,
        clustering.clusterRunStatus,
        clustering.clusterRun?.clusterPlanCode,
      );
    },
  },
);

/**
 * Review & Run → "Confirm and Generate Variant". Strictly sequential: PUT the current
 * checkbox selection, then bodyless POST for variants. One thunk / one status means a
 * single in-flight guard covers both hops.
 */
export const confirmAndGenerateVariants = createAsyncThunk<
  GeneratedVariantsResult & { variants: Variant[] },
  string,
  { rejectValue: ConfirmVariantsFailure }
>(
  'clustering/confirmAndGenerateVariants',
  async (clusterPlanCode, { getState, rejectWithValue }) => {
    const messageOf = (err: unknown) =>
      err instanceof HttpError ? err.message : undefined;
    const { clustering } = getState() as { clustering: ClusteringState };
    const body = toFinalAttributesPayload(
      withAttributeOverrides(clustering.attributes, clustering.draft?.attributeOverrides),
    );
    try {
      await putFinalAttributes(clusterPlanCode, body);
    } catch (err) {
      return rejectWithValue({ stage: 'finalise', message: messageOf(err) });
    }
    try {
      const data = await generateVariants(clusterPlanCode);
      return { clusterPlanCode, data, variants: mapGeneratedVariants(data) };
    } catch (err) {
      return rejectWithValue({ stage: 'generate', message: messageOf(err) });
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.generatedVariantsStatus !== 'loading';
    },
  },
);

/** Custom Variant panel open: one GET significance-score. Does not touch Review checkboxes. */
export const loadCustomVariantAttributes = createAsyncThunk(
  'clustering/loadCustomVariantAttributes',
  async (clusterPlanCode: string, { rejectWithValue }) => {
    try {
      const data = await getSignificanceScore(clusterPlanCode);
      return { clusterPlanCode, attributes: mapSignificanceScore(data) };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.customVariantAttributesStatus !== 'loading';
    },
  },
);

/** Custom Variant Save: POST .../variants/custom, then append the card. */
export const saveCustomVariant = createAsyncThunk(
  'clustering/saveCustomVariant',
  async (
    { clusterPlanCode, selectedIds }: { clusterPlanCode: string; selectedIds: string[] },
    { getState, rejectWithValue },
  ) => {
    const { clustering } = getState() as { clustering: ClusteringState };
    const selected = clustering.customVariantAttributes.map((attr) => ({
      ...attr,
      userSelected: selectedIds.includes(attr.id),
    }));
    try {
      const dto = await createCustomVariant({
        clusterPlanCode,
        ...toFinalAttributesPayload(selected),
      });
      return mapGeneratedVariant(dto);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return (
        clustering.customVariantSaveStatus !== 'loading' &&
        !hasCustomVariant(clustering.variants)
      );
    },
  },
);

/**
 * Review & Run → "Finalise Cluster". Strictly sequential: PUT the kept variant ids, then
 * POST .../plans/{code}/runs. One thunk / one status means a single in-flight guard covers
 * both hops.
 */
export const submitClusterRun = createAsyncThunk<
  { clusterPlanCode: string; data: ClusterRunResponse },
  { clusterPlanCode: string; body: ClusterRunRequest },
  { rejectValue: ClusterRunFailure }
>(
  'clustering/submitClusterRun',
  async ({ clusterPlanCode, body }, { getState, rejectWithValue }) => {
    const messageOf = (err: unknown) =>
      err instanceof HttpError ? err.message : undefined;
    const { clustering } = getState() as { clustering: ClusteringState };
    const variantIds = clustering.variants
      .filter((variant) => !variant.removed)
      .map((variant) => variant.id);
    try {
      await confirmVariants(clusterPlanCode, { variantIds });
    } catch (err) {
      return rejectWithValue({ stage: 'confirm', message: messageOf(err) });
    }
    try {
      const data = await runClusterPlan(clusterPlanCode, body);
      return { clusterPlanCode, data };
    } catch (err) {
      return rejectWithValue({ stage: 'run', message: messageOf(err) });
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.clusterRunStatus !== 'loading';
    },
  },
);

/**
 * Finalize → "3 Best — With Evidence": `POST /v1/summarize` with `cardType: 'cluster'` and the
 * `variants` list exactly as `GET …/plans/{code}/cluster-variants` returned it (reused from the
 * stored run, otherwise fetched here). One request per plan; a stored success is reused until a
 * new run replaces the cards. Pass `force` to regenerate.
 */
export const fetchClusterVariantsSummary = createAsyncThunk<
  { clusterPlanCode: string; data: ClusterVariantSummary },
  { clusterPlanCode: string; force?: boolean },
  { rejectValue: string | null }
>(
  'clustering/fetchClusterVariantsSummary',
  async ({ clusterPlanCode }, { getState, rejectWithValue }) => {
    try {
      const { clustering } = getState() as { clustering: ClusteringState };
      const run =
        clustering.clusterRun?.clusterPlanCode === clusterPlanCode
          ? clustering.clusterRun.data
          : await getClusterVariants(clusterPlanCode);
      const payload = buildClusterVariantSummarizePayload({
        clusterPlanCode,
        run,
        plan: clustering.plan,
      });
      if (!payload) return rejectWithValue(null);
      const data = await summarizeClusterVariants(payload);
      return { clusterPlanCode, data };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ clusterPlanCode, force }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.variantSummary;
      if (entry?.clusterPlanCode !== clusterPlanCode) return true;
      if (entry.status === 'loading') return false;
      if (force) return true;
      return entry.status !== 'succeeded';
    },
  },
);

/**
 * Finalize → "Final Sign Off": `POST .../plans/{code}/selected-variant` with the selected
 * card's `variantId`. Same failure contract as the other wizard hops; `condition` refuses a
 * second click while one request is in flight.
 */
export const submitFinalSignOff = createAsyncThunk(
  'clustering/submitFinalSignOff',
  async (
    { clusterPlanCode, variantId }: { clusterPlanCode: string; variantId: string },
    { rejectWithValue },
  ) => {
    try {
      return await selectClusterPlanVariant(clusterPlanCode, { variantId });
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.finalSignOffStatus !== 'loading';
    },
  },
);

/**
 * Sign-Off → "Save": `POST .../plans/{code}/approved` with the selected card's `variantId`;
 * the listing is opened only once it succeeds. `condition` refuses a second click while one
 * request is in flight.
 */
export const submitClusterApproval = createAsyncThunk(
  'clustering/submitClusterApproval',
  async (
    { clusterPlanCode, variantId }: { clusterPlanCode: string; variantId: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await approveClusterPlan(clusterPlanCode, { variantId });
      return { clusterPlanCode, data };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.clusterApprovalStatus !== 'loading';
    },
  },
);

/**
 * Scope → Reference Period: `POST /v1/clustering/season_info` with the selected season's
 * `seasonCode` + raw `name`. `condition` skips the call when the same season is already
 * loading or loaded, so re-renders never fan out into duplicate requests; a different season
 * always refetches.
 */
export const fetchSeasonInfos = createAsyncThunk(
  'clustering/fetchSeasonInfos',
  async (body: SeasonInfosRequest, { rejectWithValue }) => {
    try {
      return await postSeasonInfos(body);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (body, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      if (clustering.seasonInfosSeasonCode !== body.seasonCode) return true;
      return (
        clustering.seasonInfosStatus !== 'loading' &&
        clustering.seasonInfosStatus !== 'succeeded'
      );
    },
  },
);

/**
 * Gate 2 Approve / Reject: `POST .../plans/state-transition/{code}` with
 * `{ section: 'gate_2_approval', decision }`. `actionedBy` is the signed-in approver (from
 * `/auth/me`) used for the local gate audit row.
 */
export const submitGate2Decision = createAsyncThunk(
  'clustering/submitGate2Decision',
  async (
    {
      clusterPlanCode,
      decision,
    }: { clusterPlanCode: string; decision: Gate2Decision; actionedBy: string | null },
    { rejectWithValue },
  ) => {
    try {
      return await putStateTransition(clusterPlanCode, {
        section: 'gate_2_approval',
        decision,
      });
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.gate2DecisionStatus !== 'loading';
    },
  },
);

/**
 * Gate 3 "Sign-Off & Save": `POST .../plans/{code}/approved` with the selected card's
 * `variantId`, then the existing post-sign-off flow (gate 3 audit row, plan locked, listing).
 */
export const submitFinalise = createAsyncThunk(
  'clustering/submitFinalise',
  async (
    {
      clusterPlanCode,
      variantId,
    }: { clusterPlanCode: string; variantId: string; actionedBy: string | null },
    { rejectWithValue },
  ) => {
    try {
      const data = await approveClusterPlan(clusterPlanCode, { variantId });
      return { clusterPlanCode, data };
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (_, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      return clustering.finaliseStatus !== 'loading';
    },
  },
);

/** Upserts the local audit row for a gate after the backend accepted the decision. */
function setGate(
  state: ClusteringState,
  gate: ApprovalGate['gate'],
  status: ApprovalGate['status'],
  actionedBy: string | null,
) {
  const planId = state.draft?.planId ?? state.plan?.id ?? '';
  const next: ApprovalGate = {
    planId,
    gate,
    status,
    actionedBy,
    actionedOn: new Date().toISOString(),
  };
  const idx = state.gates.findIndex((g) => g.gate === gate);
  if (idx >= 0) state.gates[idx] = { ...state.gates[idx], ...next };
  else state.gates.push(next);
}

/**
 * Sign-Off: `GET /v1/auth/me`. The response is the single authenticated user and is treated
 * as the approver to display. Skipped while a request is in flight or already succeeded so
 * re-renders never fan out into duplicate calls. Retry passes `{ force: true }`.
 */
export const fetchApprover = createAsyncThunk(
  'clustering/fetchApprover',
  async (_arg: { force?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await getAuthMe();
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: (arg, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      if (clustering.approverStatus === 'loading') return false;
      if (arg?.force) return true;
      return clustering.approverStatus !== 'succeeded';
    },
  },
);

/**
 * Finalize → Store Assignments panel: one request per variant tab (and all variants for
 * "Compare All"). Skipped while that variant's request is in flight; a stored success is
 * reused until a new run replaces the cards, so re-opening the panel never refetches.
 * Pass `force` after `move_stores` so the panel reloads the updated assignment.
 */
export const fetchStoreAssignments = createAsyncThunk(
  'clustering/fetchStoreAssignments',
  async (
    {
      clusterPlanCode,
      variantId,
    }: { clusterPlanCode: string; variantId: string; force?: boolean },
    { rejectWithValue },
  ) => {
    try {
      return await getStoreAssignments(clusterPlanCode, variantId);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId, force }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.storeAssignments[variantId];
      if (entry?.status === 'loading') return false;
      if (force) return true;
      return entry?.status !== 'succeeded';
    },
  },
);

/**
 * Finalize → Performance Clusters scatter: one request per selected variant. Skipped while
 * that variant's request is in flight or already succeeded so axis changes never refetch.
 */
export const fetchPerformanceInfo = createAsyncThunk(
  'clustering/fetchPerformanceInfo',
  async (
    { clusterPlanCode, variantId }: { clusterPlanCode: string; variantId: string },
    { rejectWithValue },
  ) => {
    try {
      return await getPerformanceInfo(clusterPlanCode, variantId);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.performanceInfo[variantId];
      if (entry?.status === 'loading') return false;
      return entry?.status !== 'succeeded';
    },
  },
);

/**
 * Finalize → Cluster Summary: one request per selected variant. Skipped while that
 * variant's request is in flight or already succeeded.
 */
export const fetchClusterPlans = createAsyncThunk(
  'clustering/fetchClusterPlans',
  async (
    { clusterPlanCode, variantId }: { clusterPlanCode: string; variantId: string },
    { rejectWithValue },
  ) => {
    try {
      return await getClusterPlans(clusterPlanCode, variantId);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.clusterPlans[variantId];
      if (entry?.status === 'loading') return false;
      return entry?.status !== 'succeeded';
    },
  },
);

/**
 * Finalize → Cluster Plans AI strip: `POST /v1/summarize` with `cardType: 'cluster_performance'`
 * built from that variant's `get-cluster-plans` rows (fetched here if not already stored). One
 * request per variant; a stored success is reused until a new run replaces the cards. Pass
 * `force` to regenerate.
 */
export const fetchClusterPerformanceSummary = createAsyncThunk<
  string | null,
  { clusterPlanCode: string; variantId: string; force?: boolean },
  { rejectValue: string | null }
>(
  'clustering/fetchClusterPerformanceSummary',
  async ({ clusterPlanCode, variantId }, { getState, rejectWithValue }) => {
    try {
      const { clustering } = getState() as { clustering: ClusteringState };
      const plans =
        clustering.clusterPlans[variantId]?.data ??
        (await getClusterPlans(clusterPlanCode, variantId));
      const payload = buildClusterPerformanceSummarizePayload(plans);
      if (!payload) return rejectWithValue(null);
      return await summarizeClusterPerformance(payload);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId, force }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.clusterPerformanceSummary[variantId];
      if (entry?.status === 'loading') return false;
      if (force) return true;
      return entry?.status !== 'succeeded';
    },
  },
);

/**
 * Finalize → Full KPI Breakdown: one request per selected variant. Skipped while that
 * variant's request is in flight or already succeeded.
 */
/**
 * Finalize → Attribute Grades dropdown: one request per selected variant.
 * Skipped while that variant's request is in flight or already succeeded.
 */
export const fetchAttributeProductList = createAsyncThunk(
  'clustering/fetchAttributeProductList',
  async (
    { clusterPlanCode, variantId }: { clusterPlanCode: string; variantId: string },
    { rejectWithValue },
  ) => {
    try {
      return await getAttributeProductList(clusterPlanCode, variantId);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.attributeProductList[variantId];
      if (entry?.status === 'loading') return false;
      return entry?.status !== 'succeeded';
    },
  },
);

/**
 * Finalize → Attribute Grades chart: one request per variant and attribute.
 * Skipped while that pair is in flight or already succeeded.
 */
export const fetchAttributeInfo = createAsyncThunk(
  'clustering/fetchAttributeInfo',
  async (
    {
      clusterPlanCode,
      variantId,
      attribute,
    }: { clusterPlanCode: string; variantId: string; attribute: string },
    { rejectWithValue },
  ) => {
    try {
      return await getAttributeInfo(clusterPlanCode, variantId, attribute);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId, attribute }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.attributeInfo[attributeInfoCacheKey(variantId, attribute)];
      if (entry?.status === 'loading') return false;
      return entry?.status !== 'succeeded';
    },
  },
);

/**
 * Finalize → Attribute Grades AI strip: `POST /v1/summarize` with `cardType: 'cluster_attribute'`
 * built from that variant + attribute's `attributes/info` chart (fetched here if not already
 * stored). One request per chart; a stored success is reused until a new run replaces the
 * cards. Pass `force` to regenerate.
 */
export const fetchAttributeGradesSummary = createAsyncThunk<
  string | null,
  { clusterPlanCode: string; variantId: string; attribute: string; force?: boolean },
  { rejectValue: string | null }
>(
  'clustering/fetchAttributeGradesSummary',
  async ({ clusterPlanCode, variantId, attribute }, { getState, rejectWithValue }) => {
    try {
      const { clustering } = getState() as { clustering: ClusteringState };
      const info =
        clustering.attributeInfo[attributeInfoCacheKey(variantId, attribute)]?.data ??
        (await getAttributeInfo(clusterPlanCode, variantId, attribute));
      const payload = buildAttributeGradesSummarizePayload(info);
      if (!payload) return rejectWithValue(null);
      return await summarizeAttributeGrades(payload);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId, attribute, force }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.attributeGradesSummary[attributeInfoCacheKey(variantId, attribute)];
      if (entry?.status === 'loading') return false;
      if (force) return true;
      return entry?.status !== 'succeeded';
    },
  },
);

export const fetchKpiBreakdown = createAsyncThunk(
  'clustering/fetchKpiBreakdown',
  async (
    { clusterPlanCode, variantId }: { clusterPlanCode: string; variantId: string },
    { rejectWithValue },
  ) => {
    try {
      return await getKpiBreakdown(clusterPlanCode, variantId);
    } catch (err) {
      return rejectWithValue(err instanceof HttpError ? err.message : null);
    }
  },
  {
    condition: ({ variantId }, { getState }) => {
      const { clustering } = getState() as { clustering: ClusteringState };
      const entry = clustering.kpiBreakdown[variantId];
      if (entry?.status === 'loading') return false;
      return entry?.status !== 'succeeded';
    },
  },
);

export const savePlanDraft = createAsyncThunk(
  'clustering/savePlanDraft',
  async ({ planId, body }: { planId: string; body: PatchPlanBody }) =>
    patchPlan(planId, body),
);

export const saveVariants = createAsyncThunk(
  'clustering/saveVariants',
  async ({ planId, variants }: { planId: string; variants: Variant[] }) =>
    patchVariants(planId, variants),
);

export const startRun = createAsyncThunk('clustering/startRun', async (planId: string) =>
  invokeRun(planId),
);

export const pollRun = createAsyncThunk(
  'clustering/pollRun',
  async ({ planId, runId }: { planId: string; runId: string }) => getRun(planId, runId),
);

export const fetchCandidates = createAsyncThunk(
  'clustering/fetchCandidates',
  async (planId: string) => getCandidates(planId),
);

export const fetchCandidateView = createAsyncThunk(
  'clustering/fetchCandidateView',
  async ({ planId, candidateId }: { planId: string; candidateId: string }) =>
    getCandidateView(planId, candidateId),
);

const clusteringSlice = createSlice({
  name: 'clustering',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<ClusterPlanTabKey>) {
      state.activeTab = action.payload;
      state.selectedPlanIds = [];
    },
    setSelectedPlanIds(state, action: PayloadAction<string[]>) {
      state.selectedPlanIds = action.payload;
    },
    setPlan(state, action: PayloadAction<ClusterPlan | null>) {
      state.plan = action.payload;
    },
    setDraft(state, action: PayloadAction<ClusterDraft | null>) {
      applyDraft(state, action.payload);
    },
    /** Clears leftover step data and applies a listing snapshot in one turn. */
    openResumedPlan(
      state,
      action: PayloadAction<{ plan: ClusterPlan; draft: ClusterDraft }>,
    ) {
      clearWizardSession(state);
      state.plan = action.payload.plan;
      applyDraft(state, action.payload.draft);
    },
    patchDraft(state, action: PayloadAction<Partial<ClusterDraft>>) {
      if (!state.draft) state.draft = emptyDraft(action.payload.planId ?? 'new');
      state.draft = {
        ...state.draft,
        selectedPeriodIds: state.draft.selectedPeriodIds ?? [],
        overriddenPeriodIds: state.draft.overriddenPeriodIds ?? [],
        ...action.payload,
      };
      if (
        action.payload.selectedPeriodIds !== undefined ||
        action.payload.selectedPeriodId !== undefined ||
        action.payload.overriddenPeriodIds !== undefined
      ) {
        const previous = state.selectedPeriodIds;
        syncPeriodSelection(state, state.draft);
        if (
          (action.payload.selectedPeriodIds !== undefined ||
            action.payload.selectedPeriodId !== undefined) &&
          !samePeriodSelection(previous, state.selectedPeriodIds)
        ) {
          rebalanceReferenceCoverage(state);
        }
      }
    },
    setSelectedPeriodId(state, action: PayloadAction<string | null>) {
      const previous = state.selectedPeriodIds;
      state.selectedPeriodId = action.payload;
      state.selectedPeriodIds = action.payload ? [action.payload] : [];
      if (state.draft) {
        state.draft.selectedPeriodId = action.payload;
        state.draft.selectedPeriodIds = state.selectedPeriodIds;
      }
      if (!samePeriodSelection(previous, state.selectedPeriodIds)) {
        rebalanceReferenceCoverage(state);
      }
    },
    setSelectedPeriodIds(state, action: PayloadAction<string[]>) {
      const previous = state.selectedPeriodIds;
      state.selectedPeriodIds = action.payload;
      state.selectedPeriodId = action.payload[0] ?? null;
      if (state.draft) {
        state.draft.selectedPeriodIds = action.payload;
        state.draft.selectedPeriodId = state.selectedPeriodId;
      }
      if (!samePeriodSelection(previous, state.selectedPeriodIds)) {
        rebalanceReferenceCoverage(state);
      }
    },
    setOverriddenPeriodIds(state, action: PayloadAction<string[]>) {
      state.overriddenPeriodIds = action.payload;
      if (state.draft) state.draft.overriddenPeriodIds = action.payload;
    },
    /** No season selected: drop reference-period data so nothing stale can render. */
    clearSeasonInfos(state) {
      clearSeasonInfosState(state);
    },
    /** Coverage % edited on a reference period card (initialised from `seasonCoverage`). */
    setReferenceCoverage(state, action: PayloadAction<{ key: string; value: number }>) {
      rebalanceReferenceCoverage(state, action.payload);
    },
    /** Include / exclude a reference period via its card checkbox; never touches the dropdown. */
    setReferencePeriodChecked(
      state,
      action: PayloadAction<{ key: string; checked: boolean }>,
    ) {
      state.referencePeriodChecked[action.payload.key] = action.payload.checked;
      rebalanceReferenceCoverage(state);
    },
    setVariants(state, action: PayloadAction<Variant[]>) {
      state.variants = action.payload;
    },
    /** Selects one of the run-derived "3 Best" cards locally (no mock selection endpoint). */
    selectRunCandidate(state, action: PayloadAction<string>) {
      state.candidates = state.candidates.map((candidate) => ({
        ...candidate,
        selected: candidate.id === action.payload,
      }));
      if (state.draft) state.draft.selectedCandidateId = action.payload;
    },
    resetWizard(state) {
      clearWizardSession(state);
      state.draft = null;
      state.plan = null;
      state.attributes = [];
      state.variants = [];
      state.periods = [];
      state.run = null;
      state.candidates = [];
      state.view = null;
      state.gates = [];
      state.wizardStatus = 'idle';
      state.createStatus = 'idle';
      state.createError = undefined;
      state.attributeScore = null;
      state.attributeScoreStatus = 'idle';
      state.generatedVariants = null;
      state.generatedVariantsStatus = 'idle';
      state.customVariantAttributes = [];
      state.customVariantAttributesStatus = 'idle';
      state.customVariantSaveStatus = 'idle';
      state.clusterRun = null;
      state.clusterRunStatus = 'idle';
      state.clusterApproval = null;
      state.clusterApprovalStatus = 'idle';
      state.finalSignOffStatus = 'idle';
      state.approver = null;
      state.approverStatus = 'idle';
      state.storeAssignments = {};
      state.performanceInfo = {};
      state.clusterPlans = {};
      state.clusterPerformanceSummary = {};
      state.kpiBreakdown = {};
      state.attributeProductList = {};
      state.attributeInfo = {};
      state.attributeGradesSummary = {};
      state.gate2DecisionStatus = 'idle';
      state.finaliseStatus = 'idle';
      clearSeasonInfosState(state);
      state.selectedPeriodId = null;
      state.selectedPeriodIds = [];
      state.overriddenPeriodIds = [];
    },
    patchClusterPlanSuggestedName(
      state,
      action: PayloadAction<{ variantId: string; clusterName: string; suggestedName: string }>,
    ) {
      const entry = state.clusterPlans[action.payload.variantId];
      const row = entry?.data?.data.find(
        (item) =>
          item.originalClusterName === action.payload.clusterName ||
          item.clusterName === action.payload.clusterName,
      );
      if (row) row.clusterName = action.payload.suggestedName;
    },
    /**
     * Drop a previous Gate 2 payload so the next Sign-Off landing refetches selected-variant.
     * A request already in flight is left alone — resetting it to idle would start a second GET.
     */
    clearSelectedVariant(state) {
      if (state.selectedVariantStatus === 'loading') return;
      state.selectedVariant = null;
      state.selectedVariantStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.plans = action.payload.plans;
        state.tabCounts = action.payload.counts;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        if (action.meta.condition || action.meta.aborted) return;
        state.listStatus = 'failed';
        state.plans = [];
        state.tabCounts = { ...ZERO_COUNTS };
      })
      .addCase(fetchConfigAndScope.pending, (state) => {
        state.configStatus = 'loading';
      })
      .addCase(fetchConfigAndScope.fulfilled, (state, action) => {
        state.configStatus = 'succeeded';
        state.config = {
          significanceCutoff: action.payload.config.significanceCutoff,
          newStoreExclusionWeeks: action.payload.config.newStoreExclusionWeeks,
          startingPoints: action.payload.config.startingPoints,
          kValueCount: action.payload.config.kValueCount,
        };
        state.scope = action.payload.scope;
        state.catalogues = action.payload.catalogues;
      })
      .addCase(fetchConfigAndScope.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.configStatus = 'failed';
      })
      .addCase(fetchPlanDetail.pending, (state) => {
        state.wizardStatus = 'loading';
      })
      .addCase(fetchPlanDetail.fulfilled, (state, action) => {
        state.wizardStatus = 'succeeded';
        state.plan = action.payload.detail.plan;
        state.draft = {
          ...emptyDraft(action.payload.detail.draft.planId),
          ...action.payload.detail.draft,
          selectedPeriodIds: selectedPeriodIdsFromDraft(action.payload.detail.draft),
          overriddenPeriodIds: action.payload.detail.draft.overriddenPeriodIds ?? [],
        };
        state.gates = action.payload.detail.gates;
        state.signOff = action.payload.detail.signOff;
        // Mock getAttributes must not clobber the live significance-score rows.
        if (state.attributeScoreStatus !== 'succeeded' || !state.attributeScore) {
        state.attributes = action.payload.attributes;
        }
        // Mock getVariants must not clobber cards produced by Confirm.
        if (state.generatedVariantsStatus !== 'succeeded' || !state.generatedVariants) {
        state.variants = action.payload.variants;
        }
        state.periods = action.payload.periods.periods;
        state.insufficientHistory = action.payload.periods.insufficientHistory;
        syncPeriodSelection(state, state.draft);
      })
      .addCase(fetchPlanDetail.rejected, (state) => {
        state.wizardStatus = 'failed';
      })
      .addCase(submitClusterPlan.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = undefined;
      })
      .addCase(submitClusterPlan.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        if (state.draft) state.draft.clusterPlanCode = action.payload.clusterPlanCode;
      })
      .addCase(submitClusterPlan.rejected, (state, action) => {
        // A `condition` refusal is not a failure of the request that is still running.
        if (action.meta.condition) return;
        state.createStatus = 'failed';
        state.createError =
          typeof action.payload === 'string'
            ? action.payload
            : (action.error.message ?? undefined);
      })
      .addCase(loadAttributeSignificance.pending, (state, action) => {
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.attributeScoreStatus = 'loading';
      })
      .addCase(loadAttributeSignificance.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.attributeScoreStatus = 'succeeded';
        state.attributeScore = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        state.attributes = action.payload.attributes;
      })
      .addCase(loadAttributeSignificance.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.attributeScoreStatus = 'failed';
      })
      .addCase(fetchAttributeSignificance.pending, (state, action) => {
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.attributeScoreStatus = 'loading';
      })
      .addCase(fetchAttributeSignificance.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.attributeScoreStatus = 'succeeded';
        state.attributeScore = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        state.attributes = action.payload.attributes;
      })
      .addCase(fetchAttributeSignificance.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.attributeScoreStatus = 'failed';
      })
      .addCase(fetchGeneratedVariants.pending, (state, action) => {
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.generatedVariantsStatus = 'loading';
      })
      .addCase(fetchGeneratedVariants.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.generatedVariantsStatus = 'succeeded';
        state.generatedVariants = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        state.variants = action.payload.variants;
      })
      .addCase(fetchGeneratedVariants.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.generatedVariantsStatus = 'failed';
      })
      .addCase(fetchClusterVariants.pending, (state, action) => {
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.clusterRunStatus = 'loading';
      })
      .addCase(fetchClusterVariants.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.clusterRunStatus = 'succeeded';
        state.clusterRun = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        const mapped = mapClusterRunCandidates(action.payload.data, {
          planId: state.draft?.planId ?? state.plan?.id ?? '',
          selectedId: state.draft?.selectedCandidateId,
        });
        state.candidates = mapped;
        if (state.draft) {
          state.draft.selectedCandidateId =
            mapped.find((candidate) => candidate.selected)?.id ?? null;
        }
        state.view = null;
      })
      .addCase(fetchClusterVariants.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.clusterRunStatus = 'failed';
      })
      .addCase(fetchSelectedVariant.pending, (state, action) => {
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.selectedVariantStatus = 'loading';
        state.selectedVariant = null;
      })
      .addCase(fetchSelectedVariant.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.selectedVariantStatus = 'succeeded';
        state.selectedVariant = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        if (state.draft) {
          state.draft.selectedCandidateId = action.payload.data.variantId;
        }
      })
      .addCase(fetchSelectedVariant.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.selectedVariantStatus = 'failed';
      })
      .addCase(confirmAndGenerateVariants.pending, (state, action) => {
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.generatedVariantsStatus = 'loading';
      })
      .addCase(confirmAndGenerateVariants.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.generatedVariantsStatus = 'succeeded';
        state.generatedVariants = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        state.variants = action.payload.variants;
      })
      .addCase(confirmAndGenerateVariants.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        // Keep whatever was shown before; a failed re-confirm must not blank the screen.
        state.generatedVariantsStatus = 'failed';
      })
      .addCase(loadCustomVariantAttributes.pending, (state, action) => {
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.customVariantAttributesStatus = 'loading';
        state.customVariantAttributes = [];
      })
      .addCase(loadCustomVariantAttributes.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.customVariantAttributesStatus = 'succeeded';
        state.customVariantAttributes = action.payload.attributes;
      })
      .addCase(loadCustomVariantAttributes.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, action.meta.arg)) return;
        state.customVariantAttributesStatus = 'failed';
      })
      .addCase(saveCustomVariant.pending, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.customVariantSaveStatus = 'loading';
      })
      .addCase(saveCustomVariant.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.customVariantSaveStatus = 'succeeded';
        state.variants = [...state.variants, action.payload];
      })
      .addCase(saveCustomVariant.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.customVariantSaveStatus = 'failed';
      })
      .addCase(submitClusterRun.pending, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.clusterRunStatus = 'loading';
      })
      .addCase(submitClusterRun.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.clusterRunStatus = 'succeeded';
        state.clusterRun = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        const mapped = mapClusterRunCandidates(action.payload.data, {
          planId: state.draft?.planId ?? state.plan?.id ?? '',
          selectedId: state.draft?.selectedCandidateId,
        });
        // A new run replaces the cards; a missing pick uses isSelected, then the first variant.
        state.candidates = mapped;
        if (state.draft) {
          state.draft.selectedCandidateId =
            mapped.find((candidate) => candidate.selected)?.id ?? null;
        }
        state.storeAssignments = {};
        state.performanceInfo = {};
        state.clusterPlans = {};
        state.clusterPerformanceSummary = {};
        state.kpiBreakdown = {};
        state.attributeProductList = {};
        state.attributeInfo = {};
        state.attributeGradesSummary = {};
        state.view = null;
        // A new run replaces the variants the "3 Best" narration was built from.
        state.variantSummary = null;
      })
      .addCase(submitClusterRun.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        // Variants and the current step are untouched so the user can retry.
        state.clusterRunStatus = 'failed';
      })
      .addCase(fetchClusterVariantsSummary.pending, (state, action) => {
        const code = action.meta.arg.clusterPlanCode;
        if (!isActiveWizardPlan(state, code)) return;
        const previous =
          state.variantSummary?.clusterPlanCode === code ? state.variantSummary : null;
        state.variantSummary = {
          clusterPlanCode: code,
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchClusterVariantsSummary.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.variantSummary = {
          clusterPlanCode: action.payload.clusterPlanCode,
          status: 'succeeded',
          data: action.payload.data,
          error: null,
        };
      })
      .addCase(fetchClusterVariantsSummary.rejected, (state, action) => {
        if (action.meta.condition) return;
        const code = action.meta.arg.clusterPlanCode;
        if (!isActiveWizardPlan(state, code)) return;
        // No fallback copy: the strips show the "unavailable" state instead of mock narration.
        state.variantSummary = {
          clusterPlanCode: code,
          status: 'failed',
          data: null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(submitFinalSignOff.pending, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.finalSignOffStatus = 'loading';
      })
      .addCase(submitFinalSignOff.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.finalSignOffStatus = 'succeeded';
      })
      .addCase(submitFinalSignOff.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        // Selection and step are untouched so the user can retry from Finalize.
        state.finalSignOffStatus = 'failed';
      })
      .addCase(submitClusterApproval.pending, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.clusterApprovalStatus = 'loading';
      })
      .addCase(submitClusterApproval.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.clusterApprovalStatus = 'succeeded';
        state.clusterApproval = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
      })
      .addCase(submitClusterApproval.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        // Selection and step are untouched; nothing is treated as approved.
        state.clusterApprovalStatus = 'failed';
      })
      .addCase(fetchSeasonInfos.pending, (state, action) => {
        // A new season: previous data is cleared immediately so it is never shown mid-flight.
        state.seasonInfosSeasonCode = action.meta.arg.seasonCode;
        state.seasonInfos = null;
        state.referenceCoverage = {};
        state.referencePeriodChecked = {};
        state.selectedPeriodIds = [];
        state.selectedPeriodId = null;
        if (state.draft) {
          state.draft.selectedPeriodIds = [];
          state.draft.selectedPeriodId = null;
        }
        state.seasonInfosStatus = 'loading';
      })
      .addCase(fetchSeasonInfos.fulfilled, (state, action) => {
        // Ignore a response for a season the user has since moved away from.
        if (action.meta.arg.seasonCode !== state.seasonInfosSeasonCode) return;
        const available = Object.keys(action.payload);
        state.seasonInfos = action.payload;
        state.seasonInfosStatus = 'succeeded';
        // Two or more periods keep the API split (already 100). One period is 100 on its own.
        state.referenceCoverage = initialReferenceCoverage(action.payload);
        // Every returned period starts checked and selected in the dropdown.
        state.referencePeriodChecked = Object.fromEntries(
          available.map((key) => [key, true]),
        );
        state.selectedPeriodIds = available;
        state.selectedPeriodId = available[0] ?? null;
        if (state.draft) {
          state.draft.selectedPeriodIds = available;
          state.draft.selectedPeriodId = state.selectedPeriodId;
        }
      })
      .addCase(fetchSeasonInfos.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (action.meta.arg.seasonCode !== state.seasonInfosSeasonCode) return;
        // No fallback data: the section shows an error with retry instead of stale/mock cards.
        state.seasonInfos = null;
        state.seasonInfosStatus = 'failed';
      })
      .addCase(submitGate2Decision.pending, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.gate2DecisionStatus = 'loading';
      })
      .addCase(submitGate2Decision.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.gate2DecisionStatus = 'succeeded';
        const { decision, actionedBy } = action.meta.arg;
        if (decision === 'approved') {
          setGate(state, 2, 'approved', actionedBy);
          if (state.plan) state.plan.status = 'awaitingApproval';
        } else {
          // Rejected: the approval is void; the user picks again on Finalize.
          setGate(state, 2, 'rejected', actionedBy);
          state.clusterApproval = null;
          state.clusterApprovalStatus = 'idle';
          if (state.plan) state.plan.status = 'draft';
        }
      })
      .addCase(submitGate2Decision.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.gate2DecisionStatus = 'failed';
      })
      .addCase(submitFinalise.pending, (state, action) => {
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.finaliseStatus = 'loading';
      })
      .addCase(submitFinalise.fulfilled, (state, action) => {
        if (!isActiveWizardPlan(state, action.payload.clusterPlanCode)) return;
        state.finaliseStatus = 'succeeded';
        state.clusterApproval = {
          clusterPlanCode: action.payload.clusterPlanCode,
          data: action.payload.data,
        };
        setGate(state, 2, 'approved', action.meta.arg.actionedBy);
        setGate(state, 3, 'signedOff', action.meta.arg.actionedBy);
        if (state.plan) {
          state.plan.status = 'approved';
          state.plan.locked = true;
        }
      })
      .addCase(submitFinalise.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!isActiveWizardPlan(state, wizardThunkCode(action.meta.arg))) return;
        state.finaliseStatus = 'failed';
      })
      .addCase(fetchApprover.pending, (state) => {
        if (!state.draft) return;
        state.approverStatus = 'loading';
      })
      .addCase(fetchApprover.fulfilled, (state, action) => {
        if (!state.draft) return;
        state.approverStatus = 'succeeded';
        state.approver = action.payload;
      })
      .addCase(fetchApprover.rejected, (state, action) => {
        if (action.meta.condition) return;
        if (!state.draft) return;
        // No fallback: the approver card shows an error with retry instead of stale/mock data.
        state.approverStatus = 'failed';
        state.approver = null;
      })
      .addCase(fetchStoreAssignments.pending, (state, action) => {
        const { variantId } = action.meta.arg;
        const previous = state.storeAssignments[variantId];
        state.storeAssignments[variantId] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchStoreAssignments.fulfilled, (state, action) => {
        state.storeAssignments[action.meta.arg.variantId] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchStoreAssignments.rejected, (state, action) => {
        if (action.meta.condition) return;
        const previous = state.storeAssignments[action.meta.arg.variantId];
        // Keep rows already shown when a refresh after a move fails; first-load
        // failures still have no data and the panel shows retry.
        state.storeAssignments[action.meta.arg.variantId] = {
          status: 'failed',
          data: previous?.data ?? null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(fetchPerformanceInfo.pending, (state, action) => {
        const { variantId } = action.meta.arg;
        const previous = state.performanceInfo[variantId];
        state.performanceInfo[variantId] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchPerformanceInfo.fulfilled, (state, action) => {
        state.performanceInfo[action.meta.arg.variantId] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchPerformanceInfo.rejected, (state, action) => {
        if (action.meta.condition) return;
        const previous = state.performanceInfo[action.meta.arg.variantId];
        state.performanceInfo[action.meta.arg.variantId] = {
          status: 'failed',
          data: previous?.data ?? null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(fetchClusterPlans.pending, (state, action) => {
        const { variantId } = action.meta.arg;
        const previous = state.clusterPlans[variantId];
        state.clusterPlans[variantId] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchClusterPlans.fulfilled, (state, action) => {
        state.clusterPlans[action.meta.arg.variantId] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchClusterPlans.rejected, (state, action) => {
        if (action.meta.condition) return;
        const previous = state.clusterPlans[action.meta.arg.variantId];
        state.clusterPlans[action.meta.arg.variantId] = {
          status: 'failed',
          data: previous?.data ?? null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(fetchClusterPerformanceSummary.pending, (state, action) => {
        const { variantId } = action.meta.arg;
        const previous = state.clusterPerformanceSummary[variantId];
        state.clusterPerformanceSummary[variantId] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchClusterPerformanceSummary.fulfilled, (state, action) => {
        state.clusterPerformanceSummary[action.meta.arg.variantId] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchClusterPerformanceSummary.rejected, (state, action) => {
        if (action.meta.condition) return;
        // No fallback copy: the strip shows the "unavailable" state instead of mock narration.
        state.clusterPerformanceSummary[action.meta.arg.variantId] = {
          status: 'failed',
          data: null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(fetchKpiBreakdown.pending, (state, action) => {
        const { variantId } = action.meta.arg;
        const previous = state.kpiBreakdown[variantId];
        state.kpiBreakdown[variantId] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchKpiBreakdown.fulfilled, (state, action) => {
        state.kpiBreakdown[action.meta.arg.variantId] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchKpiBreakdown.rejected, (state, action) => {
        if (action.meta.condition) return;
        const previous = state.kpiBreakdown[action.meta.arg.variantId];
        state.kpiBreakdown[action.meta.arg.variantId] = {
          status: 'failed',
          data: previous?.data ?? null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(fetchAttributeProductList.pending, (state, action) => {
        const { variantId } = action.meta.arg;
        const previous = state.attributeProductList[variantId];
        state.attributeProductList[variantId] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchAttributeProductList.fulfilled, (state, action) => {
        state.attributeProductList[action.meta.arg.variantId] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchAttributeProductList.rejected, (state, action) => {
        if (action.meta.condition) return;
        const previous = state.attributeProductList[action.meta.arg.variantId];
        state.attributeProductList[action.meta.arg.variantId] = {
          status: 'failed',
          data: previous?.data ?? null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(fetchAttributeInfo.pending, (state, action) => {
        const key = attributeInfoCacheKey(action.meta.arg.variantId, action.meta.arg.attribute);
        const previous = state.attributeInfo[key];
        state.attributeInfo[key] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchAttributeInfo.fulfilled, (state, action) => {
        const key = attributeInfoCacheKey(action.meta.arg.variantId, action.meta.arg.attribute);
        state.attributeInfo[key] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchAttributeInfo.rejected, (state, action) => {
        if (action.meta.condition) return;
        const key = attributeInfoCacheKey(action.meta.arg.variantId, action.meta.arg.attribute);
        const previous = state.attributeInfo[key];
        state.attributeInfo[key] = {
          status: 'failed',
          data: previous?.data ?? null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(fetchAttributeGradesSummary.pending, (state, action) => {
        const key = attributeInfoCacheKey(action.meta.arg.variantId, action.meta.arg.attribute);
        const previous = state.attributeGradesSummary[key];
        state.attributeGradesSummary[key] = {
          status: 'loading',
          data: previous?.data ?? null,
          error: null,
        };
      })
      .addCase(fetchAttributeGradesSummary.fulfilled, (state, action) => {
        const key = attributeInfoCacheKey(action.meta.arg.variantId, action.meta.arg.attribute);
        state.attributeGradesSummary[key] = {
          status: 'succeeded',
          data: action.payload,
          error: null,
        };
      })
      .addCase(fetchAttributeGradesSummary.rejected, (state, action) => {
        if (action.meta.condition) return;
        const key = attributeInfoCacheKey(action.meta.arg.variantId, action.meta.arg.attribute);
        // No fallback copy: the strip shows the "unavailable" state instead of mock narration.
        state.attributeGradesSummary[key] = {
          status: 'failed',
          data: null,
          error: typeof action.payload === 'string' ? action.payload : null,
        };
      })
      .addCase(savePlanDraft.fulfilled, (state, action) => {
        state.plan = action.payload.plan;
        const idx = state.plans.findIndex((p) => p.id === action.payload.plan.id);
        if (idx >= 0) state.plans[idx] = action.payload.plan;
      })
      .addCase(saveVariants.fulfilled, (state, action) => {
        state.variants = action.payload.variants;
      })
      .addCase(startRun.pending, (state) => {
        if (state.run?.status === 'queued' || state.run?.status === 'running') return;
        state.run = {
          id: state.run?.id ?? 'pending',
          planId: state.plan?.id ?? '',
          status: 'queued',
          startedAt: new Date().toISOString(),
          completedAt: null,
          expectedSeconds: state.run?.expectedSeconds ?? 60,
        };
      })
      .addCase(startRun.fulfilled, (state, action) => {
        state.run = action.payload.run;
      })
      .addCase(startRun.rejected, (state) => {
        state.run = {
          id: state.run?.id ?? 'failed',
          planId: state.plan?.id ?? '',
          status: 'failed',
          startedAt: state.run?.startedAt ?? new Date().toISOString(),
          completedAt: new Date().toISOString(),
          expectedSeconds: state.run?.expectedSeconds ?? 60,
          errorCode: 'AGENT_FAILED',
        };
      })
      .addCase(pollRun.fulfilled, (state, action) => {
        state.run = action.payload.run;
      })
      .addCase(pollRun.rejected, (state) => {
        state.run = {
          id: state.run?.id ?? 'failed',
          planId: state.plan?.id ?? '',
          status: 'failed',
          startedAt: state.run?.startedAt ?? new Date().toISOString(),
          completedAt: new Date().toISOString(),
          expectedSeconds: state.run?.expectedSeconds ?? 60,
          errorCode: 'AGENT_FAILED',
        };
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        // Mock candidates must not clobber the cards produced by the run API.
        if (hasLiveClusterRun(state)) return;
        const mapped = defaultFirstSelected(action.payload.candidates);
        state.candidates = mapped;
        if (state.draft) {
          state.draft.selectedCandidateId =
            mapped.find((candidate) => candidate.selected)?.id ?? null;
        }
      })
      .addCase(fetchCandidateView.fulfilled, (state, action) => {
        state.view = action.payload;
      });
  },
});

export const {
  setActiveTab,
  setSelectedPlanIds,
  setPlan,
  setDraft,
  openResumedPlan,
  patchDraft,
  setSelectedPeriodId,
  setSelectedPeriodIds,
  setOverriddenPeriodIds,
  clearSeasonInfos,
  setReferenceCoverage,
  setReferencePeriodChecked,
  setVariants,
  selectRunCandidate,
  resetWizard,
  patchClusterPlanSuggestedName,
  clearSelectedVariant,
} = clusteringSlice.actions;

export const clusteringReducer = clusteringSlice.reducer;
