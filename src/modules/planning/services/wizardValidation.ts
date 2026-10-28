import type { HierarchyLevelDef, PlanDraft, WizardStep } from '../types';
import { WIZARD_STEPS } from '../types';
import { isHierarchyLevelSelected } from './filterHierarchy';

export const PLAN_NAME_MAX_LENGTH = 80;

/** Letters, digits, hyphen, underscore, and space only. */
export const PLAN_NAME_PATTERN = /^[A-Za-z0-9_\- ]+$/;

/** Strip characters that are not allowed in a plan name. */
export function sanitizePlanNameInput(value: string): string {
  return value.replace(/[^A-Za-z0-9_\- ]/g, '');
}

/** Optional context for steps whose completeness depends on runtime config. */
export interface StepValidationContext {
  /** Product-dimension levels with `mandatory: true` from `/filters/config`. */
  hierarchyLevels?: readonly HierarchyLevelDef[];
  /** Existing plan names used to enforce uniqueness on the Name & Calendar step. */
  existingNames?: readonly string[];
}

/**
 * Validate the Plan Name (FR-016): non-empty, within the length limit, charset-safe, and
 * unique against existing plans (case-insensitive). Returns an i18n key on failure, or
 * `null` when valid.
 */
export function validatePlanName(
  name: string,
  existingNames: readonly string[] = [],
): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'planning.errors.nameRequired';
  if (trimmed.length > PLAN_NAME_MAX_LENGTH) return 'planning.errors.nameTooLong';
  if (!PLAN_NAME_PATTERN.test(trimmed)) return 'planning.errors.nameInvalidChars';
  const taken = existingNames.some((n) => n.trim().toLowerCase() === trimmed.toLowerCase());
  if (taken) return 'planning.errors.nameNotUnique';
  return null;
}

function isProductScopeComplete(
  draft: PlanDraft,
  hierarchyLevels: readonly HierarchyLevelDef[] | undefined,
): boolean {
  const selected = (levelNo: string) =>
    isHierarchyLevelSelected(draft.hierarchyScope.find((entry) => entry.levelNo === levelNo));

  const mandatory = (hierarchyLevels ?? []).filter((level) => level.mandatory);
  if (mandatory.length > 0) {
    return mandatory.every((level) => selected(level.levelNo));
  }

  return draft.hierarchyScope.some((entry) => isHierarchyLevelSelected(entry));
}

/** Required-field completeness per step (FR-020, FR-026, FR-032). */
export function isStepComplete(
  step: WizardStep,
  draft: PlanDraft,
  context: StepValidationContext = {},
): boolean {
  switch (step) {
    case 'nameCalendar':
      return (
        validatePlanName(draft.name, context.existingNames) === null &&
        Boolean(draft.fiscalYearId) &&
        Boolean(draft.season)
      );
    case 'productScope':
      return isProductScopeComplete(draft, context.hierarchyLevels);
    case 'clusteringRunMode':
      return Boolean(draft.clusteringScenarioId) && Boolean(draft.runMode);
    case 'reviewCreate':
      return (
        isStepComplete('nameCalendar', draft, context) &&
        isStepComplete('productScope', draft, context) &&
        isStepComplete('clusteringRunMode', draft, context)
      );
    default:
      return false;
  }
}

/** All data captured — the plan can be created (FR-033/035). */
export function canCreatePlan(
  draft: PlanDraft,
  context: StepValidationContext = {},
): boolean {
  return (
    isStepComplete('nameCalendar', draft, context) &&
    isStepComplete('productScope', draft, context) &&
    isStepComplete('clusteringRunMode', draft, context)
  );
}

/** The earliest step whose required fields are not yet complete (used for resume). */
export function firstIncompleteStep(
  draft: PlanDraft,
  context: StepValidationContext = {},
): WizardStep {
  return (
    WIZARD_STEPS.find(
      (step) => step !== 'reviewCreate' && !isStepComplete(step, draft, context),
    ) ?? 'reviewCreate'
  );
}
