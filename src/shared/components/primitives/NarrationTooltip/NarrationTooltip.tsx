import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ImpactTooltip as Tooltip } from '@shared/components/vendor/impact-ui';
import styles from './NarrationTooltip.module.css';

export interface NarrationTooltipProps {
  /** The pre-computed narration string from the row data. Empty or undefined means no insight. */
  narration?: string;
  /** The trigger element (the AI button). */
  children: ReactElement;
  /** When false, hover does not open the bubble. Defaults to true. */
  isHoverEnabled?: boolean;
}

/**
 * A static tooltip that shows the AI narration text on hover, without any async request.
 * Uses the same visual bubble as the insight tooltips in the overview widgets.
 */
export function NarrationTooltip({
  narration,
  children,
  isHoverEnabled = true,
}: NarrationTooltipProps) {
  const { t } = useTranslation('common');
  const hasContent = narration !== undefined && narration.trim().length > 0;
  const text = hasContent
    ? narration
    : t('aiStrip.emptyNarration', 'No insights available');
  const className = `${styles.bubble} ${styles.bubbleContent}`;

  return (
    <Tooltip
      variant="tertiary"
      orientation="top"
      arrow={false}
      className={className}
      isHoverEnabled={isHoverEnabled}
      title={
        <div className={styles.body}>
          <p className={styles.text}>{text}</p>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
}
