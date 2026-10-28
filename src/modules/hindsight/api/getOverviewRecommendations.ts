import { env } from "@config/env";
import { apiClient } from "@shared/services";
import { decodeIaString } from "@shared/utils/format";
import { parseRecommendationStatus } from "../services/recommendationStatus";
import { getFlooringScope } from "../priority/flooringScope";
import {
  clampRecommendationsPageSize,
  RECOMMENDATIONS_PAGE_SIZE,
  type OverviewRecommendationsData,
  type OverviewRecommendationsPayload,
  type OverviewRecommendationsRequest,
  type RecommendationItem,
  type RecommendationProductWire,
  type RecommendationsPagination,
  type RecommendationType,
} from "../types";

/** Real backend endpoint for Overview → Missed Opportunities and Carry-Forward & Flags. */
export const OVERVIEW_RECOMMENDATIONS_ENDPOINT = `${env.goApiBaseUrl}/v1/hindsight/overview/recommendations`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns the payload whether or not it arrived inside the `{ status, data, message }` envelope
 * its sibling Overview endpoints use — the contract for this one shows a bare body, and either
 * shape carries the same fields. A `status: false` envelope throws, so a business failure
 * reported over a 200 lands in the same error path as a network failure.
 */
export function unwrapRecommendationsPayload(
  raw: unknown,
): OverviewRecommendationsPayload {
  if (!isRecord(raw)) {
    throw new Error("Overview recommendations response is not an object");
  }

  if (typeof raw.status === "boolean") {
    if (!raw.status) {
      throw new Error(
        typeof raw.message === "string" && raw.message.length > 0
          ? raw.message
          : "Overview recommendations request failed",
      );
    }
    if (isRecord(raw.data)) return raw.data as OverviewRecommendationsPayload;
  }

  return raw as OverviewRecommendationsPayload;
}

/**
 * Guards against a response landing in the wrong panel.
 *
 * Only a positive match on the *other* type is rejected: the echo is a convenience field, and an
 * unfamiliar spelling of the type we asked for should not blank a panel that has valid products.
 */
function assertTypeMatches(
  echoed: string | undefined,
  requested: RecommendationType,
): void {
  if (typeof echoed !== "string" || echoed.trim().length === 0) return;
  const normalised = echoed.trim().toLowerCase();
  const other: RecommendationType =
    requested === "missedOpportunities"
      ? "carryForwards"
      : "missedOpportunities";
  if (normalised === other.toLowerCase()) {
    throw new Error(
      `Overview recommendations returned "${echoed}" for ${requested}`,
    );
  }
}

function text(value: string | undefined): string {
  return typeof value === "string" ? decodeIaString(value) : "";
}

function mapProduct(
  product: RecommendationProductWire,
  index: number,
): RecommendationItem {
  const productId = product.product_id?.trim() ?? "";
  const article = product.article?.trim() ?? "";
  const styleId = product.style_id?.trim() ?? "";

  return {
    // `product_id` is the item's own identity; the others only stand in when it is absent so a
    // React key and the de-dupe both stay stable across pages.
    id: productId || article || styleId || `row-${index}`,
    productId,
    styleId,
    article,
    name: text(product.product_name),
    imageUrl: product.imageUrl?.trim() ?? "",
    label: text(product.label),
    status: parseRecommendationStatus(product.status),
    hierarchy: product.hierarchy ?? null,
    revenue: product.revenue ?? null,
    summary: text(product.summary),
    rank: typeof product.rank === "number" ? product.rank : index + 1,
  };
}

function mapPagination(
  pagination: OverviewRecommendationsPayload["pagination"],
  pageSize: number,
): RecommendationsPagination {
  const cursor =
    typeof pagination?.cursor === "string" ? pagination.cursor : "";
  return {
    cursor,
    pageSize:
      typeof pagination?.pageSize === "number" ? pagination.pageSize : pageSize,
    // A cursor alone is not permission to fetch again; `hasMore` is the only gate.
    hasMore: pagination?.hasMore === true && cursor.length > 0,
    totalCount:
      typeof pagination?.totalCount === "number" ? pagination.totalCount : 0,
  };
}

/**
 * Fetches one page of Overview recommendations for a plan.
 *
 * `top` is clamped to `1..50` before the request. The cursor is an opaque keyset token — callers
 * pass it through unchanged from `pagination.cursor` and never invent one. Server order is
 * authoritative and is what keeps `rank` coherent across pages, so nothing is re-sorted here.
 */
export async function getOverviewRecommendations(
  payload: OverviewRecommendationsRequest,
  options: { signal?: AbortSignal } = {},
): Promise<OverviewRecommendationsData> {
  const top = clampRecommendationsPageSize(
    payload.top,
    RECOMMENDATIONS_PAGE_SIZE[payload.recommendationType],
  );
  const body: OverviewRecommendationsRequest = {
    planCode: payload.planCode,
    recommendationType: payload.recommendationType,
    top,
    cursor: payload.cursor ?? "",
    hierarchyScope:
      payload.hierarchyScope ?? getFlooringScope(payload.planCode),
  };

  const raw = await apiClient.post<unknown>(
    OVERVIEW_RECOMMENDATIONS_ENDPOINT,
    body,
    {
      signal: options.signal,
    },
  );
  const data = unwrapRecommendationsPayload(raw);
  assertTypeMatches(data.type, payload.recommendationType);

  return {
    planCode: data.planCode ?? payload.planCode,
    referenceSeasonCode: data.referenceSeasonCode ?? "",
    planSeasonCode: data.planSeasonCode ?? "",
    type: payload.recommendationType,
    top: typeof data.top === "number" ? data.top : top,
    items: (data.products ?? []).map(mapProduct),
    pagination: mapPagination(data.pagination, top),
  };
}
