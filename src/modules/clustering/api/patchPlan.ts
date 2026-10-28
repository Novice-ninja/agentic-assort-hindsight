import type { HierarchyScopeEntry } from '@modules/planning/types';
import { clusteringClient } from './mockClient';
import type { ClusterPlan, ClusterRunMode, WizardStep } from '../types';

export interface PatchPlanBody {
  name?: string;
  productId?: string | null;
  seasonId?: string | null;
  channelId?: string | null;
  countryIds?: string[];
  hierarchyScope?: HierarchyScopeEntry[];
  runMode?: ClusterRunMode;
  clusterPlanCode?: string | null;
  selectedPeriodId?: string | null;
  selectedPeriodIds?: string[];
  overriddenPeriodIds?: string[];
  currentStep?: WizardStep;
}

export function patchPlan(planId: string, body: PatchPlanBody): Promise<{ plan: ClusterPlan }> {
  return clusteringClient.patch<{ plan: ClusterPlan }>(`/clustering/plans/${planId}`, body);
}
