import { BaseComponentProps } from '../../types';
import { SnackbarProps as MUISnackbarProps } from '@mui/material/Snackbar';

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ToastVariant = 'success' | 'info' | 'warning' | 'error';
export interface ToastProps extends Omit<BaseComponentProps, 'children'>, Omit<MUISnackbarProps, 'open' | 'message' | 'anchorOrigin' | 'className'> {
    /** Whether the toast is visible */
    isOpen?: boolean;
    /** Position of the toast (e.g. "top-right") */
    position?: ToastPosition;
    /** Message text to display */
    message?: string;
    /** Visual variant */
    variant?: ToastVariant;
    /** Called when the toast closes (auto-hide or user action) */
    onClose?: MUISnackbarProps['onClose'];
    /** Auto-hide duration in ms; set to null to disable */
    autoHideDuration?: number | null;
    /** Custom z-index for the toast snackbar */
    zIndex?: number;
}
//# sourceMappingURL=Toast.types.d.ts.map