import type { ReactNode } from 'react';
import { useId } from 'react';
import styles from './WidgetCard.module.css';

export interface WidgetCardProps {
  title?: ReactNode;
  /** A metric picker or view toggle, right-aligned in the header. */
  action?: ReactNode;
  children: ReactNode;
  /** Narration renders below the content, inside the card's padding. */
  narration?: ReactNode;
  span?: 'full' | 'half' | 'third' | 'twoThirds';
  className?: string;
  'data-testid'?: string;
}

/**
 * The card shell every Hindsight widget sits in. Having one shell is what keeps padding,
 * radius, border, and header alignment identical across the page — a widget that styles its
 * own container inevitably drifts.
 *
 * A card with no `title` renders no header, for widgets whose chart frame supplies its own
 * caption and would otherwise be labelled twice.
 */
export function WidgetCard({
  title,
  action,
  children,
  narration,
  span = 'full',
  className,
  'data-testid': testId,
}: WidgetCardProps) {
  const headingId = useId();
  const hasHeader = title !== undefined || action !== undefined;

  return (
    <section
      className={[styles.card, styles[span], className].filter(Boolean).join(' ')}
      aria-labelledby={title === undefined ? undefined : headingId}
      data-testid={testId}
    >
      {hasHeader && (
        <header className={styles.header}>
          {title !== undefined && (
            <h3 className={styles.title} id={headingId}>
              {title}
            </h3>
          )}
          {action !== undefined && <div className={styles.action}>{action}</div>}
        </header>
      )}
      <div className={styles.body}>{children}</div>
      {narration}
    </section>
  );
}
