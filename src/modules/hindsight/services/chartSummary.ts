import { replaceSpecialCharacter } from '@shared/utils/format';
import type {
  ChartDataset,
  ChartDatasetRow,
  ChartEncoding,
  ChartSource,
  ChartSummarizeRequest,
  SummarizeHeatmapPoint,
  SummarizeSeries,
} from '../types';

/** Every Overview chart is one shape of card to the agent, whichever chart type it draws. */
export const CHART_CARD_TYPE = 'chart';

interface SeriesGroup {
  name: string;
  rows: ChartDatasetRow[];
}

/**
 * How a series is named when the dataset groups its rows: the group key is the version, and the
 * planner sees the same in the chart legend.
 */
function versionLabel(version: string): string {
  return version.toUpperCase();
}

/**
 * Splits a dataset into its series.
 *
 * A grouped dataset names them itself; a flat one is a single series the endpoint left unnamed,
 * so the caller supplies the name. Multi-series is therefore not a special case — a two-series
 * bar chart is a grouped dataset with two keys.
 */
export function datasetSeriesGroups(dataset: ChartDataset, name: string): SeriesGroup[] {
  if (Array.isArray(dataset)) {
    return dataset.length === 0 ? [] : [{ name, rows: dataset }];
  }

  return Object.entries(dataset)
    .filter(([, rows]) => rows.length > 0)
    .map(([version, rows]) => ({ name: versionLabel(version), rows }));
}

/**
 * Reads a label, decoded. The backend encodes punctuation as `__ia_char_NN`, and an insight
 * quoting those tokens back would read as a bug to a planner.
 */
function labelAt(row: ChartDatasetRow, key: string): string | null {
  const cell = row[key];
  if (cell === null || cell === undefined) return null;
  const decoded = String(replaceSpecialCharacter(String(cell))).trim();
  return decoded === '' ? null : decoded;
}

/**
 * Reads a row's number.
 *
 * `encoding.y` is the value channel on a bar or line chart. On a heatmap both declared channels
 * are categorical — x is the cluster axis, y the category axis — and the number sits in a third
 * column, so it is found as the one remaining numeric cell rather than by assuming its name.
 */
function valueOf(row: ChartDatasetRow, encoding: ChartEncoding): number | null {
  const declared = row[encoding.y];
  if (typeof declared === 'number' && Number.isFinite(declared)) return declared;

  const spare = Object.entries(row).find(
    ([key, cell]) =>
      key !== encoding.x &&
      key !== encoding.y &&
      typeof cell === 'number' &&
      Number.isFinite(cell),
  );

  return spare === undefined ? null : (spare[1] as number);
}

/**
 * Turns a dataset into the series the agent reads, keyed entirely through `encoding`.
 *
 * The endpoint names its dataset columns per component — `cluster` here, `department` there — so
 * the channels the request declared are the only safe way to read a row. Points the row cannot
 * supply a label and a number for are dropped; a series left with none is dropped with them.
 */
export function datasetToSeries(
  dataset: ChartDataset,
  encoding: ChartEncoding,
  name: string,
): SummarizeSeries[] {
  return datasetSeriesGroups(dataset, name)
    .map((group) => ({
      name: group.name,
      data: group.rows
        .map((row) => {
          const label = labelAt(row, encoding.x);
          const value = valueOf(row, encoding);
          return label === null || value === null ? null : { label, value };
        })
        .filter((point): point is { label: string; value: number } => point !== null),
    }))
    .filter((series) => series.data.length > 0);
}

/**
 * The same, for a heatmap: its points sit in two dimensions, so each carries the cluster it was
 * measured in alongside the category it labels.
 */
export function datasetToHeatmapSeries(
  dataset: ChartDataset,
  encoding: ChartEncoding,
  name: string,
): Array<SummarizeSeries<SummarizeHeatmapPoint>> {
  return datasetSeriesGroups(dataset, name)
    .map((group) => ({
      name: group.name,
      data: group.rows
        .map((row) => {
          const label = labelAt(row, encoding.y);
          const cluster = labelAt(row, encoding.x);
          const value = valueOf(row, encoding);
          return label === null || cluster === null || value === null
            ? null
            : { label, cluster, value };
        })
        .filter((point): point is SummarizeHeatmapPoint => point !== null),
    }))
    .filter((series) => series.data.length > 0);
}

/**
 * Builds the summarize request for a chart from the response already on screen.
 *
 * Pure: hovering the sparkle icon never asks the charts endpoint for anything a second time.
 * Null means there is nothing worth summarising — the agent rejects an empty `series` outright,
 * so a chart with no plottable rows must not be sent at all.
 */
export function buildChartSummarizePayload(
  source: ChartSource,
  seriesName: string,
): ChartSummarizeRequest | null {
  if (source.chartType === 'heatmap') {
    const series = datasetToHeatmapSeries(source.dataset, source.encoding, seriesName);
    if (series.length === 0) return null;

    return {
      cardType: CHART_CARD_TYPE,
      chartType: 'heatmap',
      metric: source.metric,
      series,
    };
  }

  const series = datasetToSeries(source.dataset, source.encoding, seriesName);
  if (series.length === 0) return null;

  return {
    cardType: CHART_CARD_TYPE,
    chartType: source.chartType,
    metric: source.metric,
    series,
  };
}

/**
 * What a chart insight is about, beyond the plan and season the cache already keys on.
 *
 * Two charts on the same tab can share a metric, and one chart's metric control changes what it
 * plots, so an insight is only ever reused for the same component showing the same thing.
 */
export function chartInsightScope(source: ChartSource): string {
  const hierarchyValue = source.filters.levelHierarchyValue;
  const hierarchyValueKey = Array.isArray(hierarchyValue)
    ? hierarchyValue.join(',')
    : (hierarchyValue ?? '-');
  return [
    source.component,
    source.chartType,
    source.metric,
    source.filters.levelHierarchy ?? '-',
    hierarchyValueKey,
  ].join('|');
}
