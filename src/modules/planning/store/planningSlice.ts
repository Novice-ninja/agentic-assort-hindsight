import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoadStatus } from '@shared/types';
import {
  createPlan,
  deletePlans as deletePlansApi,
  getPlans,
  getReferenceData,
  getSeasons,
  savePlanDraft,
} from '../api';
import { getProductHierarchyList, getProductList } from '../api/getProductHierarchy';
import type { CreatePlanInput } from '../api';
import {
  DEFAULT_CONFIDENCE_THRESHOLD,
  EMPTY_SCOPE,
  FILTER_VALUES_PAGE_SIZE,
  WIZARD_STEPS,
  type HierarchyLevelDef,
  type HierarchyScopeEntry,
  type Plan,
  type PlanDraft,
  type PlanTabKey,
  type PlanViewMode,
  type PlanningReferenceData,
  type ProductValue,
  type SeasonYear,
  type SelectionOperation,
  type WizardStep,
} from '../types';
import { mergeFilterValuesPage, sameScopeSelection } from '../services/filterHierarchy';

//Adding Clustering Scenario Fixtures as default value TO-DO: Need to remove this once we have the actual data
import {
  clusteringScenarioFixtures,
} from '@tests/fixtures/planning';

export interface PlanningFilters {
  stages: string[];
  seasons: string[];
}

const ZERO_COUNTS: Record<PlanTabKey, number> = {
  all: 0,
  draft: 0,
  inProgress: 0,
  review: 0,
  approved: 0,
};

export function createInitialDraft(): PlanDraft {
  return {
    id: null,
    currentStep: 'nameCalendar',
    completedSteps: [],
    name: '',
    fiscalYearId: null,
    season: null,
    seasonCode: null,
    startingPoint: null,
    scope: { ...EMPTY_SCOPE },
    hierarchyScope: [],
    clusteringScenarioId: null,
    runMode: 'gated',
    confidenceThreshold: DEFAULT_CONFIDENCE_THRESHOLD,
  };
}

export interface PlanningState {
  plans: Plan[];
  tabCounts: Record<PlanTabKey, number>;
  activeTab: PlanTabKey;
  filters: PlanningFilters;
  viewMode: PlanViewMode;
  selectedIds: string[];
  referenceData: PlanningReferenceData;
  seasonsData: SeasonYear[];
  draft: PlanDraft | null;
  hierarchyLevels: HierarchyLevelDef[];
  /** `config_hash` from the last successful `/filters/config` load. */
  filterConfigHash: string | null;
  productLists: Record<string, ProductValue[]>;
  /** Server-reported total for each level (when the values response is paged). */
  productListTotals: Record<string, number>;
  /** Next `/filters/values` offset per level. */
  productListNextOffset: Record<string, number>;
  /** Active server-side search string per level. */
  productListSearch: Record<string, string>;
  /** True while a "show more" append is in flight (keeps existing rows visible). */
  productListLoadingMore: Record<string, boolean>;
  /** True while a replace search is in flight (keeps existing rows visible). */
  productListSearching: Record<string, boolean>;
  /** Latest request id per level — late responses for older requests are ignored. */
  productListRequestId: Record<string, string | undefined>;
  /** Ordered selection journal per level for backend Check Configuration replay. */
  selectionConfigJournal: Record<string, SelectionOperation[]>;
  statuses: {
    plans: LoadStatus;
    refData: LoadStatus;
    create: LoadStatus;
    save: LoadStatus;
    seasons: LoadStatus;
    hierarchyLevels: LoadStatus;
  };
  productListStatuses: Record<string, LoadStatus>;
  error?: string;
  createError?: string;
}

