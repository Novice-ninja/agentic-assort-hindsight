import { apiClient } from '@shared/services';
import type { AdminFilterContext, AdminProduct } from '../types';

export function getAdminProducts(
  filter: AdminFilterContext,
): Promise<{ items: AdminProduct[]; total: number }> {
  return apiClient.get<{ items: AdminProduct[]; total: number }>('/admin/products', {
    departments: filter.departments.join(','),
    seasons: filter.seasons.join(','),
    regions: filter.regions.join(','),
  });
}
