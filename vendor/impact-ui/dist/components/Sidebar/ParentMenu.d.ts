import { SidebarRoute } from './Sidebar.types';

interface ParentMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    active?: string;
    item: SidebarRoute;
    showChild: string | null;
    setShowChild: (value: string | null) => void;
    handleRouteChange: (item: SidebarRoute, event?: React.MouseEvent | React.KeyboardEvent) => void;
    isMemoryRouter: boolean;
}
export declare function ParentMenu({ isOpen, setIsOpen, active, item, showChild, setShowChild, handleRouteChange, isMemoryRouter, }: ParentMenuProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ParentMenu {
    var displayName: string;
}
export {};
//# sourceMappingURL=ParentMenu.d.ts.map