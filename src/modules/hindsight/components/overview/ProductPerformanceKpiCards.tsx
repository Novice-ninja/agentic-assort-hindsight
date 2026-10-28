import { joinInsightProse } from '../../services/insightProse';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getMetricLabel, useMetricCatalogue } from '@modules/appConfig';
import type { LoadStatus } from '@shared/types';
import { ImpactBadge as Badge } from '@shared/components/vendor/impact-ui';
import { AIStrip } from '@shared/components/primitives';
import { useAIChat } from '@shared/context';
import { useCardInsight } from '../../hooks';
import { buildInsightDisplayHtml } from '../../services/buildInsightDisplayHtml';
import { buildKpiSummarizePayload } from '../../services/buildKpiSummarizePayload';
import { formatKpiValue } from '../../services/formatKpiValue';
import { formatKpiDelta } from '../../services/kpiFormat';
import type { KpiTrend, KpiTrendSentiment, ProductPerformanceKpi } from '../../types';
import kpiCardGridBg from '@assets/icons/hindsight/kpi-card-grid-bg.svg';
import kpiCardEllipseBg from '@assets/icons/hindsight/kpi-card-ellipse-bg.svg';
import styles from './ProductPerformanceKpiCards.module.css';
import { SummaryPlanningMetrics } from './SummaryPlanningMetrics';

const SKELETON_COUNT = 6;
const INSIGHT_SCOPE = 'productPerformance';

export interface ProductPerformanceKpiCardsProps {
  kpis: readonly ProductPerformanceKpi[];
  status?: LoadStatus;
  onRetry?: () => void;
  planCode?: string;
  seasonCode?: number | null;
}

const SENTIMENT_TO_BADGE: Record<KpiTrendSentiment, 'error' | 'warning' | 'success'> = {
  negative: 'error',
  neutral: 'warning',
  positive: 'success',
};

function TrendingUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M14 4.5L9.10714 9.39286L6.39286 6.67857L2 11.0714"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 4.5H14V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendingDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M14 11.5L9.10714 6.60714L6.39286 9.32143L2 4.92857"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 11.5H14V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function trendIcon(direction: KpiTrend['direction']) {
  if (direction === 'up') return <TrendingUpIcon />;
  if (direction === 'down') return <TrendingDownIcon />;
  return undefined;
}

function ScorecardKpiValue({ kpi }: { kpi: ProductPerformanceKpi }) {
  const text = useMemo(
    () =>
      formatKpiValue({
        value: kpi.value,
        format: kpi.format,
        displayValue: kpi.displayValue,
      }),
    [kpi.value, kpi.format, kpi.displayValue],
  );

  return <p className={styles.value}>{text}</p>;
}

/**
 * Headline KPI cards for the Overview tab, driven by the product-performance API.
 *
 * Each card shows one value and every comparison the backend returns (e.g. "vs LY",
 * "vs LLY optimized"). Labels come from the metric catalogue (metrics-config), not the raw
 * payload key. The AI strip under the heading is generated from those same KPIs via
 * `POST /v1/summarize` (`cardType: segment`, `dimension: kpi`).
 */
