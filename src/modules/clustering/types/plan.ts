import type { HierarchyScopeEntry } from '@modules/planning/types';

export type ClusterPlanStatus = 'draft' | 'inputNeeded' | 'awaitingApproval' | 'approved';

export type WizardStep = 'scope' | 'reviewRun' | 'finalize' | 'signOff';

/** Backend `clusterPlan.substatus` values that decide which wizard step/section to reopen. */
export type ClusterPlanSubStatus =
  | 'ATTRIBUTE_SELECTION_PENDING'
  | 'VARIANT_SELECTION_PENDING'
  | 'SELECT_FINAL_CLUSTER_VARIANT_PENDING'
  | 'GATE_2_APPROVAL_PENDING'
  | 'GATE_2_APPROVAL'
  | 'GATE_3_APPROVAL_PENDING'
  | 'GATE_3_APPROVAL'
  | 'FINALIZED';

export type ClusterPlanLandingSection =
  | 'attributes'
  | 'variants'
  | 'candidates'
  | 'gate2'
  | 'gate3'
  | 'complete';

export interface ClusterPlanLanding {
  step: WizardStep;
  section: ClusterPlanLandingSection;
}

/** In-memory draft id while the wizard is on `/clustering/create`. */
export const CREATE_DRAFT_ID = 'create';

/** One named attribute from `GET /v1/clustering/plans`. */
export interface ClusterPlanAttribute {
  attributeName: string;
  attributeValue: unknown;
}

/** Pipeline run mode chosen on the Scope step. v1 supports Gated (Autonomous is previewed). */
export type ClusterRunMode = 'gated' | 'autonomous';

export type PlanStepsBadge = 'draft' | 'inputNeeded' | 'awaitingApproval' | 'finalised';

export type ClusterPlanTabKey = 'all' | 'awaitingApproval' | 'inputNeeded' | 'approved';

export const WIZARD_STEPS: WizardStep[] = ['scope', 'reviewRun', 'finalize', 'signOff'];

export interface ClusterPlan {
  id: string;
  name: string;
  productId: string | null;
  seasonId: string | null;
  channelId: string | null;
  countryIds: string[];
  status: ClusterPlanStatus;
  /** Backend label for the plan-steps badge. Absent on wizard mocks, which fall back to a translated badge. */
  statusDisplayName?: string | null;
  currentStep: WizardStep;
  /** Backend pipeline substatus; maps to a wizard landing via global config. */
  substatus?: string | null;
  /** Scope attributes from the list API; used as resume payload inputs. */
  attributes?: ClusterPlanAttribute[] | null;
  /** Null until Finalize has a selected candidate; dashboard renders `-`. */
  clusterCount: number | null;
  /** Comma-separated `channel_code` values from the list API. Null renders `-`. */
  channelDisplay?: string | null;
  /** Translation key for wizard mocks. List rows use `channelDisplay` instead. */
  channelLabelKey: string | null;
  createdBy: string | null;
  createdOn: string | null;
  locked: boolean;
  inputNeededReasonKey?: string;
  forceFail?: boolean;
}

export interface ClusterDraft {
  planId: string;
  name: string;
  productId: string | null;
  seasonId: string | null;
  channelId: string | null;
  countryIds: string[];
  /**
   * Cascaded product-hierarchy selections from `/filters/config?config_key=cluster_config`
   * + `/filters/values` (same shape as Create Plan Product Scope).
   */
  hierarchyScope: HierarchyScopeEntry[];
  runMode: ClusterRunMode;
  /**
   * Backend identifier returned by `POST /v1/clustering/plans` when Scope is submitted.
   * `null` until the plan has been created; Review & Run reads it from here.
   */
  clusterPlanCode: string | null;
  attributeOverrides: Record<string, boolean>;
  /**
   * Checkbox selection (`attributeSelectionKey`) that the current generated variants
   * belong to. `null` until Confirm succeeds or a resumed plan's variants are seeded.
   */
  confirmedAttributeKey: string | null;
  selectedPeriodId: string | null;
  selectedPeriodIds: string[];
  overriddenPeriodIds: string[];
  selectedCandidateId: string | null;
  currentStep: WizardStep;
  /** Currently viewed section within `currentStep`; unset during create. */
  landingSection?: ClusterPlanLandingSection;
  /** Original resume landing from `substatus`; used so Back can GET already-completed steps. */
  resumeSection?: ClusterPlanLandingSection;
}

/** True for an unsubmitted `/create` draft — leftover opened/created plans must not match. */
export function isFreshCreateDraft(draft: ClusterDraft | null | undefined): boolean {
  return !!draft && draft.planId === CREATE_DRAFT_ID && draft.clusterPlanCode === null;
}

export function emptyDraft(planId: string): ClusterDraft {
  return {
    planId,
    name: '',
    productId: null,
    seasonId: null,
    channelId: null,
    countryIds: [],
    hierarchyScope: [],
    runMode: 'gated',
    clusterPlanCode: null,
    attributeOverrides: {},
    confirmedAttributeKey: null,
    selectedPeriodId: null,
    selectedPeriodIds: [],
    overriddenPeriodIds: [],
    selectedCandidateId: null,
    currentStep: 'scope',
  };
}

export function selectedPeriodIdsFromDraft(
  draft: Pick<ClusterDraft, 'selectedPeriodId'> & { selectedPeriodIds?: string[] },
): string[] {
  if (draft.selectedPeriodIds && draft.selectedPeriodIds.length > 0) return draft.selectedPeriodIds;
  return draft.selectedPeriodId ? [draft.selectedPeriodId] : [];
}

export function planStepsBadge(plan: ClusterPlan): PlanStepsBadge {
  if (plan.status === 'approved') return 'finalised';
  if (plan.status === 'awaitingApproval') return 'awaitingApproval';
  if (plan.status === 'inputNeeded') return 'inputNeeded';
  return 'draft';
}
