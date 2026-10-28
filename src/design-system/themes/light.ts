import { colors } from '../tokens/colors';
import { createDiagonalStrideTexture } from '../tokens/gradients';
import type { Theme } from './index';

export const light: Theme = {
  name: 'light',
  colors: {
    primary: colors.primary,
    primaryHover: colors.primaryHover,
    accent: colors.accent,
    accentText: colors.accentText,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    textInverse: colors.textInverse,
    surface: colors.surface,
    surfaceMuted: colors.surfaceMuted,
    background: colors.background,
    border: colors.border,
    focus: colors.focus,
  },
  textures: {
    diagonalStride: createDiagonalStrideTexture(colors.strideStroke),
  },
};
