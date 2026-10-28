import { ReactNode } from 'react';
import { RootComponentProps } from '../../types';
import { SkeletonProps } from '../Skeleton';
import { BoxProps } from '@mui/material/Box';

/**
 * Loader size variants affecting spinner and skeleton dimensions.
 */
export type LoaderSize = 'small' | 'medium' | 'large';
/**
 * Loader component props.
 * Extends BaseComponentProps; when showSkeleton is true, Skeleton/Box layout is used.
 */
export interface LoaderProps extends RootComponentProps {
    /**
     * Size of the loader (spinner or skeleton blocks).
     * @default 'large'
     */
    size?: LoaderSize;
    /**
     * Optional progress content shown inside the spinner (e.g. percentage).
     * Not shown when size is 'small'.
     */
    progress?: ReactNode;
    /**
     * When true, renders skeleton placeholders instead of the spinner.
     * Uses Impact Skeleton; pass-through props can extend SkeletonProps/BoxProps via rest.
     * @default false
     */
    showSkeleton?: boolean;
    /**
     * Text shown below the loader (e.g. "Loading...").
     * @default 'Loading...'
     */
    text?: ReactNode;
    /**
     * Optional props passed to the root Box when showSkeleton is true.
     * Extends MUI BoxProps.
     */
    boxProps?: Partial<BoxProps>;
    /**
     * Optional props passed to the Skeleton when showSkeleton is true.
     * Extends Impact SkeletonProps.
     */
    skeletonProps?: Partial<SkeletonProps>;
}
export interface LoaderSkeletonDimensions {
    circular: number;
    rectangularWidth: number;
    rectangularHeight: number;
}
//# sourceMappingURL=Loader.types.d.ts.map