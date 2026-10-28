import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import aiSparkleIcon from '@assets/icons/hindsight/ai-sparkle-gradient.svg';
import { NarrationTooltip } from '../NarrationTooltip';
import styles from './AIStrip.module.css';

export interface AIStripProps {
  /** Insight text to display when not loading */
  text: string;
  /** Optional narration for the hover tooltip; defaults to `text` when omitted */
  narration?: string;
  /** When true (default), shows the narration tooltip only if the insight line is ellipsized */
  showTooltip?: boolean;
  /** Shows "Gathering Insights..." with bordered style */
  loading?: boolean;
  /** Shows the "Ask Iris" button on the right */
  showAskButton?: boolean;
  /** Compact contextual action used by Hindsight; accessible name remains available. */
  iconOnly?: boolean;
  /** Click handler for "Ask Iris" button */
  onAskClick?: () => void;
  /** Optional className for the root container */
  className?: string;
}

export function AIStrip({
  text,
  narration,
  showTooltip = true,
  loading = false,
  showAskButton = false,
  iconOnly = false,
  onAskClick,
  className,
}: AIStripProps) {
  const { t } = useTranslation('common');
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  const tooltipNarration = narration ?? text;
  const shouldShowTooltip =
    showTooltip &&
    !loading &&
    ((narration !== undefined && narration.trim().length > 0) || text.trim().length > 0);

  useLayoutEffect(() => {
    const insight = textRef.current;
    if (!insight) {
      setTruncated((current) => (current ? false : current));
      return;
    }

    const update = () => {
      const next = insight.scrollWidth > insight.clientWidth + 1;
      setTruncated((current) => (current === next ? current : next));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(insight);
    return () => observer.disconnect();
  }, [text, loading, showAskButton]);

  if (loading) {
    return (
      <div
        className={[styles.stripLoading, className].filter(Boolean).join(' ')}
        role="status"
        aria-live="polite"
      >
        <img
          src={aiSparkleIcon}
          alt=""
          aria-hidden="true"
          className={styles.iconSpin}
        />
        <span className={styles.loadingText}>
          {t('aiStrip.loadingLabel', 'Gathering Insights')}
          <span className={styles.loadingDots} aria-hidden="true">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </span>
      </div>
    );
  }

  if (showAskButton) {
    const strip = (
      <div
        className={[styles.stripWithButton, className].filter(Boolean).join(' ')}
      >
        <div className={styles.textGroup}>
          <img
            src={aiSparkleIcon}
            alt=""
            aria-hidden="true"
            className={styles.icon}
          />
          <span ref={textRef} className={styles.insightText}>{text}</span>
        </div>
        <button
          type="button"
          className={[styles.askButton, iconOnly ? styles.askButtonIconOnly : ''].filter(Boolean).join(' ')}
          onClick={onAskClick}
          aria-label={t('aiStrip.askIris', 'Ask Iris')}
          title={t('aiStrip.askIris', 'Ask Iris')}
        >
          <img
            src={aiSparkleIcon}
            alt=""
            aria-hidden="true"
            className={styles.askButtonIcon}
          />
          {!iconOnly && <span className={styles.askButtonText}>
            {t('aiStrip.askIris', 'Ask Iris')}
          </span>}
        </button>
      </div>
    );

    return shouldShowTooltip ? (
      <NarrationTooltip narration={tooltipNarration} isHoverEnabled={truncated}>
        {strip}
      </NarrationTooltip>
    ) : (
      strip
    );
  }

  const strip = (
    <div
      className={[styles.stripLoaded, className].filter(Boolean).join(' ')}
    >
      <img
        src={aiSparkleIcon}
        alt=""
        aria-hidden="true"
        className={styles.icon}
      />
      <span ref={textRef} className={styles.insightText}>{text}</span>
    </div>
  );

  return shouldShowTooltip ? (
    <NarrationTooltip narration={tooltipNarration} isHoverEnabled={truncated}>
      {strip}
    </NarrationTooltip>
  ) : (
    strip
  );
}
