import { clusteringClient } from './mockClient';
import type { ApprovalGate, ClusterDraft, ClusterPlan, SignOffContext } from '../types';

export interface PlanDetailResponse {
  plan: ClusterPlan;
  draft: ClusterDraft;
  gates: ApprovalGate[];
  signOff: SignOffContext;
}

export function getPlan(planId: string): Promise<PlanDetailResponse> {
  return clusteringClient.get<PlanDetailResponse>(`/clustering/plans/${planId}`);
}
