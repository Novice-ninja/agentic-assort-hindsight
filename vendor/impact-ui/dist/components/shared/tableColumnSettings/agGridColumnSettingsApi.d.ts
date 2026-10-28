/**
 * Column visibility helpers for Table Settings (AG Grid v36).
 * Prefers `setColumnsVisible` / `setColumnVisible`, with `applyColumnState` fallback.
 */
type GridRefLike = {
    current?: {
        api?: unknown;
        columnApi?: unknown;
    };
} | null | undefined;
export declare function resolveColumnStateApi(gridApi: any, gridRef?: GridRefLike): any;
/** Apply colId→visible using the best API available on this grid version. */
export declare function applyVisibilityMapToGrid(gridApi: any, visibilityMap: any, gridRef?: GridRefLike): void;
export {};
//# sourceMappingURL=agGridColumnSettingsApi.d.ts.map