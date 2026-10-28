import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';

/** `POST /v1/clustering/get-cluster-plans` with `{ variantId, clusterPlanCode }`. */
export const CLUSTER_PLANS_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/get-cluster-plans`;

export interface ClusterPlanKpiColumn {
  label: string;
  value: string;
}

/** One cluster row. `clusterName` is the editable summary cell. */
export interface ClusterPlanRow {
  clusterName: string;
  /** Name from the server, kept so a later save can tell what the user changed. */
  originalClusterName: string;
  suggestedName: string;
  stores: number;
  productLabel: string;
  performanceLabel: string;
  storeLabel: string;
  [kpi: string]: string | number;
}

export interface ClusterNameRename {
  customName: string;
  productLabel?: string;
  performanceLabel?: string;
  storeLabel?: string;
}

/** Parsed body after the outer `{ data }` envelope is removed. */
export interface ClusterPlansResponse {
  data: ClusterPlanRow[];
  meta: { kpiColumns: ClusterPlanKpiColumn[] };
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

function parseKpiColumns(value: unknown): ClusterPlanKpiColumn[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const columns: ClusterPlanKpiColumn[] = [];
  for (const item of value) {
    if (!isRecord(item) || !isNonEmptyString(item.label) || !isNonEmptyString(item.value)) {
      return null;
    }
    columns.push({ label: item.label.trim(), value: item.value.trim() });
  }
  return columns;
}

function readCell(value: unknown): string | number | null {
  if (isFiniteNumber(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return '';
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric) && trimmed !== '') return numeric;
    return decodeIaString(trimmed);
  }
  return null;
}

function parseRow(value: unknown): ClusterPlanRow | null {
  if (!isRecord(value)) return null;
  const clusterName = isNonEmptyString(value.clusterName)
    ? decodeIaString(value.clusterName.trim())
    : null;
  const storesRaw = readCell(value.stores);
  const stores = typeof storesRaw === 'number' ? storesRaw : null;
  if (clusterName === null || stores === null) return null;
  const suggestedRaw = value.suggestedName;
  const suggestedName =
    typeof suggestedRaw === 'string' ? decodeIaString(suggestedRaw.trim()) : '';
  const row: ClusterPlanRow = {
    clusterName,
    originalClusterName: clusterName,
    suggestedName,
    stores,
    productLabel: '',
    performanceLabel: '',
    storeLabel: '',
  };
  for (const [key, raw] of Object.entries(value)) {
    if (key === 'clusterName' || key === 'suggestedName' || key === 'stores') continue;
    const cell = readCell(raw);
    if (cell !== null) row[key] = cell;
  }
  row.productLabel = labelOf(row.productLabel);
  row.performanceLabel = labelOf(row.performanceLabel);
  row.storeLabel = labelOf(row.storeLabel);
  row.originalClusterName = clusterName;
  return row;
}

function labelOf(value: string | number): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Renames to send on Final Sign Off: only clusters whose name the user changed. */
export function clusterNameRenames(rows: readonly ClusterPlanRow[]): ClusterNameRename[] {
  const renames: ClusterNameRename[] = [];
  for (const row of rows) {
    const customName = row.clusterName.trim();
    if (!customName || customName === row.originalClusterName.trim()) continue;
    const productLabel = row.productLabel.trim();
    const performanceLabel = row.performanceLabel.trim();
    const storeLabel = row.storeLabel.trim();
    renames.push({
      customName,
      ...(productLabel ? { productLabel } : {}),
      ...(performanceLabel ? { performanceLabel } : {}),
      ...(storeLabel ? { storeLabel } : {}),
    });
  }
  return renames;
}

export function parseClusterPlansResponse(value: unknown): ClusterPlansResponse | null {
  if (!isRecord(value)) return null;
  const kpiColumns = isRecord(value.meta) ? parseKpiColumns(value.meta.kpiColumns) : null;
  if (kpiColumns === null || !Array.isArray(value.data)) return null;
  const rows: ClusterPlanRow[] = [];
  for (const item of value.data) {
    const row = parseRow(item);
    if (row === null) return null;
    rows.push(row);
  }
  return { data: rows, meta: { kpiColumns } };
}

/** Cluster summary rows and column labels for one selected "3 Best" variant. */
export async function getClusterPlans(
  clusterPlanCode: string,
  variantId: string,
): Promise<ClusterPlansResponse> {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  if (!isNonEmptyString(variantId)) throw new Error('variantId is required');
  const payload = await apiClient.post<unknown>(CLUSTER_PLANS_ENDPOINT, {
    variantId,
    clusterPlanCode: code,
  });
  const data = parseClusterPlansResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected cluster plans response');
  return data;
}
