import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `PUT /v1/clustering/plans/attributes/variants/confirm/{clusterPlanCode}`. */
export const CONFIRM_VARIANTS_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans/attributes/variants/confirm`;

export interface ConfirmVariantsRequest {
  variantIds: string[];
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${CONFIRM_VARIANTS_ENDPOINT}/${encodeURIComponent(code)}`;
}

/**
 * Persists the variant cards the user kept (generated or custom). Any 2xx is success;
 * the body is not read.
 */
export async function confirmVariants(
  clusterPlanCode: string,
  body: ConfirmVariantsRequest,
): Promise<void> {
  await apiClient.put<unknown>(endpointFor(clusterPlanCode), body);
}
