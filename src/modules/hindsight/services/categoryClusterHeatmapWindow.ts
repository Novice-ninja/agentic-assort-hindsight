/**
 * Row windowing for the Category × Cluster heatmap: Highcharts only paints a fixed
 * slice of rows while spacers keep the full scroll height. Mirrors By Item's edge
 * recentre so the chart is not rebuilt on every scroll pixel.
 */

/** Rows bound into Highcharts at once (~8 visible at 355px / 44px + overscan). */
export const HEATMAP_UI_WINDOW = 48;

/**
 * How close the first visible row may get to either end of the bound window before
 * the window recentres. Large enough that a single scroll step cannot bounce by 1.
 */
export const HEATMAP_WINDOW_EDGE = 12;

/**
 * Start index of the bound row window. Stays put while the first visible row is inside
 * the safe zone, then recentres so scrolling does not rebuild Highcharts every pixel.
 */
export function nextHeatmapWindowStart(
  viewedRowIndex: number,
  currentStart: number,
  rowCount: number,
  windowSize: number = HEATMAP_UI_WINDOW,
  edge: number = HEATMAP_WINDOW_EDGE,
): number {
  if (rowCount <= windowSize) return 0;
  const maxStart = rowCount - windowSize;
  const start = Math.min(Math.max(0, currentStart), maxStart);
  if (viewedRowIndex >= start && viewedRowIndex <= start + windowSize - edge) {
    return start;
  }
  if (viewedRowIndex < start) {
    return Math.max(0, Math.min(maxStart, viewedRowIndex - edge));
  }
  return Math.max(0, Math.min(maxStart, viewedRowIndex - Math.floor(windowSize / 2)));
}

/** Pixel height of skipped rows above (or below) the bound window. */
export function heatmapRowSpacerPx(skippedRows: number, rowHeight: number): number {
  if (skippedRows <= 0 || rowHeight <= 0) return 0;
  return skippedRows * rowHeight;
}

/**
 * How far the scroller must move when the bound window slides, so the same row stays
 * under the viewport instead of jumping by the spacer change.
 */
export function heatmapSpacerScrollDelta(
  previousStart: number,
  nextStart: number,
  rowHeight: number,
): number {
  return heatmapRowSpacerPx(nextStart, rowHeight) - heatmapRowSpacerPx(previousStart, rowHeight);
}

/** Absolute index of the first row that intersects the viewport. */
export function firstVisibleHeatmapRowIndex(scrollTop: number, rowHeight: number): number {
  if (rowHeight <= 0 || scrollTop <= 0) return 0;
  return Math.floor(scrollTop / rowHeight);
}

export interface ColourAxisBounds {
  min: number;
  max: number;
}

/**
 * Global colour-axis min/max from every numeric cell so the scale stays fixed while
 * the row window slides. Null/non-finite values are ignored. Empty → { min: 0, max: 1 }.
 */
export function colourAxisBounds(
  cells: ReadonlyArray<{ value: number | null }>,
): ColourAxisBounds {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const cell of cells) {
    const value = cell.value;
    if (value === null || !Number.isFinite(value)) continue;
    if (value < min) min = value;
    if (value > max) max = value;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 1 };
  }
  if (min === max) {
    // Degenerate: give Highcharts a tiny span so stops still render.
    return { min, max: min + 1 };
  }
  return { min, max };
}
