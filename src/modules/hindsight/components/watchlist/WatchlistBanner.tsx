import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import iconMain from '@assets/icons/hindsight/watchlist/icon-main.svg';
import redGradient from '@assets/icons/hindsight/watchlist/red-gradient.svg';
import warningIcon from '@assets/icons/hindsight/watchlist/warning.svg';
import highIcon from '@assets/icons/hindsight/watchlist/high.svg';
import watchIcon from '@assets/icons/hindsight/watchlist/watch.svg';
import totalScannedIcon from '@assets/icons/hindsight/watchlist/total-scanned.svg';
import tuneIcon from '@assets/icons/hindsight/watchlist/tune.svg';
import { WatchlistEditPanel } from './WatchlistEditPanel';
import { applyThresholdEdits } from './watchlistThresholds';
import { WatchlistRuleCard } from './WatchlistRuleCard';
import type { WatchlistThreshold } from './WatchlistRuleCard';
import { Button } from '@shared/components/vendor/impact-ui';
import styles from './WatchlistBanner.module.css';

/** Icon per metric. A key outside this map falls back to the warning icon. */
const METRIC_ICONS: Record<string, string> = {
  critical: warningIcon,
  high: highIcon,
  watch: watchIcon,
  totalScanned: totalScannedIcon,
};

export type { WatchlistThreshold };

export interface WatchlistMetric {
  /** `critical`, `high`, `watch` or `totalScanned` pick that metric's icon. */
  key: string;
  label: string;
  value: number | string;
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 14v-2.67l8.2-8.2a1 1 0 0 1 1.41 0l1.26 1.26a1 1 0 0 1 0 1.41L4.67 14H2Zm1.33-1.33h.56l7.06-7.06-.56-.56-7.06 7.06v.56Z"
        fill="#fff"
      />
    </svg>
  );
}

export interface WatchlistBannerProps {
  /** Number in "N Items Need Attention". */
  attentionCount: number;
  /** Date the watchlist was last edited. */
  lastEditedOn: Date | string;
  metrics: readonly WatchlistMetric[];
  thresholds: readonly WatchlistThreshold[];
  /** Fired after "Apply Changes" with the edited number per rule key. */
  onApplyThresholds?: (numbers: Record<string, string>) => void;
}

/**
 * Watchlist header banner: a summary row (icon, headline, metrics, CTA) above a second
 * container whose content is still to be defined.
 */
export function WatchlistBanner({
  attentionCount,
  lastEditedOn,
  metrics,
  thresholds,
  onApplyThresholds,
}: WatchlistBannerProps) {
  const { t, i18n } = useTranslation('hindsight');
  const locale = i18n.language === 'en' ? 'en-GB' : i18n.language;
  const [rulesVisible, setRulesVisible] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // Rule values shown in the cards; "Apply Changes" in the edit panel updates these.
  const [rules, setRules] = useState(thresholds);
  const date = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(lastEditedOn));

  return (
    <section
      className={[styles.banner, rulesVisible ? '' : styles.collapsed].join(' ')}
      aria-label={t('watchlist.bannerLabel')}
      data-testid="hindsight-watchlist-banner"
    >
      <img src={redGradient} alt="" aria-hidden="true" className={styles.overlay} />

      <div className={styles.summary} data-testid="hindsight-watchlist-summary">
        <img src={iconMain} alt="" aria-hidden="true" className={styles.icon} />

        <div className={styles.textSet}>
          <h2 className={styles.heading}>
            {t('watchlist.attentionTitle', { count: attentionCount })}
          </h2>
          <p className={styles.subheading}>{t('watchlist.lastEdited', { date })}</p>
        </div>

        <span className={styles.divider} aria-hidden="true" />

        <ul className={styles.metrics}>
          {metrics.map((metric) => (
            <li key={metric.key} className={styles.metric}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValueRow}>
                <img
                  src={METRIC_ICONS[metric.key] ?? warningIcon}
                  alt=""
                  aria-hidden="true"
                />
                <span className={styles.metricValue}>{metric.value}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <Button
            variant="tertiary"
            aria-expanded={rulesVisible}
            aria-controls="hindsight-watchlist-details"
            onClick={() => setRulesVisible((prev) => !prev)}
            data-testid="hindsight-watchlist-toggle-rules"
          >
            {rulesVisible ? t('watchlist.hideRules') : t('watchlist.showRules')}
          </Button>
        </div>
      </div>

      <div
        id="hindsight-watchlist-details"
        className={[styles.detailsWrap, rulesVisible ? '' : styles.detailsCollapsed].join(
          ' ',
        )}
      >
        <div className={styles.detailsClip}>
          <div className={styles.details} data-testid="hindsight-watchlist-details">
            <div className={styles.detailsHeading}>
              <img src={tuneIcon} alt="" aria-hidden="true" />
              <h3 className={styles.detailsTitle}>{t('watchlist.thresholds')}</h3>
              <Button
                variant="tertiary"
                icon={<EditIcon />}
                aria-label={t('watchlist.editThresholds')}
                onClick={() => setEditOpen(true)}
                className={styles.detailsAction}
                data-testid="hindsight-watchlist-edit-thresholds"
              />
            </div>

            <ul className={styles.rules}>
              {rules.map((rule) => (
                <WatchlistRuleCard
                  key={rule.key}
                  title={rule.title}
                  subtitle={rule.subtitle}
                  value={rule.value}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <WatchlistEditPanel
        open={editOpen}
        onClose={() => setEditOpen(false)}
        thresholds={rules}
        defaults={thresholds}
        onApply={(numbers) => {
          setRules((prev) => applyThresholdEdits(prev, numbers));
          onApplyThresholds?.(numbers);
        }}
      />
    </section>
  );
}
