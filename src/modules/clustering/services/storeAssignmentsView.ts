import type {
  StoreAssignmentCluster,
  StoreAssignmentRow,
  StoreAssignmentsResponse,
} from '../api/getStoreAssignments';
import type { StoreMove } from '../api/moveStores';
import type { StoreAssignmentsEntry } from '../store/clusteringSlice';
import type { ClusterResultCandidate } from '../types';

/** Tab value of the "Compare All" tab; candidate tabs use the candidate `id`. */
export const COMPARE_ALL_TAB = 'compare-all';

/** Number of cluster pill tones the panel cycles through (`C1` → 0, `C2` → 1, … `C6` → 0). */
export const CLUSTER_TONE_COUNT = 5;

/**
 * Stable tone index for a cluster label so the same label always gets the same pill colour.
 * Numeric labels (`C12`) cycle by their number; anything else hashes its characters.
 */
export function clusterTone(label: string): number {
  const digits = label.match(/\d+/);
  if (digits)
    return (Number(digits[0]) - 1 + CLUSTER_TONE_COUNT * 1000) % CLUSTER_TONE_COUNT;
  let hash = 0;
  for (const char of label) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  return hash % CLUSTER_TONE_COUNT;
}

/** Per-variant, per-store "Move To…" picks: a label, or `null` once the user cleared it. */
export type StoreMoves = Record<string, Record<string, string | null>>;

/** Stores whose picked cluster differs from their current one (cleared picks are not moves). */
export function countMoves(
  rows: readonly StoreAssignmentRow[],
  moves: Record<string, string | null> | undefined,
): number {
  if (!moves) return 0;
  let count = 0;
  for (const row of rows) {
    const target = moves[row.storeCode];
    if (typeof target === 'string' && target !== row.label) count += 1;
  }
  return count;
}

const normalise = (value: string) => value.trim().toLowerCase();

/** Case-insensitive match on store name, store code, cluster name or cluster label. */
export function filterAssignments(
  rows: readonly StoreAssignmentRow[],
  query: string,
): StoreAssignmentRow[] {
  const q = normalise(query);
  if (!q) return [...rows];
  return rows.filter((row) =>
    [row.storeName, row.storeCode, row.clusterName, row.label].some((field) =>
      normalise(field).includes(q),
    ),
  );
}

/** One "Compare All" row: a store with its cluster label under every variant (if assigned). */
export interface CompareRow {
  storeCode: string;
  storeName: string;
  /** `variantId` → cluster label; missing when that variant does not assign the store. */
  labels: Record<string, string>;
}

/**
 * Union of the stores across every loaded variant, in first-seen order (the first candidate's
 * assignment order wins, later candidates append stores the earlier ones did not have).
 */
export function buildCompareRows(
  candidates: readonly ClusterResultCandidate[],
  responses: Readonly<Record<string, StoreAssignmentsResponse | null | undefined>>,
): CompareRow[] {
  const byStore = new Map<string, CompareRow>();
  for (const candidate of candidates) {
    const response = responses[candidate.variantId];
    if (!response) continue;
    for (const row of response.assignments) {
      const existing = byStore.get(row.storeCode);
      if (existing) {
        existing.labels[candidate.variantId] = row.label;
      } else {
        byStore.set(row.storeCode, {
          storeCode: row.storeCode,
          storeName: row.storeName,
          labels: { [candidate.variantId]: row.label },
        });
      }
    }
  }
  return [...byStore.values()];
}

/** Overlay in-session Move To picks onto Compare All so a tab switch shows the latest clusters. */
export function applyMovesToCompareRows(
  rows: readonly CompareRow[],
  moves: StoreMoves | undefined,
): CompareRow[] {
  if (!moves) return [...rows];
  return rows.map((row) => {
    const labels = { ...row.labels };
    let changed = false;
    for (const [variantId, perStore] of Object.entries(moves)) {
      const pick = perStore?.[row.storeCode];
      if (typeof pick !== 'string') continue;
      if (labels[variantId] === pick) continue;
      labels[variantId] = pick;
      changed = true;
    }
    return changed ? { ...row, labels } : row;
  });
}

/** Case-insensitive match on store name, store code or any variant's cluster label. */
export function filterCompareRows(
  rows: readonly CompareRow[],
  query: string,
): CompareRow[] {
  const q = normalise(query);
  if (!q) return [...rows];
  return rows.filter((row) =>
    [row.storeName, row.storeCode, ...Object.values(row.labels)].some((field) =>
      normalise(field).includes(q),
    ),
  );
}

function presentLabel(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Move body for the destination cluster. Omit any label the assignments response did not return. */
export function storeMoveFromCluster(
  storeCode: string,
  cluster: StoreAssignmentCluster,
): StoreMove {
  const productLabel = presentLabel(cluster.productLabel);
  const performanceLabel = presentLabel(cluster.performanceLabel);
  const storeLabel = presentLabel(cluster.storeLabel);
  return {
    storeCode,
    ...(productLabel ? { productLabel } : {}),
    ...(performanceLabel ? { performanceLabel } : {}),
    ...(storeLabel ? { storeLabel } : {}),
  };
}

/** Cluster whose short label matches, when the variant returned it. */
export function findClusterByLabel(
  clusters: readonly StoreAssignmentCluster[],
  label: string | null | undefined,
): StoreAssignmentCluster | undefined {
  if (!label) return undefined;
  return clusters.find((cluster) => cluster.label === label);
}

/** Aggregate load state of several variants' entries, for the "Compare All" tab. */
export function compareLoadState(
  candidates: readonly ClusterResultCandidate[],
  entries: Readonly<Record<string, StoreAssignmentsEntry | undefined>>,
): { loading: boolean; failed: ClusterResultCandidate[]; ready: boolean } {
  const failed = candidates.filter((candidate) => {
    const entry = entries[candidate.variantId];
    return entry?.status === 'failed' && !entry.data;
  });
  const loading = candidates.some((candidate) => {
    const entry = entries[candidate.variantId];
    if (entry?.data) return false;
    const status = entry?.status;
    return status === undefined || status === 'idle' || status === 'loading';
  });
  return {
    loading: loading && failed.length === 0,
    failed,
    ready: !loading && failed.length === 0,
  };
}
