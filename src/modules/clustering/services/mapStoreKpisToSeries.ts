import type { MetricType } from '@modules/appConfig';
import { toPlottedValue } from '@shared/components/charts/formatChartValue';
import { decodeIaString } from '@shared/utils/format';
import type { PerformanceStoreKpi } from '../types';

/** charts-season metricKey → store payload column. Unmapped keys use the metricKey itself. */
export const METRIC_TO_STORE_FIELD: Readonly<Record<string, string>> = {
  sell_thru_pct: 'st',
  margin: 'margin',
  gross_margin: 'margin',
  gross_margin_pct: 'margin_perc',
  aur: 'AUR',
  revenue: 'sales_retail',
  qty_sold: 'sales_units',
  receipts_units: 'unit_receipts',
  option_count: 'choice_count',
  ros: 'APS',
};

export function resolveStoreKpiField(
  metricKey: string,
  metricsMapper?: Readonly<Record<string, string>>,
): string | null {
  if (metricsMapper !== undefined) {
    const mapped = metricsMapper[metricKey];
    return mapped !== undefined && mapped.length > 0 ? mapped : null;
  }
  return METRIC_TO_STORE_FIELD[metricKey] ?? metricKey;
}

export function readStoreKpiValue(
  store: PerformanceStoreKpi,
  metricKey: string,
  metricsMapper?: Readonly<Record<string, string>>,
): number | null {
  const field = resolveStoreKpiField(metricKey, metricsMapper);
  if (field === null) return null;
  const raw = store[field];
  if (raw === null || raw === undefined || raw === '') return null;
  if (typeof raw === 'boolean') return null;
  const value = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(value) ? value : null;
}

export interface AxisExtent {
  min: number;
  max: number;
  tickInterval: number;
}

const EMPTY_EXTENT: AxisExtent = { min: 0, max: 100, tickInterval: 10 };

function niceNumber(range: number, round: boolean): number {
  if (!Number.isFinite(range) || range <= 0) return 1;
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / 10 ** exponent;
  let nice: number;
  if (round) {
    if (fraction < 1.5) nice = 1;
    else if (fraction < 3) nice = 2;
    else if (fraction < 7) nice = 5;
    else nice = 10;
  } else if (fraction <= 1) nice = 1;
  else if (fraction <= 2) nice = 2;
  else if (fraction <= 5) nice = 5;
  else nice = 10;
  return nice * 10 ** exponent;
}

export function axisExtent(values: readonly number[]): AxisExtent {
  if (values.length === 0) return EMPTY_EXTENT;

  let lo = values[0];
  let hi = values[0];
  for (let i = 1; i < values.length; i += 1) {
    const value = values[i];
    if (value < lo) lo = value;
    if (value > hi) hi = value;
  }

  if (lo === hi) {
    const pad = Math.abs(lo) * 0.1 || 1;
    lo -= pad;
    hi += pad;
  }

  const range = niceNumber(hi - lo, false);
  const tickInterval = niceNumber(range / 10, true);
  const step = tickInterval === 0 ? 1 : tickInterval;
  return {
    min: Math.floor(lo / step) * step,
    max: Math.ceil(hi / step) * step,
    tickInterval: step,
  };
}

export interface Scatter3dPoint {
  name: string;
  x: number;
  y: number;
  z: number;
  /** True when this axis had no KPI in the payload; the coordinate is a plot placeholder. */
  xMissing?: boolean;
  yMissing?: boolean;
  zMissing?: boolean;
}

export interface Scatter3dSeries {
  type: 'scatter3d';
  name: string;
  color: string;
  data: Scatter3dPoint[];
}

export interface MappedScatterChart {
  series: Scatter3dSeries[];
  xAxis: AxisExtent;
  yAxis: AxisExtent;
  zAxis: AxisExtent;
}

export interface ScatterAxisKeys {
  xKey: string;
  yKey: string;
  zKey: string;
  xType?: MetricType;
  yType?: MetricType;
  zType?: MetricType;
}

function plottedValue(raw: number | null, metricType: MetricType | undefined): number | null {
  if (raw === null) return null;
  if (metricType === undefined) return raw;
  return toPlottedValue(raw, metricType);
}

export function mapStoreKpisToSeries(
  stores: readonly PerformanceStoreKpi[],
  axes: ScatterAxisKeys,
  palette: readonly string[],
  metricsMapper?: Readonly<Record<string, string>>,
): MappedScatterChart {
  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];
  const byCluster = new Map<string, Scatter3dPoint[]>();

  for (const store of stores) {
    const x = plottedValue(readStoreKpiValue(store, axes.xKey, metricsMapper), axes.xType);
    const y = plottedValue(readStoreKpiValue(store, axes.yKey, metricsMapper), axes.yType);
    const z = plottedValue(readStoreKpiValue(store, axes.zKey, metricsMapper), axes.zType);
    if (x === null && y === null && z === null) continue;

    const cluster = decodeIaString(store.performance_cluster_name);
    const point: Scatter3dPoint = {
      name: decodeIaString(store.store_name),
      x: x ?? 0,
      y: y ?? 0,
      z: z ?? 0,
      ...(x === null ? { xMissing: true } : {}),
      ...(y === null ? { yMissing: true } : {}),
      ...(z === null ? { zMissing: true } : {}),
    };
    const bucket = byCluster.get(cluster);
    if (bucket) bucket.push(point);
    else byCluster.set(cluster, [point]);
    if (x !== null) xs.push(x);
    if (y !== null) ys.push(y);
    if (z !== null) zs.push(z);
  }

  const series: Scatter3dSeries[] = [...byCluster.entries()].map(([name, data], index) => ({
    type: 'scatter3d',
    name,
    color: palette[index % palette.length] ?? '#6bbec2',
    data,
  }));

  return {
    series,
    xAxis: axisExtent(xs),
    yAxis: axisExtent(ys),
    zAxis: axisExtent(zs),
  };
}
