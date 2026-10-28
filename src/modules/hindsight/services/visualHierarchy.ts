import type { FilterStripGroup } from '../types/filterStrip';

/** Matches the hardcoded `levelHierarchy` the charts API used before this control existed. */
export const FALLBACK_LEVEL_HIERARCHY = 'l2_name';

export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * Filters that ride on a charts request when the hierarchy dropdown is on.
 * `hierarchyScope` is flattened onto `filters` as `l0_name`, `l1_name`, … by the API layer
 * and contains parent levels only (lowest − 1 and above).
 *
 * `levelHierarchy` / `levelHierarchyValue` always reflect the lowest strip level that has
 * values (and the planner's dropdown selection for that level).
 */
export interface VisualHierarchyChartFilters {
  levelHierarchy: string;
  /** Selected hierarchy ids at that level. Multi-select sends every chosen id. */
  levelHierarchyValue?: string[];
  hierarchyScope: Record<string, string[]>;
}

/**
 * The deepest product level the plan actually selected — last strip group with values.
 * Plan created at l0 + l1 + l2 → l2.
 */
export function lowestSelectedGroup(
  groups: readonly FilterStripGroup[],
): FilterStripGroup | null {
  const withValues = groups.filter((group) => group.values.length > 0);
  return withValues[withValues.length - 1] ?? null;
}

/**
 * Parent strip levels as `{ l0_name: ids, … }` — everything above `levelHierarchy`.
 * The leaf itself is sent separately as `levelHierarchy` / `levelHierarchyValue`.
 */
export function toHierarchyScopeFilters(
  groups: readonly FilterStripGroup[],
  levelHierarchy: string,
): Record<string, string[]> {
  const filters: Record<string, string[]> = {};
  for (const group of groups) {
    if (
      group.values.length === 0 ||
      group.key === undefined ||
      group.key === levelHierarchy
    )
      continue;
    filters[group.key] = group.values.map((value) => value.id);
  }
  return filters;
}

/**
 * Every strip level that has selected values, as `{ l0_name: ids, … }`.
 *
 * Used by charts that take the plan's full product scope with no leaf / parent split
 * (e.g. the store hex map).
 */
export function toPlanHierarchyFilters(
  groups: readonly FilterStripGroup[],
): Record<string, string[]> {
  const filters: Record<string, string[]> = {};
  for (const group of groups) {
    if (group.values.length === 0 || group.key === undefined) continue;
    filters[group.key] = group.values.map((value) => value.id);
  }
  return filters;
}

export function toDropdownOptions(group: FilterStripGroup): DropdownOption[] {
  return group.values.map((value) => ({ value: value.id, label: value.label }));
}

/**
 * Ids to send as `levelHierarchyValue` for the lowest selected strip level,
 * or `undefined` when no strip level has values.
 */
export function toLevelHierarchyValue(
  groups: readonly FilterStripGroup[],
  selected: readonly string[],
): string[] | undefined {
  const lowest = lowestSelectedGroup(groups);
  if (lowest === null) return undefined;

  const offered = new Set(lowest.values.map((value) => value.id));
  const matched = selected.filter((value) => offered.has(value));
  if (matched.length > 0) return matched;

  const fallback = lowest.values[0]?.id;
  return fallback === undefined ? undefined : [fallback];
}

/**
 * Chart-filter extras for an enabled hierarchy dropdown. `null` when the strip has no selected
 * level. `levelHierarchy` is the lowest present strip key; `levelHierarchyValue` is every
 * selected dropdown id at that level (or the first option when none match). Parent levels only
 * go into `hierarchyScope` (lowest − 1 and above).
 */
export function buildVisualHierarchyChartFilters(
  groups: readonly FilterStripGroup[],
  selected: readonly string[],
): VisualHierarchyChartFilters | null {
  const lowest = lowestSelectedGroup(groups);
  if (lowest === null) return null;

  const levelHierarchyValue = toLevelHierarchyValue(groups, selected);

  return {
    levelHierarchy: lowest.key,
    ...(levelHierarchyValue !== undefined ? { levelHierarchyValue } : {}),
    hierarchyScope: toHierarchyScopeFilters(groups, lowest.key),
  };
}

/** Matches `GlobalConfig.hierarchy.levelHierarchies` fallback when config is absent. */
export const DEFAULT_LEVEL_HIERARCHIES = [
  'l0_name',
  'l1_name',
  'l2_name',
  'l3_name',
] as const;

export interface ParetoHierarchyLevels {
  /** Strip / dropdown level the planner filters on. */
  filterLevel: string;
  /** Charts `levelHierarchy` — one level above the filter (or the last level for L2/L3). */
  levelHierarchy: string;
}

/**
 * Hierarchy Pareto mapping from the plan's deepest selected level:
 *
 * | Plan lowest | Filter | levelHierarchy |
 * | L0          | L0     | L1             |
 * | L1          | L1     | L2             |
 * | L2          | L2     | L3             |
 * | L3 (last)   | L2     | L3             |
 *
 * Last and second-last share the same filter/axis so the chart always breaks down
 * at the final hierarchy key.
 */
export function resolveParetoHierarchyLevels(
  planLowestKey: string,
  levelHierarchies: readonly string[],
): ParetoHierarchyLevels | null {
  if (levelHierarchies.length < 2) return null;
  const last = levelHierarchies[levelHierarchies.length - 1];
  const secondLast = levelHierarchies[levelHierarchies.length - 2];
  const index = levelHierarchies.indexOf(planLowestKey);
  if (index < 0) return null;

  if (planLowestKey === last || planLowestKey === secondLast) {
    return { filterLevel: secondLast, levelHierarchy: last };
  }

  return {
    filterLevel: planLowestKey,
    levelHierarchy: levelHierarchies[index + 1],
  };
}

/** Strip group that backs the Hierarchy Pareto dropdown. */
export function paretoFilterGroup(
  groups: readonly FilterStripGroup[],
  levelHierarchies: readonly string[],
): FilterStripGroup | null {
  const lowest = lowestSelectedGroup(groups);
  if (lowest === null) return null;
  const levels = resolveParetoHierarchyLevels(lowest.key, levelHierarchies);
  if (levels === null) return null;
  return (
    groups.find((group) => group.key === levels.filterLevel && group.values.length > 0) ?? null
  );
}

/**
 * Parents of the filter level keep full strip values; the filter level uses the dropdown
 * selection. The axis level (`levelHierarchy`) and anything deeper are omitted — the API
 * has no selection for a one-level-up axis.
 */
export function toParetoHierarchyScope(
  groups: readonly FilterStripGroup[],
  filterLevelKey: string,
  levelHierarchyKey: string,
  selected: readonly string[],
  levelOrder: readonly string[],
): Record<string, string[]> {
  const filterIndex = levelOrder.indexOf(filterLevelKey);
  const filters: Record<string, string[]> = {};

  for (const group of groups) {
    if (group.values.length === 0) continue;
    if (group.key === levelHierarchyKey) continue;

    const groupIndex = levelOrder.indexOf(group.key);
    if (filterIndex >= 0 && groupIndex > filterIndex) continue;

    if (group.key === filterLevelKey) {
      const offered = new Set(group.values.map((value) => value.id));
      const matched = selected.filter((value) => offered.has(value));
      filters[group.key] =
        matched.length > 0 ? matched : group.values.map((value) => value.id);
      continue;
    }

    filters[group.key] = group.values.map((value) => value.id);
  }

  return filters;
}

/**
 * Hierarchy Pareto chart extras: `levelHierarchy` is one level above the filter (or the last
 * level for L2/L3 plans). Dropdown selections ride in `hierarchyScope` under the filter key —
 * never as `levelHierarchyValue`, because the axis level has no planner selection.
 */
export function buildParetoHierarchyChartFilters(
  groups: readonly FilterStripGroup[],
  selected: readonly string[],
  levelHierarchies: readonly string[] = DEFAULT_LEVEL_HIERARCHIES,
): VisualHierarchyChartFilters | null {
  const lowest = lowestSelectedGroup(groups);
  if (lowest === null) return null;

  const levels = resolveParetoHierarchyLevels(lowest.key, levelHierarchies);
  if (levels === null) return null;

  const filterGroup = groups.find(
    (group) => group.key === levels.filterLevel && group.values.length > 0,
  );
  if (filterGroup === undefined) return null;

  return {
    levelHierarchy: levels.levelHierarchy,
    hierarchyScope: toParetoHierarchyScope(
      groups,
      levels.filterLevel,
      levels.levelHierarchy,
      selected,
      levelHierarchies,
    ),
  };
}
