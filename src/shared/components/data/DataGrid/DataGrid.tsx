import { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { AgGridProvider, AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import type {
  ColDef,
  ColGroupDef,
  GridApi,
  ICellRendererParams,
  IDatasource,
  RowClassParams,
  SelectionChangedEvent,
  SizeColumnsToFitGridStrategy,
  ValueGetterParams,
} from 'ag-grid-community';
import { Button } from '@shared/components/primitives';
import { useAgGridThemeClass } from '@shared/components/visualization';
import { AG_GRID_LICENSE_KEY } from '../agGridLicenseKey';
import { nameGridForScreenReaders } from '../nameGridForScreenReaders';
import '../agGridLayout.css';
import type { DataGridColumn, DataGridHandle, DataGridProps } from './DataGrid.types';
import { DATA_GRID_COLUMN_CHOOSER_MODULES } from './registerDataGridColumnChooser';
import { DATA_GRID_TREE_MODULES } from './registerDataGridTree';
import styles from './DataGrid.module.css';

const DEFAULT_ROW_HEIGHT = 44;
const DEFAULT_HEADER_HEIGHT = 40;
const DEFAULT_GROUP_HEADER_HEIGHT = 36;
const SHIMMER_ROW_COUNT = 10;
const FIT_GRID_WIDTH: SizeColumnsToFitGridStrategy = { type: 'fitGridWidth' };
const H_SCROLL_MAX_VAR = '--data-grid-h-scroll-max';
/** Inset from the grid's top-right corner for the column chooser dialog. */
const COLUMN_CHOOSER_EDGE_GAP_PX = 8;
/** AG Grid's own name for the auto-generated hierarchy column. */
const AUTO_GROUP_COL_ID = 'ag-Grid-AutoColumn';
/** Floor width for the Product Hierarchy / tree column when the host omits one. */
const DEFAULT_TREE_COLUMN_WIDTH = 220;

/**
 * Puts host columns locked to the left edge ahead of AG Grid's tree auto-group column.
 * Without this, the auto-group column wins the first slot among left-pinned columns.
 */
function placeLeadingPinnedColumnsBeforeTree<Row>(
  api: GridApi<Row> | undefined,
  columns: DataGridColumn<Row>[],
) {
  if (api === undefined) return;
  const leadingIds = columns
    .filter((column) => column.lockPosition === 'left')
    .map((column) => column.id);
  if (leadingIds.length === 0) return;
  api.moveColumns(leadingIds, 0);
}

function alignClass(column: DataGridColumn<unknown>): string | undefined {
  if (column.align === 'end') return styles.alignEnd;
  if (column.align === 'center') return styles.alignCenter;
  return undefined;
}

/** Publishes max inline scroll so pinned-header scroll-driven animations stay in lockstep. */
function publishHorizontalScrollMax(root: HTMLElement | null) {
  if (root === null) return;
  const viewport = root.querySelector<HTMLElement>('.ag-grid-viewport');
  if (viewport === null) return;
  const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  root.style.setProperty(H_SCROLL_MAX_VAR, `${max}px`);
}

/**
 * AG Grid centres the chooser by default. Stick it to the grid's top-right so it opens next to
 * the toolbar "…" that launched it (via `postProcessPopup`, type `columnChooser`).
 */
function positionColumnChooserTopRight(
  ePopup: HTMLElement,
  gridRoot: HTMLElement | null,
) {
  if (gridRoot === null) return;

  const grid = gridRoot.getBoundingClientRect();
  const popupWidth = ePopup.offsetWidth || 300;
  const popupHeight = ePopup.offsetHeight || 300;
  const parent = ePopup.offsetParent instanceof HTMLElement ? ePopup.offsetParent : null;
  const origin = parent?.getBoundingClientRect() ?? { top: 0, left: 0 };
  const gap = COLUMN_CHOOSER_EDGE_GAP_PX;

  let top = grid.top - origin.top + gap;
  let left = grid.right - origin.left - popupWidth - gap;

  // Keep the dialog on-screen when the grid sits near a viewport edge.
  const minTop = gap - origin.top;
  const minLeft = gap - origin.left;
  const maxTop = window.innerHeight - gap - popupHeight - origin.top;
  const maxLeft = window.innerWidth - gap - popupWidth - origin.left;
  top = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));
  left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));

  ePopup.style.top = `${Math.round(top)}px`;
  ePopup.style.left = `${Math.round(left)}px`;
}

