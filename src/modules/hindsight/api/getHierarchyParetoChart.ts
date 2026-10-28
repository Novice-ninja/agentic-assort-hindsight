import { apiClient } from '@shared/services';
import type { ChartFilters, ParetoChartData, ParetoChartPoint, ParetoChartSeries } from '../types';
import { readChartSource } from './chartSource';
import {
  EmptyChartError,
  HINDSIGHT_CHARTS_ENDPOINT,
  type RegularPromoSalesChartParams,
} from './getRegularPromoSalesChart';

/**
 * Same request the Overview bar chart already posts. The charts endpoint answers this component
 * with contribution / cumulative rows rather than a plain metric series.
 */
interface HierarchyParetoRequest {
  module: 'hindsight';
  component: 'pareto_chart';
  type: 'linechart';
  filters: ChartFilters;
  encoding: {
    x: 'department';
    y: 'metric';
    versions: string[];
  };
}

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function arrayFrom(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function payloadFrom(response: unknown): unknown {
  if (!isRecord(response)) return response;
  if (response.status === false) {
    throw new Error(asString(response.message) ?? 'Hierarchy Pareto chart request failed');
  }
  return response.data ?? response;
}

function departmentOf(row: ApiRecord): string | null {
  return asString(row.department) ?? asString(row.x) ?? asString(row.label) ?? asString(row.name);
}

function pointFrom(row: ApiRecord): ParetoChartPoint | null {
  const department = departmentOf(row);
  if (department === null) return null;
  return {
    department,
    contribution: asNumber(row.contribution),
    cumulativeContribution: asNumber(row.cumulativeContribution),
    metric: asNumber(row.metric ?? row.value ?? row.y),
  };
}

function pointsFrom(rows: unknown): ParetoChartPoint[] {
  return arrayFrom(rows)
    .filter(isRecord)
    .map(pointFrom)
    .filter((point): point is ParetoChartPoint => point !== null);
}

/**
 * API version ids (`optimisedLy`) do not always match i18n keys (`versions.optLy`).
 * Map known ids onto the shared `versions.*` catalogue so the legend/tooltip never
 * fall through to the raw key (e.g. `versions.optimisedLy`).
 */
const VERSION_LABEL_KEYS: Record<string, string> = {
  ly: 'SS26 actual · synthetic',
  lly: 'SS25 LY · synthetic',
  optimisedLy: 'versions.optLy',
  optLy: 'versions.optLy',
  optimisedLLy: 'versions.optLly',
  optLly: 'versions.optLly',
  lly_optimised: 'versions.optLly',
  forecast: 'versions.forecast',
  plan: 'SS26 plan · synthetic',
};

function versionLabelKey(version: string): string {
  return VERSION_LABEL_KEYS[version] ?? `versions.${version}`;
}

function thresholdFrom(payload: ApiRecord): number | null {
  if (!isRecord(payload.meta)) return null;
  return asNumber(payload.meta.thresholdPct);
}

/**
 * Prefer a stable legend / tooltip order. Remaining keys the endpoint adds are appended.
 */
function orderedVersionEntries(dataset: ApiRecord): Array<[string, unknown]> {
  const preferred = ['ly', 'lly', 'optimisedLy', 'optimisedLLy', 'forecast', 'plan'];
  const remaining = Object.keys(dataset).filter((key) => !preferred.includes(key));
  return [...preferred, ...remaining]
    .filter((key) => key in dataset)
    .map((key) => [key, dataset[key]]);
}

function seriesFromDataset(payload: ApiRecord): ParetoChartSeries[] {
  if (!isRecord(payload.dataset)) return [];

  return orderedVersionEntries(payload.dataset)
    .map(([version, rows]) => ({
      versionId: version,
      labelKey: versionLabelKey(version),
      points: pointsFrom(rows),
    }))
    .filter((series) => series.points.length > 0);
}

function normalizeParetoChart(
  response: unknown,
  instanceId: string,
  metricId: string,
): ParetoChartData {
  const payload = payloadFrom(response);
  if (!isRecord(payload)) throw new Error('Hierarchy Pareto chart response was not an object');

  const series = seriesFromDataset(payload);
  if (series.length === 0) {
    throw new EmptyChartError('Hierarchy Pareto chart response did not contain chart data');
  }

  return {
    instanceId,
    metricId,
    thresholdPct: thresholdFrom(payload),
    series,
  };
}

export async function getHierarchyParetoChart({
  planCode,
  seasonCode,
  metric = 'sales_revenue',
  levelHierarchy = 'l2_name',
  levelHierarchyValue,
  hierarchyScope,
}: RegularPromoSalesChartParams): Promise<ParetoChartData> {
  const filters: ChartFilters = {
    planCode,
    seasonCode,
    metric,
    levelHierarchy,
    ...(levelHierarchyValue !== undefined && levelHierarchyValue.length > 0
      ? { levelHierarchyValue }
      : {}),
    ...hierarchyScope,
  };

  const body: HierarchyParetoRequest = {
    module: 'hindsight',
    component: 'pareto_chart',
    type: 'linechart',
    filters,
    encoding: {
      x: 'department',
      y: 'metric',
      versions: ['ly', 'lly', 'optimisedLy', 'optimisedLLy', 'forecast', 'plan'],
    },
  };

  const response = await apiClient.post<unknown>(HINDSIGHT_CHARTS_ENDPOINT, body);
  const chart = normalizeParetoChart(response, 'hierarchy-pareto-api', metric);
  return { ...chart, source: readChartSource(response, body) };
}
