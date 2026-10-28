import { default as React } from 'react';

/** Row height (px) — must match Table.styles.scss (26px min-height + 4px padding). */
export declare const SETTINGS_ROW_HEIGHT = 28;
/** Above this many painted rows, use the flat virtualized list instead of nested DOM. */
export declare const SETTINGS_VIRTUALIZE_THRESHOLD = 300;
export declare const SETTINGS_FROZEN_LIST_MAX_HEIGHT = 204;
export declare const SETTINGS_SCROLL_LIST_MAX_HEIGHT = 408;
/** Scroll a windowed settings list when the pointer sits on its top/bottom edge during drag. */
export declare const scrollListTowardPointer: (listEl: any, clientY: any) => boolean;
/** One bottom-up pass: colId → { checked, indeterminate } for the whole column tree. */
export declare const buildCheckStateMap: (columnGroups: any) => Map<any, any>;
/** Flatten a filtered column tree into painted rows (respects collapsed groups). */
export declare const flattenColumnRows: (columns: any, collapsedMap: any, section: any) => any[];
/** Split measured panel height between frozen and scrollable virtual lists. */
export declare const computeSettingsListHeights: ({ shouldVirtualize, listViewportHeight, frozenRowCount, scrollableRowCount, }: {
    shouldVirtualize: any;
    listViewportHeight: any;
    frozenRowCount: any;
    scrollableRowCount: any;
}) => {
    frozen: number;
    scrollable: number;
};
export declare const FrozenListOuter: React.ForwardRefExoticComponent<React.RefAttributes<unknown>>;
export declare const ScrollableListOuter: React.ForwardRefExoticComponent<React.RefAttributes<unknown>>;
/**
 * react-window list with a detached scrollbar (AG Grid pattern) so thumb drag is not
 * fighting row mount/unmount on the same scroll element.
 */
export declare const VirtualColumnList: ({ className, itemData, maxHeight, outerElementType, outerRef, rows, }: {
    className: any;
    itemData: any;
    maxHeight: any;
    outerElementType: any;
    outerRef: any;
    rows: any;
}) => import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=columnsSettingsVirtualList.d.ts.map