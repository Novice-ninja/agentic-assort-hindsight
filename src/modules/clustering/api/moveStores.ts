import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `POST /v1/clustering/plans/{clusterPlanCode}/move_stores`. */
export const MOVE_STORES_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

/** Destination cluster for one store. Labels are sent only when the assignments response has them. */
export interface StoreMove {
  storeCode: string;
  productLabel?: string;
  performanceLabel?: string;
  storeLabel?: string;
}

export interface MoveStoresRequest {
  variantId: string;
  moves: StoreMove[];
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${MOVE_STORES_ENDPOINT}/${encodeURIComponent(code)}/move_stores`;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

function assertMove(value: StoreMove): void {
  if (!isNonEmptyString(value.storeCode)) {
    throw new Error('each move requires storeCode');
  }
  for (const label of ['productLabel', 'performanceLabel', 'storeLabel'] as const) {
    if (value[label] !== undefined && !isNonEmptyString(value[label])) {
      throw new Error(`move ${label} must be a non-empty string when provided`);
    }
  }
}

/**
 * Moves one or more stores into another cluster of the same variant.
 * A 2xx response is success; the body is unused.
 */
export async function moveStores(
  clusterPlanCode: string,
  body: MoveStoresRequest,
): Promise<void> {
  if (!isNonEmptyString(body.variantId)) throw new Error('variantId is required');
  if (!Array.isArray(body.moves) || body.moves.length === 0) {
    throw new Error('moves is required');
  }
  body.moves.forEach(assertMove);
  await apiClient.post<unknown>(endpointFor(clusterPlanCode), body);
}
