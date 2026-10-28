import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridProvider, AgGridReact } from 'ag-grid-react';
import type {
  CellDoubleClickedEvent,
  CellEditRequestEvent,
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  CellPosition,
  CellSelectionChangedEvent,
  ColDef,
  ColGroupDef,
  ColumnState,
  GetLocaleTextParams,
  GridApi,
  GridReadyEvent,
  IAggFuncParams,
  ICellRendererParams,
  IRowNode,
  ProcessDataFromClipboardParams,
  SuppressKeyboardEventParams,
  TabToNextCellParams,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';
import { useTheme } from '@app/providers/ThemeProvider';
import { isDev } from '@config/env';
import { Button } from '@shared/components/primitives';
import { directionFor } from '@shared/i18n';
import { nameGridForScreenReaders } from '../nameGridForScreenReaders';
import '../agGridLayout.css';
import { PairedValueCell } from './cells/PairedValueCell';
import { RowActionCell, rowActionSuppressKeyboardEvent } from './cells/RowActionCell';
import { aggregate, type AggregateInput } from './logic/aggregators';
import {
  SchemaValidationError,
  buildColumnDefs,
  type BuiltColumn,
  type BuiltColumns,
  type BuiltLeafColumn,
} from './logic/buildColumnDefs';
import { mapPaste, serialiseCsv, serialiseTsv, type PasteColumn } from './logic/clipboard';
import {
  createJournal,
  dropRows,
  record as recordEdit,
  redo as redoJournal,
  undo as undoJournal,
} from './logic/editJournal';
import {
  keyAction,
  nextEditableCell,
  targetForAction,
  type CellAddress,
  type NavigableColumn,
} from './logic/keyboardNavigation';
import { EM_DASH, formatCellValue, parseLocaleDate, parseLocaleNumber } from './logic/localeNumber';
import { getModifiedRowIds, isCellModified } from './logic/modifiedState';
import { MATRIX_GRID_LICENSE_KEY, MATRIX_GRID_MODULES } from './registerMatrixGridModules';
import type {
  CellValue,
  ColumnAggregator,
  EditRecord,
  EditSource,
  MatrixGridHandle,
  MatrixGridProps,
  PasteOutcome,
  RowDatum,
  SelectionRange,
} from './MatrixGrid.types';
import styles from './MatrixGrid.module.css';

/**
 * The AG Grid adapter — the ONLY file in the repository permitted to import `ag-grid-*`
 * (constitution v3.0.0 Principle I, contract §1). Everything above it sees the prop and event
 * surface in `MatrixGrid.types.ts`; everything below it is pure logic in `logic/`.
 *
 * Three invariants explain most of what looks unusual here:
 *
 * 1. **The host owns the data.** `readOnlyEdit` means the grid never mutates a row; it asks, we
 *    validate, and the host applies the change and passes new rows back (research R4). That is why
 *    editing is an event stream and not a setter.
 * 2. **Nothing is stored that can be derived.** `modified` comes from comparing a pair's two values
 *    on every render, so it cannot go stale after an undo or a refresh (research R5).
 * 3. **Neither theme nor direction is a prop.** They come from `useTheme()` and the locale, because
 *    a prop a consumer can set inconsistently with the app's providers is how a grid ends up light
 *    in dark mode or unmirrored in Arabic (contract §7, §8; research R13).
 */

const DEFAULT_UNDO_DEPTH = 50;
const ROW_ACTION_COL_ID = '__matrixRowAction';
const AGG_PREFIX = 'matrix_';

/** AG Grid's own name for the auto-generated hierarchy column. */
const AUTO_GROUP_COL_ID = 'ag-Grid-AutoColumn';

/**
 * An aggregate has to carry its own count. At the second level of a tree the inputs are the first
 * level's results, so without the count a mean of means quietly replaces the mean (research R6).
 * `toString`/`toNumber` are what keep sorting and the value formatter working on the object.
 */
interface AggValue {
  value: number;
  count: number;
  toString(): string;
  toNumber(): number;
}

function isAggValue(value: unknown): value is AggValue {
  return typeof value === 'object' && value !== null && 'value' in value && 'count' in value;
}

function unwrap(value: unknown): CellValue {
  if (isAggValue(value)) return value.value;
  if (typeof value === 'number' || typeof value === 'string') return value;
  return null;
}

function weightOf(value: unknown): number | undefined {
  return isAggValue(value) ? value.count : undefined;
}

function aggName(aggregator: ColumnAggregator): string | undefined {
  return aggregator === 'none' ? undefined : `${AGG_PREFIX}${aggregator}`;
}

const ALIGN_CLASS = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
} as const;

/**
 * Drops group rows with no descendants, cascading — hiding a childless sub-group can leave its
 * parent childless in turn. The alternative behaviour, `'annotate'`, keeps them and is handled in
 * the group renderer, so neither mode ever shows a blank aggregate with no explanation (FR-022).
 */
