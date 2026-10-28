import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `PUT /v1/clustering/plans/attributes/final/{clusterPlanCode}`. */
export const FINAL_ATTRIBUTES_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans/attributes/final`;

export interface FinalAttributesRequest {
  performanceAttributes: string[];
  productAttributes: string[];
  storeAttributes: string[];
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${FINAL_ATTRIBUTES_ENDPOINT}/${encodeURIComponent(code)}`;
}

/**
 * Persists the user's final attribute picks for the plan. Any 2xx is success; the body is
 * not read (the backend may return an envelope or nothing).
 */
export async function putFinalAttributes(
  clusterPlanCode: string,
  body: FinalAttributesRequest,
): Promise<void> {
  await apiClient.put<unknown>(endpointFor(clusterPlanCode), body);
}
