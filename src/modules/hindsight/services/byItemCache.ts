import { appendUniqueByKey, BY_ITEM_CACHE_TTL_MS } from './byItemPaging';
import type { ByItemRecommendationFilter, ByItemTableRow, VisualViewItem } from '../types';

const DB_NAME = 'hindsight-by-item';
const DB_VERSION = 1;

export type ByItemCacheStore = 'visual' | 'table';

export interface ByItemCachePage<T> {
  sourceKey: string;
  items: T[];
  cursor: string;
  hasMore: boolean;
  /** Epoch ms when this sourceKey was first written. Append/patch keep the original. */
  writtenAt?: number;
}

export interface ByItemSourceKeyParams {
  planCode: string;
  seasonCode: number;
  planSeasonCode?: number | null;
  compareKey?: string;
  kpisKey?: string;
  recommendation: ByItemRecommendationFilter | string;
  metric?: string;
  /** Serialized hierarchy scope — changes invalidate the table cache. */
  hierarchyKey?: string;
}

/**
 * One key per plan/season/filter set. Visual and table stores can share the string; table
 * adds `metric` so a metric change does not reuse the other view's page.
 */
export function byItemSourceKey({
  planCode,
  seasonCode,
  planSeasonCode,
  compareKey = '',
  kpisKey = '',
  recommendation,
  metric = '',
  hierarchyKey = '',
}: ByItemSourceKeyParams): string {
  return [
    planCode,
    String(seasonCode),
    planSeasonCode ?? '',
    compareKey,
    kpisKey,
    metric,
    recommendation,
    hierarchyKey,
  ].join(':');
}

/** False when `writtenAt` is missing (pre-TTL records) or the page is older than the TTL. */
export function isByItemCacheFresh(
  page: ByItemCachePage<unknown> | undefined,
  now: number = Date.now(),
  ttlMs: number = BY_ITEM_CACHE_TTL_MS,
): boolean {
  if (page === undefined) return false;
  if (typeof page.writtenAt !== 'number') return false;
  return now - page.writtenAt < ttlMs;
}

export interface ByItemCachePagination {
  cursor: string;
  hasMore: boolean;
}

type MemoryBucket = Map<string, ByItemCachePage<unknown>>;

const memory: Record<ByItemCacheStore, MemoryBucket> = {
  visual: new Map(),
  table: new Map(),
};

let dbPromise: Promise<IDBDatabase> | undefined;

function canUseIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('visual')) {
        db.createObjectStore('visual', { keyPath: 'sourceKey' });
      }
      if (!db.objectStoreNames.contains('table')) {
        db.createObjectStore('table', { keyPath: 'sourceKey' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = undefined;
      reject(request.error ?? new Error('IndexedDB open failed'));
    };
  });
  return dbPromise;
}

function fromMemory<T>(store: ByItemCacheStore, sourceKey: string): ByItemCachePage<T> | undefined {
  return memory[store].get(sourceKey) as ByItemCachePage<T> | undefined;
}

function toMemory<T>(store: ByItemCacheStore, page: ByItemCachePage<T>): void {
  memory[store].set(page.sourceKey, page as ByItemCachePage<unknown>);
}

function dropMemory(store: ByItemCacheStore, sourceKey: string): void {
  memory[store].delete(sourceKey);
}

/** JSON clone so IndexedDB/memory never share identity with Redux-frozen rows. */
export function cloneByItemCacheItems<T>(items: readonly T[]): T[] {
  return items.map((item) => JSON.parse(JSON.stringify(item)) as T);
}

/**
 * Drops in-memory pages so a test cannot leak articles from one plan into the next.
 * IndexedDB is not used in jsdom, so this is the whole cache under test.
 */
export function resetByItemCache(): void {
  memory.visual.clear();
  memory.table.clear();
}

let flushPromise: Promise<void> | undefined;

async function closeDb(): Promise<void> {
  const existing = dbPromise;
  dbPromise = undefined;
  if (existing === undefined) return;
  try {
    const db = await existing;
    db.close();
  } catch {
    /* Open failed; nothing to close. */
  }
}

