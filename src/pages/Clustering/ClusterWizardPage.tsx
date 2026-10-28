import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@app/store';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { useSetBreadcrumbs } from '@app/layouts';
import { useToast } from '@shared/components/primitives/Toast';
import { fetchSeasons } from '@modules/planning';
import { ClusterWizardShell } from '@modules/clustering/components/ClusterWizardShell';
import { ClusterWizardStepContent } from '@modules/clustering/components/ClusterWizardStepContent';
import { CustomVariantPanel } from '@modules/clustering/components/CustomVariantPanel';
import { ScopeStep } from '@modules/clustering/components/steps/ScopeStep';
import {
  useClusterWizard,
  type ConfirmResult,
  type CustomVariantResult,
  type StepResult,
} from '@modules/clustering/hooks/useClusterWizard';
import { toSeasonOptions } from '@modules/clustering/services/seasonOptions';
import { activeVariantCount } from '@modules/clustering/services/variantMath';
import {
  clearSeasonInfos,
  fetchSeasonInfos,
  setReferenceCoverage,
  setReferencePeriodChecked,
} from '@modules/clustering/store/clusteringSlice';
import type { Variant } from '@modules/clustering/types';

export function ClusterWizardPage() {
  const { t } = useTranslation(['clustering', 'common']);
  const reduxStore = useStore<RootState>();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const wizard = useClusterWizard();
  const [nameError, setNameError] = useState<string | null>(null);
  const [customVariantOpen, setCustomVariantOpen] = useState(false);

  // Seasons come from the shared planning slice (`/plans/seasons`). Reuse the
  // response the All Plans flow already populated; only fetch when it has never
  // been loaded. `fetchSeasons` has a `condition` guard, so a request already in
  // flight (or one that succeeded) is never duplicated regardless of entry point.
  const seasonsData = useAppSelector((s) => s.planning.seasonsData);
  const seasonsStatus = useAppSelector((s) => s.planning.statuses.seasons);

  useEffect(() => {
    if (seasonsStatus === 'idle') void dispatch(fetchSeasons());
  }, [dispatch, seasonsStatus]);

  const seasonOptions = useMemo(() => toSeasonOptions(seasonsData), [seasonsData]);

  const step = wizard.draft?.currentStep ?? 'scope';
  const persist = wizard.persist;
  const loadApprover = wizard.loadApprover;
  const leaveWizard = wizard.leaveWizard;
  const resumeError = wizard.resumeError;
  const landingSection = wizard.draft?.landingSection;

  useEffect(() => {
    if (!resumeError) return;
    showToast({
      message: t(
        resumeError === 'unknownSubstatus'
          ? 'clustering:errors.unknownSubstatus'
          : 'clustering:errors.planNotFound',
      ),
      variant: 'error',
    });
    leaveWizard();
  }, [leaveWizard, resumeError, showToast, t]);

  useEffect(() => {
    if (landingSection !== 'attributes' && landingSection !== 'variants') return;
    if (wizard.attributeScoreStatus !== 'failed') return;
    showToast({
      message: t('clustering:errors.attributeScoreFailed'),
      variant: 'error',
    });
  }, [landingSection, showToast, t, wizard.attributeScoreStatus]);

  useEffect(() => {
    if (landingSection !== 'variants') return;
    if (wizard.generatedVariantsStatus !== 'failed') return;
    showToast({
      message: t('clustering:errors.generateVariantFailed'),
      variant: 'error',
    });
  }, [landingSection, showToast, t, wizard.generatedVariantsStatus]);

  useEffect(() => {
    if (landingSection !== 'candidates') return;
    if (wizard.clusterRunStatus !== 'failed') return;
    showToast({
      message: t('clustering:errors.runFailed'),
      variant: 'error',
    });
  }, [landingSection, showToast, t, wizard.clusterRunStatus]);

  useEffect(() => {
    if (step !== 'signOff') return;
    if (wizard.selectedVariantStatus !== 'failed') return;
    showToast({
      message: t('clustering:errors.selectedVariantFailed'),
      variant: 'error',
    });
  }, [showToast, step, t, wizard.selectedVariantStatus]);

  // Scope → Reference Period. The draft stores the season as its stringified `seasonCode`;
  // resolve it back to the `/plans/seasons` entry so the request carries the backend's own
  // `seasonCode` + raw `name`. Nothing is sent while no season is selected.
  const selectedSeasonId = wizard.draft?.seasonId ?? null;
  const selectedSeason = useMemo(() => {
    if (!selectedSeasonId || !Array.isArray(seasonsData)) return null;
    for (const year of seasonsData) {
      const match = (year.seasons ?? []).find(
        (s) => String(s.seasonCode) === selectedSeasonId,
      );
      if (match) return match;
    }
    return null;
  }, [seasonsData, selectedSeasonId]);

  const loadSeasonInfos = useCallback(() => {
    if (!selectedSeason) return;
    void dispatch(
      fetchSeasonInfos({
        seasonCode: selectedSeason.seasonCode,
        name: selectedSeason.name,
      }),
    );
  }, [dispatch, selectedSeason]);

  useEffect(() => {
    if (step !== 'scope') return;
    if (!selectedSeasonId) {
      dispatch(clearSeasonInfos());
      return;
    }
    // Changing season re-fires with the new code; the thunk's `condition` dedupes repeats.
    loadSeasonInfos();
  }, [dispatch, step, selectedSeasonId, loadSeasonInfos]);

  // Sign-Off: fetch the authenticated user (`GET /v1/auth/me`) the moment the step becomes
  // active, so the Gate 3 approver is on screen before footer Save. Keyed on the step
  // only — re-renders and unrelated state changes do not re-fire it.
  useEffect(() => {
    if (step === 'signOff') loadApprover();
  }, [step, loadApprover]);

  useSetBreadcrumbs([
    {
      type: 'home',
      label: t('common:breadcrumb.home'),
      onClick: () => {
        window.location.href = `${window.location.origin}/home`;
      },
    },
    {
      type: 'clustering',
      label: t('clustering:breadcrumb.locationClustering'),
      onClick: () => wizard.leaveWizard(),
    },
    { type: 'create', label: t('clustering:create.title') },
  ]);

  const chooseCandidate = wizard.chooseCandidate;

  const onSelectCandidate = useCallback(
    (id: string) => {
      void chooseCandidate(id);
    },
    [chooseCandidate],
  );

  const onNameBlur = useCallback(
    async (name: string) => {
      const taken = await wizard.isNameError(name);
      setNameError(taken ? t('clustering:scope.nameTaken') : null);
    },
    [t, wizard],
  );

  const toggleAttribute = (id: string, selected: boolean) => {
    const { attributes, draft } = reduxStore.getState().clustering;
    const target = attributes.find((attr) => attr.id === id);
    if (!target || target.noData) return;
    const current = Object.fromEntries(
      attributes.map((attr) => [
        attr.id,
        draft?.attributeOverrides[attr.id] ?? attr.userSelected,
      ]),
    );
    void wizard.persist({
      attributeOverrides: { ...current, [id]: selected },
    });
  };

  // "Confirm and Generate Variant": PUT final attributes, then POST variants. Either hop
  // failing keeps the step as it is (Attribute Picks stays hidden, selections intact) and
  // toasts the backend message or a generic one for that hop; Confirm is re-enabled to retry.
  const confirmAndGenerateVariant = wizard.confirmAndGenerateVariant;
  const onConfirm = async () => {
    const result: ConfirmResult = await confirmAndGenerateVariant();
    if (result.ok || result.reason === 'blocked') return;
    const fallback =
      result.reason === 'finaliseFailed'
        ? t(
            'clustering:errors.finalAttributesFailed',
            'Failed to save the selected attributes. Please try again.',
          )
        : t(
            'clustering:errors.generateVariantFailed',
            'Failed to generate the variant. Please try again.',
          );
    showToast({ message: result.message ?? fallback, variant: 'error' });
  };

  const updateVariant = (id: string, removed: boolean) => {
    const next: Variant[] = wizard.variants.map((variant) =>
      variant.id === id ? { ...variant, removed } : variant,
    );
    void wizard.updateVariants(next);
  };

  const setAllVariantsRemoved = (removed: boolean) => {
    void wizard.updateVariants(
      wizard.variants.map((variant) => ({ ...variant, removed })),
    );
  };

  const loadCustomVariantAttributes = wizard.loadCustomVariantAttributes;
  const onOpenCustomVariant = async () => {
    setCustomVariantOpen(true);
    const result: CustomVariantResult = await loadCustomVariantAttributes();
    if (result.ok || result.reason === 'blocked') return;
    showToast({
      message:
        result.message ??
        t(
          'clustering:errors.customAttributesFailed',
          'Failed to load attributes for a custom variant. Please try again.',
        ),
      variant: 'error',
    });
  };

  const persistCustomVariant = wizard.saveCustomVariant;
  const onSaveCustomVariant = async (selectedIds: string[]) => {
    const result: CustomVariantResult = await persistCustomVariant(selectedIds);
    if (result.ok) {
      setCustomVariantOpen(false);
      return;
    }
    if (result.reason === 'blocked') return;
    showToast({
      message:
        result.message ??
        t(
          'clustering:errors.customVariantFailed',
          'Failed to save the custom variant. Please try again.',
        ),
      variant: 'error',
    });
  };

  if (!wizard.draft || !wizard.catalogues) {
    return <p role="status">{t('clustering:states.loading')}</p>;
  }

  const nextDisabled =
    step === 'scope'
      ? !wizard.scopeValid || Boolean(nameError) || wizard.creating
      : step === 'reviewRun'
        ? wizard.generatedVariants?.clusterPlanCode !== wizard.draft.clusterPlanCode ||
          wizard.attributeSelectionStale ||
          wizard.running ||
          activeVariantCount(wizard.variants) < 1
        : step === 'finalize'
          ? !wizard.candidates.some((c) => c.selected) || wizard.approving
          : false;

  // Scope → Review & Run creates the plan, then POSTs significance-score; Review & Run →
  // Finalise PUTs kept variant ids then POSTs the clustering run. If a hop fails the user
  // stays on the current step with the draft intact and sees the backend message (or a
  // generic one for that hop) as a toast.
  const advance = async (transition: () => Promise<StepResult>) => {
    const result = await transition();
    if (result.ok || result.reason === 'blocked') return;
    if (result.reason === 'referenceCoverageInvalid') {
      showToast({
        message: t('clustering:errors.referenceCoverageTotal', { total: result.total }),
        variant: 'error',
      });
      return;
    }
    const fallback =
      result.reason === 'scoreFailed'
        ? t(
            'clustering:errors.attributeScoreFailed',
            'Failed to load attribute significance scores. Please try again.',
          )
        : result.reason === 'confirmVariantsFailed'
          ? t(
              'clustering:errors.confirmVariantsFailed',
              'Failed to confirm the selected variants. Please try again.',
            )
          : result.reason === 'runFailed'
            ? t(
                'clustering:errors.runFailed',
                'Failed to run clustering for the selected variants. Please try again.',
              )
            : result.reason === 'approveFailed'
              ? t(
                  'clustering:errors.approveFailed',
                  'Failed to sign off the selected variant. Please try again.',
                )
              : result.reason === 'gate2DecisionFailed'
                ? t(
                    'clustering:errors.gate2DecisionFailed',
                    'Failed to record the Gate 2 decision. Please try again.',
                  )
                : result.reason === 'signOffFailed'
                  ? t(
                      'clustering:errors.signOffFailed',
                      'Failed to sign off and save the cluster plan. Please try again.',
                    )
                  : t(
                      'clustering:errors.createFailed',
                      'Failed to create cluster plan. Please try again.',
                    );
    showToast({ message: result.message ?? fallback, variant: 'error' });
  };

  const onNext = () => {
    if (step === 'signOff') {
      wizard.leaveWizard();
      return;
    }
    if (wizard.creating || wizard.running || wizard.approving) return;
    void advance(() => wizard.goNext());
  };

  return (
    <>
      <ClusterWizardShell
        step={step}
        onStepSelect={(next) => void advance(() => wizard.goToStep(next))}
        onBack={() => void wizard.goBack()}
        onNext={onNext}
        nextDisabled={nextDisabled}
        nextLoading={
          (step === 'scope' && wizard.creating) ||
          (step === 'reviewRun' && wizard.running) ||
          (step === 'finalize' && wizard.approving)
        }
      >
        {step === 'scope' && (
          <ScopeStep
            draft={wizard.draft}
            catalogues={{
              ...wizard.catalogues,
              seasons: seasonOptions,
            }}
            seasonsLoading={seasonsStatus === 'loading' || seasonsStatus === 'idle'}
            // Only while the selected season resolves to a `/plans/seasons` entry (or the
            // seasons are still loading); a stale, unresolvable id shows no Reference Period.
            referencePeriods={
              selectedSeason || seasonsStatus === 'loading' || seasonsStatus === 'idle'
                ? {
                    periods: wizard.seasonInfos,
                    status: wizard.seasonInfosStatus,
                    selectedKeys: wizard.selectedPeriodIds,
                    coverage: wizard.referenceCoverage,
                    checked: wizard.referencePeriodChecked,
                    onSelectionChange: (selectedPeriodIds) =>
                      void persist({ selectedPeriodIds }),
                    onCheckedChange: (key, checked) =>
                      dispatch(setReferencePeriodChecked({ key, checked })),
                    onCoverageChange: (key, value) =>
                      dispatch(setReferenceCoverage({ key, value })),
                    onRetry: loadSeasonInfos,
                  }
                : undefined
            }
            nameError={nameError}
            onNameBlur={(name) => void onNameBlur(name)}
            onChange={(patch) => void wizard.persist(patch)}
            onHierarchyLevelsChange={wizard.setHierarchyLevels}
          />
        )}
        {/* Review & Run, Finalize and Sign-Off share one mapped content component. */}
        {step !== 'scope' && (
          <ClusterWizardStepContent
            step={step}
            wizard={wizard}
            actions={{
              onToggleAttribute: toggleAttribute,
              onConfirm: () => void onConfirm(),
              onRemoveVariant: (id) => updateVariant(id, true),
              onRestoreVariant: (id) => updateVariant(id, false),
              onRemoveAll: () => setAllVariantsRemoved(true),
              onRestoreAll: () => setAllVariantsRemoved(false),
              onOpenCustomVariant: () => void onOpenCustomVariant(),
              onSelectCandidate,
              onApprove: () => void advance(wizard.approve),
              onReject: () => void advance(wizard.reject),
            }}
          />
        )}
      </ClusterWizardShell>
      <CustomVariantPanel
        open={customVariantOpen}
        attributes={wizard.customVariantAttributes}
        loading={wizard.customVariantAttributesStatus === 'loading'}
        saving={wizard.customVariantSaveStatus === 'loading'}
        loadFailed={wizard.customVariantAttributesStatus === 'failed'}
        onClose={() => setCustomVariantOpen(false)}
        onSave={(selectedIds) => void onSaveCustomVariant(selectedIds)}
      />
    </>
  );
}
