// Narrow subpath rather than the planning barrel: that barrel re-exports every planning component,
// which would drag AG Grid into Hindsight's bundle for the sake of two type declarations.
import type { FilterFieldConfig, HierarchyScopeEntry } from '@modules/planning/types';
import { decodeIaString } from '@shared/utils';
import { FILTER_STRIP_VISIBLE_CHIPS, type FilterStripGroup } from '../types/filterStrip';

/**
 * Product-dimension cascaded fields, in the order the backend authored them.
 *
 * Mirrors planning's `productCascadedFields`, kept local so the strip does not depend on the
 * Create Plan wizard's service layer.
 */
function productFields(fields: readonly FilterFieldConfig[]): FilterFieldConfig[] {
  return fields.filter(
    (field) => field.dimension === 'product' && field.type === 'cascaded',
  );
}

/**
 * Selected values are stored as opaque backend ids. `decodeIaString` turns the `__ia_char_*`
 * escapes back into real characters (`__ia_char_03` → `/`) without splitting the id, which would
 * corrupt it. Non-ASCII values such as `Weiß` pass through untouched.
 */
function toValues(selected: readonly string[]) {
  return selected.map((id) => ({ id, label: decodeIaString(id) }));
}

/**
 * Joins filter config to a plan's hierarchy scope.
 *
 * Config drives label, order, and the mandatory flag. A level the plan selected nothing for is
 * omitted — the strip only shows chosen hierarchy. Any scope entry whose `levelNo` is missing
 * from config is appended afterwards using its own `levelName`, so a level the backend starts
 * returning before config catches up still appears when it has values.
 */
export function toFilterStripGroups(
  fields: readonly FilterFieldConfig[],
  scope: readonly HierarchyScopeEntry[],
): FilterStripGroup[] {
  const byLevel = new Map(scope.map((entry) => [entry.levelNo, entry]));
  const configured = productFields(fields);
  const seen = new Set(configured.map((field) => field.key));

  const groups: FilterStripGroup[] = [];
  for (const field of configured) {
    const entry = byLevel.get(field.key);
    const selected = entry?.selectedValues ?? [];
    if (selected.length === 0) continue;
    groups.push({
      key: field.key,
      label: field.label.length > 0 ? field.label : (entry?.levelName ?? field.key),
      mandatory: field.mandatory,
      values: toValues(selected),
    });
  }

  for (const entry of scope) {
    if (seen.has(entry.levelNo) || entry.selectedValues.length === 0) continue;
    seen.add(entry.levelNo);
    groups.push({
      key: entry.levelNo,
      label: entry.levelName.length > 0 ? entry.levelName : entry.levelNo,
      mandatory: false,
      values: toValues(entry.selectedValues),
    });
  }

  return groups;
}

/** How many of a group's values the vendor collapses behind its `+N` chip. */
export function hiddenValueCount(group: FilterStripGroup): number {
  return Math.max(0, group.values.length - FILTER_STRIP_VISIBLE_CHIPS);
}

/** Vendor `FiltersStrip` tag shape. Groups with no selected values are left out. */
export function toFilterTags(groups: readonly FilterStripGroup[]) {
  return groups
    .filter((group) => group.values.length > 0)
    .map((group) => ({
      id: group.key,
      label: group.label,
      required: group.mandatory,
      values: group.values.map((value) => ({ id: value.id, label: value.label })),
    }));
}

export interface FilterStripSummaryLabels {
  /** Marks a mandatory group in text, since the red asterisk alone conveys nothing non-visually. */
  required: string;
  /** Stands in for a group with no selected values. */
  none: string;
}

/**
 * A flat, readable sentence naming every group, whether it is mandatory, and *all* of its values.
 *
 * The vendor's `+N` popover shows at most five of the hidden values and cannot be reached by
 * keyboard, so this is the only place the full selection is available to assistive technology.
 */
export function summarizeFilterStrip(
  groups: readonly FilterStripGroup[],
  labels: FilterStripSummaryLabels,
): string {
  return groups
    .map((group) => {
      const name = group.mandatory ? `${group.label} (${labels.required})` : group.label;
      const values =
        group.values.length > 0
          ? group.values.map((value) => value.label).join(', ')
          : labels.none;
      return `${name}: ${values}`;
    })
    .join('. ');
}
