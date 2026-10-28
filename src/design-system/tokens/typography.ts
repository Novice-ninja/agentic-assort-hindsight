export const typography = {
  fontFamily: {
    base: "'Manrope', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'SFMono-Regular', ui-monospace, monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.02em',
  },
} as const;

export type FontSizeToken = keyof typeof typography.fontSize;
export type FontWeightToken = keyof typeof typography.fontWeight;
