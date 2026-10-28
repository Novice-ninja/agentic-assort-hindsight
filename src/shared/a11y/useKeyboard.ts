import { useEffect } from 'react';

type KeyMap = Record<string, (event: KeyboardEvent) => void>;

/**
 * Attaches keydown handlers keyed by `event.key` to a target (defaults to document).
 * Returns nothing; cleans up on unmount. Used by Modal (Esc), Select (arrows), etc.
 */
export function useKeyboard(keyMap: KeyMap, target?: HTMLElement | null, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const node: HTMLElement | Document = target ?? document;
    const handler = (event: Event) => {
      const ke = event as KeyboardEvent;
      const fn = keyMap[ke.key];
      if (fn) fn(ke);
    };
    node.addEventListener('keydown', handler);
    return () => node.removeEventListener('keydown', handler);
  }, [keyMap, target, enabled]);
}

/** Returns focusable descendants of a container (used for focus trapping). */
export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}