const initialState: PlanningState = {
  plans: [],
  tabCounts: { ...ZERO_COUNTS },
  activeTab: 'all',
  filters: { stages: [], seasons: [] },
  viewMode: 'grid',
  selectedIds: [],
  referenceData: {
    fiscalYears: [],
    taxonomy: [],
    clusteringScenarios: clusteringScenarioFixtures, //TO-DO: Need to remove this once we have the actual data
  },
  seasonsData: [],
  draft: null,
  hierarchyLevels: [],
  filterConfigHash: null,
  productLists: {},
  productListTotals: {},
  productListNextOffset: {},
  productListSearch: {},
  productListLoadingMore: {},
  productListSearching: {},
  productListRequestId: {},
  selectionConfigJournal: {},
  statuses: {
    plans: 'idle',
    refData: 'succeeded', //TO-DO: Need to set it idle once we have the actual data
    create: 'idle',
    save: 'idle',
    seasons: 'idle',
    hierarchyLevels: 'idle',
  },
  productListStatuses: {},
};

/**
 * Only fetch when we haven't already started/finished. This is an atomic guard (checked
 * against live store state at dispatch time), so duplicate dispatches — e.g. React
 * StrictMode's double-invoked effects in dev — are aborted instead of firing the request twice.
 */
const shouldFetch = (status: LoadStatus) => status === 'idle' || status === 'failed';

export type FetchPlansArg = { isDeleted?: boolean } | undefined;

export const fetchPlans = createAsyncThunk(
  'planning/fetchPlans',
  (arg?: FetchPlansArg) => getPlans(arg?.isDeleted ?? false),
  {
    condition: (_arg, { getState }) =>
      shouldFetch((getState() as { planning: PlanningState }).planning.statuses.plans),
  },
);

export const deletePlans = createAsyncThunk(
  'planning/deletePlans',
  async (planCodes: string[]) => {
    const response = await deletePlansApi({ planCodes });
    if (response.status === false) {
      throw new Error(response.message || 'Failed to delete plans');
    }
    return planCodes;
  },
);
export const fetchReferenceData = createAsyncThunk(
  'planning/fetchReferenceData',
  getReferenceData,
  {
    condition: (_arg, { getState }) =>
      shouldFetch((getState() as { planning: PlanningState }).planning.statuses.refData),
  },
);
export const fetchSeasons = createAsyncThunk('planning/fetchSeasons', getSeasons, {
  condition: (_arg, { getState }) =>
    shouldFetch((getState() as { planning: PlanningState }).planning.statuses.seasons),
});
export const persistDraft = createAsyncThunk('planning/persistDraft', (draft: PlanDraft) =>
  savePlanDraft(draft),
);

export const fetchProductHierarchy = createAsyncThunk(
  'planning/fetchProductHierarchy',
  // Create Plan always uses the default filter config; `force` only bypasses `condition`.
  (_arg: { force?: boolean } | undefined) => getProductHierarchyList(),
  {
    condition: (arg: { force?: boolean } | undefined, { getState }) => {
      if (arg?.force) return true;
      return shouldFetch(
        (getState() as { planning: PlanningState }).planning.statuses.hierarchyLevels,
      );
    },
  },
);

export interface FetchProductListValuesArgs {
  attribute: HierarchyLevelDef;
  hierarchyScope: HierarchyScopeEntry[];
  search?: string;
  offset?: number;
  /** `0` = unpaged matching-set fetch (search Select All). */
  limit?: number;
  mode?: 'replace' | 'append';
}

const inflightProductList = new Map<string, AbortController>();

