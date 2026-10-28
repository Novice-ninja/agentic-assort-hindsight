import { FilterPanelItem } from './FilterPanel.types';

export interface PanelSidebarProps {
    filters: FilterPanelItem[];
    active: string;
    setActive: (value: string) => void;
}
export declare function PanelSidebar({ filters, active, setActive }: PanelSidebarProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PanelSidebar {
    var displayName: string;
}
//# sourceMappingURL=PanelSidebar.d.ts.map