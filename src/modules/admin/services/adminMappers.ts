import type { AdminFilterContext, FilterFacetOption, GlobeMarker } from '../types';
import type { GlobalException } from '../types/exception';
import type { AdminLocation } from '../types/location';

export function countFilterChips(ctx: AdminFilterContext): number {
  return (
    ctx.departments.length +
    ctx.seasons.length +
    ctx.regions.length +
    (ctx.productGroupId ? 1 : 0) +
    (ctx.brandId ? 1 : 0)
  );
}

export function locationToMarker(location: AdminLocation, selected: boolean): GlobeMarker {
  return {
    id: location.id,
    lat: location.lat,
    lon: location.lon,
    label: location.name,
    category: location.customerType,
    selected,
  };
}

export function exceptionToMarker(exception: GlobalException, selected: boolean): GlobeMarker {
  return {
    id: exception.id,
    lat: exception.geography.lat,
    lon: exception.geography.lon,
    label: exception.title,
    category: exception.customerType,
    selected,
  };
}

export function ruleSummary(rules: GlobalException['rules']): string {
  return rules.map((r) => `${r.attribute} ${r.operator} ${r.value}`).join('; ');
}

export function filterFacetsByParent(
  facets: FilterFacetOption[],
  facet: string,
  parentId?: string,
): FilterFacetOption[] {
  return facets.filter((f) => f.facet === facet && f.parentId === parentId);
}
