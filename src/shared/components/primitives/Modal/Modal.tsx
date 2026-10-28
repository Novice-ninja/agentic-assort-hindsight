import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { getFocusable, useId } from '@shared/a11y';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Optional extra class for the backdrop (e.g. to anchor the dialog as a drawer). */
  overlayClassName?: string;
  /** Optional extra class for the dialog surface. */
  dialogClassName?: string;
  'data-testid'?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  overlayClassName,
  dialogClassName,
  'data-testid': testId,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId('modal-title');

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const focusables = dialogRef.current ? getFocusable(dialogRef.current) : [];
    (focusables[0] ?? dialogRef.current)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const items = getFocusable(dialogRef.current);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Backdrop click-to-close; keyboard close is handled via the Esc key listener above.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={[styles.overlay, overlayClassName].filter(Boolean).join(' ')}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[styles.dialog, dialogClassName].filter(Boolean).join(' ')}
        tabIndex={-1}
        data-testid={testId}
      >
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
