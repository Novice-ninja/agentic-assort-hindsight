import type { ReactNode } from 'react';
import { visuallyHiddenClass } from '@shared/a11y';
import { Checkbox } from '@shared/components/primitives';
import styles from './DataTable.module.css';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'start' | 'end' | 'center';
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  caption?: string;
  loading?: boolean;
  emptyMessage?: string;
  // Controlled sorting
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  // Controlled selection
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  caption,
  loading = false,
  emptyMessage = 'No results found',
  sort,
  onSortChange,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    const direction: SortDirection =
      sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ key, direction });
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : data.map(getRowId));
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  };

  if (loading) {
    return (
      <div className={styles.state} role="status">
        Loading…
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.state} role="status">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      <table className={styles.table}>
        {caption && <caption className={visuallyHiddenClass}>{caption}</caption>}
        <thead>
          <tr>
            {selectable && (
              <th className={styles.checkboxCell} scope="col">
                <Checkbox
                  label="Select all rows"
                  hideLabel
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                  className={styles[`align-${col.align ?? 'start'}`]}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.header}
                      <span aria-hidden="true">
                        {isSorted ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const id = getRowId(row);
            const selected = selectedIds.includes(id);
            return (
              <tr key={id} aria-selected={selectable ? selected : undefined}>
                {selectable && (
                  <td className={styles.checkboxCell}>
                    <Checkbox
                      label={`Select row ${id}`}
                      hideLabel
                      checked={selected}
                      onChange={() => toggleRow(id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={styles[`align-${col.align ?? 'start'}`]}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
