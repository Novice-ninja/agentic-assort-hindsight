import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';
import type { KpiSeasonsData, KpiSeasonsResponse } from '../types';

/** Real backend endpoint listing the seasons a plan has hindsight data for. */
export const KPI_SEASONS_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/product-performance/kpi-seasons`;

/**
 * Fetches the seasons available for a plan.
 *
 * `planCode` is the plan's own code — the UUID the plans list returns, which the UI carries as
 * `Plan.id`. The backend answers `500` for anything else, so callers must not pass a season or
 * a display name here.
 *
 * An empty `seasons` list is a valid answer, not an error: several plans genuinely have no
 * hindsight seasons yet, and the caller shows an empty selector rather than failing.
 */
export async function getKpiSeasons(planCode: string): Promise<KpiSeasonsData> {
  const response = await apiClient.get<KpiSeasonsResponse>(KPI_SEASONS_ENDPOINT, { planCode });

  if (!response.status) {
    throw new Error(response.message || 'KPI seasons request failed');
  }

  const seasons = (response.data?.seasons ?? []).map((season) => ({
    ...season,
    name: decodeIaString(season.name),
  }));

  return {
    planCode: response.data?.planCode ?? planCode,
    seasons,
  };
}
