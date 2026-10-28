import { ReactNode, CSSProperties } from 'react';

export interface BaseComponentProps {
    /** Stable DOM id for automation and aria references */
    id?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    'data-testid'?: string;
}
export type Size = 'small' | 'medium' | 'large';
export type Variant = 'primary' | 'secondary' | 'tertiary' | 'text';
export type ButtonType = 'default' | 'destructive';
export interface AriaProps {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-disabled'?: boolean;
    'aria-hidden'?: boolean;
    role?: string;
}
/** Common root props: layout + automation + accessibility */
export type RootComponentProps = BaseComponentProps & Partial<AriaProps>;
//# sourceMappingURL=index.d.ts.map