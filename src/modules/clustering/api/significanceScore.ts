import { env } from '@config/env';
import { apiClient } from '@shared/services';

/**
 * Real backend endpoint for a plan's significance score:
 * `POST|GET /v1/clustering/plans/attributes/significance-score/{clusterPlanCode}`.
 */
export const SIGNIFICANCE_SCORE_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans/attributes/significance-score`;

export interface SignificanceScoreMeta {
  strategy?: string;
  scoreThreshold?: number;
  topKAttributes?: number;
  targetTotalAttributes?: number;
}

/**
 * One attribute row. Performance/product use camelCase; store may use snake_case and omit score.
 */
export interface SignificanceScoreRow {
  clusterPlanCode?: string;
  cluster_plan_code?: string;
  attributeName?: string;
  attribute_name?: string;
  score?: number;
  rank?: number;
  isFinal?: boolean;
  isRecommended?: boolean;
  strategyUsed?: string;
  exclusionReason?: string;
  levels?: Record<string, unknown>;
}

export interface SignificanceScoreBucket {
  recommended: SignificanceScoreRow[];
  excluded: SignificanceScoreRow[];
}

/**
 * Body of POST and GET significance-score. Same shape: recommended/excluded buckets.
 */
export interface AttributeSignificanceScore {
  meta?: SignificanceScoreMeta;
  performanceAttributes: SignificanceScoreBucket;
  productAttributes: SignificanceScoreBucket;
  storeAttributes: SignificanceScoreBucket;
}

/** @deprecated Same as AttributeSignificanceScore — GET now shares the POST contract. */
export type SignificanceScoreResponse = AttributeSignificanceScore;

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${SIGNIFICANCE_SCORE_ENDPOINT}/${encodeURIComponent(code)}`;
}

function isBucket(value: unknown): value is SignificanceScoreBucket {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const rec = value as { recommended?: unknown; excluded?: unknown };
  if (rec.recommended !== undefined && !Array.isArray(rec.recommended)) return false;
  if (rec.excluded !== undefined && !Array.isArray(rec.excluded)) return false;
  return true;
}

function emptyBucket(bucket: SignificanceScoreBucket): SignificanceScoreBucket {
  return {
    recommended: bucket.recommended ?? [],
    excluded: bucket.excluded ?? [],
  };
}

function isAttributeSignificanceScore(value: unknown): value is AttributeSignificanceScore {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const rec = value as Record<string, unknown>;
  return (
    isBucket(rec.performanceAttributes) &&
    isBucket(rec.productAttributes) &&
    isBucket(rec.storeAttributes)
  );
}

function parseAttributeSignificanceScore(payload: unknown): AttributeSignificanceScore {
  const data = unwrapData(payload);
  if (!isAttributeSignificanceScore(data)) {
    throw new Error('Unexpected significance score response');
  }
  return {
    ...data,
    performanceAttributes: emptyBucket(data.performanceAttributes),
    productAttributes: emptyBucket(data.productAttributes),
    storeAttributes: emptyBucket(data.storeAttributes),
  };
}

/**
 * Loads Auto-Selected Attributes for the plan. No request body — `{}` would still be
 * serialized by `apiClient.post`.
 */
export async function postSignificanceScore(
  clusterPlanCode: string,
): Promise<AttributeSignificanceScore> {
  const payload = await apiClient.post<unknown>(endpointFor(clusterPlanCode));
  return parseAttributeSignificanceScore(payload);
}

/** Triggers significance-score / variant generation for the plan. Resolves on any 2xx. */
export async function generateSignificanceScore(clusterPlanCode: string): Promise<void> {
  await apiClient.post<unknown>(endpointFor(clusterPlanCode), {});
}

/** Same body as POST. Used when opening Custom Variant — one GET, no other hops. */
export async function getSignificanceScore(
  clusterPlanCode: string,
): Promise<AttributeSignificanceScore> {
  const payload = await apiClient.get<unknown>(endpointFor(clusterPlanCode));
  return parseAttributeSignificanceScore(payload);
}
