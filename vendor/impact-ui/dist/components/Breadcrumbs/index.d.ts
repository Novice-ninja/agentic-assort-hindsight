import { BreadcrumbsProps } from './Breadcrumbs.types';

export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs.types';
/**
 * Breadcrumbs show the current path and allow navigation back.
 * Long paths are collapsed: first item, "…" menu (middle items), then last item.
 * "Home" label renders the Home icon by default.
 */
export declare function Breadcrumbs({ list, showAllItems, className, id, 'data-testid': dataTestId, ...rest }: BreadcrumbsProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Breadcrumbs {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map