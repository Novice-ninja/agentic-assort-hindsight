import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AIStrip } from '@shared/components/primitives/AIStrip/AIStrip';
import { ImpactTooltip as Tooltip } from '@shared/components/vendor/impact-ui';
import { useAIChat } from '@shared/context';
import { ItemThumbnail } from '../cells/ItemThumbnail';
import { useTopStyleColors } from '../../hooks/useTopStyleColors';
import { buildInsightDisplayHtml } from '../../services/buildInsightDisplayHtml';
import {
  isNearScrollEnd,
  readScrollMetrics,
} from '../../services/scrollThreshold';
import type { TopStyleColorItem } from '../../types';
import styles from './OverviewStyleColorCards.module.css';

const SKELETON_COUNT = 6;

export interface OverviewStyleColorCardsProps {
  planCode?: string;
}

interface StyleColorCardProps {
  item: TopStyleColorItem;
  tone: number;
  planCode?: string;
}

const StyleColorCard = memo(function StyleColorCard({
  item,
  tone,
  planCode,
}: StyleColorCardProps) {
  const { t } = useTranslation('hindsight');
  const { askAboutInsight } = useAIChat();
  const name = item.styleColor.name.trim() || t('states.empty');
  const meta = item.hierarchy.label.trim();
  const sales = item.revenue.formattedValue.trim() || '—';
  const sellThrough = item.sellThrough.formattedValue.trim();
  const sellThroughLabel =
    sellThrough.length > 0
      ? t('overview.styleColors.sellThrough', { value: sellThrough })
      : '—';
  const summary = item.summary?.trim() ?? '';

  return (
    <li
      className={styles.card}
      aria-label={t('overview.styleColors.cardLabel', {
        rank: item.rank,
        name,
        sales,
        sellThrough: sellThroughLabel,
      })}
    >
      <span className={styles.strip} data-tone={tone % 6} />
      <div className={styles.details}>
        <span className={styles.imageSlot}>
          <ItemThumbnail
            imageUrl={item.styleColor.imageUrl}
            description={name}
            itemId={item.styleColor.id}
            size="sm"
          />
        </span>
        <div className={styles.nameCol}>
          <Tooltip title={name} variant="tertiary">
            <span className={styles.name}>{name}</span>
          </Tooltip>
          <span className={styles.meta}>Style ID {item.styleColor.id}</span>
          {meta.length > 0 && <span className={styles.meta}>{meta}</span>}
        </div>
      </div>
      <div className={styles.stats}>
        <span className={styles.sales}>{sales}</span>
        <span className={styles.sellThrough}>{sellThroughLabel}</span>
      </div>
      {summary.length > 0 ? (
        <AIStrip
          iconOnly
          text={summary}
          showAskButton
          onAskClick={() =>
            askAboutInsight({
              plainText: summary,
              displayHtml: buildInsightDisplayHtml(name, summary),
              source: 'hindsight',
              widgetId: 'topStyleColors',
              planCode,
            })
          }
        />
      ) : (
        <AIStrip iconOnly text="" loading />
      )}
    </li>
  );
});

function SkeletonCard() {
  return (
    <li className={styles.skeletonCard} aria-hidden="true">
      <span className={[styles.skeletonBone, styles.skeletonStrip].join(' ')} />
      <div className={styles.skeletonDetails}>
        <span className={[styles.skeletonBone, styles.skeletonImage].join(' ')} />
        <div className={styles.skeletonNameCol}>
          <span className={[styles.skeletonBone, styles.skeletonName].join(' ')} />
          <span className={[styles.skeletonBone, styles.skeletonMeta].join(' ')} />
        </div>
      </div>
      <div className={styles.skeletonStats}>
        <span className={[styles.skeletonBone, styles.skeletonSales].join(' ')} />
        <span className={[styles.skeletonBone, styles.skeletonSt].join(' ')} />
      </div>
      <span className={[styles.skeletonBone, styles.skeletonAi].join(' ')} />
    </li>
  );
}

/**
 * Overview → Top Performing Style-Colors.
 *
 * Fetches its own pages via keyset cursor pagination and appends as the planner scrolls the
 * card grid. Rank comes from the server and is never recomputed client-side.
 */
export function OverviewStyleColorCards({ planCode }: OverviewStyleColorCardsProps) {
  const { t } = useTranslation('hindsight');
  const { items, status, pageStatus, hasMore, loadMore, retry, retryPage } =
    useTopStyleColors({ planCode });

  const scrollRef = useRef<HTMLUListElement>(null);
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;
  const pageStatusRef = useRef(pageStatus);
  pageStatusRef.current = pageStatus;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const askedRef = useRef(false);

  useEffect(() => {
    askedRef.current = false;
  }, [items.length]);

  // Same pattern as ItemCardGrid: scroll near end (or a short first page that does not
  // overflow) asks for the next keyset page. IntersectionObserver on a 1px sentinel was
  // unreliable when the scroller height had not settled or content still fit the viewport.
  useEffect(() => {
    if (status !== 'succeeded' || items.length === 0 || !hasMore) return;
    const root = scrollRef.current;
    if (root === null) return;

    const askIfAtEnd = () => {
      if (askedRef.current) return;
      if (pageStatusRef.current !== 'idle' || !hasMoreRef.current) return;
      if (!isNearScrollEnd(readScrollMetrics(root), 48)) return;
      askedRef.current = true;
      loadMoreRef.current();
    };

    askIfAtEnd();
    const raf = requestAnimationFrame(() => askIfAtEnd());
    root.addEventListener('scroll', askIfAtEnd, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('scroll', askIfAtEnd);
    };
  }, [hasMore, items.length, status]);

  function renderBody() {
    if (status === 'loading' || status === 'idle') {
      return (
        <ul className={styles.grid} role="status" aria-label={t('states.loading')}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <SkeletonCard key={`skel-${index}`} />
          ))}
        </ul>
      );
    }

    if (status === 'failed') {
      return (
        <div className={styles.state} role="alert">
          <p className={styles.stateText}>{t('states.error')}</p>
          <button type="button" className={styles.retry} onClick={retry}>
            {t('states.retry')}
          </button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className={styles.empty} role="status">
          {t('states.empty')}
        </div>
      );
    }

    const pageSkeletonCount =
      pageStatus === 'loading' ? ((2 - (items.length % 2)) % 2) + 2 : 0;

    return (
      <>
        <ul
          ref={scrollRef}
          className={styles.grid}
          aria-label={t('overview.styleColors.listLabel')}
          data-testid="overview-style-colors-scroller"
        >
          {items.map((item) => (
            <StyleColorCard
              key={item.article}
              item={item}
              tone={item.rank - 1}
              planCode={planCode}
            />
          ))}
          {pageSkeletonCount > 0 &&
            Array.from({ length: pageSkeletonCount }, (_, index) => (
              <SkeletonCard key={`page-skel-${index}`} />
            ))}
        </ul>
        {pageStatus === 'failed' && (
          <div className={styles.pageError} role="alert">
            <p className={styles.stateText}>{t('states.error')}</p>
            <button type="button" className={styles.retry} onClick={retryPage}>
              {t('states.retry')}
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <section className={styles.widget} data-testid="overview-style-colors">
      <h3 className={styles.title}>{t('overview.styleColors.title')}</h3>
      <p className={styles.swatchNotice}>Material swatches are illustrative.</p>
      {renderBody()}
    </section>
  );
}
