import { RefObject } from 'react';

export interface TooltipCardSlide {
    /** Slide heading */
    header: string;
    /** Slide body text */
    description: string;
    /** Optional image URL shown between description and footer */
    image?: string;
}
export interface TooltipCardFooterProps {
    /** Show the close / left-most action */
    showClose?: boolean;
    closeLabel?: string;
    onClose?: () => void;
    /** Show the skip / middle text action */
    showSkip?: boolean;
    skipLabel?: string;
    onSkip?: () => void;
    /** Show the next / primary action */
    showNext?: boolean;
    nextLabel?: string;
    onNext?: () => void;
}
/**
 * Position of the arrow on the card edge.
 * - top-left / top-right    → arrow on the top edge, near left or right
 * - bottom-left / bottom-right → arrow on the bottom edge, near left or right
 * - left-top / left-bottom  → arrow on the left edge, near top or bottom
 * - right-top / right-bottom → arrow on the right edge, near top or bottom
 */
export type TooltipCardArrowPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
export interface TooltipCardProps {
    /** One or more slides. If > 1, a dot carousel is rendered. */
    slides: TooltipCardSlide[];
    footerProps?: TooltipCardFooterProps;
    /** Position of the directional arrow on the card. If omitted, placement is auto-detected from the anchor's viewport position. */
    arrowPosition?: TooltipCardArrowPosition;
    /** Ref attached to the DOM element the tooltip card should anchor to. When provided, the card is portaled to document.body and positioned absolutely next to the anchor. */
    anchorRef?: RefObject<HTMLElement>;
    /** Auto-advance duration in milliseconds when there are multiple slides. Defaults to 2000ms. */
    duration?: number;
}
export declare const TooltipCard: ({ slides, footerProps, arrowPosition, anchorRef, duration, }: TooltipCardProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=tooltipCard.d.ts.map