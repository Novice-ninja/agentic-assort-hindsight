export interface StorePerformanceIdentity { storeId: string; name: string; cluster: string; value: number }
export type StorePerformanceSortKey = 'name' | 'storeId' | 'cluster' | 'value';
/** Search the visible identity labels, including the displayed "Cluster B" wording. */
export function filterStoreRows<Row extends StorePerformanceIdentity>(rows: readonly Row[], query: string): Row[] {
  const needle = query.trim().toLowerCase();
  return rows.filter(store => `${store.name} ${store.storeId} ${store.cluster} Cluster ${store.cluster}`.toLowerCase().includes(needle));
}
export function sortStoreRows<Row extends StorePerformanceIdentity>(rows: readonly Row[], key: StorePerformanceSortKey, direction: 'asc' | 'desc'): Row[] {
  return [...rows].sort((a, b) => {
    const av = a[key], bv = b[key];
    const compared = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true });
    return (direction === 'asc' ? compared : -compared) || a.storeId.localeCompare(b.storeId);
  });
}
export function storeClusterCommentary(rows: readonly StorePerformanceIdentity[]): string {
  if (!rows.length) return 'Compare stores within clusters A–F, then open a store to inspect its KPIs.';
  const clusters = [...new Set(rows.map(store => store.cluster))].map(cluster => {
    const members = rows.filter(store => store.cluster === cluster);
    return { cluster, average: members.reduce((sum, store) => sum + store.value, 0) / members.length };
  }).sort((a, b) => b.average - a.average || a.cluster.localeCompare(b.cluster));
  return `Cluster ${clusters[0].cluster} has the highest store-average ST% at ${clusters[0].average.toFixed(1)}%; Cluster ${clusters.at(-1)!.cluster} has the lowest at ${clusters.at(-1)!.average.toFixed(1)}%. ${rows.length} stores are available for review.`;
}
