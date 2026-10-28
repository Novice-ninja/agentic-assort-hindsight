import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { cardInsightKey } from '../services/cardInsightIdentity';
import type { LoadStatus } from '@shared/types';
import {
  deleteRecommendationOverride,
  getAttributes,
  getByItemSummary,
  getByItemTableData,
  getByItemVisualView,
  getCardInsight,
  getHindsightAttribute,
  getHindsightConfig,
  getHindsightContext,
  getHindsightItems,
  getHindsightNarration,
  getHindsightOverview,
  getKpiSeasons,
  overrideItemRecommendation,
  patchPreferences,
  patchRecommendation,
  type HindsightOverviewResponse,
} from '../api';
import {
  forEachCachedTableRow,
  forEachCachedVisualItem,
} from '../services/byItemCache';
import { latestSeasonCode } from '../services/kpiSeasons';
import { applyScopeToSelection } from '../services/permissionScope';
import type { RecommendationChange } from '../services/recommendationOverridePayload';
import { applyOverride } from '../services/recommendationVerdict';
import { EMPTY_PREFERENCES } from '../types';
import type {
  AttributeDefinition,
  AttributeView,
  ByItemTableDataRequest,
  ByItemTableRow,
  ByItemVisualViewRequest,
  Cluster,
  FilterFacets,
  InsightBullet,
  GlobalSelection,
  HindsightTab,
  Item,
  ItemRecommendationState,
  ItemViewMode,
  KpiSeason,
  RecommendationOverrideRequest,
  NarrationInsight,
  PermissionScope,
  Recommendation,
  Season,
  SortState,
  SummarizeRequest,
  TenantConfig,
  UserPreferences,
  Verdict,
  VerdictTotals,
  VisualViewItem,
  ByItemSummaryRequest,
  ByItemSummaryData,
} from '../types';

const EMPTY_SELECTION: GlobalSelection = {
  seasonId: '',
  productLevelId: '',
  productPositionIds: [],
  countryIds: [],
  channelIds: [],
};

const EMPTY_TOTALS: VerdictTotals = { keep: 0, shop: 0, drop: 0 };

/** One card's AI summary. */
export interface CardInsightEntry {
  status: LoadStatus;
  bullets: InsightBullet[];
}

/** What an insight was asked for. The key is built from it, so two asks are never conflated. */
export interface CardInsightArgs {
  planCode: string;
  seasonCode: number;
  /**
   * What the ask is about, beyond the plan and season. The payload alone does not say: two charts
   * can plot the same metric, and a chart's own metric control changes what it plots, so the
   * caller names its subject — a contribution card its dimension, a chart its component, chart
   * type, metric and hierarchy level.
   */
  scope: string;
  payload: SummarizeRequest;
}

/** A recommendation write awaiting its answer, with the state to put back if it never comes. */
export interface PendingRecommendation {
  /** Null when the article had no recommendation to begin with, so there is nothing to restore. */
  previous: ItemRecommendationState | null;
}

export interface HindsightState {
  byItemSummary: ByItemSummaryData | null;
  activeTab: HindsightTab;
  selection: GlobalSelection;
  filterBarCollapsed: boolean;

  tenant: TenantConfig | null;
  preferences: UserPreferences;
  seasons: Season[];
  facets: FilterFacets;
  clusters: Cluster[];
  /** Null until loaded. Nothing renders scoped data while it is null. */
  scope: PermissionScope | null;

  overview: HindsightOverviewResponse | null;

  /** Seasons the viewed plan has hindsight data for. Empty is a valid answer. */
  kpiSeasons: KpiSeason[];
  /**
   * The season every product-performance request is made for. Null while unknown — no request
   * may be sent then, because there is no season code to guess from.
   */
  selectedSeasonCode: number | null;

  /**
   * The item collection for the visual view, straight from the backend. Empty means the view
   * falls back to `items`, so the tab stays usable while this endpoint is unavailable.
   */
  byItemVisualItems: VisualViewItem[];
  /**
   * Rows for the By Item table view. Empty means the table falls back to its static rows, so a
   * failed or unavailable endpoint still leaves the tab populated.
   */
  byItemTableRows: ByItemTableRow[];

  /**
   * Recommendation overrides in flight, keyed by article, each holding the state to restore if the
   * write fails. Keyed per article rather than held as one flag so a slow reply for one item can
   * neither block another nor land on it, and so a row can say it is saving on its own.
   */
  pendingRecommendations: Record<string, PendingRecommendation>;

  items: Item[];
  itemsTotal: number;
  verdictTotals: VerdictTotals;
  /** Keyed by item id so a verdict change touches one entry. */
  recommendations: Record<string, Recommendation>;
  itemSearch: string;
  itemSort: SortState | null;

