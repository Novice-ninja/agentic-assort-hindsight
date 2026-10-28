import type { ICellRendererParams } from 'ag-grid-community';
import type { AdminProduct } from '../../types';
import styles from './ColourSwatchCell.module.css';

export function ColourSwatchCell({ data }: ICellRendererParams<AdminProduct>) {
  if (!data?.colour) return null;
  const { label, hex } = data.colour;
  return (
    <span className={styles.cell}>
      <span className={styles.swatch} style={{ backgroundColor: hex }} aria-hidden />
      <span className={styles.label}>{label}</span>
    </span>
  );
}
