import { decodeIaString } from '@shared/utils/format';
import type { HierarchyScopeEntry } from '../types';

/**
 * Hierarchy level used for the Category chip/column on All Plans.
 * Hardcoded to `l0_name` for now — change when the backend category level is finalized.
 */
export const PLAN_CATEGORY_LEVEL_NO = 'l1_name';

/** Selected values for a hierarchy level, decoded for display. */
export function scopeValuesByLevelNo(
  hierarchyScope: readonly HierarchyScopeEntry[] | undefined,
  levelNo: string,
): string[] {
  return (hierarchyScope ?? [])
    .filter((entry) => entry.levelNo === levelNo)
    .flatMap((entry) => entry.selectedValues ?? [])
    .map((value) => decodeIaString(value))
    .filter((value) => value.trim() !== '');
}

/** First category plus how many extras to show as a `+N` badge. */
export function categoryOverflow(categories: readonly string[]): {
  primary: string | null;
  overflow: number;
} {
  if (categories.length === 0) return { primary: null, overflow: 0 };
  return { primary: categories[0], overflow: Math.max(0, categories.length - 1) };
}
