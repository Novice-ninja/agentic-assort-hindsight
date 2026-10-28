import { apiClient } from '@shared/services';
import type { HeatmapAxis, HeatmapCell, HeatmapData } from '../types';
import { EmptyChartError, HINDSIGHT_CHARTS_ENDPOINT } from './getRegularPromoSalesChart';

export interface CategoryClusterMetricChartParams {
  planCode: string;
  seasonCode: number;
  /** Metric key from the widget metric dropdown / config default. Required on the wire. */
  metric: string;
  /** Always the last entry in `GlobalConfig.hierarchy.levelHierarchies`. */
  levelHierarchy: string;
  /** Parent levels only (everything above `levelHierarchy`). Never includes levelHierarchyValue. */
  hierarchyScope: Record<string, string[]>;
}

interface CategoryClusterMetricRequest {
  module: 'hindsight';
  component: 'category_cluster_metric';
  type: 'heatmap';
  filters: {
    planCode: string;
    seasonCode: number;
    metric: string;
    levelHierarchy: string;
    [levelKey: string]: string | number | string[];
  };
  encoding: {
    x: 'category';
    y: 'metric';
    versions: string[];
  };
}

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

/**
 * Whole percents (e.g. 79) become fractions; values already in ratio form (0.79, 1.03) stay.
 * Threshold of 2 avoids treating 103% ratios as whole percents.
 */
function asPlotNumber(value: unknown): number | null {
  const raw = asNumber(value);
  if (raw === null) return null;
  return Math.abs(raw) >= 2 ? raw / 100 : raw;
}

