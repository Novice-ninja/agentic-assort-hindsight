/**
 * The public type surface of MatrixGrid.
 *
 * Two rules govern this file:
 *
 * 1. **No AG Grid type may appear here.** That is what lets a consuming module render the grid
 *    without importing `ag-grid-*` itself (constitution v3.0.0 Principle I).
 * 2. **Count-bearing copy is a function, not a template.** Arabic has six plural categories, so
 *    a `{{count}}` string has no single correct surface form — the host's `t()` has to resolve it
 *    (research R15).
 */
import type { LoadStatus } from '@shared/types';

export type ColumnDataType = 'number' | 'percent' | 'currency' | 'text' | 'date';

export type ColumnAggregator =
  | 'sum'
  | 'average'
  | 'weightedAverage'
  | 'min'
  | 'max'
  | 'count'
  | 'none';

/** Two sides of a paired column. Omit entirely for an ordinary column. */
export type ColumnVariant = 'baseline' | 'editable';

/** Optional row metadata. Hierarchy comes from `parentKey`, not from this. */
export type RowKind = 'group' | 'leaf';

export type EditSource = 'edit' | 'bulkApply' | 'paste' | 'undo' | 'redo';

export type CellValue = number | string | null;

export type ColumnAlign = 'start' | 'end' | 'center';

/** Applied with `Intl` using the `locale` prop. */
export interface ColumnFormat {
  /** ISO 4217 code. Required for `dataType: 'currency'` to render a symbol. */
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  /** Scales the displayed value. `'thousand'` shows 12,300 as 12.3. */
  magnitude?: 'none' | 'thousand' | 'million';
}

/** Short label distinguishing the two sides of a pair. Both strings already translated. */
export interface ColumnBadge {
  text: string;
  title: string;
}

/** Returns an already-translated message, or `null` when the value is valid. */
export type ColumnValidator = (value: CellValue, row: RowDatum) => string | null;

export interface LeafColumnDef {
  /** Unique across the whole schema. Used as the column id and in every event. */
  id: string;
  /** Key into `RowDatum.values`. Dot paths are not supported — keep values flat. */
  field: string;
  /** Already translated. */
  headerName: string;
  dataType: ColumnDataType;
  editable?: boolean;
  /** Defaults to `end` for number/percent/currency, else `start`. */
  align?: ColumnAlign;
  formatMask?: ColumnFormat;
  /** Mutually exclusive with `flex`; `width` wins if both are set. */
  width?: number;
  flex?: number;
  minWidth?: number;
  pinned?: 'left' | 'right' | null;
  /** Defaults to `'none'`. `'weightedAverage'` requires `weightField`. */
  aggregator?: ColumnAggregator;
  weightField?: string;
  /** Omit for a normal column. */
  variant?: ColumnVariant;
  /** Required when `variant` is set: the two sides of a pair share one `pairId`. */
  pairId?: string;
  badge?: ColumnBadge;
  validate?: ColumnValidator;
  /** Already translated. */
  headerTooltip?: string;
}

export interface ColumnGroupNode {
  id: string;
  /** Already translated. */
  headerName: string;
  /** Non-empty. Nesting depth is unbounded. */
  children: ColumnSchemaNode[];
  pinned?: 'left' | 'right' | null;
}

export type ColumnSchemaNode = ColumnGroupNode | LeafColumnDef;

/** A group is distinguished from a leaf by the presence of `children`. */
export function isColumnGroup(node: ColumnSchemaNode): node is ColumnGroupNode {
  return Array.isArray((node as ColumnGroupNode).children);
}

export interface RowDatum {
  /** Stable across refreshes. A changing `rowId` destroys selection and expansion state. */
  rowId: string;
  /** `rowId` of the parent. Absent means a root row. The only source of hierarchy. */
  parentKey?: string | null;
  rowKind?: RowKind;
  /**
   * Display name in the hierarchy column. Falls back to `rowId`, which is an id and not copy — a
   * hierarchical grid should always set this.
   */
  label?: string;
  /** When `true` the row shows the bulk-apply action. Defaults to `false`. */
  acceptable?: boolean;
  /** Keyed by `LeafColumnDef.field`. A missing key renders an em dash, not `0`. */
  values: Record<string, CellValue>;
  /** Passed through untouched for host cell renderers. */
  meta?: Record<string, unknown>;
}

export interface PivotMeasure {
  columnId: string;
  /** Overrides the column's own `aggregator`. */
  aggregator: ColumnAggregator;
}

export interface PivotConfig {
  /** Column ids grouped down the rows. */
  rowDimensions: string[];
  /** Column ids pivoted across the columns. */
  columnDimensions: string[];
  measures: PivotMeasure[];
}

export interface EditRecord {
  rowId: string;
  /** `LeafColumnDef.id`, not the field. */
  columnId: string;
  oldValue: CellValue;
  newValue: CellValue;
  /** `bulkApply` and `paste` emit one record per cell changed. */
  source: EditSource;
  timestamp: number;
}

