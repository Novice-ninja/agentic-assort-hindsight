import { clusteringClient } from './mockClient';
import type { ClusteringRun } from '../types';

export function invokeRun(planId: string): Promise<{ run: ClusteringRun }> {
  return clusteringClient.post<{ run: ClusteringRun }>(`/clustering/plans/${planId}/runs`);
}
