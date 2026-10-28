import { apiClient } from '@shared/services';
import { selectionQuery } from './selectionQuery';
import type {
  CarryForwardData,
  ClusterPerformanceData,
  ContributionData,
  GlobalSelection,
  HeatmapData,
  ProductPerformanceCard,
  ScorecardRow,
  VersionChartData,
} from '../types';

export interface HindsightOverviewResponse {
  scorecard: ScorecardRow[];
  productPerformance: ProductPerformanceCard[];
  contributions: ContributionData[];
  clusterPerformance: ClusterPerformanceData;
  categoryByCluster: HeatmapData;
  versionCharts: VersionChartData[];
  carryForward: CarryForwardData;
}

export interface OverviewParams {
  selection: GlobalSelection;
  metricIds: string[];
  threshold?: number;
  carryForwardView?: string;
}

export function getHindsightOverview({
  selection,
  metricIds,
  threshold,
  carryForwardView,
}: OverviewParams): Promise<HindsightOverviewResponse> {
  return apiClient.get<HindsightOverviewResponse>(
    '/hindsight/overview',
    selectionQuery(selection, {
      metricIds: metricIds.join(','),
      ...(threshold === undefined ? {} : { threshold: String(threshold) }),
      ...(carryForwardView === undefined ? {} : { carryForwardView }),
    }),
  );
}
