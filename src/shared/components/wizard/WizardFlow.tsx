import type { ReactNode } from 'react';
import { CreateItemFlow, Stepper } from '@shared/components/vendor/impact-ui';
import type { ButtonProps, StepperStep } from '@shared/components/vendor/impact-ui';
import wizardDecoExport from '@assets/icons/planning/wizard-deco-export.png';
import styles from './WizardFlow.module.css';

export interface WizardFlowProps {
  title: string;
  description?: string;
  steps: StepperStep[];
  activeStep: number;
  onStepSelect: (index: number) => void;
  children: ReactNode;
  prevButtonProps?: Partial<ButtonProps>;
  nextButtonProps: Partial<ButtonProps>;
  extraButton?: ReactNode;
  /** Vendor `extraButtonProp` sits in the right group; `'start'` keeps it with Back. */
  extraButtonPlacement?: 'start' | 'end';
  /** Extra class on the page wrapper (e.g. the agentic page glow). */
  className?: string;
}

/**
 * Shared create-wizard shell used by Create Plan and Create Cluster Plan.
 * Wraps Impact UI `CreateItemFlow` so both screens share one layout.
 */
export function WizardFlow({
  title,
  description = '',
  steps,
  activeStep,
  // onStepSelect,
  children,
  prevButtonProps,
  nextButtonProps,
  extraButton,
  extraButtonPlacement = 'end',
  className,
}: WizardFlowProps) {
  const extraAtStart = Boolean(extraButton) && extraButtonPlacement === 'start';

  return (
    <div
      className={[
        styles.page,
        extraAtStart ? styles.extraStart : undefined,
        prevButtonProps ? undefined : styles.hidePrev,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CreateItemFlow
        title={title}
        description={description}
        leftPanelContent={
          <Stepper
            steps={steps}
            activeStep={activeStep}
            orientation="vertical"
            // handleStep={onStepSelect}
          />
        }
        leftPanelImage={<img src={wizardDecoExport} alt="" aria-hidden="true" />}
        rightContent={children}
        {...(prevButtonProps ? { prevButtonProps } : {})}
        extraButtonProp={extraButton}
        nextButtonProps={nextButtonProps}
      />
    </div>
  );
}
