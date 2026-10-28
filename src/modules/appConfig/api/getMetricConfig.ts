import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { mapMetricConfigs } from '../services/metricConfigMappers';
import type { MetricCatalogue, MetricConfigDto, MetricConfigResponse } from '../types';

/**
 * Real backend endpoint for the metric catalogue. Like the global config it is not mocked, so a
 * failure leaves the store on its baked-in catalogue.
 */
export const METRIC_CONFIG_ENDPOINT = `${env.goApiBaseUrl}/v1/common/metrics-config`;

/** Accepts the `{ data }` envelope the endpoint returns and a bare list. */
function unwrap(response: MetricConfigResponse): MetricConfigDto[] {
  if (Array.isArray(response)) return response;

  if (response.status === false) {
    throw new Error(response.message || 'Metric config request failed');
  }

  return response.data;
}

/** The catalogue indexed by metric key, ready to store. */
export async function getMetricConfig(): Promise<MetricCatalogue> {
  const response = await apiClient.get<MetricConfigResponse>(METRIC_CONFIG_ENDPOINT);
  const rows = unwrap(response);

  if (!Array.isArray(rows)) {
    throw new Error('Metric config response is not a list');
  }

  return mapMetricConfigs(rows);
}
