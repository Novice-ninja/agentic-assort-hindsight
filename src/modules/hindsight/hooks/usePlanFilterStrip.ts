import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from '@shared/hooks';
import type { LoadStatus } from '@shared/types';
import { FLOORING_SCOPE_EVENT } from '../priority/flooringScope';
import {
  loadFilterMandatoryOnce,
  readStoredFilterMandatory,
} from '../services/filterStripConfig';
import {
  filterStripStorageKey,
  parseStoredFilterStrip,
  type FilterStripGroup,
  type StoredFilterStrip,
} from '../types/filterStrip';

export interface PlanFilterStripResult {
  groups: FilterStripGroup[];
  /** Decoded plan season, stored beside the hierarchy groups. */
  planSeasonName: string | undefined;
  status: LoadStatus;
}

const EMPTY_GROUPS: FilterStripGroup[] = [];

function withMandatory(
  groups: readonly FilterStripGroup[],
  mandatory: ReadonlyMap<string, boolean>,
): FilterStripGroup[] {
  return groups.map((group) => ({
    ...group,
    mandatory: mandatory.get(group.key) === true,
  }));
}

/**
 * The plan's applied filters, read from session storage for the tab's lifetime.
 *
 * The entry is written when View Plan is clicked, from the plan row already loaded on All Plans.
 * A miss stays on `loading`. A hit stays on `loading` until `GET /v1/filters/config` returns the
 * mandatory flags — that request runs once per tab — then the groups render. The season chip is
 * always mandatory and is not part of this payload.
 */
export function usePlanFilterStrip(planCode: string | undefined): PlanFilterStripResult {
  const storageKey = planCode === undefined ? null : filterStripStorageKey(planCode);

  const validate = useCallback(
    (raw: unknown): StoredFilterStrip | null =>
      planCode === undefined ? null : parseStoredFilterStrip(raw, planCode),
    [planCode],
  );

  const [cached, writeCached] = useSessionStorage<StoredFilterStrip>(storageKey, validate);
  useEffect(() => {
    const refresh = (event: Event) => {
      if ((event as CustomEvent).detail?.planCode !== planCode || !storageKey) return;
      try { const parsed = parseStoredFilterStrip(JSON.parse(window.sessionStorage.getItem(storageKey) ?? 'null'),planCode!); if(parsed)writeCached(parsed); } catch {}
    };
    window.addEventListener(FLOORING_SCOPE_EVENT,refresh);return()=>window.removeEventListener(FLOORING_SCOPE_EVENT,refresh);
  },[planCode,storageKey,writeCached]);
  const [mandatory, setMandatory] = useState<ReadonlyMap<string, boolean> | null>(() =>
    readStoredFilterMandatory(),
  );

  useEffect(() => {
    if (planCode === undefined || cached === null || mandatory !== null) return;
    let cancelled = false;
    loadFilterMandatoryOnce()
      .then((next) => {
        if (!cancelled) setMandatory(next);
      })
      .catch(() => {
        if (!cancelled) setMandatory(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, [planCode, cached, mandatory]);

  // A new array on every render would rebuild chartFilters and refetch the same chart.
  const groups = useMemo(() => {
    if (cached === null || mandatory === null) return EMPTY_GROUPS;
    return withMandatory(cached.groups, mandatory);
  }, [cached, mandatory]);

  if (planCode === undefined) {
    return { groups: EMPTY_GROUPS, planSeasonName: undefined, status: 'idle' };
  }

  if (cached === null || mandatory === null) {
    return { groups: EMPTY_GROUPS, planSeasonName: undefined, status: 'loading' };
  }

  return {
    groups,
    planSeasonName: cached.planSeasonName,
    status: 'succeeded',
  };
}
