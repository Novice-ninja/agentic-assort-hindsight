import { clusteringClient } from './mockClient';
import type { ApprovalGate, CandidateView, Cluster, ClusterPlan, ClusterResultCandidate, Pin } from '../types';

export function getCandidates(planId: string): Promise<{ candidates: ClusterResultCandidate[] }> {
  return clusteringClient.get(`/clustering/plans/${planId}/candidates`);
}

export function selectCandidate(
  planId: string,
  candidateId: string,
): Promise<{ candidates: ClusterResultCandidate[] }> {
  return clusteringClient.post(`/clustering/plans/${planId}/selection`, { candidateId });
}

export function getCandidateView(planId: string, candidateId: string): Promise<CandidateView> {
  return clusteringClient.get(`/clustering/plans/${planId}/candidates/${candidateId}/view`);
}

export function renameCluster(
  planId: string,
  clusterId: string,
  name: string,
): Promise<{ cluster: Cluster }> {
  return clusteringClient.patch(`/clustering/plans/${planId}/clusters/${clusterId}`, { name });
}

export function pinStore(
  planId: string,
  storeId: string,
  clusterId: string,
): Promise<{ pins: Pin[] }> {
  return clusteringClient.post(`/clustering/plans/${planId}/pins`, { storeId, clusterId });
}

export function unpinStore(planId: string, storeId: string): Promise<void> {
  return clusteringClient.delete(`/clustering/plans/${planId}/pins/${storeId}`);
}

export function approveGate2(planId: string): Promise<{ gates: ApprovalGate[] }> {
  return clusteringClient.post(`/clustering/plans/${planId}/gates/2/approve`);
}

export function rejectGate2(planId: string): Promise<{ plan: ClusterPlan; gates: ApprovalGate[] }> {
  return clusteringClient.post(`/clustering/plans/${planId}/gates/2/reject`);
}

export function signOffGate3(planId: string): Promise<{ plan: ClusterPlan; gates: ApprovalGate[] }> {
  return clusteringClient.post(`/clustering/plans/${planId}/gates/3/signoff`);
}
