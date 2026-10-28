import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components';
import styles from './AdminEmptyState.module.css';

export interface AdminEmptyStateProps {
  variant?: 'global' | 'module';
  onAddFilter: () => void;
}

function PuppyIllustration() {
  return (
    <svg className={styles.illustration} viewBox="0 0 160 130" role="img" aria-hidden>
      <circle cx="28" cy="24" r="4" fill="var(--iris-300)" opacity="0.8" />
      <circle cx="132" cy="18" r="3" fill="var(--coral-300)" opacity="0.8" />
      <circle cx="120" cy="108" r="5" fill="var(--sky-300)" opacity="0.7" />
      <ellipse cx="80" cy="92" rx="42" ry="24" fill="var(--amber-200)" />
      <ellipse cx="80" cy="58" rx="28" ry="26" fill="var(--color-surface)" />
      <circle cx="54" cy="34" r="16" fill="var(--amber-300)" />
      <circle cx="106" cy="34" r="16" fill="var(--amber-300)" />
      <circle cx="70" cy="54" r="4" fill="var(--graphite-800)" />
      <circle cx="90" cy="54" r="4" fill="var(--graphite-800)" />
      <ellipse cx="80" cy="66" rx="7" ry="5" fill="var(--coral-300)" />
      <path d="M38 28 L28 12 M122 28 L132 12" stroke="var(--amber-400)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="48" cy="108" rx="10" ry="5" fill="var(--graphite-8)" opacity="0.12" />
      <rect x="118" y="88" width="14" height="8" rx="4" fill="var(--iris-200)" transform="rotate(20 125 92)" />
    </svg>
  );
}

export function AdminEmptyState({ variant = 'global', onAddFilter }: AdminEmptyStateProps) {
  const { t } = useTranslation('admin');

  return (
    <div className={styles.wrap}>
      <PuppyIllustration />
      <h2 className={styles.title}>
        {t(variant === 'global' ? 'empty.globalTitle' : 'empty.moduleTitle')}
      </h2>
      <p className={styles.body}>
        {t(variant === 'global' ? 'empty.globalBody' : 'empty.moduleBody')}
      </p>
      <Button variant="primary" className={styles.addFilterBtn} onClick={onAddFilter}>
        {t('empty.addFilter')}
      </Button>
    </div>
  );
}
