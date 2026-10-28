import {
  EMPTY_FILTER_SNAPSHOT_ID,
  getFilterValues,
} from '@modules/planning/api/getFilters';
import type { FilterValuesFilter } from '@modules/planning/types';
import type { FilterStripGroup } from '../types/filterStrip';
import { DEFAULT_LEVEL_HIERARCHIES } from './visualHierarchy';

export interface CategoryClusterHierarchyScope {
  levelHierarchy: string;
  hierarchyScope: Record<string, string[]>;
}

export class CategoryClusterHierarchyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CategoryClusterHierarchyError';
  }
}

type FilterValuesFetcher = typeof getFilterValues;

/** Seed parent keys from FilterStrip groups that already have values. */
export function seedHierarchyScopeFromStrip(
  groups: readonly FilterStripGroup[],
  requiredParents: readonly string[],
): Record<string, string[]> {
  const byKey = new Map(groups.map((group) => [group.key, group]));
  const scope: Record<string, string[]> = {};

  for (const key of requiredParents) {
    const group = byKey.get(key);
    if (group === undefined || group.values.length === 0) continue;
    scope[key] = group.values.map((value) => value.id);
  }

  return scope;
}

function toValuesFilters(
  scope: Record<string, string[]>,
  orderedKeys: readonly string[],
): FilterValuesFilter[] {
  return orderedKeys
    .filter((key) => (scope[key]?.length ?? 0) > 0)
    .map((key) => ({
      key,
      operator: 'in' as const,
      values: [...scope[key]],
    }));
}

function serializeScope(scope: Record<string, string[]>): string {
  return Object.keys(scope)
    .sort()
    .map((key) => `${key}=${[...scope[key]].sort().join('|')}`)
    .join(';');
}

export function categoryClusterScopeCacheKey(
  planCode: string,
  levelHierarchies: readonly string[],
  seeded: Record<string, string[]>,
): string {
  return `${planCode}::${levelHierarchies.join(',')}::${serializeScope(seeded)}`;
}

/**
 * Last hierarchy key is always the charts `levelHierarchy`. Every earlier key must appear on
 * `filters` (from the strip when present, otherwise cascaded `/filters/values`).
 */
export function requiredParentLevels(
  levelHierarchies: readonly string[],
): { levelHierarchy: string; requiredParents: string[] } | null {
  if (levelHierarchies.length < 2) return null;
  return {
    levelHierarchy: levelHierarchies[levelHierarchies.length - 1],
    requiredParents: levelHierarchies.slice(0, -1),
  };
}

/**
 * Resolves Category × Cluster hierarchy filters: always last-level axis, never
 * `levelHierarchyValue`. Fetches missing intermediate levels in order.
 */
export async function resolveCategoryClusterScope(options: {
  planCode: string;
  groups: readonly FilterStripGroup[];
  levelHierarchies?: readonly string[];
  fetchValues?: FilterValuesFetcher;
  cache?: Map<string, CategoryClusterHierarchyScope>;
}): Promise<CategoryClusterHierarchyScope> {
  const levelHierarchies = options.levelHierarchies ?? DEFAULT_LEVEL_HIERARCHIES;
  const levels = requiredParentLevels(levelHierarchies);
  if (levels === null) {
    throw new CategoryClusterHierarchyError(
      'Hierarchy config must include at least two levels',
    );
  }

  const { levelHierarchy, requiredParents } = levels;
  const seeded = seedHierarchyScopeFromStrip(options.groups, requiredParents);
  const cacheKey = categoryClusterScopeCacheKey(
    options.planCode,
    levelHierarchies,
    seeded,
  );
  const cached = options.cache?.get(cacheKey);
  if (cached !== undefined) return cached;

  const fetchValues = options.fetchValues ?? getFilterValues;
  const hierarchyScope: Record<string, string[]> = { ...seeded };

  for (const key of requiredParents) {
    if (hierarchyScope[key] !== undefined && hierarchyScope[key].length > 0) continue;

    const ancestors = toValuesFilters(hierarchyScope, requiredParents);
    if (ancestors.length === 0) {
      // Need at least one ancestor unless this is the first required parent with strip values.
      // First missing parent with empty scope means the strip had nothing — cannot cascade.
      throw new CategoryClusterHierarchyError(
        `Cannot resolve hierarchy level ${key}: no ancestor selections available`,
      );
    }

    let data;
    try {
      data = await fetchValues({
        attributes: [key],
        filters: ancestors,
        snapshot_id: EMPTY_FILTER_SNAPSHOT_ID,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Filter values request failed';
      throw new CategoryClusterHierarchyError(
        `Failed to load hierarchy values for ${key}: ${message}`,
      );
    }

    const optionsForLevel = data.values[key] ?? [];
    const ids = optionsForLevel
      .map((option) => option.value)
      .filter((value) => value.length > 0);

    if (ids.length === 0) {
      throw new CategoryClusterHierarchyError(
        `No hierarchy values returned for ${key}`,
      );
    }

    hierarchyScope[key] = ids;
  }

  for (const key of requiredParents) {
    if (hierarchyScope[key] === undefined || hierarchyScope[key].length === 0) {
      throw new CategoryClusterHierarchyError(
        `Missing required hierarchy level ${key} for Category × Cluster`,
      );
    }
  }

  const resolved: CategoryClusterHierarchyScope = {
    levelHierarchy,
    hierarchyScope,
  };
  options.cache?.set(cacheKey, resolved);
  return resolved;
}
