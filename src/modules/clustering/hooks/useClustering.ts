import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { can } from '../services/access';
import { fetchConfigAndScope, fetchPlans, setActiveTab, setSelectedPlanIds } from '../store/clusteringSlice';
import { selectVisiblePlans } from '../store/selectors';
import type { ClusterPlanTabKey } from '../types';

export function useClustering() {
  const dispatch = useAppDispatch();
  const clustering = useAppSelector((s) => s.clustering);
  const canWrite = can('clustering:write');
  const canApprove = can('clustering:approve');
  const canSignOff = can('clustering:signoff');

  useEffect(() => {
    void dispatch(fetchPlans());
    void dispatch(fetchConfigAndScope());
  }, [dispatch]);

  const visiblePlans = useMemo(
    () => selectVisiblePlans(clustering.plans, clustering.activeTab),
    [clustering.plans, clustering.activeTab],
  );

  const changeTab = useCallback(
    (tab: ClusterPlanTabKey) => dispatch(setActiveTab(tab)),
    [dispatch],
  );
  const changeSelection = useCallback(
    (ids: string[]) => dispatch(setSelectedPlanIds(ids)),
    [dispatch],
  );

  return {
    ...clustering,
    canWrite,
    canApprove,
    canSignOff,
    visiblePlans,
    changeTab,
    changeSelection,
  };
}
