import { mapPlan } from '@modules/planning/api/getPlans';
import type { PlanDto } from '@modules/planning/api/getPlans';

/**
 * Stand-in plan used only when the plans API fails or returns nothing, so the app can still
 * open Hindsight. It is a plan record only: Hindsight data requests still go to the live
 * backend with this plan code, so they may come back empty.
 */
const MOCK_KB_PLAN_DTO: PlanDto = {
  planCode: 'MOCK-KB-PLAN',
  planName: 'KB Plan (Mock)',
  fiscalYear: '2026',
  planSeasonCode: 1,
  planSeasonName: 'Mock Season',
  referenceSeasonCode: 1,
  referenceSeasonName: 'Mock Reference Season',
  pipelineMode: 'gated',
  thresholdPct: 80,
  status: 'approved',
  isDeleted: false,
  hierarchyScope: [
    { levelName: 'Division', levelNo: 'l0_name', selectedValues: ['Rebel Sport'] },
    {
      levelName: 'Department',
      levelNo: 'l1_name',
      selectedValues: ['810-Indoor Sport', '111-OLD China'],
    },
    {
      levelName: 'Category',
      levelNo: 'l2_name',
      selectedValues: ['81010-Squash', '81015-Tennis'],
    },
  ],
  metrics: [],
  createdBy: 'mock',
  createdAt: '2026-01-01T00:00:00Z',
};

export const MOCK_KB_PLAN = mapPlan(MOCK_KB_PLAN_DTO);
