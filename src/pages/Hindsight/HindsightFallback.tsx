import { useTranslation } from 'react-i18next';
import styles from './HindsightFallback.module.css';

/**
 * Shown while the code-split Hindsight bundle downloads.
 *
 * The skeleton mirrors the page's real layout so the transition to loaded content does not
 * shift anything, and it announces itself so a screen reader user is told the page is on its
 * way rather than meeting silence.
 */
export function HindsightFallback() {
  const { t } = useTranslation('hindsight');

  return (
    <div className={styles.wrap} role="status" aria-busy="true">
      <span className={styles.visuallyHidden}>{t('states.loadingPage')}</span>
      <div className={styles.headerBlock} />
      <div className={styles.filterBlock} />
      <div className={styles.grid}>
        <div className={[styles.block, styles.half].join(' ')} />
        <div className={[styles.block, styles.half].join(' ')} />
        <div className={[styles.block, styles.third].join(' ')} />
        <div className={[styles.block, styles.third].join(' ')} />
        <div className={[styles.block, styles.third].join(' ')} />
      </div>
    </div>
  );
}
