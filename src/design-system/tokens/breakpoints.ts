export const breakpoints = {
  tablet: '768px',
  desktop: '1280px',
} as const;

export type Breakpoint = keyof typeof breakpoints;
