import { ReactNode } from 'react';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { BaseComponentProps } from '../../types';

/**
 * Input size variants
 */
export type InputSize = 'small' | 'medium' | 'large';
export interface InputProps extends Omit<BaseComponentProps, 'children'>, Omit<OutlinedInputProps, 'size' | 'error'> {
    /**
     * Label text displayed above the input field.
     * @example
     * <Input label="Email Address" />
     */
    label?: string;
    /**
     * When true, displays a red asterisk (*) next to the label indicating the field is required.
     * This is for visual indication only - add HTML required attribute for form validation.
     * @default false
     * @example
     * <Input label="Name" isRequired />
     */
    isRequired?: boolean;
    /**
     * Icon element displayed on the left side of the input.
     * When provided, the input automatically uses the icon-enhanced layout.
     * @example
     * import SearchIcon from '@mui/icons-material/Search';
     * <Input leftIcon={<SearchIcon />} />
     */
    leftIcon?: ReactNode;
    /**
     * Icon element displayed on the right side of the input.
     * When provided, the input automatically uses the icon-enhanced layout.
     * @example
     * import VisibilityIcon from '@mui/icons-material/Visibility';
     * <Input type="password" rightIcon={<VisibilityIcon />} />
     */
    rightIcon?: ReactNode;
    /**
     * Click handler for the left icon.
     * @example
     * <Input leftIcon={<SearchIcon />} leftIconClick={() => performSearch()} />
     */
    leftIconClick?: () => void;
    /**
     * Click handler for the right icon.
     * @example
     * <Input rightIcon={<ClearIcon />} rightIconClick={() => clearInput()} />
     */
    rightIconClick?: () => void;
    /**
     * Helper text displayed below the input field.
     * Useful for providing hints, validation messages, or additional context.
     * Requires isHelperText to be true.
     * @example
     * <Input helperText="Enter a valid email address" isHelperText />
     */
    helperText?: string;
    /**
     * When true, displays the helperText below the input.
     * @default false
     * @example
     * <Input helperText="Maximum 100 characters" isHelperText />
     */
    isHelperText?: boolean;
    /**
     * Helper text displayed when the input is focused.
     * Replaces helperText temporarily while the input has focus.
     * @example
     * <Input
     *   helperText="Enter your password"
     *   focusedText="Minimum 8 characters required"
     *   isHelperText
     * />
     */
    focusedText?: string;
    /**
     * When true, displays the input in an error state with red styling.
     * Use for validation errors.
     * @default false
     * @example
     * <Input isError helperText="Invalid email format" isHelperText />
     */
    isError?: boolean;
    /**
     * When true, disables the input field.
     * @default false
     * @example
     * <Input isDisabled value="Cannot edit" />
     */
    isDisabled?: boolean;
    /**
     * HTML for attribute to associate the label with the input.
     * Should match the id of the input for accessibility.
     * @example
     * <Input label="Email" htmlFor="email-input" id="email-input" />
     */
    htmlFor?: string;
    /**
     * When true, allows icon clicks even when the input is disabled.
     * Useful for actions like showing password or clearing the field.
     * @default false
     * @example
     * <Input
     *   isDisabled
     *   rightIcon={<VisibilityIcon />}
     *   rightIconClick={toggleVisibility}
     *   iconClickOnDisabled
     * />
     */
    iconClickOnDisabled?: boolean;
    /**
     * Size of the input field.
     * - 'small': 24px height
     * - 'medium': 28px height
     * - 'large': 32px height (default)
     * @default 'large'
     * @example
     * <Input size="small" placeholder="Compact input" />
     */
    size?: InputSize;
    /**
     * Autocomplete attribute for browser autofill behavior.
     * @example
     * <Input autoComplete="email" />
     */
    autoComplete?: string;
}
/**
 * Props for the internal VanillaInput component
 */
export type VanillaInputProps = Omit<InputProps, 'leftIcon' | 'rightIcon' | 'leftIconClick' | 'rightIconClick' | 'iconClickOnDisabled'>;
/**
 * Props for the internal InputWithIcon component
 */
export type InputWithIconProps = InputProps;
/**
 * Props for the HelperText component
 */
export interface HelperTextProps {
    /**
     * Default helper text to display
     */
    helper?: string;
    /**
     * Text to display when input is focused
     */
    focusedText?: string;
}
//# sourceMappingURL=Input.types.d.ts.map