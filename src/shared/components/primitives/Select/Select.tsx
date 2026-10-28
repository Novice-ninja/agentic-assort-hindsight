import { useMemo, useRef, useState } from 'react';
import { focusRingClass, useId } from '@shared/a11y';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  mode?: 'single' | 'multi' | 'searchable';
  placeholder?: string;
  /** `vertical` (default) stacks the label above the trigger; `horizontal` places it inline. */
  orientation?: 'vertical' | 'horizontal';
  /** When set, replaces the joined option labels in the trigger once a value is chosen. */
  summaryLabel?: string;
  /** When provided, an inline clear (×) button appears in the trigger while a value is selected. */
  onClear?: () => void;
}

export function Select({
  label,
  options,
  value,
  onChange,
  mode = 'single',
  placeholder = 'Select…',
  orientation = 'vertical',
  summaryLabel,
  onClear,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId('listbox');
  const labelId = useId('select-label');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(
    () =>
      mode === 'searchable' && query
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options,
    [options, query, mode],
  );

  const toggle = (optionValue: string) => {
    if (mode === 'multi') {
      onChange(
        value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue],
      );
    } else {
      onChange([optionValue]);
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option && !option.disabled) toggle(option.value);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const hasSelection = value.length > 0;
  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label)
    .join(', ');
  const triggerText = hasSelection ? summaryLabel ?? selectedLabels : placeholder;
  const showClear = Boolean(onClear) && hasSelection;

  return (
    // Keyboard navigation is handled here for the whole listbox widget (arrows/Enter/Esc).
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={styles.select} data-orientation={orientation} onKeyDown={onKeyDown}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div className={styles.field}>
        <button
          ref={buttonRef}
          type="button"
          className={[styles.trigger, focusRingClass].join(' ')}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={labelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.value} data-placeholder={!hasSelection || undefined}>
            {triggerText}
          </span>
        </button>
        <span className={styles.adornments}>
          {showClear && (
            <button
              type="button"
              className={styles.clear}
              aria-label={`Clear ${label}`}
              onClick={(event) => {
                event.stopPropagation();
                onClear?.();
              }}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <svg
            className={styles.chevron}
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {open && (
          <div className={styles.popover}>
            {mode === 'searchable' && (
              <input
                className={styles.search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={`${label} search`}
                // Focusing the search field on open is expected for a searchable listbox.
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            )}
            <ul
              className={styles.list}
              role="listbox"
              id={listId}
              aria-multiselectable={mode === 'multi'}
            >
              {filtered.map((option, index) => {
                const selected = value.includes(option.value);
                return (
                  // Option activation via keyboard is handled by the widget-level onKeyDown.
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled || undefined}
                    className={[
                      styles.option,
                      index === activeIndex && styles.active,
                      selected && styles.selected,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => !option.disabled && toggle(option.value)}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
