import { useTranslation } from 'react-i18next';
import { LocationList, useLocations } from '@modules/locations';
import styles from './LocationsPage.module.css';

export function LocationsPage() {
  const { t } = useTranslation('locations');
  const { visibleItems, status, regions, filters, toggleRegion } = useLocations();

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('locations.title')}</h1>
        <p className={styles.subtitle}>{t('locations.subtitle')}</p>
      </header>
      <LocationList
        locations={visibleItems}
        loading={status === 'loading'}
        regions={regions}
        activeRegions={filters.region}
        onToggleRegion={toggleRegion}
      />
    </div>
  );
}
