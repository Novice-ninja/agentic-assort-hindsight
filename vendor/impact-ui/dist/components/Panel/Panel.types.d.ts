import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';
import { ButtonProps } from '../Button';
import { DrawerProps } from '@mui/material/Drawer';

export type PanelAnchor = 'left' | 'right' | 'top' | 'bottom';
export type PanelSize = 'medium' | 'large';
/**
 * Panel (drawer) props. Extends MUI DrawerProps; anchor, open, onClose are required/overridden.
 */
export interface PanelProps extends BaseComponentProps, Omit<DrawerProps, 'anchor' | 'open' | 'onClose' | 'children' | 'title'> {
    /** Drawer anchor position */
    anchor?: PanelAnchor;
    /** Whether the panel is open */
    open: boolean;
    /** Setter for open state (called with new value when drawer closes/opens) */
    setIsOpen?: (open: boolean) => void;
    /** Called when the panel should close (e.g. backdrop or close button) */
    onClose?: () => void;
    /** Panel title in the header */
    title?: ReactNode;
    /** Size of the panel (affects width) */
    size?: PanelSize;
    /** Custom width in pixels (overrides size when set) */
    width?: number;
    /** Z-index of the drawer paper */
    zIndex?: number;
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
    /** Panel body content */
    children?: ReactNode;
    /** Custom content rendered on the left side of the footer */
    customFooterContent?: ReactNode;
    /** Enable drag-to-resize on the panel edge */
    resizable?: boolean;
    /** Minimum width when resizable (default 375) */
    minWidth?: number;
    /** Maximum width when resizable (default window.innerWidth - 100) */
    maxWidth?: number;
    /** Called with the new width when the panel is resized */
    onResize?: (width: number) => void;
}
//# sourceMappingURL=Panel.types.d.ts.map