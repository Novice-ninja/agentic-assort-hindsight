import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { useLocalStorage } from '@shared/hooks';
import { env } from '@config/env';
import type { CreatePlanInput } from '../api';
import {
  completeStep as completeStepAction,
  goToStep as goToStepAction,
  persistDraft,
  resetDraft as resetDraftAction,
  startDraft as startDraftAction,
  submitPlan,
  updateDraft as updateDraftAction,
} from '../store/planningSlice';
import {
  canCreatePlan,
  firstIncompleteStep,
  isStepComplete,
  toCreatePlanHierarchyScope,
} from '../services';
import {
  WIZARD_STEPS,
  createDraftFromPlan,
  type PipelineStagePreview,
  type PlanDraft,
  type WizardStep,
} from '../types';

const DRAFT_STORAGE_KEY = 'planning.activeDraft';

const DUMMY_CLUSTER_PLAN_CODE = '3e6acee6-1018-42c1-9622-a0916c8ae8c2';

function toCreateInput(draft: PlanDraft): CreatePlanInput {
  return {
    planName: draft.name.trim(),
    fiscalYear: draft.fiscalYearId ?? '',
    planSeasonCode: draft.seasonCode ?? 0,
    pipelineMode: draft.runMode,
    thresholdPct: draft.confidenceThreshold,
    createdBy: env.defaultUserEmail,
    hierarchyScope: toCreatePlanHierarchyScope(draft.hierarchyScope),
    clusterPlanCode: DUMMY_CLUSTER_PLAN_CODE,
  };
}

export interface UseCreatePlanWizardOptions {
  /** When set, seed the wizard from an existing plan and resume at its first incomplete step. */
  resumePlanId?: string;
}

export function useCreatePlanWizard({ resumePlanId }: UseCreatePlanWizardOptions = {}) {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.planning.draft);
  const referenceData = useAppSelector((s) => s.planning.referenceData);
  const plans = useAppSelector((s) => s.planning.plans);
  const hierarchyLevels = useAppSelector((s) => s.planning.hierarchyLevels);
  const createStatus = useAppSelector((s) => s.planning.statuses.create);
  const createError = useAppSelector((s) => s.planning.createError);

  const [, setStoredDraft] = useLocalStorage<PlanDraft | null>(DRAFT_STORAGE_KEY, null);
  const seededRef = useRef(false);

  // Ensure a draft exists; seed from an existing plan when resuming.
  useEffect(() => {
    if (seededRef.current || draft) return;
    seededRef.current = true;
    const resumePlan = resumePlanId ? plans.find((p) => p.id === resumePlanId) : undefined;
    dispatch(startDraftAction(resumePlan ? createDraftFromPlan(resumePlan) : undefined));
  }, [dispatch, draft, plans, resumePlanId]);

  // Names to enforce uniqueness against (excluding the plan currently being resumed).
  const existingNames = useMemo(
    () => plans.filter((p) => p.id !== draft?.id).map((p) => p.name),
    [plans, draft?.id],
  );

  const stepContext = useMemo(
    () => ({ hierarchyLevels, existingNames }),
    [hierarchyLevels, existingNames],
  );

  const currentStep: WizardStep = draft?.currentStep ?? 'nameCalendar';
  const completedSteps = useMemo(() => draft?.completedSteps ?? [], [draft?.completedSteps]);

  const stepComplete = useCallback(
    (step: WizardStep) => (draft ? isStepComplete(step, draft, stepContext) : false),
    [draft, stepContext],
  );

  const canAdvance = draft ? isStepComplete(currentStep, draft, stepContext) : false;

  const update = useCallback(
    (patch: Partial<PlanDraft>) => dispatch(updateDraftAction(patch)),
    [dispatch],
  );

  // Auto-save (FR-015 / NFR-2): persist + mirror to localStorage whenever the draft changes.
  useEffect(() => {
    if (!draft) return;
    setStoredDraft(draft);
  }, [draft, setStoredDraft]);

  const persist = useCallback(() => {
    if (draft) void dispatch(persistDraft(draft));
  }, [dispatch, draft]);

  const goNext = useCallback(() => {
    if (!draft || !isStepComplete(currentStep, draft, stepContext)) return;
    dispatch(completeStepAction(currentStep));
    persist();
  }, [dispatch, draft, currentStep, persist, stepContext]);

  const goToStep = useCallback(
    (step: WizardStep) => {
      if (!draft) return;
      const targetIdx = WIZARD_STEPS.indexOf(step);
      const currentIdx = WIZARD_STEPS.indexOf(currentStep);
      // Backward navigation and jumps to already-completed steps are always allowed (FR-013).
      const reachable = targetIdx <= currentIdx || completedSteps.includes(step);
      if (!reachable) return;
      dispatch(goToStepAction(step));
      persist();
    },
    [dispatch, draft, currentStep, completedSteps, persist],
  );

  const goBack = useCallback(() => {
    const idx = WIZARD_STEPS.indexOf(currentStep);
    if (idx > 0) goToStep(WIZARD_STEPS[idx - 1]);
  }, [currentStep, goToStep]);

  const submit = useCallback(async () => {
    if (!draft || !canCreatePlan(draft, stepContext)) return { ok: false as const };
    const result = await dispatch(submitPlan(toCreateInput(draft)));
    if (submitPlan.fulfilled.match(result)) {
      setStoredDraft(null);
      return { ok: true as const };
    }
    const errorMessage = (result.payload as string) || undefined;
    return { ok: false as const, message: errorMessage };
  }, [dispatch, draft, setStoredDraft, stepContext]);

  const reset = useCallback(() => {
    dispatch(resetDraftAction());
    setStoredDraft(null);
    seededRef.current = false;
  }, [dispatch, setStoredDraft]);

  // "What The Agent Will Do" preview (FR-034): pipeline stages tagged with the chosen scenario.
  const pipelinePreview = useMemo<PipelineStagePreview[]>(() => {
    const scenario = referenceData.clusteringScenarios.find(
      (c) => c.id === draft?.clusteringScenarioId,
    );
    if (!scenario) return [];
    const stages = ['Location Clustering', 'Hindsight Analysis', 'Strategy & Scenario', 'Line Planning'];
    return stages.map((label, i) => ({
      order: i + 1,
      label,
      scenarioName: scenario.name,
      confidencePct: scenario.confidencePct,
    }));
  }, [referenceData.clusteringScenarios, draft?.clusteringScenarioId]);

  return {
    draft,
    referenceData,
    currentStep,
    completedSteps,
    steps: WIZARD_STEPS,
    existingNames,
    canAdvance,
    canCreate: draft ? canCreatePlan(draft, stepContext) : false,
    creating: createStatus === 'loading',
    createError,
    pipelinePreview,
    firstIncompleteStep: draft ? firstIncompleteStep(draft, stepContext) : 'nameCalendar',
    stepComplete,
    update,
    goNext,
    goBack,
    goToStep,
    submit,
    reset,
  };
}
