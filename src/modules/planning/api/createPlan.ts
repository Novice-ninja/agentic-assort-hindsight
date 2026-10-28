import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { CreatePlanScopeEntry } from '../types';

const CREATE_PLAN_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/create`;

export interface CreatePlanInput {
  planName: string;
  fiscalYear: string;
  planSeasonCode: number;
  pipelineMode: string;
  thresholdPct: number;
  createdBy: string;
  hierarchyScope: CreatePlanScopeEntry[];
  clusterPlanCode: string;
}

export interface CreatePlanApiResponse {
  status: boolean;
  data: Record<string, unknown>;
  message: string;
}

/**
 * The Go backend returns `{ status, data, message }` for both success and
 * failure (e.g. 409 duplicate name). `apiClient` throws on non-2xx before we
 * can read the body, so we use `fetch` directly to always parse the JSON.
 */
export async function createPlan(input: CreatePlanInput): Promise<CreatePlanApiResponse> {
  return apiClient.post<CreatePlanApiResponse>(CREATE_PLAN_ENDPOINT, input);
}
