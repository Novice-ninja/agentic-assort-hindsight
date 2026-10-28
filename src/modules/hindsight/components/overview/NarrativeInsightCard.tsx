import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import aiSparkleIcon from '@assets/icons/hindsight/ai-sparkle-gradient.svg';
import badgeBgViolet from '@assets/icons/hindsight/season-summary/badge-bg-violet.svg';
import badgeBgGreen from '@assets/icons/hindsight/season-summary/badge-bg-green.svg';
import badgeBgRed from '@assets/icons/hindsight/season-summary/badge-bg-red.svg';
import badgeBgCyan from '@assets/icons/hindsight/season-summary/badge-bg-cyan.svg';
import { resolveNarrativeBadge } from '../../services/narrativeBadgeMap';
import type { NarrativeBadgeTone } from '../../services/narrativeBadgeMap';
import { prepareNarrativeHtml } from '../../services/narrativeSanitize';
import type { SeasonNarrativeBodyBlock, SeasonNarrativeInsight } from '../../types';
import styles from './NarrativeInsightCard.module.css';

const BADGE_BG_BY_TONE: Record<NarrativeBadgeTone, string> = {
  lavender: badgeBgViolet,
  mint: badgeBgGreen,
  amber: badgeBgRed,
  sky: badgeBgCyan,
  rose: badgeBgRed,
};

export interface NarrativeInsightCardProps {
  insight: SeasonNarrativeInsight;
  /** Opens the shared Iris chat and auto-sends this insight (or parent override). */
  onAskIris?: (insight: SeasonNarrativeInsight) => void;
}

function renderBodyBlocks(blocks: readonly SeasonNarrativeBodyBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.type === 'text' && typeof block.data === 'string') {
      parts.push(prepareNarrativeHtml(block.data));
      continue;
    }
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[season-narrative] Skipping unsupported body block type: ${block.type}`);
    }
  }
  return parts.join('');
}

/**
 * One Season Narrative insight card: emoji badge, title, body (clamped), Ask Iris on hover.
 * "Read More" expands the card in place to show the full body; "Show Less" collapses it.
 */
export const NarrativeInsightCard = memo(function NarrativeInsightCard({
  insight,
  onAskIris,
}: NarrativeInsightCardProps) {
  const { t } = useTranslation('hindsight');
  const [expanded, setExpanded] = useState(false);
  const badge = useMemo(
    () => resolveNarrativeBadge(insight.short_title, insight.sequence),
    [insight.short_title, insight.sequence],
  );
  const titleHtml = useMemo(() => prepareNarrativeHtml(insight.title), [insight.title]);
  const bodyHtml = useMemo(() => renderBodyBlocks(insight.body), [insight.body]);

  return (
    <article
      className={styles.card}
      data-testid="narrative-insight-card"
      data-sequence={insight.sequence}
      data-expanded={expanded ? 'true' : 'false'}
    >
      <div className={styles.header}>
        <span className={styles.badge} data-tone={badge.tone} aria-hidden="true">
          <img
            src={BADGE_BG_BY_TONE[badge.tone]}
            alt=""
            className={styles.badgeBg}
          />
          <span className={styles.badgeEmoji}>{badge.emoji}</span>
        </span>
        <div
          className={[styles.title, expanded ? styles.titleExpanded : ''].filter(Boolean).join(' ')}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
        <button
          type="button"
          className={styles.askIris}
          aria-label={t('overview.seasonSummary.askIris')}
          title={t('overview.seasonSummary.askIris')}
          onClick={(event) => {
            event.stopPropagation();
            onAskIris?.(insight);
          }}
        >
          <img src={aiSparkleIcon} alt="" width={16} height={16} aria-hidden="true" />
        </button>
      </div>

      <div
        className={[styles.body, expanded ? styles.bodyExpanded : ''].filter(Boolean).join(' ')}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.readMore}
          aria-expanded={expanded}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
        >
          {expanded
            ? t('overview.seasonSummary.showLess')
            : t('overview.seasonSummary.readMore')}
        </button>
      </div>
    </article>
  );
});