function deleteDatabase(): Promise<void> {
  if (!canUseIndexedDb()) return Promise.resolve();
  return new Promise((resolve) => {
    try {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Drops the in-memory pages and deletes the `hindsight-by-item` IndexedDB.
 * Used by tests and any caller that must start from a cold cache.
 */
export async function flushByItemCache(): Promise<void> {
  if (flushPromise !== undefined) return flushPromise;
  flushPromise = (async () => {
    resetByItemCache();
    await closeDb();
    await deleteDatabase();
  })().finally(() => {
    flushPromise = undefined;
  });
  return flushPromise;
}

export function visualItemCacheKey(item: VisualViewItem): string {
  const article = item.product.article;
  return article !== undefined && article.length > 0 ? article : item.product.id;
}

export function tableRowCacheKey(row: ByItemTableRow): string {
  if (row.article !== undefined && row.article.length > 0) return row.article;
  const styleId = row.styleId?.value;
  return typeof styleId === 'string' && styleId.length > 0 ? styleId : '';
}

async function idbGet<T>(
  store: ByItemCacheStore,
  sourceKey: string,
): Promise<ByItemCachePage<T> | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(store, 'readonly').objectStore(store).get(sourceKey);
    request.onsuccess = () => resolve(request.result as ByItemCachePage<T> | undefined);
    request.onerror = () => reject(request.error);
  });
}

async function idbPut<T>(store: ByItemCacheStore, page: ByItemCachePage<T>): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(store, 'readwrite').objectStore(store).put(page);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function idbDelete(store: ByItemCacheStore, sourceKey: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(store, 'readwrite').objectStore(store).delete(sourceKey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function dropStalePage(store: ByItemCacheStore, sourceKey: string): void {
  dropMemory(store, sourceKey);
  if (!canUseIndexedDb()) return;
  void idbDelete(store, sourceKey);
}

/**
 * Synchronous read of the in-memory page. Used so a continuation can merge onto the
 * collection already loaded in this session without waiting on IndexedDB.
 * Expired pages are dropped immediately so a later bind cannot show stale articles.
 */
export function peekByItemCachePage<T>(
  store: ByItemCacheStore,
  sourceKey: string,
): ByItemCachePage<T> | undefined {
  const cached = fromMemory<T>(store, sourceKey);
  if (cached === undefined) return undefined;
  if (isByItemCacheFresh(cached)) return cached;
  dropStalePage(store, sourceKey);
  return undefined;
}

/**
 * Reads the cached page for this plan/season/filter key. The in-memory copy wins so a
 * remount is not blocked by IndexedDB; a cold start falls through to disk.
 * Expired pages are deleted and returned as a miss so the caller refetches from cursor `""`.
 */
export async function readByItemCachePage<T>(
  store: ByItemCacheStore,
  sourceKey: string,
): Promise<ByItemCachePage<T> | undefined> {
  const cached = fromMemory<T>(store, sourceKey);
  if (cached !== undefined) {
    if (isByItemCacheFresh(cached)) return cached;
    await deleteByItemCachePage(store, sourceKey);
    return undefined;
  }
  if (!canUseIndexedDb()) return undefined;
  try {
    const page = await idbGet<T>(store, sourceKey);
    if (page === undefined) return undefined;
    if (isByItemCacheFresh(page)) {
      toMemory(store, page);
      return page;
    }
    await deleteByItemCachePage(store, sourceKey);
    return undefined;
  } catch {
    const fallback = fromMemory<T>(store, sourceKey);
    if (isByItemCacheFresh(fallback)) return fallback;
    return undefined;
  }
}

/** Replaces the cached page. Bind the UI only after this resolves. */
export async function writeByItemCachePage<T>(
  store: ByItemCacheStore,
  page: ByItemCachePage<T>,
): Promise<ByItemCachePage<T>> {
  const next: ByItemCachePage<T> = {
    ...page,
    items: cloneByItemCacheItems(page.items),
    writtenAt: page.writtenAt ?? Date.now(),
  };
  toMemory(store, next);
  if (canUseIndexedDb()) {
    try {
      await idbPut(store, next);
    } catch {
      /* Memory already holds the page, which is enough to bind. */
    }
  }
  return next;
}

/** Appends a fetched page onto the cache, then returns the full cached collection. */
export async function appendByItemCachePage<T>(
  store: ByItemCacheStore,
  sourceKey: string,
  incoming: readonly T[],
  pagination: ByItemCachePagination,
  keyOf: (item: T) => string,
  /**
   * Page already loaded for this cursor. Prefer this over a fresh read: a TTL expiry
   * during the round trip must not replace the first page with only the new rows.
   */
  base?: ByItemCachePage<T>,
): Promise<ByItemCachePage<T>> {
  const existing =
    base ??
    fromMemory<T>(store, sourceKey) ??
    (await readByItemCachePage<T>(store, sourceKey)) ?? {
      sourceKey,
      items: [],
      cursor: '',
      hasMore: false,
    };
  return writeByItemCachePage(store, {
    sourceKey,
    items: appendUniqueByKey(existing.items, incoming, keyOf),
    cursor: pagination.cursor,
    hasMore: pagination.hasMore,
    writtenAt: existing.writtenAt,
  });
}

/**
 * Upserts bound UI items onto an existing cache page without changing cursor/hasMore.
 *
 * Only replaces articles already on the page. New keys are ignored — otherwise a stale
 * effect after an all→keep switch can merge the previous filter's rows into keep/drop.
 */
export async function patchByItemCacheItems<T>(
  store: ByItemCacheStore,
  sourceKey: string,
  incoming: readonly T[],
  keyOf: (item: T) => string,
): Promise<ByItemCachePage<T> | undefined> {
  const existing =
    fromMemory<T>(store, sourceKey) ?? (await readByItemCachePage<T>(store, sourceKey));
  if (existing === undefined || incoming.length === 0) return existing;

  const indexByKey = new Map<string, number>();
  existing.items.forEach((item, index) => {
    const key = keyOf(item);
    if (key.length > 0) indexByKey.set(key, index);
  });

  let changed = false;
  const next = existing.items.slice();
  for (const item of incoming) {
    const key = keyOf(item);
    if (key.length === 0) continue;
    const at = indexByKey.get(key);
    if (at === undefined) continue;
    next[at] = item;
    changed = true;
  }

  if (!changed) return existing;
  return writeByItemCachePage(store, {
    ...existing,
    items: next,
    writtenAt: existing.writtenAt,
  });
}

/**
 * Walks every in-memory visual page. Used to apply a Keep/Drop to articles that are cached
 * but not currently bound, so the other view sees the same verdict.
 */
export function forEachCachedVisualItem(fn: (item: VisualViewItem) => void): void {
  memory.visual.forEach((page) => {
    (page.items as VisualViewItem[]).forEach(fn);
  });
}

/** Walks every in-memory table page. Same Keep/Drop purpose as `forEachCachedVisualItem`. */
export function forEachCachedTableRow(fn: (row: ByItemTableRow) => void): void {
  memory.table.forEach((page) => {
    (page.items as ByItemTableRow[]).forEach(fn);
  });
}

export async function deleteByItemCachePage(
  store: ByItemCacheStore,
  sourceKey: string,
): Promise<void> {
  dropMemory(store, sourceKey);
  if (!canUseIndexedDb()) return;
  try {
    await idbDelete(store, sourceKey);
  } catch {
    /* The in-memory copy is already gone. */
  }
}
