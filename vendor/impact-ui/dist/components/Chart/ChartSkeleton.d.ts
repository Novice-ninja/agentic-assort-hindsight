import { ShimmerDirection } from '../Skeleton';

export type ChartShimmerDirection = ShimmerDirection | 'auto';
export interface ChartSkeletonProps {
    /** Chart type used to pick the skeleton layout and default shimmer direction. */
    graphType?: string;
    /** Optional fixed height for the skeleton plot area. */
    height?: string | number | null;
    /**
     * Skeleton shimmer direction. `auto` picks by chart type
     * (column→btt, bar/line→ltr, pie→circular).
     * @default 'auto'
     */
    shimmerDirection?: ChartShimmerDirection;
    dense?: boolean;
    /** Whether the chart has a dual axis (right Y-axis) */
    hasDualAxis?: boolean;
}
/** Default shimmer direction per chart type when `shimmerDirection` is `auto`. */
export declare const getDefaultShimmerDirection: (graphType?: string) => ShimmerDirection;
export declare function ChartSkeleton({ graphType, height, shimmerDirection, dense, hasDualAxis, }: ChartSkeletonProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ChartSkeleton {
    var displayName: string;
}
export default ChartSkeleton;
//# sourceMappingURL=ChartSkeleton.d.ts.map