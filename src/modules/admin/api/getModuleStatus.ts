import { apiClient } from '@shared/services';
import type { ModuleStatusSummary } from '../types';

export function getModuleStatus(): Promise<{ items: ModuleStatusSummary[] }> {
  return apiClient.get<{ items: ModuleStatusSummary[] }>('/admin/module-status');
}
