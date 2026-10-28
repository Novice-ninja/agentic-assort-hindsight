import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';
import { breakpoints } from './breakpoints';
import { palette } from './palette';
import { gradients, textures } from './gradients';
import { charts } from './charts';

export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
  palette,
  gradients,
  textures,
  charts,
} as const;

export type Tokens = typeof tokens;

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './radius';
export * from './shadows';
export * from './breakpoints';
export * from './palette';
export * from './gradients';
export * from './charts';
