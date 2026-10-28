import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import attentionRedBg from '@assets/icons/hindsight/opportunity/attention-red-bg.svg';
import attentionRedBody from '@assets/icons/hindsight/opportunity/attention-red-body.svg';
import attentionRedDetail from '@assets/icons/hindsight/opportunity/attention-red-detail.svg';
import attentionGoldBg from '@assets/icons/hindsight/opportunity/attention-gold-bg.svg';
import attentionGoldBody from '@assets/icons/hindsight/opportunity/attention-gold-body.svg';
import attentionGoldDetail from '@assets/icons/hindsight/opportunity/attention-gold-detail.svg';
import checkboxGreenBg from '@assets/icons/hindsight/opportunity/checkbox-green-bg.svg';
import checkboxGreenBody from '@assets/icons/hindsight/opportunity/checkbox-green-body.svg';
import checkboxGreenDetail from '@assets/icons/hindsight/opportunity/checkbox-green-detail.svg';
import { AIStrip } from '@shared/components/primitives';
import { useAIChat } from '@shared/context';
import { useOverviewRecommendations } from '../../hooks/useOverviewRecommendations';
import {
  resolveRecommendationStatusStyle,
  type RecommendationIcon,
  type RecommendationTone,
} from '../../services/recommendationStatus';
import { buildInsightDisplayHtml } from '../../services/buildInsightDisplayHtml';
import type {
  CarryForwardView,
  RecommendationItem,
  RecommendationType,
} from '../../types';
import styles from './OverviewOpportunityList.module.css';

/** How the label reads for each panel: paired metrics around a dot, or a single phrase. */
type LabelLayout = 'metrics' | 'text';

interface ViewConfig {
  recommendationType: RecommendationType;
  labelLayout: LabelLayout;
}

const VIEW_CONFIG: Record<CarryForwardView, ViewConfig> = {
  missedOpportunities: { recommendationType: 'missedOpportunities', labelLayout: 'metrics' },
  carryForward: { recommendationType: 'carryForwards', labelLayout: 'text' },
};

const SKELETON_COUNT = 3;

// Failed requests must never substitute unrelated apparel examples into a flooring review.
const FALLBACK_ITEMS: Record<CarryForwardView, RecommendationItem[]> = {
  missedOpportunities: [],
  carryForward: [],
};

const ICON_ASSETS: Record<
  RecommendationIcon,
  { bg: string; body: string; detail: string; className: string; bgClass: string; bodyClass: string; detailClass: string }
> = {
  attentionRed: {
    bg: attentionRedBg,
    body: attentionRedBody,
    detail: attentionRedDetail,
    className: styles.iconAttentionRed,
    bgClass: styles.iconLayerBg,
    bodyClass: styles.iconLayerBody,
    detailClass: styles.iconLayerDetail,
  },
  attentionGold: {
    bg: attentionGoldBg,
    body: attentionGoldBody,
    detail: attentionGoldDetail,
    className: styles.iconAttentionGold,
    bgClass: styles.iconLayerBg,
    bodyClass: styles.iconLayerBody,
    detailClass: styles.iconLayerDetail,
  },
  checkbox: {
    bg: checkboxGreenBg,
    body: checkboxGreenBody,
    detail: checkboxGreenDetail,
    className: styles.iconCheckbox,
    bgClass: styles.iconLayerBgCheckbox,
    bodyClass: styles.iconLayerBodyCheckbox,
    detailClass: styles.iconLayerDetailCheckbox,
  },
};

const BADGE_CLASS: Record<RecommendationTone, string> = {
  error: styles.badgeError,
  warning: styles.badgeWarning,
  success: styles.badgeSuccess,
};

/**
 * Splits a metric label around its separator so the dot can be drawn rather than typed — the
 * design's dot is a 4px `currentColor` circle, not a bullet character.
 */
export function splitMetricLabel(label: string): { left: string; right: string } | null {
  const match = /^(.*?)\s*[•·]\s*(.*)$/.exec(label.trim());
  if (match === null) return null;
  const [, left, right] = match;
  if (left.length === 0 || right.length === 0) return null;
  return { left, right };
}

