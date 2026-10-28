import { useTranslation } from 'react-i18next';
import { Badge } from '@shared/components';
import styles from './CalendarMappingPlaceholder.module.css';

export function CalendarMappingPlaceholder() {
  const { t } = useTranslation('admin');

  return (
    <div className={styles.card}>
      <Badge variant="warning">{t('status.inProgress')}</Badge>
      <h2 className={styles.title}>{t('calendar.title')}</h2>
      <p className={styles.body}>{t('calendar.body')}</p>
    </div>
  );
}
