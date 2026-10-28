import { decodeIaString } from '@shared/utils/format';
import {
  FILTER_SEARCH_DEBOUNCE_MS,
  FILTER_VALUES_PAGE_SIZE,
  type CreatePlanScopeEntry,
  type FilterFieldConfig,
  type FilterOption,
  type FilterValuesFilter,
  type FilterValuesRequest,
  type FilterValuesSelectAllFilter,
  type HierarchyLevelDef,
  type HierarchyScopeEntry,
  type ProductValue,
} from '../types';

export { FILTER_VALUES_PAGE_SIZE, FILTER_SEARCH_DEBOUNCE_MS };

/** Path segments are joined with four underscores — never split on `__`. */
export const FILTER_PATH_SEPARATOR = '____';

/**
 * Product-dimension cascaded fields only, in authored order.
 * Store/channel fields stay off Product Scope.
 */
export function productCascadedFields(
  fields: readonly FilterFieldConfig[],
): FilterFieldConfig[] {
  return fields.filter(
    (field) => field.dimension === 'product' && field.type === 'cascaded',
  );
}

/** Channel codes listed on the `channel` field of `/filters/config`. */
export function excludedChannelKeys(fields: readonly FilterFieldConfig[]): string[] {
  const channel = fields.find((field) => field.key === 'channel');
  const raw = channel?.exclude_channels;
  if (!Array.isArray(raw)) return [];
  return raw.filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
}

/** Maps filter config fields onto the hierarchy level shape the Product Scope UI already uses. */
export function toHierarchyLevels(
  fields: readonly FilterFieldConfig[],
): HierarchyLevelDef[] {
  return productCascadedFields(fields).map((field, order) => ({
    levelName: field.label,
    levelNo: field.key,
    order,
    isMultiSelection: field.multi_select,
    mandatory: field.mandatory,
  }));
}

export function toProductValue(option: FilterOption): ProductValue {
  return {
    label: option.label,
    value: option.value,
    styleCount: option.styleCount,
    imageurl: option.imageurl,
    path: option.path,
  };
}

export function isSelectAllFilter(
  filter: FilterValuesFilter,
): filter is FilterValuesSelectAllFilter {
  return 'select_all' in filter && filter.select_all === true;
}

/**
 * Ancestor selections as `/filters/values` filter clauses.
 * Select All emits `{ select_all, search?, except_search?, except?, include? }` and never mixes
 * with `operator`/`values`.
 */
export function toFilterValuesFilters(
  upstream: readonly HierarchyScopeEntry[],
): FilterValuesFilter[] {
  const filters: FilterValuesFilter[] = [];
  for (const entry of upstream) {
    if (entry.selectAll) {
      filters.push({ key: entry.levelNo, ...toSelectAllWireFields(entry) });
      continue;
    }
    if (entry.selectedValues.length > 0) {
      filters.push({
        key: entry.levelNo,
        operator: 'in',
        values: [...entry.selectedValues],
      });
    }
  }
  return filters;
}

/** Stable cache / race key for a values request. */
export function serializeFilterValuesKey(
  attributes: readonly string[],
  filters: readonly FilterValuesFilter[],
  snapshotId: string,
  search = '',
  offset = 0,
): string {
  const attrs = [...attributes].sort().join(',');
  const filterPart = [...filters]
    .map((filter) => {
      if (isSelectAllFilter(filter)) {
        const except = [...(filter.except ?? [])].sort().join('|');
        const searchNeedles = [...(filter.search ?? [])].sort().join('|');
        const exceptSearch = [...(filter.except_search ?? [])].sort().join('|');
        const include = [...(filter.include ?? [])].sort().join('|');
        return `${filter.key}:select_all=${except}::q=${searchNeedles}::xs=${exceptSearch}::i=${include}`;
      }
      const values = [...filter.values].sort().join('|');
      return `${filter.key}:${filter.operator}=${values}`;
    })
    .sort()
    .join(';');
  return `${snapshotId}::${attrs}::${filterPart}::s=${search}::o=${offset}`;
}

