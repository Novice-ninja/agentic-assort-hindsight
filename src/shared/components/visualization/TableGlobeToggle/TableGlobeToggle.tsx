import { useTranslation } from 'react-i18next';
import { IconButton } from '@shared/components';
import type { ViewMode } from '@modules/admin/types';
import styles from './TableGlobeToggle.module.css';

export interface TableGlobeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  tableLabel?: string;
  globeLabel?: string;
}

function TableIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export function TableGlobeToggle({
  value,
  onChange,
  tableLabel,
  globeLabel,
}: TableGlobeToggleProps) {
  const { t } = useTranslation('admin');

  const table = tableLabel ?? t('view.table');
  const globe = globeLabel ?? t('view.globe');

  return (
    <div className={styles.group} role="group" aria-label={t('view.toggleLabel')}>
      <IconButton
        className={[styles.btn, value === 'table' && styles.active].filter(Boolean).join(' ')}
        aria-label={table}
        aria-pressed={value === 'table'}
        onClick={() => onChange('table')}
      >
        <TableIcon />
      </IconButton>
      <IconButton
        className={[styles.btn, value === 'globe' && styles.active].filter(Boolean).join(' ')}
        aria-label={globe}
        aria-pressed={value === 'globe'}
        onClick={() => onChange('globe')}
      >
        <GlobeIcon />
      </IconButton>
    </div>
  );
}
