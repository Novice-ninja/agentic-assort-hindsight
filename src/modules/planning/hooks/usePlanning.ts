import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { hasPermission, type Role } from '@config/permissions';
import {
  fetchPlans,
  fetchReferenceData,
  setActiveTab,
  setFilters,
  clearFilter,
  setViewMode,
  setSelectedIds,
} from '../store/planningSlice';
import type { PlanningFilters } from '../store/planningSlice';
import { activeFilterCount, selectVisiblePlans } from '../store/selectors';
import type { PlanTabKey, PlanViewMode } from '../types';

// Swap for real session/role resolution when authentication is introduced.
const CURRENT_ROLE: Role = 'admin';

export function usePlanning() {
  const dispatch = useAppDispatch();
  const planning = useAppSelector((s) => s.planning);
  const canCreate = hasPermission(CURRENT_ROLE, 'plans:write');

  // Fire once on mount. The thunks' `condition` guards abort duplicate/in-flight fetches,
  // so we intentionally don't depend on the fetch statuses here (which would re-run the effect).
  useEffect(() => {
    void dispatch(fetchPlans());
    void dispatch(fetchReferenceData());
  }, [dispatch]);

  const visiblePlans = useMemo(
    () => selectVisiblePlans(planning.plans, planning.activeTab, planning.filters),
    [planning.plans, planning.activeTab, planning.filters],
  );

  const filterCount = useMemo(() => activeFilterCount(planning.filters), [planning.filters]);

  const changeTab = useCallback((tab: PlanTabKey) => dispatch(setActiveTab(tab)), [dispatch]);
  const changeFilters = useCallback(
    (patch: Partial<PlanningFilters>) => dispatch(setFilters(patch)),
    [dispatch],
  );
  const removeFilter = useCallback(
    (key: keyof PlanningFilters) => dispatch(clearFilter(key)),
    [dispatch],
  );
  const changeViewMode = useCallback(
    (mode: PlanViewMode) => dispatch(setViewMode(mode)),
    [dispatch],
  );
  const changeSelection = useCallback(
    (ids: string[]) => dispatch(setSelectedIds(ids)),
    [dispatch],
  );

  return {
    ...planning,
    canCreate,
    readOnly: !canCreate,
    visiblePlans,
    filterCount,
    changeTab,
    changeFilters,
    removeFilter,
    changeViewMode,
    changeSelection,
  };
}
