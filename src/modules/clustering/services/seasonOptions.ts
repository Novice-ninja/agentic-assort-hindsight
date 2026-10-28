import { tradingSeasonLabel } from '@modules/planning/services/seasonLabel';
import type { SeasonInfo, SeasonYear } from '@modules/planning/types';
import type { SeasonOption } from '../types';

/**
 * Bridges the shared `/plans/seasons` response into the flat `SeasonOption[]`
 * the clustering Scope step renders.
 *
 * The Season API is owned by the planning slice (`fetchSeasons` →
 * `planning.seasonsData`); clustering reuses that data instead of calling the
 * endpoint a second time. This module is the single place that reshapes the
 * fiscal-year → trading-season tree into the flat card list clustering expects.
 */

/** Map a trading season's type/name onto the two icon+label buckets the cards use. */
export function toSeasonKind(
  season: Pick<SeasonInfo, 'seasonType' | 'name' | 'seasonDisplayName'>,
): SeasonOption['seasonKind'] {
  const type = (season.seasonType ?? '').toLowerCase();
  if (type.includes('spring') || type.includes('summer')) return 'springSummer';
  if (type.includes('autumn') || type.includes('fall') || type.includes('winter')) {
    return 'autumnWinter';
  }
  // Fall back to the season code prefix (e.g. "SS26", "AW25") when the type is blank.
  const label = (season.name || season.seasonDisplayName || '').trim().toUpperCase();
  return label.startsWith('AW') || label.startsWith('FW') ? 'autumnWinter' : 'springSummer';
}

/**
 * Flatten the fiscal-year grouped seasons into de-duplicated `SeasonOption`s.
 * Accepts `null`/`undefined`/empty input and returns `[]` so callers can render
 * an empty Season section gracefully while the API is loading or after a failure.
 */
export function toSeasonOptions(years: SeasonYear[] | null | undefined): SeasonOption[] {
  if (!Array.isArray(years)) return [];
  const options: SeasonOption[] = [];
  const seen = new Set<string>();
  for (const year of years) {
    for (const season of year.seasons ?? []) {
      const id = String(season.seasonCode);
      if (seen.has(id)) continue;
      seen.add(id);
      options.push({
        id,
        code: tradingSeasonLabel(season),
        seasonKind: toSeasonKind(season),
        // Same subtitle the Create Plan season cards render.
        subtitle: `${season.seasonStartDate} — ${season.seasonEndDate}`,
      });
    }
  }
  return options;
}
