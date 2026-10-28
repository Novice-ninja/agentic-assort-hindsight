import { palette } from './palette';

/**
 * Chart colour tokens. Charts MUST take their colours from here rather than letting a
 * charting library apply its own defaults — two tenants with the same metric configured
 * have to see the same visual treatment (constitution Principle X).
 *
 * Series order is stable: a series keeps its colour when the metric behind it changes,
 * so a metric swap never reshuffles the legend.
 */
export const chartSeries = [
  palette.iris[400],
  palette.sky[400],
  palette.acid[400],
  palette.coral[400],
  palette.emerald[400],
  palette.amber[400],
  palette.indigo[300],
  palette.cyan[400],
] as const;

/**
 * Diverging scale for heatmap cells, ordered worst to best. A `lowerIsBetter` metric
 * reads the same array in reverse rather than needing a second scale.
 */
export const heatmapScale = [
  palette.rose[400],
  palette.coral[300],
  palette.amber[200],
  palette.acid[200],
  palette.emerald[300],
  palette.emerald[500],
] as const;

/** Neutral fill for a cell or slice with no comparable value. */
export const chartNeutral = palette.slate[200];

/** The grouped remainder slice in contribution charts. */
export const chartOthers = palette.slate[400];

export const charts = {
  series: chartSeries,
  heatmapScale,
  neutral: chartNeutral,
  others: chartOthers,
} as const;

export type ChartTokens = typeof charts;
