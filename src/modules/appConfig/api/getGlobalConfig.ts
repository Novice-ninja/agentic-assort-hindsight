import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { GlobalConfig, GlobalConfigResponse } from '../types';

/**
 * Real backend endpoint for the application config. It is not mocked, so until the backend
 * ships it the request fails and the store keeps the baked-in fallback.
 */
export const GLOBAL_CONFIG_ENDPOINT = `${env.goApiBaseUrl}/v1/global-config`;

/**
 * Fetches the application config.
 *
 * A response that is missing `data.modules` is rejected rather than accepted, because running
 * on a half-empty config would hide every view's components; failing sends the caller to the
 * fallback, which is complete.
 */
export async function getGlobalConfig(): Promise<GlobalConfig> {
  const response = await apiClient.get<GlobalConfigResponse>(GLOBAL_CONFIG_ENDPOINT);

  if (response.status === false) {
    throw new Error(response.message || 'Global config request failed');
  }

  const config = response.data;
  if (config?.modules === undefined) {
    throw new Error('Global config response is missing data.modules');
  }

  return config;
}
