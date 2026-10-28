import { ReactNode, SyntheticEvent } from 'react';
import { BaseComponentProps } from '../../types';
import { ButtonProps } from '../Button';

export type ModalSize = 'small' | 'medium' | 'large';
export interface ModalProps extends BaseComponentProps {
    open: boolean;
    onClose?: (event?: SyntheticEvent) => void;
    title?: ReactNode;
    size?: ModalSize;
    children?: ReactNode;
    primaryButtonLabel?: ReactNode;
    secondaryButtonLabel?: ReactNode;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    primaryButtonProps?: Partial<ButtonProps>;
    secondaryButtonProps?: Partial<ButtonProps>;
    width?: string | number;
    height?: string | number;
    maxHeight?: string | number;
    /** Custom footer content (overrides primary/secondary buttons when set) */
    footerOptions?: ReactNode;
    isBottomSheet?: boolean;
    isExpanded?: boolean;
    onExpand?: () => void;
    zIndex?: number;
    withExpandIcon?: boolean;
    /**
     * Disable MUI's focus trap for this modal. Enable this when the modal hosts
     * content that renders interactive elements in a portal outside the modal DOM
     * (e.g. a DatePicker/Select using `withPortal`), otherwise the focus trap
     * steals focus back and makes the portaled popover unusable.
     */
    disableEnforceFocus?: boolean;
    /** Disable MUI automatically moving focus into the modal when it opens. */
    disableAutoFocus?: boolean;
    /** Disable MUI restoring focus to the trigger element when the modal closes. */
    disableRestoreFocus?: boolean;
}
//# sourceMappingURL=Modal.types.d.ts.map