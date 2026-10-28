import { apiClient } from '@shared/services';
import { env } from '@config/env';
import { replaceSpecialCharacter } from '@shared/utils/format';
import type { HeatmapAxis, HeatmapCell, HeatmapData, HeatmapMeta } from '../types';

export interface AttributeHeatmapChartParams {
  planCode: string;
  seasonCode: number;
  attributeId: string;
  /** Metric key from global config (`attributeHeatmap.defaultMetricKey`). Required on the wire. */
  metric: string;
}

export interface AttributeHeatmapChartResult {
  data: HeatmapData;
  usedFallback: boolean;
}

interface AttributeHeatmapRequest {
  module: 'hindsight';
  component: 'attr_value_by_cluster';
  type: 'heatmap';
  filters: {
    planCode: string;
    seasonCode: number;
    metric: string;
    attrKey: string;
  };
  encoding: {
    x: 'cluster';
    y: string;
  };
}

function versionedGoApiBaseUrl(): string {
  const base = env.goApiBaseUrl.replace(/\/$/, '');
  return base.endsWith('/v1') ? base : `${base}/v1`;
}

export const ATTRIBUTE_HEATMAP_ENDPOINT = `${versionedGoApiBaseUrl()}/hindsight/charts`;

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function sanitizeLabel(value: string): string {
  const result = replaceSpecialCharacter(value);
  return typeof result === 'string' ? result : value;
}

function asNumber(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

function arrayFrom(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function idFrom(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]+/g, '-').replace(/^-|-$/g, '');
}

function uniqueLabels(entries: ApiRecord[], key: string): string[] {
  const seen = new Set<string>();
  entries.forEach((entry) => {
    let label: string | null = null;
    if (key === 'cluster') {
      label = asString(entry.cluster) ?? asString(entry.x) ?? asString(entry.column);
    } else {
      label = asString(entry[key]) ?? asString(entry.category) ?? asString(entry.y) ?? asString(entry.row);
    }
    if (label !== null) seen.add(sanitizeLabel(label));
  });
  return Array.from(seen);
}

function payloadFrom(response: unknown): unknown {
  if (!isRecord(response)) return response;
  if (response.status === false) {
    throw new Error(asString(response.message) ?? 'Attribute heatmap request failed');
  }
  if (isRecord(response.data) && ('dataset' in response.data || 'chartType' in response.data)) {
    return response.data;
  }
  return response.data ?? response;
}

function axisFrom(value: unknown, fallbackPrefix: string): HeatmapAxis[] {
  return arrayFrom(value)
    .map((entry, index): HeatmapAxis | null => {
      const rawLabel =
        typeof entry === 'string'
          ? entry
          : isRecord(entry)
            ? asString(entry.label) ??
              asString(entry.name) ??
              asString(entry.category) ??
              asString(entry.cluster)
            : null;
      if (rawLabel === null) return null;
      const label = sanitizeLabel(rawLabel);
      return { id: idFrom(label) || `${fallbackPrefix}-${index}`, labelKey: label };
    })
    .filter((entry): entry is HeatmapAxis => entry !== null);
}

function cellsFromTriples(
  rows: HeatmapAxis[],
  columns: HeatmapAxis[],
  rawCells: unknown[],
  metricId: string,
  attrKey: string,
): HeatmapCell[] {
  const rowByLabel = new Map(rows.map((row) => [row.labelKey, row.id]));
  const columnByLabel = new Map(columns.map((column) => [column.labelKey, column.id]));

  return rawCells
    .map((entry): HeatmapCell | null => {
      if (!isRecord(entry)) return null;
      const rawRowLabel =
        asString(entry[attrKey]) ?? asString(entry.category) ?? asString(entry.y) ?? asString(entry.row);
      const rawColumnLabel = asString(entry.cluster) ?? asString(entry.x) ?? asString(entry.column);
      const rowLabel = rawRowLabel !== null ? sanitizeLabel(rawRowLabel) : null;
      const columnLabel = rawColumnLabel !== null ? sanitizeLabel(rawColumnLabel) : null;
      const rowId = rowLabel === null ? null : rowByLabel.get(rowLabel);
      const columnId = columnLabel === null ? null : columnByLabel.get(columnLabel);
      if (rowId == null || columnId == null) return null;

      return {
        rowId,
        columnId,
        value: asNumber(entry.metric ?? entry.value ?? entry.z),
        metricId,
      };
    })
    .filter((entry): entry is HeatmapCell => entry !== null);
}

function parseMeta(payload: ApiRecord): HeatmapMeta | undefined {
  const meta = payload.meta;
  if (!isRecord(meta)) return undefined;
  const vu = meta.valueUniverse;
  if (!isRecord(vu)) return undefined;
  const shown = typeof vu.shown === 'number' ? vu.shown : undefined;
  const total = typeof vu.total === 'number' ? vu.total : undefined;
  if (shown === undefined || total === undefined) return undefined;
  return { valueUniverse: { shown, total } };
}

const EMPTY_HEATMAP = (metricId: string): HeatmapData => ({
  rows: [],
  columns: [],
  cells: [],
  metricId,
});

function cell(rowId: string, columnId: string, value: number): HeatmapCell {
  return { rowId, columnId, value, metricId: 'sell_thru_pct' };
}

