import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

export interface TabItem {
    value: string;
    label: string;
    disabled?: boolean;
    /** Additional MUI Tab props (icon, etc.) */
    [key: string]: unknown;
}
export interface TabsProps extends Omit<BaseComponentProps, 'children'> {
    /** Content for each tab panel (order must match tabNames) */
    tabPanels: (ReactNode | null)[];
    /** Tab headers: value and label for each tab */
    tabNames: TabItem[];
    /** Currently selected tab value */
    value: number | string;
    /** Called when user selects a tab (MUI signature: (event, newValue) => void) */
    onChange?: (event: React.SyntheticEvent, newValue: number | string) => void;
    /** Layout direction of tabs */
    orientation?: 'horizontal' | 'vertical';
    /** Disable all tabs */
    isDisabled?: boolean;
    /** Inline style for the panel container */
    tabPanelStyle?: React.CSSProperties;
    /** If true, unmount panel content when switching tabs (default: true) */
    remountOnTabChange?: boolean;
    /** Use blue background style for tab list */
    isBlueBg?: boolean;
}
//# sourceMappingURL=Tabs.types.d.ts.map