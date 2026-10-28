import { apiClient } from '@shared/services';
import type { DashboardKpi, DashboardSummary, PlatformCard, Task } from '../types';

export function getDashboardSummary(): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>('/dashboard/summary');
}

export function getDashboardTasks(): Promise<{ items: Task[]; total: number }> {
  return apiClient.get<{ items: Task[]; total: number }>('/dashboard/tasks');
}

export function getPlatformCards(): Promise<{ items: PlatformCard[] }> {
  return apiClient.get<{ items: PlatformCard[] }>('/dashboard/platform-cards');
}

export function getKpis(): Promise<{ items: DashboardKpi[] }> {
  return apiClient.get<{ items: DashboardKpi[] }>('/dashboard/kpis');
}
