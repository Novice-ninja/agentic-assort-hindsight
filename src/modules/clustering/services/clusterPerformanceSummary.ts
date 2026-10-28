import type {
  ClusterPlanKpiColumn,
  ClusterPlanRow,
  ClusterPlansResponse,
} from '../api/getClusterPlans';
import { parseSummarySentence } from './summarySentence';

/** One cluster as the summarize prompt expects it: the KPI cells plus the two name fields. */
export interface ClusterPerformanceSummarizeRow {
  clusterName: string;
  suggestedName: string;
  stores: number;
  performanceLabel: string;
  [kpi: string]: string | number;
}

/** `POST /v1/summarize` body for the Finalize "Cluster Plans" table. */
export interface ClusterPerformanceSummarizePayload {
  cardType: 'cluster_performance';
  data: ClusterPerformanceSummarizeRow[];
  kpiColumns: ClusterPlanKpiColumn[];
}

/** Row-model bookkeeping that is not part of the server's cluster row. */
const LOCAL_ONLY_KEYS = new Set(['originalClusterName', 'productLabel', 'storeLabel']);

function toSummarizeRow(row: ClusterPlanRow, kpiColumns: ClusterPlanKpiColumn[]): ClusterPerformanceSummarizeRow {
  const out: ClusterPerformanceSummarizeRow = {
    // The server's name, not a pending rename — the narration describes server data.
    clusterName: row.originalClusterName || row.clusterName,
    suggestedName: row.suggestedName,
    stores: row.stores,
    performanceLabel: row.performanceLabel,
  };
  for (const column of kpiColumns) {
    const key = column.value;
    if (key in out || LOCAL_ONLY_KEYS.has(key)) continue;
    const cell = row[key];
    if (typeof cell === 'number' || typeof cell === 'string') out[key] = cell;
  }
  return out;
}

/**
 * Builds the summarize body from `POST …/get-cluster-plans`. The KPI columns are forwarded
 * untouched so the prompt labels the numbers the way the table does. Null when there is
 * nothing to narrate.
 */
export function buildClusterPerformanceSummarizePayload(
  response: ClusterPlansResponse | null | undefined,
): ClusterPerformanceSummarizePayload | null {
  if (!response || response.data.length === 0) return null;
  return {
    cardType: 'cluster_performance',
    data: response.data.map((row) => toSummarizeRow(row, response.meta.kpiColumns)),
    kpiColumns: response.meta.kpiColumns,
  };
}

/**
 * The table has one strip, so the response collapses to one sentence: every bullet the service
 * sent, scaffolding removed, joined in order. Null when nothing usable arrived.
 */
export function parseClusterPerformanceSummary(raw: unknown): string | null {
  return parseSummarySentence(raw);
}
