import type { ReactNode, Ref } from 'react';
export interface DataGridColumn<Row> {
  id: string; header: string; groupHeader?: string; width?: number; flex?: number;
  align?: 'start' | 'end' | 'center'; sortable?: boolean; filterable?: boolean;
  pinned?: 'left' | 'right' | null; lockPinned?: boolean; lockPosition?: 'left' | 'right' | boolean; lockVisible?: boolean;
  headerTooltip?: string; headerRender?: () => ReactNode;
  value?: (row: Row) => unknown; render?: (row: Row) => ReactNode; filterValue?: (row: Row) => unknown;
}
export interface DataGridHandle {
  showColumnChooser(): void; expandAllGroups(): void; collapseAllGroups(): void;
  /** Client-side: all filtered/sorted leaves, not just DOM rows. Infinite: loaded leaves only. */
  getDisplayedRows<T = unknown>(): T[];
  getExportViewState(): { filters: unknown; sort: unknown };
}
export interface DataGridProps<Row> {
  columns: DataGridColumn<Row>[]; rows: Row[]; getRowId: (row: Row) => string; ariaLabel: string;
  status?: 'idle' | 'loading' | 'succeeded' | 'failed'; emptyLabel?: string; errorLabel?: string; loadingLabel?: string;
  onRetry?: () => void; retryLabel?: string; rowHeight?: number; headerHeight?: number; groupHeaderHeight?: number; height?: number;
  selectedIds?: readonly string[]; onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (row: Row) => void; onRowHover?: (row: Row | null) => void; hoveredRowId?: string | null; selectedRowId?: string | null;
  rowClassName?: (row: Row) => string | undefined; className?: string; 'data-testid'?: string; pageLoading?: boolean;
  onVisibleRangeChange?: (range: { firstRow: number; lastRow: number }) => void;
  infinite?: { sourceKey: string; pageSize: number; maxBlocksInCache?: number; loadRows: (range: { startRow: number; endRow: number }) => Promise<{ rows: Row[]; lastRow?: number }>; peekRows?: (range: { startRow: number; endRow: number }) => { rows: Row[]; lastRow?: number } | undefined; onVisibleRangeChange?: (range: { firstRow: number; lastRow: number }) => void };
  columnChooser?: boolean; gridRef?: Ref<DataGridHandle>; showColumnFilters?: boolean;
  tree?: { parentIdField: string; defaultExpandedDepth?: number; groupColumn: { header: string; width?: number; pinned?: 'left' | 'right' | null; value: (row: Row) => unknown } };
}
