import { LoaderProps } from './Loader.types';

export type { LoaderProps, LoaderSize } from './Loader.types';
/**
 * Loader component: spinner or skeleton placeholders.
 * Use **showSkeleton** for content loading states; otherwise shows a spinner with optional progress and text.
 */
export declare function Loader({ size, progress, showSkeleton, text, className, id, 'data-testid': dataTestId, 'aria-label': ariaLabel, role, boxProps, skeletonProps, }: LoaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Loader {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map