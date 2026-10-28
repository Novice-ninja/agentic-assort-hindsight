import type { HierarchyScopeEntry } from "@modules/planning/types";
/**
 * Top Performing Style-Colors — Overview widget.
 *
 * Posted to `POST /v1/hindsight/overview/recommendations` with
 * `recommendationType: "topStyleColors"`. Season codes arrive as strings here
 * even though other Overview endpoints use numbers.
 */

/** Page size for one scroll page. Clamped to `1..50` before every request. */
export const TOP_STYLE_COLORS_PAGE_SIZE = 4;

export interface TopStyleColorStyle {
  id: string;
  name: string;
  imageUrl: string;
}

export interface TopStyleColorHierarchy {
  l3: string;
  l4: string;
  /** Preformatted meta line, e.g. `"8800505-adidas"`. */
  label: string;
}

export interface TopStyleColorRevenue {
  value: number;
  formattedValue: string;
  currency: string;
}

export interface TopStyleColorSellThrough {
  value: number;
  formattedValue: string;
}

/** Card model after the wire product is mapped. */
export interface TopStyleColorItem {
  article: string;
  styleColor: TopStyleColorStyle;
  hierarchy: TopStyleColorHierarchy;
  revenue: TopStyleColorRevenue;
  sellThrough: TopStyleColorSellThrough;
  summary: string;
  /** Absolute rank across pages — never derive from array index. */
  rank: number;
}

export interface TopStyleColorsPagination {
  /** Opaque keyset cursor for the next page. Empty / absent when there is no next page. */
  cursor: string;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;
}

/** Fields the hook sends; the API layer adds `recommendationType` and `hierarchyLevels`. */
export interface TopStyleColorsRequest {
  planCode: string;
  top: number;
  /** Omit or `""` for the first page; otherwise the previous response's opaque cursor. */
  cursor?: string;
  hierarchyScope?: readonly HierarchyScopeEntry[];
}

/** Hierarchy as the recommendations endpoint returns it. */
export interface TopStyleColorApiHierarchy {
  l0?: string;
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
  l5?: string;
  l6?: string;
  label?: string;
}

/**
 * One product in `data.products`. The endpoint does not nest `styleColor` or
 * `sellThrough` — name, image, and the sell-through `label` sit on the product.
 */
export interface TopStyleColorApiProduct {
  productId?: string;
  styleId?: string;
  article: string;
  productName?: string;
  imageUrl?: string;
  /** Sell-through, e.g. `"66.1%"`. */
  label?: string;
  hierarchy?: TopStyleColorApiHierarchy;
  revenue?: TopStyleColorRevenue;
  summary?: string;
  rank: number;
}

export interface TopStyleColorsApiData {
  planCode?: string;
  referenceSeasonCode?: string;
  planSeasonCode?: string;
  type?: string;
  top?: number;
  products?: TopStyleColorApiProduct[];
  pagination?: Partial<TopStyleColorsPagination> | null;
}

/** Mapped page the hook and cards consume. */
export interface TopStyleColorsData {
  planCode: string;
  referenceSeasonCode: string;
  planSeasonCode: string;
  top: number;
  products: TopStyleColorItem[];
  pagination: TopStyleColorsPagination;
}

export interface TopStyleColorsResponse {
  status: boolean;
  data: TopStyleColorsApiData;
  message?: string;
}

/** Clamp a page size into the contract's `1..50` range. */
export function clampTopStyleColorsPageSize(top: number): number {
  if (!Number.isFinite(top)) return TOP_STYLE_COLORS_PAGE_SIZE;
  return Math.min(50, Math.max(1, Math.trunc(top)));
}