export interface PasteOutcome {
  /** Cells actually applied. */
  written: number;
  /** Targets that were not editable. */
  skippedReadOnly: number;
  /** Cells discarded past the grid's last row or column. */
  truncated: number;
}

export interface SelectionRange {
  startRowId: string;
  endRowId: string;
  columnIds: string[];
}

/** The two sides of one paired column, resolved from the schema. */
export interface ColumnPair {
  pairId: string;
  baselineColumnId: string;
  baselineField: string;
  editableColumnId: string;
  editableField: string;
}

export interface MatrixGridLabels {
  empty: string;
  error: string;
  loading: string;
  retry: string;
  /** Tooltip and announcement when a read-only cell is double-clicked. */
  readOnly: string;
  /** Accessible name and visible label of the row bulk-apply action. */
  bulkApply: string;
  grandTotal: string;
  /** Header of the hierarchy column, which has no counterpart in `columnSchema`. */
  rowHeader: string;
  /** Annotation on a group row with no leaf descendants (`emptyGroupBehaviour: 'annotate'`). */
  emptyGroup: string;
  /** Accessible name of the changed-cell marker, so the override is not a colour-only signal. */
  modified: string;
  /**
   * Announced when typed or pasted text cannot be read as the column's type. A column `validate()`
   * message wins where one is supplied; this is the fallback that keeps a rejection from being
   * silent.
   */
  invalidValue: string;

  /**
   * Announced when an editor opens, so a keyboard user knows the grid switched from navigating to
   * typing. Called with the column's header name: `(column) => t('matrixGrid.editing', { column })`.
   */
  editing: (columnName: string) => string;

  /**
   * Count-bearing copy is a FUNCTION, not a template (research R15). The grid calls it with the
   * live number and the host resolves the plural category:
   * `(count) => t('matrixGrid.leafCount', { count })`.
   */
  leafCount: (count: number) => string;
  /** Aggregated paste warning. Called once per paste with the final counts. */
  pasteWarning: (outcome: PasteOutcome) => string;
}

export interface MatrixGridHandle {
  getModifiedRows(): RowDatum[];
  /** Emits one `EditRecord` per cleared cell. */
  clearAllOverrides(): void;
  expandAllGroups(): void;
  collapseAllGroups(): void;
  /** Serialises only the currently rendered view, keeping export inside the host's scope. */
  exportView(format: 'tsv' | 'csv'): string;
  focusCell(rowId: string, columnId: string): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
}

export interface MatrixGridProps {
  /** Column tree. Arbitrary group nesting; leaves are the addressable columns. */
  columnSchema: ColumnSchemaNode[];

  /** Flat row list. Hierarchy comes from `RowDatum.parentKey`. */
  rows: RowDatum[];

  /** Labels the grid for assistive technology. Required — a bare grid is unusable. */
  ariaLabel: string;

  /** Every string the grid renders, already translated. */
  labels: MatrixGridLabels;

  /**
   * BCP-47 tag. Drives all `Intl` formatting AND parsing, and the grid's writing direction via
   * `directionFor(locale)`. Changing it REQUIRES a remount (`key={locale}`), because AG Grid
   * treats both `enableRtl` and its locale text as initial-only options.
   */
  locale: string;

  /** Fixed body height in px. `autoHeight` is prohibited — it defeats virtualization. */
  height: number;

  /** `'loading'` shows the loading panel, `'failed'` the error panel with `onRetry`. */
  status?: LoadStatus;
  onRetry?: () => void;

  /** Optional pivot configuration. Changing it must not remount the grid. */
  pivotConfig?: PivotConfig;

  /** Expand depth on first render. `0` none, `-1` all. Default `1`. */
  defaultExpandedDepth?: number;

  /** What to do with a group row that has no leaf descendants. Default `'hide'`. */
  emptyGroupBehaviour?: 'hide' | 'annotate';

  /** Undo/redo depth. Default 50, which is also the floor the brief requires. */
  undoDepth?: number;

  /** AG Grid's own chrome, already translated. Keys are AG Grid locale keys. */
  gridLocaleText?: Record<string, string>;

  onReady?: (handle: MatrixGridHandle) => void;
  onSchemaChanged?: (leafColumnCount: number) => void;
  onSelectionChanged?: (range: SelectionRange | null) => void;
  onEditCommitted?: (record: EditRecord) => void;
  onEditCancelled?: (info: { rowId: string; columnId: string }) => void;
  onEditRejected?: (info: { rowId: string; columnId: string; message: string }) => void;
  onEditDiscarded?: (info: { rowIds: string[] }) => void;
  onPasteCompleted?: (outcome: PasteOutcome, records: EditRecord[]) => void;
  onPivotChanged?: (config: PivotConfig) => void;

  /** Theming extension point: declare `--matrix-grid-*` overrides here. */
  className?: string;
  'data-testid'?: string;
}