interface OpportunityRowProps {
  item: RecommendationItem;
  recommendationType: RecommendationType;
  labelLayout: LabelLayout;
  view: CarryForwardView;
  planCode?: string;
  showBadge: boolean;
  showInsight: boolean;
  rowTitle?: string;
  largeIcon: boolean;
}

const OpportunityRow = memo(function OpportunityRow({
  item,
  recommendationType,
  labelLayout,
  view,
  planCode,
  showBadge,
  showInsight,
  rowTitle,
  largeIcon,
}: OpportunityRowProps) {
  const { askAboutInsight } = useAIChat();
  const { tone, icon } = resolveRecommendationStatusStyle(
    item.status,
    recommendationType,
    item.label,
  );
  const iconAsset = ICON_ASSETS[icon];
  const metrics = labelLayout === 'metrics' ? splitMetricLabel(item.label) : null;
  const summary = item.summary.trim();
  const hasSummary = summary.length > 0;
  const nameGroupClass = largeIcon
    ? [styles.nameGroup, styles.nameGroupLarge].join(' ')
    : styles.nameGroup;
  const iconNode = (
    <div className={iconAsset.className} aria-hidden="true">
      <div className={iconAsset.bgClass}>
        <img alt="" className={styles.iconLayer} src={iconAsset.bg} />
      </div>
      <div className={iconAsset.bodyClass}>
        <img alt="" className={styles.iconLayer} src={iconAsset.body} />
      </div>
      <div className={iconAsset.detailClass}>
        <img alt="" className={styles.iconLayer} src={iconAsset.detail} />
      </div>
    </div>
  );

  return (
    <li className={styles.rowCard} data-testid={`hindsight-opportunity-${item.article}`}>
      <div className={styles.rowHeader}>
        <div className={nameGroupClass}>
          {largeIcon ? <div className={styles.iconScale}>{iconNode}</div> : iconNode}
          {rowTitle === undefined ? (
            <div className={styles.nameStack}>
              <span className={styles.nameText} title={item.name}>{item.name || item.article}</span>
              <span className={styles.subText}>Style ID {item.styleId || item.productId} · {item.article}</span>
            </div>
          ) : (
            <div className={styles.nameStack}>
              <span className={styles.nameText}>{rowTitle}</span>
              <span className={styles.subText}>{item.article}</span>
            </div>
          )}
        </div>
        {showBadge && (
          <span className={BADGE_CLASS[tone]}>
            {metrics !== null ? (
              <>
                <span className={styles.badgeValue}>{metrics.left}</span>
                <span className={styles.badgeDot} aria-hidden="true" />
                <span className={styles.badgeValue}>{metrics.right}</span>
              </>
            ) : (
              item.label
            )}
          </span>
        )}
      </div>
      {showInsight && (
        <AIStrip
          iconOnly
          text={summary}
          showTooltip
          showAskButton={hasSummary}
          onAskClick={
            hasSummary
              ? () =>
                  askAboutInsight({
                    plainText: summary,
                    displayHtml: buildInsightDisplayHtml(item.article, summary),
                    source: 'hindsight',
                    widgetId: view,
                    planCode,
                  })
              : undefined
          }
        />
      )}
    </li>
  );
});

function SkeletonRow({ showBadge, showInsight }: { showBadge: boolean; showInsight: boolean }) {
  return (
    <li className={styles.rowCard} aria-hidden="true">
      <div className={styles.rowHeader}>
        <div className={styles.nameGroup}>
          <span className={[styles.skeletonBone, styles.skeletonIcon].join(' ')} />
          <span className={[styles.skeletonBone, styles.skeletonName].join(' ')} />
        </div>
        {showBadge && <span className={[styles.skeletonBone, styles.skeletonBadge].join(' ')} />}
      </div>
      {showInsight && <span className={[styles.skeletonBone, styles.skeletonStrip].join(' ')} />}
    </li>
  );
}

