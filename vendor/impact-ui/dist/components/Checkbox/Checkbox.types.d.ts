import { ReactNode } from 'react';
import { CheckboxProps as MUICheckboxProps } from '@mui/material/Checkbox';
import { BaseComponentProps } from '../../types';

/**
 * Checkbox visual variants
 */
export type CheckboxVariant = 'default' | 'dashed';
/**
 * Data structure for dropdown menu items in checkbox with dropdown
 */
export interface DropdownItemData {
    /**
     * Display text for the menu item
     */
    label: string;
    /**
     * Unique value identifier for the menu item
     */
    value: string;
    /**
     * Whether the menu item is disabled
     * @default false
     */
    disabled?: boolean;
    /**
     * Click handler for the menu item
     */
    onClick?: () => void;
}
export interface CheckboxProps extends Omit<BaseComponentProps, 'children'>, Omit<MUICheckboxProps, 'checked' | 'onChange' | 'disabled' | 'required' | 'defaultChecked'> {
    /**
     * Label text displayed next to the checkbox.
     * @example
     * <Checkbox label="Accept terms and conditions" />
     */
    label?: ReactNode;
    /**
     * Visual variant of the checkbox.
     * - 'default': Standard checkmark when checked
     * - 'dashed': Horizontal dash/line when checked (for indeterminate-like states)
     * @default 'default'
     * @example
     * <Checkbox variant="dashed" label="Select all (partial)" />
     */
    variant?: CheckboxVariant;
    /**
     * When true, the checkbox is disabled and cannot be interacted with.
     * @default false
     * @example
     * <Checkbox disabled label="Cannot change" />
     */
    disabled?: boolean;
    /**
     * When true, displays a red asterisk (*) indicating the field is required.
     * This is for visual indication - use form validation for actual requirement.
     * @default false
     * @example
     * <Checkbox required label="I agree to terms" />
     */
    required?: boolean;
    /**
     * Initial checked state for uncontrolled usage.
     * Use this when you don't need to control the checkbox state externally.
     * @example
     * <Checkbox defaultChecked label="Enabled by default" />
     */
    defaultChecked?: boolean;
    /**
     * Controlled checked state.
     * When provided, the checkbox becomes controlled and requires onChange to update.
     * @example
     * const [checked, setChecked] = useState(false);
     * <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
     */
    checked?: boolean;
    /**
     * Callback fired when the checkbox state changes.
     * @param event - The change event containing the new checked state
     * @example
     * <Checkbox onChange={(e) => console.log('Checked:', e.target.checked)} />
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * When true, renders the checkbox without the MUI FormControlLabel wrapper.
     * Useful for custom label layouts or when integrating into existing forms.
     * @default false
     * @example
     * <Checkbox withoutFormLabel label="Custom layout" />
     */
    withoutFormLabel?: boolean;
    /**
     * When true, adds a dropdown menu arrow next to the checkbox.
     * Requires dropDownData to be provided with menu options.
     * @default false
     * @example
     * <Checkbox
     *   withDropDown
     *   dropDownData={[{ label: 'Option 1', value: 'opt1' }]}
     *   label="Select action"
     * />
     */
    withDropDown?: boolean;
    /**
     * Array of menu items for the dropdown.
     * Required when withDropDown is true.
     * @example
     * const options = [
     *   { label: 'Edit', value: 'edit', onClick: handleEdit },
     *   { label: 'Delete', value: 'delete', onClick: handleDelete },
     * ];
     * <Checkbox withDropDown dropDownData={options} />
     */
    dropDownData?: DropdownItemData[];
    /**
     * Callback fired when the dropdown trigger area is clicked.
     * @param event - The click event
     * @example
     * <Checkbox
     *   withDropDown
     *   dropDownData={options}
     *   onDropDownCheckBoxClick={(e) => console.log('Dropdown clicked')}
     * />
     */
    onDropDownCheckBoxClick?: (event: React.MouseEvent) => void;
}
/**
 * Internal props for Default checkbox variant component
 */
export interface DefaultCheckboxProps {
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired?: boolean;
    isDisabled?: boolean;
    label?: ReactNode;
    withoutFormLabel?: boolean;
    withDropDown?: boolean;
    dropDownData?: DropdownItemData[];
    onDropDownCheckBoxClick?: (event: React.MouseEvent) => void;
    id?: string;
    'data-testid'?: string;
}
/**
 * Internal props for Dashed checkbox variant component
 */
export interface DashedCheckboxProps {
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired?: boolean;
    isDisabled?: boolean;
    label?: ReactNode;
}
/**
 * Internal props for WithoutFormLabel checkbox component
 */
export interface WithoutFormLabelProps {
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired?: boolean;
    isDisabled?: boolean;
    label?: ReactNode;
}
/**
 * Internal props for WithDropDown checkbox component
 */
export interface WithDropDownProps {
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired?: boolean;
    isDisabled?: boolean;
    label?: ReactNode;
    dropDownData: DropdownItemData[];
    onDropDownCheckBoxClick?: (event: React.MouseEvent) => void;
}
//# sourceMappingURL=Checkbox.types.d.ts.map