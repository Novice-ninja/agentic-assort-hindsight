import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OrthographicGlobe } from '@shared/components/visualization';
import type { GlobalException } from '../types/exception';
import { exceptionToMarker } from '../services/adminMappers';
import { ExceptionDetailCard } from './ExceptionDetailCard';
import styles from './ExceptionGlobePanel.module.css';

export interface ExceptionGlobePanelProps {
  items: GlobalException[];
  selectedId: string | null;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onEditRule?: (exceptionId: string, ruleId: string, patch: Partial<GlobalException['rules'][0]>) => void;
  onAddRule?: (exceptionId: string) => void;
  onRemove?: (exceptionId: string) => void;
}

export function ExceptionGlobePanel({
  items,
  selectedId,
  readOnly = false,
  onSelect,
  onEditRule,
  onAddRule,
  onRemove,
}: ExceptionGlobePanelProps) {
  const { t } = useTranslation('admin');

  const markers = useMemo(
    () => items.map((item) => exceptionToMarker(item, item.id === selectedId)),
    [items, selectedId],
  );

  const totalRules = items.reduce((sum, item) => sum + item.rules.length, 0);

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{t('exceptions.globe.title')}</h3>
          <p className={styles.subtitle}>
            {t('exceptions.globe.subtitle', { stores: items.length, rules: totalRules })}
          </p>
        </div>
      </header>

      <div className={styles.split}>
        <div className={styles.globe}>
          <OrthographicGlobe
            markers={markers}
            selectedId={selectedId}
            onSelect={onSelect}
            ariaLabel={t('exceptions.globe.aria')}
          />
        </div>

        <div className={styles.list} role="list" aria-label={t('exceptions.globe.listLabel')}>
          {items.map((exception) => (
            <div key={exception.id} role="listitem">
              <ExceptionDetailCard
                exception={exception}
                expanded={exception.id === selectedId}
                readOnly={readOnly}
                onToggle={() => onSelect(exception.id)}
                onEditRule={(ruleId, patch) => onEditRule?.(exception.id, ruleId, patch)}
                onAddRule={() => onAddRule?.(exception.id)}
                onRemove={() => onRemove?.(exception.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
