import type { ICellRendererParams } from 'ag-grid-community';
import type { AdminProduct } from '../../types';
import styles from './BrandPillCell.module.css';

export function BrandPillCell({ value }: ICellRendererParams<AdminProduct>) {
  if (!value) return null;
  return <span className={styles.pill}>{value}</span>;
}
