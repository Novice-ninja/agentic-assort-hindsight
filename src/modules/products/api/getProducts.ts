import { apiClient } from '@shared/services';
import type { Paginated } from '@shared/types';
import type { Product, ProductQuery } from '../types';

export function getProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
  return apiClient.get<Paginated<Product>>('/products', {
    q: query.q,
    category: query.category,
    status: query.status,
    sort: query.sort,
    page: query.page,
    pageSize: query.pageSize,
  });
}
