import type {
  PerformanceInfoDataset,
  PerformanceMetricsMapper,
  PerformanceStoreCount,
} from '../api/getPerformanceInfo';

/** Body posted to `POST /v1/summarize` for the Finalize performance scatter. */
export interface ClusterScatterSummarizeRequest {
  cardType: 'cluster_scatter';
  type: 'scatter';
  axes: { x: string; y: string; z: string };
  storeCount: PerformanceStoreCount;
  datasets: PerformanceInfoDataset[];
  metricsMapper: PerformanceMetricsMapper;
}

function axisField(
  metricKey: string | undefined,
  metricsMapper: PerformanceMetricsMapper,
): string | null {
  if (metricKey === undefined || metricKey.length === 0) return null;
  const mapped = metricsMapper[metricKey];
  return mapped !== undefined && mapped.length > 0 ? mapped : metricKey;
}

/**
 * Summarize payload for the scatter already on screen. Null when an axis or the
 * dataset is missing, so the strip does not ask the agent for an empty chart.
 */
export function buildClusterScatterSummarizePayload(input: {
  xKey?: string;
  yKey?: string;
  zKey?: string;
  datasets?: readonly PerformanceInfoDataset[];
  storeCount?: PerformanceStoreCount;
  metricsMapper?: PerformanceMetricsMapper;
}): ClusterScatterSummarizeRequest | null {
  const { datasets, storeCount, metricsMapper } = input;
  if (!datasets || datasets.length === 0 || !storeCount || !metricsMapper) return null;
  const x = axisField(input.xKey, metricsMapper);
  const y = axisField(input.yKey, metricsMapper);
  const z = axisField(input.zKey, metricsMapper);
  if (x === null || y === null || z === null) return null;
  return {
    cardType: 'cluster_scatter',
    type: 'scatter',
    axes: { x, y, z },
    storeCount,
    datasets: [...datasets],
    metricsMapper,
  };
}
