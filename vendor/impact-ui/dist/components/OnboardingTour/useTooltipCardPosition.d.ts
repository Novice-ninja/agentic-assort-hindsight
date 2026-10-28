import { CSSProperties, RefObject } from 'react';

type TooltipCardArrowPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
export interface UseTooltipCardPositionOptions {
    /** Distance between the anchor edge and the tooltip card edge in pixels. */
    offset?: number;
    /** Optional key that changes when tooltip content changes, forcing a recalculation. */
    contentKey?: number | string;
}
export interface UseTooltipCardPositionResult {
    /** Ref to attach to the tooltip card wrapper element. */
    wrapperRef: RefObject<HTMLDivElement>;
    /** Positioning styles to apply to the wrapper element. */
    wrapperStyle: CSSProperties;
    /** Whether the position has been computed at least once. */
    isPositioned: boolean;
    /** The resolved arrow placement (requested or auto-detected). */
    arrowPosition: TooltipCardArrowPosition;
}
/**
 * Positions a TooltipCard relative to a consumer-provided anchor element.
 *
 * The card is portaled to document.body, so this hook returns absolute coordinates
 * including scroll offsets. It recalculates on scroll, resize, and when either the
 * anchor or the tooltip wrapper changes size.
 */
export declare const useTooltipCardPosition: (anchorRef: RefObject<HTMLElement> | undefined, arrowPosition: TooltipCardArrowPosition | undefined, { offset, contentKey }?: UseTooltipCardPositionOptions) => UseTooltipCardPositionResult;
export default useTooltipCardPosition;
//# sourceMappingURL=useTooltipCardPosition.d.ts.map