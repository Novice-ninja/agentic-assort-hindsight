import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { isSelectionEmpty } from '../api';
import {
  applySelection,
  fetchHindsightConfig,
  fetchHindsightContext,
  fetchHindsightItems,
  fetchHindsightNarration,
  fetchHindsightOverview,
  savePreferences,
  setActiveTab,
  setFilterBarCollapsed,
  setItemSearch,
  setItemSort,
} from '../store/hindsightSlice';
import { selectScopedFacets } from '../store/selectors';
import type { GlobalSelection, HindsightTab, SortState, UserPreferences } from '../types';
import { usePlanContext } from './usePlanContext';
import { useFlooringScope } from '../priority/flooringScope';

/** Widgets whose narration is fetched with the overview. */
const OVERVIEW_NARRATED_WIDGETS = [
  'season-scorecard',
  'product-performance',
  'contribution',
  'colour-contribution',
  'cluster-performance',
  'category-by-cluster',
  'version-chart',
  'carry-forward',
];

/**
 * The module's single entry point for page-level state.
 *
 * Configuration and context load once; the data requests re-run whenever the selection
 * changes. Requests are skipped entirely while the selection is incomplete, so a planner who
 * clears their filters sees an empty state rather than a spinner over a request that could
 * only ever return nothing.
 *
 * Opening any plan (including a different plan after leaving and returning) always lands on
 * Overview — `activeTab` lives in the store and would otherwise keep the last tab.
 */
export function useHindsight() {
  const dispatch = useAppDispatch();
  const hindsight = useAppSelector((s) => s.hindsight);
  const facets = useAppSelector(selectScopedFacets);
  const { planCode } = usePlanContext();
  const { revision: flooringRevision } = useFlooringScope(planCode);

  const { selection, statuses, activeTab } = hindsight;
  const selectionIncomplete = isSelectionEmpty(selection);

  useLayoutEffect(() => {
    dispatch(setActiveTab('overview'));
  }, [dispatch, planCode]);

  useEffect(() => {
    if (statuses.config === 'idle') void dispatch(fetchHindsightConfig());
    if (statuses.context === 'idle') void dispatch(fetchHindsightContext());
  }, [dispatch, statuses.config, statuses.context]);

  // Serialised so the effect re-runs on a value change rather than on a new array identity.
  const selectionKey = JSON.stringify(selection);

  useEffect(() => {
    if (selectionIncomplete || statuses.config !== 'succeeded') return;
    void dispatch(fetchHindsightOverview());
    void dispatch(fetchHindsightNarration(OVERVIEW_NARRATED_WIDGETS));
  }, [dispatch, selectionKey, selectionIncomplete, statuses.config, flooringRevision]);

  useEffect(() => {
    if (selectionIncomplete || statuses.config !== 'succeeded') return;
    if (activeTab !== 'byItem') return;
    void dispatch(fetchHindsightItems());
  }, [dispatch, selectionKey, selectionIncomplete, statuses.config, activeTab]);

  const changeSelection = useCallback(
    (patch: Partial<GlobalSelection>) => {
      dispatch(applySelection(patch));
    },
    [dispatch],
  );

  const changeTab = useCallback(
    (tab: HindsightTab) => {
      dispatch(setActiveTab(tab));
    },
    [dispatch],
  );

  const search = useCallback(
    (query: string) => {
      dispatch(setItemSearch(query));
      void dispatch(fetchHindsightItems());
    },
    [dispatch],
  );

  const sort = useCallback(
    (next: SortState | null) => {
      dispatch(setItemSort(next));
      void dispatch(fetchHindsightItems());
    },
    [dispatch],
  );

  const persistPreferences = useCallback(
    (patch: Partial<UserPreferences>) => {
      void dispatch(savePreferences(patch));
    },
    [dispatch],
  );

  const toggleFilterBar = useCallback(
    (collapsed: boolean) => {
      dispatch(setFilterBarCollapsed(collapsed));
    },
    [dispatch],
  );

  const ready = statuses.config === 'succeeded' && statuses.context === 'succeeded';

  return useMemo(
    () => ({
      ...hindsight,
      facets,
      ready,
      selectionIncomplete,
      changeSelection,
      changeTab,
      search,
      sort,
      persistPreferences,
      toggleFilterBar,
      retryOverview: () => dispatch(fetchHindsightOverview()),
      retryItems: () => dispatch(fetchHindsightItems()),
    }),
    [
      hindsight,
      facets,
      ready,
      selectionIncomplete,
      changeSelection,
      changeTab,
      search,
      sort,
      persistPreferences,
      toggleFilterBar,
      dispatch,
    ],
  );
}