  activeAttributeId: string | null;
  attributeView: AttributeView | null;

  /** Attributes from the dedicated API, null until fetched or on failure (falls back to tenant catalogue). */
  apiAttributes: AttributeDefinition[] | null;

  /** Keyed by widget id — a widget looks up its own insight and nothing else. */
  narration: Record<string, NarrationInsight>;

  /**
   * AI card summaries, keyed by what was asked for. Generation takes seconds, so answers are
   * kept for as long as the plan and season stand still; keying by the ask is also what stops a
   * slow reply for one card from landing in another card's tooltip.
   */
  cardInsights: Record<string, CardInsightEntry>;

  statuses: {
    config: LoadStatus;
    context: LoadStatus;
    overview: LoadStatus;
    kpiSeasons: LoadStatus;
    byItemVisual: LoadStatus;
    byItemTable: LoadStatus;
    items: LoadStatus;
    attribute: LoadStatus;
    attributes: LoadStatus;
    narration: LoadStatus;
    mutation: LoadStatus;
    byItemSummary: LoadStatus;
  };
  error?: string;
}

const initialState: HindsightState = {
  activeTab: 'overview',
  selection: EMPTY_SELECTION,
  filterBarCollapsed: false,
  tenant: null,
  preferences: EMPTY_PREFERENCES,
  seasons: [],
  facets: { levels: [], positions: [], countries: [], channels: [] },
  clusters: [],
  scope: null,
  overview: null,
  kpiSeasons: [],
  selectedSeasonCode: null,
  byItemVisualItems: [],
  byItemTableRows: [],
  byItemSummary: null,
  pendingRecommendations: {},
  items: [],
  itemsTotal: 0,
  verdictTotals: EMPTY_TOTALS,
  recommendations: {},
  itemSearch: '',
  itemSort: null,
  activeAttributeId: null,
  attributeView: null,
  apiAttributes: null,
  narration: {},
  cardInsights: {},
  statuses: {
    config: 'idle',
    context: 'idle',
    overview: 'idle',
    kpiSeasons: 'idle',
    byItemVisual: 'idle',
    byItemTable: 'idle',
    items: 'idle',
    attribute: 'idle',
    attributes: 'idle',
    narration: 'idle',
    mutation: 'idle',
    byItemSummary: 'idle',
  },
};

function indexRecommendations(list: Recommendation[]): Record<string, Recommendation> {
  return Object.fromEntries(list.map((r) => [r.itemId, r]));
}

const VERDICTS: Verdict[] = ['keep', 'shop', 'drop'];

function asVerdict(value: string | null | undefined): Verdict | undefined {
  return VERDICTS.find((verdict) => verdict === value);
}

function visualItemKey(item: VisualViewItem): string {
  const article = item.product.article?.trim();
  return article !== undefined && article.length > 0 ? article : item.product.id;
}

function applyRecommendationToVisual(
  item: VisualViewItem,
  next: ItemRecommendationState,
): void {
  if (item.workingPlan != null) {
    item.workingPlan.value = next.effectiveReco;
    item.workingPlan.overridden = next.overridden;
    item.workingPlan.mandatory = next.mandatory;
    item.workingPlan.staleBasis = next.staleBasis;
    item.workingPlan.source = next.source;
  }

  const recommendation = item.recommendation;
  if (recommendation !== undefined && recommendation !== null) {
    recommendation.selected = next.effectiveReco;
    recommendation.overridden = next.overridden;
    recommendation.mandatory = next.mandatory;
    recommendation.staleBasis = next.staleBasis;
    recommendation.source = next.source;
  }
}

function applyRecommendationToTableRow(
  row: ByItemTableRow,
  next: ItemRecommendationState,
): void {
  const cell = row.workingPlan ?? row.recommendation;
  if (cell === undefined) return;
  cell.value = next.effectiveReco;
  cell.overridden = next.overridden;
  cell.mandatory = next.mandatory;
  cell.staleBasis = next.staleBasis;
  cell.source = next.source;
  if (row.workingPlan != null && row.recommendation != null && row.recommendation !== cell) {
    row.recommendation.value = next.effectiveReco;
    row.recommendation.overridden = next.overridden;
  }
}

/**
 * Registers each item's agent verdict against the product id so the existing override flow
 * applies unchanged. A later page never overwrites an entry, which is what keeps a planner's
 * own override in place across a refetch.
 */
function registerVisualRecommendations(state: HindsightState, items: VisualViewItem[]): void {
  items.forEach((item) => {
    const agentVerdict =
      asVerdict(item.workingPlan?.value) ?? asVerdict(item.recommendation?.selected);
    if (agentVerdict === undefined) return;
    state.recommendations[item.product.id] ??= {
      itemId: item.product.id,
      agentVerdict,
      agentNarrationId: null,
    };
  });
}

