import { ReactNode } from 'react';
import { GetRowIdFunc } from 'ag-grid-community';
import { AgGridReactProps } from 'ag-grid-react';

/**
 * AG Grid v36 Table props.
 *
 * Extends AgGridReactProps from ag-grid-react v36. Consumers migrating from Table (v32)
 * should note:
 * - `enableRangeSelection` → use `cellSelection` (set by TableV36 by default)
 * - ColDef `suppressMenu` → `suppressHeaderMenuButton` (TableV36 still accepts both)
 * - `domLayout` defaults to `"normal"` (enables row virtualization). Consumers who previously
 *   relied on the implicit `"autoHeight"` behavior must explicitly pass `domLayout="autoHeight"`.
 *   Note: `"autoHeight"` disables row virtualization.
 * - `animateRows` defaults to `false` for performance (sorting/grouping row animations off).
 *   Pass `animateRows={true}` to restore animations.
 * - `cellSelection` defaults to `false` (opt-in). Pass `cellSelection={true}` for range selection.
 * - Provide `getRowId` for immutable updates, transactions, selection persistence, and
 *   optimal row refresh. TableV36 does not invent a default (no row-index fallback).
 * - Set `enableValueCache` only when you have expensive `valueGetter`s / immutable updates.
 * - Minimum TypeScript for AG Grid v36 packages is 5.8.3
 * - Skeleton rows require AG Grid >= 36.2.0. Pass `loading` to show them.
 *   Client-side: `loading={true}` (or omit `rowData`) shows skeleton rows via `loadingRows`
 *   instead of the loading overlay. `loading={false}` with `rowData={[]}` is the empty state.
 *   Server-side: in-flight blocks use per-cell skeletons and do not replace loaded rows.
 *   Use `loadingRowCount` (default 6) to control how many skeleton / SSRM placeholder rows
 *   appear. Explicit `loadingRows` / `serverSideInitialRowCount` still override it.
 */
export interface TableProps extends Omit<AgGridReactProps, 'rowHeight'> {
    tableHeader?: string;
    rowHeight?: 'comfort' | 'compact' | number;
    height?: string | number;
    topRightOptions?: ReactNode;
    topLeftOptions?: ReactNode;
    bottomLeftOptions?: ReactNode;
    bottomCenterOptions?: ReactNode;
    cardContainer?: boolean;
    gridId?: string;
    hideTableBody?: boolean;
    onSearchApplyClick?: (filters: unknown[]) => void;
    onPaginationChanged?: (params: unknown) => void;
    viewPoint?: string;
    disableContextualFilter?: boolean;
    disableTableSettings?: boolean;
    showBulkActionBar?: boolean;
    bulkActionBarProps?: {
        actionBarLabel?: string;
        enableSelectAll?: boolean;
        totalRowCount?: number;
    };
    onSelectAllRows?: () => void;
    onClearSelection?: () => void;
    onSortChanged?: (params: unknown) => void;
    advanceSortEnabled?: boolean;
    enableCommentPanel?: boolean;
    isCommentFeatureEnabled?: boolean;
    commentProps?: Record<string, unknown>;
    extraNumericFormatOptions?: Array<{
        label: string;
        value: string;
    }>;
    /**
     * Number of skeleton rows shown while loading (client-side) and initial
     * placeholder rows for the server-side row model. Default: 6.
     * Explicit AG Grid `loadingRows` / `serverSideInitialRowCount` override this.
     */
    loadingRowCount?: number;
    /**
     * When true and `height` is omitted, the table fills its parent height
     * instead of the default 500px max. Uses domLayout="normal". Default: false.
     * The parent must have a definite height for `height: 100%` to resolve.
     */
    fullViewPortTakeAllSpace?: boolean;
    /**
     * Opt-in AG Grid value cache. Useful with expensive valueGetters and immutable row updates.
     * Default: false (avoids stale cache surprises for unaware consumers).
     */
    enableValueCache?: boolean;
    /**
     * Extra rows rendered outside the viewport (AG Grid rowBuffer). Default: 8.
     * Lower values speed initial draw; higher values smooth fast scrolling. Benchmark 5 / 8 / 12.
     */
    rowBuffer?: number;
    /**
     * When false (default), disables row insert/remove/sort animations for better scroll performance.
     * Set true if you prefer animated sorting/grouping and accept the CPU cost.
     */
    animateRows?: boolean;
    /** Disable column move animation during drag (smoother with many columns). Default: false. */
    suppressColumnMoveAnimation?: boolean;
    /** Disable row hover highlight (can improve scroll FPS). Default: false. */
    suppressRowHoverHighlight?: boolean;
    /**
     * When true, body cells wrap and clamp to the current row height (default/comfort).
     * Compact (30px) always stays single-line ellipsis. Does not grow rows.
     * Default: false.
     */
    enableRowTextWrap?: boolean;
    /** When true, header titles wrap and clamp to header height. Default: true. */
    enableHeaderTextWrap?: boolean;
    /**
     * Pass-through only — TableV36 does not default to row index.
     * Required for immutable updates, transactions, and selection persistence.
     */
    getRowId?: GetRowIdFunc;
    /**
     * Debounced callback (200ms) invoked after column move/resize finishes with column state.
     * Prefer this over listening to every `columnMoved` pixel for persistence.
     */
    onColumnStateChange?: (columnState: unknown[]) => void;
    /**
     * AG Grid `context` — merged with TableV36's internal comment helpers.
     * Your keys are available in cell renderers / value getters via `params.context`.
     * Reserved keys (comments, popup, comment handlers, configuration, colIdentifierKey)
     * are owned by TableV36 when comments are enabled.
     */
    context?: AgGridReactProps['context'];
    /**
     * When true, adds a 4px color bar on the left of the selection column keyed by
     * `ag-row-level-N`. Each nesting level maps to a Figma-defined color.
     * Only visible when row grouping + the v36 selection column are active.
     * Default: false.
     */
    enableHierarchyLevelColors?: boolean;
    [key: string]: unknown;
}
//# sourceMappingURL=Table.types.d.ts.map