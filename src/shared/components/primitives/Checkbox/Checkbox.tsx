import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { focusRingClass, useId, visuallyHiddenClass } from '@shared/a11y';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  label: string;
  checked?: boolean;
  indeterminate?: boolean;
  /** Keep the accessible name, hide the visible text (table selection columns). */
  hideLabel?: boolean;
}

export function Checkbox({
  label,
  checked = false,
  indeterminate = false,
  hideLabel = false,
  id,
  disabled,
  className,
  ...rest
}: CheckboxProps) {
  const generatedId = useId('checkbox');
  const inputId = id ?? generatedId;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={[styles.wrapper, hideLabel && styles.hideLabel].filter(Boolean).join(' ')}
      htmlFor={inputId}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={[styles.checkbox, focusRingClass, className].filter(Boolean).join(' ')}
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : checked}
        {...rest}
      />
      <span className={hideLabel ? visuallyHiddenClass : undefined}>{label}</span>
    </label>
  );
}
