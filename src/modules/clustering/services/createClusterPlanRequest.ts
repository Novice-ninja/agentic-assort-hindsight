import type {
  HierarchyScopeEntry,
  SeasonInfo,
  SeasonYear,
} from '@modules/planning/types';
import type {
  BaselineSeasonShare,
  ClusteringModeCode,
  CreateClusterPlanBaseline,
  CreateClusterPlanRequest,
} from '../api/createClusterPlan';
import type { SeasonInfosResponse } from '../api/getSeasonInfos';
import type { ClusterDraft, ClusterRunMode } from '../types';

/**
 * `/filters/config?config_key=cluster_config` level keys → create-plan payload fields.
 * Only the two levels the API contract names are sent.
 */
const HIERARCHY_LEVEL_FIELDS: Record<string, 'l0Name' | 'l1Name'> = {
  l0_name: 'l0Name',
  l1_name: 'l1Name',
};

const RUN_MODE_CODES: Record<ClusterRunMode, ClusteringModeCode> = {
  gated: 'GATED',
  autonomous: 'AUTONOMOUS',
};

/**
 * Share of the baseline attributed to last year vs. the year before. The Scope step has no
 * control for this yet, so the split is a module default rather than a user selection.
 */
export const DEFAULT_BASELINE_SPLIT: Readonly<{ ly: number; lly: number }> = {
  ly: 50,
  lly: 50,
};

export class CreateClusterPlanRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreateClusterPlanRequestError';
  }
}

function flattenSeasons(years: readonly SeasonYear[] | null | undefined): SeasonInfo[] {
  if (!Array.isArray(years)) return [];
  return years.flatMap((year) => year.seasons ?? []);
}

/** Resolve the draft's `seasonId` (stringified `seasonCode`) back to the numeric code. */
export function resolveTargetSeasonCode(
  seasonId: string | null,
  seasons: readonly SeasonInfo[],
): number | null {
  if (!seasonId) return null;
  const match = seasons.find((season) => String(season.seasonCode) === seasonId);
  if (match) return match.seasonCode;
  const numeric = Number(seasonId);
  return Number.isInteger(numeric) ? numeric : null;
}

/**
 * LY / LLY are the two most recent trading seasons that start before the target season.
 * Ordered by start date (falls back to `seasonCode` when dates are missing). When history is
 * shorter than two seasons, the nearest available season is reused so the payload stays valid.
 */
export function deriveBaselineSeasons(
  seasons: readonly SeasonInfo[],
  targetSeasonCode: number,
): { ly: number; lly: number } {
  const target = seasons.find((season) => season.seasonCode === targetSeasonCode);
  const startOf = (season: SeasonInfo) => {
    const time = Date.parse(season.seasonStartDate ?? '');
    return Number.isNaN(time) ? null : time;
  };
  const targetStart = target ? startOf(target) : null;

  const prior = seasons
    .filter((season) => {
      if (season.seasonCode === targetSeasonCode) return false;
      const start = startOf(season);
      if (targetStart !== null && start !== null) return start < targetStart;
      return season.seasonCode < targetSeasonCode;
    })
    .sort((a, b) => {
      const aStart = startOf(a);
      const bStart = startOf(b);
      if (aStart !== null && bStart !== null) return bStart - aStart;
      return b.seasonCode - a.seasonCode;
    });

  const ly = prior[0]?.seasonCode ?? targetSeasonCode;
  const lly = prior[1]?.seasonCode ?? ly;
  return { ly, lly };
}

export interface BaselineReferenceContext {
  /** `POST /v1/clustering/season_info` response for the target season (Scope → Reference Period). */
  seasonInfos?: SeasonInfosResponse | null;
  /** Coverage % as edited on the Reference Period cards, keyed like `seasonInfos`. */
  referenceCoverage?: Record<string, number> | null;
  /**
   * Dropdown selection. A period left out of this list is omitted from the payload, even if
   * its card still has a stored coverage. Omit to include every period the response returned.
   */
  selectedPeriodIds?: readonly string[] | null;
  /** Card checkbox. `false` omits that period; a missing key stays included. */
  referencePeriodChecked?: Record<string, boolean> | null;
}

