import { http, HttpResponse, passthrough, type JsonBodyType } from 'msw';
import type { HierarchyScopeEntry } from '@modules/planning/types';
import type {
  ApprovalGate,
  Cluster,
  ClusterPlan,
  ClusterPlanStatus,
  ClusterPlanTabKey,
  ClusterResultCandidate,
  ClusterRunMode,
  ClusteringAttribute,
  ClusteringRun,
  Pin,
  Variant,
  WizardStep,
} from '@modules/clustering/types';
import { getActivePersona, personaHas } from '@modules/clustering/services/persona';
import { isNameTaken, validateScope } from '@modules/clustering/services/scopeValidation';
import { isOutOfScope } from '@modules/clustering/services/permissionScope';
import { getPerformanceClusterStores } from '@modules/clustering/api/getPerformanceClusterStores';
import { mapStoreKpisToCandidateView } from '@modules/clustering/services/mapStoreKpisToCandidateView';
import {
  applyStoreExclusion,
  coverageFromAssignments,
} from '@modules/clustering/services/storeExclusion';
import {
  attributeFixtures,
  attributeGradesSummaryFixture,
  attributeSignificanceScoreFixture,
  authMeFixture,
  customVariantFixture,
  generateVariantsFixture,
  candidateFixtures,
  channelCatalogueFixture,
  clusterApprovalFixture,
  clusterPlanFixtures,
  clusterRunFixture,
  clusterPerformanceSummaryFixture,
  clusterVariantSummaryFixture,
  clusteringConfigFixture,
  clusteringMetricsFixture,
  countryCatalogueFixture,
  gateFixturesFor,
  periodFixtures,
  personaScopes,
  pinFixtures,
  productCatalogueFixture,
  regionCatalogueFixture,
  seasonCatalogueFixture,
  seasonInfosFixture,
  stateTransitionFixture,
  clusterPlansFixture,
  kpiBreakdownFixture,
  performanceInfoFixture,
  storeAssignmentsFixture,
  signOffContextFixture,
  variantFixtures,
} from '@tests/fixtures/clustering';

const HIDDEN_FROM_LIST = new Set(['cp-review-ready', 'cp-fail-run', 'cp-finalize']);
const RUN_DELAY_MS =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'test' ? 25 : 1500;

interface RunRecord extends ClusteringRun {
  pollCount: number;
  forceFail: boolean;
}

interface Db {
  plans: ClusterPlan[];
  attributes: Record<string, ClusteringAttribute[]>;
  variants: Record<string, Variant[]>;
  selectedPeriod: Record<string, string | null>;
  selectedPeriods: Record<string, string[]>;
  overriddenPeriods: Record<string, string[]>;
  runMode: Record<string, ClusterRunMode>;
  hierarchyScope: Record<string, HierarchyScopeEntry[]>;
  clusterPlanCode: Record<string, string | null>;
  runs: Record<string, RunRecord>;
  latestRunId: Record<string, string>;
  candidates: Record<string, ClusterResultCandidate[]>;
  clusters: Record<string, Cluster[]>;
  pins: Pin[];
  gates: Record<string, ApprovalGate[]>;
  actionedBy: string;
}

function clonePlans(): ClusterPlan[] {
  return clusterPlanFixtures.map((plan) => ({
    ...plan,
    countryIds: [...plan.countryIds],
  }));
}

function createDb(): Db {
  const plans = clonePlans();
  const attributes: Record<string, ClusteringAttribute[]> = {};
  const variants: Record<string, Variant[]> = {};
  const selectedPeriod: Record<string, string | null> = {};
  const selectedPeriods: Record<string, string[]> = {};
  const overriddenPeriods: Record<string, string[]> = {};
  const runMode: Record<string, ClusterRunMode> = {};
  const hierarchyScope: Record<string, HierarchyScopeEntry[]> = {};
  const clusterPlanCode: Record<string, string | null> = {};
  const gates: Record<string, ApprovalGate[]> = {};
  for (const plan of plans) {
    attributes[plan.id] = attributeFixtures.map((row) => ({ ...row }));
    variants[plan.id] = variantFixtures.map((row) => ({
      ...row,
      attributeIds: [...row.attributeIds],
    }));
    selectedPeriod[plan.id] = plan.currentStep === 'scope' ? null : 'ss26';
    selectedPeriods[plan.id] = selectedPeriod[plan.id]
      ? [selectedPeriod[plan.id] as string]
      : [];
    overriddenPeriods[plan.id] = [];
    runMode[plan.id] = 'gated';
    hierarchyScope[plan.id] = [];
    clusterPlanCode[plan.id] = null;
    gates[plan.id] =
      plan.status === 'approved'
        ? [
            {
              planId: plan.id,
              gate: 2,
              status: 'approved',
              actionedBy: plan.createdBy,
              actionedOn: plan.createdOn,
            },
            {
              planId: plan.id,
              gate: 3,
              status: 'signedOff',
              actionedBy: plan.createdBy,
              actionedOn: plan.createdOn,
            },
          ]
        : gateFixturesFor(plan.id);
  }
  const candidates: Record<string, ClusterResultCandidate[]> = {
    'cp-finalize': candidateFixtures.map((row) => ({ ...row })),
    'cp-na-east': candidateFixtures.map((row) => ({
      ...row,
      planId: 'cp-na-east',
      selected: row.id === 'cand-1',
    })),
  };
  return {
    plans,
    attributes,
    variants,
    selectedPeriod,
    selectedPeriods,
    overriddenPeriods,
    runMode,
    hierarchyScope,
    clusterPlanCode,
    runs: {
      'run-finalize': {
        id: 'run-finalize',
        planId: 'cp-finalize',
        status: 'succeeded',
        startedAt: '2026-05-11T11:00:00.000Z',
        completedAt: '2026-05-11T11:01:20.000Z',
        expectedSeconds: 60,
        proposedK: 4,
        modelFitPct: 0.87,
        pollCount: 2,
        forceFail: false,
      },
    },
    latestRunId: { 'cp-finalize': 'run-finalize', 'cp-na-east': 'run-finalize' },
    candidates,
    clusters: {},
    pins: [...pinFixtures],
    gates,
    actionedBy: 'qa@impactanalytics.co',
  };
}

