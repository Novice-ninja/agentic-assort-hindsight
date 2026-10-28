import type { ClusterPlan, ClusterPlanTabKey } from '../types';
import type { ClusteringState } from './clusteringSlice';

export function selectVisiblePlans(
  plans: ClusterPlan[],
  tab: ClusterPlanTabKey,
): ClusterPlan[] {
  if (tab === 'all') return plans;
  return plans.filter((plan) => plan.status === tab);
}

export function selectTabCounts(state: ClusteringState) {
  return state.tabCounts;
}
