import { http, HttpResponse } from 'msw';
import type { CreatePlanInput } from '@modules/planning/api';
import type {
  FilterOption,
  FilterValuesRequest,
  Plan,
  PlanDraft,
} from '@modules/planning/types';
import {
  clusteringScenarioFixtures,
  filterConfigFieldFixtures,
  filterConfigHashFixture,
  filterValueFixtures,
  fiscalYearFixtures,
  planFixtures,
  seasonYearFixtures,
  taxonomyFixtures,
} from '@tests/fixtures/planning';
import { buildPlanHistoryMock } from '@tests/fixtures/planHistory';

// NOTE: The plans LIST and product-hierarchy filters (`/v1/filters/config`, `/v1/filters/values`)
// are served by the real Go backend. They are intentionally NOT mocked here so the browser
// worker (onUnhandledRequest: 'bypass') forwards them to the live API.
// Only reference-data / draft / create remain mocked.
let plansDb: Plan[] = planFixtures.map((p) => ({ ...p }));
let idCounter = plansDb.length;

export const planningHandlers = [
  http.get('*/api/planning/reference-data', () =>
    HttpResponse.json({
      fiscalYears: fiscalYearFixtures,
      taxonomy: taxonomyFixtures,
      clusteringScenarios: clusteringScenarioFixtures,
    }),
  ),

  // Plan history detail (pipeline / version history / activity). Mock until the real API ships.
  http.get('*/api/planning/plans/:planId/history', ({ params }) =>
    HttpResponse.json(buildPlanHistoryMock(String(params.planId))),
  ),

  http.post('*/api/planning/plans/draft', async ({ request }) => {
    const draft = (await request.json()) as PlanDraft;
    const id = draft.id ?? `plan-${String(++idCounter).padStart(3, '0')}`;
    return HttpResponse.json({ id, status: 'draft', updatedAt: new Date().toISOString() });
  }),

  // The Go API answers create with `{ status, data, message }` on both outcomes, and the wizard
  // renders `message` as a translation key, so failures carry a key rather than prose.
  http.post('*/v1/plans/create', async ({ request }) => {
    const body = (await request.json()) as Partial<CreatePlanInput>;
    const planName = body.planName?.trim() ?? '';

    if (!planName) {
      return HttpResponse.json({
        status: false,
        data: {},
        message: 'planning.errors.createFailed',
      });
    }

    if (plansDb.some((p) => p.name.trim().toLowerCase() === planName.toLowerCase())) {
      return HttpResponse.json({
        status: false,
        data: {},
        message: 'planning.errors.nameNotUnique',
      });
    }

    // The list itself comes from the real API, so this row exists only to make a second create
    // with the same name collide the way the backend would.
    const now = new Date().toISOString();
    const plan: Plan = {
      id: `plan-${String(++idCounter).padStart(3, '0')}`,
      name: planName,
      status: 'draft',
      isDeleted: false,
      fiscalYearId: body.fiscalYear ?? 'fy2026',
      season: 'SS26',
      startingPoint: 'startFresh',
      scope: { departmentId: null, classIds: [], subClassIds: [], skuIds: [] },
      hierarchyScope: (body.hierarchyScope ?? []).map((entry) =>
        'select_all' in entry && entry.select_all
          ? {
              levelName: entry.levelName,
              levelNo: entry.levelNo,
              selectedValues: [],
              selectAll: true as const,
              search: entry.search ?? [],
              exceptSearch: entry.except_search ?? [],
              except: entry.except ?? [],
              include: entry.include ?? [],
            }
          : {
              levelName: entry.levelName,
              levelNo: entry.levelNo,
              selectedValues: 'selectedValues' in entry ? entry.selectedValues : [],
            },
      ),
      clusteringScenarioId: null,
      runMode: body.pipelineMode === 'autonomous' ? 'autonomous' : 'gated',
      confidenceThreshold: body.thresholdPct ?? 80,
      pipelineMode: body.pipelineMode ?? 'gated',
      currentStep: 1,
      metrics: [],
      tags: { season: 'SS26', categories: ['Womenswear'] },
      createdBy: body.createdBy ?? 'planner@impactanalytics.co',
      createdAt: now,
      updatedAt: now,
    };
    plansDb = [plan, ...plansDb];

    return HttpResponse.json({ status: true, data: { planCode: plan.id }, message: 'Successful' });
  }),
];

/**
 * Handlers for endpoints the real backend already serves, so they are given to the test server
 * only. The browser worker must leave them alone and let the request reach the live API.
 */
export const planningTestHandlers = [
  http.get('*/v1/plans/seasons', () =>
    HttpResponse.json({
      status: true,
      data: { years: seasonYearFixtures },
      message: 'Successful',
    }),
  ),
  // Cascaded filters (any `config_key`). Deterministic stand-in for the live Go endpoints.
  http.get('*/v1/filters/config', () =>
    HttpResponse.json({
      status: true,
      data: { config_hash: filterConfigHashFixture, fields: filterConfigFieldFixtures },
      message: 'Successful',
    }),
  ),
  http.post('*/v1/filters/values', async ({ request }) => {
    const body = (await request.json()) as FilterValuesRequest;
    const parentValues = new Set(
      body.filters.flatMap((filter) => ('values' in filter ? filter.values : [])),
    );
    const needle = body.search?.trim().toLowerCase() ?? '';
    const values: Record<string, FilterOption[]> = {};
    const totals: Record<string, number> = {};
    for (const attribute of body.attributes) {
      const all = filterValueFixtures[attribute] ?? [];
      // Cascade: when ancestors are filtered, keep only options whose path starts with one.
      const scoped =
        parentValues.size === 0
          ? all
          : all.filter((option) =>
              [...parentValues].some((parent) => option.path.startsWith(`${parent}____`)),
            );
      const searched = needle
        ? scoped.filter((option) => option.label.toLowerCase().includes(needle))
        : scoped;
      totals[attribute] = searched.length;
      values[attribute] =
        body.limit !== undefined
          ? searched.slice(body.offset ?? 0, (body.offset ?? 0) + body.limit)
          : searched;
    }
    return HttpResponse.json({
      status: true,
      data: {
        snapshot_id: body.snapshot_id,
        config_hash: filterConfigHashFixture,
        values,
        totals,
        total: Object.values(totals).reduce((sum, n) => sum + n, 0),
      },
      message: 'Successful',
    });
  }),
];

/** Test helper to reset the in-memory plans between tests. */
export function __resetPlanningDb() {
  plansDb = planFixtures.map((p) => ({ ...p }));
  idCounter = plansDb.length;
}
