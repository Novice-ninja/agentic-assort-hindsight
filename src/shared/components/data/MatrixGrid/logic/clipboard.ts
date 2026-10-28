import type { CellValue, ColumnDataType, PasteOutcome } from '../MatrixGrid.types';
import { parseLocaleDate, parseLocaleNumber } from './localeNumber';

/**
 * Clipboard shaping: TSV in, TSV out, and the mapping of a pasted block onto the cells actually in
 * view. Pure and vendor-free — the adapter hands AG Grid's `processDataFromClipboard` payload
 * straight through here, which is what makes paste behaviour testable without a browser.
 *
 * Every value conversion goes through `localeNumber`, so a pasted cell and a typed cell cannot
 * diverge: `1.234,56` from a Spanish spreadsheet is 1234.56 in both paths (research R14).
 */

const NEEDS_QUOTING = /["\t\n\r]/;

export function serialiseTsv(cells: (CellValue | undefined)[][]): string {
  return cells
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return '';
          const text = String(cell);
          return NEEDS_QUOTING.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join('\t'),
    )
    .join('\n');
}

/**
 * RFC 4180: comma-separated, CRLF-terminated, quotes doubled. Deliberately NOT locale-aware — a
 * locale that uses the comma as a decimal separator would otherwise produce a file that no
 * spreadsheet can read back the same way. The values themselves are already formatted strings.
 */
export function serialiseCsv(cells: (CellValue | undefined)[][]): string {
  return cells
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return '';
          const text = String(cell);
          return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(','),
    )
    .join('\r\n');
}

/**
 * Reads a clipboard payload. Excel appends a trailing newline and can quote a cell that contains a
 * tab or a line break, so this is a small state machine rather than a `split`.
 */
export function parseTsv(text: string): string[][] {
  if (text === '') return [];

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  const endCell = () => {
    row.push(cell);
    cell = '';
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"' && cell === '') {
      quoted = true;
    } else if (char === '\t') {
      endCell();
    } else if (char === '\n') {
      endRow();
    } else if (char === '\r') {
      if (text[index + 1] === '\n') index += 1;
      endRow();
    } else {
      cell += char;
    }
  }

  if (cell !== '' || row.length > 0) endRow();

  // A single trailing newline is Excel's, not a row of empty cells.
  const last = rows[rows.length - 1];
  if (rows.length > 0 && last.length === 1 && last[0] === '') rows.pop();

  return rows;
}

export interface PasteColumn {
  id: string;
  editable: boolean;
  dataType: ColumnDataType;
}

export interface PasteRejection {
  rowId: string;
  columnId: string;
  text: string;
}

export interface MapPasteArgs {
  parsed: string[][];
  anchor: { rowIndex: number; columnId: string };
  rowIdsInView: string[];
  columnsInView: PasteColumn[];
  /** Drives parsing, so a localized spreadsheet pastes correctly (research R14). */
  locale: string;
}

export interface MapPasteResult {
  /** Aligned to the anchor. `undefined` marks a target that must not be written. */
  shaped: (CellValue | undefined)[][];
  outcome: PasteOutcome;
  /** Cells whose text could not be read as the target column's type. */
  rejected: PasteRejection[];
}

function convert(text: string, column: PasteColumn, locale: string): CellValue | undefined {
  const trimmed = text.trim();
  if (trimmed === '') return null;

  if (column.dataType === 'text') return text;
  if (column.dataType === 'date') return parseLocaleDate(trimmed, locale) ?? undefined;

  const parsed = parseLocaleNumber(trimmed, locale);
  return parsed === null ? undefined : parsed;
}

export function mapPaste({
  parsed,
  anchor,
  rowIdsInView,
  columnsInView,
  locale,
}: MapPasteArgs): MapPasteResult {
  const anchorColumn = columnsInView.findIndex((column) => column.id === anchor.columnId);
  const outcome: PasteOutcome = { written: 0, skippedReadOnly: 0, truncated: 0 };
  const rejected: PasteRejection[] = [];

  if (anchorColumn === -1 || anchor.rowIndex < 0) {
    return { shaped: [], outcome, rejected };
  }

  const rowCapacity = rowIdsInView.length - anchor.rowIndex;
  const columnCapacity = columnsInView.length - anchorColumn;

  const shaped: (CellValue | undefined)[][] = [];

  parsed.forEach((sourceRow, rowOffset) => {
    if (rowOffset >= rowCapacity) {
      outcome.truncated += sourceRow.length;
      return;
    }

    /**
     * Written through a map keyed by the resolved target rather than by source position, so if two
     * source cells ever resolve to the same cell the later one wins instead of the two being
     * merged.
     */
    const targets = new Map<string, CellValue | undefined>();
    const order: string[] = [];

    sourceRow.forEach((text, columnOffset) => {
      if (columnOffset >= columnCapacity) {
        outcome.truncated += 1;
        return;
      }
      const column = columnsInView[anchorColumn + columnOffset];
      const rowId = rowIdsInView[anchor.rowIndex + rowOffset];

      if (!targets.has(column.id)) order.push(column.id);

      if (!column.editable) {
        outcome.skippedReadOnly += 1;
        targets.set(column.id, undefined);
        return;
      }

      const value = convert(text, column, locale);
      if (value === undefined) {
        rejected.push({ rowId, columnId: column.id, text });
        targets.set(column.id, undefined);
        return;
      }

      targets.set(column.id, value);
    });

    // A target overwritten by a later source cell must not be counted twice.
    const values = order.map((columnId) => targets.get(columnId));
    outcome.written += values.filter((value) => value !== undefined).length;
    shaped.push(values);
  });

  return { shaped, outcome, rejected };
}
