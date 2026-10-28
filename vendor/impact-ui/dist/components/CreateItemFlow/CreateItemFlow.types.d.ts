import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';
import { InjectedLayoutProps } from '../DynamicLayout';
import { StepperStep } from '../Stepper/Stepper.types';

export interface CreateItemFlowProps extends BaseComponentProps {
    /** Current step (1-based) */
    step?: number;
    totalSteps?: number;
    /** Width of the left panel (e.g. "375px") */
    leftPanelWidth?: string | number;
    /** Headings for each step section in the right content */
    headings?: string[];
    /** One React node per step (matched with headings by index) */
    children?: ReactNode | ReactNode[];
    onCancel?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onStepClick?: (step: number) => void;
    /** Stepper variant: default (MUI) or progress */
    stepperVariant?: 'default' | 'progress' | 'mui';
    leftPanelTitle?: string;
    leftPanelDescription?: string;
    /** Custom left panel image (overrides default) */
    leftPanelImage?: ReactNode | null;
    /** Custom actions (overrides default Prev/Next buttons) */
    actionsChildren?: ReactNode | null;
    showStepper?: boolean;
}
export interface RightContentPanelProps extends Partial<InjectedLayoutProps> {
    showStepper: boolean;
    steps: StepperStep[];
    step: number;
    stepperVariant: 'default' | 'progress' | 'mui';
    onStepClick?: (step: number) => void;
    headings: string[];
    children?: ReactNode | ReactNode[];
    actionsChildren?: ReactNode | null;
    onCancel?: () => void;
    onPrev?: () => void;
    onNext?: () => void;
    totalSteps: number;
}
//# sourceMappingURL=CreateItemFlow.types.d.ts.map