/**
 * The recommendation an article currently shows.
 *
 * Read from whichever payload has it — a planner may be on either view, and the table's rows load
 * for both because a card's back face is one.
 */
function readRecommendation(
  state: HindsightState,
  article: string,
): ItemRecommendationState | null {
  const tableRow = state.byItemTableRows.find((row) => row.article === article);
  const cell = tableRow?.workingPlan ?? tableRow?.recommendation;
  if (cell !== undefined) {
    return {
      effectiveReco: cell.value,
      overridden: cell.overridden ?? false,
      mandatory: cell.mandatory ?? false,
      staleBasis: cell.staleBasis ?? null,
      source: cell.source ?? '',
    };
  }

  const visualItem = state.byItemVisualItems.find(
    (item) => visualItemKey(item) === article,
  );

  if (visualItem?.workingPlan != null) {
    const wp = visualItem.workingPlan;
    return {
      effectiveReco: wp.value,
      overridden: wp.overridden ?? false,
      mandatory: wp.mandatory ?? false,
      staleBasis: wp.staleBasis ?? null,
      source: wp.source ?? '',
    };
  }

  const recommendation = visualItem?.recommendation;
  if (recommendation === undefined || recommendation === null) return null;

  return {
    effectiveReco: recommendation.selected ?? '',
    overridden: recommendation.overridden ?? false,
    mandatory: recommendation.mandatory ?? false,
    staleBasis: recommendation.staleBasis ?? null,
    source: recommendation.source ?? '',
  };
}

/**
 * Records an article's recommendation on both cached payloads.
 *
 * Writing to both is what makes the table row, the card front, and that card's back one item
 * rather than three, and it is why a saved override costs no refetch: the rows a planner is
 * looking at are corrected where they sit, so no sort, filter, or scroll position moves.
 *
 * Articles outside the currently bound lists still live in the in-memory cache; those copies
 * are patched too so switching views does not revive the previous Keep/Drop.
 */
function writeRecommendation(
  state: HindsightState,
  article: string,
  next: ItemRecommendationState,
): void {
  const tableRow = state.byItemTableRows.find((row) => row.article === article);
  if (tableRow !== undefined) applyRecommendationToTableRow(tableRow, next);

  const visualItem = state.byItemVisualItems.find(
    (item) => visualItemKey(item) === article,
  );
  if (visualItem !== undefined) applyRecommendationToVisual(visualItem, next);

  // Cache objects must not be the Redux records: those are frozen in development, and
  // mutating them here throws before the override request is even sent.
  forEachCachedTableRow((row) => {
    if (row.article !== article) return;
    if (Object.isFrozen(row) || (row.workingPlan != null && Object.isFrozen(row.workingPlan))) {
      return;
    }
    applyRecommendationToTableRow(row, next);
  });
  forEachCachedVisualItem((item) => {
    if (visualItemKey(item) !== article) return;
    if (
      Object.isFrozen(item) ||
      (item.workingPlan != null && Object.isFrozen(item.workingPlan)) ||
      (item.recommendation != null && Object.isFrozen(item.recommendation))
    ) {
      return;
    }
    applyRecommendationToVisual(item, next);
  });
}

export const fetchHindsightConfig = createAsyncThunk(
  'hindsight/fetchConfig',
  getHindsightConfig,
);
export const fetchHindsightContext = createAsyncThunk(
  'hindsight/fetchContext',
  getHindsightContext,
);

export const fetchHindsightOverview = createAsyncThunk(
  'hindsight/fetchOverview',
  async (_, { getState }) => {
    const { selection, preferences, tenant } = (
      getState() as { hindsight: HindsightState }
    ).hindsight;
    const metricIds =
      preferences.scorecardMetricIds.length > 0
        ? preferences.scorecardMetricIds
        : (tenant?.catalogue.metrics ?? []).map((m) => m.id);

    return getHindsightOverview({
      selection,
      metricIds,
      threshold: preferences.surfacingThreshold,
      carryForwardView: preferences.carryForwardView,
    });
  },
);

/**
 * Loads the seasons for a plan. Dispatched when a plan is opened, because every
 * product-performance request downstream needs a season code that only this endpoint knows.
 */
export const fetchKpiSeasons = createAsyncThunk(
  'hindsight/fetchKpiSeasons',
  async (planCode: string) => getKpiSeasons(planCode),
  {
    condition: (_planCode, { getState }) => {
      const { statuses } = (getState() as { hindsight: HindsightState }).hindsight;
      return statuses.kpiSeasons !== 'loading';
    },
  },
);


