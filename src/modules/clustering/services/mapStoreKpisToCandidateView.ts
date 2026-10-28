import { readStoreKpiValue } from './mapStoreKpisToSeries';
import type { CandidateView, Cluster, PerformanceStoreKpi, StoreClusterAssignment } from '../types';

const OPENED_ON = '2024-01-01T00:00:00.000Z';
const ASSIGNMENT_CONFIDENCE = 0.85;

const GBB_SERIES = [
  { id: 'good', name: 'Good', key: 'good_better_best__Good' },
  { id: 'better', name: 'Better', key: 'good_better_best__Better' },
  { id: 'best', name: 'Best', key: 'good_better_best__Best' },
  { id: 'other', name: 'Other', key: 'good_better_best__Other_Good_Better_Best' },
] as const;

export function clusterIdFromName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : 'cluster';
}

function parseGbbShares(raw: string): Record<string, number> {
  if (raw.length === 0) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const shares: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const numeric = typeof value === 'number' ? value : Number(value);
      if (Number.isFinite(numeric)) shares[key] = numeric;
    }
    return shares;
  } catch {
    return {};
  }
}

function mean(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sum(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((total, value) => total + value, 0);
}

function collect(stores: readonly PerformanceStoreKpi[], metricKey: string): number[] {
  const values: number[] = [];
  for (const store of stores) {
    const value = readStoreKpiValue(store, metricKey);
    if (value !== null) values.push(value);
  }
  return values;
}

function majorityClimate(stores: readonly PerformanceStoreKpi[]): string | null {
  const counts = new Map<string, number>();
  for (const store of stores) {
    const climate = store.climate.trim();
    if (climate.length === 0) continue;
    counts.set(climate, (counts.get(climate) ?? 0) + 1);
  }
  let winner: string | null = null;
  let top = 0;
  for (const [climate, count] of counts) {
    if (count > top) {
      winner = climate;
      top = count;
    }
  }
  return winner;
}

function clusterFromStores(
  name: string,
  stores: readonly PerformanceStoreKpi[],
  candidateId: string,
): Cluster {
  const salesRetail = collect(stores, 'revenue');
  const marginPct = collect(stores, 'gross_margin_pct');
  const salesUnits = collect(stores, 'qty_sold');
  const aur = collect(stores, 'aur');
  const aps = collect(stores, 'ros');
  const gpUsd = collect(stores, 'gross_margin');
  const gmroi = collect(stores, 'GMROI');
  const receiptUnits = collect(stores, 'receipts_units');
  const stPct = collect(stores, 'sell_thru_pct');

  return {
    id: clusterIdFromName(name),
    candidateId,
    name,
    defaultName: name,
    storeCount: stores.length,
    sales: sum(salesRetail),
    marginPct: mean(marginPct),
    onFenceCount: 0,
    region: majorityClimate(stores),
    salesUnits: sum(salesUnits),
    asp: mean(aur),
    aps: mean(aps),
    gpUsd: sum(gpUsd),
    gmroi: mean(gmroi),
    receiptUnits: sum(receiptUnits),
    stPct: mean(stPct),
  };
}

function gradesFromStores(
  clusters: readonly { name: string; stores: readonly PerformanceStoreKpi[] }[],
): CandidateView['grades'] {
  const categories = clusters.map((cluster) => cluster.name);
  const series = GBB_SERIES.map((entry) => ({
    id: entry.id,
    name: entry.name,
    data: clusters.map((cluster) => {
      const percents: number[] = [];
      for (const store of cluster.stores) {
        const share = parseGbbShares(store.attribute_value)[entry.key];
        if (share === undefined) continue;
        percents.push(share * 100);
      }
      return mean(percents);
    }),
  }));
  return { categories, series };
}

function assignmentsFromStores(
  stores: readonly PerformanceStoreKpi[],
): StoreClusterAssignment[] {
  return stores.map((store) => ({
    storeId: store.store_code,
    storeName: store.store_name,
    clusterId: clusterIdFromName(store.performance_cluster_name),
    confidence: ASSIGNMENT_CONFIDENCE,
    onFence: false,
    pinned: false,
    excluded: false,
    openedOn: OPENED_ON,
  }));
}

/**
 * Turns the Finalize store-KPI dummy (and later the same-shaped API) into the
 * CandidateView the grades chart and both cluster tables consume.
 */
export function mapStoreKpisToCandidateView(
  stores: readonly PerformanceStoreKpi[],
  candidateId: string,
): CandidateView {
  const grouped = new Map<string, PerformanceStoreKpi[]>();
  for (const store of stores) {
    const name = store.performance_cluster_name;
    const bucket = grouped.get(name);
    if (bucket) bucket.push(store);
    else grouped.set(name, [store]);
  }

  const clusterRows = [...grouped.entries()].map(([name, rows]) => ({ name, stores: rows }));
  const clusters = clusterRows.map((row) => clusterFromStores(row.name, row.stores, candidateId));
  const assignments = assignmentsFromStores(stores);
  const included = assignments.filter((row) => !row.excluded).length;

  return {
    clusters,
    assignments,
    coverage: {
      included,
      excluded: assignments.length - included,
      exclusionNoteKey: 'finalize.coverage',
    },
    scatter: {
      points: [],
      xLabelKey: 'attributes.sellThrough',
      yLabelKey: 'attributes.margin',
    },
    grades: gradesFromStores(clusterRows),
  };
}