export function buildFilterValuesRequest(args: {
  attributes: readonly string[];
  filters: readonly FilterValuesFilter[];
  snapshotId: string;
  search?: string;
  limit?: number;
  offset?: number;
}): FilterValuesRequest {
  const search = args.search?.trim();
  const limit = args.limit;
  const request: FilterValuesRequest = {
    attributes: [...args.attributes],
    filters: [...args.filters],
    snapshot_id: args.snapshotId,
  };
  if (search) request.search = search;
  if (limit !== undefined && limit > 0) {
    request.limit = limit;
    request.offset = args.offset ?? 0;
  }
  return request;
}

/** Append page values to existing, deduplicating by `value` while preserving order. */
export function mergeFilterValuesPage(
  existing: readonly ProductValue[],
  incoming: readonly ProductValue[],
): ProductValue[] {
  const seen = new Set(existing.map((v) => v.value));
  const merged = [...existing];
  for (const item of incoming) {
    if (!seen.has(item.value)) {
      seen.add(item.value);
      merged.push(item);
    }
  }
  return merged;
}

/** True when the loaded list has not reached the server total. */
export function hasMoreFilterValues(
  loadedCount: number,
  total: number | undefined,
  lastPageSize: number,
): boolean {
  if (total !== undefined) return loadedCount < total;
  return lastPageSize >= FILTER_VALUES_PAGE_SIZE;
}

export function lastPageSizeFromLoaded(loadedCount: number): number {
  if (loadedCount <= 0) return 0;
  return loadedCount % FILTER_VALUES_PAGE_SIZE || FILTER_VALUES_PAGE_SIZE;
}

export function uniqueNeedles(needles: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const needle of needles) {
    const trimmed = needle.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}

