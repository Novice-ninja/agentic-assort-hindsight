import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { ApiRequestOptions } from '@shared/services/apiClient';
import type {
  FilterConfigData,
  FilterConfigResponse,
  FilterValuesData,
  FilterValuesRequest,
  FilterValuesResponse,
} from '../types';

const FILTER_CONFIG_ENDPOINT = `${env.goApiBaseUrl}/v1/filters/config`;
const FILTER_VALUES_ENDPOINT = `${env.goApiBaseUrl}/v1/filters/values`;

/**
 * Confirmed for Product Scope: `snapshot_id` is required on the wire but the FE has no
 * session/bootstrap source yet — send an empty string until one exists.
 */
export const EMPTY_FILTER_SNAPSHOT_ID = '';

function isFilterConfigData(data: unknown): data is FilterConfigData {
  if (typeof data !== 'object' || data === null) return false;
  const body = data as FilterConfigData;
  return typeof body.config_hash === 'string' && Array.isArray(body.fields);
}

function isFilterValuesData(data: unknown): data is FilterValuesData {
  if (typeof data !== 'object' || data === null) return false;
  const body = data as FilterValuesData;
  return (
    typeof body.config_hash === 'string' &&
    typeof body.values === 'object' &&
    body.values !== null
  );
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

/**
 * Field configuration for cascaded filters (all dimensions).
 * Pass `configKey` to load a named configuration (e.g. `cluster_config` for Location
 * Clustering); omit it for the default Create Plan configuration.
 */
export async function getFilterConfig(configKey?: string): Promise<FilterConfigData> {
  const url = configKey
    ? `${FILTER_CONFIG_ENDPOINT}?config_key=${encodeURIComponent(configKey)}`
    : FILTER_CONFIG_ENDPOINT;
  const payload = await apiClient.get<FilterConfigResponse | FilterConfigData>(url);
  const data = unwrapData(payload);
  if (!isFilterConfigData(data)) {
    throw new Error('Invalid /filters/config response');
  }
  return data;
}

/** Option values for one or more filter attributes, scoped by ancestor selections. */
export async function getFilterValues(
  request: FilterValuesRequest,
  options?: ApiRequestOptions,
): Promise<FilterValuesData> {
  const payload = await apiClient.post<FilterValuesResponse | FilterValuesData>(
    FILTER_VALUES_ENDPOINT,
    request,
    options,
  );
  const data = unwrapData(payload);
  if (!isFilterValuesData(data)) {
    throw new Error('Invalid /filters/values response');
  }
  return data;
}

export { FILTER_CONFIG_ENDPOINT, FILTER_VALUES_ENDPOINT };
