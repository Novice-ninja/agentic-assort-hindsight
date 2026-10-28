import { default as React } from 'react';

interface NewDynamicLayoutProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    leftPanel?: React.ReactNode;
    rightContent: React.ReactElement;
    leftPanelWidth?: string | number;
    className?: string;
    footer?: React.ReactNode;
    [key: string]: unknown;
}
export declare const NewDynamicLayout: ({ title, description, leftPanel, rightContent, leftPanelWidth, className, footer, ...props }: NewDynamicLayoutProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map