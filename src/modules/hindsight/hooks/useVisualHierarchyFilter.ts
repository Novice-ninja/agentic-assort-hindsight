import { useCallback, useMemo, useState } from 'react';
import { useComponentConfig, useGlobalConfig } from '@modules/appConfig';
import type { LoadStatus } from '@shared/types';
import {
  buildParetoHierarchyChartFilters,
  buildVisualHierarchyChartFilters,
  DEFAULT_LEVEL_HIERARCHIES,
  lowestSelectedGroup,
  paretoFilterGroup,
  toDropdownOptions,
  type DropdownOption,
  type VisualHierarchyChartFilters,
} from '../services/visualHierarchy';
import { usePlanFilterStrip } from './usePlanFilterStrip';

export interface VisualHierarchyFilterScope {
  module: string;
  view: string;
  component: string;
}

export type VisualHierarchyFilterMode = 'default' | 'pareto';

export interface UseVisualHierarchyFilterOptions {
  /**
   * `pareto`: dropdown at the plan filter level (or second-last when at last/second-last),
   * `levelHierarchy` one level up, no `levelHierarchyValue`, select-all by default.
   */
  mode?: VisualHierarchyFilterMode;
}

export interface VisualHierarchyFilter {
  /** True when this component's config turns the dropdown on. */
  enabled: boolean;
  /** True when the dropdown should render (enabled and it has options). */
  visible: boolean;
  label: string;
  options: DropdownOption[];
  selected: string[];
  select: (values: string[]) => void;
  disabled: boolean;
  status: LoadStatus;
  /** Loaded successfully, with no hierarchy values to chart for the applied population. */
  empty: boolean;
  /**
   * Ready to spread into a charts request when `enabled` and the strip has a default option.
   * `null` when the toggle is off, or on but the strip/options are not ready yet.
   */
  chartFilters: VisualHierarchyChartFilters | null;
}

/**
 * A component's hierarchy dropdown: the lowest selected FilterStrip level, and the extra chart
 * filters that go with it. Regular + Promo and Pareto default to every option checked; other
 * charts default to the first option.
 *
 * When `hierarchyDropdownEnabled` is not true the hook stays idle — no strip fetch, no extras
 * on the chart request. Widgets must not spread `chartFilters` in that case.
 */
export function useVisualHierarchyFilter(
  scope: VisualHierarchyFilterScope,
  planCode: string | undefined,
  options: UseVisualHierarchyFilterOptions = {},
): VisualHierarchyFilter {
  const mode = options.mode ?? 'default';
  const component = useComponentConfig(scope.module, scope.view, scope.component);
  const global = useGlobalConfig();
  const levelHierarchies =
    global.hierarchy?.levelHierarchies ?? DEFAULT_LEVEL_HIERARCHIES;
  const enabled = component?.hierarchyDropdownEnabled === true;
  const selectAllByDefault =
    scope.component === 'regularPromoSales' || mode === 'pareto';
  const strip = usePlanFilterStrip(enabled ? planCode : undefined);
  const [chosen, setChosen] = useState<string[] | null>(null);

  const filterGroup = useMemo(() => {
    if (mode === 'pareto') {
      return paretoFilterGroup(strip.groups, levelHierarchies);
    }
    return lowestSelectedGroup(strip.groups);
  }, [mode, strip.groups, levelHierarchies]);

  const optionsList = useMemo(
    () => (filterGroup === null ? [] : toDropdownOptions(filterGroup)),
    [filterGroup],
  );
  const label = filterGroup?.label ?? '';

  const selected = useMemo(() => {
    const offered = new Set(optionsList.map((option) => option.value));
    const allValues = optionsList.map((option) => option.value);
    const source =
      chosen === null
        ? selectAllByDefault
          ? allValues
          : allValues.slice(0, 1)
        : chosen;
    const kept = source.filter((value) => offered.has(value));
    if (kept.length > 0) return kept;
    if (selectAllByDefault) return allValues;
    return allValues[0] === undefined ? [] : [allValues[0]];
  }, [chosen, optionsList, selectAllByDefault]);

  const select = useCallback((values: string[]) => {
    setChosen(values);
  }, []);

  const chartFilters = useMemo(() => {
    if (!enabled) return null;
    if (strip.status !== 'succeeded') return null;
    if (mode === 'pareto') {
      return buildParetoHierarchyChartFilters(strip.groups, selected, levelHierarchies);
    }
    return buildVisualHierarchyChartFilters(strip.groups, selected);
  }, [enabled, strip.status, strip.groups, selected, mode, levelHierarchies]);

  return {
    enabled,
    visible: enabled && optionsList.length > 0,
    label,
    options: optionsList,
    selected,
    select,
    disabled: optionsList.length === 0,
    status: enabled ? strip.status : 'idle',
    empty: enabled && strip.status === 'succeeded' && optionsList.length === 0,
    chartFilters,
  };
}
