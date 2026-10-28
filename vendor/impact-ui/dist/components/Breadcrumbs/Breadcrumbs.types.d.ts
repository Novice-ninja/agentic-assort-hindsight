import { BreadcrumbsProps as MUIBreadcrumbsProps } from '@mui/material/Breadcrumbs';
import { BaseComponentProps } from '../../types';

/**
 * Single breadcrumb item
 */
export interface BreadcrumbItem {
    /** Display label (e.g. "Home", "Products") */
    label: string;
    /** URL for navigation (optional if using onClick) */
    to?: string;
    /** Click handler (optional; used when no `to` or in addition to navigation) */
    onClick?: () => void;
    /** Whether the item is disabled (no link/click) */
    disabled?: boolean;
}
export interface BreadcrumbsProps extends BaseComponentProps, Omit<MUIBreadcrumbsProps, 'children' | 'className' | 'id'> {
    /** List of breadcrumb items (first and last are always shown; middle items can be collapsed into "…" menu) */
    list: BreadcrumbItem[];
    showAllItems?: boolean;
}
//# sourceMappingURL=Breadcrumbs.types.d.ts.map