/**
 * `baseLineData` for the create payload. When the Reference Period section has loaded, the
 * body contains only the response keys the user kept: `seasonCode` from `/season_info` and
 * `percentage` from the card (edited value, else the API's `seasonCoverage`). A response
 * with one period does not invent the other. Without that data (section never loaded) fall
 * back to deriving LY / LLY from the seasons list with the default split.
 */
export function toBaseline(
  seasons: readonly SeasonInfo[],
  targetSeasonCode: number,
  reference: BaselineReferenceContext = {},
  split: Readonly<{ ly: number; lly: number }> = DEFAULT_BASELINE_SPLIT,
): CreateClusterPlanBaseline {
  const infos = reference.seasonInfos;
  const keys = infos ? Object.keys(infos) : [];
  if (infos && keys.length > 0) {
    const baseline: CreateClusterPlanBaseline = {};
    for (const key of keys) {
      if (key !== 'ly' && key !== 'lly') continue;
      const removedFromDropdown =
        reference.selectedPeriodIds != null && !reference.selectedPeriodIds.includes(key);
      if (removedFromDropdown || reference.referencePeriodChecked?.[key] === false) continue;
      const info = infos[key];
      const edited = reference.referenceCoverage?.[key];
      baseline[key] = {
        seasonCode: info.seasonCode,
        percentage: Number.isFinite(edited) ? (edited as number) : info.seasonCoverage,
      };
    }
    return baseline;
  }

  const derived = deriveBaselineSeasons(seasons, targetSeasonCode);
  return {
    ly: { seasonCode: derived.ly, percentage: split.ly },
    lly: { seasonCode: derived.lly, percentage: split.lly },
  };
}

/** Numeric codes (`"10"`) go on the wire as numbers; anything else is passed through. */
export function toChannelCode(channelId: string): number | string {
  const trimmed = channelId.trim();
  return /^-?\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
}

function hierarchyValues(
  scope: readonly HierarchyScopeEntry[],
): Pick<CreateClusterPlanRequest, 'l0Name' | 'l1Name'> {
  const out: Pick<CreateClusterPlanRequest, 'l0Name' | 'l1Name'> = {
    l0Name: [],
    l1Name: [],
  };
  for (const entry of scope) {
    const field = HIERARCHY_LEVEL_FIELDS[entry.levelNo];
    if (!field) continue;
    out[field] = [...entry.selectedValues];
  }
  return out;
}

export interface CreateClusterPlanRequestContext extends BaselineReferenceContext {
  /** Shared `/plans/seasons` response (planning slice). Resolves codes and derives LY / LLY. */
  seasons: SeasonYear[] | null | undefined;
}

/**
 * Pure mapping from the Scope draft to the `POST /v1/clustering/plans` body. Throws
 * `CreateClusterPlanRequestError` when a required selection cannot be expressed on the wire;
 * `validateScope` should have caught these earlier, so the message is a safety net.
 */
export function toCreateClusterPlanRequest(
  draft: Pick<
    ClusterDraft,
    'name' | 'seasonId' | 'channelId' | 'hierarchyScope' | 'runMode'
  >,
  context: CreateClusterPlanRequestContext,
): CreateClusterPlanRequest {
  const seasons = flattenSeasons(context.seasons);
  const clusterName = draft.name.trim();
  if (!clusterName) throw new CreateClusterPlanRequestError('MISSING_NAME');

  const targetSeasonCode = resolveTargetSeasonCode(draft.seasonId, seasons);
  if (targetSeasonCode === null)
    throw new CreateClusterPlanRequestError('MISSING_SEASON');

  if (!draft.channelId) throw new CreateClusterPlanRequestError('MISSING_CHANNEL');

  return {
    clusterName,
    targetSeasonCode,
    channelCode: [toChannelCode(draft.channelId)],
    ...hierarchyValues(draft.hierarchyScope ?? []),
    clusteringMode: RUN_MODE_CODES[draft.runMode ?? 'gated'],
    baseLineData: toBaseline(seasons, targetSeasonCode, {
      seasonInfos: context.seasonInfos,
      referenceCoverage: context.referenceCoverage,
      selectedPeriodIds: context.selectedPeriodIds,
      referencePeriodChecked: context.referencePeriodChecked,
    }),
  };
}
