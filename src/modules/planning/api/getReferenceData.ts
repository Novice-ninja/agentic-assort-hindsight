import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';
import type { PlanningReferenceData } from '../types';

export async function getReferenceData(): Promise<PlanningReferenceData> {
  const data = await apiClient.get<PlanningReferenceData>('/planning/reference-data');
  return {
    ...data,
    fiscalYears: data.fiscalYears.map((fy) => ({
      ...fy,
      label: decodeIaString(fy.label),
    })),
    taxonomy: data.taxonomy.map((node) => ({
      ...node,
      label: decodeIaString(node.label),
    })),
    clusteringScenarios: data.clusteringScenarios.map((scenario) => ({
      ...scenario,
      name: decodeIaString(scenario.name),
      description: decodeIaString(scenario.description),
      segmentBreakdown: decodeIaString(scenario.segmentBreakdown),
    })),
  };
}