let db = createDb();

type StoreMoveTarget = {
  productLabel?: string;
  performanceLabel?: string;
  storeLabel?: string;
};

/** In-memory overlay of `POST .../move_stores`, keyed by planCode::variantId → storeCode. */
let storeMoveOverlay: Record<string, Record<string, StoreMoveTarget>> = {};

function storeMoveKey(clusterPlanCode: string, variantId: string): string {
  return `${clusterPlanCode}::${variantId}`;
}

function applyStoreMoves<T extends ReturnType<typeof storeAssignmentsFixture>>(
  payload: T,
  clusterPlanCode: string,
  variantId: string,
): T {
  const overlay = storeMoveOverlay[storeMoveKey(clusterPlanCode, variantId)];
  if (!overlay) return payload;
  const assignments = payload.assignments.map((row) => {
    const dest = overlay[row.store_code];
    if (!dest) return row;
    const provided = (
      [
        ['productLabel', dest.productLabel],
        ['performanceLabel', dest.performanceLabel],
        ['storeLabel', dest.storeLabel],
      ] as const
    ).filter((entry): entry is [(typeof entry)[0], string] => Boolean(entry[1]));
    const cluster =
      provided.length === 0
        ? undefined
        : payload.clusters.find((item) =>
            provided.every(([key, value]) => item[key] === value),
          );
    if (!cluster) return row;
    return {
      ...row,
      clusterName: cluster.clusterName,
      label: cluster.label,
    };
  });
  const clusters = payload.clusters.map((cluster) => ({
    ...cluster,
    storeCount: assignments.filter((row) => row.label === cluster.label).length,
  }));
  return { ...payload, assignments, clusters };
}

export function resetClusteringDb(): void {
  db = createDb();
  storeMoveOverlay = {};
}

function currentScope() {
  return personaScopes[getActivePersona()];
}

function planInScope(plan: ClusterPlan): boolean {
  const scope = currentScope();
  return !isOutOfScope(plan.countryIds, scope.countryIds);
}

function counts(plans: ClusterPlan[]): Record<ClusterPlanTabKey, number> {
  return {
    all: plans.length,
    awaitingApproval: plans.filter((p) => p.status === 'awaitingApproval').length,
    inputNeeded: plans.filter((p) => p.status === 'inputNeeded').length,
    approved: plans.filter((p) => p.status === 'approved').length,
  };
}

function findPlan(id: string) {
  return db.plans.find((plan) => plan.id === id);
}

export interface ClusteringMockResult {
  status: number;
  body?: unknown;
}

function fail(status: number, code: string, message: string): ClusteringMockResult {
  return { status, body: { error: { code, message } } };
}

function ok(body: unknown, status = 200): ClusteringMockResult {
  return { status, body };
}

function requirePlan(
  id: string,
): { plan: ClusterPlan } | { error: ClusteringMockResult } {
  const plan = findPlan(id);
  if (!plan) return { error: fail(404, 'PLAN_NOT_FOUND', 'Plan not found') };
  if (!planInScope(plan))
    return { error: fail(403, 'OUT_OF_SCOPE', 'Plan is outside permission scope') };
  return { plan };
}

/** Redux/Immer freeze objects they store. Always mutate a fresh db copy, never the returned payload. */
function writablePlan(plan: ClusterPlan): ClusterPlan {
  const copy: ClusterPlan = { ...plan, countryIds: [...plan.countryIds] };
  const idx = db.plans.findIndex((item) => item.id === plan.id);
  if (idx >= 0) db.plans[idx] = copy;
  return copy;
}

function publicRun(run: RunRecord): ClusteringRun {
  return {
    id: run.id,
    planId: run.planId,
    status: run.status,
    startedAt: run.startedAt,
    completedAt: run.completedAt,
    expectedSeconds: run.expectedSeconds,
    errorCode: run.errorCode,
    proposedK: run.proposedK,
    modelFitPct: run.modelFitPct,
  };
}

function publicPlan(plan: ClusterPlan): ClusterPlan {
  return { ...plan, countryIds: [...plan.countryIds] };
}

function matchPath(path: string, pattern: string): Record<string, string> | null {
  const pathParts = path.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const part = patternParts[i];
    if (part.startsWith(':')) params[part.slice(1)] = pathParts[i];
    else if (part !== pathParts[i]) return null;
  }
  return params;
}

let runSeq = 1;