export const fetchByItemVisualView = createAsyncThunk(
  'hindsight/fetchByItemVisualView',
  async (payload: ByItemVisualViewRequest) => getByItemVisualView(payload),
  {
    condition: (_payload, { getState }) => {
      const { statuses } = (getState() as { hindsight: HindsightState }).hindsight;
      return statuses.byItemVisual !== 'loading';
    },
  },
);

export const fetchByItemTableData = createAsyncThunk(
  'hindsight/fetchByItemTableData',
  async (payload: ByItemTableDataRequest) => getByItemTableData(payload),
  {
    condition: (_payload, { getState }) => {
      const { statuses } = (getState() as { hindsight: HindsightState }).hindsight;
      return statuses.byItemTable !== 'loading';
    },
  },
);

export const fetchByItemSummary = createAsyncThunk(
  'hindsight/fetchByItemSummary',
  async (payload: ByItemSummaryRequest) => getByItemSummary(payload),
  {
    condition: (_payload, { getState }) => {
      const { statuses } = (getState() as { hindsight: HindsightState }).hindsight;
      return statuses.byItemSummary !== 'loading';
    },
  },
);


/** Identifies an insight by what it summarises, so each card and chart caches on its own. */
export { cardInsightKey } from '../services/cardInsightIdentity';

export const fetchCardInsight = createAsyncThunk(
  'hindsight/fetchCardInsight',
  async ({ payload }: CardInsightArgs, { signal }) => getCardInsight(payload, signal),
  {
    /**
     * An insight already generated or already on its way is not asked for again — re-hovering a
     * card must not re-pay several seconds of generation. A failed one may be retried.
     */
    condition: (args, { getState }) => {
      const { cardInsights } = (getState() as { hindsight: HindsightState }).hindsight;
      const entry = cardInsights[cardInsightKey(args)];
      return entry === undefined || entry.status === 'failed';
    },
  },
);

export const fetchHindsightItems = createAsyncThunk(
  'hindsight/fetchItems',
  async (_, { getState }) => {
    const { selection, preferences, tenant, itemSearch, itemSort } = (
      getState() as { hindsight: HindsightState }
    ).hindsight;

    return getHindsightItems({
      selection,
      metricIds: (tenant?.catalogue.metrics ?? []).map((m) => m.id),
      search: itemSearch,
      sort: itemSort ?? undefined,
      includeLastYear: preferences.tyLyEnabled,
    });
  },
);

export const fetchHindsightAttribute = createAsyncThunk(
  'hindsight/fetchAttribute',
  async (attributeId: string, { getState }) => {
    const { selection, preferences, tenant } = (
      getState() as { hindsight: HindsightState }
    ).hindsight;
    const widget = tenant?.widgets.find((w) => w.widgetId === 'attribute-heatmap');
    const metricId =
      preferences.metricByWidgetId['attribute-heatmap'] ??
      widget?.defaultMetricId ??
      tenant?.catalogue.metrics[0]?.id ??
      '';

    return getHindsightAttribute({ selection, attributeId, metricId });
  },
);

export const fetchAttributes = createAsyncThunk(
  'hindsight/fetchAttributes',
  async (params: { planCode: string; seasonCode: number }) => getAttributes(params),
  {
    condition: (_params, { getState }) => {
      const { statuses } = (getState() as { hindsight: HindsightState }).hindsight;
      return statuses.attributes !== 'loading';
    },
  },
);

export const fetchHindsightNarration = createAsyncThunk(
  'hindsight/fetchNarration',
  async (widgetIds: string[], { getState }) => {
    const { selection } = (getState() as { hindsight: HindsightState }).hindsight;
    return getHindsightNarration(selection, widgetIds);
  },
);

export const savePreferences = createAsyncThunk(
  'hindsight/savePreferences',
  async (patch: Partial<UserPreferences>) => patchPreferences(patch),
);

export const overrideVerdict = createAsyncThunk(
  'hindsight/overrideVerdict',
  async ({ itemId, verdict }: { itemId: string; verdict: Verdict }) =>
    patchRecommendation(itemId, verdict),
);

export const clearVerdictOverride = createAsyncThunk(
  'hindsight/clearOverride',
  async (itemId: string) => deleteRecommendationOverride(itemId),
);

/** What one override call is sending, and which articles it answers for. */
export interface SaveItemRecommendationArg {
  payload: RecommendationOverrideRequest;
  /** The changes the payload was built from, so pending, rollback and reconciliation agree. */
  changes: readonly RecommendationChange[];
}

/**
 * Persists a planner's recommendation override.
 *
 * The reducers around it do the interesting part: the choice is applied before the request so the
 * dropdown answers the click, reconciled against `effectiveReco` when the backend replies, and put
 * back if it does not.
 */
