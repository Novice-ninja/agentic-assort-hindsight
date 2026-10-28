import { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox component for binary selections.
 * Supports default and dashed variants, optional dropdown menu, and custom label layouts.
 * Meets WCAG 2.1 Level AA accessibility standards.
 *
 * @example
 * // Basic checkbox
 * <Checkbox label="Accept terms" checked={accepted} onChange={handleChange} />
 *
 * // Dashed variant (for partial/indeterminate states)
 * <Checkbox variant="dashed" label="Select all" checked={someSelected} />
 *
 * // With dropdown menu
 * <Checkbox
 *   withDropDown
 *   dropDownData={[{ label: 'Option 1', value: 'opt1' }]}
 *   label="Actions"
 * />
 *
 * // Without form label wrapper
 * <Checkbox withoutFormLabel label="Custom layout" />
 */
export declare const Checkbox: import('react').ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & import('react').RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=index.d.ts.map