import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { focusRingClass } from '@shared/a11y';
import styles from './IconButton.module.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons must have an accessible name. */
  'aria-label': string;
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ size = 'medium', className, children, disabled, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={[styles.iconButton, styles[size], focusRingClass, className]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
