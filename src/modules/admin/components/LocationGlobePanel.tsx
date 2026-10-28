import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OrthographicGlobe } from '@shared/components/visualization';
import type { AdminLocation } from '../types';
import { locationToMarker } from '../services/adminMappers';
import { LocationDetailCard } from './LocationDetailCard';
import styles from './LocationGlobePanel.module.css';

export interface LocationGlobePanelProps {
  items: AdminLocation[];
  selectedId: string | null;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onAttributeChange?: (id: string, field: keyof AdminLocation, value: string) => void;
}

export function LocationGlobePanel({
  items,
  selectedId,
  readOnly = false,
  onSelect,
  onAttributeChange,
}: LocationGlobePanelProps) {
  const { t } = useTranslation('admin');

  const markers = useMemo(
    () => items.map((item) => locationToMarker(item, item.id === selectedId)),
    [items, selectedId],
  );

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{t('locations.globe.title')}</h3>
          <p className={styles.subtitle}>{t('locations.globe.subtitle', { count: items.length })}</p>
        </div>
      </header>

      <div className={styles.split}>
        <div className={styles.globe}>
          <OrthographicGlobe
            markers={markers}
            selectedId={selectedId}
            onSelect={onSelect}
            ariaLabel={t('locations.globe.aria')}
          />
        </div>

        <div className={styles.list} role="list" aria-label={t('locations.globe.listLabel')}>
          {items.map((location) => (
            <div key={location.id} role="listitem">
              <LocationDetailCard
                location={location}
                expanded={location.id === selectedId}
                readOnly={readOnly}
                onToggle={() => onSelect(location.id)}
                onAttributeChange={(field, value) =>
                  onAttributeChange?.(location.id, field, value)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
