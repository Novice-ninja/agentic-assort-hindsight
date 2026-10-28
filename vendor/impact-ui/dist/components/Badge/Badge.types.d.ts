import { ReactNode } from 'react';
import { ChipProps as MUIChipProps } from '@mui/material/Chip';
import { BaseComponentProps } from '../../types';

/**
 * Badge color variants
 */
export type BadgeColor = 'info' | 'error' | 'warning' | 'success';
/**
 * Badge size options
 */
type BadgeSize = 'small' | 'medium';
/**
 * Badge variant styles
 */
type BadgeVariant = 'filled' | 'stroke' | 'subtle';
/**
 * Base props shared across all badge sub-components
 */
export interface BaseBadgeProps extends Omit<BaseComponentProps, 'children'>, Omit<MUIChipProps, 'size' | 'variant' | 'color' | 'icon'> {
    /**
     * The text label to display in the badge
     */
    label?: string;
    /**
     * Icon to display in the badge
     */
    icon?: ReactNode | null;
    /**
     * The color theme of the badge
     */
    color?: BadgeColor;
    /**
     * Whether the badge displays an icon
     */
    isIcon?: boolean;
    /**
     * The size of the badge
     */
    size?: BadgeSize;
}
/**
 * Props for the main Badge component
 */
export interface BadgeProps extends BaseBadgeProps {
    /**
     * The variant style of the badge
     * @default 'filled'
     */
    variant?: BadgeVariant;
}
export {};
//# sourceMappingURL=Badge.types.d.ts.map