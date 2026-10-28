import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { WizardFlow } from '@shared/components/wizard';
import { focusRingClass } from '@shared/a11y';
import aiSparkleIcon from '@assets/icons/hindsight/ai-sparkle-gradient.svg';
import { WIZARD_STEPS, type WizardStep } from '../types';
import styles from './wizard.module.css';

const BACK_KEY: Record<WizardStep, string> = {
  scope: 'footer.backToPlans',
  reviewRun: 'footer.backToScope',
  finalize: 'footer.backToReview',
  signOff: 'footer.backToFinalize',
};

const NEXT_KEY: Record<WizardStep, string> = {
  scope: 'footer.goToReview',
  reviewRun: 'footer.finaliseCluster',
  finalize: 'footer.finalSignOff',
  signOff: 'footer.goToDashboard',
};

export interface ClusterWizardShellProps {
  step: WizardStep;
  onStepSelect: (step: WizardStep) => void;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  /** Shows the vendor button spinner while a step transition is awaiting the backend. */
  nextLoading?: boolean;
  children: ReactNode;
}

export function ClusterWizardShell({
  step,
  onStepSelect,
  onBack,
  onNext,
  nextDisabled,
  nextLoading,
  children,
}: ClusterWizardShellProps) {
  const { t } = useTranslation('clustering');
  const activeStep = WIZARD_STEPS.indexOf(step);

  return (
    <WizardFlow
      title={t('create.title')}
      description={t('create.subtitle')}
      steps={WIZARD_STEPS.map((id) => ({ label: t(`steps.${id}.title`) }))}
      activeStep={activeStep}
      onStepSelect={(index) => onStepSelect(WIZARD_STEPS[index] ?? 'scope')}
      {...(step === 'reviewRun'
        ? {}
        : {
            prevButtonProps: {
              children: t(BACK_KEY[step]),
              onClick: onBack,
            },
          })}
      extraButtonPlacement="start"
      extraButton={
        <button
          type="button"
          className={[styles.askInChat, focusRingClass].join(' ')}
          title={t('askInChatHint')}
          aria-label={t('footer.askInChat')}
          onClick={() => undefined}
        >
          <img
            src={aiSparkleIcon}
            alt=""
            aria-hidden="true"
            className={styles.askInChatIcon}
          />
          <span className={styles.askInChatText}>{t('footer.askInChat')}</span>
        </button>
      }
      nextButtonProps={{
        children: t(NEXT_KEY[step]),
        onClick: onNext,
        disabled: nextDisabled,
        loading: nextLoading,
      }}
    >
      {children}
    </WizardFlow>
  );
}
