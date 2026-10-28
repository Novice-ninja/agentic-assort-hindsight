import { ReactNode } from 'react';
import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import { BaseComponentProps } from '../../types';

/**
 * Single option in the button group
 */
export interface ButtonGroupOption {
    /** Value when this option is selected */
    value: string;
    /** Label text */
    label: string;
    /** Optional icon (e.g. MUI icon) */
    icon?: ReactNode;
    /** Whether this option is disabled */
    disabled?: boolean;
}
export interface ButtonGroupProps extends BaseComponentProps, Omit<ToggleButtonGroupProps, 'value' | 'onChange' | 'children'> {
    /** Options to render as toggle buttons */
    options: ButtonGroupOption[];
    /** Currently selected value (controlled) */
    selectedOption: string;
    /** Called when selection changes */
    onChange?: (e: React.MouseEvent<HTMLElement>, value: string | null) => void;
    /** Disable the entire group */
    isDisabled?: boolean;
}
//# sourceMappingURL=ButtonGroup.types.d.ts.map