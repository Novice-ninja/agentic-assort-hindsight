import { TabsProps } from './Tabs.types';

export type { TabsProps, TabItem } from './Tabs.types';
export { CustomTabPanel } from './TabPanel';
export type { TabPanelProps } from './TabPanel.types';
/**
 * Tabs component: tab list + panel area. Uses MUI Tabs under the hood.
 * value can be numeric index or string (tab value); tabNames[].value is used for matching.
 */
export declare function Tabs({ tabPanels, tabNames, value, onChange, orientation, isDisabled, tabPanelStyle, remountOnTabChange, isBlueBg, className, style, 'data-testid': dataTestId, ...args }: TabsProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Tabs {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map