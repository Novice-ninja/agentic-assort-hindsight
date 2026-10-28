import { ReactNode, CSSProperties, Ref } from 'react';
import { ButtonProps } from '../Button/Button.types';

export interface NewCreateItemFlowProps {
    leftPanelWidth?: string | number;
    leftPanelContent?: ReactNode;
    leftPanelImage?: ReactNode;
    rightContent?: ReactNode;
    title?: string;
    description?: string;
    prevButtonProps?: Partial<ButtonProps>;
    extraButtonProp?: ReactNode;
    nextButtonProps?: Partial<ButtonProps>;
    customCSS?: CSSProperties;
    className?: string;
}
export interface RightContentPanelProps {
    contentRef?: Ref<HTMLDivElement>;
    children?: ReactNode;
}
//# sourceMappingURL=NewCreateItemFlow.types.d.ts.map