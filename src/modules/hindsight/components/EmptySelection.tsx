import { useTranslation } from 'react-i18next';
import styles from './EmptySelection.module.css';

/**
 * Shown when the current filter cannot produce data.
 *
 * It names the remedy rather than just reporting the absence: a planner who has narrowed to
 * an intersection with no data needs to know which filter to widen, not that something is
 * "empty".
 */
export function EmptySelection() {
  const { t } = useTranslation('hindsight');

  return (
    <div className={styles.empty} role="status" data-testid="hindsight-empty-selection">
      <p className={styles.title}>{t('states.empty')}</p>
      <p className={styles.hint}>{t('states.emptyHint')}</p>
    </div>
  );
}
