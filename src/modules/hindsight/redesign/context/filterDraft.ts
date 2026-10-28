import type { Dataset, Scope } from '../data';

/** Product and location facets are ANDed; values within a field are ORed. Undefined means all, [] means none. */
export function updateProductFacet(scope: Scope, key: keyof NonNullable<Scope['productFacets']>, values: string[] | undefined, dataset: Dataset): { scope: Scope; invalidated: string[] } {
  const productFacets = { ...scope.productFacets };
  if (values === undefined) delete productFacets[key]; else productFacets[key] = values;
  const invalidated: string[] = [];
  if (key === 'categories') {
    const candidates = dataset.products.filter(item => !values || values.includes(item.category));
    if (productFacets.subcategories) {
      const allowed = new Set(candidates.map(item => item.subcategory));
      invalidated.push(...productFacets.subcategories.filter(value => !allowed.has(value)));
      const kept = productFacets.subcategories.filter(value => allowed.has(value));
      // An invalid child recipe must not silently turn a newly chosen parent into an empty result.
      if (kept.length) productFacets.subcategories = kept; else delete productFacets.subcategories;
    }
    const allowedIds = new Set(candidates.map(item => item.id));
    invalidated.push(...scope.productIds.filter(id => !allowedIds.has(id)));
    const productIds = scope.productIds.filter(id => allowedIds.has(id));
    return { scope: { ...scope, productFacets, productIds, productSelection: scope.productIds.length ? productIds.length ? 'selected' : 'none' : scope.productSelection }, invalidated };
  }
  return { scope: { ...scope, productFacets }, invalidated };
}
export function updateLocationFacet(scope: Scope, key: keyof NonNullable<Scope['locationFacets']>, values: string[] | undefined, dataset: Dataset): { scope: Scope; invalidated: string[] } {
  const locationFacets = { ...scope.locationFacets };
  if (values === undefined) delete locationFacets[key]; else locationFacets[key] = values;
  const invalidated: string[] = [];
  if (key === 'regions') {
    const candidates = dataset.stores.filter(store => !values || values.includes(store.region));
    if (locationFacets.districts) {
      const allowed = new Set(candidates.map(store => store.district));
      invalidated.push(...locationFacets.districts.filter(value => !allowed.has(value)));
      const kept = locationFacets.districts.filter(value => allowed.has(value));
      if (kept.length) locationFacets.districts = kept; else delete locationFacets.districts;
    }
    const allowedIds = new Set(candidates.map(store => store.id));
    invalidated.push(...scope.storeIds.filter(id => !allowedIds.has(id)));
    const storeIds = scope.storeIds.filter(id => allowedIds.has(id));
    return { scope: { ...scope, locationFacets, storeIds, storeSelection: scope.storeIds.length ? storeIds.length ? 'selected' : 'none' : scope.storeSelection }, invalidated };
  }
  return { scope: { ...scope, locationFacets }, invalidated };
}
export function selectionValues(ids: string[], mode: Scope['productSelection'], all: string[]): string[] { return ids.length ? ids : mode === 'none' || mode === 'selected' ? [] : all; }
