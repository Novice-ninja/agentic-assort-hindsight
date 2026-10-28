import type { EditRecord } from '../MatrixGrid.types';

/**
 * Undo/redo history, as pure functions over a bounded pair of stacks.
 *
 * AG Grid's own `undoRedoCellEditing` is deliberately not used (research R5): under
 * `readOnlyEdit` the grid never owns the data, so its stack would replay against a dataset it
 * cannot see. This journal stores only the records — never a copy of the dataset — so its memory
 * cost is the edit count, not the row count.
 */

export interface EditJournal {
  past: EditRecord[];
  future: EditRecord[];
  limit: number;
}

export function createJournal(limit: number): EditJournal {
  return { past: [], future: [], limit: Math.max(1, limit) };
}

/** Appends one record. A new edit forks the history, so the redo stack is dropped. */
export function record(journal: EditJournal, entry: EditRecord): EditJournal {
  const past = [...journal.past, entry];
  return {
    past: past.length > journal.limit ? past.slice(past.length - journal.limit) : past,
    future: [],
    limit: journal.limit,
  };
}

function invert(entry: EditRecord, source: EditRecord['source']): EditRecord {
  return {
    ...entry,
    oldValue: entry.newValue,
    newValue: entry.oldValue,
    source,
    timestamp: Date.now(),
  };
}

export function undo(journal: EditJournal): {
  journal: EditJournal;
  inverse: EditRecord | null;
} {
  if (journal.past.length === 0) return { journal, inverse: null };

  const entry = journal.past[journal.past.length - 1];
  return {
    journal: {
      past: journal.past.slice(0, -1),
      future: [...journal.future, entry],
      limit: journal.limit,
    },
    inverse: invert(entry, 'undo'),
  };
}

export function redo(journal: EditJournal): {
  journal: EditJournal;
  replay: EditRecord | null;
} {
  if (journal.future.length === 0) return { journal, replay: null };

  const entry = journal.future[journal.future.length - 1];
  return {
    journal: {
      past: [...journal.past, entry],
      future: journal.future.slice(0, -1),
      limit: journal.limit,
    },
    replay: { ...entry, source: 'redo', timestamp: Date.now() },
  };
}

/** Drops history for rows a data refresh removed, so undo can never resurrect a dead row. */
export function dropRows(journal: EditJournal, rowIds: string[]): EditJournal {
  const removed = new Set(rowIds);
  const keep = (entry: EditRecord) => !removed.has(entry.rowId);
  return {
    past: journal.past.filter(keep),
    future: journal.future.filter(keep),
    limit: journal.limit,
  };
}
