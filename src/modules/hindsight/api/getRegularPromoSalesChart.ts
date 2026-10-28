import { env } from '@config/env';
import { apiClient } from '@shared/services';
import {
  encodingXForGrain,
  REGULAR_PROMO_OPTIMISED_VERSIONS,
  REGULAR_PROMO_VERSIONS,
  rollupTypeForGrain,
  seriesHasRenderableData,
  type ChartTimeGrain,
} from '../services/chartTimeGrain';
import { readChartSource } from './chartSource';
import type { ChartFilters, VersionChartData, VersionSeries } from '../types';

function versionedGoApiBaseUrl(): string {
  const base = env.goApiBaseUrl.replace(/\/$/, '');
  return base.endsWith('/v1') ? base : `${base}/v1`;
}

/**
 * Every Hindsight chart comes from this one endpoint, which picks the shape from the request's
 * `component` and `type`. It is namespaced under `hindsight/`; a bare `/charts` is not a route the
 * gateway knows and answers `URL_NOT_FOUND`, which reaches the widgets as "no data".
 */
export const HINDSIGHT_CHARTS_ENDPOINT = `${versionedGoApiBaseUrl()}/hindsight/charts`;

export interface RegularPromoSalesChartParams {
  planCode: string;
  seasonCode: number;
  metric?: string;
  levelHierarchy?: string;
  /** Selected hierarchy-dropdown ids. Omit when FilterStrip has no value for this level. */
  levelHierarchyValue?: string[];
  /** Selected FilterStrip levels, flattened onto `filters` as `l0_name`, `l1_name`, … */
  hierarchyScope?: Record<string, string[]>;
  /** Time grain for the Regular + Promo time-series chart. Defaults to week. */
  timeGrain?: ChartTimeGrain;
}

export interface HindsightChartParams extends RegularPromoSalesChartParams {
  component: 'regular_and_promo_sales' | 'metric_by_catg_act_vs_planned';
  type: 'linechart' | 'barchart';
  instanceId: string;
}

interface ChartRequest {
  module: 'hindsight';
  component: HindsightChartParams['component'];
  type: HindsightChartParams['type'];
  /** Present on the Regular + Promo time-series chart only. */
  rollupType?: 'weekRollup' | 'monthRollup';
  filters: ChartFilters;
  encoding: {
    x: 'department' | 'week' | 'month';
    y: 'metric';
    versions: string[];
  };
}

/**
 * The response was well formed but held no chart data — a metric with nothing to show for the
 * season rather than a request that went wrong. Widgets report it as "no data".
 */
export class EmptyChartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmptyChartError';
  }
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

