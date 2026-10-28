import type { SeasonInfosResponse } from '../api/getSeasonInfos';

/** Required sum of the checked Reference Period coverage percentages. */
export const REFERENCE_COVERAGE_TOTAL = 100;

/**
 * Sum of the coverage % of every Reference Period that is still in the dropdown and still
 * checked. A period removed from the dropdown keeps its stored coverage, but that weight
 * is left out of the total. Uses the user's latest edit when there is one and the
 * `season_info` value otherwise. `null` when the section has no periods at all.
 * Omit `selectedKeys` to count every checked period (callers that have no dropdown).
 */
export function referenceCoverageTotal(
  seasonInfos: SeasonInfosResponse | null,
  checked: Record<string, boolean>,
  coverage: Record<string, number>,
  selectedKeys?: readonly string[],
): number | null {
  if (!seasonInfos) return null;
  const keys = Object.keys(seasonInfos);
  if (keys.length === 0) return null;
  const selected = selectedKeys ? new Set(selectedKeys) : null;
  let total = 0;
  for (const key of keys) {
    if (selected && !selected.has(key)) continue;
    if (!checked[key]) continue;
    const edited = coverage[key];
    const value = Number.isFinite(edited) ? edited : seasonInfos[key].seasonCoverage;
    total += Number.isFinite(value) ? value : 0;
  }
  // Avoid 0.1 + 0.2 style drift from decimal inputs.
  return Math.round(total * 100) / 100;
}

/** True when there is nothing to validate or the checked periods sum to exactly 100%. */
export function isReferenceCoverageValid(total: number | null): boolean {
  return total === null || total === REFERENCE_COVERAGE_TOTAL;
}

function clampCoveragePercent(value: number): number {
  return Math.min(REFERENCE_COVERAGE_TOTAL, Math.max(0, Math.round(value)));
}

/**
 * Periods that count toward the 100% total: still in the dropdown and not explicitly
 * unchecked. A missing checkbox entry counts as included, matching the card default.
 */
export function includedReferenceKeys(
  seasonInfos: SeasonInfosResponse | null,
  checked: Record<string, boolean>,
  selectedKeys: readonly string[],
): string[] {
  if (!seasonInfos) return [];
  const selected = new Set(selectedKeys);
  return Object.keys(seasonInfos).filter((key) => selected.has(key) && checked[key] !== false);
}

/**
 * Coverage map after season info loads, after the user edits one input, or after the
 * included set changes.
 *
 * - One included period is always 100.
 * - An edit of one of two writes that value and sets the other to the complement.
 * - Two or more included again, with no edit, restore each period's API `seasonCoverage`.
 */
export function applyReferenceCoverage(input: {
  seasonInfos: SeasonInfosResponse | null;
  checked: Record<string, boolean>;
  selectedKeys: readonly string[];
  coverage: Record<string, number>;
  edited?: { key: string; value: number };
}): Record<string, number> {
  const { seasonInfos, checked, selectedKeys, coverage, edited } = input;
  if (!seasonInfos) {
    if (!edited) return coverage;
    return { ...coverage, [edited.key]: clampCoveragePercent(edited.value) };
  }

  const next = { ...coverage };
  const included = includedReferenceKeys(seasonInfos, checked, selectedKeys);

  if (included.length === 1) {
    if (edited && edited.key !== included[0]) {
      next[edited.key] = clampCoveragePercent(edited.value);
    }
    next[included[0]] = REFERENCE_COVERAGE_TOTAL;
    return next;
  }

  if (edited) {
    const value = clampCoveragePercent(edited.value);
    next[edited.key] = value;
    const others = included.filter((key) => key !== edited.key);
    if (others.length === 1) {
      next[others[0]] = REFERENCE_COVERAGE_TOTAL - value;
    } else if (others.length > 1) {
      const sink = others[others.length - 1];
      const usedByFixed = others.slice(0, -1).reduce((sum, key) => {
        const stored = next[key];
        const valueForKey = Number.isFinite(stored) ? stored : seasonInfos[key].seasonCoverage;
        return sum + valueForKey;
      }, value);
      next[sink] = clampCoveragePercent(REFERENCE_COVERAGE_TOTAL - usedByFixed);
    }
    return next;
  }

  if (included.length >= 2) {
    for (const key of included) next[key] = seasonInfos[key].seasonCoverage;
  }
  return next;
}

/** Weights stored when season info arrives: API split for two or more, 100 for one. */
export function initialReferenceCoverage(
  seasonInfos: SeasonInfosResponse,
): Record<string, number> {
  const keys = Object.keys(seasonInfos);
  return applyReferenceCoverage({
    seasonInfos,
    checked: Object.fromEntries(keys.map((key) => [key, true])),
    selectedKeys: keys,
    coverage: {},
  });
}
