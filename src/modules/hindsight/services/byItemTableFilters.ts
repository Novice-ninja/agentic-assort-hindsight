import type { HierarchyScopeEntry } from '@modules/planning/types';
import { toCreatePlanHierarchyScope } from '@modules/planning/services/filterHierarchy';
import type { FilterStripGroup } from '../types/filterStrip';

/**
 * Seeds By Item table filter state from the plan's Filters Applied strip.
 * Explicit id lists only — Select All flags are not carried on the strip chips.
 */
export function hierarchyScopeFromFilterStrip(
  groups: readonly FilterStripGroup[],
): HierarchyScopeEntry[] {
  return groups
    .filter((group) => group.values.length > 0)
    .map((group) => ({
      levelName: group.label,
      levelNo: group.key,
      selectedValues: group.values.map((value) => value.id),
    }));
}

/** Strip groups for the table's own applied hierarchy (labels from level defs when present). */
export function filterStripFromHierarchyScope(
  scope: readonly HierarchyScopeEntry[],
  levelLabels: ReadonlyMap<string, string>,
  mandatoryKeys: ReadonlySet<string> = new Set(),
): FilterStripGroup[] {
  return scope
    .filter((entry) => entry.selectedValues.length > 0 || entry.selectAll === true)
    .map((entry) => ({
      key: entry.levelNo,
      label: levelLabels.get(entry.levelNo) ?? entry.levelName,
      mandatory: mandatoryKeys.has(entry.levelNo),
      values: entry.selectedValues.map((id) => ({ id, label: id })),
    }));
}

/** Stable cache-key fragment for the applied hierarchy scope. */
export function serializeHierarchyScopeKey(scope: readonly HierarchyScopeEntry[]): string {
  return toCreatePlanHierarchyScope(scope)
    .map((entry) => {
      if ('select_all' in entry && entry.select_all) {
        const search = [...(entry.search ?? [])].sort().join('|');
        const exceptSearch = [...(entry.except_search ?? [])].sort().join('|');
        const except = [...(entry.except ?? [])].sort().join('|');
        const include = [...(entry.include ?? [])].sort().join('|');
        return `${entry.levelNo}:all:${search}:${exceptSearch}:${except}:${include}`;
      }
      const values = 'selectedValues' in entry ? [...entry.selectedValues].sort() : [];
      return `${entry.levelNo}:${values.join('|')}`;
    })
    .join(';');
}

/**
 * Flat `{ l0_name: ids, … }` for backends that expect chart-style filter keys.
 * Select All levels are omitted here — they ride only on `hierarchyScope`.
 */
export function toFlatHierarchyFilters(
  scope: readonly HierarchyScopeEntry[],
): Record<string, string[]> {
  const filters: Record<string, string[]> = {};
  for (const entry of scope) {
    if (entry.selectAll) continue;
    if (entry.selectedValues.length === 0) continue;
    filters[entry.levelNo] = [...entry.selectedValues];
  }
  return filters;
}
