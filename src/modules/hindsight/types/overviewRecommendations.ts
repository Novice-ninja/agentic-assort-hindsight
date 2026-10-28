import type { HierarchyScopeEntry } from "@modules/planning/types";
/**
 * Overview → Missed Opportunities and Carry-Forward & Flags.
 *
 * Both panels are the same endpoint (`POST /v1/hindsight/overview/recommendations`) under
 * different `recommendationType` values, so one set of types serves both.
 *
 * `products[]` arrives snake_cased while the envelope around it is camelCase, so the wire shape
 * is kept separate from the domain shape and mapped once, in the service.
 */

/** Values the endpoint accepts for `recommendationType`. Note `carryForwards` is plural. */
export type RecommendationType = "missedOpportunities" | "carryForwards";

/**
 * Per-item severity. Drives both the label colour and the tile icon.
 *
 * Not in the contract yet — the backend is adding it. Until then every item reads as `null`
 * and falls back to `DEFAULT_RECOMMENDATION_STATUS`; see `services/recommendationStatus`.
 */
export type RecommendationStatus = "flagged" | "watch" | "action";

/** Page size per panel. Clamped to `1..50` before every request. */
export const RECOMMENDATIONS_PAGE_SIZE: Record<RecommendationType, number> = {
  missedOpportunities: 4,
  carryForwards: 4,
};

/** Only populated for Top Style-Colors; carried here so the payload types faithfully. */
export interface RecommendationHierarchy {
  l3: string;
  l4: string;
  label: string;
}

/** Only populated for Top Style-Colors; carried here so the payload types faithfully. */
export interface RecommendationRevenue {
  value: number;
  formattedValue: string;
  currency: string;
}

/** A `products[]` entry exactly as the backend sends it. */
export interface RecommendationProductWire {
  product_id?: string;
  style_id?: string;
  article?: string;
  product_name?: string;
  imageUrl?: string;
  /** Preformatted, e.g. `"132/week • $1.6M"` or `"In-Season Action"`. */
  label?: string;
  /** Pending backend support — see `RecommendationStatus`. */
  status?: string | null;
  hierarchy?: RecommendationHierarchy | null;
  revenue?: RecommendationRevenue | null;
  summary?: string;
  rank?: number;
}

/** A product after mapping, ready to render. */
export interface RecommendationItem {
  /** Stable unique key: `product_id`, falling back to `article` then `style_id`. */
  id: string;
  productId: string;
  styleId: string;
  article: string;
  name: string;
  imageUrl: string;
  label: string;
  /** `null` while the backend has no severity field to send. */
  status: RecommendationStatus | null;
  /** `null` for these two panels; the contract only fills it for Top Style-Colors. */
  hierarchy: RecommendationHierarchy | null;
  /** `null` for these two panels; the contract only fills it for Top Style-Colors. */
  revenue: RecommendationRevenue | null;
  summary: string;
  /** Absolute rank across pages — never derive from array index. */
  rank: number;
}

export interface RecommendationsPagination {
  /** Opaque keyset token. Pass through unchanged; never parse or construct one. */
  cursor: string;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;
}

export interface OverviewRecommendationsRequest {
  planCode: string;
  recommendationType: RecommendationType;
  top: number;
  /** Omit or `""` for the first page; otherwise the previous response's cursor. */
  cursor?: string;
  hierarchyScope?: readonly HierarchyScopeEntry[];
}

/** The response body, as sent. */
export interface OverviewRecommendationsPayload {
  planCode?: string;
  /** Strings on this endpoint even though other Overview endpoints use numbers. */
  referenceSeasonCode?: string;
  planSeasonCode?: string;
  /** Echoes the requested `recommendationType`. */
  type?: string;
  top?: number;
  products?: RecommendationProductWire[];
  pagination?: Partial<RecommendationsPagination> | null;
}

/** One page, mapped. */
export interface OverviewRecommendationsData {
  planCode: string;
  referenceSeasonCode: string;
  planSeasonCode: string;
  type: RecommendationType;
  top: number;
  items: RecommendationItem[];
  pagination: RecommendationsPagination;
}

/** Clamp a page size into the contract's `1..50` range. */
export function clampRecommendationsPageSize(
  top: number,
  fallback = RECOMMENDATIONS_PAGE_SIZE.missedOpportunities,
): number {
  if (!Number.isFinite(top)) return fallback;
  return Math.min(50, Math.max(1, Math.trunc(top)));
}
