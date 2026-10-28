import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import type { ClusterPlan } from '../types';

export interface ClusterPlanLocationState {
  clusterPlan: ClusterPlan;
}

function isClusterPlan(value: unknown): value is ClusterPlan {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as ClusterPlan;
  return typeof row.id === 'string' && row.id.trim().length > 0 && typeof row.name === 'string';
}

export function readClusterPlanFromState(state: unknown): ClusterPlan | undefined {
  if (typeof state !== 'object' || state === null) return undefined;
  const clusterPlan = (state as { clusterPlan?: unknown }).clusterPlan;
  return isClusterPlan(clusterPlan) ? clusterPlan : undefined;
}

/**
 * Listing snapshot passed through `location.state` when opening a cluster plan.
 * Missing/mismatched state is `undefined` — the wizard then falls back to the list cache
 * or `GET /v1/clustering/plans`.
 */
export function useClusterPlanContext(): ClusterPlan | undefined {
  const location = useLocation();
  const { planId } = useParams<{ planId: string }>();

  return useMemo(() => {
    const snapshot = readClusterPlanFromState(location.state);
    if (!snapshot || !planId) return undefined;
    return snapshot.id === planId ? snapshot : undefined;
  }, [location.state, planId]);
}
