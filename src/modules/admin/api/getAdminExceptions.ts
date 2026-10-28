import { apiClient } from '@shared/services';
import type { AdminFilterContext, ExceptionRule, GlobalException } from '../types';

export interface ExceptionQuery {
  filter: AdminFilterContext;
  customerType?: string;
  q?: string;
}

export function getAdminExceptions(
  query: ExceptionQuery,
): Promise<{ items: GlobalException[]; total: number }> {
  const { filter, customerType, q } = query;
  return apiClient.get<{ items: GlobalException[]; total: number }>('/admin/exceptions', {
    departments: filter.departments.join(','),
    seasons: filter.seasons.join(','),
    regions: filter.regions.join(','),
    customerType,
    q,
  });
}

export function patchAdminException(
  id: string,
  patch: { rules: ExceptionRule[] },
): Promise<GlobalException> {
  return apiClient.patch<GlobalException>(`/admin/exceptions/${id}`, patch);
}

export function deleteAdminException(id: string): Promise<void> {
  return apiClient.delete<void>(`/admin/exceptions/${id}`);
}
