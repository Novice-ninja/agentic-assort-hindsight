import type {
  ComponentConfig,
  FilterControlConfig,
  GlobalConfig,
  SharedControlConfig,
} from '../types';
import { getFilterControl } from './metricFilter';

/** Key By Item / By Attribute recommendation dropdowns are authored under. */
export const RECOMMENDATION_FILTER_KEY = 'recommendation';

export interface ControlFilterOption {
  value: string;
  label: string;
}

export interface ControlFilterConfig {
  /** Options from the shared control (or empty when the source is missing). */
  options: ControlFilterOption[];
  multi: boolean;
  /** What is selected before the user touches the control. Empty when nothing resolves. */
  defaultSelection: string[];
}

const NO_SELECTION: string[] = [];
const NO_OPTIONS: ControlFilterOption[] = [];

/** Shared control looked up by key on `global.controls`. */
export function getSharedControl(
  config: GlobalConfig | undefined,
  controlKey: string,
): SharedControlConfig | undefined {
  return config?.controls?.[controlKey];
}

/**
 * Resolves which shared control a component filter points at: the authored
 * `componentSourceKey`, else the filter's own key (so `filters.recommendation` can mean
 * `controls.recommendation` without restating the source).
 */
export function resolveComponentSourceKey(
  control: FilterControlConfig | undefined,
  controlKey: string,
): string {
  return control?.componentSourceKey ?? controlKey;
}

/**
 * Resolves what a shared-control dropdown offers and starts on.
 *
 * Options always come from `global.controls[sourceKey]`. `multi` / `default` prefer the
 * component's filter entry when set, otherwise the shared control.
 */
export function resolveControlFilter(
  global: GlobalConfig | undefined,
  component: ComponentConfig | undefined,
  controlKey: string,
): ControlFilterConfig {
  const control = getFilterControl(component, controlKey);
  const sourceKey = resolveComponentSourceKey(control, controlKey);
  const shared = getSharedControl(global, sourceKey);
  const options = shared?.options?.map((option) => ({
    value: option.value,
    label: option.label,
  })) ?? NO_OPTIONS;
  const multi = control?.multi ?? shared?.multi ?? false;
  const authoredDefault = control?.default ?? shared?.default;

  if (authoredDefault === undefined || options.length === 0) {
    return { options, multi, defaultSelection: NO_SELECTION };
  }

  if (authoredDefault === '$all') {
    const all = options.map((option) => option.value);
    return { options, multi, defaultSelection: multi ? all : all.slice(0, 1) };
  }

  const match = options.find((option) => option.value === authoredDefault);
  return {
    options,
    multi,
    defaultSelection: match === undefined ? NO_SELECTION : [match.value],
  };
}
