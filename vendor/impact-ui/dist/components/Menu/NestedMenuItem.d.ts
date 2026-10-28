import { MenuOption } from './Menu.types';

/** Props for NestedMenuItem - exported for consumers */
export interface NestedMenuItemProps {
    parentMenuOpen: boolean;
    label?: string;
    renderLabel?: (item: MenuOption) => React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    tabIndex?: number;
    ContainerProps?: {
        ref?: React.Ref<HTMLDivElement>;
        onMouseEnter?: (e: React.MouseEvent) => void;
        onMouseLeave?: (e: React.MouseEvent) => void;
        onFocus?: (e: React.FocusEvent) => void;
    };
    MenuProps?: Record<string, unknown>;
    delay?: number;
    item: MenuOption;
    disabled?: boolean;
    handleSelect?: (item: MenuOption, event: React.MouseEvent) => void;
}
declare const NestedMenuItem: import('react').ForwardRefExoticComponent<NestedMenuItemProps & import('react').RefAttributes<HTMLLIElement | null>>;
export { NestedMenuItem };
//# sourceMappingURL=NestedMenuItem.d.ts.map