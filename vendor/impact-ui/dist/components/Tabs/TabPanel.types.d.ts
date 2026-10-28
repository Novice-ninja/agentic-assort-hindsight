import { ReactNode } from 'react';

export interface TabPanelProps {
    /** Panel content */
    children: ReactNode;
    /** Value of the tab this panel belongs to (must match tab value) */
    value: string;
    /** Currently selected tab value */
    selectedValue: string;
    /** Index of the tab (for aria-labelledby / id) */
    index: number;
    /** If true, panel content is unmounted when not selected (default: true) */
    remountOnTabChange?: boolean;
}
//# sourceMappingURL=TabPanel.types.d.ts.map