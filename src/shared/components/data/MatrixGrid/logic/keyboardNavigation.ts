/**
 * The keyboard behaviour the grid owns, as pure functions.
 *
 * AG Grid's defaults are close but not equal to the contract, and the differences are the ones a
 * planner notices:
 *
 * - Tab moves to the next *cell*, including read-only ones. The contract says the next **editable**
 *   cell, wrapping rows, so a keyboard user tabs through the overrides and nothing else.
 * - Space toggles row selection. On a group row the contract says expand/collapse.
 * - Home and End have moved between vendor majors. Resolving them here makes the behaviour ours and
 *   independent of the version underneath.
 *
 * Vendor-free and side-effect-free: `MatrixGrid.tsx` translates these decisions into api calls, which
 * is what makes the whole keyboard matrix testable without a browser (`ag-grid-react` is mocked in
 * Jest — research R10).
 */

export interface NavigableColumn {
  id: string;
  editable: boolean;
}

export interface CellAddress {
  rowIndex: number;
  columnId: string;
}

export type MatrixKeyAction =
  | { kind: 'rowStart' }
  | { kind: 'rowEnd' }
  | { kind: 'gridStart' }
  | { kind: 'gridEnd' }
  | { kind: 'toggleGroup' };

/**
 * The next editable cell in reading order, wrapping across rows, or `null` when there is none —
 * which the caller must treat as "let focus leave the grid" rather than trapping it in place.
 */
export function nextEditableCell(
  from: CellAddress,
  columns: NavigableColumn[],
  rowCount: number,
  direction: 'forward' | 'backward',
): CellAddress | null {
  const width = columns.length;
  if (width === 0 || rowCount === 0) return null;

  const columnIndex = columns.findIndex((column) => column.id === from.columnId);
  const step = direction === 'forward' ? 1 : -1;
  // Focus can sit on a column outside the schema (the hierarchy column, the row action), so an
  // unknown id starts the walk at the row edge instead of giving up.
  const origin =
    columnIndex === -1 ? (direction === 'forward' ? -1 : width) : columnIndex;

  const total = rowCount * width;
  for (let flat = from.rowIndex * width + origin + step; flat >= 0 && flat < total; flat += step) {
    const candidate = columns[flat % width];
    if (candidate.editable) {
      return { rowIndex: Math.floor(flat / width), columnId: candidate.id };
    }
  }
  return null;
}

/** Which keys the adapter claims from the vendor. `null` means "the grid handles it". */
export function keyAction(event: {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  editing: boolean;
  isGroupRow: boolean;
}): MatrixKeyAction | null {
  // An open editor owns every key: Home and End belong to the text caret, not to navigation.
  if (event.editing) return null;

  const modified = event.ctrlKey === true || event.metaKey === true;

  if (event.key === 'Home') return modified ? { kind: 'gridStart' } : { kind: 'rowStart' };
  if (event.key === 'End') return modified ? { kind: 'gridEnd' } : { kind: 'rowEnd' };
  // 'Spacebar' is the legacy key name some browsers still report.
  if ((event.key === ' ' || event.key === 'Spacebar') && event.isGroupRow) {
    return { kind: 'toggleGroup' };
  }
  return null;
}

/** Where a claimed key should put focus. `null` for actions that move nothing. */
export function targetForAction(
  action: MatrixKeyAction,
  grid: { rowIndex: number; columns: NavigableColumn[]; rowCount: number },
): CellAddress | null {
  const { rowIndex, columns, rowCount } = grid;
  if (columns.length === 0 || rowCount === 0) return null;

  const first = columns[0].id;
  const last = columns[columns.length - 1].id;

  switch (action.kind) {
    case 'rowStart':
      return { rowIndex, columnId: first };
    case 'rowEnd':
      return { rowIndex, columnId: last };
    case 'gridStart':
      return { rowIndex: 0, columnId: first };
    case 'gridEnd':
      return { rowIndex: rowCount - 1, columnId: last };
    default:
      return null;
  }
}
