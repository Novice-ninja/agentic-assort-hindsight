export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(17, 24, 39, 0.06)',
  md: '0 4px 8px rgba(17, 24, 39, 0.08)',
  lg: '0 10px 20px rgba(17, 24, 39, 0.12)',
  focus: '0 0 0 3px rgba(37, 99, 235, 0.45)',
} as const;

export type ShadowToken = keyof typeof shadows;
