/**
 * By Item tab contracts.
 *
 * These mirror `POST /v1/plans/by-item/summary` and
 * `POST /v1/plans/by-item/visual-view`. Wire KPIs carry `name` + a numeral `format` mask;
 * the API layer maps those onto the UI's `key` + `formattedValue` before anything renders.
 */

import type { ByItemAiRecommendationCell, ByItemSelectCell } from './byItemTable';

/** Values the recommendation toolbar filter sends in both By Item API payloads. */
export type ByItemRecommendationFilter = 'all' | 'keep' | 'drop';

export const DEFAULT_BY_ITEM_RECOMMENDATION: ByItemRecommendationFilter = 'all';

const VALID_FILTERS = new Set<string>(['all', 'keep', 'drop']);

/** Coerces the first element of a `useControlFilter` selection to the union, defaulting to `'all'`. */
export function toRecommendationFilter(selected: string[]): ByItemRecommendationFilter {
  const first = selected[0];
  if (first !== undefined && VALID_FILTERS.has(first)) return first as ByItemRecommendationFilter;
  return DEFAULT_BY_ITEM_RECOMMENDATION;
}

/** Direction of a summary comparison. `unavailable` means there was nothing to compare against. */
export type ByItemComparisonDirection = 'up' | 'down' | 'flat' | 'unavailable';

/** Why a comparison carries no value, when `direction` is `unavailable`. */
export type ByItemComparisonAvailability = 'available' | 'noData' | 'sourceUnavailable';

export interface ByItemKpiComparison {
  baseLabel: string;
  baseSeasonCode: string;
  baseValue: number | null;
  compareLabel: string;
  compareSeasonCode: string;
  compareValue: number | null;
  delta: number | null;
  deltaUnit: string;
  direction: ByItemComparisonDirection;
  availability: ByItemComparisonAvailability;
}

export interface ByItemSummaryKpi {
  /** UI metric key, taken from the wire `name` (e.g. `gm$`, `slsu`). */
  key: string;
  /** Wire metric name when the payload still carries it. */
  name?: string;
  /** Display name for the card, e.g. `GM $`, `SlsU`, `ST%`. */
  label: string;
  variant: 'stat';
  value: number | null;
  formattedValue: string;
  /** numeral.js mask from the wire payload, e.g. `$0,0.0a`, `0.00%`. */
  format?: string;
  /** Free-form unit hint (`$`, `percent`, `number`, or empty). */
  unit: string;
  /** Null when the request asked for no comparisons. */
  comparison: ByItemKpiComparison[] | null;
}

export interface ByItemRecommendationBadge {
  text: string;
  /** Palette name (`green`, `amber`, `red`), not a CSS colour. */
  color: string;
}

export interface ByItemRecommendationCount {
  key: string;
  value: number;
  formattedValue: string;
  badge: ByItemRecommendationBadge;
}

export interface ByItemRecommendationBreakdown {
  key: string;
  label: string;
  variant: 'breakdown';
  /** Provenance of the breakdown, e.g. `ai`. Ignored for display. */
  source?: string;
  items: ByItemRecommendationCount[];
}

export interface ByItemSummaryCards {
  planCode?: string;
  referenceSeasonCode?: string;
  kpis: ByItemSummaryKpi[];
  /** Absent for a plan with no recommendations yet. */
  recommendation: ByItemRecommendationBreakdown | null;
}

export interface ByItemSummaryRequest {
  planCode: string;
  moduleName: string;
  componentName: string;
  /** Which recommendation set to summarise — e.g. `'ai'`. */
  recommendationSource: 'ai' | string;
}

export interface ByItemSummaryData {
  planCode: string;
  referenceSeasonCode: string;
  planSeasonCode?: string;
  compareTo?: string[];
  cards: ByItemSummaryCards;
}

export interface ByItemSummaryResponse {
  status: boolean;
  data: ByItemSummaryData;
  message: string;
}

export interface VisualViewProduct {
  id: string;
  /**
   * The article id, which the table payload carries as its own `article` field and which is what
   * the recommendation-override endpoint keys on. Distinct from `id`, which is the style.
   */
  article?: string;
  /**
   * Human-readable style id shown on the card front/back (e.g. `"3040"`). Distinct from `id`,
   * which is the backend product key (e.g. `"000000001206490011"`).
   */
  styleId?: string;
  colorId?: string;
  /** Style description distinct from `name` (which includes colourway). */
  style?: string;
  /** Colourway code, e.g. `BLK`. Distinct from `colorId` when both arrive. */
  color?: string;
  name: string;
  category?: string;
  imageUrl?: string | null;
  hasAiInsight?: boolean;
  /** False hides the image and leaves the placeholder, keeping card heights identical. */
  showImage?: boolean;
}

