import { env } from "@config/env";
import { apiClient } from "@shared/services";
import { decodeIaString } from "@shared/utils/format";
import { getFlooringScope } from "../priority/flooringScope";
import {
  clampTopStyleColorsPageSize,
  type TopStyleColorApiProduct,
  type TopStyleColorItem,
  type TopStyleColorsApiData,
  type TopStyleColorsData,
  type TopStyleColorsPagination,
  type TopStyleColorsRequest,
  type TopStyleColorsResponse,
} from "../types";

/** Real backend endpoint for Overview → Top Performing Style-Colors. */
export const TOP_STYLE_COLORS_ENDPOINT = `${env.goApiBaseUrl}/v1/hindsight/overview/recommendations`;

const EMPTY_REVENUE = { value: 0, formattedValue: "", currency: "" };

function parsePercent(label: string): number {
  const value = Number.parseFloat(label.replace("%", ""));
  return Number.isFinite(value) ? value : 0;
}

function mapPagination(
  pagination: TopStyleColorsApiData["pagination"],
  pageSize: number,
): TopStyleColorsPagination {
  const cursor =
    typeof pagination?.cursor === "string" ? pagination.cursor : "";
  return {
    cursor,
    pageSize:
      typeof pagination?.pageSize === "number" ? pagination.pageSize : pageSize,
    hasMore: pagination?.hasMore === true && cursor.length > 0,
    totalCount:
      typeof pagination?.totalCount === "number" ? pagination.totalCount : 0,
  };
}

/**
 * Maps a recommendations `products[]` row onto the card model (`styleColor` + `sellThrough`).
 */
export function toTopStyleColorItem(
  product: TopStyleColorApiProduct,
): TopStyleColorItem {
  const hierarchy = product.hierarchy ?? {};
  const label = typeof product.label === "string" ? product.label : "";
  return {
    article: product.article,
    styleColor: {
      id: product.styleId || product.productId || product.article,
      name: decodeIaString(product.productName ?? ""),
      imageUrl: product.imageUrl ?? "",
    },
    hierarchy: {
      l3: decodeIaString(hierarchy.l3 ?? ""),
      l4: decodeIaString(hierarchy.l4 ?? ""),
      label: decodeIaString(hierarchy.label ?? ""),
    },
    revenue: product.revenue ?? EMPTY_REVENUE,
    sellThrough: {
      value: parsePercent(label),
      formattedValue: label,
    },
    summary: decodeIaString(product.summary ?? ""),
    rank: product.rank,
  };
}

/**
 * Fetches one page of top-performing style-colors for a plan.
 *
 * `top` is clamped to `1..50` before the request. The cursor is an opaque keyset token —
 * callers must pass it through unchanged from `pagination.cursor` and never invent one.
 */
export async function getTopStyleColors(
  payload: TopStyleColorsRequest,
  options: { signal?: AbortSignal } = {},
): Promise<TopStyleColorsData> {
  const top = clampTopStyleColorsPageSize(payload.top);
  const body = {
    planCode: payload.planCode,
    top,
    cursor: payload.cursor ?? "",
    recommendationType: "topStyleColors",
    hierarchyLevels: ["l3"],
    hierarchyScope:
      payload.hierarchyScope ?? getFlooringScope(payload.planCode),
  };

  const response = await apiClient.post<TopStyleColorsResponse>(
    TOP_STYLE_COLORS_ENDPOINT,
    body,
    { signal: options.signal },
  );

  if (!response.status) {
    throw new Error(response.message || "Top style-colors request failed");
  }

  const data = response.data ?? {};
  return {
    planCode: data.planCode ?? payload.planCode,
    referenceSeasonCode: data.referenceSeasonCode ?? "",
    planSeasonCode: data.planSeasonCode ?? "",
    top: typeof data.top === "number" ? data.top : top,
    products: Array.isArray(data.products)
      ? data.products.map(toTopStyleColorItem)
      : [],
    pagination: mapPagination(data.pagination, top),
  };
}
