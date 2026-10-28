import type {
  ComponentConfig,
  FilterControlConfig,
  MetricCatalogue,
} from '../types';
import { getMetricDropdownOptions, type MetricFilterOption } from './metricDropdownOptions';

export type { MetricFilterOption } from './metricDropdownOptions';

/** Key a widget's metric dropdown is authored under in a component's filters. */
export const METRIC_FILTER_KEY = 'metricFilter';

export interface MetricFilterConfig {
  /** The metrics the control offers, in catalogue order. */
  options: MetricFilterOption[];
  multi: boolean;
  /** What is selected before the user touches the control. Empty when nothing resolves. */
  defaultSelection: string[];
}

const NO_SELECTION: string[] = [];
const EMPTY_FILTER: MetricFilterConfig = {
  options: [],
  multi: false,
  defaultSelection: NO_SELECTION,
};

/**
 * A component's filter control, looked up by the key the component identifies it with.
 *
 * Both authored forms are accepted: a control keyed by name (`filters: { metricFilter: {…} }`) and
 * an entry in the `fields` list whose `key` matches. The two say the same thing, and which one a
 * component uses is an authoring detail its consumer should not have to know.
 */
export function getFilterControl(
  component: ComponentConfig | undefined,
  controlKey: string,
): FilterControlConfig | undefined {
  const filters = component?.filters;
  if (filters === undefined) return undefined;

  const named = filters[controlKey];
  if (named !== undefined && !Array.isArray(named)) return named;

  const field = filters.fields?.find((candidate) => candidate.key === controlKey);
  return field === undefined ? undefined : { multi: field.multi, default: field.default };
}

/**
 * First option when the authored default is not in the dropdown list. Avoids a blank selected
 * label while options remain.
 */
function fallbackSelection(options: readonly MetricFilterOption[], multi: boolean): string[] {
  if (options.length === 0) return NO_SELECTION;
  return multi ? options.map((option) => option.value) : [options[0].value];
}

/** Normalise `metricKeys` from config: trim, drop empties, preserve order. */
export function normaliseMetricKeys(metricKeys: readonly string[] | undefined): string[] {
  if (metricKeys === undefined) return [];
  return metricKeys.map((key) => key.trim()).filter((key) => key.length > 0);
}

/**
 * Picks the active metrics-config placement from a component's `metricKeys` for a time grain.
 * Prefers a key whose name contains the grain token (`week` / `month`); otherwise the first
 * allowlisted key. Never invents placement strings — only values from config.
 */
export function placementForTimeGrain(
  metricKeys: readonly string[] | undefined,
  grain: 'week' | 'month',
): string | undefined {
  const keys = normaliseMetricKeys(metricKeys);
  if (keys.length === 0) return undefined;
  if (keys.length === 1) return keys[0];

  const token = grain === 'month' ? 'month' : 'week';
  return keys.find((key) => key.toLowerCase().includes(token)) ?? keys[0];
}

/**
 * Resolves what a metric dropdown offers and starts on.
 *
 * Options: enabled metrics whose `uiComponent` is in the component's `metricKeys`.
 * When `activePlacement` is set and allowlisted, options are narrowed to that placement only.
 * Option `value` = API `metricKey`; option `label` = API `displayValue`.
 * Default selection matches the authored default against those values exactly; if missing,
 * falls back to the first option.
 */
export function resolveMetricFilter(
  component: ComponentConfig | undefined,
  catalogue: MetricCatalogue,
  controlKey: string = METRIC_FILTER_KEY,
  activePlacement?: string,
): MetricFilterConfig {
  const allowlist = normaliseMetricKeys(component?.metricKeys);
  const control = getFilterControl(component, controlKey);

  if (allowlist.length === 0) {
    return { ...EMPTY_FILTER, multi: control?.multi ?? false };
  }

  const placement = activePlacement?.trim();
  const placementKeys =
    placement !== undefined && placement.length > 0 && allowlist.includes(placement)
      ? [placement]
      : allowlist;

  const options = [...getMetricDropdownOptions(catalogue, placementKeys)];
  const multi = control?.multi ?? false;

  const authoredDefault = control?.default ?? component?.defaultMetricKey;
  if (options.length === 0) {
    return { options, multi, defaultSelection: NO_SELECTION };
  }

  if (authoredDefault === undefined) {
    return { options, multi, defaultSelection: fallbackSelection(options, multi) };
  }

  if (authoredDefault === '$all') {
    const all = options.map((option) => option.value);
    return { options, multi, defaultSelection: multi ? all : all.slice(0, 1) };
  }

  const match = options.find((option) => option.value === authoredDefault);

  return {
    options,
    multi,
    defaultSelection: match === undefined ? fallbackSelection(options, multi) : [match.value],
  };
}
