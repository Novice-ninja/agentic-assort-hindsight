import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSetBreadcrumbs } from '@app/layouts';
import { ROUTES } from '@config/routes';
import { useToast } from '@shared/components/primitives/Toast';
import { WizardFlow } from '@shared/components/wizard';
import { AgentProcessingToast } from '@modules/clustering/components/AgentProcessingToast';
import { ClusterWizardStepContent } from '@modules/clustering/components/ClusterWizardStepContent';
import type { ClusterWizardStepActions } from '@modules/clustering/components/ClusterWizardStepContent';
import { DescribeScopeStep } from '@modules/clustering/components/DescribeScopeStep';
import agentFlow from '@modules/clustering/components/agentFlow.module.css';
import { describeGlowRightInset } from '@modules/clustering/components/describeGlowInset';
import { useAgentPlanStatus, useClusterWizard } from '@modules/clustering/hooks';
import type { ClusterPlanLandingSection, WizardStep } from '@modules/clustering/types';
import { WIZARD_STEPS } from '@modules/clustering/types';

/** Step ids for the agentic flow — the Set It Up steps with Describe & Scope in place of Scope. */
export const AGENTIC_WIZARD_STEPS = [
  'describeScope',
  'reviewRun',
  'finalize',
  'signOff',
] as const;

const NEXT_KEY: Record<WizardStep, string> = {
  scope: 'footer.goToReview',
  reviewRun: 'footer.finaliseCluster',
  finalize: 'footer.finalSignOff',
  signOff: 'footer.goToDashboard',
};

const noop = () => undefined;

/**
 * Agentic Create Cluster Plan. Describe & Scope hands the query to the agent; from then on
 * every socket frame's `meta.substatus` moves the wizard to the same step/section the Set It
 * Up resume would open and that section renders read-only from the same APIs — the agent
 * (and the chat's action buttons) drive every transition.
 */
