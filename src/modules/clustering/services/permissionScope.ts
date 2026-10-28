import type { ClusteringPermissionScope } from '../types';
import type { CountryOption, ProductOption } from '../types';

/**
 * Empty arrays mean none, never "all". Select-all copies the permitted set as-is.
 */
export function selectAllCountries(scope: ClusteringPermissionScope | null): string[] {
  return scope === null ? [] : [...scope.countryIds];
}

export function selectAllStores(scope: ClusteringPermissionScope | null): string[] {
  return scope === null ? [] : [...scope.storeIds];
}

export function selectAllProducts(scope: ClusteringPermissionScope | null): string[] {
  return scope === null ? [] : [...scope.productIds];
}

export function scopedCountries(
  countries: CountryOption[],
  scope: ClusteringPermissionScope | null,
): CountryOption[] {
  if (scope === null) return [];
  const allowed = new Set(scope.countryIds);
  return countries.filter((country) => allowed.has(country.id));
}

export function scopedProducts(
  products: ProductOption[],
  scope: ClusteringPermissionScope | null,
): ProductOption[] {
  if (scope === null) return [];
  const allowed = new Set(scope.productIds);
  return products.filter((product) => allowed.has(product.id));
}

export function isOutOfScope(ids: string[], permitted: string[]): boolean {
  const allowed = new Set(permitted);
  return ids.some((id) => !allowed.has(id));
}

export function retainHiddenSelections(
  selectedIds: string[],
  visibleIds: string[],
  nextVisibleSelected: string[],
): string[] {
  const hidden = selectedIds.filter((id) => !visibleIds.includes(id));
  return [...new Set([...hidden, ...nextVisibleSelected])];
}
