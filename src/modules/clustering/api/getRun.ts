import { clusteringClient } from './mockClient';
import type { ClusteringRun } from '../types';

export function getRun(planId: string, runId: string): Promise<{ run: ClusteringRun }> {
  return clusteringClient.get<{ run: ClusteringRun }>(`/clustering/plans/${planId}/runs/${runId}`);
}
