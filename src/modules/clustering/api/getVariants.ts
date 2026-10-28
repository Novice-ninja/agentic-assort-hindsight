import { clusteringClient } from './mockClient';
import type { Variant } from '../types';

export function getVariants(planId: string): Promise<{ variants: Variant[] }> {
  return clusteringClient.get<{ variants: Variant[] }>(`/clustering/plans/${planId}/variants`);
}

export function patchVariants(
  planId: string,
  variants: Variant[],
): Promise<{ variants: Variant[] }> {
  return clusteringClient.patch<{ variants: Variant[] }>(`/clustering/plans/${planId}/variants`, {
    variants,
  });
}
