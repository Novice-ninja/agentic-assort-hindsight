import { apiClient } from '@shared/services';
import type { FilterFacetOption } from '../types';

export function getFilterFacets(): Promise<{ items: FilterFacetOption[] }> {
  return apiClient.get<{ items: FilterFacetOption[] }>('/admin/filters/facets');
}
