import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import { Select } from '@shared/components';
import type { AdminLocation } from '../types';
import {
  CUSTOMER_TYPE_OPTIONS,
  FULFILLMENT_TYPE_OPTIONS,
  INCOME_LEVEL_OPTIONS,
  LOCATION_CLIMATE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
} from '../types/location';
import styles from './LocationDetailCard.module.css';

export interface LocationDetailCardProps {
  location: AdminLocation;
  expanded: boolean;
  readOnly?: boolean;
  onToggle: () => void;
  onAttributeChange?: (field: keyof AdminLocation, value: string) => void;
}

function toOptions(values: string[], t: (key: string) => string) {
  return values.map((v) => ({ value: v, label: t(`enums.${v}`) }));
}

export function LocationDetailCard({
  location,
  expanded,
  readOnly = false,
  onToggle,
  onAttributeChange,
}: LocationDetailCardProps) {
  const { t } = useTranslation('admin');

  const fields: { key: keyof AdminLocation; options: string[] }[] = [
    { key: 'climate', options: LOCATION_CLIMATE_OPTIONS },
    { key: 'customerType', options: CUSTOMER_TYPE_OPTIONS },
    { key: 'fulfillmentType', options: FULFILLMENT_TYPE_OPTIONS },
    { key: 'incomeLevel', options: INCOME_LEVEL_OPTIONS },
    { key: 'locationType', options: LOCATION_TYPE_OPTIONS },
  ];

  return (
    <article className={[styles.card, expanded && styles.expanded].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={[styles.header, focusRingClass].join(' ')}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`location-${location.id}-body`}
      >
        <span className={styles.thumb} aria-hidden />
        <span className={styles.headerText}>
          <span className={styles.name}>{location.name}</span>
          <span className={styles.meta}>
            {location.id}
            {location.city ? ` · ${location.city}` : ''}
          </span>
        </span>
      </button>

      {expanded && (
        <div id={`location-${location.id}-body`} className={styles.body}>
          {fields.map(({ key, options }) => (
            <Select
              key={key}
              label={t(`locationCard.${key}`)}
              options={toOptions(options, t)}
              value={[String(location[key])]}
              onChange={(v) => !readOnly && onAttributeChange?.(key, v[0] ?? '')}
            />
          ))}
        </div>
      )}
    </article>
  );
}
