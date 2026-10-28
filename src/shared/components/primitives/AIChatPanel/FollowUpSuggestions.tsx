import { createContext, useContext, useId, type ReactNode } from 'react';
import { focusRingClass } from '@shared/a11y';
import { decodeIaString } from '@shared/utils/format';
import styles from './FollowUpSuggestions.module.css';

export const FOLLOW_UP_MESSAGE_BODY_TYPE = 'questions';

/** True while a query is in flight — pills stay on screen until the next render strips them. */
export const FollowUpSendLockContext = createContext(false);

export function FollowUpSendLockProvider({
  locked,
  children,
}: {
  locked: boolean;
  children: ReactNode;
}) {
  return (
    <FollowUpSendLockContext.Provider value={locked}>
      {children}
    </FollowUpSendLockContext.Provider>
  );
}

export interface FollowUpSuggestionsProps {
  questions: readonly string[];
  /** Translated group label, e.g. "Suggested analysis". */
  label: string;
  disabled?: boolean;
  onSelect: (question: string) => void;
}

function SendArrowIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M6.25 4.75 11 8l-4.75 3.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function isFollowUpMessage(bodyType: string | undefined): boolean {
  return bodyType === FOLLOW_UP_MESSAGE_BODY_TYPE;
}

/**
 * Right-aligned suggestion pills for an assistant reply.
 * Renders nothing when the list is empty — no label, no container.
 */
export function FollowUpSuggestions({
  questions,
  label,
  disabled = false,
  onSelect,
}: FollowUpSuggestionsProps) {
  const headingId = useId();
  const sendLocked = useContext(FollowUpSendLockContext);
  const isDisabled = disabled || sendLocked;
  if (questions.length === 0) return null;

  return (
    <div
      className={styles.group}
      data-testid="iris-follow-ups"
      role="group"
      aria-labelledby={headingId}
      aria-live="polite"
    >
      <p id={headingId} className={styles.label}>
        {label}
      </p>
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          className={`${styles.pill} ${focusRingClass}`}
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            onSelect(question);
          }}
        >
          <span className={styles.text}>{decodeIaString(question)}</span>
          <SendArrowIcon />
        </button>
      ))}
    </div>
  );
}
