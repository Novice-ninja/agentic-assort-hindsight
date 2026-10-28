export const colors = {
  // Brand: Nexus Iris (primary) + Acid (accent)
  primary: '#7A5CFF',
  primaryHover: '#6443F0',
  accent: '#CCFF00',
  accentText: '#232C00',
  success: '#2ECC71',
  error: '#FF4D4F',
  warning: '#FFB020',
  info: '#4BCFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textInverse: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F4F6',
  background: '#EFF2FA',
  border: '#E5E7EB',
  focus: '#7A5CFF',
  /** Diagonal hatch on light surfaces — softer/lighter than border */
  strideStroke: '#F2F4F8',
  // Dark palette anchors (Nexus graphite) used by the dark theme
  surfaceDark: '#1C1C20',
  surfaceMutedDark: '#26262C',
  backgroundDark: '#0F0F0F',
  borderDark: '#34343C',
  /** Dark surfaces show no diagonal hatch (matches reference); keep it transparent. */
  strideStrokeDark: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