function arrayFrom(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function idFrom(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function uniqueLabels(entries: ApiRecord[], key: 'category' | 'cluster'): string[] {
  const seen = new Set<string>();
  entries.forEach((entry) => {
    const label =
      key === 'category'
        ? asString(entry.category) ?? asString(entry.y) ?? asString(entry.row)
        : asString(entry.cluster) ?? asString(entry.x) ?? asString(entry.column);
    if (label !== null) seen.add(label);
  });
  return Array.from(seen);
}

function payloadFrom(response: unknown): unknown {
  if (!isRecord(response)) return response;
  if (response.status === false) {
    throw new Error(asString(response.message) ?? 'Category cluster metric request failed');
  }
  return response.data ?? response;
}

function axisFrom(value: unknown, fallbackPrefix: string): HeatmapAxis[] {
  return arrayFrom(value)
    .map((entry, index): HeatmapAxis | null => {
      const label =
        typeof entry === 'string'
          ? entry
          : isRecord(entry)
            ? asString(entry.label) ?? asString(entry.name) ?? asString(entry.category) ?? asString(entry.cluster)
            : null;
      if (label === null) return null;
      return { id: idFrom(label) || `${fallbackPrefix}-${index}`, labelKey: label };
    })
    .filter((entry): entry is HeatmapAxis => entry !== null);
}

function cellsFromMatrix(
  rows: HeatmapAxis[],
  columns: HeatmapAxis[],
  matrix: unknown[],
  metricId: string,
): HeatmapCell[] {
  return rows.flatMap((row, rowIndex) => {
    const values = arrayFrom(matrix[rowIndex]);
    return columns.map((column, columnIndex) => ({
      rowId: row.id,
      columnId: column.id,
      value: asPlotNumber(values[columnIndex]),
      metricId,
    }));
  });
}

function cellsFromTriples(
  rows: HeatmapAxis[],
  columns: HeatmapAxis[],
  rawCells: unknown[],
  metricId: string,
): HeatmapCell[] {
  const rowByLabel = new Map(rows.map((row) => [row.labelKey, row.id]));
  const columnByLabel = new Map(columns.map((column) => [column.labelKey, column.id]));

  return rawCells
    .map((entry): HeatmapCell | null => {
      if (!isRecord(entry)) return null;
      const rowLabel = asString(entry.category) ?? asString(entry.y) ?? asString(entry.row);
      const columnLabel = asString(entry.cluster) ?? asString(entry.x) ?? asString(entry.column);
      const rowId = rowLabel === null ? null : rowByLabel.get(rowLabel);
      const columnId = columnLabel === null ? null : columnByLabel.get(columnLabel);
      if (rowId == null || columnId == null) return null;

      return {
        rowId,
        columnId,
        value: asPlotNumber(entry.metric ?? entry.value ?? entry.z),
        metricId,
      };
    })
    .filter((entry): entry is HeatmapCell => entry !== null);
}

/**
 * Live shape: `dataset` is keyed by cluster name; each entry is `{ category, metric }[]`.
 * Columns (x) = cluster keys; rows (y) = union of categories in key order of first appearance.
 */
function fromClusterKeyedDataset(
  dataset: ApiRecord,
  metricId: string,
): HeatmapData | null {
  const clusterEntries = Object.entries(dataset).filter(([, rows]) => Array.isArray(rows));
  if (clusterEntries.length === 0) return null;

  const columns: HeatmapAxis[] = clusterEntries.map(([cluster], index) => ({
    id: idFrom(cluster) || `cluster-${index}`,
    labelKey: cluster,
  }));

  const categoryOrder: string[] = [];
  const seenCategories = new Set<string>();
  for (const [, rows] of clusterEntries) {
    for (const entry of arrayFrom(rows)) {
      if (!isRecord(entry)) continue;
      const category = asString(entry.category) ?? asString(entry.y) ?? asString(entry.row);
      if (category === null || seenCategories.has(category)) continue;
      seenCategories.add(category);
      categoryOrder.push(category);
    }
  }

  if (categoryOrder.length === 0) return null;

  const rows: HeatmapAxis[] = categoryOrder.map((category, index) => ({
    id: idFrom(category) || `category-${index}`,
    labelKey: category,
  }));

  const valueByKey = new Map<string, number | null>();
  clusterEntries.forEach(([_, clusterRows], columnIndex) => {
    const columnId = columns[columnIndex].id;
    for (const entry of arrayFrom(clusterRows)) {
      if (!isRecord(entry)) continue;
      const category = asString(entry.category) ?? asString(entry.y) ?? asString(entry.row);
      if (category === null) continue;
      const row = rows.find((candidate) => candidate.labelKey === category);
      if (row === undefined) continue;
      valueByKey.set(`${row.id}::${columnId}`, asPlotNumber(entry.metric ?? entry.value ?? entry.z));
    }
  });

  const cells: HeatmapCell[] = rows.flatMap((row) =>
    columns.map((column) => ({
      rowId: row.id,
      columnId: column.id,
      value: valueByKey.get(`${row.id}::${column.id}`) ?? null,
      metricId,
    })),
  );

  return { rows, columns, cells, metricId };
}

function normalizeCategoryClusterMetric(response: unknown, metricId: string): HeatmapData {
  const payload = payloadFrom(response);
  if (!isRecord(payload)) throw new Error('Category cluster metric response was not an object');

  if (isRecord(payload.dataset) && !Array.isArray(payload.dataset)) {
    const keyed = fromClusterKeyedDataset(payload.dataset, metricId);
    if (keyed !== null) return keyed;
  }

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
      uniqueLabels(datasetRows, 'category'),
    'category',
  );

  if (rows.length === 0 || columns.length === 0) {
    throw new EmptyChartError('Category cluster metric response did not contain chart data');
  }

  const triples = cellsFromTriples(
    rows,
    columns,
    arrayFrom(payload.cells ?? payload.data ?? payload.dataset),
    metricId,
  );
  const cells =
    triples.length > 0
      ? triples
      : cellsFromMatrix(rows, columns, arrayFrom(payload.values ?? payload.matrix), metricId);

  return {
    rows,
    columns,
    cells,
    metricId,
  };
}

export async function getCategoryClusterMetricChart({
  planCode,
  seasonCode,
  metric,
  levelHierarchy,
  hierarchyScope,
}: CategoryClusterMetricChartParams): Promise<HeatmapData & { insightText?: string }> {
  if (metric === undefined || metric.length === 0) {
    throw new Error('Category cluster metric request requires a metric');
  }

  const body: CategoryClusterMetricRequest = {
    module: 'hindsight',
    component: 'category_cluster_metric',
    type: 'heatmap',
    filters: {
      planCode,
      seasonCode,
      metric,
      levelHierarchy,
      ...hierarchyScope,
    },
    encoding: {
      x: 'category',
      y: 'metric',
      versions: ['ly', 'lly', 'optimisedLy'],
    },
  };

  const response = await apiClient.post<unknown>(HINDSIGHT_CHARTS_ENDPOINT, body);
  const chart = normalizeCategoryClusterMetric(response, metric);
  const insightText = isRecord(response) && isRecord(response.insight) && response.insight.available === true
    ? asString(response.insight.text) : null;
  return { ...chart, ...(insightText ? { insightText } : {}) };
}
