import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';
import { ButtonProps } from '../Button';
import { DrawerProps } from '@mui/material/Drawer';

export type FilterPanelAnchor = 'left' | 'right' | 'top' | 'bottom';
export type FilterPanelSize = 'medium' | 'large';
export interface FilterPanelItem {
    id?: string;
    value: string;
    title: string;
    icon?: ReactNode;
    children?: ReactNode;
    type?: 'separator';
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    numberOfFilter?: number;
}
/**
 * FilterPanel props. Extends MUI Drawer; provides sidebar filters and optional footer buttons.
 */
export interface FilterPanelProps extends BaseComponentProps, Omit<DrawerProps, 'anchor' | 'open' | 'onClose' | 'children' | 'title'> {
    anchor?: FilterPanelAnchor;
    /** Whether the panel is open */
    isOpen: boolean;
    /** Callback to set open state (optional if handleClose is used) */
    setIsOpen?: (open: boolean) => void;
    /** Currently active filter tab value */
    active: string;
    /** Callback when a filter tab is selected */
    setActive: (value: string) => void;
    /** Filter tabs (sidebar items); one must match active */
    filters: FilterPanelItem[];
    /** Called when panel should close (e.g. backdrop or close button) */
    handleClose?: () => void;
    /** Panel header title */
    title?: ReactNode;
    size?: FilterPanelSize;
    primaryButtonLabel?: ReactNode;
    onPrimaryButtonClick?: () => void;
    secondaryButtonLabel?: ReactNode;
    onSecondaryButtonClick?: () => void;
    tertiaryButtonLabel?: ReactNode;
    onTertiaryButtonClick?: () => void;
    quaternaryButtonLabel?: ReactNode;
    onQuaternaryButtonClick?: () => void;
    primaryButtonProps?: Partial<ButtonProps>;
    secondaryButtonProps?: Partial<ButtonProps>;
    tertiaryButtonProps?: Partial<ButtonProps>;
    quaternaryButtonProps?: Partial<ButtonProps>;
    /** When true, render all filter bodies and show/hide by display; otherwise only active */
    alwaysRender?: boolean;
}
//# sourceMappingURL=FilterPanel.types.d.ts.map