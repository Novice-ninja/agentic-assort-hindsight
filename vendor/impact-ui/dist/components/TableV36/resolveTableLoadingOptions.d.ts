/**
 * Resolves AG Grid v36.2 loading options for TableV36.
 *
 * Client-side skeleton rows use `loading` + `loadingRows` (AG Grid >= 36.2.0).
 * Server-side block loading uses per-cell skeletons via
 * `suppressServerSideFullWidthLoadingRow`. `loadingRows` is client-side only.
 *
 * Callers should memoize via `useMemo` / `useRef` per table instance — this
 * helper is intentionally stateless so multiple grids on one page do not share
 * a module-level cache.
 */
/** Default skeleton / SSRM placeholder row count when `loadingRowCount` is omitted. */
export declare const DEFAULT_LOADING_ROW_COUNT = 6;
export interface TableLoadingInput {
    rowModelType?: string;
    loading?: boolean;
    /**
     * Number of skeleton / placeholder rows. Default: 6.
     * Drives client `loadingRows.rowCount` and SSRM `serverSideInitialRowCount`
     * unless those AG Grid props are set explicitly.
     */
    loadingRowCount?: number;
    loadingRows?: boolean | {
        rowCount?: number;
    };
    rowData?: unknown;
    suppressServerSideFullWidthLoadingRow?: boolean;
    serverSideInitialRowCount?: number;
    suppressOverlays?: string[];
}
export interface TableLoadingResolution {
    usesBlockRowModel: boolean;
    showClientSkeleton: boolean;
    loading: boolean | undefined;
    loadingRows: boolean | {
        rowCount?: number;
    } | undefined;
    suppressServerSideFullWidthLoadingRow: boolean | undefined;
    serverSideInitialRowCount: number | undefined;
    suppressOverlays: readonly string[];
}
export declare const resolveLoadingRowCount: (loadingRowCount?: number) => number;
export declare function resolveTableLoadingOptions(input: TableLoadingInput): TableLoadingResolution;
/** Minimal grid API used to restore SSRM skeleton placeholders after purge. */
export interface ServerSideSkeletonRestoreApi {
    getDisplayedRowCount: () => number;
    getDisplayedRowAtIndex: (index: number) => {
        stub?: boolean;
    } | null | undefined;
    setRowCount: (rowCount: number, lastRowIndexKnown?: boolean) => void;
}
/**
 * AG Grid's `refreshStore(purge)` recreates the root cache with a hardcoded row
 * count of 1 (refresh, filter, etc.). When every displayed row is still a stub
 * and the count is below `loadingRowCount`, restore placeholder stubs so the
 * skeleton matches the initial-load UX. Real data (including a single loaded
 * row) is left alone — those nodes are not stubs.
 *
 * @returns true when `setRowCount` was called
 */
export declare function restoreServerSideSkeletonRowCount(api: ServerSideSkeletonRestoreApi | null | undefined, loadingRowCount?: number): boolean;
//# sourceMappingURL=resolveTableLoadingOptions.d.ts.map