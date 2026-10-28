import { CSSProperties, HTMLAttributes } from 'react';
import { AriaProps, RootComponentProps } from '../../types';

export type SkeletonVariant = 'rectangular' | 'rounded' | 'circular' | 'text' | 'pill';
export type ShimmerDirection = 'ltr' | 'rtl' | 'btt' | 'ttb' | 'circular';
export type CssSize = number | string;
/**
 * Configurable skeleton placeholder powered by the shared Impact shimmer.
 */
export interface SkeletonProps extends Omit<RootComponentProps, keyof AriaProps>, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /**
     * Shape of the skeleton.
     * @default 'rectangular'
     */
    variant?: SkeletonVariant;
    /** Width in px (number) or any CSS size string. */
    width?: CssSize;
    /** Height in px (number) or any CSS size string. */
    height?: CssSize;
    /** Optional border-radius override (number → px). */
    borderRadius?: CssSize;
    /**
     * Shimmer direction:
     * - ltr: left → right
     * - rtl: right → left
     * - btt: bottom → top (columns)
     * - ttb: top → bottom
     * - circular: rotates around (pie / donut)
     * @default 'ltr'
     */
    direction?: ShimmerDirection;
    /**
     * Number of skeleton items (useful for text lines).
     * @default 1
     */
    count?: number;
    style?: CSSProperties;
}
//# sourceMappingURL=Skeleton.types.d.ts.map