import { clusteringClient } from './mockClient';
import type { ReferencePeriod } from '../types';

export function getReferencePeriods(
  planId: string,
): Promise<{ periods: ReferencePeriod[]; insufficientHistory: boolean }> {
  return clusteringClient.get(`/clustering/plans/${planId}/reference-periods`);
}
