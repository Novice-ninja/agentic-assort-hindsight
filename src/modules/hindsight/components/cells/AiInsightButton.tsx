import { forwardRef } from 'react';
import aiSparkleIcon from '@assets/icons/hindsight/ai-sparkle-gradient.svg';
import aiSparkleWhiteIcon from '@assets/icons/hindsight/ai-sparkle-white.svg';
import styles from './AiInsightButton.module.css';

export interface AiInsightButtonProps {
  /** Accessible name, e.g. "Ask Iris about Northport". */
  label?: string;
  title?: string;
  onClick?: () => void;
  /** Lets a caller position the button without owning its appearance. */
  className?: string;
}

/**
 * The gradient-bordered sparkle button that opens the agent's take on an item.
 *
 * Shared because the same button sits on a table row, a card's front, and a card's back, and
 * three copies of the same markup drift apart the moment one of them is adjusted.
 *
 * Forwards ref so MUI Tooltip (used by InsightTooltip / NarrationTooltip) can attach listeners.
 */
export const AiInsightButton = forwardRef<HTMLButtonElement, AiInsightButtonProps>(
  function AiInsightButton({ label, title, onClick, className, ...rest }, ref) {
    const accessibleName = label?.trim() || 'Ask Iris about this item';
    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        className={[styles.button, className].filter(Boolean).join(' ')}
        aria-label={accessibleName}
        title={title?.trim() || accessibleName}
        onClick={onClick}
        data-testid="ai-insight-button"
      >
        <span className={styles.icons} aria-hidden="true">
          <img className={styles.iconRest} src={aiSparkleIcon} alt="" width={16} height={16} />
          <img className={styles.iconHover} src={aiSparkleWhiteIcon} alt="" width={16} height={16} />
        </span>
      </button>
    );
  },
);
