import { DynamicLayoutProps } from './DynamicLayout.types';

export type { DynamicLayoutProps, InjectedLayoutProps } from './DynamicLayout.types';
/**
 * Two-panel layout: left panel (fixed width) and right content that receives
 * contentRef and hasScroll for scroll detection.
 */
export declare function DynamicLayout({ leftPanel, rightContent, leftPanelWidth, className, showStepper, ...props }: DynamicLayoutProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DynamicLayout {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map