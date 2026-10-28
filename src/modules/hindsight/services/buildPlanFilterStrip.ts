import type { HierarchyScopeEntry, Plan } from '@modules/planning/types';
import { decodeIaString } from '@shared/utils';
import {
  FILTER_STRIP_SCHEMA_VERSION,
  filterStripStorageKey,
  type FilterStripGroup,
  type StoredFilterStrip,
} from '../types/filterStrip';
import { DEFAULT_LEVEL_HIERARCHIES } from './visualHierarchy';

/** The plan fields the strip is built from. The row is already in memory on All Plans. */
export type PlanFilterStripSource = Pick<Plan, 'id' | 'season' | 'hierarchyScope'>;

function toValues(selected: readonly string[]): FilterStripGroup['values'] {
  return selected.map((id) => ({ id, label: decodeIaString(id) }));
}

function levelRank(levelNo: string, levelOrder: readonly string[]): number {
  const index = levelOrder.indexOf(levelNo);
  return index < 0 ? levelOrder.length : index;
}

/**
 * Selected hierarchy levels only, in config level order.
 *
 * The plans list does not guarantee `hierarchyScope` order. Chart dropdowns treat the last group
 * with values as the deepest level, so `l1` before `l0` in the payload must still store `l0`
 * then `l1`. Levels with no selected values are omitted. Unknown keys keep their relative order
 * after the known levels.
 */
export function buildFilterStripGroups(
  scope: readonly HierarchyScopeEntry[],
  levelOrder: readonly string[] = DEFAULT_LEVEL_HIERARCHIES,
): FilterStripGroup[] {
  return scope
    .filter((entry) => entry.selectedValues.length > 0)
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) => {
      const rank =
        levelRank(left.entry.levelNo, levelOrder) -
        levelRank(right.entry.levelNo, levelOrder);
      return rank !== 0 ? rank : left.index - right.index;
    })
    .map(({ entry }) => ({
      key: entry.levelNo,
      label: entry.levelName.length > 0 ? entry.levelName : entry.levelNo,
      mandatory: false,
      values: toValues(entry.selectedValues),
    }));
}

/** Session-storage payload for one plan. Season stays off `groups` so it cannot become a chart level. */
export function buildStoredFilterStrip(
  plan: PlanFilterStripSource,
  levelOrder?: readonly string[],
): StoredFilterStrip {
  const season = plan.season.trim();
  return {
    version: FILTER_STRIP_SCHEMA_VERSION,
    planCode: plan.id,
    groups: buildFilterStripGroups(plan.hierarchyScope, levelOrder),
    savedAt: new Date().toISOString(),
    ...(season.length > 0 ? { planSeasonName: season } : {}),
  };
}

/** Writes the strip for the tab lifetime. A private-mode or quota failure leaves the page on its skeleton. */
export function savePlanFilterStrip(entry: StoredFilterStrip): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      filterStripStorageKey(entry.planCode),
      JSON.stringify(entry),
    );
  } catch {
    /* quota or private mode — Hindsight keeps the loading skeleton */
  }
}
