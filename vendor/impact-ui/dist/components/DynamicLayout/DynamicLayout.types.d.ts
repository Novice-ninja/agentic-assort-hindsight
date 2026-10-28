import { ReactElement, ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

export interface InjectedLayoutProps {
    contentRef: React.RefObject<HTMLDivElement | null>;
    hasScroll: boolean;
}
export interface DynamicLayoutProps extends BaseComponentProps {
    /**
     * Left panel content (e.g. title, description, image)
     */
    leftPanel: ReactNode;
    /**
     * Right side content (single element; receives contentRef and hasScroll via cloneElement)
     */
    rightContent: ReactElement<InjectedLayoutProps>;
    /**
     * Width of the left panel (e.g. "375px" or "300px")
     */
    leftPanelWidth?: string | number;
    /**
     * Whether to show stepper styling on the right content area
     */
    showStepper?: boolean;
}
//# sourceMappingURL=DynamicLayout.types.d.ts.map