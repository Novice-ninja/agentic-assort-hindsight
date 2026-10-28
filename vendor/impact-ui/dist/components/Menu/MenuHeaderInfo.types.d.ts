import { MenuOption } from './Menu.types';
import { RadioButtonGroupOption } from '../RadioButtonGroup/RadioButtonGroup.types';

/**
 * Config overrides for MenuHeaderInfo (radio, search, select-all visibility).
 */
export interface MenuHeaderInfoOverrideConfig {
    radioButtonOptions?: RadioButtonGroupOption[];
    selectedRadioButton?: string;
    showRadioButton?: boolean;
    isSearchable?: boolean;
    isSelectAllAllowed?: boolean;
}
/**
 * External handlers to use instead of the props (for controlled/custom behavior).
 */
export interface MenuHeaderInfoExternalHandlers {
    onSearchChange?: (value: string) => void;
    onRadioButtonChange?: (value: string) => void;
    onSelectAll?: (values: string[]) => void;
    onClearSelection?: () => void;
}
/**
 * Customization props for the header (labels, placeholder, MUI props).
 */
export interface MenuHeaderInfoCustomProps {
    searchPlaceholder?: string;
    selectAllLabel?: string;
    clearButtonText?: string;
    radioButtonProps?: Record<string, unknown>;
    searchInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    checkboxProps?: Record<string, unknown>;
    clearButtonProps?: React.HTMLAttributes<HTMLSpanElement>;
}
export interface MenuHeaderInfoProps {
    options: MenuOption[];
    selectedItems: string[];
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    onSelectAll?: (values: string[]) => void;
    onClearSelection?: () => void;
    onRadioButtonChange?: (value: string) => void;
    /** Radio options (used when showRadioButton is true) */
    radioButtonOptions?: RadioButtonGroupOption[];
    /** Controlled selected radio value */
    selectedRadioButton?: string;
    /** Show radio group */
    showRadioButton?: boolean;
    /** Show search input */
    isSearchable?: boolean;
    /** Show select-all / clear row */
    isSelectAllAllowed?: boolean;
    /** Override visibility and options */
    overrideConfig?: MenuHeaderInfoOverrideConfig;
    /** Use these handlers instead of props (takes precedence) */
    externalHandlers?: MenuHeaderInfoExternalHandlers;
    /** Labels, placeholder, and element props */
    customHeaderProps?: MenuHeaderInfoCustomProps & Record<string, unknown>;
}
//# sourceMappingURL=MenuHeaderInfo.types.d.ts.map