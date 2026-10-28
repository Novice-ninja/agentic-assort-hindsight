import { default as React } from 'react';
import { MenuOption } from './Menu.types';

export interface NestedMenuItemsFromObjectParams {
    menuItemsData: MenuOption[];
    isOpen: boolean;
    handleClose?: () => void;
    withCheckbox?: boolean;
    label?: string;
    selected?: {
        value?: string;
    };
    handleSelect?: (item: MenuOption, event: React.MouseEvent) => void;
    selectedItems?: string[];
    icon?: React.ReactNode;
    subLabel?: string;
    [key: string]: unknown;
}
/**
 * Create JSX elements for menu items from a tree of options.
 * Items with `children` become nested submenus; leaf items use IconMenuItem.
 */
export declare function nestedMenuItemsFromObject({ menuItemsData: items, isOpen, handleClose, withCheckbox, label, selected, handleSelect, selectedItems, ...rest }: NestedMenuItemsFromObjectParams): React.ReactNode;
//# sourceMappingURL=nestedMenuItemsFromObject.d.ts.map