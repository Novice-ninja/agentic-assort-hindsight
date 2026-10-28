import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';
import { BY_ITEM_VISUAL_FETCH_PAGE_SIZE } from '../services/byItemPaging';
import { formatKpiValue } from '../services/formatKpiValue';
import type {
  ByItemVisualViewApiPayload,
  ByItemVisualViewData,
  ByItemVisualViewPagination,
  ByItemVisualViewRequest,
  ByItemVisualViewResponse,
  VisualViewItem,
  VisualViewKpi,
} from '../types';

/** Real backend endpoint for the By Item visual (card) view. */
export const BY_ITEM_VISUAL_VIEW_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/by-item/visual-view`;

/** Module and component the backend keys its view configuration by. */
export const BY_ITEM_VIEW_SCOPE = { moduleName: 'by-item', componentName: 'card-view' } as const;

/** Cards asked for on each visual-view page, and the `pageSize` sent on every request. */
export const BY_ITEM_VISUAL_PAGE_SIZE = BY_ITEM_VISUAL_FETCH_PAGE_SIZE;

function isEnvelope(
  response: ByItemVisualViewResponse,
): response is { status: boolean; message?: string; data: ByItemVisualViewApiPayload } {
  return 'status' in response;
}

function decodeVisualKpi(kpi: VisualViewKpi): VisualViewKpi {
  const key = kpi.name ?? kpi.key ?? '';
  return {
    ...kpi,
    key,
    label: decodeIaString(kpi.label),
    formattedValue: formatKpiValue({
      value: kpi.value,
      format: kpi.format,
      displayValue: kpi.formattedValue,
    }),
  };
}

function decodeKpiList(list: VisualViewKpi[] | undefined): VisualViewKpi[] {
  return Array.isArray(list) ? list.map(decodeVisualKpi) : [];
}

function decodeVisualItem(item: VisualViewItem): VisualViewItem {
  const kpisFront = decodeKpiList(item.kpisFront);
  const kpisBack = decodeKpiList(item.kpisBack);
  const kpis = decodeKpiList(item.kpis);
  return {
    ...item,
    product: {
      ...item.product,
      name: decodeIaString(item.product.name),
      category: item.product.category ? decodeIaString(item.product.category) : item.product.category,
    },
    kpisFront,
    kpisBack,
    kpis: kpis.length > 0 ? kpis : kpisFront,
    recommendation: item.recommendation
      ? { ...item.recommendation, label: decodeIaString(item.recommendation.label) }
      : item.recommendation,
    ...(item.aiRecommendation
      ? {
          aiRecommendation: {
            ...item.aiRecommendation,
            value: decodeIaString(item.aiRecommendation.value),
            narration: decodeIaString(item.aiRecommendation.narration),
          },
        }
      : {}),
  };
}

function mapPagination(
  pagination: ByItemVisualViewApiPayload['pagination'],
  pageSize: number,
): ByItemVisualViewPagination {
  const cursor = typeof pagination?.cursor === 'string' ? pagination.cursor : '';
  return {
    cursor,
    pageSize: typeof pagination?.pageSize === 'number' ? pagination.pageSize : pageSize,
    // A cursor alone is not permission to fetch again; `hasMore` is the only gate.
    // Missing pagination (current samples omit it) means the page is complete.
    hasMore: pagination?.hasMore === true && cursor.length > 0,
    totalCount: typeof pagination?.totalCount === 'number' ? pagination.totalCount : 0,
  };
}

/**
 * Fetches one page of the item collection for the visual view.
 *
 * The first page sends `cursor: ""`. Later pages send `pagination.cursor` from the previous
 * response unchanged — it is an opaque keyset token, not an offset. The contract documents a
 * bare payload, so an enveloped response is unwrapped only when one is actually present.
 */
export async function getByItemVisualView(
  payload: ByItemVisualViewRequest,
): Promise<ByItemVisualViewData> {
  const response = await apiClient.post<ByItemVisualViewResponse>(
    BY_ITEM_VISUAL_VIEW_ENDPOINT,
    payload,
  );

  const data = isEnvelope(response)
    ? (() => {
        if (!response.status) {
          throw new Error(response.message || 'By item visual view request failed');
        }
        return response.data ?? {};
      })()
    : response;

  return {
    planCode: data.planCode ?? payload.filters.planCode,
    referenceSeasonCode: data.referenceSeasonCode ?? '',
    items: Array.isArray(data.items) ? data.items.map(decodeVisualItem) : [],
    pagination: mapPagination(data.pagination, payload.filters.pageSize),
  };
}
