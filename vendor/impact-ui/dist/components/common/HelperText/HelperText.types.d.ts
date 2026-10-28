import { ReactNode } from 'react';
import { RootComponentProps } from '../../../types';

export interface HelperTextProps extends RootComponentProps {
    /** Helper text content */
    helper?: ReactNode;
    /** Error state (red styling) */
    error?: boolean;
    /** Min width of the helper text container (default: 240px) */
    minWidth?: string | number;
}
//# sourceMappingURL=HelperText.types.d.ts.map