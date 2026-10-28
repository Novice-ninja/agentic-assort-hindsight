import performanceClusterStores from '../mocks/performanceClusterStores.json';
import type { PerformanceStoreKpi } from '../types';

let cached: readonly PerformanceStoreKpi[] | undefined;

/**
 * Store KPI rows for the Performance Clusters scatter.
 * Today this is the local dummy payload; swap the body when the scatter API lands.
 * JSON is loaded on first call so Jest suites that only import the chart module stay cheap.
 */
export function getPerformanceClusterStores(): readonly PerformanceStoreKpi[] {
  if (cached === undefined) {
    // Lazy so chart unit tests can mock this module without parsing 4000 rows.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cached = performanceClusterStores as PerformanceStoreKpi[];
  }
  return cached;
}
