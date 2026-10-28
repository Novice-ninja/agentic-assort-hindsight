import type { LoadStatus } from '@shared/types';
import type { GlobalConfig, MetricCatalogue } from '../types';
import type { AppConfigState, ConfigSource } from './appConfigSlice';

/**
 * Selectors are typed against the slice they read rather than the whole `RootState`, so this
 * module does not have to import the store it is registered in.
 */
interface WithAppConfig {
  appConfig: AppConfigState;
}

export function selectGlobalConfig(state: WithAppConfig): GlobalConfig {
  return state.appConfig.global;
}

export function selectMetricConfigs(state: WithAppConfig): MetricCatalogue {
  return state.appConfig.metrics;
}

export function selectGlobalConfigStatus(state: WithAppConfig): LoadStatus {
  return state.appConfig.statuses.global;
}

export function selectMetricConfigStatus(state: WithAppConfig): LoadStatus {
  return state.appConfig.statuses.metrics;
}

export function selectGlobalConfigSource(state: WithAppConfig): ConfigSource {
  return state.appConfig.sources.global;
}

export function selectMetricConfigSource(state: WithAppConfig): ConfigSource {
  return state.appConfig.sources.metrics;
}
