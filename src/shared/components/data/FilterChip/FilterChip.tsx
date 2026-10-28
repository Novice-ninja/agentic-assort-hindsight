import { focusRingClass } from '@shared/a11y';
import styles from './FilterChip.module.css';

export interface FilterChipProps {
  label: string;
  selected?: boolean;
  variant?: 'default' | 'neutral';
  disabled?: boolean;
  removable?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
}

export function FilterChip({
  label,
  selected = false,
  variant = 'default',
  disabled = false,
  removable = false,
  onToggle,
  onRemove,
}: FilterChipProps) {
  return (
    <span
      className={[
        styles.chip,
        variant === 'neutral' && styles.neutral,
        variant === 'default' && selected && styles.selected,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className={[styles.toggle, focusRingClass].join(' ')}
        aria-pressed={selected}
        disabled={disabled}
        onClick={onToggle}
      >
        {label}
      </button>
      {removable && (
        <button
          type="button"
          className={[styles.remove, focusRingClass].join(' ')}
          aria-label={`Remove ${label}`}
          disabled={disabled}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
}
