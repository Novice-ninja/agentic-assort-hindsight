import { apiClient } from '@shared/services';
import type { TenantConfig, UserPreferences } from '../types';

export interface HindsightConfigResponse {
  tenant: TenantConfig;
  preferences: UserPreferences;
}

/**
 * Tenant configuration and the planner's saved preferences arrive together so the first
 * render can already resolve every widget's metric — fetching them separately would make
 * the page briefly show tenant defaults before snapping to the planner's choices.
 */
export function getHindsightConfig(): Promise<HindsightConfigResponse> {
  return apiClient.get<HindsightConfigResponse>('/hindsight/config');
}