export const saveItemRecommendation = createAsyncThunk(
  'hindsight/saveItemRecommendation',
  async ({ payload }: SaveItemRecommendationArg) => overrideItemRecommendation(payload),
);

const hindsightSlice = createSlice({
  name: 'hindsight',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<HindsightTab>) {
      state.activeTab = action.payload;
      // By Item always opens on Visuals View — Table is an in-session choice only.
      if (action.payload === 'byItem') {
        state.preferences.itemViewMode = 'visual';
      }
    },
    setFilterBarCollapsed(state, action: PayloadAction<boolean>) {
      state.filterBarCollapsed = action.payload;
    },
    /**
     * Applies scope on every change, so a selection can never reference something the
     * planner is not permitted to see — including a value restored from a URL.
     */
    applySelection(state, action: PayloadAction<Partial<GlobalSelection>>) {
      state.selection = applyScopeToSelection(
        { ...state.selection, ...action.payload },
        state.scope,
      );
    },
    setItemSearch(state, action: PayloadAction<string>) {
      state.itemSearch = action.payload;
    },
    setItemSort(state, action: PayloadAction<SortState | null>) {
      state.itemSort = action.payload;
    },
    setActiveAttributeId(state, action: PayloadAction<string | null>) {
      state.activeAttributeId = action.payload;
      state.attributeView = null;
    },
    /**
     * Preferences update locally first so a metric swap is instant; the thunk persists it.
     * A rejected save leaves the local value in place rather than snapping the UI back.
     */
    updatePreferences(state, action: PayloadAction<Partial<UserPreferences>>) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setWidgetMetric(
      state,
      action: PayloadAction<{ widgetId: string; metricId: string }>,
    ) {
      state.preferences.metricByWidgetId[action.payload.widgetId] =
        action.payload.metricId;
    },
    setInstanceMetric(
      state,
      action: PayloadAction<{ instanceId: string; metricId: string }>,
    ) {
      state.preferences.metricByInstanceId[action.payload.instanceId] =
        action.payload.metricId;
    },
    /** Season chosen in the plan's season dropdown; drives every KPI request that follows. */
    selectKpiSeason(state, action: PayloadAction<number>) {
      state.selectedSeasonCode = action.payload;
    },
    setItemViewMode(state, action: PayloadAction<ItemViewMode>) {
      state.preferences.itemViewMode = action.payload;
    },
    setOverridesEnabled(state, action: PayloadAction<boolean>) {
      state.preferences.overridesEnabled = action.payload;
    },
    /**
     * Drops cached table rows when the plan or season changes, so a cursor from another
     * collection cannot be reused and a planner never sees the previous plan's articles.
     */
    clearByItemTableRows(state) {
      state.byItemTableRows = [];
      state.statuses.byItemTable = 'idle';
    },
    /**
     * Upserts a fetched page by article. Infinite scroll appends; a refetch of the same
     * block replaces the cells in place so an override already applied is overwritten by
     * the server's current value.
     */
    mergeByItemTableRows(state, action: PayloadAction<ByItemTableRow[]>) {
      const incoming = action.payload;
      if (incoming.length === 0) {
        state.statuses.byItemTable = 'succeeded';
        return;
      }
      const indexByArticle = new Map<string, number>();
      state.byItemTableRows.forEach((row, index) => {
        if (row.article !== undefined && row.article.length > 0) {
          indexByArticle.set(row.article, index);
        }
      });
      incoming.forEach((row) => {
        const article = row.article;
        if (article === undefined || article.length === 0) {
          state.byItemTableRows.push(row);
          return;
        }
        const existing = indexByArticle.get(article);
        if (existing === undefined) {
          indexByArticle.set(article, state.byItemTableRows.length);
          state.byItemTableRows.push(row);
          return;
        }
        state.byItemTableRows[existing] = row;
      });
      state.statuses.byItemTable = 'succeeded';
    },
    /** Replaces the bound table rows. The grid appends pages, so this may grow past one fetch. */
    setByItemTableRows(state, action: PayloadAction<ByItemTableRow[]>) {
      state.byItemTableRows = action.payload;
      state.statuses.byItemTable = 'succeeded';
    },
    setByItemTableStatus(state, action: PayloadAction<LoadStatus>) {
      state.statuses.byItemTable = action.payload;
    },
    /**
     * Drops cached visual-view cards when the plan or season changes, so a cursor from another
     * collection cannot be reused and a planner never sees the previous plan's articles.
     */
    clearByItemVisualItems(state) {
      state.byItemVisualItems = [];
      state.statuses.byItemVisual = 'idle';
    },
    /**
     * Upserts a fetched page by article. Infinite scroll appends; a refetch of the same
     * block replaces the card in place so an override already applied is overwritten by
     * the server's current value.
     */
    mergeByItemVisualItems(state, action: PayloadAction<VisualViewItem[]>) {
      const incoming = action.payload;
      if (incoming.length === 0) {
        state.statuses.byItemVisual = 'succeeded';
        return;
      }
      const indexByKey = new Map<string, number>();
      state.byItemVisualItems.forEach((item, index) => {
        indexByKey.set(visualItemKey(item), index);
      });
      incoming.forEach((item) => {
        const key = visualItemKey(item);
        const existing = indexByKey.get(key);
        if (existing === undefined) {
          indexByKey.set(key, state.byItemVisualItems.length);
          state.byItemVisualItems.push(item);
          return;
        }
        state.byItemVisualItems[existing] = item;
      });
      registerVisualRecommendations(state, incoming);
      state.statuses.byItemVisual = 'succeeded';
    },
    /**
     * Replaces the bound visual cards. New pages append; the list is never sliced to a
     * sliding window, so scroll position stays where the planner left it.
     */
    setByItemVisualItems(state, action: PayloadAction<VisualViewItem[]>) {
      state.byItemVisualItems = action.payload;
      registerVisualRecommendations(state, action.payload);
      state.statuses.byItemVisual = 'succeeded';
    },
    setByItemVisualStatus(state, action: PayloadAction<LoadStatus>) {
      state.statuses.byItemVisual = action.payload;
    },
    /** Optimistic verdict change, so the grid responds to a click without a round trip. */
    applyLocalOverride(
      state,
      action: PayloadAction<{ itemId: string; verdict: Verdict; by: string }>,
    ) {
      const current = state.recommendations[action.payload.itemId];
      if (current === undefined) return;
      state.recommendations[action.payload.itemId] = applyOverride(
        current,
        action.payload.verdict,
        action.payload.by,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHindsightConfig.pending, (state) => {
        state.statuses.config = 'loading';
      })
      .addCase(fetchHindsightConfig.fulfilled, (state, action) => {
        state.statuses.config = 'succeeded';
        state.tenant = action.payload.tenant;
        state.preferences = action.payload.preferences;
      })
      .addCase(fetchHindsightConfig.rejected, (state, action) => {
        state.statuses.config = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchHindsightContext.pending, (state) => {
        state.statuses.context = 'loading';
      })
      .addCase(fetchHindsightContext.fulfilled, (state, action) => {
        state.statuses.context = 'succeeded';
        state.seasons = action.payload.seasons;
        state.facets = action.payload.facets;
        state.scope = action.payload.scope;
        state.clusters = action.payload.clusters;

        // Seed the selection from scope, so the first render is already permitted and
        // complete rather than empty.
        const level = action.payload.facets.levels[1] ?? action.payload.facets.levels[0];
        state.selection = applyScopeToSelection(
          {
            seasonId: action.payload.defaultSeasonId,
            productLevelId: level?.id ?? '',
            productPositionIds: action.payload.scope.productPositionIds,
            countryIds: action.payload.scope.countryIds,
            channelIds: action.payload.scope.channelIds,
          },
          action.payload.scope,
        );
      })
      .addCase(fetchHindsightContext.rejected, (state, action) => {
        state.statuses.context = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchHindsightOverview.pending, (state) => {
        state.statuses.overview = 'loading';
      })
      .addCase(fetchHindsightOverview.fulfilled, (state, action) => {
        state.statuses.overview = 'succeeded';
        state.overview = action.payload;
      })
      .addCase(fetchHindsightOverview.rejected, (state) => {
        state.statuses.overview = 'failed';
      })

      // The previous plan's seasons are cleared as soon as a new request starts, so a stale
      // season code can never be sent for the plan now being viewed.
      .addCase(fetchKpiSeasons.pending, (state) => {
        state.statuses.kpiSeasons = 'loading';
        state.kpiSeasons = [];
        state.selectedSeasonCode = null;
      })
      .addCase(fetchKpiSeasons.fulfilled, (state, action) => {
        state.statuses.kpiSeasons = 'succeeded';
        state.kpiSeasons = action.payload.seasons;
        // Open on the most recent season, matching the config's `$latest` season default.
        state.selectedSeasonCode = latestSeasonCode(action.payload.seasons);
      })
      .addCase(fetchKpiSeasons.rejected, (state, action) => {
        state.statuses.kpiSeasons = 'failed';
        state.kpiSeasons = [];
        state.selectedSeasonCode = null;
        state.error = action.error.message;
      })

      .addCase(fetchByItemSummary.pending, (state) => {
        state.statuses.byItemSummary = 'loading';
      })
      .addCase(fetchByItemSummary.fulfilled, (state, action) => {
        state.statuses.byItemSummary = 'succeeded';
        state.byItemSummary = action.payload;
      })
      .addCase(fetchByItemSummary.rejected, (state) => {
        state.statuses.byItemSummary = 'failed';
        state.byItemSummary = null;
      })

      .addCase(fetchByItemTableData.pending, (state) => {
        state.statuses.byItemTable = 'loading';
      })
      .addCase(fetchByItemTableData.fulfilled, (state, action) => {
        state.statuses.byItemTable = 'succeeded';
        state.byItemTableRows = action.payload.rowData;
      })
      .addCase(fetchByItemTableData.rejected, (state) => {
        state.statuses.byItemTable = 'failed';
        state.byItemTableRows = [];
      })

      // A failure clears the collection rather than keeping the previous plan's items, which
      // is what lets the visual view fall back to the mock-backed collection.
      .addCase(fetchByItemVisualView.pending, (state) => {
        state.statuses.byItemVisual = 'loading';
      })
      .addCase(fetchByItemVisualView.fulfilled, (state, action) => {
        state.statuses.byItemVisual = 'succeeded';
        state.byItemVisualItems = action.payload.items;
        registerVisualRecommendations(state, action.payload.items);
      })
      .addCase(fetchByItemVisualView.rejected, (state) => {
        state.statuses.byItemVisual = 'failed';
        state.byItemVisualItems = [];
      })

      .addCase(fetchHindsightItems.pending, (state) => {
        state.statuses.items = 'loading';
      })
      .addCase(fetchHindsightItems.fulfilled, (state, action) => {
        state.statuses.items = 'succeeded';
        state.items = action.payload.items;
        state.itemsTotal = action.payload.total;
        state.verdictTotals = action.payload.totals;
        state.recommendations = indexRecommendations(action.payload.recommendations);
      })
      .addCase(fetchHindsightItems.rejected, (state) => {
        state.statuses.items = 'failed';
      })

      .addCase(fetchHindsightAttribute.pending, (state) => {
        state.statuses.attribute = 'loading';
      })
      .addCase(fetchHindsightAttribute.fulfilled, (state, action) => {
        state.statuses.attribute = 'succeeded';
        state.attributeView = action.payload;
        if (action.payload.clusters.length > 0) state.clusters = action.payload.clusters;
      })
      .addCase(fetchHindsightAttribute.rejected, (state) => {
        state.statuses.attribute = 'failed';
      })

      .addCase(fetchAttributes.pending, (state) => {
        state.statuses.attributes = 'loading';
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.statuses.attributes = 'succeeded';
        state.apiAttributes = action.payload;
      })
      .addCase(fetchAttributes.rejected, (state) => {
        state.statuses.attributes = 'failed';
        state.apiAttributes = null;
      })

      .addCase(fetchHindsightNarration.pending, (state) => {
        state.statuses.narration = 'loading';
      })
      .addCase(fetchHindsightNarration.fulfilled, (state, action) => {
        state.statuses.narration = 'succeeded';
        action.payload.insights.forEach((insight) => {
          state.narration[insight.widgetId] = insight;
        });
      })
      // Narration failing is not a page failure: widgets fall back to their templates.
      .addCase(fetchHindsightNarration.rejected, (state) => {
        state.statuses.narration = 'failed';
      })

      // Written under the key of the ask rather than of the card on screen: a reply that arrives
      // after the planner has moved on lands in its own entry, where nothing is looking at it.
      .addCase(fetchCardInsight.pending, (state, action) => {
        state.cardInsights[cardInsightKey(action.meta.arg)] = {
          status: 'loading',
          bullets: [],
        };
      })
      .addCase(fetchCardInsight.fulfilled, (state, action) => {
        state.cardInsights[cardInsightKey(action.meta.arg)] = {
          status: 'succeeded',
          bullets: action.payload,
        };
      })
      .addCase(fetchCardInsight.rejected, (state, action) => {
        state.cardInsights[cardInsightKey(action.meta.arg)] = {
          status: 'failed',
          bullets: [],
        };
      })

      .addCase(savePreferences.fulfilled, (state, action) => {
        state.statuses.mutation = 'succeeded';
        state.preferences = action.payload;
      })
      .addCase(overrideVerdict.fulfilled, (state, action) => {
        state.statuses.mutation = 'succeeded';
        state.recommendations[action.payload.itemId] = action.payload;
      })
      .addCase(clearVerdictOverride.fulfilled, (state, action) => {
        state.statuses.mutation = 'succeeded';
        state.recommendations[action.payload.itemId] = action.payload;
      })

      // Applied before the request so the control answers the click, and remembered so it can be
      // put back. `mandatory` and `clear` change nothing yet: only the backend knows what an
      // article reverts to, and guessing would show a value that was never saved.
      .addCase(saveItemRecommendation.pending, (state, action) => {
        state.statuses.mutation = 'loading';

        for (const { article, bucket } of action.meta.arg.changes) {
          const previous = readRecommendation(state, article);
          state.pendingRecommendations[article] = { previous };

          if (bucket === 'keep' || bucket === 'drop') {
            writeRecommendation(state, article, {
              effectiveReco: bucket,
              overridden: true,
              mandatory: previous?.mandatory ?? false,
              staleBasis: previous?.staleBasis ?? null,
              source: previous?.source ?? '',
            });
          }
        }
      })
      /**
       * The response is the authority, not the click: an article may come back with an
       * `effectiveReco` other than the one asked for, and that is the value the planner must see.
       * Articles this call did not ask about are ignored — the endpoint answers `200` even for an
       * id it has never heard of — and an article it asked about but that went unanswered is put
       * back, because an unconfirmed write is not a saved one.
       */
      .addCase(saveItemRecommendation.fulfilled, (state, action) => {
        state.statuses.mutation = 'succeeded';
        const asked = new Set(action.meta.arg.changes.map((change) => change.article));

        for (const item of action.payload.items) {
          if (!asked.has(item.article)) continue;
          asked.delete(item.article);

          const wp = item.workingPlan;
          writeRecommendation(state, item.article, {
            effectiveReco: wp?.value ?? item.effectiveReco ?? '',
            overridden: wp?.overridden ?? item.overridden ?? false,
            mandatory: item.mandatory ?? false,
            staleBasis: item.staleBasis ?? null,
            source: item.source ?? '',
          });

          // Sync the full workingPlan + aiRecommendation objects from the response so both
          // the table row and the visual-view card reflect the backend's authoritative state
          // immediately — individual field writes via writeRecommendation may miss fields
          // like `options` or `editable` that the response carries.
          if (wp) {
            const viForWp = state.byItemVisualItems.find(
              (vi) => visualItemKey(vi) === item.article,
            );
            if (viForWp) {
              viForWp.workingPlan = { ...viForWp.workingPlan, ...wp };
            }
            const trForWp = state.byItemTableRows.find(
              (row) => row.article === item.article,
            );
            if (trForWp) {
              trForWp.workingPlan = { ...trForWp.workingPlan, ...wp };
            }
            if (!viForWp) {
              forEachCachedVisualItem((cached) => {
                if (visualItemKey(cached) !== item.article) return;
                cached.workingPlan = { ...cached.workingPlan, ...wp };
              });
            }
            if (!trForWp) {
              forEachCachedTableRow((cached) => {
                if (cached.article !== item.article) return;
                cached.workingPlan = { ...cached.workingPlan, ...wp };
              });
            }
          }

          if (item.aiRecommendation) {
            const visualItem = state.byItemVisualItems.find(
              (vi) => visualItemKey(vi) === item.article,
            );
            if (visualItem) {
              visualItem.aiRecommendation = item.aiRecommendation;
            }
            const tableRow = state.byItemTableRows.find(
              (row) => row.article === item.article,
            );
            if (tableRow) {
              tableRow.aiRecommendation = item.aiRecommendation;
            }
          }
        }

        for (const article of asked) {
          const previous = state.pendingRecommendations[article]?.previous;
          if (previous != null) writeRecommendation(state, article, previous);
        }

        for (const { article } of action.meta.arg.changes) {
          delete state.pendingRecommendations[article];
        }
      })
      .addCase(saveItemRecommendation.rejected, (state, action) => {
        state.statuses.mutation = 'failed';

        for (const { article } of action.meta.arg.changes) {
          const previous = state.pendingRecommendations[article]?.previous;
          if (previous != null) writeRecommendation(state, article, previous);
          delete state.pendingRecommendations[article];
        }
      });
  },
});

export const {
  setActiveTab,
  setFilterBarCollapsed,
  applySelection,
  setItemSearch,
  setItemSort,
  setActiveAttributeId,
  selectKpiSeason,
  updatePreferences,
  setWidgetMetric,
  setInstanceMetric,
  setItemViewMode,
  setOverridesEnabled,
  applyLocalOverride,
  clearByItemTableRows,
  mergeByItemTableRows,
  setByItemTableRows,
  setByItemTableStatus,
  clearByItemVisualItems,
  mergeByItemVisualItems,
  setByItemVisualItems,
  setByItemVisualStatus,
} = hindsightSlice.actions;

export const hindsightReducer = hindsightSlice.reducer;
