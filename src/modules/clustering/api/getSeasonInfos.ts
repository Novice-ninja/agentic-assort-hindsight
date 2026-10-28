import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `POST /v1/clustering/season_info` — LY / LLY reference periods for the selected season. */
export const SEASON_INFOS_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/season_info`;

export interface SeasonInfosRequest {
  /** `seasonCode` of the season selected on the Scope step. */
  seasonCode: number;
  /** Raw `name` of that season, exactly as `/plans/seasons` returned it. */
  name: string;
}

/** One reference period as returned by the backend (fields kept verbatim). */
export interface ReferenceSeasonInfo {
  seasonCode: number;
  seasonName: string;
  seasonStartDate: string;
  seasonEndDate: string;
  seasonCoverage: number;
}

/**
 * The response keyed exactly as the backend returns it (`ly`, `lly`, …). Keys drive the
 * Reference Period dropdown, so the shape is preserved rather than normalised to a list.
 */
export type SeasonInfosResponse = Record<string, ReferenceSeasonInfo>;

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/**
 * Coverage arrives as a whole percentage (`50`), but tolerate the usual serialisation
 * variants — numeric strings (`"50"`, `"50.0"`, `"50%"`) and ratios (`0.5`) — so the
 * Coverage input is always pre-filled with the season's value rather than `0`.
 */
export function parseSeasonCoverage(raw: unknown): number {
  let value: number;
  if (isFiniteNumber(raw)) {
    value = raw;
  } else if (typeof raw === 'string') {
    value = Number(raw.trim().replace(/%$/, ''));
    if (raw.trim() === '' || !Number.isFinite(value)) return 0;
  } else {
    return 0;
  }
  if (value > 0 && value < 1) value *= 100;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function parseReferenceSeasonInfo(value: unknown): ReferenceSeasonInfo | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const seasonCode =
    typeof raw.seasonCode === 'string' ? Number(raw.seasonCode) : raw.seasonCode;
  if (
    !isFiniteNumber(seasonCode) ||
    !isNonEmptyString(raw.seasonStartDate) ||
    !isNonEmptyString(raw.seasonEndDate)
  ) {
    return null;
  }
  return {
    seasonCode,
    seasonName: typeof raw.seasonName === 'string' ? raw.seasonName : '',
    seasonStartDate: raw.seasonStartDate,
    seasonEndDate: raw.seasonEndDate,
    seasonCoverage: parseSeasonCoverage(raw.seasonCoverage ?? raw.season_coverage ?? raw.coverage),
  };
}

/** Keeps every well-formed entry under its original key; malformed entries are dropped. */
function parseSeasonInfosResponse(value: unknown): SeasonInfosResponse | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const result: SeasonInfosResponse = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const parsed = parseReferenceSeasonInfo(entry);
    if (parsed) result[key] = parsed;
  }
  return result;
}

/** Fetches the reference periods available for the selected season. */
export async function postSeasonInfos(body: SeasonInfosRequest): Promise<SeasonInfosResponse> {
  if (!isFiniteNumber(body.seasonCode)) throw new Error('seasonCode is required');
  if (!isNonEmptyString(body.name)) throw new Error('name is required');
  const payload = await apiClient.post<unknown>(SEASON_INFOS_ENDPOINT, {
    seasonCode: body.seasonCode,
    name: body.name,
  });
  const data = parseSeasonInfosResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected season infos response');
  return data;
}