export function DescribeClusterPlanPage() {
  const { t } = useTranslation(['clustering', 'common']);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const wizard = useClusterWizard();
  const agent = useAgentPlanStatus({ loadStepApis: wizard.loadStepApis });
  const [toastDismissed, setToastDismissed] = useState(false);

  const backToPlans = useCallback(() => navigate(ROUTES.clustering), [navigate]);

  const draft = wizard.draft;
  const step: WizardStep = agent.landing ? (draft?.currentStep ?? 'scope') : 'scope';
  const landingSection: ClusterPlanLandingSection | undefined = draft?.landingSection;
  const processing = agent.processing;

  // A new turn re-arms the toast so the user sees it again for the next section.
  useEffect(() => {
    if (processing) setToastDismissed(false);
  }, [processing]);

  const loadApprover = wizard.loadApprover;
  useEffect(() => {
    if (step === 'signOff') loadApprover();
  }, [step, loadApprover]);

  const leaveWizard = wizard.leaveWizard;
  const leftForMissingPlan = useRef(false);
  useEffect(() => {
    if (!agent.planLookupFailed || leftForMissingPlan.current) return;
    leftForMissingPlan.current = true;
    showToast({ message: t('clustering:errors.planNotFound'), variant: 'error' });
    leaveWizard();
  }, [agent.planLookupFailed, leaveWizard, showToast, t]);

  const landedSection = agent.landing?.section;
  const scoreFailed =
    (landedSection === 'attributes' || landedSection === 'variants') &&
    wizard.attributeScoreStatus === 'failed';
  const variantsFailed =
    landedSection === 'variants' && wizard.generatedVariantsStatus === 'failed';
  const runFailed = landedSection === 'candidates' && wizard.clusterRunStatus === 'failed';
  const toastedScore = useRef(false);
  const toastedVariants = useRef(false);
  const toastedRun = useRef(false);

  useEffect(() => {
    if (!scoreFailed) {
      toastedScore.current = false;
      return;
    }
    if (toastedScore.current) return;
    toastedScore.current = true;
    showToast({ message: t('clustering:errors.attributeScoreFailed'), variant: 'error' });
  }, [scoreFailed, showToast, t]);

  useEffect(() => {
    if (!variantsFailed) {
      toastedVariants.current = false;
      return;
    }
    if (toastedVariants.current) return;
    toastedVariants.current = true;
    showToast({ message: t('clustering:errors.generateVariantFailed'), variant: 'error' });
  }, [showToast, t, variantsFailed]);

  useEffect(() => {
    if (!runFailed) {
      toastedRun.current = false;
      return;
    }
    if (toastedRun.current) return;
    toastedRun.current = true;
    showToast({ message: t('clustering:errors.runFailed'), variant: 'error' });
  }, [runFailed, showToast, t]);

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
      onClick: backToPlans,
    },
    { type: 'create', label: t('clustering:create.title') },
  ]);

  const chooseCandidate = wizard.chooseCandidate;
  const actions = useMemo<ClusterWizardStepActions>(
    () => ({
      onToggleAttribute: noop,
      onConfirm: noop,
      onRemoveVariant: noop,
      onRestoreVariant: noop,
      onRemoveAll: noop,
      onRestoreAll: noop,
      onOpenCustomVariant: noop,
      // Read-safe: selects locally and loads that group's view.
      onSelectCandidate: (id) => void chooseCandidate(id),
      onApprove: noop,
      onReject: noop,
    }),
    [chooseCandidate],
  );

  // Stroke glow around the section the agent is filling: while it is working on it, or
  // while that section's data is still on its way in.
  const sectionLoading =
    landingSection === 'attributes' || landingSection === 'variants'
      ? wizard.attributeScoreStatus === 'loading' ||
        wizard.generatedVariantsStatus === 'loading'
      : landingSection === 'candidates'
        ? wizard.clusterRunStatus === 'loading'
        : landingSection === 'gate2' || landingSection === 'gate3'
          ? wizard.selectedVariantStatus === 'loading'
          : false;
  const highlightedSection =
    step !== 'scope' && (processing || sectionLoading) ? landingSection : undefined;

  const signedOff =
    wizard.gates.some((gate) => gate.gate === 3 && gate.status === 'signedOff') ||
    landingSection === 'complete';
  const activeStep = Math.max(0, WIZARD_STEPS.indexOf(step));
  const pageGlow = processing && !signedOff;

  useLayoutEffect(() => {
    if (!pageGlow) {
      document.documentElement.style.removeProperty('--describe-glow-right');
      document.documentElement.style.removeProperty('--describe-glow-outset-right');
      document.documentElement.style.removeProperty('--describe-glow-outset-top');
      delete document.documentElement.dataset.describePageGlow;
      return undefined;
    }

    document.documentElement.dataset.describePageGlow = 'true';
    const breadcrumb = document.querySelector('nav[aria-label="breadcrumb"]')?.parentElement;
    if (breadcrumb instanceof HTMLElement) {
      breadcrumb.style.position = 'relative';
      breadcrumb.style.zIndex = '2';
    }

    const fit = () => {
      const page = document.querySelector(`.${agentFlow.pageGlow}`);
      const chat = document.querySelector('.chatbot-component-container');
      if (!(page instanceof HTMLElement)) return;
      const expanded = Boolean(
        document.querySelector("[data-copilot-presentation='expanded']"),
      );
      const inset = describeGlowRightInset(
        page.getBoundingClientRect(),
        chat instanceof HTMLElement ? chat.getBoundingClientRect() : null,
        expanded,
      );
      const pageRect = page.getBoundingClientRect();
      const bar = document.querySelector('nav[aria-label="breadcrumb"]')?.parentElement;
      const barTop = bar instanceof HTMLElement ? bar.getBoundingClientRect().top : pageRect.top;
      const topOutset = Math.max(0, Math.round(pageRect.top - barTop));
      document.documentElement.style.setProperty('--describe-glow-right', `${inset}px`);
      document.documentElement.style.setProperty(
        '--describe-glow-outset-right',
        inset > 24 ? '0px' : '24px',
      );
      document.documentElement.style.setProperty('--describe-glow-outset-top', `${topOutset}px`);
    };

    fit();
    const sizeObserver = new ResizeObserver(fit);
    const chat = document.querySelector('.chatbot-component-container');
    if (chat) sizeObserver.observe(chat);
    const presentation = document.querySelector('[data-copilot-presentation]');
    const presentationObserver = new MutationObserver(fit);
    if (presentation) {
      presentationObserver.observe(presentation, {
        attributes: true,
        attributeFilter: ['data-copilot-presentation'],
      });
    }
    window.addEventListener('resize', fit);
    return () => {
      sizeObserver.disconnect();
      presentationObserver.disconnect();
      window.removeEventListener('resize', fit);
      if (breadcrumb instanceof HTMLElement) {
        breadcrumb.style.position = '';
        breadcrumb.style.zIndex = '';
      }
      document.documentElement.style.removeProperty('--describe-glow-right');
      document.documentElement.style.removeProperty('--describe-glow-outset-right');
      document.documentElement.style.removeProperty('--describe-glow-outset-top');
      delete document.documentElement.dataset.describePageGlow;
    };
  }, [pageGlow]);

  return (
    <WizardFlow
      className={[agentFlow.flow, pageGlow ? agentFlow.pageGlow : undefined]
        .filter(Boolean)
        .join(' ')}
      title={t('clustering:create.title')}
      description={t('clustering:create.subtitle')}
      steps={AGENTIC_WIZARD_STEPS.map((id) => ({
        label: t(`clustering:describe.steps.${id}`),
      }))}
      activeStep={activeStep}
      onStepSelect={noop}
      prevButtonProps={{
        children: t('clustering:footer.backToPlans'),
        onClick: backToPlans,
      }}
      extraButtonPlacement="start"
      extraButton={
        processing && !toastDismissed ? (
          <AgentProcessingToast onDismiss={() => setToastDismissed(true)} />
        ) : undefined
      }
      nextButtonProps={{
        children: t(`clustering:${NEXT_KEY[step]}`),
        disabled: processing || step !== 'signOff',
        onClick: step === 'signOff' ? backToPlans : undefined,
      }}
    >
      {step === 'scope' || !draft ? (
        <DescribeScopeStep
          onGenerate={agent.markGenerated}
          processing={processing && step === 'scope'}
        />
      ) : (
        <ClusterWizardStepContent
          step={step}
          wizard={wizard}
          actions={actions}
          readOnly
          highlightedSection={highlightedSection}
        />
      )}
    </WizardFlow>
  );
}
