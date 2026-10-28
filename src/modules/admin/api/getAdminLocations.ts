import { apiClient } from '@shared/services';
import type { AdminFilterContext, AdminLocation } from '../types';

export interface LocationQuery {
  filter: AdminFilterContext;
  customerType?: string;
  q?: string;
}

export function getAdminLocations(
  query: LocationQuery,
): Promise<{ items: AdminLocation[]; total: number }> {
  const { filter, customerType, q } = query;
  return apiClient.get<{ items: AdminLocation[]; total: number }>('/admin/locations', {
    departments: filter.departments.join(','),
    seasons: filter.seasons.join(','),
    regions: filter.regions.join(','),
    customerType,
    q,
  });
}

export function patchAdminLocation(
  id: string,
  patch: Partial<AdminLocation>,
): Promise<AdminLocation> {
  return apiClient.patch<AdminLocation>(`/admin/locations/${id}`, patch);
}
