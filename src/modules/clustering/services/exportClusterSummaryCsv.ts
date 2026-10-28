import { formatNumber } from '@shared/utils';
import type { ClusterPlanKpiColumn, ClusterPlanRow } from '../api/getClusterPlans';
import type { KpiBreakdownColumn, KpiBreakdownRow } from '../api/getKpiBreakdown';
import { formatClusteringMetricValue, NO_COMPARISON } from './metricCatalog';
import type { Cluster, ClusteringMetric } from '../types';

export const CLUSTER_PLANS_CSV_FILENAME = 'finalize-cluster-plans.csv';
export const KPI_BREAKDOWN_CSV_FILENAME = 'finalize-kpi-breakdown.csv';

const salesMetric: ClusteringMetric = {
  id: 'sales',
  labelKey: 'metrics.sales',
  format: 'currency',
  direction: 'higherIsBetter',
};
const marginMetric: ClusteringMetric = {
  id: 'marginPct',
  labelKey: 'metrics.marginPct',
  format: 'percentage',
  direction: 'higherIsBetter',
};
const unitsMetric: ClusteringMetric = {
  id: 'salesUnits',
  labelKey: 'finalize.salesUnits',
  format: 'unitCount',
  direction: 'higherIsBetter',
};
const aurMetric: ClusteringMetric = {
  id: 'asp',
  labelKey: 'finalize.asp',
  format: 'currency',
  direction: 'higherIsBetter',
};
const apsMetric: ClusteringMetric = {
  id: 'aps',
  labelKey: 'finalize.aps',
  format: 'score',
  direction: 'higherIsBetter',
};
const gmroiMetric: ClusteringMetric = {
  id: 'gmroi',
  labelKey: 'finalize.gmroi',
  format: 'score',
  direction: 'higherIsBetter',
};

export interface ClusterPlansCsvLabels {
  locale: string;
  headers: readonly string[];
  onFence: (count: number) => string;
  emptyFence: string;
}

export interface KpiBreakdownCsvLabels {
  locale: string;
  headers: readonly string[];
  storeCodeCount: (count: number) => string;
}

export function clusterShortCode(cluster: Cluster): string {
  const source = cluster.defaultName || cluster.name;
  const match = source.match(/^C\d+/i);
  return match?.[0].toUpperCase() ?? source.split(/[\s–-]/u)[0] ?? source;
}

export function exportClusterPlansCsv(clusters: Cluster[], labels: ClusterPlansCsvLabels): string {
  const rows = clusters.map((cluster) => [
    cluster.name,
    String(cluster.storeCount),
    formatClusteringMetricValue(salesMetric, cluster.sales, labels.locale),
    formatClusteringMetricValue(marginMetric, cluster.marginPct, labels.locale),
    cluster.onFenceCount > 0 ? labels.onFence(cluster.onFenceCount) : labels.emptyFence,
  ]);
  return toCsv(labels.headers, rows);
}

export function exportKpiBreakdownCsv(clusters: Cluster[], labels: KpiBreakdownCsvLabels): string {
  const rows = clusters.map((cluster) => {
    const code = clusterShortCode(cluster);
    return [
      `${code}(${cluster.storeCount})`,
      code,
      String(cluster.storeCount),
      labels.storeCodeCount(cluster.storeCount),
      cluster.region ?? NO_COMPARISON,
      formatClusteringMetricValue(salesMetric, cluster.sales, labels.locale),
      formatClusteringMetricValue(unitsMetric, cluster.salesUnits, labels.locale),
      formatClusteringMetricValue(aurMetric, cluster.asp, labels.locale),
      formatClusteringMetricValue(apsMetric, cluster.aps, labels.locale),
      formatClusteringMetricValue(marginMetric, cluster.marginPct, labels.locale),
      formatClusteringMetricValue(salesMetric, cluster.gpUsd, labels.locale),
      formatClusteringMetricValue(gmroiMetric, cluster.gmroi, labels.locale),
      formatClusteringMetricValue(unitsMetric, cluster.receiptUnits, labels.locale),
      formatClusteringMetricValue(marginMetric, cluster.stPct, labels.locale),
    ];
  });
  return toCsv(labels.headers, rows);
}

function toCsv(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [headers, ...rows].map((line) => line.map(csvCell).join(',')).join('\n');
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Every `kpiColumns` entry is a summary column, in response order. */
export function visibleClusterPlanColumns(
  columns: readonly ClusterPlanKpiColumn[],
): ClusterPlanKpiColumn[] {
  return [...columns];
}

export function formatClusterPlanCell(
  key: string,
  row: ClusterPlanRow,
  locale: string,
): string {
  if (key === 'clusterName') return row.clusterName;
  const value = row[key];
  if (value === undefined || value === '') return NO_COMPARISON;
  if (typeof value === 'string') return value;
  if (key === 'stores') return String(value);
  if (/pct$/i.test(key)) {
    const fraction = Math.abs(value) > 1 ? value / 100 : value;
    return formatClusteringMetricValue(marginMetric, fraction, locale);
  }
  return formatNumber(value, locale, { maximumFractionDigits: 2 });
}

/** Cluster column in the breakdown: the name plus its store count, as in `BnM 4(4)`. */
export function kpiBreakdownClusterLabel(row: KpiBreakdownRow): string {
  return `${row.clusterName}(${row.stores})`;
}

export function formatKpiBreakdownValue(
  key: string,
  value: string | number | string[] | undefined,
  locale: string,
): string {
  if (value === undefined || value === '' || Array.isArray(value)) return NO_COMPARISON;
  if (typeof value === 'string') return value;
  if (/pct$/i.test(key)) {
    const fraction = Math.abs(value) > 1 ? value / 100 : value;
    return formatClusteringMetricValue(marginMetric, fraction, locale);
  }
  return formatNumber(value, locale, { maximumFractionDigits: 2 });
}

export interface KpiBreakdownTableCsvLabels {
  locale: string;
  displayName: string;
  stores: string;
  storeCode: string;
  region: string;
  storeCodeCount: (count: number) => string;
  emptyRegion: string;
}

/** Headers and cells for the Full KPI Breakdown panel. */
export function exportKpiBreakdownTableCsv(
  rows: readonly KpiBreakdownRow[],
  kpiColumns: readonly KpiBreakdownColumn[],
  labels: KpiBreakdownTableCsvLabels,
): string {
  const headers = [
    labels.displayName,
    labels.stores,
    labels.storeCode,
    labels.region,
    ...kpiColumns.map((column) => column.label),
  ];
  const body = rows.map((row) => [
    row.clusterName,
    String(row.stores),
    labels.storeCodeCount(row.stores),
    labels.emptyRegion,
    ...kpiColumns.map((column) => {
      const value = row[column.value];
      return formatKpiBreakdownValue(
        column.value,
        Array.isArray(value) ? undefined : value,
        labels.locale,
      );
    }),
  ]);
  return toCsv(headers, body);
}

/** Same headers and cell text as the Cluster Summary grid. */
export function exportClusterPlanKpiCsv(
  rows: readonly ClusterPlanRow[],
  columns: readonly ClusterPlanKpiColumn[],
  locale: string,
): string {
  const visible = visibleClusterPlanColumns(columns);
  return toCsv(
    visible.map((column) => column.label),
    rows.map((row) => visible.map((column) => formatClusterPlanCell(column.value, row, locale))),
  );
}
