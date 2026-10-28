import type {
  ChartDataset,
  ChartDatasetRow,
  ChartDatasetValue,
  ChartEncoding,
  ChartFilters,
  ChartInsightNote,
  ChartSource,
  ChartType,
} from '../types';

/**
 * Keeps the charts endpoint's own answer beside the chart read out of it.
 *
 * The normalisers above this reduce a response to what a chart needs to draw, which loses the
 * dataset keys and the request's `encoding` that named them. The agent needs both — it is asked
 * to read the plotted numbers, not the drawn shape — so the pair is preserved here rather than
 * being fetched a second time when a planner hovers the sparkle icon.
 */

const CHART_TYPES: ChartType[] = ['barchart', 'linechart', 'heatmap', 'storeHexMap'];

/** The part of a charts request that says what the response describes. */
export interface ChartRequestDescriptor {
  component: string;
  type: ChartType;
  filters: ChartFilters;
  encoding: ChartEncoding;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asCell(value: unknown): ChartDatasetValue | undefined {
  if (value === null) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return undefined;
}

/** A row of scalars. Anything nested is dropped: no prompt has a use for it. */
function asRow(value: unknown): ChartDatasetRow | null {
  if (!isRecord(value)) return null;

  const row: ChartDatasetRow = {};
  Object.entries(value).forEach(([key, cell]) => {
    const scalar = asCell(cell);
    if (scalar !== undefined) row[key] = scalar;
  });

  return Object.keys(row).length === 0 ? null : row;
}

function rowsFrom(value: unknown): ChartDatasetRow[] | null {
  if (!Array.isArray(value)) return null;
  const rows = value.map(asRow).filter((row): row is ChartDatasetRow => row !== null);
  return rows.length === 0 ? null : rows;
}

/**
 * Either shape the endpoint sends: a flat array of rows, or rows grouped under the version they
 * belong to. Null when there is nothing to summarise.
 */
function datasetFrom(value: unknown): ChartDataset | null {
  const flat = rowsFrom(value);
  if (flat !== null) return flat;
  if (!isRecord(value)) return null;

  const grouped = Object.entries(value).reduce<Record<string, ChartDatasetRow[]>>(
    (accumulator, [version, rows]) => {
      const parsed = rowsFrom(rows);
      if (parsed !== null) accumulator[version] = parsed;
      return accumulator;
    },
    {},
  );

  return Object.keys(grouped).length === 0 ? null : grouped;
}

function chartTypeFrom(value: unknown): ChartType | undefined {
  return CHART_TYPES.find((type) => type === value);
}

function noteFrom(value: unknown): ChartInsightNote | undefined {
  if (!isRecord(value)) return undefined;
  const text = typeof value.text === 'string' ? value.text : '';
  return { available: value.available === true, text };
}

/**
 * Reads the response's dataset and pairs it with the request that asked for it.
 *
 * `undefined` when the response carries no usable dataset, which is the signal that this chart
 * has nothing to summarise — the agent rejects an empty series outright.
 */
export function readChartSource(
  response: unknown,
  request: ChartRequestDescriptor,
): ChartSource | undefined {
  if (!isRecord(response)) return undefined;

  const payload = isRecord(response.data) ? response.data : response;
  const dataset = datasetFrom(payload.dataset);
  if (dataset === null) return undefined;

  return {
    component: request.component,
    // The response states both, and it is the authority on what it sent; the request is the
    // fallback for an endpoint that echoes neither.
    chartType: chartTypeFrom(payload.chartType) ?? request.type,
    metric: typeof payload.metric === 'string' && payload.metric.length > 0
      ? payload.metric
      : request.filters.metric,
    encoding: request.encoding,
    filters: request.filters,
    dataset,
    insight: noteFrom(response.insight),
  };
}