export type VisualViewSentiment = 'positive' | 'negative' | 'neutral';

export interface VisualViewComparison {
  basis: string;
  label: string;
  delta: number | null;
  deltaUnit?: string;
  sentiment: VisualViewSentiment;
}

export interface VisualViewKpi {
  /** UI metric key, taken from the wire `name` when `key` is absent. */
  key: string;
  /** Wire metric name, e.g. `slsu`, `gm%`. */
  name?: string;
  label: string;
  value: number | null;
  formattedValue: string;
  /** numeral.js mask from the wire payload, e.g. `$0,0.0a`, `0.00%`. */
  format?: string;
  unit?: string;
  /** One object, several in an array, or nothing — all three occur in the contract. */
  comparison?: VisualViewComparison | VisualViewComparison[] | null;
}

export interface VisualViewRecommendationOption {
  value: string;
  label: string;
}

export interface VisualViewRecommendation {
  id: string;
  type: string;
  label: string;
  selected: string | null;
  /** True when the override can be discarded, returning the item to the system's verdict. */
  clearable?: boolean;
  /** True when `selected` is a planner's override rather than the system's recommendation. */
  overridden?: boolean;
  /** An article that must stay in range. Editable regardless: the backend leaves it unlocked. */
  mandatory?: boolean;
  staleBasis?: boolean | null;
  /** Provenance of `selected`, e.g. `override` or `verdict`. */
  source?: string;
  options: VisualViewRecommendationOption[];
}

export interface VisualViewItem {
  product: VisualViewProduct;
  /**
   * @deprecated Prefer `kpisFront` / `kpisBack`. Older payloads sent one list; the UI still
   * uses it as a front-face fallback when `kpisFront` is absent.
   */
  kpis?: VisualViewKpi[];
  /** Metrics the card front shows, in order, with backend labels. */
  kpisFront?: VisualViewKpi[];
  /** Metrics the card back shows, in order, with backend labels. */
  kpisBack?: VisualViewKpi[];
  recommendation?: VisualViewRecommendation | null;
  /**
   * AI verdict + pre-computed narration. Same wire shape as the table cell
   * (`{ value, narration }`); the card sparkle tooltip reads `narration`.
   */
  aiRecommendation?: ByItemAiRecommendationCell;
  /**
   * Planner's working-plan control. Same shape as the table's `ByItemSelectCell`:
   * plain string options (`["keep","drop"]`), not `{value,label}` pairs.
   * When present it takes precedence over the legacy `recommendation` wrapper for the card
   * dropdown.
   */
  workingPlan?: ByItemSelectCell;
}

export interface ByItemVisualViewPagination {
  /** Opaque keyset token for the next page. Empty when there is no next page. */
  cursor: string;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;
}

/** Status of a subsequent visual-view page while earlier cards stay visible. */
export type ByItemVisualPageStatus = 'idle' | 'loading' | 'failed';

export interface ByItemVisualViewFilters {
  planCode: string;
  recommendation: ByItemRecommendationFilter;
  /** Omit or `""` for the first page; otherwise the previous response's opaque cursor. */
  cursor: string;
  pageSize: number;
}

export interface ByItemVisualViewRequest {
  moduleName: string;
  componentName: string;
  filters: ByItemVisualViewFilters;
}

export interface ByItemVisualViewData {
  planCode: string;
  referenceSeasonCode: string;
  items: VisualViewItem[];
  pagination: ByItemVisualViewPagination;
}

/** Wire shape inside `data` — items plus optional pagination. */
export interface ByItemVisualViewApiPayload {
  planCode?: string;
  referenceSeasonCode?: string;
  planSeasonCode?: string;
  items?: VisualViewItem[];
  pagination?: Partial<ByItemVisualViewPagination> | null;
}

/**
 * The contract documents a bare payload while every deployed endpoint wraps one in an
 * envelope. Both are accepted so the service keeps working whichever way it ships.
 */
export type ByItemVisualViewResponse =
  | { status: boolean; message?: string; data: ByItemVisualViewApiPayload }
  | ByItemVisualViewApiPayload;
