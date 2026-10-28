import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';
import { StepperProps as MUIStepperProps } from '@mui/material/Stepper';

export interface StepStatusConfig {
    label: string;
    color?: string;
    icon?: ReactNode;
}
export interface StepperStep {
    label: string;
    description?: string;
    statusConfig?: StepStatusConfig;
}
export interface StepperProps extends BaseComponentProps, Omit<MUIStepperProps, 'children' | 'variant'> {
    steps: StepperStep[];
    activeStep: number;
    orientation?: 'horizontal' | 'vertical';
    handleStep?: (index: number) => void;
    /** 'default' | 'progress' | 'mui' (our API) or MUI Paper variant for default stepper */
    variant?: 'default' | 'progress' | 'mui' | MUIStepperProps['variant'];
    width?: string | number;
}
//# sourceMappingURL=Stepper.types.d.ts.map