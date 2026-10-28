import { chartSeries } from '@design-system';

/**
 * Colour by position in the series list. Keeping this here rather than in a caller is what
 * makes chart colour deterministic: the same slot always gets the same colour, so swapping
 * the metric behind a chart never reshuffles the legend.
 */
export function seriesColour(index: number): string {
  return chartSeries[index % chartSeries.length];
}
