export const spacing = {
  none: '0',
  xs: '4px',
  sm: '8px',
  smd: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export type SpacingToken = keyof typeof spacing;
