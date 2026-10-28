import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HierarchyLevelDef } from '@modules/planning/types';
import { useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { selectGlobalConfig } from '@modules/appConfig';
import type { RootState } from '@app/store';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { ROUTES } from '@config/routes';
import { HttpError } from '@shared/services/http';
import {
  clusterNameRenames,
  moveStores,
  selectCandidate as selectCandidateApi,
  updateClusterNames,
  type ClusterRunRequest,
  type Gate2Decision,
  type CreateClusterPlanRequest,
  type CreateClusterPlanResponse,
  type StoreAssignmentCluster,
} from '../api';
import { checkPlanName } from '../api/getPlans';
import { pinStore, renameCluster, unpinStore } from '../api/finalize';
import { can } from '../services/access';
import { storeMoveFromCluster } from '../services/storeAssignmentsView';
import {
  ClusterRunRequestError,
  toClusterRunRequest,
} from '../services/clusterRunRequest';
import { hasCustomVariant } from '../services/mapGeneratedVariants';
import { reviewVariantDisplayName } from '../services/reviewVariantDisplay';
import { clusterPlanSnapshotFromCreate } from '../services/clusterPlanSnapshot';
import { clusterPlanToResumeDraft } from '../services/clusterPlanToResumeDraft';
import {
  CreateClusterPlanRequestError,
  toCreateClusterPlanRequest,
} from '../services/createClusterPlanRequest';
import {
  isReferenceCoverageValid,
  referenceCoverageTotal,
} from '../services/referenceCoverage';
import {
  landingSectionForStep,
  resolveClusterPlanLanding,
} from '../services/resolveClusterPlanLanding';
import { attributeSelectionKey } from '../services/finalAttributesPayload';
import { validateScope } from '../services/scopeValidation';
import { useClusterPlanContext } from './useClusterPlanContext';
import {
  clearSelectedVariant,
  confirmAndGenerateVariants,
  fetchAttributeSignificance,
  fetchApprover,
  fetchCandidates,
  fetchClusterVariants,
  fetchClusterVariantsSummary,
  fetchClusterPerformanceSummary,
  fetchAttributeGradesSummary,
  fetchConfigAndScope,
  fetchGeneratedVariants,
  fetchPlans,
  fetchSelectedVariant,
  fetchPerformanceInfo,
  fetchClusterPlans,
  fetchKpiBreakdown,
  fetchAttributeInfo,
  fetchAttributeProductList,
  fetchStoreAssignments,
  hasLiveClusterApproval,
  hasLiveClusterRun,
  hasLiveSelectedVariant,
  loadAttributeSignificance,
  loadCustomVariantAttributes,
  openResumedPlan,
  patchDraft,
  resetWizard,
  saveCustomVariant,
  selectRunCandidate,
  setDraft,
  setPlan,
  setVariants,
  submitClusterApproval,
  submitClusterPlan,
  submitClusterRun,
  submitFinalise,
  submitFinalSignOff,
  submitGate2Decision,
} from '../store/clusteringSlice';
import {
  CREATE_DRAFT_ID,
  emptyDraft,
  isFreshCreateDraft,
  WIZARD_STEPS,
  type ClusterDraft,
  type ClusterPlan,
  type ClusterResultCandidate,
  type Variant,
  type WizardStep,
} from '../types';

/**
 * Wizard hook mounts. A StrictMode remount increments this before the deferred unmount
 * reset runs, so that reset does not wipe a session that is still on screen.
 */
let wizardMountGeneration = 0;

/**
 * Outcome of a step transition. `blocked` covers silent no-ops (invalid scope, a request
 * already in flight, a cancelled confirm); `referenceCoverageInvalid` is the Scope
 * Reference Period coverage not summing to 100% (checked before any request is made);
 * `createFailed` is the backend create failing,
 * `scoreFailed` the significance-score hop, `confirmVariantsFailed` the Finalise PUT of
 * kept variant ids, `runFailed` the Finalise POST run,
 * `approveFailed` the Final Sign Off approval, `gate2DecisionFailed` the Gate 2 Approve /
 * Reject PUT, `signOffFailed` the Gate 3 "Sign-Off & Save" finalise PUT. Each carries the
 * server message when there is one.
 */
export type StepResult =
  | { ok: true }
  | { ok: false; reason: 'blocked' }
  | { ok: false; reason: 'referenceCoverageInvalid'; total: number }
  | { ok: false; reason: 'createFailed'; message?: string }
  | { ok: false; reason: 'scoreFailed'; message?: string }
  | { ok: false; reason: 'confirmVariantsFailed'; message?: string }
  | { ok: false; reason: 'runFailed'; message?: string }
  | { ok: false; reason: 'approveFailed'; message?: string }
  | { ok: false; reason: 'gate2DecisionFailed'; message?: string }
  | { ok: false; reason: 'signOffFailed'; message?: string };

/**
 * Outcome of "Confirm and Generate Variant". `finaliseFailed` is the PUT, `generateFailed`
 * the POST that follows it; both carry the server message when there is one.
 */
export type ConfirmResult =
  | { ok: true }
  | { ok: false; reason: 'blocked' }
  | { ok: false; reason: 'finaliseFailed' | 'generateFailed'; message?: string };

/** Outcome of opening or saving the Custom Variant panel. */
export type CustomVariantResult =
  | { ok: true }
  | { ok: false; reason: 'blocked' }
  | { ok: false; reason: 'loadFailed' | 'saveFailed'; message?: string };

const BLOCKED: StepResult = { ok: false, reason: 'blocked' };

function scopeFingerprint(draft: ClusterDraft): string {
  return [
    draft.productId,
    JSON.stringify(draft.hierarchyScope ?? []),
    draft.seasonId,
    draft.channelId,
    [...draft.countryIds].sort().join(','),
  ].join('|');
}

export function useClusterWizard() {
  const { t } = useTranslation('clustering');
  const dispatch = useAppDispatch();
  const reduxStore = useStore<RootState>();
  const navigate = useNavigate();
  const { planId: routePlanId } = useParams<{ planId: string }>();
  const locationSnapshot = useClusterPlanContext();
  const globalConfig = useAppSelector(selectGlobalConfig);
  const state = useAppSelector((s) => s.clustering);
  // Shared seasons (planning slice) resolve the target season code and derive LY / LLY.
  const seasonsData = useAppSelector((s) => s.planning.seasonsData);
  const lastReviewedScopeRef = useRef<string | null>(null);
  const resumeStartedRef = useRef<string | null>(null);
  const visitGenRef = useRef(0);
  const wizardMountedRef = useRef(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchConfigAndScope());
  }, [dispatch]);

  useEffect(() => {
    if (routePlanId) return;
    if (isFreshCreateDraft(reduxStore.getState().clustering.draft)) return;
    dispatch(resetWizard());
    dispatch(setDraft(emptyDraft(CREATE_DRAFT_ID)));
  }, [dispatch, reduxStore, routePlanId]);

  // Real leave only. StrictMode runs this cleanup and then remounts in the same turn;
  // the remount bumps `wizardMountGeneration` before the timeout, so the session stays.
  useEffect(() => {
    const mountId = ++wizardMountGeneration;
    wizardMountedRef.current = true;
    return () => {
      wizardMountedRef.current = false;
      const closedMountId = mountId;
      window.setTimeout(() => {
        if (wizardMountGeneration !== closedMountId) return;
        visitGenRef.current += 1;
        resumeStartedRef.current = null;
        dispatch(resetWizard());
      }, 0);
    };
  }, [dispatch]);

  /** Fetch only the step the user is on (or navigating to). Earlier steps wait for Back. */
  const loadStepApis = useCallback(
    (code: string, step: WizardStep, section: ClusterDraft['landingSection']) => {
      if (step === 'reviewRun') {
        void dispatch(fetchAttributeSignificance(code));
        if (section === 'variants') void dispatch(fetchGeneratedVariants(code));
        return;
      }
      if (step === 'finalize') {
        // The summary forwards the cluster-variants list, so it waits for that GET to settle
        // (and reuses it) instead of fetching the same endpoint twice.
        void dispatch(fetchClusterVariants(code)).then(() => {
          void dispatch(fetchClusterVariantsSummary({ clusterPlanCode: code }));
        });
        return;
      }
      if (step === 'signOff') {
        // Gate 2 must render the GET, not a variant left in the store from Finalize.
        dispatch(clearSelectedVariant());
        void dispatch(fetchSelectedVariant(code));
      }
    },
    [dispatch],
  );

  const hydrateOpenedPlan = useCallback(
    async (clusterPlanCode: string) => {
      const visitGen = visitGenRef.current;
      const stillCurrent = () =>
        wizardMountedRef.current && visitGen === visitGenRef.current;
      setResumeError(null);
      let snapshot: ClusterPlan | undefined = locationSnapshot;
      if (!snapshot || snapshot.id !== clusterPlanCode) {
        let plans = reduxStore.getState().clustering.plans;
        if (plans.length === 0) {
          const result = await dispatch(fetchPlans());
          if (!stillCurrent()) return;
          if (fetchPlans.fulfilled.match(result)) plans = result.payload.plans;
        }
        snapshot = plans.find((plan) => plan.id === clusterPlanCode);
      }
      if (!stillCurrent()) return;
      if (!snapshot) {
        setResumeError('planNotFound');
        return;
      }
      const landing = resolveClusterPlanLanding(globalConfig, snapshot.substatus);
      if (!landing) {
        setResumeError('unknownSubstatus');
        return;
      }
      const draft = clusterPlanToResumeDraft(snapshot, landing);
      if (!stillCurrent()) return;
      dispatch(openResumedPlan({ plan: snapshot, draft }));
      if (!stillCurrent()) return;
      lastReviewedScopeRef.current = scopeFingerprint(draft);
      loadStepApis(clusterPlanCode, landing.step, landing.section);
    },
    [dispatch, globalConfig, loadStepApis, locationSnapshot, reduxStore],
  );

  useEffect(() => {
    wizardMountedRef.current = true;
    if (!routePlanId) return;
    if (resumeStartedRef.current === routePlanId) return;
    visitGenRef.current += 1;
    resumeStartedRef.current = routePlanId;
    void hydrateOpenedPlan(routePlanId);
  }, [hydrateOpenedPlan, routePlanId]);

  const retryResumeLoad = useCallback(() => {
    const current = reduxStore.getState().clustering.draft;
    const code = current?.clusterPlanCode;
    if (!code) return;
    loadStepApis(code, current.currentStep, current.landingSection);
  }, [loadStepApis, reduxStore]);

  const draft = state.draft;
  const planId = draft?.planId ?? routePlanId;
  const generatedForPlan =
    state.generatedVariants?.clusterPlanCode != null &&
    state.generatedVariants.clusterPlanCode === draft?.clusterPlanCode &&
    (state.generatedVariantsStatus === 'succeeded' ||
      state.generatedVariantsStatus === 'failed');
  const attributeSelectionStale =
    generatedForPlan &&
    draft?.confirmedAttributeKey != null &&
    draft.confirmedAttributeKey !==
      attributeSelectionKey(state.attributes, draft.attributeOverrides);

  const persist = useCallback(
    async (patch: Partial<ClusterDraft>) => {
      dispatch(patchDraft(patch));
    },
    [dispatch],
  );

  useEffect(() => {
    const current = state.draft;
    const code = current?.clusterPlanCode;
    if (!code || current.confirmedAttributeKey != null) return;
    if (state.generatedVariantsStatus !== 'succeeded') return;
    if (state.generatedVariants?.clusterPlanCode !== code) return;
    if (state.attributeScoreStatus !== 'succeeded') return;
    if (state.attributeScore?.clusterPlanCode !== code) return;
    void persist({
      confirmedAttributeKey: attributeSelectionKey(state.attributes),
    });
  }, [
    persist,
    state.attributeScore,
    state.attributeScoreStatus,
    state.attributes,
    state.draft,
    state.generatedVariants,
    state.generatedVariantsStatus,
  ]);

  const [hierarchyLevels, setHierarchyLevels] = useState<readonly HierarchyLevelDef[] | undefined>(
    undefined,
  );
  const scopeValid = useMemo(
    () => (draft ? validateScope(draft, hierarchyLevels).valid : false),
    [draft, hierarchyLevels],
  );

  const checkName = useCallback(
    async (name: string) => {
      const result = await checkPlanName(name, planId);
      if (!result.taken) return false;
      return result.plans.some((plan) => plan.id !== planId);
    },
    [planId],
  );

  /**
   * Second hop of the Scope submit: bodyless `POST .../significance-score/{code}` for the plan
   * the create call just returned. Skipped when the store already holds this plan's score, so
   * a retry after a failed fetch re-requests the score only.
   */
  const ensureAttributeScoreLoaded = useCallback(
    async (clusterPlanCode: string): Promise<StepResult> => {
      const current = reduxStore.getState().clustering;
      if (
        current.attributeScore?.clusterPlanCode === clusterPlanCode &&
        current.attributeScoreStatus === 'succeeded'
      ) {
        return { ok: true };
      }
      const result = await dispatch(loadAttributeSignificance(clusterPlanCode));
      if (loadAttributeSignificance.fulfilled.match(result)) return { ok: true };
      if (result.meta.condition) return BLOCKED;
      return {
        ok: false,
        reason: 'scoreFailed',
        message: typeof result.payload === 'string' ? result.payload : undefined,
      };
    },
    [dispatch, reduxStore],
  );

  /**
   * Leaving Scope for the first time creates the plan on the backend, then loads its
   * significance score — strictly in that order, the second call keyed by the returned
   * `clusterPlanCode`. The code is stored on the draft so later visits (and resumes) skip the
   * create; a failure in either hop leaves the draft on Scope and reports the message for
   * the page to toast.
   */
  const replaceToCreatedPlan = useCallback(
    (clusterPlanCode: string, created?: CreateClusterPlanResponse) => {
      const draftAfter = reduxStore.getState().clustering.draft;
      if (!draftAfter) return;
      const snapshot = clusterPlanSnapshotFromCreate(draftAfter, {
        clusterPlanCode,
        clusterPlanName: created?.clusterPlanName || draftAfter.name,
        attributes: created?.attributes ?? null,
      });
      dispatch(setPlan(snapshot));
      dispatch(
        patchDraft({
          currentStep: 'reviewRun',
          landingSection: 'attributes',
          resumeSection: 'attributes',
          clusterPlanCode,
          planId: clusterPlanCode,
        }),
      );
      navigate(ROUTES.clusteringPlan.replace(':planId', clusterPlanCode), {
        replace: true,
        state: { clusterPlan: snapshot },
      });
    },
    [dispatch, navigate, reduxStore],
  );

  const ensureClusterPlanCreated = useCallback(async (): Promise<StepResult> => {
    const current = reduxStore.getState().clustering;
    if (current.draft?.clusterPlanCode) {
      const scored = await ensureAttributeScoreLoaded(current.draft.clusterPlanCode);
      if (scored.ok && !routePlanId) replaceToCreatedPlan(current.draft.clusterPlanCode);
      return scored;
    }
    if (
      current.createStatus === 'loading' ||
      current.attributeScoreStatus === 'loading' ||
      !current.draft
    ) {
      return BLOCKED;
    }

    let body: CreateClusterPlanRequest;
    try {
      body = toCreateClusterPlanRequest(current.draft, {
        seasons: seasonsData,
        // Reference Period section: season_info codes + the coverage % the user tweaked.
        seasonInfos: current.seasonInfos,
        referenceCoverage: current.referenceCoverage,
        selectedPeriodIds: current.selectedPeriodIds,
        referencePeriodChecked: current.referencePeriodChecked,
      });
    } catch (err) {
      // A selection that cannot go on the wire (e.g. unresolvable season) — stay on Scope.
      if (err instanceof CreateClusterPlanRequestError)
        return { ok: false, reason: 'createFailed' };
      throw err;
    }

    const result = await dispatch(submitClusterPlan(body));
    if (submitClusterPlan.fulfilled.match(result)) {
      const created = result.payload;
      const { clusterPlanCode } = created;
      await persist({ clusterPlanCode, planId: clusterPlanCode });
      const scored = await ensureAttributeScoreLoaded(clusterPlanCode);
      if (!scored.ok) return scored;
      replaceToCreatedPlan(clusterPlanCode, created);
      return scored;
    }
    // `condition` refused: another click already owns the in-flight request.
    if (result.meta.condition) return BLOCKED;
    return {
      ok: false,
      reason: 'createFailed',
      message: typeof result.payload === 'string' ? result.payload : undefined,
    };
  }, [
    dispatch,
    ensureAttributeScoreLoaded,
    persist,
    reduxStore,
    replaceToCreatedPlan,
    routePlanId,
    seasonsData,
  ]);

  /**
   * Review & Run → Finalise: PUT kept variant ids, then `POST .../plans/{code}/runs`.
   * The step only advances once the run response is stored; a failure (or an unbuildable
   * body) keeps the user on Review & Run with their variants intact so they can retry.
   */
  const ensureClusterRunCompleted = useCallback(async (): Promise<StepResult> => {
    const current = reduxStore.getState().clustering;
    const code = current.draft?.clusterPlanCode;
    if (!code || current.clusterRunStatus === 'loading') return BLOCKED;

    let body: ClusterRunRequest;
    try {
      body = toClusterRunRequest(current.variants, current.attributes, (variant) =>
        reviewVariantDisplayName(variant, t),
      );
    } catch (err) {
      if (err instanceof ClusterRunRequestError)
        return { ok: false, reason: 'runFailed' };
      throw err;
    }

    const result = await dispatch(submitClusterRun({ clusterPlanCode: code, body }));
    if (submitClusterRun.fulfilled.match(result)) return { ok: true };
    if (result.meta.condition) return BLOCKED;
    const failure = result.payload;
    if (failure && typeof failure === 'object' && 'stage' in failure) {
      return {
        ok: false,
        reason: failure.stage === 'confirm' ? 'confirmVariantsFailed' : 'runFailed',
        message: failure.message,
      };
    }
    return { ok: false, reason: 'runFailed' };
  }, [dispatch, reduxStore, t]);

  /**
   * Finalize → Sign-Off ("Final Sign Off"): `POST .../plans/{code}/selected-variant` with
   * `{ variantId }` from the selected "3 Best" card. The step only advances once it succeeds;
   * a failure keeps the user on Finalize with the selection intact so they can retry. Plans
   * without a backend `clusterPlanCode` (mock-only) keep the existing step change.
   */
  const ensureClusterApproved = useCallback(async (): Promise<StepResult> => {
    const current = reduxStore.getState().clustering;
    const code = current.draft?.clusterPlanCode;
    if (!code) return { ok: true };
    if (current.finalSignOffStatus === 'loading') return BLOCKED;
    const selected = current.candidates.find((candidate) => candidate.selected);
    if (!selected) return BLOCKED;

    const renames = clusterNameRenames(
      current.clusterPlans[selected.variantId]?.data?.data ?? [],
    );
    if (renames.length > 0) {
      try {
        await updateClusterNames(code, { variantId: selected.variantId, renames });
      } catch (err) {
        return {
          ok: false,
          reason: 'approveFailed',
          message: err instanceof HttpError ? err.message : undefined,
        };
      }
    }

    const result = await dispatch(
      submitFinalSignOff({ clusterPlanCode: code, variantId: selected.variantId }),
    );
    if (submitFinalSignOff.fulfilled.match(result)) return { ok: true };
    if (result.meta.condition) return BLOCKED;
    return {
      ok: false,
      reason: 'approveFailed',
      message: typeof result.payload === 'string' ? result.payload : undefined,
    };
  }, [dispatch, reduxStore]);

  const goToStep = useCallback(
    async (step: WizardStep): Promise<StepResult> => {
      if (!draft || !planId) return BLOCKED;
      const toIdx = WIZARD_STEPS.indexOf(step);
      if (toIdx < 0) return BLOCKED;
      const clustering = reduxStore.getState().clustering;
      const resumeSection = clustering.draft?.resumeSection;
      const alreadyCreated = Boolean(clustering.draft?.clusterPlanCode);

      if (step === 'reviewRun' && draft.currentStep === 'scope') {
        // Checked Reference Periods must cover exactly 100% before anything goes on the wire.
        const current = reduxStore.getState().clustering;
        const total = referenceCoverageTotal(
          current.seasonInfos,
          current.referencePeriodChecked,
          current.referenceCoverage,
          current.selectedPeriodIds,
        );
        if (total !== null && !isReferenceCoverageValid(total)) {
          return { ok: false, reason: 'referenceCoverageInvalid', total };
        }
        const created = await ensureClusterPlanCreated();
        if (!created.ok) return created;
      }
      if (step === 'finalize' && draft.currentStep === 'reviewRun') {
        const ran = await ensureClusterRunCompleted();
        if (!ran.ok) return ran;
      }
      if (step === 'signOff' && draft.currentStep === 'finalize') {
        const approved = await ensureClusterApproved();
        if (!approved.ok) return approved;
      }
      if (step === 'reviewRun') {
        if (!alreadyCreated && !scopeValid) return BLOCKED;
        const needsCreateOrScore =
          !alreadyCreated ||
          clustering.attributeScoreStatus === 'failed' ||
          (!resumeSection && clustering.attributeScoreStatus !== 'succeeded');
        if (needsCreateOrScore) {
          const created = await ensureClusterPlanCreated();
          if (!created.ok) return created;
        }
        const nextKey = scopeFingerprint(draft);
        if (lastReviewedScopeRef.current && lastReviewedScopeRef.current !== nextKey) {
          const confirmed = window.confirm(
            `${t('scope.scopeChangedTitle')}\n\n${t('scope.scopeChangedBody')}`,
          );
          if (!confirmed) return BLOCKED;
          await persist({
            currentStep: step,
            landingSection: 'attributes',
            attributeOverrides: {},
            confirmedAttributeKey: null,
            selectedPeriodId: null,
            selectedPeriodIds: [],
            overriddenPeriodIds: [],
          });
          lastReviewedScopeRef.current = nextKey;
          const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
          if (code) loadStepApis(code, 'reviewRun', 'attributes');
          return { ok: true };
        }
        lastReviewedScopeRef.current = nextKey;
      }

      const latest = reduxStore.getState().clustering;
      const code = latest.draft?.clusterPlanCode;
      const section = landingSectionForStep(
        step,
        latest.draft?.resumeSection ?? resumeSection,
        {
          hasGeneratedVariants:
            Boolean(code) && latest.generatedVariants?.clusterPlanCode === code,
        },
      );
      await persist({ currentStep: step, landingSection: section });
      if (code) loadStepApis(code, step, section);
      return { ok: true };
    },
    [
      draft,
      ensureClusterApproved,
      ensureClusterPlanCreated,
      ensureClusterRunCompleted,
      loadStepApis,
      persist,
      planId,
      reduxStore,
      scopeValid,
      t,
    ],
  );

  const goNext = useCallback(async (): Promise<StepResult> => {
    if (!draft) return BLOCKED;
    const idx = WIZARD_STEPS.indexOf(draft.currentStep);
    const next = WIZARD_STEPS[idx + 1];
    return next ? goToStep(next) : BLOCKED;
  }, [draft, goToStep]);

  const goBack = useCallback(async () => {
    if (!draft) return;
    // A created plan cannot return to Scope. Review & Run is the first step after create.
    if (draft.currentStep === 'reviewRun') return;
    const idx = WIZARD_STEPS.indexOf(draft.currentStep);
    if (idx <= 0) {
      navigate(ROUTES.clustering);
      return;
    }
    await goToStep(WIZARD_STEPS[idx - 1]);
  }, [draft, goToStep, navigate]);

  /**
   * Review & Run → "Confirm and Generate Variant": PUT selected attributes, then POST
   * variants with no body. Blocked when the plan code is missing or a confirm is in flight.
   */
  const confirmAndGenerateVariant = useCallback(async (): Promise<ConfirmResult> => {
    const current = reduxStore.getState().clustering;
    const code = current.draft?.clusterPlanCode;
    if (!code || current.generatedVariantsStatus === 'loading') {
      return { ok: false, reason: 'blocked' };
    }
    const result = await dispatch(confirmAndGenerateVariants(code));
    if (confirmAndGenerateVariants.fulfilled.match(result)) {
      const latest = reduxStore.getState().clustering;
      await persist({
        confirmedAttributeKey: attributeSelectionKey(
          latest.attributes,
          latest.draft?.attributeOverrides,
        ),
      });
      return { ok: true };
    }
    if (result.meta.condition) return { ok: false, reason: 'blocked' };
    const failure = result.payload;
    if (failure && typeof failure === 'object' && 'stage' in failure) {
      return {
        ok: false,
        reason: failure.stage === 'finalise' ? 'finaliseFailed' : 'generateFailed',
        message: failure.message,
      };
    }
    return { ok: false, reason: 'generateFailed' };
  }, [dispatch, persist, reduxStore]);

  /**
   * Custom Variant panel open: GET significance-score only. Does not POST, PUT, or
   * overwrite Review checkbox rows.
   */
  const loadCustomVariantCatalog = useCallback(async (): Promise<CustomVariantResult> => {
    const current = reduxStore.getState().clustering;
    const code = current.draft?.clusterPlanCode;
    if (!code || current.customVariantAttributesStatus === 'loading') {
      return { ok: false, reason: 'blocked' };
    }
    const result = await dispatch(loadCustomVariantAttributes(code));
    if (loadCustomVariantAttributes.fulfilled.match(result)) return { ok: true };
    if (result.meta.condition) return { ok: false, reason: 'blocked' };
    return {
      ok: false,
      reason: 'loadFailed',
      message: typeof result.payload === 'string' ? result.payload : undefined,
    };
  }, [dispatch, reduxStore]);

  /**
   * Custom Variant Save: POST .../variants/custom from the chip selection, then append
   * the mapped card. Closing without Save must not call this.
   */
  const persistCustomVariant = useCallback(
    async (selectedIds: string[]): Promise<CustomVariantResult> => {
      const current = reduxStore.getState().clustering;
      const code = current.draft?.clusterPlanCode;
      if (
        !code ||
        selectedIds.length === 0 ||
        current.customVariantSaveStatus === 'loading' ||
        hasCustomVariant(current.variants)
      ) {
        return { ok: false, reason: 'blocked' };
      }
      const result = await dispatch(
        saveCustomVariant({ clusterPlanCode: code, selectedIds }),
      );
      if (saveCustomVariant.fulfilled.match(result)) return { ok: true };
      if (result.meta.condition) return { ok: false, reason: 'blocked' };
      return {
        ok: false,
        reason: 'saveFailed',
        message: typeof result.payload === 'string' ? result.payload : undefined,
      };
    },
    [dispatch, reduxStore],
  );

  /**
   * Cards from the run API are selected locally — the mock selection endpoint knows nothing
   * about them. Mock candidates keep the existing select → refetch path.
   */
  const chooseCandidate = useCallback(
    async (candidateId: string) => {
      if (!planId) return;
      if (hasLiveClusterRun(reduxStore.getState().clustering)) {
        dispatch(selectRunCandidate(candidateId));
      } else {
        await selectCandidateApi(planId, candidateId);
        await dispatch(fetchCandidates(planId));
      }
      dispatch(patchDraft({ selectedCandidateId: candidateId }));
    },
    [dispatch, planId, reduxStore],
  );

  const ensureFinalizeSelection = useCallback(async () => {
    if (!planId || state.plan?.locked) return;
    const current = reduxStore.getState().clustering;
    const step = current.draft?.currentStep;
    if (step !== 'finalize' && step !== 'signOff') return;

    let candidates: ClusterResultCandidate[];
    if (hasLiveClusterRun(current)) {
      candidates = current.candidates;
    } else {
      const loaded = await dispatch(fetchCandidates(planId));
      if (!fetchCandidates.fulfilled.match(loaded)) return;
      candidates = loaded.payload.candidates;
    }

    if (candidates.some((candidate) => candidate.selected)) return;

    const fromDraft = reduxStore.getState().clustering.draft?.selectedCandidateId;
    const targetId =
      fromDraft && candidates.some((candidate) => candidate.id === fromDraft)
        ? fromDraft
        : candidates[0]?.id;
    if (!targetId) return;

    await chooseCandidate(targetId);
  }, [chooseCandidate, dispatch, planId, reduxStore, state.plan?.locked]);

  useEffect(() => {
    if (!planId || !draft?.planId) return;
    if (draft.currentStep !== 'finalize' && draft.currentStep !== 'signOff') return;
    if (state.plan?.locked) return;
    void ensureFinalizeSelection();
  }, [
    draft?.currentStep,
    draft?.planId,
    ensureFinalizeSelection,
    planId,
    state.candidates,
    state.plan?.locked,
  ]);

  const loadAttributeProductList = useCallback(
    async (variantId: string) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      await dispatch(fetchAttributeProductList({ clusterPlanCode: code, variantId }));
    },
    [dispatch, reduxStore],
  );

  /**
   * Attribute Grades chart: `POST .../attributes/info` for the selected attribute.
   * Cached per variantId and attribute.
   */
  const loadAttributeInfo = useCallback(
    async (variantId: string, attribute: string) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      await dispatch(fetchAttributeInfo({ clusterPlanCode: code, variantId, attribute }));
    },
    [dispatch, reduxStore],
  );

  /**
   * Attribute Grades AI strip: `POST /v1/summarize` (`cardType: 'cluster_attribute'`) built
   * from the plotted `attributes/info` chart. Cached per variantId + attribute; `force`
   * regenerates.
   */
  const loadAttributeGradesSummary = useCallback(
    (variantId: string, attribute: string, options?: { force?: boolean }) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      void dispatch(
        fetchAttributeGradesSummary({
          clusterPlanCode: code,
          variantId,
          attribute,
          force: options?.force,
        }),
      );
    },
    [dispatch, reduxStore],
  );

  /**
   * Store Assignments panel: `POST .../plans/{code}/store_assignments` with `{ variantId }`
   * for one "3 Best" variant, keyed off the draft's `clusterPlanCode`. No code → nothing
   * to fetch.
   */
  const loadStoreAssignments = useCallback(
    async (variantId: string) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      await dispatch(fetchStoreAssignments({ clusterPlanCode: code, variantId }));
    },
    [dispatch, reduxStore],
  );

  /**
   * Performance Clusters scatter: `POST .../performance/info` with `{ variantId, clusterPlanCode }`
   * for the selected "3 Best" card. No code → nothing to fetch. Cached per variantId.
   */
  const loadPerformanceInfo = useCallback(
    async (variantId: string) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      await dispatch(fetchPerformanceInfo({ clusterPlanCode: code, variantId }));
    },
    [dispatch, reduxStore],
  );

  /**
   * Cluster Summary table: `POST .../get-cluster-plans` with `{ variantId, clusterPlanCode }`
   * for the selected "3 Best" card. Cached per variantId.
   */
  const loadClusterPlans = useCallback(
    async (variantId: string) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      await dispatch(fetchClusterPlans({ clusterPlanCode: code, variantId }));
    },
    [dispatch, reduxStore],
  );

  /**
   * Cluster Plans AI strip: `POST /v1/summarize` (`cardType: 'cluster_performance'`) built
   * from the selected card's cluster-plans rows. Cached per variantId; `force` regenerates.
   */
  const loadClusterPerformanceSummary = useCallback(
    (variantId: string, options?: { force?: boolean }) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      void dispatch(
        fetchClusterPerformanceSummary({
          clusterPlanCode: code,
          variantId,
          force: options?.force,
        }),
      );
    },
    [dispatch, reduxStore],
  );

  /**
   * Full KPI Breakdown: `POST .../kpi-breakdown` with `{ variantId, clusterPlanCode }`
   * for the selected "3 Best" card. Cached per variantId.
   */
  const loadKpiBreakdown = useCallback(
    async (variantId: string) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      await dispatch(fetchKpiBreakdown({ clusterPlanCode: code, variantId }));
    },
    [dispatch, reduxStore],
  );

  /**
   * Persist a store's new cluster, then force-reload that variant's assignments so the
   * panel badges and counts match the server.
   */
  const moveStoreAssignment = useCallback(
    async (variantId: string, storeCode: string, cluster: StoreAssignmentCluster) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) throw new Error('clusterPlanCode is required');
      await moveStores(code, {
        variantId,
        moves: [storeMoveFromCluster(storeCode, cluster)],
      });
      await dispatch(
        fetchStoreAssignments({ clusterPlanCode: code, variantId, force: true }),
      ).unwrap();
    },
    [dispatch, reduxStore],
  );

  const rename = useCallback(
    async (clusterId: string, name: string) => {
      if (!planId) return;
      await renameCluster(planId, clusterId, name);
    },
    [planId],
  );

  const togglePin = useCallback(
    async (storeId: string, clusterId: string, pinned: boolean) => {
      if (!planId) return;
      if (pinned) await unpinStore(planId, storeId);
      else await pinStore(planId, storeId, clusterId);
    },
    [planId],
  );

  /**
   * Gate 2 Reject: `POST .../plans/state-transition/{code}` with
   * `{ section: 'gate_2_approval', decision: 'reject' }`. The approval is void and the wizard
   * returns to Finalize so another card can be chosen. Approve is a separate save call.
   */
  const decideGate2 = useCallback(
    async (decision: Gate2Decision): Promise<StepResult> => {
      const current = reduxStore.getState().clustering;
      const code = current.draft?.clusterPlanCode;
      if (!planId || !code) return BLOCKED;

      const result = await dispatch(
        submitGate2Decision({
          clusterPlanCode: code,
          decision,
          actionedBy: current.approver?.email ?? null,
        }),
      );
      if (submitGate2Decision.fulfilled.match(result)) {
        if (decision === 'reject') await persist({ currentStep: 'finalize' });
        return { ok: true };
      }
      if (result.meta.condition) return BLOCKED;
      return {
        ok: false,
        reason: 'gate2DecisionFailed',
        message: typeof result.payload === 'string' ? result.payload : undefined,
      };
    },
    [dispatch, persist, planId, reduxStore],
  );

  const reject = useCallback(() => decideGate2('reject'), [decideGate2]);

  /**
   * Sign-Off: `GET /v1/auth/me` for the Gate 3 approver card.
   * The step effect calls this with no argument so a succeeded fetch is not repeated.
   * Retry passes `{ force: true }`.
   */
  const loadApprover = useCallback((options?: { force?: boolean }) => {
    void dispatch(fetchApprover(options?.force ? { force: true } : undefined));
  }, [dispatch]);

  /** Finalize "3 Best" AI narration: `POST /v1/summarize` for the plan in the wizard. */
  const loadVariantSummary = useCallback(
    (options?: { force?: boolean }) => {
      const code = reduxStore.getState().clustering.draft?.clusterPlanCode;
      if (!code) return;
      void dispatch(
        fetchClusterVariantsSummary({ clusterPlanCode: code, force: options?.force }),
      );
    },
    [dispatch, reduxStore],
  );

  /** The variant to approve: selected "3 Best" card, GET selected-variant, else `/approved`. */
  const approvedVariantId = useCallback((): string | null => {
    const current = reduxStore.getState().clustering;
    const selected = current.candidates.find((candidate) => candidate.selected);
    if (selected) return selected.variantId;
    if (hasLiveSelectedVariant(current))
      return current.selectedVariant?.data.variantId ?? null;
    return hasLiveClusterApproval(current)
      ? (current.clusterApproval?.data.variantId ?? null)
      : null;
  }, [reduxStore]);

  /**
   * Gate 2 Approve: the former footer Save, `POST .../plans/{code}/approved` with the
   * selected variant. The wizard stays on Sign-Off; Go To Dashboard is the way out.
   */
  const approve = useCallback(async (): Promise<StepResult> => {
    const current = reduxStore.getState().clustering;
    const code = current.draft?.clusterPlanCode;
    if (!planId || !code) return BLOCKED;
    const variantId = approvedVariantId();
    if (!variantId) return BLOCKED;

    const result = await dispatch(
      submitFinalise({
        clusterPlanCode: code,
        variantId,
        actionedBy: current.approver?.email ?? null,
      }),
    );
    if (submitFinalise.fulfilled.match(result)) return { ok: true };
    if (result.meta.condition) return BLOCKED;
    return {
      ok: false,
      reason: 'signOffFailed',
      message: typeof result.payload === 'string' ? result.payload : undefined,
    };
  }, [approvedVariantId, dispatch, planId, reduxStore]);

  const updateVariants = useCallback(
    (variants: Variant[]) => {
      dispatch(setVariants(variants));
    },
    [dispatch],
  );

  const leaveWizard = useCallback(() => {
    dispatch(resetWizard());
    navigate(ROUTES.clustering);
  }, [dispatch, navigate]);

  /**
   * Sign-Off footer "Save": `POST .../plans/{code}/approved` with the selected variantId,
   * then gate 3 audit + plan lock, then leave for All Cluster Plans.
   */
  const submitSignOff = useCallback(async (): Promise<StepResult> => {
    const current = reduxStore.getState().clustering;
    const code = current.draft?.clusterPlanCode;
    if (!planId || !code) return BLOCKED;
    const variantId = approvedVariantId();
    if (!variantId) return BLOCKED;

    const result = await dispatch(
      submitFinalise({
        clusterPlanCode: code,
        variantId,
        actionedBy: current.approver?.email ?? null,
      }),
    );
    if (submitFinalise.fulfilled.match(result)) {
      leaveWizard();
      return { ok: true };
    }
    if (result.meta.condition) return BLOCKED;
    return {
      ok: false,
      reason: 'signOffFailed',
      message: typeof result.payload === 'string' ? result.payload : undefined,
    };
  }, [approvedVariantId, dispatch, leaveWizard, planId, reduxStore]);

  /**
   * Sign-Off footer "Save": `POST .../plans/{code}/approved` with the selected variantId and,
   * only once it succeeds, leave for All Cluster Plans (which loads `GET /plans` as before).
   * Plans without a backend `clusterPlanCode` (mock-only) keep leaving directly.
   */
  const saveAndLeave = useCallback(async (): Promise<StepResult> => {
    const current = reduxStore.getState().clustering;
    const code = current.draft?.clusterPlanCode;
    if (!code) {
      leaveWizard();
      return { ok: true };
    }
    if (current.clusterApprovalStatus === 'loading') return BLOCKED;
    const variantId = approvedVariantId();
    if (!variantId) return { ok: false, reason: 'approveFailed' };

    const result = await dispatch(
      submitClusterApproval({ clusterPlanCode: code, variantId }),
    );
    if (submitClusterApproval.fulfilled.match(result)) {
      leaveWizard();
      return { ok: true };
    }
    if (result.meta.condition) return BLOCKED;
    return {
      ok: false,
      reason: 'approveFailed',
      message: typeof result.payload === 'string' ? result.payload : undefined,
    };
  }, [approvedVariantId, dispatch, leaveWizard, reduxStore]);

  const isNameError = useCallback(
    async (name: string) => {
      try {
        return await checkName(name);
      } catch (err) {
        if (err instanceof HttpError && err.body?.error.code === 'NAME_TAKEN')
          return true;
        return false;
      }
    },
    [checkName],
  );

  return {
    ...state,
    planId,
    scopeValid,
    /** True for the whole Scope submit: create plan → POST significance-score. */
    creating:
      state.createStatus === 'loading' || state.attributeScoreStatus === 'loading',
    /** True while "Confirm and Generate Variant" runs its PUT → POST chain. */
    confirming: state.generatedVariantsStatus === 'loading',
    /**
     * Generated variants are on screen for a different checkbox selection than the one
     * that produced them. Confirm stays enabled and Attribute Picks stays hidden.
     */
    attributeSelectionStale,
    /** True while "Finalise Cluster" runs its PUT confirm → POST runs chain. */
    running: state.clusterRunStatus === 'loading',
    /** True while "Final Sign Off" waits on `POST .../plans/{code}/selected-variant`. */
    approving: state.finalSignOffStatus === 'loading',
    /** True while "Save" waits on `POST .../plans/{code}/approved`. */
    saving: state.clusterApprovalStatus === 'loading',
    /** True while Gate 2 Approve / Reject waits on state-transition. */
    decidingGate2: state.gate2DecisionStatus === 'loading',
    /** True while Sign-Off footer Save waits on `POST .../plans/{code}/approved`. */
    signingOff: state.finaliseStatus === 'loading',
    /** Gate 2 winner from `GET .../selected-variant` for this plan. */
    approval: hasLiveSelectedVariant(state) ? (state.selectedVariant?.data ?? null) : null,
    canWrite: can('clustering:write'),
    canApprove: can('clustering:approve'),
    canSignOff: can('clustering:signoff'),
    persist,
    setHierarchyLevels,
    resumeError,
    retryResumeLoad,
    /** Fetch the APIs for one step/section — shared by resume and the agent-driven flow. */
    loadStepApis,
    goToStep,
    goNext,
    goBack,
    confirmAndGenerateVariant,
    loadCustomVariantAttributes: loadCustomVariantCatalog,
    saveCustomVariant: persistCustomVariant,
    chooseCandidate,
    loadAttributeProductList,
    loadAttributeInfo,
    loadAttributeGradesSummary,
    loadStoreAssignments,
    loadPerformanceInfo,
    loadClusterPlans,
    loadClusterPerformanceSummary,
    loadKpiBreakdown,
    loadVariantSummary,
    moveStoreAssignment,
    rename,
    togglePin,
    approve,
    reject,
    loadApprover,
    submitSignOff,
    updateVariants,
    ensureFinalizeSelection,
    leaveWizard,
    saveAndLeave,
    isNameError,
  };
}

/** Everything `useClusterWizard` returns — shared by the Set It Up page and the agentic mirror. */
export type ClusterWizardApi = ReturnType<typeof useClusterWizard>;
