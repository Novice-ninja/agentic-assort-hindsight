import { ReactNode } from 'react';
import { AlertProps as MUIAlertProps } from '@mui/material/Alert';
import { BaseComponentProps } from '../../types';
import { ButtonProps } from '../Button/Button.types';

/**
 * Alert severity levels that determine the visual style and icon
 */
export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';
export interface AlertProps extends Omit<BaseComponentProps, 'children'>, Omit<MUIAlertProps, 'severity' | 'title' | 'action'> {
    /**
     * The severity level of the alert which determines its color scheme and icon.
     * - 'success': Green theme with checkmark icon - use for successful operations
     * - 'info': Blue theme with info icon - use for informational messages
     * - 'warning': Yellow/Orange theme with warning icon - use for potential issues
     * - 'error': Red theme with error icon - use for errors and failures
     * @example
     * <Alert severity="success" title="Success!" />
     * <Alert severity="error" title="Something went wrong" />
     */
    severity: AlertSeverity;
    /**
     * The main title text of the alert.
     * If not provided, the severity value is displayed as the title.
     * @example
     * <Alert severity="success" title="Payment Successful" />
     */
    title?: string;
    /**
     * Additional description text displayed below the title.
     * Use this for providing more context or details about the alert.
     * @example
     * <Alert
     *   severity="error"
     *   title="Upload Failed"
     *   description="The file size exceeds the 10MB limit. Please choose a smaller file."
     * />
     */
    description?: string;
    /**
     * Text label for the action button.
     * The button will only appear if both `actionName` and `onAction` are provided.
     * @example
     * <Alert
     *   severity="info"
     *   title="New Update Available"
     *   actionName="Update Now"
     *   onAction={() => handleUpdate()}
     * />
     */
    actionName?: string;
    /**
     * Callback function triggered when the action button is clicked.
     * The action button will only appear if both `actionName` and `onAction` are provided.
     * @example
     * <Alert
     *   severity="warning"
     *   title="Session Expiring"
     *   actionName="Extend Session"
     *   onAction={() => extendSession()}
     * />
     */
    onAction?: () => void;
    /**
     * Callback function triggered when the close button is clicked.
     * If provided, a close button will be displayed in the alert.
     * @example
     * <Alert
     *   severity="success"
     *   title="Settings Saved"
     *   onClose={() => setShowAlert(false)}
     * />
     */
    onClose?: () => void;
    /**
     * Additional props to pass to the action Button component.
     * Useful for customizing the action button's appearance.
     * @example
     * <Alert
     *   severity="info"
     *   title="Update Available"
     *   actionName="Download"
     *   onAction={handleDownload}
     *   actionButtonProps={{ variant: 'primary', size: 'small' }}
     * />
     */
    actionButtonProps?: Partial<ButtonProps>;
    /**
     * Custom content to display inside the alert.
     * When provided, this will be rendered in addition to the description.
     */
    children?: ReactNode;
    /**
     * When true, displays the alert with a subtle background style (no shadow and border).
     * Useful for inline alerts that don't need to stand out as much.
     * @default false
     * @example
     * <Alert severity="info" title="Note" subtleBackground />
     */
    subtleBackground?: boolean;
}
//# sourceMappingURL=Alert.types.d.ts.map