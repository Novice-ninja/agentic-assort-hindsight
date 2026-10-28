import type { FilterFacets, GlobalSelection, HierarchyPosition, PermissionScope } from '../types';

/**
 * The single place permission scope is applied. Every widget selector derives from these
 * helpers rather than reaching raw collections — a scope bug in any one widget would be a
 * data leak, so there is exactly one implementation to get right.
 */

function intersect(available: string[], permitted: string[]): string[] {
  const allowed = new Set(permitted);
  return available.filter((id) => allowed.has(id));
}

/** Positions the planner may see, at the level currently in view. */
export function scopedPositions(
  positions: HierarchyPosition[],
  scope: PermissionScope | null,
  levelId: string,
): HierarchyPosition[] {
  const atLevel = positions.filter((p) => p.levelId === levelId);
  if (scope === null) return [];
  const allowed = new Set(scope.productPositionIds);
  return atLevel.filter((p) => allowed.has(p.id));
}

/** Facet options reduced to what the planner may see, before anything is rendered. */
export function scopedFacets(facets: FilterFacets, scope: PermissionScope | null): FilterFacets {
  if (scope === null) {
    return { levels: facets.levels, positions: [], countries: [], channels: [] };
  }
  const positions = new Set(scope.productPositionIds);
  const countries = new Set(scope.countryIds);
  const channels = new Set(scope.channelIds);
  return {
    levels: facets.levels,
    positions: facets.positions.filter((p) => positions.has(p.id)),
    countries: facets.countries.filter((c) => countries.has(c.id)),
    channels: facets.channels.filter((c) => channels.has(c.id)),
  };
}

/**
 * What "select all" resolves to. It is the permitted intersection, never the full company
 * set — a planner with two of five divisions who selects all gets exactly their two.
 */
export function selectAllPositions(
  positions: HierarchyPosition[],
  scope: PermissionScope | null,
  levelId: string,
): string[] {
  return scopedPositions(positions, scope, levelId).map((p) => p.id);
}

export function selectAllCountries(scope: PermissionScope | null): string[] {
  return scope === null ? [] : [...scope.countryIds];
}

export function selectAllChannels(scope: PermissionScope | null): string[] {
  return scope === null ? [] : [...scope.channelIds];
}

/**
 * Drops anything the planner may no longer see. Called when scope changes mid-session, so
 * visible data narrows without requiring a sign-out.
 */
export function applyScopeToSelection(
  selection: GlobalSelection,
  scope: PermissionScope | null,
): GlobalSelection {
  if (scope === null) {
    return { ...selection, productPositionIds: [], countryIds: [], channelIds: [] };
  }
  return {
    ...selection,
    productPositionIds: intersect(selection.productPositionIds, scope.productPositionIds),
    countryIds: intersect(selection.countryIds, scope.countryIds),
    channelIds: intersect(selection.channelIds, scope.channelIds),
  };
}

/** True when every id in the selection is inside scope. Used to assert, not to filter. */
export function isSelectionInScope(
  selection: GlobalSelection,
  scope: PermissionScope | null,
): boolean {
  if (scope === null) return false;
  const withinProducts = selection.productPositionIds.every((id) =>
    scope.productPositionIds.includes(id),
  );
  const withinCountries = selection.countryIds.every((id) => scope.countryIds.includes(id));
  const withinChannels = selection.channelIds.every((id) => scope.channelIds.includes(id));
  return withinProducts && withinCountries && withinChannels;
}

/** Filters any scoped record collection by cluster or position ownership. */
export function scopedByIds<T>(rows: T[], getId: (row: T) => string, permitted: string[]): T[] {
  const allowed = new Set(permitted);
  return rows.filter((row) => allowed.has(getId(row)));
}
