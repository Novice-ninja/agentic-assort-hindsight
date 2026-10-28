import { MenuOption } from './Menu.types';

export interface IconMenuItemProps {
    item: MenuOption;
    icon?: React.ReactNode;
    label?: string;
    renderLabel?: (item: MenuOption) => React.ReactNode;
    withCheckbox?: boolean;
    selectedItems?: string[];
    selected?: {
        value?: string;
    };
    handleSelect?: (item: MenuOption, event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent, item: MenuOption) => void;
    childOpen?: boolean;
    className?: string;
    MenuItemProps?: Record<string, unknown>;
    children?: React.ReactNode;
}
export declare const IconMenuItem: import('react').ForwardRefExoticComponent<IconMenuItemProps & import('react').RefAttributes<HTMLLIElement>>;
//# sourceMappingURL=IconMenuItem.d.ts.map