function uniqueIds(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function sortedJoin(values: readonly string[]): string {
  return [...values].sort().join('|');
}

function withoutNeedle(needles: readonly string[], needle: string): string[] {
  const key = needle.trim().toLowerCase();
  return uniqueNeedles(needles).filter((item) => item.toLowerCase() !== key);
}

function toggleId(ids: readonly string[], id: string): string[] {
  const next = new Set(ids);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return [...next];
}

/** Empty `search` and `exceptSearch` means the whole parent universe. */
export function isUniverseSelectAll(entry: HierarchyScopeEntry | undefined): boolean {
  return (
    entry?.selectAll === true &&
    uniqueNeedles(entry.search ?? []).length === 0 &&
    uniqueNeedles(entry.exceptSearch ?? []).length === 0
  );
}

/** Committed Select All needles in authored order (trimmed, case-insensitive unique). */
export function committedSearchNeedles(entry: HierarchyScopeEntry | undefined): string[] {
  return uniqueNeedles(entry?.search ?? []);
}

/** Committed bulk-unselect needles in authored order (trimmed, case-insensitive unique). */
export function committedExceptSearchNeedles(
  entry: HierarchyScopeEntry | undefined,
): string[] {
  return uniqueNeedles(entry?.exceptSearch ?? []);
}

/** Option B: decoded label contains any committed needle (case-insensitive). */
export function matchesCommittedSearch(
  label: string,
  needles: readonly string[],
): boolean {
  const committed = uniqueNeedles(needles);
  if (committed.length === 0) return true;
  const haystack = decodeIaString(label).toLowerCase();
  return committed.some((needle) => haystack.includes(needle.toLowerCase()));
}

export type SelectAllWireFields = {
  select_all: true;
  search?: string[];
  except_search?: string[];
  except?: string[];
  include?: string[];
};

/**
 * Compact Form B fields. Omits empty arrays. Drops an id from `include` when
 * it also appears in `except`. A needle is never emitted in both `search` and
 * `except_search`.
 */
export function toSelectAllWireFields(entry: HierarchyScopeEntry): SelectAllWireFields {
  const search = uniqueNeedles(entry.search ?? []);
  const searchKeys = new Set(search.map((needle) => needle.toLowerCase()));
  const exceptSearch = uniqueNeedles(entry.exceptSearch ?? []).filter(
    (needle) => !searchKeys.has(needle.toLowerCase()),
  );
  const except = uniqueIds(entry.except ?? []);
  const exceptSet = new Set(except);
  const include = uniqueIds(entry.include ?? []).filter((id) => !exceptSet.has(id));
  const out: SelectAllWireFields = { select_all: true };
  if (search.length > 0) out.search = search;
  if (exceptSearch.length > 0) out.except_search = exceptSearch;
  if (except.length > 0) out.except = except;
  if (include.length > 0) out.include = include;
  return out;
}

export function isHierarchyLevelSelected(
  entry: HierarchyScopeEntry | undefined,
): boolean {
  if (!entry) return false;
  if (entry.selectAll) return true;
  return entry.selectedValues.length > 0;
}

export function applySelectAllUniverse(
  entry: Pick<HierarchyScopeEntry, 'levelName' | 'levelNo'>,
): HierarchyScopeEntry {
  return {
    levelName: entry.levelName,
    levelNo: entry.levelNo,
    selectedValues: [],
    selectAll: true,
    search: [],
    exceptSearch: [],
    except: [],
    include: [],
  };
}

function knownLabels(
  rows: readonly Pick<ProductValue, 'value' | 'label'>[],
): Map<string, string> {
  return new Map(rows.map((row) => [row.value, row.label]));
}

/**
 * Option B + B1. Empty needle → universe. Non-empty needle appends (OR) and
 * is removed from `exceptSearch` (undo bulk unselect).
 * Hand unticks whose label matches this needle are dropped — Select All
 * re-selects everything visible for that search, including a needle already
 * in `search` (it is not duplicated).
 * Universe Select All already covers every row, so a later search Select All
 * is a no-op unless it undoes an `exceptSearch` needle or a matching `except`.
 * Leftover Form A ticks that fall outside the matching set become `include`.
 */
export function applySelectAllSearch(
  current: HierarchyScopeEntry,
  needle: string,
  knownRows: readonly Pick<ProductValue, 'value' | 'label'>[] = [],
): HierarchyScopeEntry {
  const trimmed = needle.trim();
  if (!trimmed) return applySelectAllUniverse(current);

  const known = knownLabels(knownRows);
  const existingNeedles = uniqueNeedles(current.search ?? []);
  const exceptSearch = withoutNeedle(current.exceptSearch ?? [], trimmed);
  const undidExceptSearch =
    exceptSearch.length !== uniqueNeedles(current.exceptSearch ?? []).length;
  const except = current.selectAll
    ? idsNotMatchingNeedle(current.except ?? [], trimmed, known)
    : [];
  const exceptChanged = except.length !== uniqueIds(current.except ?? []).length;

  if (current.selectAll === true && existingNeedles.length === 0) {
    if (!undidExceptSearch && !exceptChanged) return current;
    return {
      ...current,
      selectedValues: [],
      selectAll: true,
      search: [],
      exceptSearch,
      except,
    };
  }

  const nextNeedles = uniqueNeedles([...existingNeedles, trimmed]);
  const leftoverInclude: string[] = [];
  if (!current.selectAll) {
    for (const id of current.selectedValues) {
      const label = known.get(id) ?? id;
      if (!matchesCommittedSearch(label, nextNeedles)) leftoverInclude.push(id);
    }
  }

  return {
    levelName: current.levelName,
    levelNo: current.levelNo,
    selectedValues: [],
    selectAll: true,
    search: nextNeedles,
    exceptSearch,
    except,
    include: uniqueIds([
      ...(current.selectAll ? (current.include ?? []) : leftoverInclude),
    ]),
  };
}

export function applyClearSelection(
  entry: Pick<HierarchyScopeEntry, 'levelName' | 'levelNo'>,
): HierarchyScopeEntry {
  return {
    levelName: entry.levelName,
    levelNo: entry.levelNo,
    selectedValues: [],
    selectAll: false,
    search: [],
    exceptSearch: [],
    except: [],
    include: [],
  };
}

/** Drop hand-unticks the user just re-selected. Match the id when no label is loaded. */
function idsNotMatchingNeedle(
  ids: readonly string[],
  needle: string,
  known: ReadonlyMap<string, string>,
): string[] {
  return uniqueIds(ids).filter((id) => {
    const label = known.get(id) ?? id;
    return !matchesCommittedSearch(label, [needle]);
  });
}

/**
 * Search-scoped Clear / Unselect All.
 * Empty needle wipes the level.
 * Form B — needle match against committed `search` is **exact** (trim +
 * case-insensitive), never substring. So Clear `"old-mens"` after Select All
 * `"old"` does **not** remove `"old"` from `search`.
 * - Exact needle in `search`, other needles remain → **move** it to `exceptSearch`
 *   (overlaps with remaining needles must stay unticked).
 * - Exact needle in `search` and it was the last one → leave Form B. Promote
 *   `include` to Form A `selectedValues` (or wipe if empty). Do not keep
 *   `select_all` + only `except_search` — that would mean universe minus the
 *   needle, which is not “undo my search Select All”.
 * - Different text (not an exact `search` needle) → append `exceptSearch` only.
 *   Keep `search` and `select_all` unchanged.
 * `include` wins over `except_search` while Form B stays on.
 * Form A: ids visible in the current search results are removed from `selectedValues`.
 */
export function applyDeselectAll(
  current: HierarchyScopeEntry,
  needle: string,
  knownRows: readonly Pick<ProductValue, 'value' | 'label'>[] = [],
): HierarchyScopeEntry {
  const trimmed = needle.trim();
  if (!trimmed) return applyClearSelection(current);

  if (!current.selectAll) {
    const visible = new Set(knownRows.map((row) => row.value));
    return {
      levelName: current.levelName,
      levelNo: current.levelNo,
      selectedValues: current.selectedValues.filter((id) => !visible.has(id)),
      selectAll: false,
      search: [],
      exceptSearch: [],
      except: [],
      include: [],
    };
  }

  const existingSearch = uniqueNeedles(current.search ?? []);
  const needleKey = trimmed.toLowerCase();
  const wasInSearch = existingSearch.some((item) => item.toLowerCase() === needleKey);
  const nextSearch = withoutNeedle(existingSearch, trimmed);
  const include = uniqueIds(current.include ?? []);

  // Last committed search Select All undone → Form A (includes only), not universe−needle.
  if (wasInSearch && nextSearch.length === 0) {
    if (include.length === 0) return applyClearSelection(current);
    return {
      levelName: current.levelName,
      levelNo: current.levelNo,
      selectedValues: include,
      selectAll: false,
      search: [],
      exceptSearch: [],
      except: [],
      include: [],
    };
  }

  const nextExceptSearch = uniqueNeedles([...(current.exceptSearch ?? []), trimmed]);
  const except = uniqueIds(current.except ?? []);

  if (
    nextSearch.length === 0 &&
    nextExceptSearch.length === 0 &&
    except.length === 0 &&
    include.length === 0
  ) {
    return applyClearSelection(current);
  }

  if (nextSearch.length === 0 && nextExceptSearch.length === 0 && except.length === 0) {
    return {
      levelName: current.levelName,
      levelNo: current.levelNo,
      selectedValues: include,
      selectAll: false,
      search: [],
      exceptSearch: [],
      except: [],
      include: [],
    };
  }

  return {
    levelName: current.levelName,
    levelNo: current.levelNo,
    selectedValues: [],
    selectAll: true,
    search: nextSearch,
    exceptSearch: nextExceptSearch,
    except,
    include,
  };
}

export function isRowSelected(
  entry: HierarchyScopeEntry | undefined,
  id: string,
  label: string,
): boolean {
  if (!entry) return false;
  if (!entry.selectAll) return entry.selectedValues.includes(id);
  if ((entry.except ?? []).includes(id)) return false;
  if ((entry.include ?? []).includes(id)) return true;
  if (matchesExceptSearch(label, entry.exceptSearch ?? [])) return false;
  return matchesCommittedSearch(label, entry.search ?? []);
}

/** True when the label matches a bulk-unselect needle. Empty list matches nothing. */
function matchesExceptSearch(label: string, needles: readonly string[]): boolean {
  const committed = uniqueNeedles(needles);
  if (committed.length === 0) return false;
  return matchesCommittedSearch(label, committed);
}

export function visibleSelectedIds(
  entry: HierarchyScopeEntry | undefined,
  rows: readonly Pick<ProductValue, 'value' | 'label'>[],
): string[] {
  if (!entry) return [];
  if (!entry.selectAll) return [...entry.selectedValues];
  return rows.filter((row) => isRowSelected(entry, row.value, row.label)).map((row) => row.value);
}

export function applyToggleSelection(
  current: HierarchyScopeEntry,
  id: string,
  multiSelect: boolean,
  label = id,
): HierarchyScopeEntry {
  if (current.selectAll) {
    const needles = uniqueNeedles(current.search ?? []);
    const excludedBySearch = matchesExceptSearch(label, current.exceptSearch ?? []);
    const inMatchingSet =
      !excludedBySearch && (needles.length === 0 || matchesCommittedSearch(label, needles));
    if (inMatchingSet) {
      return {
        ...current,
        selectedValues: [],
        except: toggleId(current.except ?? [], id),
        include: (current.include ?? []).filter((value) => value !== id),
      };
    }
    return {
      ...current,
      selectedValues: [],
      include: toggleId(current.include ?? [], id),
      except: (current.except ?? []).filter((value) => value !== id),
    };
  }

  const isDeselect = current.selectedValues.includes(id);
  if (!multiSelect) {
    return {
      ...current,
      selectAll: false,
      search: [],
      exceptSearch: [],
      except: [],
      include: [],
      selectedValues: isDeselect ? [] : [id],
    };
  }
  return {
    ...current,
    selectAll: false,
    search: [],
    exceptSearch: [],
    except: [],
    include: [],
    selectedValues: isDeselect
      ? current.selectedValues.filter((value) => value !== id)
      : [...current.selectedValues, id],
  };
}

export function sameScopeSelection(
  a: HierarchyScopeEntry,
  b: HierarchyScopeEntry,
): boolean {
  if (a.levelNo !== b.levelNo) return false;
  if (Boolean(a.selectAll) !== Boolean(b.selectAll)) return false;
  if (sortedJoin(a.except ?? []) !== sortedJoin(b.except ?? [])) return false;
  if (a.selectAll) {
    return (
      sortedJoin(uniqueNeedles(a.search ?? [])) ===
        sortedJoin(uniqueNeedles(b.search ?? [])) &&
      sortedJoin(uniqueNeedles(a.exceptSearch ?? [])) ===
        sortedJoin(uniqueNeedles(b.exceptSearch ?? [])) &&
      sortedJoin(a.include ?? []) === sortedJoin(b.include ?? [])
    );
  }
  return sortedJoin(a.selectedValues) === sortedJoin(b.selectedValues);
}

/**
 * Create-plan `hierarchyScope`: Form A (`selectedValues`) or Form B
 * (`select_all` + optional `search` / `except_search` / `except` / `include`).
 * Never mixes the two on one row. Omits levels with no selection.
 */
export function toCreatePlanHierarchyScope(
  scope: readonly HierarchyScopeEntry[],
): CreatePlanScopeEntry[] {
  const out: CreatePlanScopeEntry[] = [];
  for (const entry of scope) {
    if (!isHierarchyLevelSelected(entry)) continue;
    if (entry.selectAll) {
      out.push({
        levelName: entry.levelName,
        levelNo: entry.levelNo,
        ...toSelectAllWireFields(entry),
      });
      continue;
    }
    if (entry.selectedValues.length === 0) continue;
    out.push({
      levelName: entry.levelName,
      levelNo: entry.levelNo,
      selectedValues: [...entry.selectedValues],
    });
  }
  return out;
}

/** Split a filter `path` on `____` only. */
export function splitFilterPath(path: string): string[] {
  if (path.length === 0) return [];
  return path.split(FILTER_PATH_SEPARATOR);
}

/**
 * True when the option's path still sits under at least one selected parent value
 * (as a full path segment). Used for internal re-validation — not shown in the UI.
 */
export function optionBelongsUnderParents(
  path: string,
  parentValues: readonly string[],
): boolean {
  if (parentValues.length === 0) return true;
  const segments = new Set(splitFilterPath(path));
  return parentValues.some((value) => segments.has(value));
}