export const fetchProductListValues = createAsyncThunk(
  'planning/fetchProductListValues',
  async (args: FetchProductListValuesArgs, { getState, dispatch, signal, rejectWithValue }) => {
    const expectedConfigHash =
      (getState() as { planning: PlanningState }).planning.filterConfigHash ?? undefined;
    const levelNo = args.attribute.levelNo;
    inflightProductList.get(levelNo)?.abort();
    const controller = new AbortController();
    inflightProductList.set(levelNo, controller);
    const onOuterAbort = () => controller.abort();
    signal.addEventListener('abort', onOuterAbort);
    try {
      return await getProductList(args.attribute, args.hierarchyScope, {
        signal: controller.signal,
        expectedConfigHash,
        search: args.search,
        offset: args.offset ?? 0,
        limit: args.limit === 0 ? 0 : (args.limit ?? FILTER_VALUES_PAGE_SIZE),
      });
    } catch (err) {
      if (err instanceof Error && (err.name === 'AbortError' || err.name === 'CanceledError')) {
        return rejectWithValue('ABORTED');
      }
      if (err instanceof Error && err.name === 'ConfigHashMismatchError') {
        await dispatch(fetchProductHierarchy({ force: true }));
        return rejectWithValue('CONFIG_HASH_MISMATCH');
      }
      throw err;
    } finally {
      signal.removeEventListener('abort', onOuterAbort);
      if (inflightProductList.get(levelNo) === controller) {
        inflightProductList.delete(levelNo);
      }
    }
  },
  {
    condition: (arg, { getState }) => {
      const planning = (getState() as { planning: PlanningState }).planning;
      if (arg.mode === 'append' && planning.productListLoadingMore[arg.attribute.levelNo]) {
        return false;
      }
      return true;
    },
  },
);

