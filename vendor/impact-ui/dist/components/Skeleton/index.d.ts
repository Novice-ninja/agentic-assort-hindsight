import { ShimmerDirection, SkeletonProps } from './Skeleton.types';

export type { SkeletonProps, SkeletonVariant, ShimmerDirection, CssSize } from './Skeleton.types';
export declare const getShimmerClass: (direction?: ShimmerDirection) => string;
/**
 * Configurable skeleton placeholder using the shared Impact shimmer.
 */
export declare function Skeleton({ variant, width, height, borderRadius, direction, count, className, style, id, 'data-testid': dataTestId, ...rest }: SkeletonProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace Skeleton {
    var displayName: string;
}
export default Skeleton;
//# sourceMappingURL=index.d.ts.map