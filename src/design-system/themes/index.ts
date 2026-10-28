import { light } from './light';
import { dark } from './dark';

/**
 * Semantic color roles. Every theme MUST implement all roles — the compiler
 * rejects an incomplete theme (design-system.md §7.3 / §7.5).
 */
export interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    primaryHover: string;
    accent: string;
    accentText: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    textPrimary: string;
    textSecondary: string;
    textInverse: string;
    surface: string;
    surfaceMuted: string;
    background: string;
    border: string;
    focus: string;
  };
  /** Theme-specific texture overrides (e.g. diagonalStride stroke follows --color-border). */
  textures: {
    diagonalStride: string;
  };
}

export type ThemeName = 'light' | 'dark';

export const themes: Record<ThemeName, Theme> = { light, dark };

export const DEFAULT_THEME: ThemeName = 'light';

export { light, dark };
