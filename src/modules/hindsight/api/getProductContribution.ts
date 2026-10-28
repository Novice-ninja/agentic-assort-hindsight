import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type {
  ProductContributionData,
  ProductContributionRequest,
  ProductContributionResponse,
} from '../types';

/** Real backend endpoint for the Overview contribution charts. */
export const PRODUCT_CONTRIBUTION_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/product-performance/contribution`;

/**
 * Fetches the contribution breakdown for a plan's season.
 *
 * The backend takes `seasonCode` — a numeric code from the plan's `kpi-seasons` list — and
 * answers `400 seasonCode is required` for anything else, so no season name is accepted here.
 */
export async function getProductContribution({
  planCode,
  seasonCode,
}: ProductContributionRequest): Promise<ProductContributionData> {
  const response = await apiClient.get<ProductContributionResponse>(
    PRODUCT_CONTRIBUTION_ENDPOINT,
    { seasonCode, planCode },
  );

  if (!response.status) {
    throw new Error(response.message || 'Product contribution request failed');
  }

  return {
    planId: response.data?.planId ?? planCode,
    topN: response.data?.topN ?? 0,
    cards: response.data?.cards ?? [],
  };
}
