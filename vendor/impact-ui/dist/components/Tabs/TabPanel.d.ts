import { TabPanelProps } from './TabPanel.types';

export type { TabPanelProps } from './TabPanel.types';
/**
 * Renders tab panel content. Hidden when value !== selectedValue.
 * Optionally unmounts content when not selected (remountOnTabChange).
 */
export declare function CustomTabPanel({ children, value, selectedValue, index, remountOnTabChange, ...other }: TabPanelProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CustomTabPanel {
    var displayName: string;
}
//# sourceMappingURL=TabPanel.d.ts.map