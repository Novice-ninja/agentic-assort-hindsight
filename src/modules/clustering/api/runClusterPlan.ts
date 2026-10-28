import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `POST /v1/clustering/plans/{clusterPlanCode}/runs`. */
export const RUN_CLUSTER_PLAN_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

/** One variant to cluster on. Field names are the backend contract (snake_case). */
export interface ClusterRunVariantRequest {
  /** Backend `variantId` from `/attributes/variants/generate` (the Review & Run card id). */
  variantId: string;
  name: string;
  product_attributes: string[];
  performance_attributes: string[];
  store_attributes: string[];
}

export interface ClusterRunRequest {
  variants: ClusterRunVariantRequest[];
}

export interface ClusterRunCluster {
  label: string;
  stores: number;
}

export interface ClusterRunScores {
  silhouette: number | null;
  stability: number | null;
  daviesBouldin: number | null;
  calinskiHarabasz: number | null;
}

export interface ClusterRunVariant {
  name: string;
  variantId: string;
  chosenK: number;
  stores: number;
  clusters: ClusterRunCluster[];
  scores: ClusterRunScores;
  /** True for the variant that should be selected when the user has not picked one yet. */
  isSelected?: boolean;
  /** True for the variant that shows the Recommended badge. Independent of selection. */
  isRecommended?: boolean;
}

export interface ClusterRunResponse {
  clusterPlanCode: string;
  variants: ClusterRunVariant[];
  /**
   * The `variants` list exactly as the API sent it (no normalisation), for callers that must
   * forward it verbatim — the "3 Best" summarize payload. Absent on hand-built fixtures.
   */
  rawVariants?: unknown[];
  /** Raw plan status/substatus when the response carries them. */
  status?: string | null;
  substatus?: string | null;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function requireCode(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return code;
}

function endpointFor(clusterPlanCode: string): string {
  return `${RUN_CLUSTER_PLAN_ENDPOINT}/${encodeURIComponent(requireCode(clusterPlanCode))}/runs`;
}

function clusterVariantsEndpoint(clusterPlanCode: string): string {
  return `${RUN_CLUSTER_PLAN_ENDPOINT}/${encodeURIComponent(requireCode(clusterPlanCode))}/cluster-variants`;
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const numberOrNull = (value: unknown): number | null => (isFiniteNumber(value) ? value : null);

function isCluster(value: unknown): value is ClusterRunCluster {
  if (typeof value !== 'object' || value === null) return false;
  const { label, stores } = value as { label?: unknown; stores?: unknown };
  return typeof label === 'string' && isFiniteNumber(stores);
}

function parseVariant(value: unknown): ClusterRunVariant | null {
  if (typeof value !== 'object' || value === null) return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.name !== 'string' || raw.name.trim().length === 0) return null;
  if (!isFiniteNumber(raw.chosenK) || !isFiniteNumber(raw.stores)) return null;
  if (!Array.isArray(raw.clusters) || !raw.clusters.every(isCluster)) return null;
  const scores =
    typeof raw.scores === 'object' && raw.scores !== null
      ? (raw.scores as Record<string, unknown>)
      : {};
  return {
    name: raw.name,
    variantId: typeof raw.variantId === 'string' ? raw.variantId : '',
    chosenK: raw.chosenK,
    stores: raw.stores,
    clusters: raw.clusters,
    scores: {
      silhouette: numberOrNull(scores.silhouette),
      stability: numberOrNull(scores.stability),
      daviesBouldin: numberOrNull(scores.daviesBouldin),
      calinskiHarabasz: numberOrNull(scores.calinskiHarabasz),
    },
    isSelected: raw.isSelected === true,
    isRecommended: raw.isRecommended === true,
  };
}

/**
 * Validates the run payload. Rejects anything the Finalize cards cannot render honestly:
 * missing plan code, no variants, or a variant without `chosenK` / `stores` / `clusters`.
 */
export function parseClusterRunResponse(value: unknown): ClusterRunResponse | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const raw = value as {
    clusterPlanCode?: unknown;
    variants?: unknown;
    status?: unknown;
    substatus?: unknown;
  };
  if (typeof raw.clusterPlanCode !== 'string' || raw.clusterPlanCode.trim().length === 0) {
    return null;
  }
  if (!Array.isArray(raw.variants) || raw.variants.length === 0) return null;
  const variants: ClusterRunVariant[] = [];
  for (const item of raw.variants) {
    const variant = parseVariant(item);
    if (!variant) return null;
    variants.push(variant);
  }
  const optionalString = (input: unknown) =>
    typeof input === 'string' && input.trim().length > 0 ? input.trim() : null;
  return {
    clusterPlanCode: raw.clusterPlanCode,
    variants,
    rawVariants: raw.variants,
    status: optionalString(raw.status),
    substatus: optionalString(raw.substatus),
  };
}

/** Runs clustering for the selected variants and returns one result per variant, in API order. */
export async function runClusterPlan(
  clusterPlanCode: string,
  body: ClusterRunRequest,
): Promise<ClusterRunResponse> {
  const payload = await apiClient.post<unknown>(endpointFor(clusterPlanCode), body);
  const data = parseClusterRunResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected cluster run response');
  return data;
}

/** Resume Finalize: same body as POST runs, already-computed cluster variants. */
export async function getClusterVariants(clusterPlanCode: string): Promise<ClusterRunResponse> {
  const payload = await apiClient.get<unknown>(clusterVariantsEndpoint(clusterPlanCode));
  const data = parseClusterRunResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected cluster variants response');
  return data;
}
