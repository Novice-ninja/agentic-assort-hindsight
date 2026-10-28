import type { InputHTMLAttributes } from 'react';
import { focusRingClass, mergeIds, useId } from '@shared/a11y';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  type?: 'text' | 'search' | 'password';
  error?: string;
  helpText?: string;
}

export function Input({
  label,
  type = 'text',
  error,
  helpText,
  id,
  className,
  disabled,
  ...rest
}: InputProps) {
  const generatedId = useId('input');
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const describedBy = mergeIds(helpText && helpId, error && errorId);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        className={[styles.input, error && styles.inputError, focusRingClass, className]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        {...rest}
      />
      {helpText && !error && (
        <span id={helpId} className={styles.help}>
          {helpText}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error} role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}
