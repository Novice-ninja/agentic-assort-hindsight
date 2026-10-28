/**
 * Ties a caller's signal to a deadline. `AbortSignal.any` would say this in one line, but it is
 * not available everywhere this bundle runs.
 *
 * Callers must `release()` in a `finally`, or a resolved request leaves its timer behind.
 */
export function withDeadline(signal: AbortSignal | undefined, ms: number) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ms);
  const forward = () => controller.abort();
  signal?.addEventListener('abort', forward);

  return {
    signal: controller.signal,
    release: () => {
      window.clearTimeout(timer);
      signal?.removeEventListener('abort', forward);
    },
  };
}
