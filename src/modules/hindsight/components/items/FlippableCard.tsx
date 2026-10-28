import { useRef, type ReactNode } from 'react';
import styles from './FlippableCard.module.css';

/**
 * Anything a planner can operate must not also be a flip trigger. `[data-no-flip]` covers the
 * space around a control as well as the control: a select sits in a wrapper with its own padding
 * and a decorative clear glyph, and a click landing on either of those has the wrapper as its
 * target, not the select.
 */
const INTERACTIVE =
  '[data-no-flip], a, button, input, select, textarea, option, [role="button"], [role="combobox"], [role="option"], [role="listbox"], [contenteditable="true"]';

/**
 * `inert` takes the away face's controls out of the tab order and the accessibility tree. It is a
 * standard attribute but is missing from React 18's JSX types, hence the cast.
 */
function awayProps(away: boolean) {
  return away
    ? ({ inert: '', 'aria-hidden': true } as unknown as { inert?: string })
    : {};
}

export interface FlippableCardProps {
  flipped: boolean;
  onFlippedChange: (flipped: boolean) => void;
  /** Accessible name for the toggle while the front is showing. */
  showBackLabel: string;
  /** Accessible name for the toggle while the back is showing. */
  showFrontLabel: string;
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

/**
 * Two faces of one card, rotated in 3D.
 *
 * Both faces occupy the same grid cell, so the card's box is the taller of the two whichever
 * side is showing and flipping cannot reflow a grid of these. The face rotated away is taken
 * out of the accessibility tree once the rotation finishes, which is also what stops its
 * controls being reachable by tab.
 *
 * A pointer anywhere on the card flips it, but never when the click came from something
 * operable — that test is made here, against the event's target, rather than asking every
 * nested control to stop propagation and hoping none is forgotten.
 */
export function FlippableCard({
  flipped,
  onFlippedChange,
  showBackLabel,
  showFrontLabel,
  front,
  back,
  className,
}: FlippableCardProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;

    // React portals (e.g. dropdown menus rendered at document.body) bubble synthetic events
    // through the React tree, so a click on a portaled option reaches this handler even though
    // the DOM target lives outside the card. Ignore any click whose DOM target is not inside
    // the card's own subtree.
    if (sceneRef.current && !sceneRef.current.contains(event.target)) return;

    if (event.target.closest(INTERACTIVE) !== null) return;

    onFlippedChange(!flipped);
  }

  return (
    // Click-to-flip for pointers; the keyboard path is the labelled toggle button below, which is
    // a real button rather than a role on this element — the card contains a select and buttons.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      ref={sceneRef}
      className={[styles.scene, className].filter(Boolean).join(' ')}
      onClick={handleClick}
      data-testid="hindsight-item-card-flip"
    >
      <div className={styles.inner} data-flipped={flipped ? 'true' : undefined}>
        <div
          className={styles.face}
          data-face="front"
          data-away={flipped ? 'true' : undefined}
          {...awayProps(flipped)}
        >
          {front}
        </div>
        <div
          className={[styles.face, styles.back].join(' ')}
          data-face="back"
          data-away={flipped ? undefined : 'true'}
          {...awayProps(!flipped)}
        >
          {back}
        </div>
      </div>

      {/*
        The card is not itself a button: it contains a select and buttons, and nesting operable
        controls inside a button is invalid and unusable by keyboard. This is the real control,
        clipped until focused so pointer users see the design untouched while keyboard users get
        a labelled, visible target.
      */}
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={flipped}
        onClick={() => onFlippedChange(!flipped)}
        data-testid="hindsight-item-card-flip-toggle"
      >
        {flipped ? showFrontLabel : showBackLabel}
      </button>
    </div>
  );
}
