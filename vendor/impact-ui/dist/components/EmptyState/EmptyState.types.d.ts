import { ReactNode } from 'react';
import { RootComponentProps } from '../../types';
import { ButtonProps } from '../Button';

export interface EmptyStateProps extends RootComponentProps {
    /** Main heading text */
    heading: string;
    /** Description paragraph */
    description?: string;
    /** Label for secondary button */
    secondaryButtonLabel?: string;
    /** Handler for secondary button click */
    onSecondaryButtonClick?: () => void;
    /** Label for primary button */
    primaryButtonLabel?: string;
    /** Handler for primary button click */
    onPrimaryButtonClick?: () => void;
    /** Custom icon or illustration (overrides default empty state image) */
    emptyStateIcon?: ReactNode | null;
    /** Additional content below description, above buttons */
    emptyStateBottomOptions?: ReactNode | null;
    /** Props passed to the primary Button */
    primaryButtonProps?: Partial<ButtonProps>;
    /** Props passed to the secondary Button */
    secondaryButtonProps?: Partial<ButtonProps>;
}
//# sourceMappingURL=EmptyState.types.d.ts.map