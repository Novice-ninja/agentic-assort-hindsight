import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';
import { BY_ITEM_FETCH_PAGE_SIZE } from '../services/byItemPaging';
import { toFlatHierarchyFilters } from '../services/byItemTableFilters';
import { normalizeByItemTableRow, toByItemTableRow } from '../services/byItemTableRows';
import type {
  HindsightCompareTo,
  ByItemTableApiPayload,
  ByItemTableData,
  ByItemTableDataRequest,
  ByItemTableDataResponse,
  ByItemTablePagination,
  VisualViewItem,
} from '../types';
import type { HierarchyScopeEntry } from '@modules/planning/types';
import { toCreatePlanHierarchyScope } from '@modules/planning/services/filterHierarchy';

/** Backend endpoint for the By Item table rows, keyed by module and component. */
export const BY_ITEM_TABLE_DATA_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/by-item/table-data`;
/** Module and component the backend keys the By Item table by. */
export const BY_ITEM_TABLE_SCOPE = { moduleName: 'by-item', componentName: 'table-view' } as const;

/**
 * Items asked for on each table-data page, and the `pageSize` sent on every request.
 * The grid binds from IndexedDB; scrolling to the last bound row loads the next page.
 */
export const BY_ITEM_TABLE_PAGE_SIZE = BY_ITEM_FETCH_PAGE_SIZE;

/**
 * Comparison bases requested until a compare-to control exists in the By Item toolbar. Empty
 * asks the backend for its own default. Anything sent must be one of `optimisedly`, `planned`
 * or `forecast` — the backend rejects any other value outright.
 */
export const DEFAULT_TABLE_COMPARE_TO: readonly HindsightCompareTo[] = [];

function isEnvelope(
  response: ByItemTableDataResponse,
): response is { status: boolean; message?: string; data: ByItemTableApiPayload } {
  return 'status' in response;
}

function decodeTableItem(item: VisualViewItem): VisualViewItem {
  return {
    ...item,
    product: {
      ...item.product,
      name: decodeIaString(item.product.name),
      category: item.product.category
        ? decodeIaString(item.product.category)
        : item.product.category,
    },
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
  pagination: ByItemTableApiPayload['pagination'],
  pageSize: number,
): ByItemTablePagination {
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
 * Fetches one page of By Item table rows.
 *
 * The first page sends `cursor: ""`. Later pages send `pagination.cursor` from the previous
 * response unchanged — it is an opaque keyset token, not an offset. Prefers cell-shaped
 * `rowData`; older `items` payloads are mapped onto the same row model.
 *
 * When `hierarchyScope` is present it is sent in Create Plan wire form and also flattened as
 * `l0_name` / `l1_name` / … for backends that expect chart-style filter keys.
 */
export async function getByItemTableData(
  payload: ByItemTableDataRequest,
  options?: { uiHierarchyScope?: readonly HierarchyScopeEntry[] },
): Promise<ByItemTableData> {
  const flat =
    options?.uiHierarchyScope !== undefined
      ? toFlatHierarchyFilters(options.uiHierarchyScope)
      : {};
  const hierarchyScope =
    payload.filters.hierarchyScope ??
    (options?.uiHierarchyScope !== undefined
      ? toCreatePlanHierarchyScope(options.uiHierarchyScope)
      : undefined);

  const response = await apiClient.post<ByItemTableDataResponse>(BY_ITEM_TABLE_DATA_ENDPOINT, {
    ...payload,
    filters: {
      ...payload.filters,
      ...flat,
      ...(hierarchyScope !== undefined && hierarchyScope.length > 0
        ? { hierarchyScope }
        : {}),
    },
  });

  const data = isEnvelope(response)
    ? (() => {
        if (!response.status) {
          throw new Error(response.message || 'By item table data request failed');
        }
        return response.data ?? {};
      })()
    : response;

  const rowData = Array.isArray(data.rowData)
    ? data.rowData.map(normalizeByItemTableRow)
    : Array.isArray(data.items)
      ? data.items.map((item) => normalizeByItemTableRow(toByItemTableRow(decodeTableItem(item))))
      : [];

  return {
    rowData,
    pagination: mapPagination(data.pagination, payload.filters.pageSize),
  };
}
