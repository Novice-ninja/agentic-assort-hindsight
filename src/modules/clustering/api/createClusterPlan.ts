import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { ClusterPlanAttributeDto } from './getPlans';

/** Real backend endpoint that creates a cluster plan (same resource as the list). */
export const CREATE_CLUSTER_PLAN_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

export type ClusteringModeCode = 'GATED' | 'AUTONOMOUS';

export interface BaselineSeasonShare {
  seasonCode: number;
  percentage: number;
}

/**
 * Only the reference periods the Scope step is actually using. A season-info response with
 * one period, or a period the user left out, does not invent the other key.
 */
export interface CreateClusterPlanBaseline {
  ly?: BaselineSeasonShare;
  lly?: BaselineSeasonShare;
}

/** Body for `POST /v1/clustering/plans`. Built from the Scope draft by `toCreateClusterPlanRequest`. */
export interface CreateClusterPlanRequest {
  clusterName: string;
  targetSeasonCode: number;
  /** Backend channel codes. Numeric strings from the filters API are sent as numbers. */
  channelCode: Array<number | string>;
  l0Name: string[];
  l1Name: string[];
  clusteringMode: ClusteringModeCode;
  baseLineData: CreateClusterPlanBaseline;
}

/** The created plan as the backend echoes it. `attributes` are kept verbatim (source of truth). */
export interface CreateClusterPlanResponse {
  clusterPlanCode: string;
  clusterPlanName: string;
  description?: string;
  status?: string;
  attributes?: ClusterPlanAttributeDto[] | null;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function isCreateClusterPlanResponse(value: unknown): value is CreateClusterPlanResponse {
  if (typeof value !== 'object' || value === null) return false;
  const code = (value as { clusterPlanCode?: unknown }).clusterPlanCode;
  return typeof code === 'string' && code.trim().length > 0;
}

/**
 * Creates a cluster plan on the Go backend. Accepts both a bare plan object and the
 * `{ status, data, message }` envelope other Go endpoints use; anything without a usable
 * `clusterPlanCode` is treated as a failure so the wizard never advances on a malformed body.
 */
export async function createClusterPlan(
  body: CreateClusterPlanRequest,
): Promise<CreateClusterPlanResponse> {
  const payload = await apiClient.post<unknown>(CREATE_CLUSTER_PLAN_ENDPOINT, body);
  const data = unwrapData(payload);
  if (!isCreateClusterPlanResponse(data)) {
    throw new Error('Unexpected create cluster plan response');
  }
  return data;
}
