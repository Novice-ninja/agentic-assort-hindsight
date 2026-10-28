import { useId as useReactId } from 'react';

/** Stable unique id for associating labels/descriptions (wraps React's useId). */
export function useId(prefix = 'aa'): string {
  const id = useReactId();
  return `${prefix}${id}`;
}

export function mergeIds(...ids: Array<string | undefined | false>): string | undefined {
  const filtered = ids.filter(Boolean) as string[];
  return filtered.length ? filtered.join(' ') : undefined;
}

export const visuallyHiddenClass = 'sr-only';
