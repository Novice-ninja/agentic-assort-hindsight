import { apiClient } from '@shared/services';
import type { Cluster, FilterFacets, PermissionScope, Season } from '../types';

export interface HindsightContextResponse {
  seasons: Season[];
  facets: FilterFacets;
  /** The planner's permitted products and locations. Bounds every subsequent request. */
  scope: PermissionScope;
  clusters: Cluster[];
  defaultSeasonId: string;
}

export function getHindsightContext(): Promise<HindsightContextResponse> {
  return apiClient.get<HindsightContextResponse>('/hindsight/context');
}
