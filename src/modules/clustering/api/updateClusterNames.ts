import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { ClusterNameRename } from './getClusterPlans';

/** `PUT /v1/clustering/plans/{clusterPlanCode}/update_cluster_name`. */
export const UPDATE_CLUSTER_NAMES_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

export interface UpdateClusterNamesRequest {
  variantId: string;
  renames: ClusterNameRename[];
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${UPDATE_CLUSTER_NAMES_ENDPOINT}/${encodeURIComponent(code)}/update_cluster_name`;
}

/** Persists edited cluster names for the selected "3 Best" variant. */
export async function updateClusterNames(
  clusterPlanCode: string,
  body: UpdateClusterNamesRequest,
): Promise<void> {
  if (!isNonEmptyString(body.variantId)) throw new Error('variantId is required');
  if (body.renames.length === 0) throw new Error('renames are required');
  for (const rename of body.renames) {
    if (!isNonEmptyString(rename.customName)) {
      throw new Error('each rename requires customName');
    }
    for (const label of ['productLabel', 'performanceLabel', 'storeLabel'] as const) {
      if (rename[label] !== undefined && !isNonEmptyString(rename[label])) {
        throw new Error(`rename ${label} must be a non-empty string when provided`);
      }
    }
  }
  await apiClient.put<unknown>(endpointFor(clusterPlanCode), {
    variantId: body.variantId,
    renames: body.renames,
  });
}