/**
 * Builds the grid's column definitions, collapsing runs of columns that share a
 * `groupHeader` into a single spanning header. Grouping consecutive runs rather than all
 * columns with a matching name keeps the caller's column order authoritative.
 */
function toColumnDefs<Row>(
  columns: DataGridColumn<Row>[],
  sortable: boolean,
  showColumnFilters: boolean,
): (ColDef<Row> | ColGroupDef<Row>)[] {
  const defs: (ColDef<Row> | ColGroupDef<Row>)[] = [];

  columns.forEach((column) => {
    const lockPinned =
      column.lockPinned ?? (column.pinned !== undefined ? true : undefined);
    const columnFilterable = showColumnFilters && (column.filterable ?? true);
    const def: ColDef<Row> = {
      colId: column.id,
      headerName: column.header,
      sortable: sortable && (column.sortable ?? true),
      pinned: column.pinned,
      lockPinned,
      lockPosition: column.lockPosition,
      // Identity / frozen columns stay in the chooser as checked and cannot be cleared.
      lockVisible: column.lockVisible ?? (lockPinned === true ? true : undefined),
      width: column.width,
      /*
       * A declared width is a floor, not a suggestion: fitting the grid's width must never squeeze
       * a column below what its content needs. Once the declared widths no longer fit, the grid
       * scrolls horizontally and the pinned columns stay put, which is the point of pinning them.
       */
      minWidth: column.width,
      flex: column.flex,
      headerTooltip: column.headerTooltip ?? column.header,
      cellClass: alignClass(column as DataGridColumn<unknown>),
      headerClass: alignClass(column as DataGridColumn<unknown>),
      headerComponent:
        column.headerRender === undefined
          ? undefined
          : function DataGridHeader() {
              return column.headerRender?.() ?? null;
            },
      valueGetter:
        column.value === undefined
          ? undefined
          : (params: ValueGetterParams<Row>) =>
              params.data === undefined ? null : column.value?.(params.data),
      /*
       * Per-column floating search. Text filter covers both string and numeric `value` getters
       * (numbers are compared as text contains). Custom renderers still filter via valueGetter.
       * Hosts can opt a column out (e.g. row checkboxes) with `filterable: false`.
       */
      filter: columnFilterable ? 'agTextColumnFilter' : false,
      floatingFilter: columnFilterable,
      filterParams: columnFilterable
        ? {
            filterOptions: ['contains'],
            maxNumConditions: 1,
            debounceMs: 200,
          }
        : undefined,
      cellRenderer:
        column.render === undefined
          ? undefined
          : (params: ICellRendererParams<Row>) =>
              params.data === undefined ? null : column.render?.(params.data),
    };

    /*
     * Only attach filterValueGetter when the host opts in. Omitting the key leaves hosts that
     * only supply `value` unchanged (AG Grid falls back to valueGetter for the text filter).
     */
    if (column.filterValue !== undefined) {
      def.filterValueGetter = (params: ValueGetterParams<Row>) =>
        params.data === undefined ? null : column.filterValue?.(params.data);
    }

    const previous = defs[defs.length - 1];
    const isGroup = (candidate: unknown): candidate is ColGroupDef<Row> =>
      candidate !== undefined &&
      typeof candidate === 'object' &&
      candidate !== null &&
      'children' in candidate;

    if (column.groupHeader !== undefined) {
      if (isGroup(previous) && previous.headerName === column.groupHeader) {
        previous.children.push(def);
        return;
      }
      defs.push({ headerName: column.groupHeader, children: [def], marryChildren: true });
      return;
    }

    /*
     * Beside column groups, AG Grid spans a lone leaf across the group + leaf header rows so
     * labels like "Attribute Value" sit vertically centered in the full header band. Hosts that
     * pin those columns must allow overflow on the leaf pin wrapper (see AttributeBreakdownTable)
     * or `overflow: hidden` for the pin scroll animation will crop the ⋮.
     */
    defs.push(def);
  });

  return defs;
}

