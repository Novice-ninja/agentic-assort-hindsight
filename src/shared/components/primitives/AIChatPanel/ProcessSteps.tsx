import { createElement, useState, type ReactNode } from 'react';
import styles from './ProcessSteps.module.css';

export interface ProcessStepsProps {
  steps: readonly string[];
  complete?: boolean;
  formatLabel: (current: number, total: number) => string;
}

function humanizeStep(step: string): string {
  if (!step) return step;
  return step.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Collapsible Process Steps from inbound `trace` frames. */
export function ProcessSteps({
  steps,
  complete = false,
  formatLabel,
}: ProcessStepsProps): ReactNode {
  const [open, setOpen] = useState(false);
  const n = steps.length;
  if (n === 0) return null;
  const total = n;
  const current = complete ? n : n;

  return createElement(
    'div',
    { className: styles.root, 'data-testid': 'iris-process-steps' },
    createElement(
      'button',
      {
        type: 'button',
        className: styles.toggle,
        'aria-expanded': open,
        onClick: () => setOpen((v) => !v),
      },
      createElement('span', null, formatLabel(current, total)),
      createElement(
        'span',
        { className: styles.chevron, 'aria-hidden': true },
        open ? '▾' : '›',
      ),
    ),
    open
      ? createElement(
          'ol',
          { className: styles.list },
          ...steps.map((step, i) =>
            createElement('li', { key: `${i}-${step}` }, humanizeStep(step)),
          ),
        )
      : null,
  );
}

export function formatProcessStepsHeading(
  formatLabel: (current: number, total: number) => string,
  stepCount: number,
): string {
  return formatLabel(stepCount, stepCount);
}
