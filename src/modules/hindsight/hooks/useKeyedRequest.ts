import { useCallback, useEffect, useRef, useState } from 'react';
import type { LoadStatus } from '@shared/types';
import { useFlooringScope } from '../priority/flooringScope';

export interface KeyedRequestResult<T> {
  data: T;
  status: LoadStatus;
  retry: () => void;
}

/**
 * Generic hook for a fetch keyed by a string of the request's parameters.
 *
 * - A null key means "nothing to ask for" — skips entirely and stays idle.
 * - `enabled` gates the request so a tab that is not visible pays nothing.
 * - Duplicate renders and React StrictMode double-invokes fire one request because the
 *   in-flight key ref guards the entry.
 * - A slow reply for an abandoned key is discarded via the latest-key ref.
 * - `retry()` re-fires the latest key regardless of what is in flight.
 */
export function useKeyedRequest<T>(
  requestKey: string | null,
  fetcher: () => Promise<T>,
  initial: T,
  enabled = true,
): KeyedRequestResult<T> {
  const {revision} = useFlooringScope();
  const key = requestKey === null ? null : `${requestKey}|flooring-scope:${revision}`;
  const [data, setData] = useState<T>(initial);
  const [status, setStatus] = useState<LoadStatus>('idle');

  const inFlightKeyRef = useRef<string | null>(null);
  const latestKeyRef = useRef<string | null>(null);
  const settledKeyRef = useRef<string | null>(null);

  // When the key changes while the hook is active, reset to initial so stale data from a
  // previous key never lingers in the UI while the new request is in flight — mirrors the
  // old Redux pending behaviour that cleared rows on the thunk's pending action.
  useEffect(() => {
    if (enabled && key !== null && key !== settledKeyRef.current) {
      setData(initial);
      setStatus('loading');
    }
  // `initial` is excluded: it is a stable default the caller never changes between renders.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const execute = useCallback(async () => {
    if (key === null) return;
    if (inFlightKeyRef.current === key) return;

    inFlightKeyRef.current = key;
    latestKeyRef.current = key;
    setStatus('loading');

    try {
      const result = await fetcher();
      if (latestKeyRef.current !== key) return;
      settledKeyRef.current = key;
      setData(result);
      setStatus('succeeded');
    } catch {
      if (latestKeyRef.current !== key) return;
      settledKeyRef.current = key;
      setData(initial);
      setStatus('failed');
    } finally {
      if (inFlightKeyRef.current === key) {
        inFlightKeyRef.current = null;
      }
    }
  // `initial` is excluded: it is a stable default the caller never changes between renders.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, fetcher]);

  useEffect(() => {
    if (enabled) void execute();
  }, [enabled, execute]);

  const retry = useCallback(() => {
    inFlightKeyRef.current = null;
    void execute();
  }, [execute]);

  return { data, status, retry };
}
