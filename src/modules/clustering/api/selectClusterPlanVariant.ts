import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { ClusterApprovalResponse } from './approveClusterPlan';

/** `GET|POST /v1/clustering/plans/{clusterPlanCode}/selected-variant`. */
export const SELECT_CLUSTER_PLAN_VARIANT_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

export interface SelectClusterPlanVariantRequest {
  /** `variantId` of the "3 Best" card the user selected on Finalize. */
  variantId: string;
}

export interface SelectClusterPlanVariantResponse {
  clusterPlanCode: string;
  variantId: string;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${SELECT_CLUSTER_PLAN_VARIANT_ENDPOINT}/${encodeURIComponent(code)}/selected-variant`;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

function parseSelectedVariantResponse(
  value: unknown,
  fallback: SelectClusterPlanVariantResponse,
): SelectClusterPlanVariantResponse | null {
  if (value == null) return fallback;
  const raw = asRecord(value);
  if (!raw) return null;
  return {
    clusterPlanCode: isNonEmptyString(raw.clusterPlanCode)
      ? raw.clusterPlanCode
      : fallback.clusterPlanCode,
    variantId: isNonEmptyString(raw.variantId) ? raw.variantId : fallback.variantId,
  };
}

/**
 * Gate 2 winner from `GET .../selected-variant`. Accepts a run-variant (optionally nested
 * under `variant`) or the `/approved` shape — both carry name, K and store count.
 */
export function parseSelectedVariantDetails(
  value: unknown,
  fallbackCode: string,
): ClusterApprovalResponse | null {
  const raw = asRecord(unwrapData(value));
  if (!raw) return null;
  const variant = asRecord(raw.variant) ?? raw;
  const variantId = isNonEmptyString(variant.variantId)
    ? variant.variantId
    : isNonEmptyString(raw.variantId)
      ? raw.variantId
      : '';
  const clusterPlanCode = isNonEmptyString(raw.clusterPlanCode)
    ? raw.clusterPlanCode
    : fallbackCode.trim();
  const chosenK = isFiniteNumber(variant.chosenK)
    ? variant.chosenK
    : isFiniteNumber(variant.k)
      ? variant.k
      : isFiniteNumber(raw.chosenK)
        ? raw.chosenK
        : null;
  const stores = isFiniteNumber(variant.stores)
    ? variant.stores
    : isFiniteNumber(raw.stores)
      ? raw.stores
      : null;
  if (!variantId || !clusterPlanCode || chosenK === null || stores === null) return null;
  const name = isNonEmptyString(variant.approvedVariantName)
    ? variant.approvedVariantName
    : isNonEmptyString(variant.name)
      ? variant.name
      : isNonEmptyString(raw.approvedVariantName)
        ? raw.approvedVariantName
        : isNonEmptyString(raw.name)
          ? raw.name
          : '';
  return {
    clusterPlanCode,
    variantId,
    approvedVariantId: isNonEmptyString(variant.approvedVariantId)
      ? variant.approvedVariantId
      : variantId,
    approvedVariantName: name,
    chosenK,
    stores,
  };
}

/** Records the selected Finalize variant and advances the plan to Sign-Off. */
export async function selectClusterPlanVariant(
  clusterPlanCode: string,
  body: SelectClusterPlanVariantRequest,
): Promise<SelectClusterPlanVariantResponse> {
  if (!isNonEmptyString(body.variantId)) throw new Error('variantId is required');
  const fallback = { clusterPlanCode: clusterPlanCode.trim(), variantId: body.variantId };
  const payload = await apiClient.post<unknown>(endpointFor(clusterPlanCode), body);
  const data = parseSelectedVariantResponse(unwrapData(payload), fallback);
  if (!data) throw new Error('Unexpected selected-variant response');
  return data;
}

/** Resume Sign-Off: the selected Finalize variant that Gate 2 should display. */
export async function getSelectedClusterPlanVariant(
  clusterPlanCode: string,
): Promise<ClusterApprovalResponse> {
  const payload = await apiClient.get<unknown>(endpointFor(clusterPlanCode));
  const data = parseSelectedVariantDetails(payload, clusterPlanCode.trim());
  if (!data) throw new Error('Unexpected selected-variant response');
  return data;
}
