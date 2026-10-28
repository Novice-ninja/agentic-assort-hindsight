import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `POST /v1/clustering/plans/{clusterPlanCode}/approved`. */
export const APPROVE_CLUSTER_PLAN_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

export interface ApproveClusterPlanRequest {
  /** `variantId` of the "3 Best" card the user selected on Finalize. */
  variantId: string;
}

/** The finally approved variant, as returned by the backend. */
export interface ClusterApprovalResponse {
  clusterPlanCode: string;
  variantId: string;
  approvedVariantId: string;
  approvedVariantName: string;
  chosenK: number;
  stores: number;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${APPROVE_CLUSTER_PLAN_ENDPOINT}/${encodeURIComponent(code)}/approved`;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

function parseApprovalResponse(value: unknown): ClusterApprovalResponse | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (
    !isNonEmptyString(raw.clusterPlanCode) ||
    !isNonEmptyString(raw.variantId) ||
    !isNonEmptyString(raw.approvedVariantId) ||
    !isFiniteNumber(raw.chosenK) ||
    !isFiniteNumber(raw.stores)
  ) {
    return null;
  }
  return {
    clusterPlanCode: raw.clusterPlanCode,
    variantId: raw.variantId,
    approvedVariantId: raw.approvedVariantId,
    approvedVariantName:
      typeof raw.approvedVariantName === 'string' ? raw.approvedVariantName : '',
    chosenK: raw.chosenK,
    stores: raw.stores,
  };
}

/** Approves the selected variant for the plan and returns the approved variant details. */
export async function approveClusterPlan(
  clusterPlanCode: string,
  body: ApproveClusterPlanRequest,
): Promise<ClusterApprovalResponse> {
  if (!isNonEmptyString(body.variantId)) throw new Error('variantId is required');
  const payload = await apiClient.post<unknown>(endpointFor(clusterPlanCode), body);
  const data = parseApprovalResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected cluster plan approval response');
  return data;
}
