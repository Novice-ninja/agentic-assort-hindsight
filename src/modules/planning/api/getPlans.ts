import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';
import type { Plan, PlanStatus, PlanTabKey, RunMode } from '../types';
import { PLAN_CATEGORY_LEVEL_NO, scopeValuesByLevelNo } from '../utils/planDisplay';

/** Raw plan as returned by the plans list API (camelCase payload). */
export interface PlanDto {
  planCode: string;
  planName: string;
  fiscalYear: string;
  planSeasonCode: number;
  planSeasonName?: string;
  referenceSeasonCode?: number;
  referenceSeasonName?: string;
  pipelineMode: string;
  thresholdPct: number;
  status: string;
  isDeleted: boolean;
  hierarchyScope: Array<{
    levelName: string;
    levelNo: string;
    selectedValues?: string[];
    select_all?: boolean;
    search?: string[];
    except_search?: string[];
    except?: string[];
    include?: string[];
  }>;
  metrics: Array<{ key: string; value: number }>;
  createdBy: string;
  createdAt: string;
}

export interface PlansApiResponse {
  status: boolean;
  data: { plans: PlanDto[] };
  message: string;
}

export interface PlansResponse {
  items: Plan[];
  total: number;
  counts: Record<PlanTabKey, number>;
}

/** Real backend endpoint for listing plans. */
export const PLANS_ENDPOINT = `${env.goApiBaseUrl}/v1/plans`;

/** Normalise backend status strings to the UI `PlanStatus` union. */
const STATUS_MAP: Record<string, PlanStatus> = {
  draft: 'draft',
  in_progress: 'inProgress',
  'in-progress': 'inProgress',
  inprogress: 'inProgress',
  running: 'inProgress',
  review: 'review',
  in_review: 'review',
  approved: 'approved',
  complete: 'approved',
  completed: 'approved',
};

function seasonLabel(dto: PlanDto): string {
  if (dto.planSeasonName && dto.planSeasonName.trim() !== '') {
    return decodeIaString(dto.planSeasonName);
  }
  return dto.planSeasonCode != null ? `#${dto.planSeasonCode}` : '';
}

/** Map a backend `PlanDto` to the UI `Plan` model. Exported for testing. */
export function mapPlan(dto: PlanDto): Plan {
  const hierarchyScope = (dto.hierarchyScope ?? []).map((entry) => ({
    levelName: entry.levelName ?? '',
    levelNo: entry.levelNo ?? '',
    selectedValues: entry.selectedValues ?? [],
    selectAll: entry.select_all === true,
    search: entry.search ?? [],
    exceptSearch: entry.except_search ?? [],
    except: entry.except ?? [],
    include: entry.include ?? [],
  }));
  const categories = scopeValuesByLevelNo(hierarchyScope, PLAN_CATEGORY_LEVEL_NO);
  const season = seasonLabel(dto);
  const runMode: RunMode = dto.pipelineMode === 'autonomous' ? 'autonomous' : 'gated';

  return {
    id: dto.planCode,
    name: dto.planName,
    status: STATUS_MAP[dto.status?.toLowerCase()] ?? 'draft',
    isDeleted: Boolean(dto.isDeleted),
    fiscalYearId: dto.fiscalYear ?? '',
    season,
    seasonCode: dto.planSeasonCode,
    referenceSeasonCode: dto.referenceSeasonCode,
    startingPoint: 'startFresh',
    scope: {
      departmentId: null,
      classIds: categories,
      subClassIds: [],
      skuIds: [],
    },
    hierarchyScope,
    clusteringScenarioId: null,
    runMode,
    confidenceThreshold: dto.thresholdPct,
    pipelineMode: dto.pipelineMode ?? 'gated',
    currentStep: 1,
    metrics: dto.metrics ?? [],
    tags: {
      season,
      categories,
      cluster: undefined,
    },
    createdBy: dto.createdBy ?? '',
    createdAt: dto.createdAt,
    updatedAt: dto.createdAt,
  };
}

export function computeCounts(plans: Plan[]): Record<PlanTabKey, number> {
  return {
    all: plans.length,
    draft: plans.filter((p) => p.status === 'draft').length,
    inProgress: plans.filter((p) => p.status === 'inProgress').length,
    review: plans.filter((p) => p.status === 'review').length,
    approved: plans.filter((p) => p.status === 'approved').length,
  };
}

export async function getPlans(isDeleted = false): Promise<PlansResponse> {
  const response = await apiClient.get<PlansApiResponse>(PLANS_ENDPOINT, {
    is_deleted: isDeleted,
  });
  const items = (response.data?.plans ?? []).map(mapPlan);
  return { items, total: items.length, counts: computeCounts(items) };
}
