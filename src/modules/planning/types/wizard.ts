import type { Plan, RunMode, StartingPoint } from './plan';
import type { HierarchyScopeEntry, ProductScopeSelection } from './referenceData';

export type WizardStep = 'nameCalendar' | 'productScope' | 'clusteringRunMode' | 'reviewCreate';

export const WIZARD_STEPS: WizardStep[] = [
  'nameCalendar',
  'productScope',
  'clusteringRunMode',
  'reviewCreate',
];

/** Working copy of the plan being created; auto-saved on each step transition. */
export interface PlanDraft {
  id: string | null;
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  name: string;
  fiscalYearId: string | null;
  season: string | null;
  /** Numeric season code from the API, needed for the Create Plan payload. */
  seasonCode: number | null;
  startingPoint: StartingPoint | null;
  scope: ProductScopeSelection;
  /** Product hierarchy selections in the API-compatible array format. */
  hierarchyScope: HierarchyScopeEntry[];
  clusteringScenarioId: string | null;
  runMode: RunMode;
  confidenceThreshold: number;
}

export const DEFAULT_CONFIDENCE_THRESHOLD = 80;
export const CONFIDENCE_MIN = 60;
export const CONFIDENCE_MAX = 95;

/**
 * Seed a wizard draft from an existing plan (resume — FR-007). Completed steps are inferred
 * from the plan's captured data and the current step is the first still-incomplete one.
 */
export function createDraftFromPlan(plan: Plan): PlanDraft {
  const nameDone =
    Boolean(plan.name) &&
    Boolean(plan.fiscalYearId) &&
    Boolean(plan.season);
  const scopeDone = Boolean(plan.scope.departmentId) && plan.scope.classIds.length > 0;
  const clusterDone = Boolean(plan.clusteringScenarioId) && Boolean(plan.runMode);

  const completedSteps: WizardStep[] = [];
  if (nameDone) completedSteps.push('nameCalendar');
  if (scopeDone) completedSteps.push('productScope');
  if (clusterDone) completedSteps.push('clusteringRunMode');

  const currentStep: WizardStep =
    (!nameDone && 'nameCalendar') ||
    (!scopeDone && 'productScope') ||
    (!clusterDone && 'clusteringRunMode') ||
    'reviewCreate';

  return {
    id: plan.id,
    currentStep,
    completedSteps,
    name: plan.name,
    fiscalYearId: plan.fiscalYearId,
    season: plan.season,
    seasonCode: plan.seasonCode ?? null,
    startingPoint: plan.startingPoint,
    scope: { ...plan.scope },
    hierarchyScope: [],
    clusteringScenarioId: plan.clusteringScenarioId,
    runMode: plan.runMode,
    confidenceThreshold: plan.confidenceThreshold,
  };
}
