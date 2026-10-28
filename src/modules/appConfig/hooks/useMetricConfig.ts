import { useMemo } from 'react';
import { useAppSelector } from '@app/store/hooks';
import {
  findMetricConfig,
  getEnabledMetricConfigs,
  getMetricLabel,
  getMetricType,
} from '../services';
import type { MetricCatalogue, MetricConfig, MetricType } from '../types';

/** The full catalogue indexed by key, including disabled metrics. */
export function useMetricCatalogue(): MetricCatalogue {
  return useAppSelector((s) => s.appConfig.metrics);
}

/** The metrics a picker or card row may offer. */
export function useEnabledMetricConfigs(): readonly MetricConfig[] {
  const metrics = useMetricCatalogue();
  return useMemo(() => getEnabledMetricConfigs(metrics), [metrics]);
}

/**
 * Config for one metric, looked up by the key its data API emits (e.g. `gross_margin_pct`).
 * Returns `undefined` when the catalogue does not know the metric, so the caller can keep its own
 * label and formatting.
 */
export function useMetricConfig(key: string): MetricConfig | undefined {
  const metrics = useMetricCatalogue();
  return useMemo(() => findMetricConfig(metrics, key), [metrics, key]);
}

export function useMetricLabel(key: string): string {
  const metrics = useMetricCatalogue();
  return useMemo(() => getMetricLabel(metrics, key), [metrics, key]);
}

export function useMetricType(key: string): MetricType {
  const metrics = useMetricCatalogue();
  return useMemo(() => getMetricType(metrics, key), [metrics, key]);
}
