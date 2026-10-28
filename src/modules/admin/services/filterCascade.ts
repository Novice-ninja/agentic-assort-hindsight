import type { FilterFacetOption } from '../types';

export function getChildFacets(
  facets: FilterFacetOption[],
  facet: string,
  parentId?: string,
): FilterFacetOption[] {
  return facets.filter((f) => f.facet === facet && (parentId ? f.parentId === parentId : !f.parentId));
}

export function resolveFacetLabel(
  facets: FilterFacetOption[],
  id: string,
  t: (key: string) => string,
): string {
  const facet = facets.find((f) => f.id === id);
  if (!facet) return id;
  const key = facet.labelKey.startsWith('admin.')
    ? facet.labelKey.slice('admin.'.length)
    : facet.labelKey;
  return t(key);
}