/** Week/month axes arrive as numbers from the charts API; department labels stay strings. */
function asCategoryLabel(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

function arrayFrom(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function dataPayload(response: unknown): unknown {
  if (!isRecord(response)) return response;
  if (response.status === false) {
    throw new Error(asString(response.message) ?? 'Regular promo sales chart request failed');
  }
  return response.data ?? response;
}

function categoryLabelFrom(entry: ApiRecord): string | null {
  return (
    asCategoryLabel(entry.week) ??
    asCategoryLabel(entry.month) ??
    asCategoryLabel(entry.label) ??
    asCategoryLabel(entry.name) ??
    asCategoryLabel(entry.department) ??
    asCategoryLabel(entry.x)
  );
}

/** Prefer numeric week/month order when every label parses as a finite number. */
function sortCategoryLabels(labels: readonly string[]): string[] {
  const numeric = labels.map((label) => Number(label));
  if (numeric.every((value) => Number.isFinite(value))) {
    return [...labels].sort((a, b) => Number(a) - Number(b));
  }
  return [...labels];
}

function categoriesFrom(payload: ApiRecord): string[] {
  const raw =
    payload.xAxisCategories ??
    payload.categories ??
    payload.labels ??
    payload.departments ??
    payload.xAxis;

  return arrayFrom(raw)
    .map((entry) => {
      if (typeof entry === 'string' || typeof entry === 'number') return asCategoryLabel(entry);
      if (isRecord(entry)) return categoryLabelFrom(entry);
      return null;
    })
    .filter((entry): entry is string => entry !== null);
}

function seriesFrom(payload: ApiRecord): VersionSeries[] {
  const rawSeries = arrayFrom(payload.seriesData ?? payload.series ?? payload.datasets);

  return rawSeries
    .map((entry, index): VersionSeries | null => {
      if (!isRecord(entry)) return null;
      const name = asString(entry.name) ?? asString(entry.label) ?? `Series ${index + 1}`;
      const values = arrayFrom(entry.data ?? entry.values).map(asNumber);

      return {
        versionId: name.toLowerCase().replace(/\s+/g, '-'),
        labelKey: name,
        values,
      };
    })
    .filter((entry): entry is VersionSeries => entry !== null);
}

function isOptimisedVersion(versionId: string): boolean {
  return (REGULAR_PROMO_OPTIMISED_VERSIONS as readonly string[]).includes(versionId);
}

/**
 * Drop optimised series that have no real points yet. The API may send null fields from day one;
 * those must not appear in the chart or legend.
 */
function filterRenderableSeries(series: VersionSeries[]): VersionSeries[] {
  return series.filter((serie) => {
    if (isOptimisedVersion(serie.versionId)) {
      return seriesHasRenderableData(serie.values);
    }
    return true;
  });
}

function versionLabel(version: string): string {
  const known: Record<string, string> = {
    ly: 'SS26 actual · synthetic',
    lly: 'SS25 LY · synthetic',
    plan: 'SS26 plan · synthetic',
    forecast: 'Forecast',
    optimisedLy: 'Optimised LY',
    optimisedLLy: 'Optimised LLY',
    ly_optimised: 'LY Optimised',
    lly_optimised: 'LLY Optimised',
    regular: 'Regular',
    promo: 'Promo',
  };
  return known[version] ?? version.toUpperCase();
}

function rowsToChart(
  payload: ApiRecord,
  instanceId: string,
  metricId: string,
): VersionChartData | null {
  const rows = arrayFrom(payload.rows ?? payload.data ?? payload.result);
  if (rows.length === 0 || !rows.every(isRecord)) return null;

  const categories = rows
    .map((row) => categoryLabelFrom(row as ApiRecord))
    .filter((entry): entry is string => entry !== null);

  const versionKeys = [
    ...new Set<string>([
      ...REGULAR_PROMO_VERSIONS,
      ...REGULAR_PROMO_OPTIMISED_VERSIONS,
      'regular',
      'promo',
    ]),
  ].filter((key) => rows.some((row) => asNumber((row as ApiRecord)[key]) !== null));

  if (categories.length === 0 || versionKeys.length === 0) return null;

  return {
    instanceId,
    metricId,
    categories: categories.map((category) => ({ id: category, labelKey: category })),
    series: filterRenderableSeries(
      versionKeys.map((key) => ({
        versionId: key,
        labelKey: versionLabel(key),
        values: rows.map((row) => asNumber((row as ApiRecord)[key])),
      })),
    ),
  };
}

function datasetToChart(
  payload: ApiRecord,
  instanceId: string,
  metricId: string,
): VersionChartData | null {
  if (!isRecord(payload.dataset)) return null;

  const seriesRows = Object.entries(payload.dataset)
    .map(([version, rows]) => ({
      version,
      rows: arrayFrom(rows).filter(isRecord),
    }))
    .filter((entry) => entry.rows.length > 0);

  if (seriesRows.length === 0) return null;

  // Union categories across versions — LY/LLY ranges often differ (gaps stay null).
  const categorySet = new Set<string>();
  for (const { rows } of seriesRows) {
    for (const row of rows) {
      const label = categoryLabelFrom(row);
      if (label !== null) categorySet.add(label);
    }
  }
  const categories = sortCategoryLabels([...categorySet]);

  if (categories.length === 0) return null;

  return {
    instanceId,
    metricId,
    categories: categories.map((category) => ({ id: category, labelKey: category })),
    series: filterRenderableSeries(
      seriesRows.map(({ version, rows }) => {
        const byCategory = new Map<string, number | null>();
        for (const row of rows) {
          const label = categoryLabelFrom(row);
          if (label === null) continue;
          byCategory.set(label, asNumber(row.metric ?? row.value ?? row.y));
        }
        return {
          versionId: version,
          labelKey: versionLabel(version),
          values: categories.map((category) => byCategory.get(category) ?? null),
        };
      }),
    ),
  };
}

function normalizeChart(payload: unknown, instanceId: string, metricId: string): VersionChartData {
  const data = dataPayload(payload);
  if (!isRecord(data)) throw new Error('Regular promo sales chart response was not an object');

  const datasetChart = datasetToChart(data, instanceId, metricId);
  if (datasetChart !== null) {
    if (datasetChart.series.length === 0) {
      throw new EmptyChartError('Regular promo sales chart response did not contain chart data');
    }
    return datasetChart;
  }

  const rowChart = rowsToChart(data, instanceId, metricId);
  if (rowChart !== null) {
    if (rowChart.series.length === 0) {
      throw new EmptyChartError('Regular promo sales chart response did not contain chart data');
    }
    return rowChart;
  }

  const categories = categoriesFrom(data);
  const series = filterRenderableSeries(seriesFrom(data));
  if (categories.length === 0 || series.length === 0) {
    throw new EmptyChartError('Regular promo sales chart response did not contain chart data');
  }

  return {
    instanceId,
    metricId,
    categories: categories.map((category) => ({ id: category, labelKey: category })),
    series,
  };
}

export async function getHindsightVersionChart({
  planCode,
  seasonCode,
  metric = 'sales_revenue',
  levelHierarchy = 'l2_name',
  levelHierarchyValue,
  hierarchyScope,
  timeGrain,
  component,
  type,
  instanceId,
}: HindsightChartParams): Promise<VersionChartData> {
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

  const isTimeSeries = component === 'regular_and_promo_sales';
  const grain: ChartTimeGrain = timeGrain ?? 'week';

  const body: ChartRequest = {
    module: 'hindsight',
    component,
    type,
    ...(isTimeSeries ? { rollupType: rollupTypeForGrain(grain) } : {}),
    filters,
    encoding: {
      x: isTimeSeries ? encodingXForGrain(grain) : 'department',
      y: 'metric',
      versions: isTimeSeries ? [...REGULAR_PROMO_VERSIONS] : ['ly'],
    },
  };

  const response = await apiClient.post<unknown>(HINDSIGHT_CHARTS_ENDPOINT, body);
  const chart = normalizeChart(response, instanceId, metric);
  // Kept beside the drawn chart so its sparkle icon can summarise these exact numbers.
  return { ...chart, source: readChartSource(response, body) };
}

export function getRegularPromoSalesChart(
  params: RegularPromoSalesChartParams,
): Promise<VersionChartData> {
  return getHindsightVersionChart({
    ...params,
    component: 'regular_and_promo_sales',
    type: 'linechart',
    instanceId: 'regular-promo-sales-api',
  });
}
