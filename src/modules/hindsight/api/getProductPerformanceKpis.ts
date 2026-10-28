import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type {
  ProductPerformanceKpisData,
  ProductPerformanceKpisRequest,
  ProductPerformanceKpisResponse,
} from '../types';

/** Real backend endpoint for the Overview product-performance KPIs. */
export const PRODUCT_PERFORMANCE_KPIS_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/product-performance/kpis`;

/**
 * Fetches the headline KPIs for a plan's season.
 *
 * The backend wraps the payload in a `{ status, data, message }` envelope; a `status: false`
 * is surfaced as a thrown error so callers treat a "successful" HTTP response that reports a
 * business failure the same as a network failure — one error path, one error UI.
 */
export async function getProductPerformanceKpis(
  payload: ProductPerformanceKpisRequest,
): Promise<ProductPerformanceKpisData> {
  const response = await apiClient.post<ProductPerformanceKpisResponse>(
    PRODUCT_PERFORMANCE_KPIS_ENDPOINT,
    payload,
  );

  if (!response.status) {
    throw new Error(response.message || 'Product performance KPIs request failed');
  }

  return response.data;
}
