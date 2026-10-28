import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import type { ModuleKey, ModuleStatus, ModuleStatusSummary } from '../types';
import styles from './ModuleStepper.module.css';

export interface ModuleStepperItem {
  module: ModuleKey;
  status: ModuleStatus;
  labelKey: string;
}

export interface ModuleStepperProps {
  items: ModuleStepperItem[];
  activeModule: ModuleKey;
  onSelect: (module: ModuleKey) => void;
  statusSummaries?: ModuleStatusSummary[];
}

function IconGradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--iris-400)" />
        <stop offset="55%" stopColor="var(--coral-400)" />
        <stop offset="100%" stopColor="var(--saffron-300)" />
      </linearGradient>
    </defs>
  );
}

function ModuleIcon({ module }: { module: ModuleKey }) {
  const gradId = `module-icon-grad-${module}`;
  const fill = `url(#${gradId})`;

  const icons: Record<ModuleKey, JSX.Element> = {
    products: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <IconGradientDefs id={gradId} />
        <path d="M8.5 5h7l1 2.2 3 1.6v3.7h-2v8.5h-11v-8.5h-2V8.8l3-1.6L8.5 5z" fill={fill} opacity="0.85" />
        <path d="M10 5a2 2 0 0 0 4 0" stroke="var(--color-surface)" strokeWidth="1.2" fill="none" />
      </svg>
    ),
    locations: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <IconGradientDefs id={gradId} />
        <path d="M12 2.5c-3.9 0-7 3-7 6.7 0 5 7 12 7 12s7-7 7-12c0-3.7-3.1-6.7-7-6.7z" fill={fill} />
        <circle cx="12" cy="9.2" r="2.4" fill="var(--color-surface)" />
      </svg>
    ),
    calendar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <IconGradientDefs id={gradId} />
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.2" fill={fill} opacity="0.9" />
        <rect x="3.5" y="5.5" width="17" height="4.2" rx="2.2" fill={fill} />
        <rect x="7" y="2.8" width="1.8" height="4.4" rx="0.9" fill="var(--color-surface)" />
        <rect x="15.2" y="2.8" width="1.8" height="4.4" rx="0.9" fill="var(--color-surface)" />
        <rect x="6.5" y="12" width="3" height="3" rx="0.6" fill="var(--color-surface)" opacity="0.85" />
        <rect x="11" y="12" width="3" height="3" rx="0.6" fill="var(--color-surface)" opacity="0.55" />
        <rect x="15.5" y="12" width="3" height="3" rx="0.6" fill="var(--color-surface)" opacity="0.4" />
      </svg>
    ),
    exceptions: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <IconGradientDefs id={gradId} />
        <path d="M12 2.5l8 3v6.5c0 4.6-3.4 8.7-8 9.5-4.6-.8-8-4.9-8-9.5V5.5l8-3z" fill={fill} />
        <rect x="11.1" y="7.5" width="1.8" height="6.4" rx="0.9" fill="var(--color-surface)" />
        <circle cx="12" cy="16.5" r="1.1" fill="var(--color-surface)" />
      </svg>
    ),
  };

  return icons[module];
}

const STATUS_CLASS: Record<ModuleStatus, string> = {
  active: 'statusActive',
  done: 'statusDone',
  inProgress: 'statusInProgress',
};

export function ModuleStepper({
  items,
  activeModule,
  onSelect,
  statusSummaries = [],
}: ModuleStepperProps) {
  const { t } = useTranslation('admin');

  const statusFor = (module: ModuleKey): ModuleStatus =>
    statusSummaries.find((s) => s.module === module)?.status ?? 'active';

  return (
    <div className={styles.row} role="tablist" aria-label={t('stepper.label')}>
      {items.map((item) => {
        const selected = item.module === activeModule;
        const status = statusFor(item.module);
        return (
          <button
            key={item.module}
            type="button"
            role="tab"
            className={[
              styles.card,
              styles[STATUS_CLASS[status]],
              selected && styles.selected,
              focusRingClass,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-selected={selected}
            aria-current={selected ? 'step' : undefined}
            onClick={() => onSelect(item.module)}
          >
            <span className={styles.glow} aria-hidden />
            <span className={styles.header}>
              <span className={styles.iconTile}>
                <ModuleIcon module={item.module} />
              </span>
              <span className={styles.title}>{t(item.labelKey)}</span>
              <span className={styles.statusPill}>
                <span className={styles.statusDot} aria-hidden />
                {t(`status.${status}`)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export const MODULE_STEPPER_ITEMS: ModuleStepperItem[] = [
  { module: 'products', status: 'active', labelKey: 'modules.products' },
  { module: 'locations', status: 'done', labelKey: 'modules.locations' },
  { module: 'calendar', status: 'inProgress', labelKey: 'modules.calendar' },
  { module: 'exceptions', status: 'active', labelKey: 'modules.exceptions' },
];
