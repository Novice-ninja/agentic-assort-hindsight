import { InputProps } from './Input.types';

/**
 * Input component for text entry with support for labels, icons, and helper text.
 * Automatically switches between basic and icon-enhanced layouts based on props.
 * Meets WCAG 2.1 Level AA accessibility standards.
 *
 * @example
 * // Basic input
 * <Input label="Email" placeholder="Enter your email" />
 *
 * // Input with validation error
 * <Input label="Password" isError helperText="Required field" isHelperText />
 *
 * // Input with icons
 * <Input
 *   leftIcon={<SearchIcon />}
 *   rightIcon={<ClearIcon />}
 *   rightIconClick={() => clearValue()}
 *   placeholder="Search..."
 * />
 */
export declare const Input: import('react').ForwardRefExoticComponent<Omit<InputProps, "ref"> & import('react').RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=index.d.ts.map