export const submitPlan = createAsyncThunk(
  'planning/submitPlan',
  async (input: CreatePlanInput, { rejectWithValue }) => {
    try {
      const response = await createPlan(input);
      if (!response.status) {
        return rejectWithValue(response.message || 'Failed to create plan. Please try again.');
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create plan. Please try again.';
      return rejectWithValue(message);
    }
  },
);

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<PlanTabKey>) {
      state.activeTab = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<PlanningFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilter(state, action: PayloadAction<keyof PlanningFilters>) {
      state.filters[action.payload] = [];
    },
    setViewMode(state, action: PayloadAction<PlanViewMode>) {
      state.viewMode = action.payload;
    },
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    startDraft(state, action: PayloadAction<PlanDraft | undefined>) {
      state.draft = action.payload ?? createInitialDraft();
      state.createError = undefined;
    },
    updateDraft(state, action: PayloadAction<Partial<PlanDraft>>) {
      if (!state.draft) state.draft = createInitialDraft();
      state.draft = { ...state.draft, ...action.payload };
    },
    updateHierarchyScope(
      state,
      action: PayloadAction<{
        levelName: string;
        levelNo: string;
        selectedValues: string[];
        selectAll?: boolean;
        search?: string[];
        exceptSearch?: string[];
        except?: string[];
        include?: string[];
      }>,
    ) {
      if (!state.draft) return;
      const {
        levelName,
        levelNo,
        selectedValues,
        selectAll = false,
        search = [],
        exceptSearch = [],
        except = [],
        include = [],
      } = action.payload;
      const existing = state.draft.hierarchyScope.findIndex(
        (e) => e.levelNo === levelNo,
      );
      const nextEntry: HierarchyScopeEntry = {
        levelName,
        levelNo,
        selectedValues,
        selectAll,
        search,
        exceptSearch,
        except,
        include,
      };
      if (existing >= 0) {
        state.draft.hierarchyScope[existing] = {
          ...state.draft.hierarchyScope[existing],
          ...nextEntry,
        };
      } else {
        state.draft.hierarchyScope.push(nextEntry);
      }
      const levelIdx = state.hierarchyLevels.findIndex((l) => l.levelNo === levelNo);
      if (levelIdx >= 0) {
        const childLevels = state.hierarchyLevels.slice(levelIdx + 1);
        for (const child of childLevels) {
          const childEntry = state.draft.hierarchyScope.find(
            (e) => e.levelNo === child.levelNo,
          );
          if (childEntry) {
            childEntry.selectedValues = [];
            childEntry.selectAll = false;
            childEntry.search = [];
            childEntry.exceptSearch = [];
            childEntry.except = [];
            childEntry.include = [];
          }
          delete state.productLists[child.levelNo];
          delete state.productListTotals[child.levelNo];
          delete state.productListNextOffset[child.levelNo];
          delete state.productListSearch[child.levelNo];
          delete state.productListLoadingMore[child.levelNo];
          delete state.productListSearching[child.levelNo];
          delete state.productListRequestId[child.levelNo];
          delete state.selectionConfigJournal[child.levelNo];
          state.productListStatuses[child.levelNo] = 'idle';
        }
      }
    },
    appendSelectionOp(
      state,
      action: PayloadAction<{ levelNo: string; op: SelectionOperation }>,
    ) {
      const { levelNo, op } = action.payload;
      const journal = state.selectionConfigJournal[levelNo] ?? [];
      journal.push(op);
      state.selectionConfigJournal[levelNo] = journal;
    },
    resetSelectionConfig(state, action: PayloadAction<{ levelNo: string }>) {
      delete state.selectionConfigJournal[action.payload.levelNo];
    },
    goToStep(state, action: PayloadAction<WizardStep>) {
      if (state.draft) state.draft.currentStep = action.payload;
    },
    completeStep(state, action: PayloadAction<WizardStep>) {
      if (!state.draft) return;
      if (!state.draft.completedSteps.includes(action.payload)) {
        state.draft.completedSteps.push(action.payload);
      }
      const idx = WIZARD_STEPS.indexOf(action.payload);
      const next = WIZARD_STEPS[idx + 1];
      if (next) state.draft.currentStep = next;
    },
    resetDraft(state) {
      state.draft = null;
      state.statuses.create = 'idle';
      state.createError = undefined;
      state.selectionConfigJournal = {};
    },
    invalidatePlans(state) {
      state.statuses.plans = 'idle';
    },
    resetProductScope(state) {
      state.hierarchyLevels = [];
      state.filterConfigHash = null;
      state.productLists = {};
      state.productListTotals = {};
      state.productListNextOffset = {};
      state.productListSearch = {};
      state.productListLoadingMore = {};
      state.productListSearching = {};
      state.productListRequestId = {};
      state.selectionConfigJournal = {};
      state.statuses.hierarchyLevels = 'idle';
      state.productListStatuses = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.statuses.plans = 'loading';
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.statuses.plans = 'succeeded';
        state.plans = action.payload.items;
        state.tabCounts = action.payload.counts;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.statuses.plans = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchReferenceData.pending, (state) => {
        state.statuses.refData = 'loading';
      })
      .addCase(fetchReferenceData.fulfilled, (state, action) => {
        state.statuses.refData = 'succeeded';
        state.referenceData = action.payload;
      })
      .addCase(fetchReferenceData.rejected, (state) => {
        state.statuses.refData = 'failed';
      })
      .addCase(fetchSeasons.pending, (state) => {
        state.statuses.seasons = 'loading';
      })
      .addCase(fetchSeasons.fulfilled, (state, action) => {
        state.statuses.seasons = 'succeeded';
        state.seasonsData = action.payload;
      })
      .addCase(fetchSeasons.rejected, (state, action) => {
        state.statuses.seasons = 'failed';
        state.error = action.error.message;
      })
      .addCase(persistDraft.pending, (state) => {
        state.statuses.save = 'loading';
      })
      .addCase(persistDraft.fulfilled, (state, action) => {
        state.statuses.save = 'succeeded';
        if (state.draft && !state.draft.id) state.draft.id = action.payload.id;
      })
      .addCase(persistDraft.rejected, (state) => {
        state.statuses.save = 'failed';
      })
      .addCase(fetchProductHierarchy.pending, (state) => {
        state.statuses.hierarchyLevels = 'loading';
      })
      .addCase(fetchProductHierarchy.fulfilled, (state, action) => {
        state.statuses.hierarchyLevels = 'succeeded';
        state.hierarchyLevels = action.payload.levels;
        state.filterConfigHash = action.payload.configHash;
      })
      .addCase(fetchProductHierarchy.rejected, (state) => {
        state.statuses.hierarchyLevels = 'failed';
      })
      .addCase(fetchProductListValues.pending, (state, action) => {
        const levelNo = action.meta.arg.attribute.levelNo;
        const mode = action.meta.arg.mode ?? 'replace';
        state.productListRequestId[levelNo] = action.meta.requestId;
        const hasRows = (state.productLists[levelNo]?.length ?? 0) > 0;

        if (mode === 'append') {
          state.productListLoadingMore[levelNo] = true;
        } else if (hasRows) {
          state.productListSearching[levelNo] = true;
        } else {
          state.productListStatuses[levelNo] = 'loading';
        }

        if (mode === 'replace') {
          state.productListSearch[levelNo] = action.meta.arg.search ?? '';
        }
      })
      .addCase(fetchProductListValues.fulfilled, (state, action) => {
        const { levelNo, values, configHash, total } = action.payload;
        const mode = action.meta.arg.mode ?? 'replace';
        const offset = action.meta.arg.offset ?? 0;

        if (state.productListRequestId[levelNo] !== action.meta.requestId) return;

        const requestedScope = action.meta.arg.hierarchyScope;
        const scopeStillValid = requestedScope.every((entry) => {
          const current = state.draft?.hierarchyScope.find((e) => e.levelNo === entry.levelNo);
          if (!current) {
            return entry.selectedValues.length === 0 && !entry.selectAll;
          }
          return sameScopeSelection(current, entry);
        });
        if (!scopeStillValid) return;

        if (
          state.filterConfigHash !== null &&
          configHash.length > 0 &&
          configHash !== state.filterConfigHash
        ) {
          return;
        }

        if (mode === 'append') {
          state.productLists[levelNo] = mergeFilterValuesPage(
            state.productLists[levelNo] ?? [],
            values,
          );
          state.productListLoadingMore[levelNo] = false;
        } else {
          state.productLists[levelNo] = values;
          state.productListSearching[levelNo] = false;
          state.productListLoadingMore[levelNo] = false;
          state.productListStatuses[levelNo] = 'succeeded';
          state.productListSearch[levelNo] = action.meta.arg.search ?? '';
        }

        if (total !== undefined) {
          state.productListTotals[levelNo] = total;
        }
        state.productListNextOffset[levelNo] = offset + values.length;
      })
      .addCase(fetchProductListValues.rejected, (state, action) => {
        const levelNo = action.meta.arg.attribute.levelNo;
        const mode = action.meta.arg.mode ?? 'replace';

        if (action.payload === 'CONFIG_HASH_MISMATCH') {
          if (state.draft) state.draft.hierarchyScope = [];
          state.productLists = {};
          state.productListTotals = {};
          state.productListNextOffset = {};
          state.productListSearch = {};
          state.productListLoadingMore = {};
          state.productListSearching = {};
          state.productListRequestId = {};
          state.productListStatuses = {};
          return;
        }

        if (action.payload === 'ABORTED' || action.meta.aborted) {
          if (state.productListRequestId[levelNo] !== action.meta.requestId) return;
          state.productListLoadingMore[levelNo] = false;
          state.productListSearching[levelNo] = false;
          return;
        }

        if (state.productListRequestId[levelNo] !== action.meta.requestId) return;

        if (mode === 'append') {
          state.productListLoadingMore[levelNo] = false;
        } else {
          state.productListSearching[levelNo] = false;
          if (
            state.productListStatuses[levelNo] === 'loading' ||
            state.productListStatuses[levelNo] === 'succeeded'
          ) {
            state.productListStatuses[levelNo] = 'failed';
          }
        }
      })
      .addCase(submitPlan.pending, (state) => {
        state.statuses.create = 'loading';
        state.createError = undefined;
      })
      .addCase(submitPlan.fulfilled, (state) => {
        state.statuses.create = 'succeeded';
        state.draft = null;
      })
      .addCase(submitPlan.rejected, (state, action) => {
        state.statuses.create = 'failed';
        state.createError =
          (action.payload as string) ?? action.error.message ?? 'planning.errors.createFailed';
      });
  },
});

export const {
  setActiveTab,
  setFilters,
  clearFilter,
  setViewMode,
  setSelectedIds,
  startDraft,
  updateDraft,
  updateHierarchyScope,
  appendSelectionOp,
  resetSelectionConfig,
  goToStep,
  completeStep,
  resetDraft,
  invalidatePlans,
  resetProductScope,
} = planningSlice.actions;

export const planningReducer = planningSlice.reducer;