/**
 * The single grid adapter. Callers describe columns declaratively and never see the
 * underlying grid's API, which is what allows the grid library to be replaced without
 * touching a single widget.
 *
 * Rows are virtualized by the grid, so a large item collection renders and scrolls without
 * the caller doing anything about it.
 */
export function DataGrid<Row>({
  columns,
  rows,
  getRowId,
  ariaLabel,
  status = 'succeeded',
  emptyLabel,
  errorLabel,
  loadingLabel,
  onRetry,
  retryLabel,
  rowHeight = DEFAULT_ROW_HEIGHT,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  selectedIds,
  onSelectionChange,
  groupHeaderHeight = DEFAULT_GROUP_HEADER_HEIGHT,
  height,
  onRowClick,
  onRowHover,
  hoveredRowId,
  selectedRowId,
  rowClassName,
  className,
  'data-testid': testId,
  pageLoading = false,
  onVisibleRangeChange,
  infinite,
  columnChooser = false,
  gridRef: handleRef,
  showColumnFilters = false,
  tree,
}: DataGridProps<Row>) {
  const themeClass = useAgGridThemeClass();
  const gridRef = useRef<AgGridReactType<Row>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loadRowsRef = useRef(infinite?.loadRows);
  loadRowsRef.current = infinite?.loadRows;
  const peekRowsRef = useRef(infinite?.peekRows);
  peekRowsRef.current = infinite?.peekRows;
  // Prefer the host prop; infinite model may also supply a range listener for prefetch.
  const onVisibleRangeChangeRef = useRef(onVisibleRangeChange ?? infinite?.onVisibleRangeChange);
  onVisibleRangeChangeRef.current = onVisibleRangeChange ?? infinite?.onVisibleRangeChange;
  const syncingSelection = useRef(false);
  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

  const infiniteMode = infinite !== undefined;
  const treeMode = !infiniteMode && tree !== undefined;
  const filtersEnabled = showColumnFilters && !infiniteMode;
  const showShimmer =
    !pageLoading && (status === 'loading' || (infiniteMode && status === 'idle'));
  const enableSelection = !infiniteMode;
  const lockScroll = pageLoading;
  const columnDefs = useMemo(
    () => toColumnDefs(columns, !infiniteMode, filtersEnabled),
    [columns, infiniteMode, filtersEnabled],
  );

  const autoGroupColumnDef = useMemo<ColDef<Row> | undefined>(() => {
    if (!treeMode || tree === undefined) return undefined;
    const width = tree.groupColumn.width ?? DEFAULT_TREE_COLUMN_WIDTH;
    return {
      headerName: tree.groupColumn.header,
      colId: AUTO_GROUP_COL_ID,
      // Explicit null lets a narrow host return the hierarchy to the scrollable center.
      // Omitting this option retains the original left-frozen behavior for every other grid.
      pinned: tree.groupColumn.pinned === undefined ? 'left' : tree.groupColumn.pinned,
      lockPinned: true,
      lockVisible: true,
      width,
      minWidth: width,
      valueGetter: (params: ValueGetterParams<Row>) =>
        params.data === undefined ? '' : tree.groupColumn.value(params.data),
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, [tree, treeMode]);

  const providerModules = useMemo(() => {
    const modules = [];
    if (columnChooser) modules.push(...DATA_GRID_COLUMN_CHOOSER_MODULES);
    if (treeMode) modules.push(...DATA_GRID_TREE_MODULES);
    return modules;
  }, [columnChooser, treeMode]);

  const defaultColDef = useMemo<ColDef<Row>>(
    () => ({ resizable: true, suppressMovable: true, sortable: !infiniteMode }),
    [infiniteMode],
  );

  const postProcessPopup = useCallback(
    (params: { type: string; ePopup: HTMLElement }) => {
      if (!columnChooser || params.type !== 'columnChooser') return;
      positionColumnChooserTopRight(params.ePopup, wrapperRef.current);
    },
    [columnChooser],
  );

  useImperativeHandle(
    handleRef,
    (): DataGridHandle => ({
      showColumnChooser: () => {
        if (!columnChooser) return;
        gridRef.current?.api?.showColumnChooser();
      },
      expandAllGroups: () => {
        if (!treeMode) return;
        gridRef.current?.api?.expandAll();
      },
      collapseAllGroups: () => {
        if (!treeMode) return;
        gridRef.current?.api?.collapseAll();
      },
      getDisplayedRows: <T,>(): T[] => {
        const api = gridRef.current?.api;
        if (!api) return [];
        const result: Row[] = [];
        const collect = (node: { data?: Row; group?: boolean }) => { if (node.data !== undefined && !node.group) result.push(node.data); };
        // Infinite tables can expose only their loaded rows. Client tables export the full
        // filtered/sorted leaf population, including rows outside the DOM viewport.
        if (infiniteMode) api.forEachNode(collect);
        else api.forEachNodeAfterFilterAndSort(collect);
        return result as unknown as T[];
      },
      getExportViewState: () => {
        const api = gridRef.current?.api;
        return { filters: api?.getFilterModel() ?? {}, sort: api?.getColumnState().filter(column => column.sort).map(column => ({ column: column.colId, direction: column.sort, order: column.sortIndex })) ?? [] };
      },
    }),
    [columnChooser, treeMode, infiniteMode],
  );

  // Closing the filter row clears active filters so hidden inputs do not keep rows filtered.
  useEffect(() => {
    if (filtersEnabled) return;
    gridRef.current?.api?.setFilterModel(null);
  }, [filtersEnabled]);

  const datasource = useMemo<IDatasource | undefined>(() => {
    if (!infiniteMode) return undefined;
    return {
      getRows: (params) => {
        const loadRows = loadRowsRef.current;
        if (loadRows === undefined) {
          params.successCallback([], params.startRow);
          return;
        }
        const peekRows = peekRowsRef.current;
        if (peekRows !== undefined) {
          const peeked = peekRows({ startRow: params.startRow, endRow: params.endRow });
          if (peeked !== undefined) {
            params.successCallback(peeked.rows, peeked.lastRow);
            return;
          }
        }
        void loadRows({ startRow: params.startRow, endRow: params.endRow })
          .then(({ rows: block, lastRow }) => {
            params.successCallback(block, lastRow);
          })
          .catch(() => {
            params.failCallback();
          });
      },
    };
  }, [infiniteMode]);

  const onViewportChanged = useCallback(
    (event: { firstRow: number; lastRow: number }) => {
      onVisibleRangeChangeRef.current?.({
        firstRow: event.firstRow,
        lastRow: event.lastRow,
      });
    },
    [],
  );

  const applySelectedIds = useCallback(() => {
    const api = gridRef.current?.api;
    if (api === undefined || !enableSelection) return;
    const selected = new Set(selectedIds ?? []);
    syncingSelection.current = true;
    api.forEachNode((node) => {
      if (node.data === undefined) return;
      const shouldSelect = selected.has(getRowId(node.data));
      if (node.isSelected() !== shouldSelect) {
        node.setSelected(shouldSelect, false);
      }
    });
    syncingSelection.current = false;
  }, [enableSelection, getRowId, selectedIds]);

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent<Row>) => {
      if (
        !enableSelection ||
        onSelectionChange === undefined ||
        syncingSelection.current
      ) {
        return;
      }
      const next = event.api.getSelectedRows().map((row) => getRowId(row));
      const current = selectedIdsRef.current ?? [];
      if (
        next.length === current.length &&
        next.every((id, index) => id === current[index])
      ) {
        return;
      }
      onSelectionChange(next);
    },
    [enableSelection, getRowId, onSelectionChange],
  );

  // The vendor DOM exists from `gridReady` onwards, so that is the first chance to name it.
  const onGridReady = useCallback(() => {
    nameGridForScreenReaders(wrapperRef.current, ariaLabel);
    publishHorizontalScrollMax(wrapperRef.current);
    // fitGridWidth settles column widths after the first paint.
    requestAnimationFrame(() => publishHorizontalScrollMax(wrapperRef.current));
    placeLeadingPinnedColumnsBeforeTree(gridRef.current?.api, columns);
  }, [ariaLabel, columns]);

  /*
   * AG Grid inserts the tree auto-group column at the front of the left pin. Host columns that
   * ask for `lockPosition: 'left'` (e.g. a selection checkbox) must be moved back to index 0
   * whenever tree mode or the column list changes.
   */
  useEffect(() => {
    if (!treeMode) return;
    placeLeadingPinnedColumnsBeforeTree(gridRef.current?.api, columns);
  }, [treeMode, columns, columnDefs, autoGroupColumnDef]);

  const refreshPinnedHeaderScrollMax = useCallback(() => {
    publishHorizontalScrollMax(wrapperRef.current);
  }, []);

  // Switching language rewrites the label, and the grid is not remounted for it.
  useEffect(() => {
    nameGridForScreenReaders(wrapperRef.current, ariaLabel);
  }, [ariaLabel]);

  // Column floors / container size change the scroll range; republish without touching scroll frames.
  useEffect(() => {
    publishHorizontalScrollMax(wrapperRef.current);
  }, [columnDefs, height, rows.length]);

  useEffect(() => {
    if (!infiniteMode) return;
    const api = gridRef.current?.api;
    if (api === undefined) return;
    rows.forEach((row) => {
      const node = api.getRowNode(getRowId(row));
      if (node !== undefined) {
        node.setData(row);
      }
    });
  }, [getRowId, infiniteMode, rows]);

  const rowClass = useCallback(
    (params: RowClassParams<Row>) => {
      if (params.data === undefined) return undefined;
      const classes: string[] = [];
      if (selectedRowId === getRowId(params.data)) classes.push(styles.rowSelected);
      const extra = rowClassName?.(params.data);
      if (extra !== undefined && extra.length > 0) classes.push(extra);
      return classes.length > 0 ? classes : undefined;
    },
    [getRowId, rowClassName, selectedRowId],
  );

  // Externally driven hover: paint the matching row nodes with a class of our own. It is separate
  // from AG Grid's `ag-row-hover`, which the grid adds and removes as the pointer moves; sharing it
  // would strip the pointer's own hover. Touching the class directly (rather than redrawing rows)
  // keeps the pointer's mouseover/out events alive.
  useEffect(() => {
    const root = wrapperRef.current;
    if (root === null || hoveredRowId === undefined) return undefined;
    const marked: Element[] = [];
    if (hoveredRowId !== null) {
      root.querySelectorAll('.ag-row[row-id]').forEach((node) => {
        if (node.getAttribute('row-id') === hoveredRowId) {
          node.classList.add(styles.rowLinkedHover);
          marked.push(node);
        }
      });
    }
    return () => marked.forEach((node) => node.classList.remove(styles.rowLinkedHover));
  }, [hoveredRowId]);

  // Pinned and centre rows are separate DOM nodes. Re-read row classes when selection changes
  // so a checked checkbox paints the whole row, not only the pinned cell.
  useEffect(() => {
    if (rowClassName === undefined) return;
    gridRef.current?.api?.redrawRows();
  }, [rowClass, rowClassName]);

  if (status === 'failed') {
    return (
      <div className={styles.state} data-testid={testId}>
        <p className={styles.stateText}>{errorLabel}</p>
        {onRetry !== undefined && (
          <Button variant="secondary" size="small" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  if (status === 'succeeded' && !infiniteMode && rows.length === 0) {
    return (
      <div className={styles.state} data-testid={testId}>
        <p className={styles.stateText}>{emptyLabel}</p>
      </div>
    );
  }

  const grid = (
    <AgGridReact<Row>
      key={infinite?.sourceKey}
      ref={gridRef}
      rowData={infiniteMode ? undefined : rows}
      rowModelType={infiniteMode ? 'infinite' : undefined}
      datasource={datasource}
      cacheBlockSize={infinite?.pageSize}
      maxBlocksInCache={infinite?.maxBlocksInCache}
      maxConcurrentDatasourceRequests={infiniteMode ? 1 : undefined}
      cacheOverflowSize={infiniteMode ? 0 : undefined}
      blockLoadDebounceMillis={infiniteMode ? 50 : undefined}
      infiniteInitialRowCount={infiniteMode ? infinite.pageSize : undefined}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      getRowId={(params) => {
        const data = params.data as Row | undefined;
        return data === undefined ? 'placeholder' : getRowId(data);
      }}
      getRowClass={rowClass}
      rowHeight={rowHeight}
      headerHeight={headerHeight}
      groupHeaderHeight={groupHeaderHeight}
      treeData={treeMode || undefined}
      treeDataParentIdField={
        treeMode && tree !== undefined ? tree.parentIdField : undefined
      }
      autoGroupColumnDef={autoGroupColumnDef}
      groupDefaultExpanded={
        treeMode && tree !== undefined ? (tree.defaultExpandedDepth ?? 0) : undefined
      }
      loading={pageLoading}
      overlayLoadingTemplate={
        loadingLabel === undefined
          ? undefined
          : `<span role="status">${loadingLabel}</span>`
      }
      overlayNoRowsTemplate={
        emptyLabel === undefined ? undefined : `<span>${emptyLabel}</span>`
      }
      onGridReady={onGridReady}
      onGridSizeChanged={refreshPinnedHeaderScrollMax}
      onDisplayedColumnsChanged={refreshPinnedHeaderScrollMax}
      onColumnResized={refreshPinnedHeaderScrollMax}
      onViewportChanged={
        infiniteMode || onVisibleRangeChange !== undefined ? onViewportChanged : undefined
      }
      onCellMouseOver={
        onRowHover === undefined
          ? undefined
          : (event) => onRowHover(event.data === undefined ? null : event.data)
      }
      onCellMouseOut={onRowHover === undefined ? undefined : () => onRowHover(null)}
      onRowClicked={
        onRowClick === undefined
          ? undefined
          : (event) => {
              if (event.data !== undefined) onRowClick(event.data);
            }
      }
      domLayout={height === undefined ? 'autoHeight' : 'normal'}
      /*
       * Spare width is shared out, but no column is squeezed below its declared width. Unlike a
       * `sizeColumnsToFit` call on ready, this also survives a later container resize.
       */
      autoSizeStrategy={FIT_GRID_WIDTH}
      postProcessPopup={columnChooser ? postProcessPopup : undefined}
      floatingFiltersHeight={filtersEnabled ? 36 : undefined}
      tooltipShowDelay={500}
    />
  );

  return (
    <div
      ref={wrapperRef}
      className={[
        themeClass,
        styles.grid,
        lockScroll ? styles.scrollLocked : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={height === undefined ? undefined : { height }}
      data-testid={testId}
      aria-busy={pageLoading || undefined}
    >
      <AgGridProvider modules={providerModules} licenseKey={AG_GRID_LICENSE_KEY}>
        {grid}
      </AgGridProvider>
      {showShimmer && (
        <div className={styles.shimmerOverlay} role="status" aria-label={loadingLabel}>
          {Array.from({ length: SHIMMER_ROW_COUNT }, (_, i) => (
            <div key={i} className={styles.shimmerRow} aria-hidden="true" />
          ))}
        </div>
      )}
    </div>
  );
}