export interface OverviewOpportunityListProps {
  view: CarryForwardView;
  /** Replaces the heading, e.g. for a second card that reuses a view's data. */
  title?: string;
  /** Status badge at the end of each row. */
  showBadge?: boolean;
  /** AI insight strip under each row. */
  showInsight?: boolean;
  /** Heading for every row; the item's own name moves to a subtext line beneath it. */
  rowTitle?: string;
  /** Status icon at 40x40 instead of 24x24 (the artwork is placeholder, so it is scaled up). */
  largeIcon?: boolean;
  /** Show at most this many rows (no further pages are requested beyond it). */
  maxRows?: number;
  planCode?: string;
  /** Only fetch while true — e.g. gate on the Overview tab being active. */
  enabled?: boolean;
}

/**
 * Overview → Missed Opportunities / Carry-Forward & Flags.
 *
 * One component for both panels: they share the endpoint and the card, and differ only by
 * `recommendationType` and whether the label reads as paired metrics or a single phrase. Pages
 * arrive by opaque keyset cursor and append as the planner scrolls the list, in server order.
 */
export function OverviewOpportunityList({
  view,
  title: titleOverride,
  showBadge = true,
  showInsight = true,
  rowTitle,
  largeIcon = false,
  maxRows,
  planCode,
  enabled = true,
}: OverviewOpportunityListProps) {
  const { t } = useTranslation('hindsight');
  const { recommendationType, labelLayout } = VIEW_CONFIG[view];
  const title = titleOverride ?? t(`carryForward.${view}`);

  const { items, status, pageStatus, hasMore, loadMore } = useOverviewRecommendations({
    planCode,
    recommendationType,
    enabled,
  });

  const scrollRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);

  const noPlan = planCode === undefined || planCode.trim().length === 0;
  // Without a plan there is nothing to ask for, and a failure should still leave a readable
  // panel, so both fall back to the pre-API rows. The panel carries no error message or retry
  // control, so the fallback is the whole of its failure handling.
  const usingFallback = noPlan || status === 'failed';
  // The pre-API list can be shorter than `maxRows`; top it up from the other view's rows so a
  // capped card still reads as full while the backend is unreachable.
  const fallbackRows =
    maxRows !== undefined && FALLBACK_ITEMS[view].length < maxRows
      ? [...FALLBACK_ITEMS[view], ...FALLBACK_ITEMS.carryForward]
      : FALLBACK_ITEMS[view];
  const allRows = usingFallback ? fallbackRows : items;
  const rows = maxRows === undefined ? allRows : allRows.slice(0, maxRows);
  const paging = !usingFallback && hasMore && (maxRows === undefined || items.length < maxRows);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (root === null || sentinel === null) return;
    // A failed page also stops the observer: with no retry control, re-attaching it over a
    // still-visible sentinel would re-request in a tight loop.
    if (!paging || status !== 'succeeded' || pageStatus !== 'idle') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      { root, rootMargin: '48px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, pageStatus, paging, status, rows.length]);

  function renderBody() {
    if (!usingFallback && (status === 'idle' || status === 'loading')) {
      return (
        <ul className={styles.body} role="status" aria-label={t('states.loading')}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <SkeletonRow key={`skel-${index}`} showBadge={showBadge} showInsight={showInsight} />
          ))}
        </ul>
      );
    }

    if (rows.length === 0) {
      return (
        <div className={styles.empty} role="status">
          {t('states.empty')}
        </div>
      );
    }

    return (
      <ul ref={scrollRef} className={styles.body} aria-label={title}>
        {rows.map((item) => (
          <OpportunityRow
            key={item.id}
            item={item}
            recommendationType={recommendationType}
            labelLayout={labelLayout}
            view={view}
            planCode={planCode}
            showBadge={showBadge}
            showInsight={showInsight}
            rowTitle={rowTitle}
            largeIcon={largeIcon}
          />
        ))}
        {pageStatus === 'loading' && (
          <SkeletonRow showBadge={showBadge} showInsight={showInsight} />
        )}
        {paging && <li ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />}
      </ul>
    );
  }

  return (
    <div className={styles.card} data-testid="overview-opportunities">
      <h3 className={styles.title}>{title}</h3>
      {renderBody()}
    </div>
  );
}
