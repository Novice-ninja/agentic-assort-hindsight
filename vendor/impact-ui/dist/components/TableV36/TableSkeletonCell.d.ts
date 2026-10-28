import { ICellRendererParams } from 'ag-grid-community';

/** Same width jitter AG Grid uses so adjacent skeleton bars don't look identical. */
export declare const getSkeletonBarWidth: (rowIndex: number | null | undefined) => string;
/**
 * Builds a cellRendererSelector that shows TableSkeletonCell while infinite
 * placeholder rows have no data, then falls through to the consumer selector.
 */
export declare const createInfiniteSkeletonCellRendererSelector: (consumerSelector?: (params: ICellRendererParams) => {
    component?: unknown;
    params?: unknown;
} | undefined) => (params: ICellRendererParams) => {
    component?: unknown;
    params?: unknown;
} | undefined;
declare const TableSkeletonCell: import('react').MemoExoticComponent<(params: ICellRendererParams) => import("react/jsx-runtime").JSX.Element>;
export default TableSkeletonCell;
//# sourceMappingURL=TableSkeletonCell.d.ts.map