import { useTranslation } from 'react-i18next';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AIStrip } from '@shared/components/primitives';
import {
  Button,
  ImpactBadge,
  ImpactTooltip as Tooltip,
} from '@shared/components/vendor/impact-ui';
import attributeInfoIcon from '@assets/icons/clustering/attribute-variation-info.svg';
import type { LoadStatus } from '@shared/types';
import { decodeIaString } from '@shared/utils/format';
import selectedCheckIcon from '@assets/icons/clustering/selected-check.svg';
import sections from '@shared/styles/wizardSections.module.css';
import type { ClusterResultCandidate } from '../types';
import { candidateVariantCode } from '../services/candidateVariantCode';
import {
  insightForCandidate,
  type ClusterVariantSummary,
} from '../services/clusterVariantSummary';
import { variantCardTitle } from '../services/reviewVariantDisplay';
import { CandidateCardsSkeleton } from './ResumeSkeletons';
import { AgentSectionStatus } from './AgentSectionStatus';
import agentFlow from './agentFlow.module.css';
import styles from './wizard.module.css';

/** Rendered when a metric is not part of the run API contract. */
const NOT_AVAILABLE = '—';

function ScoreRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div className={styles.candidateMetricRow}>
      <div className={styles.compareScoreRow}>
        <span className={styles.compareScoreLabel}>{label}</span>
        <span className={styles.progressTrack} aria-hidden="true">
          <span
            className={styles.progressFill}
            style={{ width: `${value === null ? 0 : Math.round(value * 100)}%` }}
          />
        </span>
        <span className={styles.compareScoreValue}>
          {value === null ? NOT_AVAILABLE : value.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export interface CandidateCompareProps {
  candidates: ClusterResultCandidate[];
  onSelect: (id: string) => void;
  onCompareAssignments: () => void;
  loading?: boolean;
  loadFailed?: boolean;
  onRetry?: () => void;
  /** "View Store Assignment" on one card — opens the assignments panel on that candidate. */
  onViewAssignments: (id: string) => void;
  /**
   * AI narration from `POST /v1/summarize`: one sentence for the section and one per variant.
   * `idle` renders no strips; `loading` renders the gathering state; `failed` renders the
   * unavailable copy with a retry.
   */
  summary?: ClusterVariantSummary | null;
  summaryStatus?: LoadStatus;
  onRetrySummary?: () => void;
  /** Describe Your Plan mirror: the agent picks the winner; "Select This Group" is disabled. */
  readOnly?: boolean;
  /** Agent is currently filling this section (cyan stroke). */
  highlighted?: boolean;
}

export function CandidateCompare({
  candidates,
  onSelect,
  onCompareAssignments,
  loading,
  loadFailed,
  onRetry,
  onViewAssignments,
  summary = null,
  summaryStatus = 'idle',
  onRetrySummary,
  readOnly = false,
  highlighted = false,
}: CandidateCompareProps) {
  const { t } = useTranslation(['clustering', 'common']);
  const summaryLoading = summaryStatus === 'loading';
  const summaryFailed = summaryStatus === 'failed';
  const overallInsight =
    summaryStatus === 'succeeded' ? (summary?.overall ?? null) : null;

  const metricLabels = [
    t('finalize.separation'),
    t('finalize.stability'),
    t('finalize.storesPerCluster'),
  ];

  // The label pills and the dashed inter-card lines sit beside the metric rows. Cards start
  // at the same grid-row top as the label column, so the spacer above the first pill must be
  // exactly the distance from the card top to its metrics block — which varies with what the
  // header contains (badge, AI strip). Measure it instead of hardcoding a height.
  const firstMetricsRef = useRef<HTMLDivElement | null>(null);
  const [headerOffset, setHeaderOffset] = useState<number | null>(null);

  useLayoutEffect(() => {
    const metrics = firstMetricsRef.current;
    if (!metrics) return undefined;
    const measure = () => {
      const card = metrics.parentElement;
      if (!card) return;
      const offset =
        metrics.getBoundingClientRect().top - card.getBoundingClientRect().top;
      if (offset > 0) setHeaderOffset(Math.round(offset));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(metrics.parentElement ?? metrics);
    return () => observer.disconnect();
  }, [candidates]);

  const layoutStyle = {
    ['--candidate-count']: candidates.length,
    ...(headerOffset !== null
      ? { ['--compare-header-offset']: `${headerOffset}px` }
      : {}),
  } as CSSProperties;

  return (
    <section
      className={[styles.compareSection, highlighted ? agentFlow.sectionGlow : '']
        .filter(Boolean)
        .join(' ')}
      data-testid="candidate-compare-section"
      data-highlighted={highlighted ? 'true' : undefined}
    >
      {highlighted ? <AgentSectionStatus section="candidates" /> : null}
      <div className={styles.compareToolbar}>
        <div className={styles.compareHeading}>
          <h3 className={styles.compareTitle}>
            {t('finalize.bestTitle', { count: candidates.length })}
          </h3>
          <p className={styles.compareSubtitle}>{t('finalize.bestSubtitle')}</p>
        </div>
        <div className={styles.compareActions}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCompareAssignments}
            disabled={loading || loadFailed}
          >
            {t('finalize.compareAssignments')}
          </Button>
        </div>
      </div>
      {summaryLoading ? (
        <AIStrip className={styles.reviewAiStrip} text="" loading />
      ) : null}
      {overallInsight !== null ? (
        <AIStrip
          className={styles.reviewAiStrip}
          text={overallInsight}
          showAskButton={false}
        />
      ) : null}
      {summaryFailed ? (
        <div className={styles.insightFallbackRow} role="status">
          <AIStrip
            className={styles.reviewAiStrip}
            text={t('finalize.insightUnavailable')}
            showTooltip={false}
          />
          {onRetrySummary ? (
            <button
              type="button"
              className={styles.viewAssignment}
              onClick={onRetrySummary}
            >
              {t('finalize.insightRetry')}
            </button>
          ) : null}
        </div>
      ) : null}
      {loadFailed && !loading ? (
        <div role="alert">
          <p className={sections.empty}>{t('errors.runFailed')}</p>
          {onRetry ? (
            <Button variant="secondary" onClick={onRetry}>
              {t('common:actions.retry', 'Retry')}
            </Button>
          ) : null}
        </div>
      ) : null}
      {!loading && !loadFailed && candidates.length === 0 ? (
        <p className={sections.empty} role="status">
          {t('common:states.empty')}
        </p>
      ) : null}
      {loading || (!loadFailed && candidates.length > 0) ? (
        <div className={styles.compareCardsScroll}>
          {loading ? <CandidateCardsSkeleton /> : null}
          {!loading && !loadFailed ? (
            <div className={styles.compareLayout} style={layoutStyle}>
              <div className={styles.compareLabelColumn}>
                <div className={styles.compareLabelHeaderSpacer} aria-hidden="true" />
                {metricLabels.map((label) => {
                  const separation = label === t('finalize.separation');
                  return (
                    <div key={label} className={styles.compareLabelSlot}>
                      <span
                        className={[
                          styles.compareLabelPill,
                          separation ? styles.compareLabelPillWithInfo : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span aria-hidden="true">{label}</span>
                        {separation ? (
                          <Tooltip
                            title={t('finalize.separationInfo')}
                            variant="tertiary"
                          >
                            <button
                              type="button"
                              className={styles.reviewTitleInfo}
                              aria-label={t('finalize.separationInfo')}
                            >
                              <img
                                src={attributeInfoIcon}
                                alt=""
                                width={16}
                                height={16}
                              />
                            </button>
                          </Tooltip>
                        ) : null}
                      </span>
                      <span className={styles.compareLabelConnector} aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
              {candidates.map((candidate, index) => {
                const cardInsight =
                  summaryStatus === 'succeeded'
                    ? insightForCandidate(summary, {
                        variantId: candidate.variantId,
                        name: decodeIaString(candidate.name),
                      })
                    : null;
                return (
                  <article
                    key={candidate.id}
                    className={[
                      styles.candidateCard,
                      candidate.selected ? styles.candidateCardSelected : undefined,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {index > 0 ? (
                      <div
                        className={styles.compareInterCardConnectors}
                        aria-hidden="true"
                      >
                        <div className={styles.compareLabelHeaderSpacer} />
                        {metricLabels.map((label) => (
                          <div key={label} className={styles.compareLabelSlot}>
                            <span className={styles.compareInterCardLine} />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {candidate.selected ? (
                      <span className={styles.selectedBadge}>
                        <img src={selectedCheckIcon} alt="" aria-hidden="true" />
                        {t('finalize.selected')}
                      </span>
                    ) : null}
                    <div className={styles.candidateHeader}>
                      <div className={styles.candidateHeaderMain}>
                        <div className={styles.candidateTitleRow}>
                          <span
                            className={[
                              styles.candidateIndex,
                              candidate.selected
                                ? styles.candidateIndexSelected
                                : undefined,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            aria-hidden="true"
                          >
                            {index + 1}
                          </span>
                          <span className={styles.candidateName}>
                            {variantCardTitle(decodeIaString(candidate.name), {
                              fallback: t('review.customVariant'),
                              variantId: candidate.variantId,
                            })}
                          </span>
                          {candidate.recommended ? (
                            <ImpactBadge
                              label={t('finalize.recommended')}
                              variant="subtle"
                              color="info"
                              size="small"
                            />
                          ) : null}
                        </div>
                        <p className={styles.candidateKLine}>
                          {t('finalize.kLine', {
                            k: candidate.k,
                            code: candidateVariantCode(candidate),
                          })}
                        </p>
                      </div>
                    </div>
                    {summaryLoading ? (
                      <AIStrip className={styles.reviewAiStrip} text="" loading />
                    ) : null}
                    {cardInsight !== null ? (
                      <AIStrip
                        className={styles.reviewAiStrip}
                        text={cardInsight}
                        showAskButton={false}
                      />
                    ) : null}
                    <div
                      className={styles.candidateMetrics}
                      ref={index === 0 ? firstMetricsRef : undefined}
                    >
                      <ScoreRow
                        label={t('finalize.separation')}
                        value={candidate.separation}
                      />
                      <ScoreRow
                        label={t('finalize.stability')}
                        value={candidate.stability}
                      />
                      <div
                        className={[
                          styles.candidateMetricRow,
                          styles.candidateMetricRowLast,
                        ].join(' ')}
                      >
                        <p
                          className={styles.candidateMeta}
                          data-testid="stores-per-cluster"
                          title={candidate.storesPerCluster.join(' / ')}
                        >
                          {candidate.storesPerCluster.join(' / ')}
                        </p>
                      </div>
                    </div>
                    <div className={styles.candidateFooter}>
                      <button
                        type="button"
                        className={styles.viewAssignment}
                        onClick={() => onViewAssignments(candidate.id)}
                      >
                        {t('finalize.viewStoreAssignment')}
                      </button>
                      {!candidate.selected && (
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => onSelect(candidate.id)}
                          disabled={readOnly}
                        >
                          {t('finalize.selectGroup')}
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
