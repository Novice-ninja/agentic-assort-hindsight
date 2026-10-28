import { env } from '@config/env';
import { apiClient, HttpError } from '@shared/services';
import type {
  RecommendationOverrideRequest,
  RecommendationOverrideResponse,
  RecommendationOverrideResult,
} from '../types';
import { withDeadline } from './withDeadline';

/** Backend endpoint that records a planner's recommendation override for one or more articles. */
export const ITEM_RECOMMENDATION_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/by-item/recommendation`;

/** A write a planner is waiting on, so the ceiling is short enough to fail while they still care. */
const TIMEOUT_MS = 15_000;

/**
 * Rejection bodies from this service are `{ errorCode, errorDescription, errorMessage }`, which is
 * not the shape the shared client knows how to unwrap — it reports `Request failed with status
 * 400` and keeps the body. The detail is the useful half of a validation failure ("article … 
 * appears in both keep and drop"), so it is read back out here rather than lost.
 */
function detailFrom(error: HttpError): string | undefined {
  const body: unknown = error.body;
  if (typeof body !== 'object' || body === null) return undefined;

  const { errorDescription, errorMessage } = body as {
    errorDescription?: unknown;
    errorMessage?: unknown;
  };

  if (typeof errorDescription === 'string' && errorDescription.length > 0) {
    return errorDescription;
  }
  return typeof errorMessage === 'string' && errorMessage.length > 0 ? errorMessage : undefined;
}

/**
 * Applies recommendation overrides and returns the state the backend settled on.
 *
 * `data.items[]` is the point of the call, not a receipt for it: an article can come back with an
 * `effectiveReco` other than the one asked for, so callers reconcile from the response rather
 * than trusting what they sent. A `200` carrying `status: false` is a failure like any other.
 */
export async function overrideItemRecommendation(
  payload: RecommendationOverrideRequest,
  signal?: AbortSignal,
): Promise<RecommendationOverrideResult> {
  const deadline = withDeadline(signal, TIMEOUT_MS);

  try {
    const response = await apiClient.post<RecommendationOverrideResponse>(
      ITEM_RECOMMENDATION_ENDPOINT,
      payload,
      { signal: deadline.signal },
    );

    if (!response.status || response.data === undefined) {
      throw new Error(response.message || 'Recommendation override failed');
    }

    return {
      ...response.data,
      items: response.data.items ?? [],
      message: response.message,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error(detailFrom(error) ?? error.message);
    }
    throw error;
  } finally {
    deadline.release();
  }
}
