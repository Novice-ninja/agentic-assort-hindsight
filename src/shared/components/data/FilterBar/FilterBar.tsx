import type { ReactNode } from 'react';
import styles from './FilterBar.module.css';

export interface FilterBarProps {
  children: ReactNode;
  count?: number;
  actionSlot?: ReactNode;
  label?: string;
}

export function FilterBar({ children, count, actionSlot, label = 'Filters' }: FilterBarProps) {
  return (
    <div className={styles.bar} role="group" aria-label={label}>
      <div className={styles.chips}>{children}</div>
      <div className={styles.meta}>
        {typeof count === 'number' && (
          <span className={styles.count}>
            {count} {count === 1 ? 'filter' : 'filters'}
          </span>
        )}
        {actionSlot}
      </div>
    </div>
  );
}
