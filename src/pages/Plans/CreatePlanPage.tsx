import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { StepperStep } from '@shared/components/vendor/impact-ui';
import { WizardFlow } from '@shared/components/wizard';
import { useToast } from '@shared/components/primitives/Toast';
import { useSetBreadcrumbs } from '@app/layouts';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { ROUTES } from '@config/routes';
import {
  ClusteringRunModeStep,
  NameCalendarStep,
  ProductScopeStep,
  ReviewCreateStep,
  WIZARD_STEPS,
  fetchPlans,
  fetchReferenceData,
  fetchSeasons,
  invalidatePlans,
  useCreatePlanWizard,
  type WizardStep,
} from '@modules/planning';

const CTA_KEY: Record<WizardStep, string> = {
  nameCalendar: 'actions.goToProductScope',
  productScope: 'actions.goToClustering',
  clusteringRunMode: 'actions.goToReview',
  reviewCreate: 'actions.done',
};

const BACK_KEY: Record<WizardStep, string> = {
  nameCalendar: 'createPlan.backToPlans',
  productScope: 'actions.backToNameCalendar',
  clusteringRunMode: 'actions.backToProductScope',
  reviewCreate: 'actions.backToClustering',
};

export function CreatePlanPage() {
  const { t } = useTranslation(['planning', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { showToast } = useToast();

  useSetBreadcrumbs([
    {
      type: 'home',
      label: t('common:breadcrumb.home'),
      onClick: () => {
        window.location.href = window.location.origin + '/home';
      },
    },
    {
      type: 'allPlans',
      label: t('planning:allPlans.title'),
      onClick: () => navigate(ROUTES.plans),
    },
    { type: 'createPlan', label: t('planning:createPlan.title') },
  ]);

  const resumePlanId = (location.state as { resumePlanId?: string } | null)?.resumePlanId;
  const refDataStatus = useAppSelector((s) => s.planning.statuses.refData);
  const seasonsData = useAppSelector((s) => s.planning.seasonsData);
  const seasonsStatus = useAppSelector((s) => s.planning.statuses.seasons);

  const {
    draft,
    referenceData,
    currentStep,
    existingNames,
    canAdvance,
    canCreate,
    creating,
    createError,
    pipelinePreview,
    update,
    goNext,
    goBack,
    goToStep,
    submit,
  } = useCreatePlanWizard({ resumePlanId });

  useEffect(() => {
    if (refDataStatus === 'idle') void dispatch(fetchReferenceData());
  }, [dispatch, refDataStatus]);

  useEffect(() => {
    if (seasonsStatus === 'idle') void dispatch(fetchSeasons());
  }, [dispatch, seasonsStatus]);

  if (!draft) return null;

  const isFirst = currentStep === 'nameCalendar';
  const isReview = currentStep === 'reviewCreate';
  const advanceDisabled = isReview ? !canCreate || creating : !canAdvance;

  const activeStepIndex = WIZARD_STEPS.indexOf(currentStep);

  const stepperSteps: StepperStep[] = WIZARD_STEPS.map((step) => ({
    label: t(`steps.${step}.title`),
  }));

  const handleStepClick = (index: number) => {
    goToStep(WIZARD_STEPS[index]);
  };

  const handleAdvance = async () => {
    if (isReview) {
      if (!canCreate || creating) return;
      const result = await submit();
      if (result.ok) {
        showToast({
          message: t('createPlan.successMessage', 'Plan created successfully!'),
          variant: 'success',
        });
        dispatch(invalidatePlans());
        void dispatch(fetchPlans());
        navigate(ROUTES.plans);
      } else {
        showToast({
          message:
            result.message ??
            t('errors.createFailed', 'Failed to create plan. Please try again.'),
          variant: 'error',
        });
      }
      return;
    }
    if (!canAdvance) return;
    goNext();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'nameCalendar':
        return (
          <NameCalendarStep
            draft={draft}
            seasonsData={seasonsData}
            seasonsStatus={seasonsStatus}
            existingNames={existingNames}
            update={update}
          />
        );
      case 'productScope':
        return <ProductScopeStep draft={draft} update={update} />;
      case 'clusteringRunMode':
        return (
          <ClusteringRunModeStep
            draft={draft}
            scenarios={referenceData.clusteringScenarios}
            update={update}
          />
        );
      case 'reviewCreate':
        return (
          <ReviewCreateStep
            draft={draft}
            referenceData={referenceData}
            seasonsData={seasonsData}
            pipelinePreview={pipelinePreview}
            createError={createError}
            onEditStep={goToStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardFlow
      title={t('createPlan.title')}
      description={t('createPlan.subtitle')}
      steps={stepperSteps}
      activeStep={activeStepIndex}
      onStepSelect={handleStepClick}
      prevButtonProps={{
        children: t(BACK_KEY[currentStep]),
        onClick: () => (isFirst ? navigate(ROUTES.plans) : goBack()),
      }}
      nextButtonProps={{
        children: t(CTA_KEY[currentStep]),
        onClick: handleAdvance,
        disabled: advanceDisabled,
        loading: creating,
      }}
    >
      {renderStepContent()}
    </WizardFlow>
  );
}
