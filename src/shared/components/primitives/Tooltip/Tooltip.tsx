import {
  cloneElement,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { useId } from '@shared/a11y';
import styles from './Tooltip.module.css';

type TooltipTriggerProps = {
  'aria-describedby'?: string;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

export interface TooltipProps {
  content: string;
  children: ReactElement<TooltipTriggerProps>;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId('tooltip');
  const childProps = children.props;

  const trigger = cloneElement(children, {
    'aria-describedby': open ? tooltipId : undefined,
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event);
      setOpen(true);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event);
      setOpen(false);
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event);
      setOpen(true);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event);
      setOpen(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event);
      if (event.key === 'Escape') setOpen(false);
    },
  });

  return (
    <span className={styles.wrapper}>
      {trigger}
      {open && (
        <span role="tooltip" id={tooltipId} className={styles.tooltip}>
          {content}
        </span>
      )}
    </span>
  );
}
