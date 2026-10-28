import { useCallback, useMemo, useState } from 'react';
import {
  METRIC_FILTER_KEY,
  resolveMetricFilter,
  type MetricFilterOption,
} from '../services';
import { useComponentConfig } from './useAppConfig';
import { useMetricCatalogue } from './useMetricConfig';

export interface MetricFilterScope {
  module: string;
  view: string;
  component: string;
}

export interface MetricFilter {
  options: MetricFilterOption[];
  multi: boolean;
  /** Selected metric keys — exact `metricKey` values from metrics-config / options. */
  selected: string[];
  select: (values: string[]) => void;
  /** True when no placement-matched metrics remain, so the control can render disabled rather than empty. */
  disabled: boolean;
}

/**
 * A component's metric dropdown: options filtered by `component.metricKeys` containing
 * metrics-config `uiComponent`, labels from `displayValue`, values from `metricKey`
 * (sent as-is on payloads). Pass `activePlacement` to narrow to one allowlisted placement
 * (e.g. charts-weekly vs charts-monthly).
 */
export function useMetricFilter(
  scope: MetricFilterScope,
  controlKey: string = METRIC_FILTER_KEY,
  activePlacement?: string,
): MetricFilter {
  const component = useComponentConfig(scope.module, scope.view, scope.component);
  const catalogue = useMetricCatalogue();
  const [chosen, setChosen] = useState<string[] | null>(null);

  const { options, multi, defaultSelection } = useMemo(
    () => resolveMetricFilter(component, catalogue, controlKey, activePlacement),
    [component, catalogue, controlKey, activePlacement],
  );

  const selected = useMemo(() => {
    const offered = new Set(options.map((option) => option.value));
    const source = chosen === null ? defaultSelection : chosen;
    const kept = source.filter((value) => offered.has(value));
    if (kept.length > 0) return kept;
    if (options.length === 0) return [];
    if (defaultSelection.some((value) => offered.has(value))) {
      return defaultSelection.filter((value) => offered.has(value));
    }
    return [options[0].value];
  }, [chosen, defaultSelection, options]);

  const select = useCallback((values: string[]) => {
    setChosen(values);
  }, []);

  return { options, multi, selected, select, disabled: options.length === 0 };
}
