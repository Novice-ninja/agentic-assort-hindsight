import { useTranslation } from 'react-i18next';
import styles from './ClusteringFallback.module.css';

export function ClusteringFallback() {
  const { t } = useTranslation('clustering');

  return (
    <div className={styles.wrap} role="status" aria-busy="true">
      <span className={styles.visuallyHidden}>{t('states.loadingPage')}</span>
      <div className={styles.headerBlock} />
      <div className={styles.filterBlock} />
      <div className={styles.grid}>
        <div className={[styles.block, styles.half].join(' ')} />
        <div className={[styles.block, styles.half].join(' ')} />
      </div>
    </div>
  );
}
