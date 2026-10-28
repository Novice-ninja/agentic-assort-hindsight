import type { MetricCatalogue } from './metric';
import type { AttributeDefinition, CarryForwardView } from './attribute';
import type { ItemViewMode, SortState } from './item';

/** `'all'` means every catalogue metric is available to this widget. */
export type EnabledMetrics = string[] | 'all';

export interface ThresholdBounds {
  min: number;
  max: number;
}

/**
 * Tenant-level configuration for one widget. Everything a planner may personalize is
 * bounded by a field here, which is what keeps user choice inside business policy.
 */
export interface WidgetConfig {
  widgetId: string;
  defaultMetricId: string;
  enabledMetricIds: EnabledMetrics;
  maxListLength?: number;
  defaultListLength?: number;
  topN?: number;
  thresholdPercent?: number;
  surfacingThresholdBounds?: ThresholdBounds;
  showOthers?: boolean;
  tyLyDefault?: boolean;
  /** False means the widget renders no narration slot and reserves no space for one. */
  narrated: boolean;
}

/**
 * One chart on the page. Position is implementation-set — planners may swap the metric but
 * cannot reorder or add instances.
 */
export interface ChartInstance {
  instanceId: string;
  widgetId: string;
  position: number;
  defaultMetricId: string;
  enabledVersionIds: string[];
  hierarchyPair?: { fromLevelId: string; toLevelId: string };
}

export interface TenantConfig {
  catalogue: MetricCatalogue;
  attributeCatalogue: AttributeDefinition[];
  widgets: WidgetConfig[];
  chartInstances: ChartInstance[];
  updatedAt: string;
  version: number;
}

/**
 * Per-planner personalization. Values here are stored as chosen and resolved on read, so a
 * choice the tenant later disables falls back silently instead of erroring.
 */
export interface UserPreferences {
  scorecardMetricIds: string[];
  metricByInstanceId: Record<string, string>;
  metricByWidgetId: Record<string, string>;
  listLengthByWidgetId: Record<string, number>;
  sortByWidgetId: Record<string, SortState>;
  surfacingThreshold?: number;
  tyLyEnabled?: boolean;
  itemViewMode?: ItemViewMode;
  carryForwardView?: CarryForwardView;
  overridesEnabled: boolean;
}

export const EMPTY_PREFERENCES: UserPreferences = {
  scorecardMetricIds: [],
  metricByInstanceId: {},
  metricByWidgetId: {},
  listLengthByWidgetId: {},
  sortByWidgetId: {},
  overridesEnabled: true,
};

export type HindsightTab = 'overview' | 'byItem' | 'byAttribute' | 'watchlist';
