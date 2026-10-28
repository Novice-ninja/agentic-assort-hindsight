import { getFilterConfig } from '@modules/planning/api/getFilters';
import type { FilterFieldConfig } from '@modules/planning/types';

/** Session key for the one filter-config read this tab needs. Not plan-scoped. */
export const FILTER_MANDATORY_STORAGE_KEY = 'filterStrip:config';

const STORAGE_VERSION = 1;

interface StoredFilterMandatory {
  version: number;
  mandatory: Record<string, boolean>;
}

let inFlight: Promise<ReadonlyMap<string, boolean>> | null = null;

function productCascadedFields(
  fields: readonly FilterFieldConfig[],
): FilterFieldConfig[] {
  return fields.filter(
    (field) => field.dimension === 'product' && field.type === 'cascaded',
  );
}

function toMandatoryMap(
  fields: readonly FilterFieldConfig[],
): ReadonlyMap<string, boolean> {
  return new Map(
    productCascadedFields(fields).map((field) => [field.key, field.mandatory === true]),
  );
}

function parseStored(raw: string): ReadonlyMap<string, boolean> | null {
  try {
    const parsed = JSON.parse(raw) as Partial<StoredFilterMandatory>;
    if (
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.mandatory !== 'object' ||
      parsed.mandatory === null
    ) {
      return null;
    }
    const entries = Object.entries(parsed.mandatory).filter(
      (entry): entry is [string, boolean] => typeof entry[1] === 'boolean',
    );
    return new Map(entries);
  } catch {
    return null;
  }
}

/** The config already read in this tab, or `null` when the API still has to run. */
export function readStoredFilterMandatory(): ReadonlyMap<string, boolean> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(FILTER_MANDATORY_STORAGE_KEY);
    if (raw === null) return null;
    const parsed = parseStored(raw);
    if (parsed === null) window.sessionStorage.removeItem(FILTER_MANDATORY_STORAGE_KEY);
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredFilterMandatory(mandatory: ReadonlyMap<string, boolean>): void {
  if (typeof window === 'undefined') return;
  const payload: StoredFilterMandatory = {
    version: STORAGE_VERSION,
    mandatory: Object.fromEntries(mandatory),
  };
  try {
    window.sessionStorage.setItem(FILTER_MANDATORY_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or private mode — the in-memory promise still serves this page */
  }
}

/**
 * `GET /v1/filters/config` once per tab.
 *
 * A stored entry resolves without a request. Concurrent callers share one in-flight promise.
 * A failure is kept on that promise so a later mount does not fire the endpoint again.
 */
export function loadFilterMandatoryOnce(): Promise<ReadonlyMap<string, boolean>> {
  const stored = readStoredFilterMandatory();
  if (stored !== null) return Promise.resolve(stored);
  if (inFlight === null) {
    inFlight = getFilterConfig().then((config) => {
      const mandatory = toMandatoryMap(config.fields);
      writeStoredFilterMandatory(mandatory);
      return mandatory;
    });
  }
  return inFlight;
}

/** Drops the in-memory promise so tests can isolate a later call. Session storage is left as-is. */
export function resetFilterMandatoryRequest(): void {
  inFlight = null;
}
