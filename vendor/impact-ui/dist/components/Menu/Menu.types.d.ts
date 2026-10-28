import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';
import { MenuProps as MuiMenuProps } from '@mui/material/Menu';

/**
 * Option for the dropdown menu (flat or nested).
 * When `children` is present, renders a nested submenu.
 */
export interface MenuOption {
    label: string;
    value?: string;
    /** Optional click handler (may receive the option as argument) */
    onClick?: (opt?: MenuOption, event?: React.MouseEvent) => unknown;
    /** Legacy: callback(event, item) for leaf items */
    callback?: (event: React.MouseEvent, item: MenuOption) => void;
    /** When true, the item is not clickable */
    disabled?: boolean;
    /** Optional icon or element to show before the label */
    icon?: ReactNode;
    /** Optional element to show after the label (e.g. ChevronRight for nested) */
    rightIcon?: ReactNode;
    /** Section header label (non-clickable row) */
    section?: string;
    /** Secondary label below main label */
    subLabel?: string;
    /** Nested menu options */
    children?: MenuOption[];
    /** Delay in ms before opening submenu on hover */
    delay?: number;
    /** MUI sx prop for the item */
    sx?: unknown;
}
/**
 * Custom header render props (search, select all, etc.)
 */
export interface MenuCustomHeaderProps {
    options: MenuOption[];
    selectedItems: string[];
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    onSelectAll?: () => void;
    onClearSelection?: () => void;
    [key: string]: unknown;
}
/**
 * Primary action button at bottom of menu (e.g. Apply)
 */
export interface MenuPrimaryButtonProps {
    loading?: boolean;
    label?: string;
    disabled?: boolean;
    icon?: ReactNode;
}
/**
 * Simple menu props (anchor, open, onClose, options).
 * Extends MUI Menu props for pass-through where needed.
 * Supports nested options, checkbox multi-select, custom header, and action buttons.
 */
export interface MenuProps extends BaseComponentProps {
    /** Anchor element for menu position */
    anchorEl: HTMLElement | null;
    /** Whether the menu is open */
    open: boolean;
    /** Called when menu should close */
    onClose?: () => void;
    /** Menu items (flat or nested via children); supports label, value, onClick, disabled, icon, section, subLabel */
    options?: MenuOption[];
    /** Menu-level click handler: (option, newSelectedItems, itemResult) */
    onClick?: (option: MenuOption, newSelectedItems: string[], itemResult?: unknown) => void;
    /** MUI Menu props (anchorOrigin, transformOrigin, etc.) */
    MenuProps?: Partial<MuiMenuProps>;
    /** Unused in current impl; kept for API compat */
    ButtonProps?: Record<string, unknown>;
    /** Icon position: 'left' (default) or 'top' affects menu anchor/transform origin */
    iconPlacement?: 'left' | 'top';
    /** When true, show checkboxes and multi-select; does not close menu on item click */
    withCheckbox?: boolean;
    /** When true (and withCheckbox), show Apply at bottom; pass tertiaryButtonLabel to also show Cancel */
    withActionButtons?: boolean;
    /** Called when Apply is clicked */
    onPrimaryButtonClick?: () => void;
    /** Called when the tertiary (left) action button is clicked */
    onTertiaryButtonClick?: () => void;
    /** When set, renders the tertiary action button (e.g. "Cancel") */
    tertiaryButtonLabel?: string;
    /** Unused; kept for API compat */
    withSection?: boolean;
    /** Single selected value (highlights one item when withCheckbox is false) */
    selected?: {
        value?: string;
    };
    /** Custom header component (search, select all, etc.) */
    renderCustomHeader?: (props: MenuCustomHeaderProps) => ReactNode;
    /** Props passed to custom header and selection state */
    customHeaderProps?: {
        selectedItems?: string[];
        onSelectionChange?: (items: string[]) => void;
        isLoading?: boolean;
        isSearching?: boolean;
        [key: string]: unknown;
    };
    /** Filtered options when using search (shown in header); falls back to options */
    filteredOptions?: MenuOption[];
    /** Current search query (controlled) */
    searchQuery?: string;
    /** Search input change handler */
    onSearchChange?: (value: string) => void;
    /** Select all handler (for custom header) */
    onSelectAll?: (values: string[]) => void;
    /** Clear selection handler (for custom header) */
    onClearSelection?: () => void;
    /** Apply button props (loading, label, disabled) */
    primaryButtonProps?: MenuPrimaryButtonProps;
    /** Tertiary action button props (label, disabled) */
    tertiaryButtonProps?: MenuPrimaryButtonProps;
    /** Class name for the MUI Menu paper container */
    menuContainerClassName?: string;
    /** When true, close menu after clicking a leaf item (default: false to match old behavior) */
    closeOnItemClick?: boolean;
}
//# sourceMappingURL=Menu.types.d.ts.map