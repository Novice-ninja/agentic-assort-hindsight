import type { CellValue, ColumnPair, RowDatum } from '../MatrixGrid.types';

/**
 * Whether a paired cell has been overridden — derived from the rows in props, never stored
 * (research R5). A stored flag drifts: after an undo the value goes back but the flag stays, and
 * the indicator then lies about the data the host holds.
 */

function normalise(value: CellValue | undefined): CellValue {
  if (value === undefined || value === '') return null;
  return value;
}

function equivalent(left: CellValue | undefined, right: CellValue | undefined): boolean {
  const a = normalise(left);
  const b = normalise(right);
  if (a === null || b === null) return a === b;
  // A number typed into a text-ish cell should not read as a change from the same number.
  if (typeof a !== typeof b) return String(a) === String(b);
  return a === b;
}

export function isCellModified(
  row: RowDatum,
  pair: { baselineField: string; editableField: string },
): boolean {
  return !equivalent(row.values[pair.baselineField], row.values[pair.editableField]);
}

export function getModifiedRowIds(rows: RowDatum[], pairs: ColumnPair[]): string[] {
  if (pairs.length === 0) return [];
  return rows
    .filter((row) => pairs.some((pair) => isCellModified(row, pair)))
    .map((row) => row.rowId);
}
