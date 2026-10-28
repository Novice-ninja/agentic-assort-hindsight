import { default as React } from 'react';
import { MenuProps } from './Menu.types';
import { MenuProps as MuiMenuProps } from '@mui/material/Menu';

export type { MenuProps, MenuOption } from './Menu.types';
export { MenuHeaderInfo, MenuOptionsHeader } from './MenuHeaderInfo';
export type { MenuHeaderInfoProps } from './MenuHeaderInfo.types';
/**
 * Dropdown menu (MUI-based). Supports flat or nested options, checkbox multi-select,
 * custom header (search, select all), loading/empty states, and bottom action buttons.
 * Matches behavior of legacy Menu: does not close on item click unless caller does so in onClick.
 */
export declare const Menu: React.ForwardRefExoticComponent<Omit<MenuProps & Partial<MuiMenuProps>, "ref"> & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=index.d.ts.map