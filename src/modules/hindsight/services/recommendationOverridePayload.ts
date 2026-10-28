import { isDev } from '@config/env';
import type {
  RecommendationBucket,
  RecommendationOverrideRequest,
} from '../types';

/** One article and what is being asked of it. */
export interface RecommendationChange {
  article: string;
  bucket: RecommendationBucket;
}

/**
 * Which dropdown value lands in which bucket.
 *
 * Backend-driven: both By Item endpoints send the options a planner may pick, and today both send
 * `keep` and `drop` only. A value absent from this map is one this frontend cannot express, which
 * is a contract change to handle deliberately — never a payload to improvise.
 */
const BUCKET_BY_CHOICE: Readonly<Record<string, RecommendationBucket>> = {
  keep: 'keep',
  drop: 'drop',
};

/** Whether a dropdown value is one the override endpoint has a bucket for. */
export function isSupportedChoice(choice: string): boolean {
  return BUCKET_BY_CHOICE[choice.toLowerCase()] !== undefined;
}

/**
 * Maps a dropdown value onto its bucket, or `undefined` for one this frontend cannot send.
 *
 * The warning is deliberate and developer-facing: a silently dropped selection would look to a
 * planner exactly like a saved one.
 */
export function bucketForChoice(choice: string): RecommendationBucket | undefined {
  const bucket = BUCKET_BY_CHOICE[choice.toLowerCase()];

  if (bucket === undefined && isDev) {
    console.warn(
      `[hindsight] no override bucket for recommendation "${choice}"; ` +
        `supported: ${Object.keys(BUCKET_BY_CHOICE).join(', ')}. Nothing was sent.`,
    );
  }

  return bucket;
}

/**
 * Builds the request body for a set of changes, or `null` when there is nothing valid to send.
 *
 * `keep` and `drop` are always present so the body's shape does not vary with what a planner did;
 * `mandatory` and `clear` appear only when used. The endpoint rejects a body whose buckets are all
 * empty and one that names the same article twice, so both are refused here instead — a `400` a
 * caller could have predicted is a bug, not an error to report.
 */
export function buildOverridePayload(
  planCode: string | undefined,
  changes: readonly RecommendationChange[],
): RecommendationOverrideRequest | null {
  if (planCode === undefined || planCode.length === 0) return null;

  const buckets: Record<RecommendationBucket, string[]> = {
    keep: [],
    drop: [],
    mandatory: [],
    clear: [],
  };
  const seen = new Set<string>();

  for (const { article, bucket } of changes) {
    if (article.length === 0 || seen.has(article)) continue;
    seen.add(article);
    buckets[bucket].push(article);
  }

  if (seen.size === 0) return null;

  return {
    planCode,
    keep: buckets.keep,
    drop: buckets.drop,
    ...(buckets.mandatory.length > 0 ? { mandatory: buckets.mandatory } : {}),
    ...(buckets.clear.length > 0 ? { clear: buckets.clear } : {}),
  };
}
