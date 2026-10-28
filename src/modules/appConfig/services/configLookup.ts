import type {
  ComponentConfig,
  FilterFieldConfig,
  GlobalConfig,
  ModuleConfig,
  TabConfig,
  ViewConfig,
  ViewGroupConfig,
} from '../types';

/**
 * Pure reads over the config tree. Every lookup tolerates a missing branch and returns
 * `undefined` or an empty list, because the config is authored on the backend: a view must
 * degrade to its own defaults rather than throw when a key it expected is not there.
 *
 * Shared empty results are reused so a caller can safely compare identities (and memoise on
 * them) instead of getting a fresh array on every read.
 */
const NO_TABS: readonly TabConfig[] = [];
const NO_FILTER_FIELDS: readonly FilterFieldConfig[] = [];
const NO_VIEW_MODES: readonly string[] = [];

export function getModuleConfig(
  config: GlobalConfig,
  moduleKey: string,
): ModuleConfig | undefined {
  return config.modules[moduleKey];
}

export function getViewConfig(
  config: GlobalConfig,
  moduleKey: string,
  viewKey: string,
): ViewConfig | undefined {
  return getModuleConfig(config, moduleKey)?.views?.[viewKey];
}

export function getViewGroupConfig(
  config: GlobalConfig,
  moduleKey: string,
  viewGroupKey: string,
): ViewGroupConfig | undefined {
  return getModuleConfig(config, moduleKey)?.viewGroups?.[viewGroupKey];
}

export function getComponentConfig(
  config: GlobalConfig,
  moduleKey: string,
  viewKey: string,
  componentKey: string,
): ComponentConfig | undefined {
  return getViewConfig(config, moduleKey, viewKey)?.components?.[componentKey];
}

/** Tabs of a view (e.g. the plan history panel), in authored order. */
export function getViewTabs(
  config: GlobalConfig,
  moduleKey: string,
  viewKey: string,
): readonly TabConfig[] {
  return getViewConfig(config, moduleKey, viewKey)?.tabs ?? NO_TABS;
}

/** Tabs of a view group (e.g. Hindsight's overview / by item / by attribute). */
export function getViewGroupTabs(
  config: GlobalConfig,
  moduleKey: string,
  viewGroupKey: string,
): readonly TabConfig[] {
  return getViewGroupConfig(config, moduleKey, viewGroupKey)?.tabs ?? NO_TABS;
}

export function getViewModes(
  config: GlobalConfig,
  moduleKey: string,
  viewKey: string,
): readonly string[] {
  return getViewConfig(config, moduleKey, viewKey)?.viewModes ?? NO_VIEW_MODES;
}

/** The component that renders a tab, which is the tab's own key unless one is declared. */
export function getTabComponentKey(tab: TabConfig): string {
  return tab.componentKey ?? tab.key;
}

export interface FilterScope {
  module: string;
  view?: string;
  component?: string;
}

/**
 * Filter fields in effect for a scope, where the nearest declaration wins: a component's own
 * filters, else its view's, else the module's. That is how the authored config reads — Hindsight
 * declares one season filter at module level and only widgets that need something different
 * (e.g. multi-season trend) restate it.
 */
export function resolveFilterFields(
  config: GlobalConfig,
  scope: FilterScope,
): readonly FilterFieldConfig[] {
  const module = getModuleConfig(config, scope.module);
  if (module === undefined) return NO_FILTER_FIELDS;

  const view = scope.view === undefined ? undefined : module.views?.[scope.view];
  const component =
    scope.component === undefined ? undefined : view?.components?.[scope.component];

  return (
    component?.filters?.fields ?? view?.filters?.fields ?? module.filters?.fields ?? NO_FILTER_FIELDS
  );
}
