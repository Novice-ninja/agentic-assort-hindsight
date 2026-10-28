import { apiClient } from '@shared/services';
import type { Paginated } from '@shared/types';
import type { Location, LocationQuery } from '../types';

export function getLocations(query: LocationQuery = {}): Promise<Paginated<Location>> {
  return apiClient.get<Paginated<Location>>('/locations', {
    q: query.q,
    region: query.region,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
  });
}
