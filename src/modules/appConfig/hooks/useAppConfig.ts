import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { isDev } from '@config/env';
import type { LoadStatus } from '@shared/types';
import {
  getComponentConfig,
  getModuleConfig,
  getViewConfig,
  getViewGroupTabs,
  getViewModes,
  getViewTabs,
  resolveFilterFields,
  type FilterScope,
} from '../services';
import {
  fetchGlobalConfig,
  fetchMetricConfig,
  type ConfigSource,
} from '../store/appConfigSlice';
import type {
  ComponentConfig,
  FilterFieldConfig,
  GlobalConfig,
  ModuleConfig,
  TabConfig,
  ViewConfig,
} from '../types';

export interface AppConfigResult {
  global: GlobalConfig;
  statuses: { global: LoadStatus; metrics: LoadStatus };
  sources: { global: ConfigSource; metrics: ConfigSource };
  /** Re-requests both configs, e.g. from a retry affordance. */
  reload: () => void;
}

/**
 * Requests the application config once per app load. Rendering never waits on it: the store is
 * seeded with the fallback config, so views have something complete to read from the first
 * paint and simply re-render if the backend sends something newer.
 */
export function useAppConfigBootstrap(): void {
  const dispatch = useAppDispatch();
  const statuses = useAppSelector((s) => s.appConfig.statuses);
  const errors = useAppSelector((s) => s.appConfig.errors);

  useEffect(() => {
    void dispatch(fetchGlobalConfig());
    void dispatch(fetchMetricConfig());
  }, [dispatch]);

  // Falling back is a normal, non-fatal outcome, which is exactly why it needs to be visible
  // in development: without this, a config endpoint that is down looks identical to one that
  // returned the values you are looking at.
  useEffect(() => {
    if (!isDev) return;
    if (statuses.global === 'failed') {
      console.warn(
        `[appConfig] global-config request failed (${errors.global ?? 'unknown error'}). Using the bundled fallback config.`,
      );
    }
    if (statuses.metrics === 'failed') {
      console.warn(
        `[appConfig] metrics-config request failed (${errors.metrics ?? 'unknown error'}). Using the bundled fallback metric catalogue.`,
      );
    }
  }, [statuses.global, statuses.metrics, errors.global, errors.metrics]);
}

export function useAppConfig(): AppConfigResult {
  const dispatch = useAppDispatch();
  const global = useAppSelector((s) => s.appConfig.global);
  const statuses = useAppSelector((s) => s.appConfig.statuses);
  const sources = useAppSelector((s) => s.appConfig.sources);

  const reload = useCallback(() => {
    void dispatch(fetchGlobalConfig());
    void dispatch(fetchMetricConfig());
  }, [dispatch]);

  return { global, statuses, sources, reload };
}

/** The whole config tree, for a caller that does its own lookups. */
export function useGlobalConfig(): GlobalConfig {
  return useAppSelector((s) => s.appConfig.global);
}

export function useModuleConfig(moduleKey: string): ModuleConfig | undefined {
  const config = useGlobalConfig();
  return useMemo(() => getModuleConfig(config, moduleKey), [config, moduleKey]);
}

export function useViewConfig(moduleKey: string, viewKey: string): ViewConfig | undefined {
  const config = useGlobalConfig();
  return useMemo(() => getViewConfig(config, moduleKey, viewKey), [config, moduleKey, viewKey]);
}

export function useComponentConfig(
  moduleKey: string,
  viewKey: string,
  componentKey: string,
): ComponentConfig | undefined {
  const config = useGlobalConfig();
  return useMemo(
    () => getComponentConfig(config, moduleKey, viewKey, componentKey),
    [config, moduleKey, viewKey, componentKey],
  );
}

export function useViewTabs(moduleKey: string, viewKey: string): readonly TabConfig[] {
  const config = useGlobalConfig();
  return useMemo(() => getViewTabs(config, moduleKey, viewKey), [config, moduleKey, viewKey]);
}

export function useViewGroupTabs(
  moduleKey: string,
  viewGroupKey: string,
): readonly TabConfig[] {
  const config = useGlobalConfig();
  return useMemo(
    () => getViewGroupTabs(config, moduleKey, viewGroupKey),
    [config, moduleKey, viewGroupKey],
  );
}

export function useViewModes(moduleKey: string, viewKey: string): readonly string[] {
  const config = useGlobalConfig();
  return useMemo(() => getViewModes(config, moduleKey, viewKey), [config, moduleKey, viewKey]);
}

/** Filter fields in effect for a scope — component's own, else its view's, else its module's. */
export function useFilterFields(scope: FilterScope): readonly FilterFieldConfig[] {
  const config = useGlobalConfig();
  const { module, view, component } = scope;
  return useMemo(
    () => resolveFilterFields(config, { module, view, component }),
    [config, module, view, component],
  );
}
