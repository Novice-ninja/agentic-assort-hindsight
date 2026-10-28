import { decodeIaString } from '@shared/utils/format';
import type { SeasonInfo } from '../types';

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return '';
}

/**
 * Display label for a trading season. `name` is what the calendar cards must show;
 * `seasonDisplayName` is only a last-resort fallback when `name` is missing.
 * Decode happens here — callers keep the raw fields for state and payloads.
 */
export function tradingSeasonLabel(
  season: Pick<SeasonInfo, 'name' | 'seasonDisplayName'>,
): string {
  const decoded = decodeIaString(firstNonEmpty(season.name, season.seasonDisplayName));
  return decoded.trim() !== '' ? decoded : '—';
}
