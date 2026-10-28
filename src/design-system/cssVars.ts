import { tokens } from './tokens';
import { DIAGONAL_STRIDE_SIZE } from './tokens/gradients';
import type { Theme } from './themes';

function camelToKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Theme-dependent color custom properties, e.g. `--color-text-primary`. */
export function themeColorVars(theme: Theme): Record<string, string> {
  return Object.fromEntries(
    Object.entries(theme.colors).map(([key, value]) => [
      `--color-${camelToKebab(key)}`,
      value,
    ]),
  );
}

/** Theme-independent token custom properties (spacing, radius, shadows, typography). */
export function staticTokenVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  Object.entries(tokens.spacing).forEach(([k, v]) => {
    vars[`--space-${camelToKebab(k)}`] = v;
  });
  Object.entries(tokens.radius).forEach(([k, v]) => {
    vars[`--radius-${camelToKebab(k)}`] = v;
  });
  Object.entries(tokens.shadows).forEach(([k, v]) => {
    vars[`--shadow-${camelToKebab(k)}`] = v;
  });
  Object.entries(tokens.typography.fontSize).forEach(([k, v]) => {
    vars[`--font-size-${camelToKebab(k)}`] = v;
  });
  Object.entries(tokens.typography.fontWeight).forEach(([k, v]) => {
    vars[`--font-weight-${camelToKebab(k)}`] = String(v);
  });
  Object.entries(tokens.typography.lineHeight).forEach(([k, v]) => {
    vars[`--line-height-${camelToKebab(k)}`] = String(v);
  });
  Object.entries(tokens.breakpoints).forEach(([k, v]) => {
    vars[`--breakpoint-${camelToKebab(k)}`] = v;
  });
  // Raw palette stops (theme-independent) for always-dark surfaces like the sidebar.
  (
    [
      'graphite',
      'iris',
      'acid',
      'sky',
      'amber',
      'coral',
      'rose',
      'purple',
      'emerald',
      'indigo',
      'slate',
      'cyan',
      'green',
      'saffron',
    ] as const
  ).forEach(
    (hue) => {
      Object.entries(tokens.palette[hue]).forEach(([stop, value]) => {
        vars[`--${hue}-${stop}`] = value as string;
      });
    },
  );
  Object.entries(tokens.gradients).forEach(([k, v]) => {
    vars[`--gradient-${camelToKebab(k)}`] = v;
  });
  Object.entries(tokens.textures).forEach(([k, v]) => {
    vars[`--texture-${camelToKebab(k)}`] = v;
  });
  // Chart colours, also exposed as vars so legend swatches can be styled in CSS.
  tokens.charts.series.forEach((value, i) => {
    vars[`--chart-series-${i + 1}`] = value;
  });
  tokens.charts.heatmapScale.forEach((value, i) => {
    vars[`--chart-heatmap-${i + 1}`] = value;
  });
  vars['--chart-neutral'] = tokens.charts.neutral;
  vars['--chart-others'] = tokens.charts.others;
  vars['--texture-diagonal-stride-size'] = DIAGONAL_STRIDE_SIZE;
  vars['--font-family-base'] = tokens.typography.fontFamily.base;
  vars['--font-family-mono'] = tokens.typography.fontFamily.mono;

  return vars;
}

/** Theme-dependent texture custom properties; overrides static textures with the same key. */
export function themeTextureVars(theme: Theme): Record<string, string> {
  return Object.fromEntries(
    Object.entries(theme.textures).map(([key, value]) => [
      `--texture-${camelToKebab(key)}`,
      value,
    ]),
  );
}

/** Apply a theme's variables to a root element and set the `data-theme` attribute. */
export function applyTheme(
  theme: Theme,
  root: HTMLElement = document.documentElement,
): void {
  const vars = {
    ...staticTokenVars(),
    ...themeColorVars(theme),
    ...themeTextureVars(theme),
  };
  Object.entries(vars).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
  root.setAttribute('data-theme', theme.name);
}
