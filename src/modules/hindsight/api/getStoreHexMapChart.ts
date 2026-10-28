import { apiClient } from '@shared/services';
import { readChartSource } from './chartSource';
import type { ChartRequestDescriptor } from './chartSource';
import { EmptyChartError, HINDSIGHT_CHARTS_ENDPOINT } from './getRegularPromoSalesChart';
import type { ChartFilters, ChartSource } from '../types';

export interface StoreHexMapEntry {
  storeId: string;
  name: string;
  cluster: string;
  lat: number;
  lon: number;
  value: number;
  /** Optional synthetic local store facts share the canonical flooring dataset. */
  sales?: number;
  quantity?: number;
  gmRate?: number;
  onHandCost?: number;
  sellableQty?: number;
  definitionStatus?: string;
  sourceLabel?: string;
}

export interface StoreHexMapData {
  metricId: string;
  stores: StoreHexMapEntry[];
  insightText?: string;
  source?: ChartSource;
}

export interface StoreHexMapChartParams {
  planCode: string;
  seasonCode: number;
  metric?: string;
  /** Plan product scope flattened onto `filters` as `l0_name`, `l1_name`, … */
  hierarchyScope?: Record<string, string[]>;
}

interface StoreHexMapRequest {
  module: 'hindsight';
  component: 'store_cluster_performance';
  type: 'storeHexMap';
  filters: ChartFilters;
  encoding: {
    x: 'department';
    y: 'metric';
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
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function arrayFrom(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function payloadFrom(response: unknown): unknown {
  if (!isRecord(response)) return response;
  if (response.status === false) {
    throw new Error(asString(response.message) ?? 'Store hex map request failed');
  }
  return response.data ?? response;
}

function normalizeStores(payload: ApiRecord): StoreHexMapEntry[] {
  const rows = arrayFrom(payload.stores ?? payload.rows ?? payload.data ?? payload.dataset);
  if (rows.length === 0 || !rows.every(isRecord)) return [];

  return rows
    .map((row, index): StoreHexMapEntry | null => {
      const lat = asNumber(row.lat ?? row.latitude);
      const lon = asNumber(row.lon ?? row.lng ?? row.longitude);
      const value = asNumber(row.value ?? row.metric ?? row.sellThrough);
      if (lat === null || lon === null || value === null) return null;

      return {
        storeId: asString(row.storeId) ?? `store_${index}`,
        name: asString(row.name) ?? asString(row.storeName) ?? `Store ${index + 1}`,
        cluster: asString(row.cluster) ?? 'unknown',
        lat,
        lon,
        value,
        ...(asNumber(row.sales) !== null ? { sales: asNumber(row.sales)! } : {}),
        ...(asNumber(row.quantity) !== null ? { quantity: asNumber(row.quantity)! } : {}),
        ...(asNumber(row.gmRate) !== null ? { gmRate: asNumber(row.gmRate)! } : {}),
        ...(asNumber(row.onHandCost) !== null ? { onHandCost: asNumber(row.onHandCost)! } : {}),
        ...(asNumber(row.sellableQty) !== null ? { sellableQty: asNumber(row.sellableQty)! } : {}),
        ...(asString(row.definitionStatus) ? { definitionStatus: asString(row.definitionStatus)! } : {}),
        ...(asString(row.sourceLabel) ? { sourceLabel: asString(row.sourceLabel)! } : {}),
      };
    })
    .filter((entry): entry is StoreHexMapEntry => entry !== null);
}

function insightFrom(response: unknown): string | undefined {
  if (!isRecord(response) || !isRecord(response.insight)) return undefined;
  const text = asString(response.insight.text);
  return response.insight.available === true && text !== null ? text : undefined;
}

function normalizeStoreHexMap(response: unknown, metricId: string): StoreHexMapData {
  const payload = payloadFrom(response);
  if (!isRecord(payload)) throw new Error('Store hex map response was not an object');

  const stores = normalizeStores(payload);
  if (stores.length === 0) {
    throw new EmptyChartError('Store hex map response did not contain store data');
  }

  return { metricId, stores, insightText: insightFrom(response) };
}

function sourceDescriptor(body: StoreHexMapRequest): ChartRequestDescriptor {
  return {
    component: body.component,
    type: body.type,
    filters: body.filters,
    encoding: body.encoding,
  };
}

export async function getStoreHexMapChart({
  planCode,
  seasonCode,
  metric = 'sell_thru_pct',
  hierarchyScope,
}: StoreHexMapChartParams): Promise<StoreHexMapData> {
  const body: StoreHexMapRequest = {
    module: 'hindsight',
    component: 'store_cluster_performance',
    type: 'storeHexMap',
    filters: {
      planCode,
      seasonCode,
      metric,
      ...hierarchyScope,
    },
    encoding: {
      x: 'department',
      y: 'metric',
    },
  };

  const response = await apiClient.post<unknown>(HINDSIGHT_CHARTS_ENDPOINT, body);
  const chart = normalizeStoreHexMap(response, metric);
  return { ...chart, source: readChartSource(response, sourceDescriptor(body)) };
}
