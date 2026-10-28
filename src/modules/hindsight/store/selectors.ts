import { createSelector } from '@reduxjs/toolkit';
import { resolveMetricId, resolveMetricList, findWidgetConfig } from '../services/resolveSetting';
import { scopedFacets } from '../services/permissionScope';
import { effectiveVerdict, verdictTotals } from '../services/recommendationVerdict';
import { findMetric } from '../services/metricCatalog';
import type { HindsightState } from './hindsightSlice';
import type { Metric, MetricCatalogue, Verdict, WidgetConfig } from '../types';

interface WithHindsight {
  hindsight: HindsightState;
}

const EMPTY_CATALOGUE: MetricCatalogue = { metrics: [], updatedAt: '', version: 0 };

export const selectHindsight = (state: WithHindsight): HindsightState => state.hindsight;

export const selectCatalogue = createSelector(
  selectHindsight,
  (s): MetricCatalogue => s.tenant?.catalogue ?? EMPTY_CATALOGUE,
);

export const selectWidgets = createSelector(
  selectHindsight,
  (s): WidgetConfig[] => s.tenant?.widgets ?? [],
);

export const selectScopedFacets = createSelector(selectHindsight, (s) =>
  scopedFacets(s.facets, s.scope),
);

export const selectSelection = createSelector(selectHindsight, (s) => s.selection);
export const selectPreferences = createSelector(selectHindsight, (s) => s.preferences);
export const selectOverview = createSelector(selectHindsight, (s) => s.overview);
export const selectStatuses = createSelector(selectHindsight, (s) => s.statuses);

/**
 * The metric a widget should display, already resolved against tenant configuration. Widgets
 * read this rather than reaching into preferences, which is what guarantees a disabled
 * choice falls back consistently everywhere.
 */
export const selectWidgetMetricId = (widgetId: string) =>
  createSelector(
    [selectCatalogue, selectWidgets, selectPreferences],
    (catalogue, widgets, preferences): string => {
      const config = findWidgetConfig(widgets, widgetId);
      if (config === undefined) return catalogue.metrics[0]?.id ?? '';
      return resolveMetricId(catalogue, config, preferences.metricByWidgetId[widgetId]);
    },
  );

export const selectInstanceMetricId = (instanceId: string, widgetId: string) =>
  createSelector(
    [selectCatalogue, selectWidgets, selectPreferences, selectHindsight],
    (catalogue, widgets, preferences, s): string => {
      const instance = s.tenant?.chartInstances.find((i) => i.instanceId === instanceId);
      const config = findWidgetConfig(widgets, widgetId);
      const fallback = instance?.defaultMetricId ?? config?.defaultMetricId ?? '';
      const enabled = config?.enabledMetricIds ?? 'all';
      return resolveMetricId(
        catalogue,
        { defaultMetricId: fallback, enabledMetricIds: enabled },
        preferences.metricByInstanceId[instanceId],
      );
    },
  );

/** The scorecard's metric rows, in the planner's order, dropping anything now disabled. */
export const selectScorecardMetricIds = createSelector(
  [selectCatalogue, selectWidgets, selectPreferences],
  (catalogue, widgets, preferences): string[] => {
    const config = findWidgetConfig(widgets, 'season-scorecard');
    if (config === undefined) return catalogue.metrics.map((m) => m.id);
    return resolveMetricList(catalogue, config, preferences.scorecardMetricIds);
  },
);

export const selectMetric = (metricId: string) =>
  createSelector(selectCatalogue, (catalogue): Metric | undefined =>
    findMetric(catalogue, metricId),
  );

export const selectItems = createSelector(selectHindsight, (s) => s.items);
export const selectRecommendations = createSelector(selectHindsight, (s) => s.recommendations);
export const selectOverridesEnabled = createSelector(
  selectPreferences,
  (p) => p.overridesEnabled,
);

/** Articles whose recommendation override is still in flight, so each row can say so itself. */
export const selectPendingRecommendations = createSelector(
  selectHindsight,
  (s) => s.pendingRecommendations,
);

/** Verdicts currently in effect, keyed by item id, so a cell renders without recomputing. */
export const selectEffectiveVerdicts = createSelector(
  [selectItems, selectRecommendations, selectOverridesEnabled],
  (items, recommendations, overridesEnabled): Record<string, Verdict | undefined> =>
    Object.fromEntries(
      items.map((item) => [
        item.id,
        effectiveVerdict(recommendations[item.id], overridesEnabled),
      ]),
    ),
);

/**
 * Totals derived from the verdicts in effect over the currently visible items, so they track
 * both the override switch and any active search.
 */
export const selectVerdictTotals = createSelector(
  [selectItems, selectRecommendations, selectOverridesEnabled],
  (items, recommendations, overridesEnabled) =>
    verdictTotals(recommendations, items.map((i) => i.id), overridesEnabled),
);

export const selectNarrationFor = (widgetId: string) =>
  createSelector(selectHindsight, (s) => s.narration[widgetId]);

export const selectAttributeView = createSelector(selectHindsight, (s) => s.attributeView);
export const selectClusters = createSelector(selectHindsight, (s) => s.clusters);
export const selectSeasons = createSelector(selectHindsight, (s) => s.seasons);
export const selectActiveTab = createSelector(selectHindsight, (s) => s.activeTab);
