import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `POST /v1/clustering/plans/{clusterPlanCode}/store_assignments` with body `{ variantId }`. */
export const STORE_ASSIGNMENTS_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

/** One cluster of the variant, with how many stores land in it. */
export interface StoreAssignmentCluster {
  clusterName: string;
  label: string;
  storeCount: number;
  productLabel: string;
  performanceLabel: string;
  storeLabel: string;
}

/** One store → cluster assignment for the variant. */
export interface StoreAssignmentRow {
  /** Backend `store_code`. */
  storeCode: string;
  storeName: string;
  clusterName: string;
  label: string;
}

/** Store assignments of a single variant, as returned by the backend. */
export interface StoreAssignmentsResponse {
  clusterPlanCode: string;
  variantId: string;
  variantName: string;
  channel: string;
  chosenK: number;
  clusters: StoreAssignmentCluster[];
  assignments: StoreAssignmentRow[];
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${STORE_ASSIGNMENTS_ENDPOINT}/${encodeURIComponent(code)}/store_assignments`;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Numeric codes may come back as numbers; everything else must be a non-empty string. */
function readCode(value: unknown): string | null {
  if (isNonEmptyString(value)) return value;
  if (isFiniteNumber(value)) return String(value);
  return null;
}

function readLabel(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function parseCluster(value: unknown): StoreAssignmentCluster | null {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.clusterName) || !isNonEmptyString(value.label)) return null;
  const storeCount = isFiniteNumber(value.storeCount)
    ? value.storeCount
    : Number(value.storeCount);
  if (!Number.isFinite(storeCount)) return null;
  return {
    clusterName: value.clusterName,
    label: value.label,
    storeCount,
    productLabel: readLabel(value.productLabel),
    performanceLabel: readLabel(value.performanceLabel),
    storeLabel: readLabel(value.storeLabel),
  };
}

function parseAssignment(value: unknown): StoreAssignmentRow | null {
  if (!isRecord(value)) return null;
  const storeCode = readCode(value.store_code ?? value.storeCode);
  if (
    storeCode === null ||
    !isNonEmptyString(value.storeName) ||
    !isNonEmptyString(value.clusterName) ||
    !isNonEmptyString(value.label)
  ) {
    return null;
  }
  return {
    storeCode,
    storeName: value.storeName,
    clusterName: value.clusterName,
    label: value.label,
  };
}

function parseAll<T>(value: unknown, parse: (item: unknown) => T | null): T[] | null {
  if (!Array.isArray(value)) return null;
  const out: T[] = [];
  for (const item of value) {
    const parsed = parse(item);
    if (parsed === null) return null;
    out.push(parsed);
  }
  return out;
}

export function parseStoreAssignmentsResponse(
  value: unknown,
): StoreAssignmentsResponse | null {
  if (!isRecord(value)) return null;
  const clusterPlanCode = readCode(value.clusterPlanCode);
  const variantId = readCode(value.variantId);
  const clusters = parseAll(value.clusters, parseCluster);
  const assignments = parseAll(value.assignments, parseAssignment);
  const chosenK = isFiniteNumber(value.chosenK) ? value.chosenK : Number(value.chosenK);
  if (
    clusterPlanCode === null ||
    variantId === null ||
    !Number.isFinite(chosenK) ||
    clusters === null ||
    assignments === null
  ) {
    return null;
  }
  return {
    clusterPlanCode,
    variantId,
    variantName: typeof value.variantName === 'string' ? value.variantName : '',
    channel: typeof value.channel === 'string' ? value.channel : '',
    chosenK,
    clusters,
    assignments,
  };
}

/** Store → cluster assignments of one "3 Best" variant for the plan. */
export async function getStoreAssignments(
  clusterPlanCode: string,
  variantId: string,
): Promise<StoreAssignmentsResponse> {
  if (!isNonEmptyString(variantId)) throw new Error('variantId is required');
  const payload = await apiClient.post<unknown>(endpointFor(clusterPlanCode), {
    variantId,
  });
  const data = parseStoreAssignmentsResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected store assignments response');
  return data;
}
