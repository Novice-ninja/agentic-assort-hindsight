import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';

/** `POST /v1/clustering/kpi-breakdown` with `{ variantId, clusterPlanCode }`. */
export const KPI_BREAKDOWN_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/kpi-breakdown`;

export interface KpiBreakdownColumn {
  label: string;
  value: string;
}

/** One cluster's KPI breakdown row. Dynamic KPI fields sit beside the identity columns. */
export interface KpiBreakdownRow {
  clusterName: string;
  stores: number;
  storeCodes: string[];
  [kpi: string]: string | number | string[];
}

/** Parsed body after the outer `{ data }` envelope is removed. */
export interface KpiBreakdownResponse {
  data: KpiBreakdownRow[];
  meta: { kpiColumns: KpiBreakdownColumn[] };
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

function parseColumns(value: unknown): KpiBreakdownColumn[] | null {
  if (!Array.isArray(value)) return null;
  const columns: KpiBreakdownColumn[] = [];
  for (const item of value) {
    if (!isRecord(item) || !isNonEmptyString(item.label) || !isNonEmptyString(item.value)) {
      return null;
    }
    columns.push({ label: item.label.trim(), value: item.value.trim() });
  }
  return columns;
}

function readScalar(value: unknown): string | number | null {
  if (isFiniteNumber(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return '';
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) return numeric;
    return decodeIaString(trimmed);
  }
  return null;
}

function parseStoreCodes(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  const codes: string[] = [];
  for (const item of value) {
    if (isNonEmptyString(item)) codes.push(decodeIaString(item.trim()));
    else if (isFiniteNumber(item)) codes.push(String(item));
    else return null;
  }
  return codes;
}

function parseRow(value: unknown): KpiBreakdownRow | null {
  if (!isRecord(value)) return null;
  const clusterName = isNonEmptyString(value.clusterName)
    ? decodeIaString(value.clusterName.trim())
    : null;
  const storesRaw = readScalar(value.stores);
  const stores = typeof storesRaw === 'number' ? storesRaw : null;
  const storeCodes = parseStoreCodes(value.storeCodes);
  if (clusterName === null || stores === null || storeCodes === null) return null;
  const row: KpiBreakdownRow = { clusterName, stores, storeCodes };
  for (const [key, raw] of Object.entries(value)) {
    if (key === 'clusterName' || key === 'stores' || key === 'storeCodes') continue;
    const cell = readScalar(raw);
    if (cell !== null) row[key] = cell;
  }
  return row;
}

export function parseKpiBreakdownResponse(value: unknown): KpiBreakdownResponse | null {
  if (!isRecord(value)) return null;
  const kpiColumns = isRecord(value.meta) ? parseColumns(value.meta.kpiColumns) : null;
  if (kpiColumns === null || !Array.isArray(value.data)) return null;
  const rows: KpiBreakdownRow[] = [];
  for (const item of value.data) {
    const row = parseRow(item);
    if (row === null) return null;
    rows.push(row);
  }
  return { data: rows, meta: { kpiColumns } };
}

/** Full KPI breakdown rows for one selected "3 Best" variant. */
export async function getKpiBreakdown(
  clusterPlanCode: string,
  variantId: string,
): Promise<KpiBreakdownResponse> {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  if (!isNonEmptyString(variantId)) throw new Error('variantId is required');
  const payload = await apiClient.post<unknown>(KPI_BREAKDOWN_ENDPOINT, {
    variantId,
    clusterPlanCode: code,
  });
  const data = parseKpiBreakdownResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected KPI breakdown response');
  return data;
}
