import { ReactNode, ReactElement } from 'react';
import { BaseComponentProps } from '../../types';
import { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';

export type TooltipVariant = 'primary' | 'secondary' | 'tertiary' | 'feature';
export interface TooltipProps extends Omit<MuiTooltipProps, 'title' | 'placement' | 'children'>, Omit<BaseComponentProps, 'children'> {
    /** Content shown inside the tooltip bubble */
    title: ReactNode;
    /** Secondary text shown below the title (only for "feature" variant) */
    description?: ReactNode;
    /** Where the tooltip appears relative to the anchor element */
    orientation?: MuiTooltipProps['placement'];
    /** Visual style of the tooltip */
    variant?: TooltipVariant;
    /** When false, hover/focus/touch listeners are disabled */
    isHoverEnabled?: boolean;
    /** The element that triggers the tooltip on hover */
    children: ReactElement;
}
//# sourceMappingURL=Tooltip.types.d.ts.map