export async function handleClusteringRequest(
  method: string,
  pathAndQuery: string,
  body?: unknown,
): Promise<ClusteringMockResult> {
  const url = new URL(pathAndQuery, 'http://clustering.local');
  const path = url.pathname.replace(/\/$/, '') || '/';
  const verb = method.toUpperCase();
  const p = (pattern: string) => matchPath(path, pattern);

  if (verb === 'GET' && p('/clustering/config')) {
    return ok({ ...clusteringConfigFixture, metrics: clusteringMetricsFixture });
  }
  if (verb === 'GET' && p('/clustering/permission-scope')) return ok(currentScope());
  if (verb === 'GET' && p('/clustering/catalogues')) {
    const scope = currentScope();
    return ok({
      products: productCatalogueFixture.filter((product) =>
        scope.productIds.includes(product.id),
      ),
      seasons: seasonCatalogueFixture,
      channels: channelCatalogueFixture,
      countries: countryCatalogueFixture.filter((country) =>
        scope.countryIds.includes(country.id),
      ),
      regions: regionCatalogueFixture,
    });
  }
  if (verb === 'GET' && p('/clustering/plans')) {
    const name = url.searchParams.get('name');
    const status = url.searchParams.get('status') as ClusterPlanStatus | null;
    const scoped = db.plans.filter(planInScope);
    if (name !== null) {
      const excludeId = url.searchParams.get('excludeId');
      const taken = isNameTaken(
        name,
        scoped.filter((plan) => plan.id !== excludeId).map((plan) => plan.name),
      );
      return ok({
        taken,
        plans: taken
          ? scoped.filter((plan) => plan.name.toLowerCase() === name.trim().toLowerCase())
          : [],
      });
    }
    const listed = scoped.filter((plan) => !HIDDEN_FROM_LIST.has(plan.id));
    const filtered = status ? listed.filter((plan) => plan.status === status) : listed;
    return ok({ plans: filtered, counts: counts(listed) });
  }

  const planIdParams = p('/clustering/plans/:id');
  if (verb === 'GET' && planIdParams) {
    const result = requirePlan(planIdParams.id);
    if ('error' in result) return result.error;
    const { plan } = result;
    return ok({
      plan: publicPlan(plan),
      draft: {
        planId: plan.id,
        name: plan.name,
        productId: plan.productId,
        seasonId: plan.seasonId,
        channelId: plan.channelId,
        countryIds: plan.countryIds,
        runMode: db.runMode[plan.id] ?? 'gated',
        hierarchyScope: db.hierarchyScope[plan.id] ?? [],
        clusterPlanCode: db.clusterPlanCode[plan.id] ?? null,
        attributeOverrides: Object.fromEntries(
          (db.attributes[plan.id] ?? []).map((attr) => [attr.id, attr.userSelected]),
        ),
        selectedPeriodId: db.selectedPeriod[plan.id] ?? null,
        selectedPeriodIds:
          db.selectedPeriods[plan.id] ??
          (db.selectedPeriod[plan.id] ? [db.selectedPeriod[plan.id] as string] : []),
        overriddenPeriodIds: db.overriddenPeriods[plan.id] ?? [],
        selectedCandidateId:
          (db.candidates[plan.id] ?? []).find((candidate) => candidate.selected)?.id ??
          null,
        currentStep: plan.currentStep,
      },
      gates: db.gates[plan.id] ?? gateFixturesFor(plan.id),
      signOff: signOffContextFixture,
    });
  }

  if (verb === 'POST' && p('/clustering/plans')) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    const payload = (body ?? {}) as { name?: string };
    const id = `cp-new-${Date.now()}`;
    const plan: ClusterPlan = {
      id,
      name: payload.name?.trim() ?? '',
      productId: null,
      seasonId: null,
      channelId: null,
      countryIds: [],
      status: 'draft',
      currentStep: 'scope',
      clusterCount: null,
      channelLabelKey: 'channels.bnm',
      createdBy: db.actionedBy,
      createdOn: new Date().toISOString(),
      locked: false,
    };
    db.plans.push(plan);
    db.attributes[id] = attributeFixtures.map((row) => ({ ...row }));
    db.variants[id] = variantFixtures.map((row) => ({
      ...row,
      attributeIds: [...row.attributeIds],
    }));
    db.selectedPeriod[id] = null;
    db.selectedPeriods[id] = [];
    db.overriddenPeriods[id] = [];
    db.runMode[id] = 'gated';
    db.hierarchyScope[id] = [];
    db.clusterPlanCode[id] = null;
    db.gates[id] = gateFixturesFor(id);
    return ok({ plan: publicPlan(plan) }, 201);
  }

  if (verb === 'PATCH' && planIdParams) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    const result = requirePlan(planIdParams.id);
    if ('error' in result) return result.error;
    const plan = writablePlan(result.plan);
    if (plan.locked) return fail(409, 'PLAN_LOCKED', 'Plan is locked');
    const payload = (body ?? {}) as Partial<ClusterPlan> & {
      runMode?: ClusterRunMode;
      hierarchyScope?: HierarchyScopeEntry[];
      clusterPlanCode?: string | null;
      selectedPeriodId?: string | null;
      selectedPeriodIds?: string[];
      overriddenPeriodIds?: string[];
      currentStep?: WizardStep;
    };
    if (payload.name !== undefined) {
      const others = db.plans
        .filter((item) => item.id !== plan.id)
        .map((item) => item.name);
      if (isNameTaken(payload.name, others))
        return fail(409, 'NAME_TAKEN', 'Name already in use');
      plan.name = payload.name;
    }
    if (payload.productId !== undefined) plan.productId = payload.productId;
    if (payload.seasonId !== undefined) plan.seasonId = payload.seasonId;
    if (payload.channelId !== undefined) {
      plan.channelId = payload.channelId;
      if (payload.channelId) plan.channelLabelKey = `channels.${payload.channelId}`;
    }
    if (payload.countryIds !== undefined) {
      if (isOutOfScope(payload.countryIds, currentScope().countryIds)) {
        return fail(403, 'OUT_OF_SCOPE', 'Countries outside permission scope');
      }
      plan.countryIds = payload.countryIds;
    }
    if (payload.runMode !== undefined) db.runMode[plan.id] = payload.runMode;
    if (payload.hierarchyScope !== undefined)
      db.hierarchyScope[plan.id] = payload.hierarchyScope;
    if (payload.clusterPlanCode !== undefined)
      db.clusterPlanCode[plan.id] = payload.clusterPlanCode;
    if (payload.selectedPeriodIds !== undefined) {
      db.selectedPeriods[plan.id] = payload.selectedPeriodIds;
      db.selectedPeriod[plan.id] = payload.selectedPeriodIds[0] ?? null;
    } else if (payload.selectedPeriodId !== undefined) {
      db.selectedPeriod[plan.id] = payload.selectedPeriodId;
      db.selectedPeriods[plan.id] = payload.selectedPeriodId
        ? [payload.selectedPeriodId]
        : [];
    }
    if (payload.overriddenPeriodIds !== undefined) {
      db.overriddenPeriods[plan.id] = payload.overriddenPeriodIds;
    }
    if (payload.currentStep !== undefined) {
      if (payload.currentStep === 'reviewRun') {
        const check = validateScope(plan);
        if (!check.valid) return fail(422, 'INVALID_STEP', 'Scope is incomplete');
      }
      plan.currentStep = payload.currentStep;
      if (
        payload.currentStep === 'signOff' &&
        (db.candidates[plan.id] ?? []).some((candidate) => candidate.selected)
      ) {
        plan.status = 'awaitingApproval';
      }
    }
    if (payload.status) plan.status = payload.status;
    return ok({ plan: publicPlan(plan) });
  }

  const attrParams = p('/clustering/plans/:id/attributes');
  if (verb === 'GET' && attrParams) {
    const result = requirePlan(attrParams.id);
    if ('error' in result) return result.error;
    return ok({ attributes: db.attributes[attrParams.id] ?? [] });
  }

  const variantParams = p('/clustering/plans/:id/variants');
  if (verb === 'GET' && variantParams) {
    const result = requirePlan(variantParams.id);
    if ('error' in result) return result.error;
    return ok({ variants: db.variants[variantParams.id] ?? [] });
  }
  if (verb === 'PATCH' && variantParams) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    const result = requirePlan(variantParams.id);
    if ('error' in result) return result.error;
    const payload = (body ?? {}) as { variants: Variant[] };
    db.variants[variantParams.id] = payload.variants;
    return ok({ variants: payload.variants });
  }

  const periodParams = p('/clustering/plans/:id/reference-periods');
  if (verb === 'GET' && periodParams) {
    const result = requirePlan(periodParams.id);
    if ('error' in result) return result.error;
    return ok({
      periods: periodFixtures,
      insufficientHistory: result.plan.status === 'inputNeeded',
    });
  }

  const runsParams = p('/clustering/plans/:id/runs');
  if (verb === 'POST' && runsParams) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    const result = requirePlan(runsParams.id);
    if ('error' in result) return result.error;
    const { plan } = result;
    const variants = db.variants[plan.id] ?? [];
    if (variants.every((variant) => variant.removed))
      return fail(409, 'VARIANT_REQUIRED', 'A variant is required');
    if (!db.selectedPeriod[plan.id])
      return fail(409, 'PERIOD_REQUIRED', 'A reference period is required');
    const existing = db.latestRunId[plan.id]
      ? db.runs[db.latestRunId[plan.id]]
      : undefined;
    if (existing && (existing.status === 'queued' || existing.status === 'running')) {
      return fail(409, 'RUN_IN_PROGRESS', 'A run is already in progress');
    }
    const id = `run-${runSeq++}`;
    const run: RunRecord = {
      id,
      planId: plan.id,
      status: 'queued',
      startedAt: new Date().toISOString(),
      completedAt: null,
      expectedSeconds: 60,
      pollCount: 0,
      forceFail: Boolean(plan.forceFail),
    };
    db.runs[id] = run;
    db.latestRunId[plan.id] = id;
    return ok({ run: publicRun(run) }, 202);
  }

  const runParams = p('/clustering/plans/:id/runs/:runId');
  if (verb === 'GET' && runParams) {
    const result = requirePlan(runParams.id);
    if ('error' in result) return result.error;
    const run = db.runs[runParams.runId];
    if (!run) return fail(404, 'RUN_NOT_FOUND', 'Run not found');
    run.pollCount += 1;
    const elapsed = Date.now() - new Date(run.startedAt).getTime();
    if (run.status === 'queued' || run.status === 'running') {
      if (run.pollCount === 1 || elapsed < RUN_DELAY_MS) {
        run.status = 'running';
      } else if (run.forceFail) {
        run.status = 'failed';
        run.errorCode = 'AGENT_FAILED';
        run.completedAt = new Date().toISOString();
      } else {
        run.status = 'succeeded';
        run.completedAt = new Date().toISOString();
        run.proposedK = 4;
        run.modelFitPct = 0.87;
        db.candidates[run.planId] = candidateFixtures.map((row) => ({
          ...row,
          planId: run.planId,
          runId: run.id,
          selected: false,
        }));
        db.clusters[run.planId] = mapStoreKpisToCandidateView(
          getPerformanceClusterStores(),
          'cand-1',
        ).clusters;
      }
    }
    return ok({ run: publicRun(run) });
  }

  const candidatesParams = p('/clustering/plans/:id/candidates');
  if (verb === 'GET' && candidatesParams) {
    const result = requirePlan(candidatesParams.id);
    if ('error' in result) return result.error;
    return ok({ candidates: db.candidates[candidatesParams.id] ?? [] });
  }

  const selectionParams = p('/clustering/plans/:id/selection');
  if (verb === 'POST' && selectionParams) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    const result = requirePlan(selectionParams.id);
    if ('error' in result) return result.error;
    const plan = writablePlan(result.plan);
    const latest = db.latestRunId[plan.id];
    const run = latest ? db.runs[latest] : undefined;
    if (!run || run.status !== 'succeeded')
      return fail(409, 'NO_SUCCESSFUL_RUN', 'No successful run');
    const payload = (body ?? {}) as { candidateId: string };
    const list = db.candidates[plan.id] ?? [];
    db.candidates[plan.id] = list.map((candidate) => ({
      ...candidate,
      selected: candidate.id === payload.candidateId,
    }));
    plan.clusterCount =
      list.find((candidate) => candidate.id === payload.candidateId)?.k ?? null;
    return ok({ candidates: db.candidates[plan.id] });
  }

  const viewParams = p('/clustering/plans/:id/candidates/:candidateId/view');
  if (verb === 'GET' && viewParams) {
    const result = requirePlan(viewParams.id);
    if ('error' in result) return result.error;
    const view = mapStoreKpisToCandidateView(
      getPerformanceClusterStores(),
      viewParams.candidateId,
    );
    const weeks = clusteringConfigFixture.newStoreExclusionWeeks;
    view.assignments = applyStoreExclusion(view.assignments, weeks, new Date());
    const coverage = coverageFromAssignments(view.assignments);
    view.coverage = { ...coverage, exclusionNoteKey: 'finalize.coverage' };
    const renamed = db.clusters[viewParams.id];
    if (renamed && renamed.length > 0) {
      const byId = new Map(renamed.map((cluster) => [cluster.id, cluster]));
      view.clusters = view.clusters.map((cluster) => {
        const overlay = byId.get(cluster.id);
        return overlay
          ? { ...cluster, name: overlay.name, candidateId: viewParams.candidateId }
          : cluster;
      });
    } else {
      db.clusters[viewParams.id] = view.clusters.map((cluster) => ({ ...cluster }));
    }
    for (const pin of db.pins.filter((item) => item.planId === viewParams.id)) {
      const row = view.assignments.find(
        (assignment) => assignment.storeId === pin.storeId,
      );
      if (row && !row.excluded) {
        row.clusterId = pin.clusterId;
        row.pinned = true;
      }
    }
    return ok(view);
  }

  const clusterParams = p('/clustering/plans/:id/clusters/:clusterId');
  if (verb === 'PATCH' && clusterParams) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    const result = requirePlan(clusterParams.id);
    if ('error' in result) return result.error;
    const payload = (body ?? {}) as { name: string };
    const clusters =
      db.clusters[clusterParams.id] ??
      mapStoreKpisToCandidateView(getPerformanceClusterStores(), 'cand-1').clusters;
    db.clusters[clusterParams.id] = clusters.map((cluster) =>
      cluster.id === clusterParams.clusterId
        ? { ...cluster, name: payload.name }
        : cluster,
    );
    return ok({
      cluster: db.clusters[clusterParams.id].find(
        (cluster) => cluster.id === clusterParams.clusterId,
      ),
    });
  }

  const pinsParams = p('/clustering/plans/:id/pins');
  if (verb === 'POST' && pinsParams) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    const result = requirePlan(pinsParams.id);
    if ('error' in result) return result.error;
    const payload = (body ?? {}) as { storeId: string; clusterId: string };
    const view = mapStoreKpisToCandidateView(getPerformanceClusterStores(), 'cand-1');
    const assignment = applyStoreExclusion(view.assignments).find(
      (row) => row.storeId === payload.storeId,
    );
    if (!assignment) {
      if (!currentScope().storeIds.includes(payload.storeId)) {
        return fail(403, 'OUT_OF_SCOPE', 'Store is outside permission scope');
      }
      return fail(404, 'STORE_NOT_FOUND', 'Store is not in the dummy view');
    }
    if (assignment.excluded) return fail(409, 'STORE_EXCLUDED', 'Store is excluded');
    db.pins = db.pins.filter(
      (pin) => !(pin.planId === pinsParams.id && pin.storeId === payload.storeId),
    );
    db.pins.push({
      storeId: payload.storeId,
      planId: pinsParams.id,
      clusterId: payload.clusterId,
      createdBy: db.actionedBy,
      createdOn: new Date().toISOString(),
    });
    return ok({ pins: db.pins.filter((pin) => pin.planId === pinsParams.id) });
  }

  const unpinParams = p('/clustering/plans/:id/pins/:storeId');
  if (verb === 'DELETE' && unpinParams) {
    if (!personaHas('clustering:write'))
      return fail(403, 'FORBIDDEN', 'Write permission required');
    db.pins = db.pins.filter(
      (pin) => !(pin.planId === unpinParams.id && pin.storeId === unpinParams.storeId),
    );
    return { status: 204 };
  }

  const approveParams = p('/clustering/plans/:id/gates/2/approve');
  if (verb === 'POST' && approveParams) {
    if (!personaHas('clustering:approve'))
      return fail(403, 'FORBIDDEN', 'Approve permission required');
    const result = requirePlan(approveParams.id);
    if ('error' in result) return result.error;
    const { plan } = result;
    // Cards from the live `/runs` API are selected in the store and approved via the live
    // `/approved` API, so the mock db holds no candidates for them. The selection check only
    // applies to mock-run candidates this db actually knows about.
    const mockCandidates = db.candidates[plan.id] ?? [];
    if (
      mockCandidates.length > 0 &&
      !mockCandidates.some((candidate) => candidate.selected)
    ) {
      return fail(409, 'CANDIDATE_REQUIRED', 'A candidate must be selected');
    }
    const now = new Date().toISOString();
    db.gates[plan.id] = (db.gates[plan.id] ?? gateFixturesFor(plan.id)).map((gate) =>
      gate.gate === 2
        ? { ...gate, status: 'approved', actionedBy: db.actionedBy, actionedOn: now }
        : gate,
    );
    return ok({ gates: db.gates[plan.id] });
  }

  const rejectParams = p('/clustering/plans/:id/gates/2/reject');
  if (verb === 'POST' && rejectParams) {
    if (!personaHas('clustering:approve'))
      return fail(403, 'FORBIDDEN', 'Approve permission required');
    const result = requirePlan(rejectParams.id);
    if ('error' in result) return result.error;
    const plan = writablePlan(result.plan);
    db.candidates[plan.id] = (db.candidates[plan.id] ?? []).map((candidate) => ({
      ...candidate,
      selected: false,
    }));
    plan.currentStep = 'finalize';
    plan.status = 'draft';
    plan.clusterCount = null;
    const now = new Date().toISOString();
    db.gates[plan.id] = (db.gates[plan.id] ?? gateFixturesFor(plan.id)).map((gate) =>
      gate.gate === 2
        ? { ...gate, status: 'rejected', actionedBy: db.actionedBy, actionedOn: now }
        : gate,
    );
    return ok({ plan: publicPlan(plan), gates: db.gates[plan.id] });
  }

  const signOffParams = p('/clustering/plans/:id/gates/3/signoff');
  if (verb === 'POST' && signOffParams) {
    if (!personaHas('clustering:signoff'))
      return fail(403, 'FORBIDDEN', 'Sign-off permission required');
    const result = requirePlan(signOffParams.id);
    if ('error' in result) return result.error;
    const plan = writablePlan(result.plan);
    const gate2 = (db.gates[plan.id] ?? []).find((gate) => gate.gate === 2);
    if (gate2?.status !== 'approved')
      return fail(409, 'GATE2_PENDING', 'Gate 2 is not approved');
    const now = new Date().toISOString();
    const winner = (db.candidates[plan.id] ?? []).find((candidate) => candidate.selected);
    plan.status = 'approved';
    plan.locked = true;
    plan.clusterCount = winner?.k ?? plan.clusterCount;
    db.gates[plan.id] = (db.gates[plan.id] ?? gateFixturesFor(plan.id)).map((gate) =>
      gate.gate === 3
        ? { ...gate, status: 'signedOff', actionedBy: db.actionedBy, actionedOn: now }
        : gate,
    );
    return ok({ plan: publicPlan(plan), gates: db.gates[plan.id] });
  }

  return fail(404, 'NOT_FOUND', 'Unknown clustering mock route');
}

