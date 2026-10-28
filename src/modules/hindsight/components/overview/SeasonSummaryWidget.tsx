import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAIChat } from '@shared/context';
import type { LoadStatus } from '@shared/types';
import rightPatternSvg from '@assets/icons/hindsight/season-summary/right-pattern.svg';
import { useSeasonNarrativeSummary } from '../../hooks/useSeasonNarrativeSummary';
import { insightToPlainText } from '../../services/insightToPlainText';
import { prepareNarrativeHtml } from '../../services/narrativeSanitize';
import type { SeasonNarrativeBodyBlock, SeasonNarrativeInsight } from '../../types';
import { NarrativeInsightCard } from './NarrativeInsightCard';
import { WidgetCard } from '../WidgetCard';
import styles from './SeasonSummaryWidget.module.css';

const SKELETON_CARD_COUNT = 4;

function insightBodyHtml(blocks: readonly SeasonNarrativeBodyBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.type === 'text' && typeof block.data === 'string') {
      parts.push(prepareNarrativeHtml(block.data));
    }
  }
  return parts.join('');
}

export interface SeasonSummaryWidgetProps {
  planCode?: string;
  seasonCode?: number | null;
  /** Overview tab active — skips fetch when false. */
  enabled?: boolean;
  /**
   * Optional override for Ask Iris. Default opens the shared Iris panel and
   * auto-sends the card title + body over the agent WebSocket.
   */
  onAskIris?: (insight: SeasonNarrativeInsight) => void;
}

/**
 * Season Narrative Summary — vertical scrollable list of AI insight cards.
 * Read More expands a card in place to show the full body (no side drawer).
 */
export function SeasonSummaryWidget({
  planCode,
  seasonCode,
  enabled = true,
  onAskIris,
}: SeasonSummaryWidgetProps) {
  const { t } = useTranslation('hindsight');
  const { askAboutInsight } = useAIChat();
  const { insights, status } = useSeasonNarrativeSummary({
    planCode,
    seasonCode,
    enabled,
  });

  const handleAskIris = useCallback(
    (insight: SeasonNarrativeInsight) => {
      if (onAskIris !== undefined) {
        onAskIris(insight);
        return;
      }
      askAboutInsight({
        plainText: insightToPlainText(insight),
        displayHtml: {
          titleHtml: prepareNarrativeHtml(insight.title),
          bodyHtml: insightBodyHtml(insight.body),
        },
        source: 'hindsight',
        widgetId: 'season-narrative',
        planCode,
      });
    },
    [askAboutInsight, onAskIris, planCode],
  );

  return (
    <WidgetCard
      className={styles.widget}
      title={t('overview.seasonSummary.title')}
      data-testid="overview-season-summary"
    >
      <img
        src={rightPatternSvg}
        alt=""
        aria-hidden="true"
        className={styles.pattern}
      />
      <SeasonNarrativeBody insights={insights} status={status} onAskIris={handleAskIris} />
    </WidgetCard>
  );
}

interface BodyProps {
  insights: readonly SeasonNarrativeInsight[];
  status: LoadStatus;
  onAskIris: (insight: SeasonNarrativeInsight) => void;
}

function SeasonNarrativeBody({ insights, status, onAskIris }: BodyProps) {
  const { t } = useTranslation('hindsight');

  if (status === 'loading' || status === 'idle') {
    return (
      <div className={styles.list} role="status" aria-label={t('states.loading')}>
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
          <div key={`summary-skel-${i}`} className={styles.skeletonCard} aria-hidden="true">
            <div className={styles.skeletonHeader}>
              <span className={[styles.skeletonBone, styles.skeletonBadge].join(' ')} />
              <span className={[styles.skeletonBone, styles.skeletonHeading].join(' ')} />
            </div>
            <span className={[styles.skeletonBone, styles.skeletonLine].join(' ')} />
            <span className={[styles.skeletonBone, styles.skeletonLine].join(' ')} />
            <span className={[styles.skeletonBone, styles.skeletonLineShort].join(' ')} />
          </div>
        ))}
      </div>
    );
  }

  if (status === 'failed' || insights.length === 0) {
    return (
      <div className={styles.state}>
        <p className={styles.stateText}>{t('states.empty')}</p>
      </div>
    );
  }

  return (
    <div className={styles.list} aria-label={t('overview.seasonSummary.listLabel')}>
      {insights.map((insight) => (
        <NarrativeInsightCard
          key={`insight-${insight.sequence}-${insight.short_title}`}
          insight={insight}
          onAskIris={onAskIris}
        />
      ))}
    </div>
  );
}