function hideChildlessGroups(rows: RowDatum[]): RowDatum[] {
  let current = rows;
  for (;;) {
    const parents = new Set(
      current.map((row) => row.parentKey).filter((key): key is string => typeof key === 'string'),
    );
    const next = current.filter((row) => row.rowKind !== 'group' || parents.has(row.rowId));
    if (next.length === current.length) return next;
    current = next;
  }
}

export function MatrixGrid(props: MatrixGridProps) {
  const {
    columnSchema,
    rows,
    ariaLabel,
    labels,
    locale,
    height,
    status = 'succeeded',
    onRetry,
    pivotConfig,
    defaultExpandedDepth = 1,
    emptyGroupBehaviour = 'hide',
    undoDepth = DEFAULT_UNDO_DEPTH,
    onSchemaChanged,
    className,
    'data-testid': testId,
  } = props;

  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? 'ag-theme-matrix-dark' : 'ag-theme-matrix-light';
  const isRtl = directionFor(locale) === 'rtl';

  /**
   * Grid callbacks outlive the render that created them, so they read the latest props from here
   * instead of closing over a stale copy.
   */
  const latest = useRef(props);
  latest.current = props;

  const apiRef = useRef<GridApi<RowDatum> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const journalRef = useRef(createJournal(undoDepth));
  const rowIdsRef = useRef<string[]>([]);
  const editSessionRef = useRef<{ rowId: string; columnId: string; handled: boolean } | null>(null);

  const [announcement, setAnnouncement] = useState<{ text: string; seq: number }>({
    text: '',
    seq: 0,
  });
  const [warning, setWarning] = useState<string | null>(null);

  const announce = useCallback((text: string) => {
    setAnnouncement((previous) => ({ text, seq: previous.seq + 1 }));
  }, []);

  // ---------------------------------------------------------------------------------------------
  // Columns
  // ---------------------------------------------------------------------------------------------

  /**
   * A schema error is a developer error: loud in development, contained in production. Half-
   * rendering a grid whose columns contradict its data is worse than showing the error panel.
   */
  const [built, schemaError] = useMemo<[BuiltColumns | null, Error | null]>(() => {
    try {
      return [buildColumnDefs(columnSchema, { locale, labels, pivotConfig }), null];
    } catch (error) {
      if (error instanceof SchemaValidationError) {
        if (isDev) throw error;
        return [null, error];
      }
      throw error;
    }
  }, [columnSchema, locale, labels, pivotConfig]);

  const leafById = useMemo(() => {
    const map = new Map<string, BuiltLeafColumn>();
    built?.leaves.forEach((leaf) => map.set(leaf.id, leaf));
    return map;
  }, [built]);

  const pairs = useMemo(() => built?.pairs ?? [], [built]);
  const pairByEditableId = useMemo(() => {
    const map = new Map<string, (typeof pairs)[number]>();
    pairs.forEach((pair) => map.set(pair.editableColumnId, pair));
    return map;
  }, [pairs]);

  const isTree = useMemo(() => rows.some((row) => row.parentKey != null), [rows]);
  const showRowAction = useMemo(
    () => pairs.length > 0 && rows.some((row) => row.acceptable === true),
    [pairs.length, rows],
  );

  const gridRows = useMemo(
    () => (isTree && emptyGroupBehaviour === 'hide' ? hideChildlessGroups(rows) : rows),
    [rows, isTree, emptyGroupBehaviour],
  );

  // ---------------------------------------------------------------------------------------------
  // Editing
  // ---------------------------------------------------------------------------------------------

  const rowById = useCallback(
    (rowId: string) => latest.current.rows.find((row) => row.rowId === rowId),
    [],
  );

  /** One place emits edits, so no source can bypass the journal or the event stream (FR-035). */
  const emitEdit = useCallback(
    (entry: Omit<EditRecord, 'timestamp'>) => {
      const edit: EditRecord = { ...entry, timestamp: Date.now() };
      // An undo or redo replays history; recording it would make the stacks grow instead of move.
      if (edit.source !== 'undo' && edit.source !== 'redo') {
        journalRef.current = recordEdit(journalRef.current, edit);
      }
      latest.current.onEditCommitted?.(edit);
      return edit;
    },
    [],
  );

  const reject = useCallback(
    (rowId: string, columnId: string, message: string, announceIt: boolean) => {
      latest.current.onEditRejected?.({ rowId, columnId, message });
      if (announceIt) announce(message);
    },
    [announce],
  );

  /**
   * Reads user input in the active locale. `parseFloat` is prohibited on this path: in Spanish it
   * reads `1.234,56` as 1.234 and commits a value a thousand times too small (research R14).
   */
  const coerce = useCallback(
    (raw: unknown, leaf: BuiltLeafColumn): { ok: true; value: CellValue } | { ok: false } => {
      if (leaf.dataType === 'text') return { ok: true, value: raw == null ? null : String(raw) };

      const text = raw == null ? '' : String(raw).trim();
      if (text === '') return { ok: true, value: null };

      if (leaf.dataType === 'date') {
        const iso = parseLocaleDate(text, latest.current.locale);
        return iso === null ? { ok: false } : { ok: true, value: iso };
      }

      const numeric = parseLocaleNumber(text, latest.current.locale);
      return numeric === null ? { ok: false } : { ok: true, value: numeric };
    },
    [],
  );

  /**
   * Validates one candidate value and emits either the commit or the rejection. Shared by typed
   * edits and pasted cells so the two can never disagree about what is acceptable.
   */
  const commitValue = useCallback(
    (args: {
      row: RowDatum;
      leaf: BuiltLeafColumn;
      raw: unknown;
      source: EditSource;
      announceRejection: boolean;
    }): EditRecord | null => {
      const { row, leaf, raw, source, announceRejection } = args;
      const oldValue = row.values[leaf.field] ?? null;

      const parsed = coerce(raw, leaf);
      if (!parsed.ok) {
        reject(row.rowId, leaf.id, latest.current.labels.invalidValue, announceRejection);
        return null;
      }

      const message = leaf.validate?.(parsed.value, row) ?? null;
      if (message !== null) {
        reject(row.rowId, leaf.id, message, announceRejection);
        return null;
      }

      if (parsed.value === oldValue) return null;

      return emitEdit({
        rowId: row.rowId,
        columnId: leaf.id,
        oldValue,
        newValue: parsed.value,
        source,
      });
    },
    [coerce, emitEdit, reject],
  );

  const handleEditRequest = useCallback(
    (event: CellEditRequestEvent<RowDatum>) => {
      const row = event.data;
      const leaf = leafById.get(event.column.getColId());
      if (!row || !leaf || !leaf.editable) return;

      const session = editSessionRef.current;
      if (session) session.handled = true;

      commitValue({
        row,
        leaf,
        raw: event.newValue,
        source: 'edit',
        announceRejection: true,
      });
    },
    [commitValue, leafById],
  );

  const handleEditingStarted = useCallback(
    (event: CellEditingStartedEvent<RowDatum>) => {
      if (!event.data) return;
      const columnId = event.column.getColId();
      editSessionRef.current = { rowId: event.data.rowId, columnId, handled: false };

      /*
       * The vendor announces a cell's editable state when focus lands on it, but nothing announces
       * that the editor actually opened — so a screen reader user pressing Enter or F2 gets silence
       * and cannot tell whether they are typing into the grid or navigating it (FR-056).
       */
      const leaf = leafById.get(columnId);
      if (leaf) announce(latest.current.labels.editing(leaf.headerName));
    },
    [announce, leafById],
  );

  /**
   * v36 has no "cancelled" flag, and under `readOnlyEdit` `valueChanged` is never true — the grid
   * did not change anything, we did. So a cancel is defined as an edit session that ended without
   * a request. The microtask lets both events land before deciding, whatever order they arrive in.
   */
  const handleEditingStopped = useCallback((_event: CellEditingStoppedEvent<RowDatum>) => {
    const session = editSessionRef.current;
    editSessionRef.current = null;
    if (!session) return;
    queueMicrotask(() => {
      if (session.handled) return;
      latest.current.onEditCancelled?.({ rowId: session.rowId, columnId: session.columnId });
    });
  }, []);

  const bulkApply = useCallback(
    (rowId: string) => {
      const row = rowById(rowId);
      if (!row) return;
      pairs.forEach((pair) => {
        const leaf = leafById.get(pair.editableColumnId);
        if (!leaf) return;
        const baseline = row.values[pair.baselineField] ?? null;
        commitValue({
          row,
          leaf,
          raw: baseline,
          source: 'bulkApply',
          announceRejection: false,
        });
      });
    },
    [commitValue, leafById, pairs, rowById],
  );

  const replay = useCallback(
    (edit: EditRecord | null, source: 'undo' | 'redo') => {
      if (!edit) return;
      emitEdit({
        rowId: edit.rowId,
        columnId: edit.columnId,
        oldValue: edit.oldValue,
        newValue: edit.newValue,
        source,
      });
    },
    [emitEdit],
  );

  const undo = useCallback(() => {
    const { journal, inverse } = undoJournal(journalRef.current);
    journalRef.current = journal;
    replay(inverse, 'undo');
  }, [replay]);

  const redo = useCallback(() => {
    const { journal, replay: forward } = redoJournal(journalRef.current);
    journalRef.current = journal;
    replay(forward, 'redo');
  }, [replay]);

  // ---------------------------------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------------------------------

  /** The schema's leaf columns in display order, with the editability Tab navigation needs. */
  const navigableColumns = useCallback((api: GridApi<RowDatum>): NavigableColumn[] => {
    return api
      .getAllDisplayedColumns()
      .map((column) => {
        const leaf = leafById.get(column.getColId());
        return leaf === undefined ? null : { id: leaf.id, editable: leaf.editable };
      })
      .filter((column): column is NavigableColumn => column !== null);
  }, [leafById]);

  const focusAddress = useCallback((api: GridApi<RowDatum>, target: CellAddress) => {
    // Scroll first, then focus: focusing a cell that is not rendered yet does nothing.
    api.ensureIndexVisible(target.rowIndex);
    api.ensureColumnVisible(target.columnId);
    api.setFocusedCell(target.rowIndex, target.columnId);
  }, []);

  /**
   * Tab moves between EDITABLE cells only, wrapping rows — the vendor's default walks every cell,
   * read-only ones included, which turns tabbing across a paired matrix into twice the keystrokes for
   * half the useful stops (FR-051).
   *
   * The return values are the vendor's: a cell position to go there, or `false` to hand Tab back to
   * the browser. `false` is the right answer once there is no editable cell left, because focus then
   * leaves the grid for the next control on the page instead of being trapped in the last cell.
   */
  const tabToNextCell = useCallback(
    (params: TabToNextCellParams<RowDatum>): CellPosition | boolean => {
      const api = apiRef.current;
      const previous = params.previousCellPosition;
      // The pinned grand total row holds no editable cell; leave its navigation to the grid.
      if (!api || previous.rowPinned) return params.nextCellPosition ?? false;

      // One callback covers both directions in v36 — there is no `tabToPreviousCell`.
      const target = nextEditableCell(
        { rowIndex: previous.rowIndex, columnId: previous.column.getColId() },
        navigableColumns(api),
        api.getDisplayedRowCount(),
        params.backwards ? 'backward' : 'forward',
      );
      if (!target) return false;

      const column = api.getColumn(target.columnId);
      if (!column) return false;
      api.ensureIndexVisible(target.rowIndex);
      return { rowIndex: target.rowIndex, column, rowPinned: null };
    },
    [navigableColumns],
  );

  /**
   * The keys the adapter claims must be suppressed here as well as handled below, or both we and the
   * vendor act on them and focus moves twice. `keyAction` refuses everything while an editor is open,
   * which is what keeps Home and End working on the text caret mid-edit.
   */
  const suppressKeyboardEvent = useCallback((params: SuppressKeyboardEventParams<RowDatum>) => {
    const action = keyAction({
      key: params.event.key,
      ctrlKey: params.event.ctrlKey,
      metaKey: params.event.metaKey,
      editing: params.editing,
      isGroupRow: params.node.group === true || params.data?.rowKind === 'group',
    });
    return action !== null;
  }, []);

  /**
   * Bound natively on the wrapper rather than through `onCellKeyDown`, for the same reason Ctrl+Z is:
   * these shortcuts belong to the whole grid region, and a native listener keeps working regardless
   * of which cell holds focus — or of whether the vendor still emits its own event once
   * `suppressKeyboardEvent` has claimed the key.
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      const api = apiRef.current;
      if (!api) return;
      const editing = api.getEditingCells().length > 0;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !editing) {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }

      const focused = api.getFocusedCell();
      if (!focused || focused.rowPinned) return;
      const node = api.getDisplayedRowAtIndex(focused.rowIndex);

      const action = keyAction({
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        editing,
        isGroupRow: node?.group === true || node?.data?.rowKind === 'group',
      });
      if (!action) return;

      // Space scrolls the page and Home/End scroll the viewport if left to the browser.
      event.preventDefault();

      if (action.kind === 'toggleGroup') {
        node?.setExpanded(node.expanded !== true);
        return;
      }

      const target = targetForAction(action, {
        rowIndex: focused.rowIndex,
        columns: navigableColumns(api),
        rowCount: api.getDisplayedRowCount(),
      });
      if (target) focusAddress(api, target);
    };

    wrapper.addEventListener('keydown', onKeyDown);
    return () => wrapper.removeEventListener('keydown', onKeyDown);
  }, [focusAddress, navigableColumns, redo, undo]);

  // ---------------------------------------------------------------------------------------------
  // Clipboard
  // ---------------------------------------------------------------------------------------------

  const displayedPasteColumns = useCallback((api: GridApi<RowDatum>): PasteColumn[] => {
    return api
      .getAllDisplayedColumns()
      .map((column) => {
        const leaf = leafById.get(column.getColId());
        return leaf === undefined
          ? null
          : { id: leaf.id, editable: leaf.editable, dataType: leaf.dataType };
      })
      .filter((column): column is PasteColumn => column !== null);
  }, [leafById]);

  /**
   * The adapter owns the write: `mapPaste` shapes the block, we emit the edits, and the grid's own
   * paste is cancelled by returning `null`. Letting the vendor apply it too would mean two code
   * paths for one operation, with the counts in the warning guessed rather than known (research R7).
   */
  const processDataFromClipboard = useCallback(
    ({ data }: ProcessDataFromClipboardParams<RowDatum>): null => {
      const api = apiRef.current;
      if (!api || data.length === 0) return null;

      const range = api.getCellRanges()?.[0];
      const focused = api.getFocusedCell();
      const anchorRowIndex = range?.startRow?.rowIndex ?? focused?.rowIndex ?? null;
      const anchorColumnId = range?.columns[0]?.getColId() ?? focused?.column.getColId() ?? null;
      if (anchorRowIndex === null || anchorColumnId === null) return null;

      /*
       * Only the rows the block can actually reach are collected, not all 100,000 of them: the
       * slice is capped by the real row count, so `truncated` is still counted correctly.
       */
      const total = api.getDisplayedRowCount();
      const window: string[] = [];
      for (let index = anchorRowIndex; index < Math.min(total, anchorRowIndex + data.length); index += 1) {
        const node = api.getDisplayedRowAtIndex(index);
        if (node?.data) window.push(node.data.rowId);
      }

      const { shaped, outcome, rejected } = mapPaste({
        parsed: data,
        anchor: { rowIndex: 0, columnId: anchorColumnId },
        rowIdsInView: window,
        columnsInView: displayedPasteColumns(api),
        locale: latest.current.locale,
      });

      const columns = displayedPasteColumns(api);
      const anchorColumn = columns.findIndex((column) => column.id === anchorColumnId);
      const records: EditRecord[] = [];

      shaped.forEach((shapedRow, rowOffset) => {
        const row = rowById(window[rowOffset]);
        if (!row) return;
        shapedRow.forEach((value, columnOffset) => {
          if (value === undefined) return;
          const leaf = leafById.get(columns[anchorColumn + columnOffset]?.id ?? '');
          if (!leaf) return;
          const edit = commitValue({
            row,
            leaf,
            raw: value,
            source: 'paste',
            // One aggregated warning per paste, never one announcement per cell (contract §2).
            announceRejection: false,
          });
          if (edit) records.push(edit);
        });
      });

      rejected.forEach((cell) =>
        latest.current.onEditRejected?.({
          rowId: cell.rowId,
          columnId: cell.columnId,
          message: latest.current.labels.invalidValue,
        }),
      );

      const finalOutcome: PasteOutcome = { ...outcome, written: records.length };
      latest.current.onPasteCompleted?.(finalOutcome, records);

      if (finalOutcome.skippedReadOnly > 0 || finalOutcome.truncated > 0) {
        const message = latest.current.labels.pasteWarning(finalOutcome);
        setWarning(message);
        announce(message);
      }

      return null;
    },
    [announce, commitValue, displayedPasteColumns, leafById, rowById],
  );

  const handleCellSelectionChanged = useCallback(
    (event: CellSelectionChangedEvent<RowDatum>) => {
      if (!event.finished) return;
      const api = apiRef.current;
      const range = api?.getCellRanges()?.[0];
      if (!api || !range || !range.startRow || !range.endRow) {
        latest.current.onSelectionChanged?.(null);
        return;
      }
      const startId = api.getDisplayedRowAtIndex(range.startRow.rowIndex)?.data?.rowId;
      const endId = api.getDisplayedRowAtIndex(range.endRow.rowIndex)?.data?.rowId;
      if (startId === undefined || endId === undefined) {
        latest.current.onSelectionChanged?.(null);
        return;
      }
      const selection: SelectionRange = {
        startRowId: startId,
        endRowId: endId,
        columnIds: range.columns.map((column) => column.getColId()),
      };
      latest.current.onSelectionChanged?.(selection);
    },
    [],
  );

  // ---------------------------------------------------------------------------------------------
  // Column definitions
  // ---------------------------------------------------------------------------------------------

  const firstLeafId = built?.leaves[0]?.id;

  const toColDef = useCallback(
    (leaf: BuiltLeafColumn): ColDef<RowDatum> => {
      const pair = pairByEditableId.get(leaf.id);
      const usesRenderer = leaf.variant !== undefined || leaf.badge !== undefined || leaf.editable;

      return {
        colId: leaf.id,
        headerName: leaf.headerName,
        headerTooltip: leaf.headerTooltip,
        pinned: leaf.pinned ?? undefined,
        width: leaf.width,
        flex: leaf.flex,
        minWidth: leaf.minWidth,
        cellClass: ALIGN_CLASS[leaf.align],
        headerClass: ALIGN_CLASS[leaf.align],
        aggFunc: aggName(leaf.aggregator),
        // Shaping decides what to write; this is the enforcement that a wrong paste cannot land.
        suppressPaste: !leaf.editable,
        // Group rows in tree data are real rows, so `data` alone does not mean "editable".
        editable: leaf.editable ? ({ data }) => data !== undefined : false,
        // Always the text editor: a number editor would coerce `1.234,56` before we could parse it.
        cellEditor: leaf.editable ? 'agTextCellEditor' : undefined,
        valueGetter: ({ data }: ValueGetterParams<RowDatum>) =>
          data === undefined ? undefined : data.values[leaf.field] ?? null,
        valueFormatter: ({ value, node }: ValueFormatterParams<RowDatum>) => {
          if (node?.footer === true && leaf.id === firstLeafId) {
            return latest.current.labels.grandTotal;
          }
          return formatCellValue(unwrap(value), {
            locale: latest.current.locale,
            dataType: leaf.dataType,
            mask: leaf.formatMask,
          });
        },
        cellRenderer: usesRenderer
          ? (params: ICellRendererParams<RowDatum>) => {
              const row = params.data;
              const modified =
                pair !== undefined && row !== undefined ? isCellModified(row, pair) : false;
              return (
                <PairedValueCell
                  text={params.valueFormatted ?? EM_DASH}
                  variant={leaf.variant}
                  badge={leaf.badge}
                  modified={modified}
                  readOnly={!leaf.editable}
                  modifiedLabel={latest.current.labels.modified}
                  readOnlyLabel={latest.current.labels.readOnly}
                />
              );
            }
          : undefined,
      };
    },
    [firstLeafId, pairByEditableId],
  );

  const columnDefs = useMemo<(ColDef<RowDatum> | ColGroupDef<RowDatum>)[]>(() => {
    if (!built) return [];

    const toDef = (node: BuiltColumn): ColDef<RowDatum> | ColGroupDef<RowDatum> =>
      node.kind === 'group'
        ? {
            groupId: node.id,
            headerName: node.headerName,
            // Keeps a moved column inside its own group, so a period's metrics stay together.
            marryChildren: true,
            children: node.children.map(toDef),
          }
        : toColDef(node);

    const defs = built.columns.map(toDef);

    if (showRowAction) {
      defs.push({
        colId: ROW_ACTION_COL_ID,
        headerName: labels.bulkApply,
        width: 132,
        minWidth: 132,
        sortable: false,
        resizable: false,
        suppressPaste: true,
        /*
         * A column-level handler replaces the default one, so this cell has to answer for both
         * concerns: letting Tab reach the button inside it, and the keys the adapter claims.
         */
        suppressKeyboardEvent: (params: SuppressKeyboardEventParams<RowDatum>) =>
          rowActionSuppressKeyboardEvent(params) || suppressKeyboardEvent(params),
        valueGetter: () => null,
        cellRenderer: (params: ICellRendererParams<RowDatum>) => {
          const row = params.data;
          if (!row || row.acceptable !== true) return null;
          return (
            <RowActionCell
              label={latest.current.labels.bulkApply}
              onApply={() => bulkApply(row.rowId)}
            />
          );
        },
      });
    }

    return defs;
  }, [built, bulkApply, labels.bulkApply, showRowAction, suppressKeyboardEvent, toColDef]);

  const defaultColDef = useMemo<ColDef<RowDatum>>(
    () => ({ resizable: true, sortable: true, minWidth: 96, suppressKeyboardEvent }),
    [suppressKeyboardEvent],
  );

  /**
   * The hierarchy column. `labels.rowHeader` names it because it has no counterpart in
   * `columnSchema`, and the leaf count is produced by CALLING `labels.leafCount(count)` — the grid
   * interpolates nothing, so Arabic's six plural categories resolve at the host (research R15).
   */
  const autoGroupColumnDef = useMemo<ColDef<RowDatum>>(
    () => ({
      headerName: labels.rowHeader,
      colId: AUTO_GROUP_COL_ID,
      pinned: 'left',
      minWidth: 260,
      valueGetter: ({ data }: ValueGetterParams<RowDatum>) => data?.label ?? data?.rowId ?? '',
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params: ICellRendererParams<RowDatum>) => {
          const grid = latest.current.labels;
          if (params.node.footer === true) {
            return <span className={styles.groupTotal}>{grid.grandTotal}</span>;
          }
          const count = params.node.allChildrenCount ?? 0;
          const isGroup = params.data?.rowKind === 'group';
          return (
            <span className={styles.groupLabel}>
              <span>{params.valueFormatted ?? String(params.value ?? '')}</span>
              {count > 0 && <span className={styles.leafCount}>{grid.leafCount(count)}</span>}
              {isGroup && count === 0 && <span className={styles.leafCount}>{grid.emptyGroup}</span>}
            </span>
          );
        },
      },
    }),
    [labels.rowHeader],
  );

  // ---------------------------------------------------------------------------------------------
  // Aggregation
  // ---------------------------------------------------------------------------------------------

  const aggFuncs = useMemo(() => {
    const kinds: ColumnAggregator[] = [
      'sum',
      'average',
      'weightedAverage',
      'min',
      'max',
      'count',
    ];

    const run = (kind: ColumnAggregator, params: IAggFuncParams<RowDatum>): AggValue | null => {
      const leaf = leafById.get(params.column.getColId());
      const dataType = leaf?.dataType ?? 'number';
      const children: IRowNode<RowDatum>[] = params.aggregatedChildren ?? [];

      const inputs: AggregateInput[] =
        children.length > 0
          ? children.map((child) => {
              const aggregated = child.aggData?.[params.column.getColId()] as unknown;
              if (child.group === true && aggregated !== undefined) {
                return { value: unwrap(aggregated), dataType, weight: weightOf(aggregated) };
              }
              const value = leaf === undefined ? null : child.data?.values[leaf.field] ?? null;
              const weight =
                leaf?.weightField === undefined
                  ? undefined
                  : Number(child.data?.values[leaf.weightField] ?? 0);
              return { value, dataType, weight };
            })
          : params.values.map((value) => ({
              value: unwrap(value),
              dataType,
              weight: weightOf(value),
            }));

      const result = aggregate(kind, inputs);
      if (result === null) return null;
      return {
        value: result.value,
        count: result.count,
        toString: () => String(result.value),
        toNumber: () => result.value,
      };
    };

    return Object.fromEntries(
      kinds.map((kind) => [
        aggName(kind) as string,
        (params: IAggFuncParams<RowDatum>) => run(kind, params),
      ]),
    );
  }, [leafById]);

  // ---------------------------------------------------------------------------------------------
  // Handle
  // ---------------------------------------------------------------------------------------------

  const exportView = useCallback(
    (format: 'tsv' | 'csv'): string => {
      const api = apiRef.current;
      if (!api) return '';

      const columns = api.getAllDisplayedColumns();
      const header = columns.map((column) => {
        const leaf = leafById.get(column.getColId());
        if (leaf) return leaf.headerName;
        return column.getColId() === AUTO_GROUP_COL_ID ? latest.current.labels.rowHeader : '';
      });

      const cells: CellValue[][] = [header];
      for (let index = 0; index < api.getDisplayedRowCount(); index += 1) {
        const node = api.getDisplayedRowAtIndex(index);
        if (!node) continue;
        cells.push(
          columns.map((column) => {
            const colId = column.getColId();
            if (colId === AUTO_GROUP_COL_ID) return node.data?.label ?? node.data?.rowId ?? null;
            const leaf = leafById.get(colId);
            if (!leaf) return null;
            const aggregated = node.aggData?.[colId] as unknown;
            if (node.group === true && aggregated !== undefined) return unwrap(aggregated);
            return node.data?.values[leaf.field] ?? null;
          }),
        );
      }

      return format === 'csv' ? serialiseCsv(cells) : serialiseTsv(cells);
    },
    [leafById],
  );

  const handle = useMemo<MatrixGridHandle>(
    () => ({
      getModifiedRows: () => {
        const current = latest.current.rows;
        const modified = new Set(getModifiedRowIds(current, built?.pairs ?? []));
        return current.filter((row) => modified.has(row.rowId));
      },
      clearAllOverrides: () => {
        const current = latest.current.rows;
        (built?.pairs ?? []).forEach((pair) => {
          const leaf = leafById.get(pair.editableColumnId);
          if (!leaf) return;
          current.forEach((row) => {
            if (!isCellModified(row, pair)) return;
            commitValue({
              row,
              leaf,
              raw: row.values[pair.baselineField] ?? null,
              source: 'bulkApply',
              announceRejection: false,
            });
          });
        });
      },
      expandAllGroups: () => apiRef.current?.expandAll(),
      collapseAllGroups: () => apiRef.current?.collapseAll(),
      exportView,
      focusCell: (rowId, columnId) => {
        const api = apiRef.current;
        const node = api?.getRowNode(rowId);
        if (!api || !node || node.rowIndex === null) return;
        api.ensureNodeVisible(node);
        api.setFocusedCell(node.rowIndex, columnId);
      },
      undo,
      redo,
      canUndo: () => journalRef.current.past.length > 0,
      canRedo: () => journalRef.current.future.length > 0,
    }),
    [built, commitValue, exportView, leafById, redo, undo],
  );

  // ---------------------------------------------------------------------------------------------
  // Grid lifecycle
  // ---------------------------------------------------------------------------------------------

  const handleGridReady = useCallback(
    (event: GridReadyEvent<RowDatum>) => {
      apiRef.current = event.api;
      // A grid with no accessible name is unusable with a screen reader (contract §6).
      nameGridForScreenReaders(wrapperRef.current, latest.current.ariaLabel);
      latest.current.onReady?.(handle);
    },
    [handle],
  );

  useEffect(() => {
    nameGridForScreenReaders(wrapperRef.current, ariaLabel);
  }, [ariaLabel]);

  useEffect(() => {
    if (built) onSchemaChanged?.(built.leaves.length);
  }, [built, onSchemaChanged]);

  /** A refresh that removes rows must take their history with it (FR-039). */
  useEffect(() => {
    const previous = rowIdsRef.current;
    const current = new Set(rows.map((row) => row.rowId));
    rowIdsRef.current = rows.map((row) => row.rowId);

    const removed = previous.filter((rowId) => !current.has(rowId));
    if (removed.length === 0) return;

    const journal = journalRef.current;
    const affected = removed.filter(
      (rowId) =>
        journal.past.some((edit) => edit.rowId === rowId) ||
        journal.future.some((edit) => edit.rowId === rowId),
    );
    if (affected.length === 0) return;

    journalRef.current = dropRows(journal, affected);
    latest.current.onEditDiscarded?.({ rowIds: affected });
  }, [rows]);

  /**
   * Pivot changes are applied as column state, never by remounting: the scroll anchor is captured
   * first and restored after, so the row the user was looking at is still there (research R8).
   */
  useEffect(() => {
    const api = apiRef.current;
    if (!api || !built) return;

    const anchorRowId = api.getDisplayedRowAtIndex(api.getFirstDisplayedRowIndex())?.data?.rowId;

    const state: ColumnState[] = built.leaves.map((leaf) => ({
      colId: leaf.id,
      rowGroup: leaf.pivotRole === 'rowDimension',
      pivot: leaf.pivotRole === 'columnDimension',
      aggFunc: leaf.pivotRole === 'measure' ? (aggName(leaf.aggregator) ?? null) : null,
    }));
    api.applyColumnState({ state });

    if (anchorRowId !== undefined) {
      api.ensureNodeVisible((node) => node.data?.rowId === anchorRowId, 'top');
    }
    if (pivotConfig) latest.current.onPivotChanged?.(pivotConfig);
  }, [built, pivotConfig]);

  const getLocaleText = useCallback(({ key, defaultValue, variableValues }: GetLocaleTextParams) => {
    const template = latest.current.gridLocaleText?.[key] ?? defaultValue;
    if (variableValues === undefined || variableValues.length === 0) return template;
    // Without this an untranslated `${0}` reaches the UI (research R12).
    return template.replace(/\$\{(\d+)\}/g, (_match, index: string) => variableValues[Number(index)] ?? '');
  }, []);

  const handleCellDoubleClicked = useCallback(
    (event: CellDoubleClickedEvent<RowDatum>) => {
      const leaf = leafById.get(event.column.getColId());
      if (leaf && !leaf.editable) announce(latest.current.labels.readOnly);
    },
    [announce, leafById],
  );

  // ---------------------------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------------------------

  const liveRegion = (
    <div className={styles.liveRegion} role="status" aria-live="polite" key={announcement.seq}>
      {announcement.text}
    </div>
  );

  /*
   * The theme class sits on the wrapper rather than on the grid element. AG Grid only needs it on an
   * ancestor, and the `--matrix-grid-*` properties it declares have to reach the warning banner and
   * the state panels too — both of which render outside the grid.
   */
  const wrapperClass = [themeClass, styles.wrapper, className].filter(Boolean).join(' ');

  if (status === 'loading') {
    return (
      <div className={wrapperClass} data-testid={testId}>
        <div className={styles.panel} style={{ height }} role="status">
          {labels.loading}
        </div>
      </div>
    );
  }

  if (status === 'failed' || schemaError !== null) {
    return (
      <div className={wrapperClass} data-testid={testId}>
        <div className={[styles.panel, styles.errorPanel].join(' ')} style={{ height }} role="alert">
          <p className={styles.panelTitle}>{labels.error}</p>
          {onRetry !== undefined && (
            <Button variant="secondary" size="small" onClick={onRetry}>
              {labels.retry}
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (columnSchema.length === 0 || rows.length === 0) {
    return (
      <div className={wrapperClass} data-testid={testId}>
        <div className={styles.panel} style={{ height }}>
          <p className={styles.panelTitle}>{labels.empty}</p>
        </div>
        {liveRegion}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={wrapperClass} data-testid={testId}>
      {warning !== null && (
        <div className={styles.warning} role="alert">
          <span className={styles.warningIcon} aria-hidden="true">
            !
          </span>
          <span>{warning}</span>
          <button
            type="button"
            className={styles.warningDismiss}
            onClick={() => setWarning(null)}
            aria-label={labels.retry}
          >
            ✕
          </button>
        </div>
      )}

      {/*
       * Modules and the licence key are supplied per grid rather than globally, so Enterprise stays
       * inside this lazily loaded chunk and no other grid in the app silently gains its features
       * (research R11).
       */}
      <AgGridProvider modules={MATRIX_GRID_MODULES} licenseKey={MATRIX_GRID_LICENSE_KEY}>
        <div className={styles.grid} style={{ height }}>
          <AgGridReact<RowDatum>
            rowData={gridRows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            getRowId={({ data }) => data.rowId}
            /* The host owns the data: the grid asks, it never writes (research R4). */
            readOnlyEdit
            treeData={isTree}
            treeDataParentIdField="parentKey"
            groupDefaultExpanded={defaultExpandedDepth}
            aggFuncs={aggFuncs}
            /* Filter-correct and grid-computed, so it can never disagree with the rows above it. */
            grandTotalRow="pinnedBottom"
            alwaysAggregateAtRootLevel
            suppressAggFuncInHeader
            cellSelection={{ handle: { mode: 'range' } }}
            /* Excel's behaviour, and the contract's: committing with Enter moves down a row. */
            enterNavigatesVerticallyAfterEdit
            tabToNextCell={tabToNextCell}
            processDataFromClipboard={processDataFromClipboard}
            getLocaleText={getLocaleText}
            /* AG Grid does not read `document.dir`; without this Arabic renders LTR (research R13). */
            enableRtl={isRtl}
            pivotMode={pivotConfig !== undefined}
            /* Fixed height. `autoHeight` renders every row and defeats virtualization. */
            domLayout="normal"
            onGridReady={handleGridReady}
            onCellEditRequest={handleEditRequest}
            onCellEditingStarted={handleEditingStarted}
            onCellEditingStopped={handleEditingStopped}
            onCellSelectionChanged={handleCellSelectionChanged}
            onCellDoubleClicked={handleCellDoubleClicked}
            onColumnMoved={() => latest.current.onSelectionChanged?.(null)}
          />
        </div>
      </AgGridProvider>

      {liveRegion}
    </div>
  );
}
