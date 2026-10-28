import { SidebarRoute } from './Sidebar.types';

interface ChildMenuProps {
    parent: SidebarRoute;
    active?: string;
    menu: SidebarRoute[];
    showChild: string | null;
    handleRouteChange: (parent: SidebarRoute, child: SidebarRoute, event?: React.MouseEvent | React.KeyboardEvent) => void;
    isMemoryRouter: boolean;
}
export declare function ChildMenu({ parent, active, menu, showChild, handleRouteChange, isMemoryRouter, }: ChildMenuProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ChildMenu {
    var displayName: string;
}
export {};
//# sourceMappingURL=ChildMenu.d.ts.map