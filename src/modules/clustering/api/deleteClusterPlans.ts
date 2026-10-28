import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `POST /v1/clustering/plans/delete`. */
export const DELETE_CLUSTER_PLANS_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans/delete`;

export interface DeleteClusterPlanResult {
  clusterPlanCode: string;
  deleted: boolean;
}

export interface DeleteClusterPlansResponse {
  results: DeleteClusterPlanResult[];
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function parseResults(payload: unknown): DeleteClusterPlanResult[] {
  const data = unwrapData(payload);
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Unexpected delete cluster plans response');
  }
  const results = (data as { results?: unknown }).results;
  if (!Array.isArray(results)) {
    throw new Error('Unexpected delete cluster plans response');
  }
  return results.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const code = (item as { clusterPlanCode?: unknown }).clusterPlanCode;
    const deleted = (item as { deleted?: unknown }).deleted;
    if (typeof code !== 'string' || code.trim().length === 0 || typeof deleted !== 'boolean') {
      return [];
    }
    return [{ clusterPlanCode: code, deleted }];
  });
}

/** Deletes the selected cluster plans. Each result says whether that code was deleted. */
export async function deleteClusterPlans(
  clusterPlanCodes: string[],
): Promise<DeleteClusterPlansResponse> {
  const codes = clusterPlanCodes.map((code) => code.trim()).filter((code) => code.length > 0);
  if (codes.length === 0) throw new Error('clusterPlanCodes is required');
  const payload = await apiClient.post<unknown>(DELETE_CLUSTER_PLANS_ENDPOINT, {
    clusterPlanCodes: codes,
  });
  return { results: parseResults(payload) };
}
