import { SidebarRoute } from './Sidebar.types';

interface SidebarMenusProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    routes: SidebarRoute[];
    parentActive?: string;
    handleParentRouteChange: (item: SidebarRoute, event?: React.MouseEvent | React.KeyboardEvent) => void;
    childActive?: string;
    handleChildRouteChange: (parent: SidebarRoute, child: SidebarRoute, event?: React.MouseEvent | React.KeyboardEvent) => void;
    isMemoryRouter: boolean;
    visibleModulesCount?: number;
}
export declare function SidebarMenus({ isOpen, setIsOpen, routes, parentActive, handleParentRouteChange, childActive, handleChildRouteChange, isMemoryRouter, visibleModulesCount, }: SidebarMenusProps): import("react/jsx-runtime").JSX.Element;
export declare namespace SidebarMenus {
    var displayName: string;
}
export {};
//# sourceMappingURL=SidebarMenus.d.ts.map