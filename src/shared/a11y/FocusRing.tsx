import type { ReactElement } from 'react';
import { cloneElement } from 'react';
import styles from './FocusRing.module.css';

/**
 * Wraps a single interactive child and guarantees a token-driven, visible focus
 * ring via :focus-visible. Components compose this class to keep focus styling
 * consistent across the library (design-system.md §8).
 */
export function FocusRing({ children }: { children: ReactElement<{ className?: string }> }) {
  const childClass = children.props.className;
  return cloneElement(children, {
    className: [childClass, styles.focusRing].filter(Boolean).join(' '),
  });
}

export const focusRingClass = styles.focusRing;
