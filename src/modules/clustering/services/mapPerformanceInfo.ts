import { decodeIaString } from '@shared/utils/format';
import type { PerformanceInfoDataset } from '../api/getPerformanceInfo';
import type { PerformanceStoreKpi } from '../types';

const EMPTY_STORE_FIELDS = {
  attribute_cluster_name: '',
  cluster_display_name: null,
  store_cluster_name: '',
  climate: '',
  store_sizing: '',
  is_highlight: false,
  attribute_value: '',
} as const;

/**
 * Flattens a performance-info dataset row onto the scatter store shape so
 * `mapStoreKpisToSeries` can read KPI fields through `metricsMapper`.
 */
export function mapPerformanceInfoToStores(
  datasets: readonly PerformanceInfoDataset[],
): PerformanceStoreKpi[] {
  return datasets.map((row) => {
    const { clusterName, storeCode, ...kpis } = row;
    return {
      ...EMPTY_STORE_FIELDS,
      ...kpis,
      store_code: storeCode,
      store_name: decodeIaString(storeCode),
      performance_cluster_name: decodeIaString(clusterName),
    };
  });
}
