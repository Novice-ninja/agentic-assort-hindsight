import { useCallback, useMemo, useState } from 'react';
import {
  RECOMMENDATION_FILTER_KEY,
  resolveControlFilter,
  type ControlFilterOption,
} from '../services';
import { useComponentConfig, useGlobalConfig } from './useAppConfig';

export interface ControlFilterScope {
  module: string;
  view: string;
  component: string;
}

export interface ControlFilter {
  options: ControlFilterOption[];
  multi: boolean;
  /** Values currently selected. */
  selected: string[];
  select: (values: string[]) => void;
}

/**
 * A component filter backed by a shared `global.controls` entry (via `componentSourceKey`).
 *
 * Selection stays "not chosen yet" until the user picks something, so a late-arriving config
 * can still seed the default — same pattern as `useMetricFilter`.
 */
export function useControlFilter(
  scope: ControlFilterScope,
  controlKey: string = RECOMMENDATION_FILTER_KEY,
): ControlFilter {
  const global = useGlobalConfig();
  const component = useComponentConfig(scope.module, scope.view, scope.component);
  const [chosen, setChosen] = useState<string[] | null>(null);

  const { options, multi, defaultSelection } = useMemo(
    () => resolveControlFilter(global, component, controlKey),
    [global, component, controlKey],
  );

  const selected = useMemo(() => {
    if (chosen === null) return defaultSelection;
    const offered = new Set(options.map((option) => option.value));
    return chosen.filter((value) => offered.has(value));
  }, [chosen, defaultSelection, options]);

  const select = useCallback((values: string[]) => {
    setChosen(values);
  }, []);

  return { options, multi, selected, select };
}
