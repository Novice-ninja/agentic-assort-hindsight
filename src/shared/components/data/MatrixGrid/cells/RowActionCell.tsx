import styles from './RowActionCell.module.css';

/**
 * The row bulk-apply action. Rendered only where the host marked the row `acceptable`, so a screen
 * that never sets it gets no action column at all.
 */
export interface RowActionCellProps {
  /** Accessible name and visible label. Already translated. */
  label: string;
  onApply: () => void;
}

export function RowActionCell({ label, onApply }: RowActionCellProps) {
  return (
    <button type="button" className={styles.action} onClick={onApply}>
      {label}
    </button>
  );
}

/**
 * AG Grid focuses the *cell*, never the button inside it, so without this the bulk-apply action is
 * unreachable by keyboard (research R9). Returning `false` for Tab lets the browser move focus into
 * and out of the button instead of the grid swallowing the key for cell navigation.
 *
 * Typed structurally rather than against `SuppressKeyboardEventParams`, because only
 * `MatrixGrid.tsx` may import AG Grid types (contract §1).
 */
export interface SuppressKeyboardEventLike {
  event: { key: string; shiftKey: boolean; target: EventTarget | null };
  editing: boolean;
}

export function rowActionSuppressKeyboardEvent({ event, editing }: SuppressKeyboardEventLike): boolean {
  if (editing || event.key !== 'Tab') return false;

  const target = event.target as HTMLElement | null;
  const cell = target?.closest?.('[role="gridcell"]');
  const button = cell?.querySelector<HTMLButtonElement>('button');
  if (!button) return false;

  // Forward into the button, back out of it: in both cases the grid must not consume the key.
  const focusIsOnButton = target === button;
  if (event.shiftKey) return focusIsOnButton;
  return !focusIsOnButton;
}
