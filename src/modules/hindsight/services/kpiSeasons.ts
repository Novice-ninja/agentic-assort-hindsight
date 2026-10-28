import type { KpiSeason } from '../types';

/**
 * Season codes increase with time, so the highest code is the most recent season. The backend
 * sends them oldest-first; nothing promises that, which is why recency is derived from the code
 * rather than from the array order.
 */
export function latestSeasonCode(seasons: readonly KpiSeason[]): number | null {
  if (seasons.length === 0) return null;
  return seasons.reduce((latest, season) => Math.max(latest, season.seasonCode), -Infinity);
}

/** Seasons ordered most recent first, which is the order the season dropdown offers them in. */
export function sortSeasonsByRecency(seasons: readonly KpiSeason[]): KpiSeason[] {
  return [...seasons].sort((a, b) => b.seasonCode - a.seasonCode);
}

export function findSeason(
  seasons: readonly KpiSeason[],
  seasonCode: number | null,
): KpiSeason | undefined {
  if (seasonCode === null) return undefined;
  return seasons.find((season) => season.seasonCode === seasonCode);
}
