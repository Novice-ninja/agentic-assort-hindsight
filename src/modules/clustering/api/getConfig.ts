import { clusteringClient } from './mockClient';
import type { ClusteringConfigResponse } from '../types';

export function getConfig(): Promise<ClusteringConfigResponse> {
  return clusteringClient.get<ClusteringConfigResponse>('/clustering/config');
}
