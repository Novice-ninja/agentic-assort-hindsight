import { colors } from '../tokens/colors';
import { createDiagonalStrideTexture } from '../tokens/gradients';
import type { Theme } from './index';

export const dark: Theme = {
  name: 'dark',
  colors: {
    primary: colors.primary,
    primaryHover: colors.primaryHover,
    accent: colors.accent,
    accentText: colors.accentText,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    textPrimary: '#E9E9F0',
    textSecondary: '#9A9AA8',
    textInverse: colors.backgroundDark,
    surface: colors.surfaceDark,
    surfaceMuted: colors.surfaceMutedDark,
    background: colors.backgroundDark,
    border: colors.borderDark,
    focus: colors.focus,
  },
  textures: {
    diagonalStride: createDiagonalStrideTexture(colors.strideStrokeDark),
  },
};
