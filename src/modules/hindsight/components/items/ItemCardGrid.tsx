import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoadStatus } from '@shared/types';
import { isNearScrollEnd, readScrollMetrics } from '../../services/scrollThreshold';
import {
  indexTableRowsForCards,
  tableRowForCard,
  toByItemTableRow,
} from '../../services/byItemTableRows';
import { formatKpiValue } from '../../services/formatKpiValue';
import { visualKpisForBack, visualKpisForFront } from '../../services/itemCardRows';
import type {
  ByItemSelectCell,
  ByItemTableRow,
  ByItemVisualPageStatus,
  VisualViewItem,
  VisualViewKpi,
  VisualViewRecommendation,
} from '../../types';
import { ItemCard } from './ItemCard';
import type { ItemCardView } from './itemCardView';
import styles from './ItemCardGrid.module.css';

const SKELETON_CARD_COUNT = 12;
const PAGE_SKELETON_COUNT = 8;

export interface ItemCardGridProps {
  /** Items from the visual-view API, which are the only thing this view renders. */
  visualItems: VisualViewItem[];
  /**
   * By Item table rows. Used as a back-face fallback when `kpisBack` is absent, and for
   * narration when the visual item omitted it.
   */
  tableRows?: readonly ByItemTableRow[];
  /** False renders every recommendation read-only, whatever an item says. */
  overridesEnabled: boolean;
  status?: LoadStatus;
  /** Status of a subsequent page while earlier cards stay visible. */
  pageStatus?: ByItemVisualPageStatus;
  /** True when another visual-view page is available. */
  hasMore?: boolean;
  /** Called when the planner reaches the bottom of the loaded cards. */
  onLoadMore?: () => void;
  /** Articles whose override is still in flight. Only those cards go pending. */
  pendingArticles?: Readonly<Record<string, unknown>>;
  /** Called with the item's **article**, the id the override endpoint keys on. */
  onOverride: (article: string, value: string) => void;
  onRetry?: () => void;
  /** Re-try only the failed next page, leaving already-loaded cards in place. */
  onRetryPage?: () => void;
  /** Articles currently checked for bulk edit. */
  selectedArticles?: ReadonlySet<string>;
  /** Called when a card checkbox is toggled. */
  onSelectedChange?: (article: string, selected: boolean) => void;
}

/**
 * Converts a `workingPlan` select cell (plain string options) into the `VisualViewRecommendation`
 * shape the card's `RecommendationControl` expects. Called only when the legacy `recommendation`
 * wrapper is absent — new backend payloads send `workingPlan` instead.
 *
 * `translate` maps a raw verdict key (`keep`, `drop`) to its display label (`Keep`, `Drop`)
 * using the same i18n keys the table's select renderer does.
 */
function selectCellToRecommendation(
  cell: ByItemSelectCell,
  translate: (key: string) => string,
): VisualViewRecommendation {
  return {
    id: 'workingPlan',
    type: 'dropdown',
    label: 'Recommendation',
    selected: cell.value || null,
    overridden: cell.overridden ?? false,
    mandatory: cell.mandatory ?? false,
    staleBasis: cell.staleBasis ?? null,
    source: cell.source,
    options: cell.options.map((v) => ({ value: v, label: translate(v) })),
  };
}

function formatCardKpi(kpi: VisualViewKpi): VisualViewKpi {
  return {
    ...kpi,
    formattedValue: formatKpiValue({
      value: kpi.value,
      format: kpi.format,
      displayValue: kpi.formattedValue,
    }),
  };
}

function toCardView(item: VisualViewItem): ItemCardView {
  const { product } = item;
  const kpisFront = visualKpisForFront(item).map(formatCardKpi);
  const kpisBack = visualKpisForBack(item).map(formatCardKpi);

  return {
    id: product.id,
    article: product.article?.trim() || product.id,
    title: product.name,
    imageUrl: product.showImage === false ? null : (product.imageUrl ?? null),
    styleId: product.styleId?.trim() || product.id,
    department: product.category ?? null,
    hasAiInsight: product.hasAiInsight ?? true,
    narration: item.aiRecommendation?.narration,
    kpis: item.kpis === undefined ? kpisFront : item.kpis.map(formatCardKpi),
    kpisFront,
    kpisBack,
    recommendationLabel: item.recommendation?.label ?? 'Recommendation',
  };
}

function SkeletonCard() {
  return (
    <li className={styles.skeletonCard} aria-hidden="true">
      <div className={[styles.skeletonImage, styles.skeletonBone].join(' ')} />
      <div className={[styles.skeletonTitle, styles.skeletonBone].join(' ')} />
      <div className={styles.skeletonMetrics}>
        <div className={[styles.skeletonMetric, styles.skeletonBone].join(' ')} />
        <div className={[styles.skeletonMetric, styles.skeletonBone].join(' ')} />
        <div className={[styles.skeletonMetric, styles.skeletonBone].join(' ')} />
      </div>
      <div className={[styles.skeletonFooter, styles.skeletonBone].join(' ')} />
    </li>
  );
}

/**
 * The card view of the item collection, for planners reviewing on imagery rather than numbers.
 *
 * Front and back metrics come from the visual-view payload (`kpisFront` / `kpisBack`). When
 * `kpisBack` is absent, the back face falls back to the matching table row, joined by article.
 *
 * Reaching the bottom of the scroller asks for the next page once. Skeletons sit inline under
 * the last cards until that page arrives, then they are replaced by the new cards.
 */
