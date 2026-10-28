import type { ColumnBadge, ColumnVariant } from '../MatrixGrid.types';
import styles from './PairedValueCell.module.css';

/**
 * One cell of a paired read-only/editable column.
 *
 * No AG Grid type appears here: the adapter maps the vendor's cell params onto these props, which
 * is what keeps the vendor import confined to `MatrixGrid.tsx` (contract §1).
 */
export interface PairedValueCellProps {
  /** Already formatted for the active locale by the adapter's value formatter. */
  text: string;
  variant?: ColumnVariant;
  badge?: ColumnBadge;
  /** Derived from the paired values, never stored (research R5). */
  modified?: boolean;
  readOnly?: boolean;
  /** Accessible name for the changed marker. Already translated. */
  modifiedLabel: string;
  /** Tooltip on a read-only cell. Already translated. */
  readOnlyLabel: string;
}

export function PairedValueCell({
  text,
  variant,
  badge,
  modified = false,
  readOnly = false,
  modifiedLabel,
  readOnlyLabel,
}: PairedValueCellProps) {
  return (
    <span
      className={styles.cell}
      data-variant={variant}
      data-modified={modified ? 'true' : undefined}
      title={readOnly ? readOnlyLabel : undefined}
    >
      {badge && (
        <span className={styles.badge} title={badge.title}>
          {badge.text}
        </span>
      )}
      <span className={styles.value}>{text}</span>
      {/*
       * A marker glyph, not just a tint: colour alone is not a signal (constitution III). It is
       * labelled rather than `aria-hidden`, because "this value was overridden" is information a
       * screen reader user needs as much as a sighted one.
       */}
      {modified && (
        <span className={styles.marker} role="img" aria-label={modifiedLabel}>
          ◆
        </span>
      )}
    </span>
  );
}