export function ProductPerformanceKpiCards({
  kpis,
  status = 'succeeded',
  planCode,
  seasonCode,
}: ProductPerformanceKpiCardsProps) {
  const { t, i18n } = useTranslation('hindsight');
  const catalogue = useMetricCatalogue();
  const { askAboutInsight } = useAIChat();
  const heading = t('productPerformance.seasonScorecard');

  const kpisReady = status === 'succeeded' && kpis.length > 0;
  const insightPayload = useMemo(
    () => (kpisReady ? buildKpiSummarizePayload(kpis, catalogue) : null),
    [kpisReady, kpis, catalogue],
  );

  const {
    status: insightStatus,
    bullets: insightBullets,
    request: requestInsight,
  } = useCardInsight({
    planCode,
    seasonCode,
    scope: INSIGHT_SCOPE,
    payload: insightPayload,
  });

  useEffect(() => {
    if (insightPayload !== null) {
      requestInsight();
    }
  }, [insightPayload, requestInsight]);

  const insightText = joinInsightProse(insightBullets.map(bullet => bullet.text));
  const kpisPending = status === 'idle' || status === 'loading';
  const kpisFailed = status === 'failed' || (status === 'succeeded' && kpis.length === 0);
  const insightPending =
    kpisReady && (insightStatus === 'idle' || insightStatus === 'loading');
  const insightUnavailable =
    kpisFailed ||
    insightStatus === 'failed' ||
    (insightStatus === 'succeeded' && insightBullets.length === 0);
  const stripLoading = !insightUnavailable && (kpisPending || insightPending);
  const showAskButton =
    !stripLoading &&
    !insightUnavailable &&
    insightStatus === 'succeeded' &&
    insightBullets.length > 0;

  function renderBody() {
    if (status === 'loading') {
      return (
        <div className={styles.skeletonTrack} role="status" aria-label={t('states.loading')}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div key={`skel-${i}`} className={styles.skeletonCard}>
              <div className={[styles.skeletonLabel, styles.skeletonBone].join(' ')} />
              <div className={styles.skeletonValueRow}>
                <div className={[styles.skeletonValue, styles.skeletonBone].join(' ')} />
                <div className={[styles.skeletonBadge, styles.skeletonBone].join(' ')} />
              </div>
            </div>
          ))}
          <span className={styles.visuallyHidden}>{t('states.loading')}</span>
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className={styles.state}>
          <p className={styles.stateText}>{t('states.empty')}</p>
        </div>
      );
    }

    if (kpis.length === 0) {
      return (
        <div className={styles.state}>
          <p className={styles.stateText}>{t('states.empty')}</p>
        </div>
      );
    }

    return kpis.map((kpi) => (
      <li key={kpi.key} className={styles.card} data-testid={`hindsight-kpi-${kpi.key}`}>
        <div className={styles.decoration} aria-hidden="true">
          <img className={styles.gridBg} src={kpiCardGridBg} alt="" />
          <img className={styles.ellipseBg} src={kpiCardEllipseBg} alt="" />
        </div>
        <div className={styles.content}>
          <p className={styles.label}>{getMetricLabel(catalogue, kpi.key)}</p>
          <div className={styles.valueRow}>
            <ScorecardKpiValue kpi={kpi} />
            {kpi.trend.length > 0 && (
              <div className={styles.badges}>
                {kpi.trend.map((trend) => {
                  const delta = formatKpiDelta(trend, i18n.language);
                  return (
                    <Badge
                      key={trend.comparisonLabel}
                      label={`${delta} ${trend.comparisonLabel}`}
                      color={SENTIMENT_TO_BADGE[trend.sentiment]}
                      variant="subtle"
                      size="small"
                      isIcon
                      icon={trendIcon(trend.direction)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </li>
    ));
  }

  return (
    <section className={styles.wrapper} data-testid="product-performance-cards">
      <div className={styles.header}>
        <h3 className={styles.heading}>{heading}</h3>
        <AIStrip
          iconOnly
          className={styles.aiStrip}
          text={
            insightUnavailable
              ? t('aiStrip.noInsight', 'No insight available')
              : insightText
          }
          loading={stripLoading}
          showAskButton={showAskButton}
          onAskClick={() =>
            askAboutInsight({
              plainText: insightText,
              displayHtml: buildInsightDisplayHtml(heading, insightText),
              source: 'hindsight',
              widgetId: INSIGHT_SCOPE,
              planCode,
            })
          }
        />
      </div>
      <ul
        className={styles.surface}
        aria-label={t('productPerformance.title')}
      >
        {renderBody()}
      </ul>
      {kpisReady && <SummaryPlanningMetrics />}
    </section>
  );
}
