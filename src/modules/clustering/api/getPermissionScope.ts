import { clusteringClient } from './mockClient';
import type { ClusteringPermissionScope } from '../types';

export function getPermissionScope(): Promise<ClusteringPermissionScope> {
  return clusteringClient.get<ClusteringPermissionScope>('/clustering/permission-scope');
}
