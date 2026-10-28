import { ReactNode, default as React } from 'react';
import { BaseComponentProps } from '../../types';

/** Single navigation item; may nest `children` for sub-routes. */
export interface SidebarRoute {
    value: string;
    label: string;
    icon?: ReactNode;
    link?: string;
    tooltip?: string;
    isDisabled?: boolean;
    children?: SidebarRoute[];
    /** When true, NavLink uses "#" instead of `link` (legacy open-in-new-page behavior) */
    openInNewPage?: boolean;
}
export interface SidebarProps extends Omit<BaseComponentProps, 'children'> {
    /** Whether the sidebar is expanded */
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    /** Called when the user toggles collapse (e.g. hamburger control) */
    handleClose: () => void;
    /** Primary navigation items */
    routes: SidebarRoute[];
    /** Optional items rendered above the logout area (e.g. settings) */
    actionRoutes?: SidebarRoute[];
    /** Value of the active parent route */
    parentActive?: string;
    handleParentRouteChange: (item: SidebarRoute, event?: React.MouseEvent | React.KeyboardEvent) => void;
    /** Value of the active child route */
    childActive?: string;
    handleChildRouteChange: (parent: SidebarRoute, child: SidebarRoute, event?: React.MouseEvent | React.KeyboardEvent) => void;
    handleLogOut: () => void;
    /** Close sidebar when clicking outside (default true) */
    isCloseWhenClickOutside?: boolean;
    /** Use react-router NavLink + MemoryRouter (default true) */
    isMemoryRouter?: boolean;
    /** Max number of primary routes before “View more” (default 6) */
    visibleModulesCount?: number;
}
//# sourceMappingURL=Sidebar.types.d.ts.map