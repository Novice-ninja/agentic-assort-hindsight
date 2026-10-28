import type { Product, ProductStatus } from '../types';

const STATUS_VARIANT: Record<ProductStatus, 'success' | 'neutral' | 'warning'> = {
  active: 'success',
  inactive: 'neutral',
  draft: 'warning',
};

export function statusToBadgeVariant(status: ProductStatus) {
  return STATUS_VARIANT[status];
}

export function sortProducts(items: Product[], key: string, direction: 'asc' | 'desc'): Product[] {
  const sorted = [...items].sort((a, b) => {
    const av = a[key as keyof Product];
    const bv = b[key as keyof Product];
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
}
