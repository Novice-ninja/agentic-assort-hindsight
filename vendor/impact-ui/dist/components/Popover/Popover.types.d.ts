import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';
import { ButtonProps } from '../Button';
import { PopoverProps as MUIPopoverProps } from '@mui/material/Popover';

/**
 * Popover props. Extends MUI PopoverProps; custom title and footer are added.
 */
export interface PopoverProps extends BaseComponentProps, Omit<MUIPopoverProps, 'title'> {
    /** Popover header title */
    title?: ReactNode;
    /** Called when popover should close (e.g. close icon or backdrop) */
    onClose?: (event: unknown, reason: 'backdropClick' | 'escapeKeyDown') => void;
    /** Primary action button label */
    primaryButtonLabel?: ReactNode;
    /** Secondary action button label */
    secondaryButtonLabel?: ReactNode;
    /** Called when primary button is clicked */
    onPrimaryButtonClick?: () => void;
    /** Called when secondary button is clicked */
    onSecondaryButtonClick?: () => void;
    /** Props passed to the primary button */
    primaryButtonProps?: Partial<ButtonProps>;
    /** Props passed to the secondary button */
    secondaryButtonProps?: Partial<ButtonProps>;
    /** Popover body content */
    children?: ReactNode;
}
//# sourceMappingURL=Popover.types.d.ts.map