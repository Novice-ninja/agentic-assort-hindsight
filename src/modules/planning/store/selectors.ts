import type { Plan, PlanTabKey } from '../types';
import { PIPELINE_STEPS } from '../types';
import type { PlanningFilters } from './planningSlice';

/** Plans matching the active status tab. */
export function filterByTab(plans: Plan[], tab: PlanTabKey): Plan[] {
  if (tab === 'all') return plans;
  return plans.filter((p) => p.status === tab);
}

/** Apply Stages (current step label) and Seasons filters. Empty arrays = no constraint. */
export function filterByControls(plans: Plan[], filters: PlanningFilters): Plan[] {
  return plans.filter((p) => {
    const stepLabel = PIPELINE_STEPS[p.currentStep - 1] ?? '';
    const stageOk = filters.stages.length === 0 || filters.stages.includes(stepLabel);
    const seasonOk = filters.seasons.length === 0 || filters.seasons.includes(p.season);
    return stageOk && seasonOk;
  });
}

/** The visible plan set given the active tab and filters. */
export function selectVisiblePlans(
  plans: Plan[],
  tab: PlanTabKey,
  filters: PlanningFilters,
): Plan[] {
  return filterByControls(filterByTab(plans, tab), filters);
}

/** Total active filter count (Stages + Seasons) for the FilterBar meta. */
export function activeFilterCount(filters: PlanningFilters): number {
  return filters.stages.length + filters.seasons.length;
}
