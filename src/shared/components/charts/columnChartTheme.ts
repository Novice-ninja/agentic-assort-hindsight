/**
 * Shared column-chart treatment used by the Overview Highcharts bars and the chat SVG
 * plot, so the two surfaces cannot pick different radii, slot widths, or gradient stops.
 *
 * The stop colours are the Overview Multi-Season Trend fills (teal / lilac / blue).
 */

export const COLUMN_BAR_POINT_WIDTH = 16;
export const COLUMN_BAR_TOP_RADIUS = 8;
export const COLUMN_MIN_CATEGORY_SLOT = 112;
export const COLUMN_GROUP_PADDING = 0.22;
export const COLUMN_POINT_PADDING = 0.08;
export const COLUMN_AXIS_FONT_SIZE = 13;
export const COLUMN_CATEGORY_LINE_HEIGHT = 16;
export const COLUMN_CATEGORY_MAX_LINES = 2;
export const COLUMN_PLOT_PAD = {
  top: 14,
  right: 8,
  bottom: 48,
  left: 56,
  /** Left inset on the scrolling plot pane once the y-axis is pinned beside it. */
  plot: 8,
} as const;
export const COLUMN_CHART_HEIGHT = 180 + COLUMN_PLOT_PAD.top + COLUMN_PLOT_PAD.bottom;

export interface ColumnBarGradientStop {
  /** Solid colour at the top of the bar. */
  color: string;
  /** Near-white fade at the baseline (`color` at 6% opacity). */
  fade: string;
}

export const COLUMN_BAR_GRADIENTS: readonly ColumnBarGradientStop[] = [
  { color: 'rgb(102, 190, 198)', fade: 'rgba(102, 190, 198, 0.06)' },
  { color: 'rgb(184, 164, 211)', fade: 'rgba(184, 164, 211, 0.06)' },
  { color: 'rgb(91, 139, 197)', fade: 'rgba(91, 139, 197, 0.06)' },
] as const;

/** Highcharts `color` objects — same stops the Overview column widget already used. */
export function highchartsColumnGradient(index: number): Record<string, unknown> {
  const stop = COLUMN_BAR_GRADIENTS[index % COLUMN_BAR_GRADIENTS.length];
  return {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
      [0, stop.color],
      [1, stop.fade],
    ],
  };
}

export function columnBarGradient(index: number): ColumnBarGradientStop {
  return COLUMN_BAR_GRADIENTS[index % COLUMN_BAR_GRADIENTS.length];
}

/**
 * Fit a single line into `maxChars`, preferring a word/hyphen break and ending with
 * an ellipsis when the source is longer than the slot.
 */
export function ellipsizeCategoryLine(text: string, maxChars: number): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) return '';
  if (maxChars < 1) return '…';
  if (trimmed.length <= maxChars) return trimmed;
  if (maxChars === 1) return '…';

  const budget = maxChars - 1;
  const window = trimmed.slice(0, budget);
  const breakAt = lastBreakIndex(window);
  const minBreak = Math.max(1, Math.floor(budget * 0.4));
  const cut = breakAt >= minBreak ? breakAt : budget;
  return `${trimmed.slice(0, cut).trimEnd()}…`;
}

/**
 * Split a category label onto at most two lines at a space, hyphen, or ampersand.
 * Any leftover on the final line is ellipsized so neighbouring slots cannot collide.
 */
export function wrapCategoryLabel(
  label: string,
  maxCharsPerLine: number,
  maxLines = COLUMN_CATEGORY_MAX_LINES,
): string[] {
  const trimmed = label.trim();
  if (trimmed.length === 0) return [''];
  if (maxCharsPerLine < 1) return ['…'];
  if (trimmed.length <= maxCharsPerLine) return [trimmed];

  const lines: string[] = [];
  let remaining = trimmed;

  while (remaining.length > 0 && lines.length < maxLines - 1) {
    if (remaining.length <= maxCharsPerLine) {
      lines.push(remaining);
      remaining = '';
      break;
    }

    const amp = remaining.indexOf(' &');
    if (amp > 0 && amp <= maxCharsPerLine) {
      lines.push(remaining.slice(0, amp).trimEnd());
      remaining = remaining.slice(amp).trimStart();
      continue;
    }

    const window = remaining.slice(0, maxCharsPerLine + 1);
    const breakAt = lastBreakIndex(window);
    const cut = breakAt > 0 ? breakAt : maxCharsPerLine;
    lines.push(remaining.slice(0, cut).trimEnd());
    remaining = remaining.slice(cut).replace(/^[\s\-&]+/, '');
  }

  if (remaining.length > 0) {
    lines.push(ellipsizeCategoryLine(remaining, maxCharsPerLine));
  }

  return lines;
}

function lastBreakIndex(window: string): number {
  const space = window.lastIndexOf(' ');
  if (space > 0) return space;
  const hyphen = window.lastIndexOf('-');
  const amp = window.lastIndexOf('&');
  return Math.max(hyphen, amp);
}

/**
 * Rounded-top / flat-bottom bar path. A `<rect rx>` would round the baseline too.
 */
export function roundedTopBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  const w = Math.max(width, 0);
  const h = Math.max(height, 0);
  if (w === 0 || h === 0) return '';

  const r = Math.min(radius, w / 2, h);
  const right = x + w;
  const bottom = y + h;

  return [
    `M ${x} ${bottom}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${right - r} ${y}`,
    `Q ${right} ${y} ${right} ${y + r}`,
    `L ${right} ${bottom}`,
    'Z',
  ].join(' ');
}

export function minColumnPlotWidth(
  categoryCount: number,
  padLeft: number,
  padRight: number,
): number {
  const slots = Math.max(categoryCount, 1) * COLUMN_MIN_CATEGORY_SLOT;
  return slots + padLeft + padRight;
}

export function charsPerCategorySlot(slotWidth: number): number {
  const glyph = COLUMN_AXIS_FONT_SIZE * 0.58;
  return Math.max(6, Math.floor((slotWidth - 8) / glyph));
}
