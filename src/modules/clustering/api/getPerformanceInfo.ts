import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `POST /v1/clustering/performance/info` with `{ variantId, clusterPlanCode }`. */
export const PERFORMANCE_INFO_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/performance/info`;

/** Catalogue `metricKey` → dataset field name used to plot X/Y/Z. */
export type PerformanceMetricsMapper = Readonly<Record<string, string>>;

/** One store's KPI row from the performance scatter payload. */
export interface PerformanceInfoDataset {
  clusterName: string;
  storeCode: string;
  [kpi: string]: string | number;
}

/** Store counts per cluster, kept for the later table integration. */
export type PerformanceStoreCount = Readonly<Record<string, number>>;

/** Parsed `POST /v1/clustering/performance/info` body (after unwrapping `{ data }`). */
export interface PerformanceInfoResponse {
  type: string;
  meta: { metricsMapper: PerformanceMetricsMapper };
  datasets: PerformanceInfoDataset[];
  storeCount: PerformanceStoreCount;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function readCode(value: unknown): string | null {
  if (isNonEmptyString(value)) return value.trim();
  if (isFiniteNumber(value)) return String(value);
  return null;
}

function parseMetricsMapper(value: unknown): PerformanceMetricsMapper | null {
  if (!isRecord(value)) return null;
  const mapper: Record<string, string> = {};
  for (const [key, mapped] of Object.entries(value)) {
    if (!isNonEmptyString(key) || !isNonEmptyString(mapped)) return null;
    mapper[key] = mapped.trim();
  }
  return mapper;
}

function parseStoreCount(value: unknown): PerformanceStoreCount | null {
  if (!isRecord(value)) return null;
  const storeCount: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!isNonEmptyString(key)) return null;
    const count = isFiniteNumber(raw) ? raw : Number(raw);
    if (!Number.isFinite(count)) return null;
    storeCount[key] = count;
  }
  return storeCount;
}

function parseDataset(value: unknown): PerformanceInfoDataset | null {
  if (!isRecord(value)) return null;
  const clusterName = isNonEmptyString(value.clusterName) ? value.clusterName.trim() : null;
  const storeCode = readCode(value.storeCode);
  if (clusterName === null || storeCode === null) return null;
  const row: PerformanceInfoDataset = { clusterName, storeCode };
  for (const [key, raw] of Object.entries(value)) {
    if (key === 'clusterName' || key === 'storeCode') continue;
    if (typeof raw === 'string' || isFiniteNumber(raw)) {
      row[key] = raw;
    }
  }
  return row;
}

function parseDatasets(value: unknown): PerformanceInfoDataset[] | null {
  if (!Array.isArray(value)) return null;
  const out: PerformanceInfoDataset[] = [];
  for (const item of value) {
    const parsed = parseDataset(item);
    if (parsed === null) return null;
    out.push(parsed);
  }
  return out;
}

export function parsePerformanceInfoResponse(value: unknown): PerformanceInfoResponse | null {
  if (!isRecord(value)) return null;
  const type = isNonEmptyString(value.type) ? value.type.trim() : null;
  const meta = isRecord(value.meta) ? value.meta : null;
  const metricsMapper = meta ? parseMetricsMapper(meta.metricsMapper) : null;
  const datasets = parseDatasets(value.datasets);
  const storeCount = parseStoreCount(value.storeCount);
  if (type === null || metricsMapper === null || datasets === null || storeCount === null) {
    return null;
  }
  return {
    type,
    meta: { metricsMapper },
    datasets,
    storeCount,
  };
}

/** Performance-cluster scatter KPIs for one selected "3 Best" variant. */
export async function getPerformanceInfo(
  clusterPlanCode: string,
  variantId: string,
): Promise<PerformanceInfoResponse> {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  if (!isNonEmptyString(variantId)) throw new Error('variantId is required');
  const payload = await apiClient.post<unknown>(PERFORMANCE_INFO_ENDPOINT, {
    variantId,
    clusterPlanCode: code,
  });
  const data = parsePerformanceInfoResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected performance info response');
  return data;
}
