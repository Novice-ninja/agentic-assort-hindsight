import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { VariantMetrics } from '../types';
import styles from './wizard.module.css';

export interface ReviewMetricTilesProps {
  metrics: VariantMetrics | null;
}

const MISSING = '-';

function displayNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return MISSING;
  return String(value);
}

function formatFitPercent(value: number | null | undefined, locale: string): string {
  if (value === null || value === undefined) return MISSING;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)}%`;
}

function MetricTile({
  badge,
  children,
  contentClassName,
}: {
  badge: string;
  children: ReactNode;
  contentClassName?: string;
}) {
  const tileRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const badgeEl = badgeRef.current;
    const tileEl = tileRef.current;
    if (!badgeEl || !tileEl) return;
    const sync = () => {
      tileEl.style.setProperty('--notch-w', `${badgeEl.offsetWidth - 7}px`);
    };
    sync();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(badgeEl);
    return () => ro.disconnect();
  }, []);

  return (
    <article ref={tileRef} className={styles.metricTile}>
      <div className={styles.metricTileBg} aria-hidden="true" />
      <div className={styles.metricTileWell} aria-hidden="true" />
      <div className={styles.metricTileScoop} aria-hidden="true" />
      <p className={contentClassName ?? styles.metricTileContent}>{children}</p>
      <span ref={badgeRef} className={styles.metricTileBadge}>{badge}</span>
    </article>
  );
}

export function ReviewMetricTiles({ metrics }: ReviewMetricTilesProps) {
  const { t, i18n } = useTranslation('clustering');

  return (
    <div className={styles.metricTileGrid}>
      <MetricTile
        badge={t('review.metricCalculationLabel')}
        contentClassName={[styles.metricTileContent, styles.metricTileContentTight].join(' ')}
      >
        <span className={styles.metricTileHint}>
          {t('review.metricCalculationPrefix', {
            starts: displayNumber(metrics?.startingPoints),
          })}
        </span>
        <span className={styles.metricTileTotal}>
          {t('review.metricCalculationTotal', { total: displayNumber(metrics?.optionCount) })}
        </span>
      </MetricTile>
      <MetricTile badge={t('review.metricOptimalLabel')}>
        <span className={styles.metricTileTotal}>
          {t('review.metricOptimalValue', { k: displayNumber(metrics?.clusterCount) })}
        </span>
        <span className={styles.metricTileHint}>{t('review.metricOptimalHint')}</span>
      </MetricTile>
      <MetricTile badge={t('review.metricFitLabel')}>
        <span className={styles.metricTileTotal}>
          {t('review.metricFitValue', { pct: formatFitPercent(metrics?.fitPercent, i18n.language) })}
        </span>
        <span className={styles.metricTileHint}>{t('review.metricFitHint')}</span>
      </MetricTile>
    </div>
  );
}
