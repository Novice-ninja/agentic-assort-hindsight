import { clusteringClient } from './mockClient';
import type { ClusteringAttribute } from '../types';

export function getAttributes(planId: string): Promise<{ attributes: ClusteringAttribute[] }> {
  return clusteringClient.get<{ attributes: ClusteringAttribute[] }>(`/clustering/plans/${planId}/attributes`);
}
