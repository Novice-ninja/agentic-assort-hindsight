import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Session-storage state that never trusts what it reads.
 *
 * Differs from `useLocalStorage` in three ways that matter for persisting API-shaped payloads:
 * the caller supplies a validator so an entry from an older schema is discarded rather than
 * rendered; a rejected or unparseable entry is deleted on read; and every `sessionStorage` call is
 * guarded, so private-browsing and quota failures degrade to in-memory state instead of throwing.
 *
 * Passing `key: null` disables persistence entirely and keeps the value in memory.
 *
 * @param key    Storage key, or `null` to skip storage. Changing it re-reads immediately, which is
 *               how plan-scoped keys isolate one plan's data from the next.
 * @param parse  Narrows the parsed JSON, returning `null` to reject it.
 */
export function useSessionStorage<T>(
  key: string | null,
  parse: (raw: unknown) => T | null,
) {
  // Held in a ref so callers can pass an inline validator without re-reading on every render.
  const parseRef = useRef(parse);
  parseRef.current = parse;

  const read = useCallback((storageKey: string | null): T | null => {
    if (storageKey === null || typeof window === 'undefined') return null;

    let raw: string | null;
    try {
      raw = window.sessionStorage.getItem(storageKey);
    } catch {
      return null;
    }
    if (raw === null) return null;

    let parsed: T | null = null;
    try {
      parsed = parseRef.current(JSON.parse(raw) as unknown);
    } catch {
      parsed = null;
    }

    if (parsed === null) {
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        /* nothing more to do — the entry is already being ignored */
      }
    }
    return parsed;
  }, []);

  const [value, setValue] = useState<T | null>(() => read(key));

  // Re-read synchronously on key change so a new plan never renders the previous plan's entry.
  const lastKey = useRef(key);
  if (lastKey.current !== key) {
    lastKey.current = key;
    setValue(read(key));
  }

  const write = useCallback(
    (next: T | null) => {
      setValue(next);
      if (key === null || typeof window === 'undefined') return;
      try {
        if (next === null) window.sessionStorage.removeItem(key);
        else window.sessionStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* quota or private mode — the value stays in memory for this session */
      }
    },
    [key],
  );

  const clear = useCallback(() => write(null), [write]);

  useEffect(() => {
    if (key === null || typeof window === 'undefined') return;

    // Another tab writing the same key should not leave this one showing stale data.
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.sessionStorage || event.key !== key) return;
      setValue(read(key));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, read]);

  return [value, write, clear] as const;
}