export function ItemCardGrid({
  visualItems,
  tableRows = [],
  overridesEnabled,
  status,
  pageStatus = 'idle',
  hasMore = false,
  onLoadMore,
  pendingArticles,
  onOverride,
  onRetry,
  onRetryPage,
  selectedArticles,
  onSelectedChange,
}: ItemCardGridProps) {
  const { t } = useTranslation('hindsight');
  const viewportRef = useRef<HTMLDivElement>(null);

  const cards = useMemo<ItemCardView[]>(
    () => visualItems.map(toCardView),
    [visualItems],
  );

  const rowsByCard = useMemo(() => indexTableRowsForCards(tableRows), [tableRows]);

  const visualByKey = useMemo(() => {
    const index = new Map<string, VisualViewItem>();
    for (const item of visualItems) {
      const article = item.product.article?.trim();
      const key = article !== undefined && article.length > 0 ? article : item.product.id;
      index.set(key, item);
    }
    return index;
  }, [visualItems]);

  const translateVerdict = useCallback(
    (key: string) => t(`items.verdict.${key}`, { defaultValue: key.replace(/_/g, ' ') }),
    [t],
  );

  const recommendationsById = useMemo(() => {
    const index = new Map<string, VisualViewRecommendation>();
    for (const item of visualItems) {
      if (item.recommendation != null) {
        index.set(item.product.id, item.recommendation);
      } else if (item.workingPlan != null) {
        index.set(item.product.id, selectCellToRecommendation(item.workingPlan, translateVerdict));
      }
    }
    return index;
  }, [visualItems, translateVerdict]);

  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;
  const pageStatusRef = useRef(pageStatus);
  pageStatusRef.current = pageStatus;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const askedRef = useRef(false);

  useEffect(() => {
    askedRef.current = false;
  }, [cards.length]);

  useEffect(() => {
    if (status !== 'succeeded' || cards.length === 0 || !hasMore) return;
    const root = viewportRef.current;
    if (root === null) return;

    const askIfAtEnd = () => {
      if (askedRef.current) return;
      if (pageStatusRef.current !== 'idle' || !hasMoreRef.current) return;
      if (!isNearScrollEnd(readScrollMetrics(root), 48)) return;
      askedRef.current = true;
      onLoadMoreRef.current?.();
    };

    askIfAtEnd();
    root.addEventListener('scroll', askIfAtEnd, { passive: true });
    return () => {
      root.removeEventListener('scroll', askIfAtEnd);
    };
  }, [cards.length, hasMore, status]);

  const showInitialShimmer =
    cards.length === 0 && status !== 'failed' && status !== 'succeeded';

  if (showInitialShimmer) {
    return (
      <div
        className={styles.gridViewport}
        role="status"
        aria-label={t('states.loading')}
        data-testid="hindsight-item-card-grid"
      >
        <ul className={styles.grid}>
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
            <SkeletonCard key={`skel-${i}`} />
          ))}
        </ul>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className={styles.state} data-testid="hindsight-item-card-grid">
        <p className={styles.stateText}>{t('states.error')}</p>
        {onRetry !== undefined && (
          <button
            type="button"
            className={styles.retry}
            onClick={onRetry}
            data-testid="hindsight-item-card-retry"
          >
            {t('states.retry')}
          </button>
        )}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={styles.state} data-testid="hindsight-item-card-grid">
        <p className={styles.stateText}>{t('states.empty')}</p>
      </div>
    );
  }

  const loadingMore = pageStatus === 'loading';

  return (
    <div
      ref={viewportRef}
      className={styles.gridViewport}
      data-testid="hindsight-item-card-grid"
    >
      <ul className={styles.grid}>
        {cards.map((card) => {
          const recommendation = recommendationsById.get(card.id);
          const cachedRow = tableRowForCard(rowsByCard, card.article, card.styleId);
          const visual = visualByKey.get(card.article ?? card.id);
          const row = cachedRow ?? (visual !== undefined ? toByItemTableRow(visual) : undefined);

          return (
            <ItemCard
              key={card.id}
              view={card}
              row={row}
              recommendation={recommendation}
              editable={overridesEnabled}
              pending={
                card.article !== undefined && pendingArticles?.[card.article] !== undefined
              }
              onRecommendationChange={onOverride}
              selected={
                selectedArticles !== undefined &&
                typeof card.article === 'string' &&
                card.article.length > 0 &&
                selectedArticles.has(card.article)
              }
              onSelectedChange={onSelectedChange}
            />
          );
        })}
        {loadingMore &&
          Array.from({ length: PAGE_SKELETON_COUNT }, (_, i) => (
            <SkeletonCard key={`page-skel-${i}`} />
          ))}
      </ul>
      {pageStatus === 'failed' && (
        <div className={styles.pageError} role="alert">
          <p className={styles.stateText}>{t('states.error')}</p>
          {onRetryPage !== undefined && (
            <button
              type="button"
              className={styles.retry}
              onClick={onRetryPage}
              data-testid="hindsight-item-card-retry-page"
            >
              {t('states.retry')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
