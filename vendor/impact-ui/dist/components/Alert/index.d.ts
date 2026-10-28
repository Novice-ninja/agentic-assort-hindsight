import { AlertProps } from './Alert.types';

/**
 * Alert component for displaying important messages to users.
 * Supports four severity levels (success, info, warning, error) with corresponding
 * visual styles and icons. Includes optional action button and close functionality.
 * Meets WCAG 2.1 Level AA accessibility standards.
 *
 * @example
 * // Basic success alert
 * <Alert severity="success" title="Changes saved!" />
 *
 * // Error alert with description
 * <Alert
 *   severity="error"
 *   title="Upload Failed"
 *   description="File size exceeds the 10MB limit."
 * />
 *
 * // Info alert with action and close
 * <Alert
 *   severity="info"
 *   title="Update Available"
 *   actionName="Update Now"
 *   onAction={() => handleUpdate()}
 *   onClose={() => dismissAlert()}
 * />
 */
export declare const Alert: import('react').ForwardRefExoticComponent<Omit<AlertProps, "ref"> & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=index.d.ts.map