const FALLBACK_HEATMAP: HeatmapData = {
  metricId: 'sell_thru_pct',
  rows: [
    { id: 'knitwear', labelKey: 'Knitwear' },
    { id: 'bottoms', labelKey: 'Bottoms' },
    { id: 'denim', labelKey: 'Denim' },
    { id: 'outerwear', labelKey: 'Outerwear' },
    { id: 'dresses', labelKey: 'Dresses' },
  ],
  columns: [
    { id: 'cluster-a', labelKey: 'Cluster A' },
    { id: 'cluster-b', labelKey: 'Cluster B' },
    { id: 'cluster-c', labelKey: 'Cluster C' },
    { id: 'cluster-d', labelKey: 'Cluster D' },
    { id: 'cluster-e', labelKey: 'Cluster E' },
    { id: 'org', labelKey: 'Org' },
  ],
  cells: [
    cell('knitwear', 'cluster-a', 7259), cell('knitwear', 'cluster-b', 4120),
    cell('knitwear', 'cluster-c', 2850), cell('knitwear', 'cluster-d', 5430),
    cell('knitwear', 'cluster-e', 3210), cell('knitwear', 'org', 14964),
    cell('bottoms', 'cluster-a', 6300), cell('bottoms', 'cluster-b', 3580),
    cell('bottoms', 'cluster-c', 4100), cell('bottoms', 'cluster-d', 1490),
    cell('bottoms', 'cluster-e', 5710), cell('bottoms', 'org', 12219),
    cell('denim', 'cluster-a', 8200), cell('denim', 'cluster-b', 6150),
    cell('denim', 'cluster-c', 3600), cell('denim', 'cluster-d', 4800),
    cell('denim', 'cluster-e', 7900), cell('denim', 'org', 17358),
    cell('outerwear', 'cluster-a', 1450), cell('outerwear', 'cluster-b', 920),
    cell('outerwear', 'cluster-c', 780), cell('outerwear', 'cluster-d', 410),
    cell('outerwear', 'cluster-e', 1560), cell('outerwear', 'org', 4460),
    cell('dresses', 'cluster-a', 3660), cell('dresses', 'cluster-b', 2710),
    cell('dresses', 'cluster-c', 1590), cell('dresses', 'cluster-d', 2630),
    cell('dresses', 'cluster-e', 4770), cell('dresses', 'org', 12105),
  ],
  meta: { valueUniverse: { shown: 5, total: 5 } },
};

function normalizeAttributeHeatmap(response: unknown, metricId: string, attrKey: string): HeatmapData {
  const payload = payloadFrom(response);
  if (!isRecord(payload)) return EMPTY_HEATMAP(metricId);

  const responseMetric = asString(payload.metric) ?? metricId;
  const datasetRows = arrayFrom(payload.dataset).filter(isRecord);
  const columns = axisFrom(
    payload.columns ??
      payload.clusters ??
      payload.xAxisCategories ??
      payload.x ??
      uniqueLabels(datasetRows, 'cluster'),
    'cluster',
  );
  const rows = axisFrom(
    payload.rows ??
      payload.categories ??
      payload.yAxisCategories ??
      payload.y ??
      uniqueLabels(datasetRows, attrKey),
    attrKey,
  );

  if (rows.length === 0 || columns.length === 0) {
    return EMPTY_HEATMAP(responseMetric);
  }

  const cells = cellsFromTriples(
    rows,
    columns,
    arrayFrom(payload.cells ?? payload.data ?? payload.dataset),
    responseMetric,
    attrKey,
  );

  const meta = isRecord(payload) ? parseMeta(payload) : undefined;

  return {
    rows,
    columns,
    cells,
    metricId: responseMetric,
    meta,
  };
}

/**
 * Fetches the By Attribute heatmap (attribute values x store clusters).
 *
 * `filters.attrKey` is the selected attribute's key (from the attributes API); `encoding.y`
 * matches the attrKey per the backend contract.
 *
 * Returns fallback dummy data when the API is unavailable so the UI always renders a chart.
 * Once the API is ready, real data flows through with `usedFallback: false` — no frontend
 * changes required.
 */
export async function getAttributeHeatmapChart({
  planCode,
  seasonCode,
  attributeId,
  metric,
}: AttributeHeatmapChartParams): Promise<AttributeHeatmapChartResult> {
  if (metric.length === 0) {
    throw new Error('Attribute heatmap request requires a metric');
  }

  const body: AttributeHeatmapRequest = {
    module: 'hindsight',
    component: 'attr_value_by_cluster',
    type: 'heatmap',
    filters: {
      planCode,
      seasonCode,
      metric,
      attrKey: attributeId,
    },
    encoding: {
      x: 'cluster',
      y: attributeId,
    },
  };

  try {
    const response = await apiClient.post<unknown>(ATTRIBUTE_HEATMAP_ENDPOINT, body);
    const data = normalizeAttributeHeatmap(response, metric, attributeId);
    if (data.rows.length === 0 || data.columns.length === 0) {
      return { data: FALLBACK_HEATMAP, usedFallback: true };
    }
    return { data, usedFallback: false };
  } catch {
    return { data: FALLBACK_HEATMAP, usedFallback: true };
  }
}
