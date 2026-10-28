/**
 * The "Filters Applied" strip above the Hindsight tabs.
 *
 * Groups are the plan's selected hierarchy levels only, built when View Plan is clicked from the
 * plan row already in memory. Unselected levels are omitted. `planSeasonName` rides beside the
 * groups so the season chip never becomes a hierarchy level the charts treat as a dropdown.
 */

/** One selected value. `id` stays the opaque backend id; only `label` is ever rendered. */
export interface FilterStripValue {
  id: string;
  label: string;
}

export interface FilterStripGroup {
  /** The config field `key`, which is also the plan's `levelNo`. Stable render key. */
  key: string;
  label: string;
  mandatory: boolean;
  values: FilterStripValue[];
}

export interface FilterStripData {
  planCode: string;
  groups: FilterStripGroup[];
}

/**
 * Number of value chips shown before the rest collapse into a `+N` chip.
 *
 * The vendor `FiltersStrip` hardcodes this — it renders `values.slice(0, 2)` and then a
 * `+${values.length - 2}` chip. It is named here so the overflow count we describe to assistive
 * technology can never drift from what the vendor actually displays.
 */
export const FILTER_STRIP_VISIBLE_CHIPS = 2;

/**
 * Bump when `FilterStripGroup` changes shape. Entries written by an older version fail validation
 * on read and are discarded rather than rendered.
 */
export const FILTER_STRIP_SCHEMA_VERSION = 1;

/** The session-storage payload. Versioned and plan-scoped so entries can never cross plans. */
export interface StoredFilterStrip {
  version: number;
  planCode: string;
  groups: FilterStripGroup[];
  savedAt: string;
  /** Decoded `planSeasonName` from the plans list. Absent on entries written before it was stored. */
  planSeasonName?: string;
}

export function filterStripStorageKey(planCode: string): string {
  return `filterStrip:${planCode}`;
}

function isFilterStripValue(value: unknown): value is FilterStripValue {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<FilterStripValue>;
  return typeof candidate.id === 'string' && typeof candidate.label === 'string';
}

function isFilterStripGroup(value: unknown): value is FilterStripGroup {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<FilterStripGroup>;
  return (
    typeof candidate.key === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.mandatory === 'boolean' &&
    Array.isArray(candidate.values) &&
    candidate.values.every(isFilterStripValue)
  );
}

/**
 * Narrows an unknown parsed value to a stored payload for `planCode`, or returns `null`.
 *
 * Rejects anything from a different schema version or a different plan, so a corrupt, legacy, or
 * cross-plan entry is ignored and the strip stays on its skeleton.
 */
export function parseStoredFilterStrip(
  value: unknown,
  planCode: string,
): StoredFilterStrip | null {
  if (typeof value !== 'object' || value === null) return null;
  const candidate = value as Partial<StoredFilterStrip>;
  if (candidate.version !== FILTER_STRIP_SCHEMA_VERSION) return null;
  if (candidate.planCode !== planCode) return null;
  if (typeof candidate.savedAt !== 'string') return null;
  if (!Array.isArray(candidate.groups) || !candidate.groups.every(isFilterStripGroup)) {
    return null;
  }
  if (
    candidate.planSeasonName !== undefined &&
    typeof candidate.planSeasonName !== 'string'
  ) {
    return null;
  }

  return {
    version: candidate.version,
    planCode: candidate.planCode,
    savedAt: candidate.savedAt,
    groups: candidate.groups,
    ...(typeof candidate.planSeasonName === 'string' &&
    candidate.planSeasonName.length > 0
      ? { planSeasonName: candidate.planSeasonName }
      : {}),
  };
}