function toMsw(result: ClusteringMockResult) {
  if (result.status === 204) return new HttpResponse(null, { status: 204 });
  return HttpResponse.json(result.body as unknown as JsonBodyType, {
    status: result.status,
  });
}

export const clusteringHandlers = [
  http.all(/\/api\/clustering(\/|\?|$)/, async ({ request }) => {
    const url = new URL(request.url);
    const apiIndex = url.pathname.indexOf('/api/');
    const clusteringPath =
      (apiIndex >= 0 ? url.pathname.slice(apiIndex + 4) : url.pathname) + url.search;
    const payload = ['POST', 'PATCH', 'PUT'].includes(request.method)
      ? await request.json().catch(() => undefined)
      : undefined;
    return toMsw(await handleClusteringRequest(request.method, clusteringPath, payload));
  }),
];

/**
 * Test-only stand-in for the live `POST /v1/clustering/plans` (Go backend). Echoes the
 * request the way the backend does — `attributes` are the submitted fields, re-keyed in
 * snake_case — so integration tests can assert the payload and the returned code.
 */
export const clusteringTestHandlers = [
  http.get('*/v1/clustering/plans', ({ request }) => {
    const path = new URL(request.url).pathname.replace(/\/$/, '');
    if (!path.endsWith('/v1/clustering/plans')) return passthrough();
    return HttpResponse.json([]);
  }),
  http.post('*/v1/clustering/plans', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const clusterPlanCode = `cpc-${String(body.clusterName ?? 'plan')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}`;
    return HttpResponse.json({
      clusterPlanCode,
      clusterPlanName: body.clusterName ?? '',
      description: '',
      status: 'USER_INPUT_NEEDED',
      attributes: [
        {
          attributeName: 'target_season_code',
          attributeValue: String(body.targetSeasonCode ?? ''),
          clusterPlanCode,
        },
        {
          attributeName: 'channel_code',
          attributeValue: JSON.stringify(body.channelCode ?? []),
          clusterPlanCode,
        },
        {
          attributeName: 'clustering_mode',
          attributeValue: body.clusteringMode ?? 'GATED',
          clusterPlanCode,
        },
      ],
    });
  }),
  // Scope → Review: bodyless POST returns Auto-Selected Attributes for the created plan.
  http.post(
    '*/v1/clustering/plans/attributes/significance-score/:clusterPlanCode',
    ({ params }) =>
      HttpResponse.json(
        attributeSignificanceScoreFixture(String(params.clusterPlanCode)),
      ),
  ),
  // Confirm: persist selected attributes, then generate variants. PUT is any 2xx.
  http.put('*/v1/clustering/plans/attributes/final/:clusterPlanCode', () =>
    HttpResponse.json({ status: true }),
  ),
  // Must precede `variants/:clusterPlanCode` or MSW captures `custom` as the plan code.
  http.post('*/v1/clustering/plans/attributes/variants/custom', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      clusterPlanCode?: unknown;
    };
    const clusterPlanCode =
      typeof body.clusterPlanCode === 'string' ? body.clusterPlanCode : '';
    return HttpResponse.json(customVariantFixture(clusterPlanCode));
  }),
  http.post('*/v1/clustering/plans/attributes/variants/:clusterPlanCode', ({ params }) =>
    HttpResponse.json(generateVariantsFixture(String(params.clusterPlanCode))),
  ),
  http.get('*/v1/clustering/plans/attributes/variants/:clusterPlanCode', ({ params }) =>
    HttpResponse.json(generateVariantsFixture(String(params.clusterPlanCode))),
  ),
  // Finalise Cluster: persist kept variant ids, then POST runs. PUT is any 2xx.
  http.put('*/v1/clustering/plans/attributes/variants/confirm/:clusterPlanCode', () =>
    HttpResponse.json({ status: true }),
  ),
  // Finalize AI narration. The Hindsight summarize handler yields to this for the clustering
  // card types. `cluster`: `response` for the section, one `cards[]` entry per run variant.
  // `cluster_performance`: one sentence for the Cluster Plans table. `cluster_attribute`: one
  // sentence for the Attribute Grades chart, naming the plotted metric.
  http.post('*/v1/summarize', async ({ request }) => {
    const body = (await request.clone().json().catch(() => null)) as {
      cardType?: unknown;
      clusterPlanCode?: unknown;
      metric?: unknown;
    } | null;
    if (body?.cardType === 'cluster_performance') {
      return HttpResponse.json(clusterPerformanceSummaryFixture());
    }
    if (body?.cardType === 'cluster_attribute') {
      return HttpResponse.json(
        attributeGradesSummaryFixture(
          typeof body.metric === 'string' ? body.metric : undefined,
        ),
      );
    }
    if (body?.cardType !== 'cluster') return passthrough();
    const code = typeof body.clusterPlanCode === 'string' ? body.clusterPlanCode : '';
    return HttpResponse.json(
      clusterVariantSummaryFixture(
        clusterRunFixture(code).variants.map(({ variantId, name }) => ({ variantId, name })),
      ),
    );
  }),
  // `POST /v1/clustering/plans/{code}/runs` — one result per requested variant, same order.
  http.get('*/v1/clustering/plans/:clusterPlanCode/cluster-variants', ({ params }) =>
    HttpResponse.json(clusterRunFixture(String(params.clusterPlanCode))),
  ),
  http.post(
    '*/v1/clustering/plans/:clusterPlanCode/runs',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => null)) as {
        variants?: Array<{ name?: unknown }>;
      } | null;
      const names = Array.isArray(body?.variants)
        ? body.variants.map((variant, index) =>
            typeof variant.name === 'string' ? variant.name : `Variant ${index + 1}`,
          )
        : undefined;
      return HttpResponse.json(clusterRunFixture(String(params.clusterPlanCode), names));
    },
  ),
  // Sign-Off resume: GET the selected Finalize variant for Gate 2.
  http.get('*/v1/clustering/plans/:clusterPlanCode/selected-variant', ({ params }) => {
    const run = clusterRunFixture(String(params.clusterPlanCode));
    const variant = run.variants[0];
    return HttpResponse.json({
      clusterPlanCode: run.clusterPlanCode,
      ...variant,
    });
  }),
  // `PUT /v1/clustering/plans/{code}/update_cluster_name` — edited summary names.
  http.put(
    '*/v1/clustering/plans/:clusterPlanCode/update_cluster_name',
    async ({ request }) => {
      const body = (await request.json().catch(() => null)) as {
        variantId?: unknown;
        renames?: unknown;
      } | null;
      const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
      if (!variantId || !Array.isArray(body?.renames) || body.renames.length === 0) {
        return HttpResponse.json(
          { message: 'variantId and renames are required' },
          { status: 400 },
        );
      }
      return HttpResponse.json({ data: { variantId } });
    },
  ),
  // `POST /v1/clustering/plans/{code}/selected-variant` — Final Sign Off.
  http.post(
    '*/v1/clustering/plans/:clusterPlanCode/selected-variant',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => null)) as {
        variantId?: unknown;
      } | null;
      const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
      if (!variantId) {
        return HttpResponse.json({ message: 'variantId is required' }, { status: 400 });
      }
      return HttpResponse.json({
        clusterPlanCode: String(params.clusterPlanCode),
        variantId,
      });
    },
  ),
  // `POST /v1/clustering/plans/{code}/approved` — echoes the submitted variantId.
  http.post(
    '*/v1/clustering/plans/:clusterPlanCode/approved',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => null)) as {
        variantId?: unknown;
      } | null;
      const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
      if (!variantId) {
        return HttpResponse.json({ message: 'variantId is required' }, { status: 400 });
      }
      return HttpResponse.json(
        clusterApprovalFixture(String(params.clusterPlanCode), variantId),
      );
    },
  ),
  // `POST /v1/clustering/season_info` — LY / LLY reference periods for the selected season.
  http.post('*/v1/clustering/season_info', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      seasonCode?: unknown;
      name?: unknown;
    } | null;
    if (
      typeof body?.seasonCode !== 'number' ||
      typeof body?.name !== 'string' ||
      !body.name
    ) {
      return HttpResponse.json(
        { message: 'seasonCode and name are required' },
        { status: 400 },
      );
    }
    return HttpResponse.json(seasonInfosFixture(body.seasonCode));
  }),
  // `PUT /v1/clustering/plans/state-transition/{code}` — Gate 2 approve / reject.
  http.put(
    '*/v1/clustering/plans/state-transition/:clusterPlanCode',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => null)) as {
        section?: unknown;
        decision?: unknown;
      } | null;
      const section = body?.section;
      if (section === 'final_signoff') {
        if (body && 'decision' in body) {
          return HttpResponse.json(
            { message: 'final_signoff takes no decision' },
            { status: 400 },
          );
        }
      } else if (section === 'gate_2_approval') {
        if (body?.decision !== 'approved' && body?.decision !== 'reject') {
          return HttpResponse.json(
            { message: 'decision must be approved or reject' },
            { status: 400 },
          );
        }
      } else {
        return HttpResponse.json({ message: 'unknown section' }, { status: 400 });
      }
      return HttpResponse.json(
        stateTransitionFixture(String(params.clusterPlanCode), section),
      );
    },
  ),
  // `POST /v1/clustering/plans/{code}/store_assignments` with body `{ variantId }` — Finalize →
  // Store Assignments panel. `variantId` is required.
  http.post(
    '*/v1/clustering/plans/:clusterPlanCode/store_assignments',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => null)) as {
        variantId?: unknown;
      } | null;
      const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
      if (!variantId) {
        return HttpResponse.json({ message: 'variantId is required' }, { status: 400 });
      }
      const clusterPlanCode = String(params.clusterPlanCode);
      return HttpResponse.json(
        applyStoreMoves(
          storeAssignmentsFixture(clusterPlanCode, variantId),
          clusterPlanCode,
          variantId,
        ),
      );
    },
  ),
  // `POST /v1/clustering/plans/{code}/move_stores` — Finalize → Store Assignments Move To.
  http.post(
    '*/v1/clustering/plans/:clusterPlanCode/move_stores',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => null)) as {
        variantId?: unknown;
        moves?: unknown;
      } | null;
      const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
      const moves = Array.isArray(body?.moves) ? body.moves : [];
      if (!variantId || moves.length === 0) {
        return HttpResponse.json(
          { message: 'variantId and moves are required' },
          { status: 400 },
        );
      }
      const clusterPlanCode = String(params.clusterPlanCode);
      const key = storeMoveKey(clusterPlanCode, variantId);
      const overlay = storeMoveOverlay[key] ?? {};
      for (const item of moves) {
        if (typeof item !== 'object' || item === null) {
          return HttpResponse.json({ message: 'invalid move' }, { status: 400 });
        }
        const move = item as Record<string, unknown>;
        const storeCode =
          typeof move.storeCode === 'string'
            ? move.storeCode
            : typeof move.storeCode === 'number'
              ? String(move.storeCode)
              : '';
        const readOptional = (value: unknown): string | undefined =>
          typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
        if (!storeCode) {
          return HttpResponse.json({ message: 'invalid move' }, { status: 400 });
        }
        const productLabel = readOptional(move.productLabel);
        const performanceLabel = readOptional(move.performanceLabel);
        const storeLabel = readOptional(move.storeLabel);
        overlay[storeCode] = {
          ...(productLabel ? { productLabel } : {}),
          ...(performanceLabel ? { performanceLabel } : {}),
          ...(storeLabel ? { storeLabel } : {}),
        };
      }
      storeMoveOverlay[key] = overlay;
      return HttpResponse.json({ ok: true });
    },
  ),
  // `POST /v1/clustering/performance/info` with `{ variantId, clusterPlanCode }` —
  // Finalize → Performance Clusters scatter. Both ids are required.
  http.post('*/v1/clustering/performance/info', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      variantId?: unknown;
      clusterPlanCode?: unknown;
    } | null;
    const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
    const clusterPlanCode =
      typeof body?.clusterPlanCode === 'string' ? body.clusterPlanCode : '';
    if (!variantId || !clusterPlanCode) {
      return HttpResponse.json(
        { message: 'variantId and clusterPlanCode are required' },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      data: performanceInfoFixture(clusterPlanCode, variantId),
    });
  }),
  // `POST /v1/clustering/get-cluster-plans` with `{ variantId, clusterPlanCode }` —
  // Finalize → Cluster Summary. Both ids are required. Outer `{ data }` wraps the inner body.
  http.post('*/v1/clustering/get-cluster-plans', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      variantId?: unknown;
      clusterPlanCode?: unknown;
    } | null;
    const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
    const clusterPlanCode =
      typeof body?.clusterPlanCode === 'string' ? body.clusterPlanCode : '';
    if (!variantId || !clusterPlanCode) {
      return HttpResponse.json(
        { message: 'variantId and clusterPlanCode are required' },
        { status: 400 },
      );
    }
    return HttpResponse.json({ data: clusterPlansFixture() });
  }),
  // `POST /v1/clustering/kpi-breakdown` with `{ variantId, clusterPlanCode }` —
  // Finalize → Full KPI Breakdown. Both ids are required.
  http.post('*/v1/clustering/kpi-breakdown', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      variantId?: unknown;
      clusterPlanCode?: unknown;
    } | null;
    const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
    const clusterPlanCode =
      typeof body?.clusterPlanCode === 'string' ? body.clusterPlanCode : '';
    if (!variantId || !clusterPlanCode) {
      return HttpResponse.json(
        { message: 'variantId and clusterPlanCode are required' },
        { status: 400 },
      );
    }
    return HttpResponse.json({ data: kpiBreakdownFixture() });
  }),
  http.post('*/v1/clustering/attributes/product-list', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      variantId?: unknown;
      clusterPlanCode?: unknown;
    } | null;
    const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
    const clusterPlanCode =
      typeof body?.clusterPlanCode === 'string' ? body.clusterPlanCode : '';
    if (!variantId || !clusterPlanCode) {
      return HttpResponse.json(
        { message: 'variantId and clusterPlanCode are required' },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      data: {
        attributes: [
          {
            label: 'Atricle Value Stream Description',
            value: 'articleValueStreamDescription',
          },
          { label: 'Color', value: 'color' },
        ],
      },
    });
  }),
  http.post('*/v1/clustering/attributes/info', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      variantId?: unknown;
      clusterPlanCode?: unknown;
      attribute?: unknown;
    } | null;
    const variantId = typeof body?.variantId === 'string' ? body.variantId : '';
    const clusterPlanCode =
      typeof body?.clusterPlanCode === 'string' ? body.clusterPlanCode : '';
    const attribute = typeof body?.attribute === 'string' ? body.attribute : '';
    if (!variantId || !clusterPlanCode || !attribute) {
      return HttpResponse.json(
        { message: 'variantId, clusterPlanCode, and attribute are required' },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      data: {
        chartType: 'barchart',
        component: 'attribute_grades',
        metric: attribute,
        encoding: {
          x: 'cluster',
          y: 'metric',
          versions: ['Core', 'Seasonal'],
        },
        dataset: [
          {
            Core: 21.9,
            Seasonal: 34.2,
            cluster: 'BnM Tasman__ia_char_03Marlborough',
          },
        ],
      },
    });
  }),
  // `GET /v1/auth/me` — the authenticated user, displayed as the Gate 3 approver.
  http.get('*/v1/auth/me', () => HttpResponse.json(authMeFixture)),
  http.get(
    '*/v1/clustering/plans/attributes/significance-score/:clusterPlanCode',
    ({ params }) =>
      HttpResponse.json(
        attributeSignificanceScoreFixture(String(params.clusterPlanCode)),
      ),
  ),
  // `GET /v1/clustering/plans/attributes/{code}` — echoes the requested code so tests can assert
  // the chain used exactly the code the create call returned.
  http.get('*/v1/clustering/plans/attributes/:clusterPlanCode', ({ params }) => {
    const clusterPlanCode = String(params.clusterPlanCode);
    return HttpResponse.json({
      attributes: [
        { attributeName: 'channel_code', attributeValue: [10] },
        { attributeName: 'l0_name', attributeValue: ['Rebel Sport'] },
        { attributeName: 'l1_name', attributeValue: ['810-Indoor Sport'] },
        { attributeName: 'target_season_code', attributeValue: 3 },
      ],
      clusterPlan: {
        clusterPlanCode,
        clusterPlanName: 'test_1',
        description: '',
        isDeleted: false,
        status: 'USER_INPUT_NEEDED',
      },
    });
  }),
];
