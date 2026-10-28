import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';
import type { SeasonYear } from '../types';

interface SeasonsApiResponse {
  status: boolean;
  data: {
    years: SeasonYear[];
  };
  message: string;
}

export const SEASONS_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/seasons`;

export async function getSeasons(): Promise<SeasonYear[]> {
  const response = await apiClient.get<SeasonsApiResponse>(SEASONS_ENDPOINT);
  const years = response.data?.years ?? [];
  return years.map((year) => ({
    ...year,
    seasons: year.seasons.map((season) => ({
      ...season,
      // `name` stays encoded in state; decode at the display boundary (`tradingSeasonLabel`).
      seasonDisplayName: decodeIaString(season.seasonDisplayName),
      seasonType: decodeIaString(season.seasonType),
    })),
  }));
}
