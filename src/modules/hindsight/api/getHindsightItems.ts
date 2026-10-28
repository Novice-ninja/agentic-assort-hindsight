import { apiClient } from '@shared/services';
import { selectionQuery } from './selectionQuery';
import type { GlobalSelection, Item, Recommendation, SortState, VerdictTotals } from '../types';

export interface HindsightItemsResponse {
  items: Item[];
  total: number;
  /** Totals are computed server-side over the scoped, searched set, not the page. */
  totals: VerdictTotals;
  recommendations: Recommendation[];
}

export interface ItemsParams {
  selection: GlobalSelection;
  metricIds: string[];
  search?: string;
  sort?: SortState;
  includeLastYear?: boolean;
}

export function getHindsightItems({
  selection,
  metricIds,
  search,
  sort,
  includeLastYear,
}: ItemsParams): Promise<HindsightItemsResponse> {
  return apiClient.get<HindsightItemsResponse>(
    '/hindsight/items',
    selectionQuery(selection, {
      metricIds: metricIds.join(','),
      ...(search === undefined || search === '' ? {} : { q: search }),
      ...(sort === undefined ? {} : { sortBy: sort.columnId, sortDir: sort.direction }),
      ...(includeLastYear === true ? { includeLastYear: 'true' } : {}),
    }),
  );
}

export function patchRecommendation(
  itemId: string,
  verdict: string,
): Promise<Recommendation> {
  return apiClient.patch<Recommendation>(`/hindsight/recommendations/${itemId}`, { verdict });
}

/** Clears a planner override, restoring the agent's verdict as the one in effect. */
export function deleteRecommendationOverride(itemId: string): Promise<Recommendation> {
  return apiClient.delete<Recommendation>(`/hindsight/recommendations/${itemId}/override`);
}
