import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { ClusterPlanListItemDto } from './getPlans';

/** Real backend endpoint for one plan's attributes: `GET /v1/clustering/plans/attributes/{code}`. */
export const CLUSTER_PLAN_ATTRIBUTES_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans/attributes`;

/**
 * `GET /v1/clustering/plans/attributes/{clusterPlanCode}` answers with the same
 * `{ attributes, clusterPlan }` shape as one row of the list endpoint, so the list DTO is reused
 * rather than duplicated. `attributes` is kept verbatim — names and value shapes are
 * backend-defined (`channel_code`, `l0_name`, `target_season_code`, …) and may grow.
 */
export type ClusterPlanAttributesResponse = ClusterPlanListItemDto;

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function isClusterPlanAttributesResponse(value: unknown): value is ClusterPlanAttributesResponse {
  if (typeof value !== 'object' || value === null) return false;
  const { attributes, clusterPlan } = value as Partial<ClusterPlanAttributesResponse>;
  if (!Array.isArray(attributes)) return false;
  return (
    typeof clusterPlan === 'object' &&
    clusterPlan !== null &&
    typeof clusterPlan.clusterPlanCode === 'string' &&
    clusterPlan.clusterPlanCode.trim().length > 0
  );
}

export async function getClusterPlanAttributes(
  clusterPlanCode: string,
): Promise<ClusterPlanAttributesResponse> {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  const payload = await apiClient.get<unknown>(
    `${CLUSTER_PLAN_ATTRIBUTES_ENDPOINT}/${encodeURIComponent(code)}`,
  );
  const data = unwrapData(payload);
  if (!isClusterPlanAttributesResponse(data)) {
    throw new Error('Unexpected cluster plan attributes response');
  }
  return data;
}
