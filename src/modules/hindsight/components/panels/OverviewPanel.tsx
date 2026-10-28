import { useTranslation } from 'react-i18next';
import {
  scopeToConfiguredDimensions,
  scopeToConfiguredKpis,
  useComponentConfig,
} from '@modules/appConfig';
import { CategoryByClusterWidget } from '../overview/CategoryByClusterWidget';
import { ContributionCarousel } from '../overview/ContributionCarousel';
import { ContributionWidget } from '../overview/ContributionWidget';
import { HierarchyParetoWidget } from '../overview/HierarchyParetoWidget';
import { OverviewOpportunityList } from '../overview/OverviewOpportunityList';
import { OverviewStyleColorCards } from '../overview/OverviewStyleColorCards';
import { ProductPerformanceKpiCards } from '../overview/ProductPerformanceKpiCards';
import { RegularPromoTrendWidget } from '../overview/RegularPromoTrendWidget';
import { SeasonSummaryWidget } from '../overview/SeasonSummaryWidget';
import { StoreHexMapWidget } from '../overview/StoreHexMapWidget';
import type { HindsightOverviewResponse } from '../../api';
import type {
  ContributionData,
  ProductPerformanceKpi,
  UserPreferences,
} from '../../types';
import type { LoadStatus } from '@shared/types';
import styles from './panels.module.css';

export interface OverviewPanelProps {
  overview: HindsightOverviewResponse | null;
  status: LoadStatus;
  preferences: UserPreferences;
  onRetry: () => void;
  /** Headline KPI cards, sourced from the product-performance API. */
  productPerformanceKpis: ProductPerformanceKpi[];
  productPerformanceStatus: LoadStatus;
  onRetryKpis: () => void;
  /**
   * Contribution breakdowns from the contribution API, already adapted. A scoped empty response
   * stays empty rather than falling back to a broader overview population.
   */
  contributions?: ContributionData[];
  /** Per-card headings, keyed by `instanceId`, as the backend names them. */
  contributionTitles?: Record<string, string>;
  contributionStatus?: LoadStatus;
  onRetryContributions?: () => void;
  planCode?: string;
  seasonCode?: number | null;
}

/**
 * The Overview tab.
 *
 * Widget order and column spans are set here rather than being configurable: planners may
 * swap the metric a chart shows, but the page composition is fixed so two planners looking at
 * the same season are looking at the same layout.
 */
export function OverviewPanel({
  overview,
  status,
  preferences: _preferences,
  onRetry,
  productPerformanceKpis,
  productPerformanceStatus,
  onRetryKpis,
  contributions: apiContributions = [],
  contributionTitles = {},
  contributionStatus,
  onRetryContributions,
  planCode,
  seasonCode,
}: OverviewPanelProps) {
  const { t } = useTranslation('hindsight');
  // Which KPI cards and which contribution dimensions this tenant shows is config, not layout, so
  // both widgets are fed a narrowed list rather than deciding for themselves.
  const kpiCardConfig = useComponentConfig('hindsight', 'overview', 'productPerformance');
  const contributionConfig = useComponentConfig('hindsight', 'overview', 'contribution');
  const widgetStatus = status === 'failed' ? 'succeeded' : status;
  const visibleKpis = scopeToConfiguredKpis(productPerformanceKpis, kpiCardConfig);
  const kpiStatus =
    productPerformanceStatus === 'failed' && visibleKpis.length > 0
      ? 'succeeded'
      : productPerformanceStatus;

  // Once a plan and season select the scoped API, that source remains authoritative even when
  // it returns no rows or an error. Legacy overview rows can belong to a broader population.
  const contributionWillFetch =
    planCode !== undefined && seasonCode !== null && seasonCode !== undefined;
  const liveContributions =
    contributionWillFetch ||
    apiContributions.length > 0 ||
    contributionStatus === 'loading';
  const configuredCount = contributionConfig?.dimensionList?.length ?? 0;
  const loadingPlaceholders: Array<ContributionData | undefined> = Array.from(
    { length: configuredCount > 0 ? configuredCount : 3 },
    () => undefined,
  );
  const allContributionCards: Array<ContributionData | undefined> = liveContributions
    ? apiContributions.length > 0
      ? apiContributions
      : loadingPlaceholders
    : overview?.contributions.length
      ? overview.contributions
      : loadingPlaceholders;
  const contributionCards =
    allContributionCards.every((card) => card === undefined)
      ? allContributionCards
      : scopeToConfiguredDimensions(
          allContributionCards.filter((card): card is ContributionData => card !== undefined),
          contributionConfig,
        );

  return (
    <div className={styles.grid} data-testid="hindsight-overview-panel">
      <div className={styles.full}>
        <ProductPerformanceKpiCards
          kpis={visibleKpis}
          status={kpiStatus}
          onRetry={onRetryKpis}
          planCode={planCode}
          seasonCode={seasonCode}
        />
      </div>

      <div className={styles.compositeRow}>
        <div className={styles.compositeLeft}>
          <SeasonSummaryWidget
            planCode={planCode}
            seasonCode={seasonCode}
            enabled
          />
        </div>
        <div className={styles.compositeRight}>
          <ContributionCarousel cardCount={contributionCards.length}>
            {contributionCards.map((contribution, index) => {
              const effectiveContributionStatus =
                liveContributions
                  ? contributionStatus === 'idle' ? 'loading' : contributionStatus
                  : status;
              return (
                <ContributionWidget
                  key={`${contribution?.instanceId ?? 'contribution-empty'}-${index}`}
                  data={contribution}
                  widgetId={index === 0 ? 'contribution' : 'colour-contribution'}
                  title={contribution === undefined ? undefined : contributionTitles[contribution.instanceId]}
                  preGrouped={liveContributions}
                  status={effectiveContributionStatus}
                  onRetry={liveContributions ? onRetryContributions : onRetry}
                  planCode={planCode}
                  seasonCode={seasonCode}
                  live={liveContributions}
                />
              );
            })}
          </ContributionCarousel>
          <RegularPromoTrendWidget
            onRetry={onRetry}
            planCode={planCode}
            seasonCode={seasonCode}
          />
        </div>
      </div>

      <div
        className={styles.half}
        aria-label={t('carryForward.missedOpportunities')}
      >
        <OverviewOpportunityList view="missedOpportunities" planCode={planCode} />
      </div>

      <div
        className={styles.half}
        aria-label={t('carryForward.carryForward')}
      >
        <OverviewOpportunityList view="carryForward" planCode={planCode} />
      </div>

      <div className={[styles.half, styles.stretchHalf].join(' ')}>
        <HierarchyParetoWidget
          onRetry={onRetry}
          planCode={planCode}
          seasonCode={seasonCode}
        />
      </div>

      <div className={[styles.half, styles.stretchHalf].join(' ')}>
        <OverviewStyleColorCards planCode={planCode} />
      </div>

      <div className={styles.storePerformanceCard} data-testid="hindsight-store-performance">
        <h2 className={styles.storePerformanceTitle}>Store Performance</h2>
        <div className={styles.clusteringChartsGrid}>
          <StoreHexMapWidget planCode={planCode} seasonCode={seasonCode} />
          <CategoryByClusterWidget
            data={overview?.categoryByCluster}
            status={widgetStatus}
            onRetry={onRetry}
            planCode={planCode}
            seasonCode={seasonCode}
          />
        </div>
      </div>
    </div>
  );
}
