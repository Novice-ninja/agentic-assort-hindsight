import type { CSSProperties, KeyboardEventHandler } from 'react';
import { focusRingClass } from '@shared/a11y';
import styles from './StatusTabCard.module.css';

export interface StatusTabCardTheme {
  accent: string;
  border: string;
  surface: string;
}

export interface StatusTabCardLayer {
  normal: string;
  active: string;
  left: number;
  top: number;
}

export interface StatusTabCardProps {
  label: string;
  count: string;
  countLabel: string;
  selected: boolean;
  theme: StatusTabCardTheme;
  icon: StatusTabCardLayer;
  badge?: StatusTabCardLayer;
  onClick: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  'data-testid'?: string;
}

export function StatusTabCard({
  label,
  count,
  countLabel,
  selected,
  theme,
  icon,
  badge,
  onClick,
  onKeyDown,
  tabIndex,
  'data-testid': testId,
}: StatusTabCardProps) {
  const vars: CSSProperties & Record<string, string> = {
    '--card-accent': theme.accent,
    '--card-border': theme.border,
    '--card-surface': theme.surface,
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={[styles.card, selected && styles.selected, focusRingClass]
        .filter(Boolean)
        .join(' ')}
      style={vars}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      data-testid={testId}
    >
      <div className={styles.content}>
        <div className={styles.iconBox}>
          <div className={styles.pedestal} />
          <div className={styles.normalGroup} aria-hidden="true">
            <img
              className={styles.glyph}
              src={icon.normal}
              alt=""
              draggable={false}
              style={{ left: icon.left, top: icon.top }}
            />
            {badge && (
              <img
                className={styles.badge}
                src={badge.normal}
                alt=""
                draggable={false}
                style={{ left: badge.left, top: badge.top }}
              />
            )}
          </div>
          <div className={styles.activeGroup} aria-hidden="true">
            <img
              className={styles.glyph}
              src={icon.active}
              alt=""
              draggable={false}
              style={{ left: icon.left, top: icon.top }}
            />
            {badge && (
              <img
                className={styles.badge}
                src={badge.active}
                alt=""
                draggable={false}
                style={{ left: badge.left, top: badge.top }}
              />
            )}
          </div>
        </div>
        <span className={styles.label}>{label}</span>
      </div>
      <span className={styles.count} aria-hidden="true">
        {count}
      </span>
      <span className={styles.srCount}>{countLabel}</span>
      <svg
        className={styles.pointer}
        width="14.54"
        height="10.75"
        viewBox="0 0 14.5376 10.7549"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M5.98893 0.639668C6.62899 -0.213253 7.90856 -0.213192 8.5485 0.639668L14.2155 8.19533C15.0056 9.25033 14.2517 10.7546 12.9342 10.7549H1.60221C0.283983 10.7546 -0.467977 9.25001 0.322916 8.19533L5.98893 0.639668Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
