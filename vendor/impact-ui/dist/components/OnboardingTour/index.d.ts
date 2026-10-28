import { ReactNode, RefObject } from 'react';
import { ProductTourStep } from './productTourList';
import { TooltipCardSlide, TooltipCardArrowPosition } from './tooltipCard';

export type { TooltipCardSlide, TooltipCardArrowPosition } from './tooltipCard';
export type { ProductTourStep, ProductTourListProps } from './productTourList';
export interface OnboardingTourTooltipProps {
    slides: TooltipCardSlide[];
    arrowPosition?: TooltipCardArrowPosition;
    closeLabel?: string;
    showClose?: boolean;
    skipLabel?: string;
    showSkip?: boolean;
    nextLabel?: string;
    showNext?: boolean;
    onClose: () => void;
    onSkip: () => void;
    onNext: () => void;
    anchorRef?: RefObject<HTMLElement>;
}
export interface OnboardingTourProductTourProps {
    steps: ProductTourStep[];
    title?: string;
    minimizedLabel?: string;
    dismissLabel?: string;
    remainingCount?: number;
    onDismiss: () => void;
    onExpand?: () => void;
    onMinimize?: () => void;
}
export interface OnboardingTourProps {
    badgeLabel?: string;
    carouselClassName?: string;
    carouselDurations?: number[];
    carouselOnActiveIndexChange?: (index: number) => void;
    carouselScreens?: ReactNode[];
    description?: string;
    images?: string | string[];
    isSmallScreen?: boolean;
    onClose: () => void;
    playEntrance?: boolean;
    primaryAction?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'url';
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'url';
    };
    title?: string;
    /** Tooltip data + required actions. When provided, Try now advances to the tooltip stage. */
    tooltip?: OnboardingTourTooltipProps;
    /** Product tour data + required actions. When provided, Skip on tooltip advances to the product tour stage. */
    productTour?: OnboardingTourProductTourProps;
    /** Ref attached to the DOM element the tooltip card should anchor to. */
    anchorRef?: RefObject<HTMLElement>;
}
export declare const OnboardingTour: ({ badgeLabel, carouselDurations, carouselOnActiveIndexChange, carouselScreens, carouselClassName, images, description, isSmallScreen, onClose, playEntrance, primaryAction, secondaryAction, title, tooltip, productTour, anchorRef, }: OnboardingTourProps) => import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=index.d.ts.map