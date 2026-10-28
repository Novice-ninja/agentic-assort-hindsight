import { ReactNode } from 'react';
import { ButtonProps } from '../Button/Button.types';
import { DialogProps } from '@mui/material/Dialog';

export type PromptVariant = 'info' | 'success' | 'warning' | 'error';
export interface PromptProps extends Omit<DialogProps, 'open' | 'onClose' | 'title'> {
    /** Visual variant (icon and styling) */
    variant?: PromptVariant;
    /** Dialog title */
    title?: ReactNode;
    /** Dialog body content */
    children?: ReactNode;
    /** Primary action button label */
    primaryButtonLabel?: string;
    /** Secondary action button label */
    secondaryButtonLabel?: string;
    /** Whether the dialog is open */
    isOpen: boolean;
    /** Primary button click handler */
    onPrimaryButtonClick?: () => void;
    /** Secondary button click handler */
    onSecondaryButtonClick?: () => void;
    /** Close handler (backdrop, close icon, escape) */
    handleClose?: () => void;
    /** Props passed to the primary Button */
    primaryButtonProps?: Partial<ButtonProps>;
    /** Props passed to the secondary Button */
    secondaryButtonProps?: Partial<ButtonProps>;
}
//# sourceMappingURL=Prompt.types.d.ts.map