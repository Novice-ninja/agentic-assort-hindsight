import { http, HttpResponse } from 'msw';
import { clusterRunFixture } from '@tests/fixtures/clustering';

/** Local-only session state for plans created through the recovered wizard. */
interface LocalClusterPlan {
  attributes: Array<{ attributeName: string; attributeValue: unknown }>;
  clusterPlan: {
    clusterPlanCode: string;
    clusterPlanName: string;
    description: string;
    isDeleted: boolean;
    status: string;
    substatus: string;
    clusterCount: number | null;
    createdBy: string;
    createdAt: string;
  };
  run?: ReturnType<typeof clusterRunFixture>;
  selectedVariantId?: string;
}

const localPlans = new Map<string, LocalClusterPlan>();
const dto = (plan: LocalClusterPlan) => ({ attributes: plan.attributes, clusterPlan: plan.clusterPlan });
const badRequest = (message: string) => HttpResponse.json({ message }, { status: 400 });
const readBody = async (request: Request): Promise<Record<string, unknown>> =>
  (await request.json().catch(() => ({}))) as Record<string, unknown>;
const rowFor = (value: unknown) => localPlans.get(String(value));

function transition(plan: LocalClusterPlan, status: string, substatus: string) {
  plan.clusterPlan.status = status;
  plan.clusterPlan.substatus = substatus;
}

export function resetLocalClusteringPlans(): void {
  localPlans.clear();
}

/**
 * The preview's shared test handlers echo create calls but always list zero plans.
 * Keep that empty initial state, and remember only locally created plans. Unrelated
 * fixture requests fall through to their recovered implementations unchanged.
 */
export const localClusteringHandlers = [
  http.get('*/v1/clustering/plans', () =>
    HttpResponse.json([...localPlans.values()].filter((p) => !p.clusterPlan.isDeleted).map(dto)),
  ),
  http.post('*/v1/clustering/plans', async ({ request }) => {
    const body = await readBody(request);
    const name = typeof body.clusterName === 'string' ? body.clusterName.trim() : '';
    if (!name) return badRequest('Cluster name is required');
    if ([...localPlans.values()].some((p) => !p.clusterPlan.isDeleted && p.clusterPlan.clusterPlanName.toLowerCase() === name.toLowerCase())) {
      return HttpResponse.json({ message: 'A cluster plan with this name already exists.' }, { status: 409 });
    }
    const base = `cpc-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    let code = base;
    let suffix = 2;
    while (localPlans.has(code)) code = `${base}-${suffix++}`;
    const attributes = [
      { attributeName: 'target_season_code', attributeValue: body.targetSeasonCode },
      { attributeName: 'channel_code', attributeValue: body.channelCode ?? [] },
      { attributeName: 'l0_name', attributeValue: body.l0Name ?? [] },
      { attributeName: 'l1_name', attributeValue: body.l1Name ?? [] },
      { attributeName: 'clustering_mode', attributeValue: body.clusteringMode ?? 'GATED' },
      { attributeName: 'base_line_data', attributeValue: body.baseLineData ?? {} },
    ];
    const plan: LocalClusterPlan = {
      attributes,
      clusterPlan: {
        clusterPlanCode: code,
        clusterPlanName: name,
        description: '',
        isDeleted: false,
        status: 'USER_INPUT_NEEDED',
        substatus: 'ATTRIBUTE_SELECTION_PENDING',
        clusterCount: null,
        createdBy: 'qa@impactanalytics.co',
        createdAt: new Date().toISOString(),
      },
    };
    localPlans.set(code, plan);
    return HttpResponse.json({ ...plan.clusterPlan, attributes });
  }),
  http.post('*/v1/clustering/plans/delete', async ({ request }) => {
    const body = await readBody(request);
    const codes = Array.isArray(body.clusterPlanCodes) ? body.clusterPlanCodes.map(String) : [];
    if (codes.length === 0) return badRequest('clusterPlanCodes is required');
    return HttpResponse.json({ results: codes.map((code) => {
      const plan = localPlans.get(code);
      if (plan) plan.clusterPlan.isDeleted = true;
      return { clusterPlanCode: code, deleted: Boolean(plan) };
    }) });
  }),
  http.get('*/v1/clustering/plans/attributes/:clusterPlanCode', ({ params }) => {
    const plan = rowFor(params.clusterPlanCode);
    return plan ? HttpResponse.json(dto(plan)) : undefined;
  }),
  http.put('*/v1/clustering/plans/attributes/final/:clusterPlanCode', ({ params }) => {
    const plan = rowFor(params.clusterPlanCode);
    if (!plan) return undefined;
    transition(plan, 'USER_INPUT_NEEDED', 'VARIANT_SELECTION_PENDING');
    return HttpResponse.json({ status: true });
  }),
  http.put('*/v1/clustering/plans/attributes/variants/confirm/:clusterPlanCode', ({ params }) => {
    const plan = rowFor(params.clusterPlanCode);
    if (!plan) return undefined;
    transition(plan, 'USER_INPUT_NEEDED', 'SELECT_FINAL_CLUSTER_VARIANT_PENDING');
    return HttpResponse.json({ status: true });
  }),
  http.post('*/v1/clustering/plans/:clusterPlanCode/runs', async ({ params, request }) => {
    const plan = rowFor(params.clusterPlanCode);
    if (!plan) return undefined;
    const body = await readBody(request);
    const names = Array.isArray(body.variants) ? body.variants.map((entry, index) => {
      const name = typeof entry === 'object' && entry !== null ? (entry as { name?: unknown }).name : undefined;
      return typeof name === 'string' ? name : `Variant ${index + 1}`;
    }) : undefined;
    plan.run = clusterRunFixture(plan.clusterPlan.clusterPlanCode, names);
    plan.selectedVariantId = plan.run.variants[0]?.variantId;
    plan.clusterPlan.clusterCount = plan.run.variants[0]?.chosenK ?? null;
    transition(plan, 'USER_INPUT_NEEDED', 'SELECT_FINAL_CLUSTER_VARIANT_PENDING');
    return HttpResponse.json(plan.run);
  }),
  http.get('*/v1/clustering/plans/:clusterPlanCode/cluster-variants', ({ params }) => {
    const plan = rowFor(params.clusterPlanCode);
    return plan?.run ? HttpResponse.json(plan.run) : undefined;
  }),
  http.post('*/v1/clustering/plans/:clusterPlanCode/selected-variant', async ({ params, request }) => {
    const plan = rowFor(params.clusterPlanCode);
    if (!plan) return undefined;
    const body = await readBody(request);
    if (typeof body.variantId !== 'string' || !body.variantId) return badRequest('variantId is required');
    plan.selectedVariantId = body.variantId;
    const selected = plan.run?.variants.find((v) => v.variantId === body.variantId);
    if (selected) plan.clusterPlan.clusterCount = selected.chosenK;
    // The recovered wizard posts this resource when "Final Sign Off" advances
    // from Finalize to Gate 2; it does not make a separate final_signoff PUT.
    transition(plan, 'AWAITING_APPROVAL', 'GATE_2_APPROVAL_PENDING');
    return HttpResponse.json({ clusterPlanCode: plan.clusterPlan.clusterPlanCode, variantId: body.variantId });
  }),
  http.get('*/v1/clustering/plans/:clusterPlanCode/selected-variant', ({ params }) => {
    const plan = rowFor(params.clusterPlanCode);
    if (!plan?.run) return undefined;
    const selected = plan.run.variants.find((v) => v.variantId === plan.selectedVariantId) ?? plan.run.variants[0];
    return HttpResponse.json({ clusterPlanCode: plan.clusterPlan.clusterPlanCode, ...selected });
  }),
  http.put('*/v1/clustering/plans/state-transition/:clusterPlanCode', async ({ params, request }) => {
    const plan = rowFor(params.clusterPlanCode);
    if (!plan) return undefined;
    const body = await readBody(request);
    if (body.section === 'final_signoff' && !('decision' in body)) {
      transition(plan, 'AWAITING_APPROVAL', 'GATE_2_APPROVAL_PENDING');
    } else if (body.section === 'gate_2_approval' && body.decision === 'approved') {
      transition(plan, 'AWAITING_APPROVAL', 'GATE_3_APPROVAL_PENDING');
    } else if (body.section === 'gate_2_approval' && body.decision === 'reject') {
      transition(plan, 'USER_INPUT_NEEDED', 'SELECT_FINAL_CLUSTER_VARIANT_PENDING');
    } else return badRequest('Unknown section or decision');
    return HttpResponse.json({ clusterPlanCode: plan.clusterPlan.clusterPlanCode, section: body.section, status: plan.clusterPlan.status, substatus: plan.clusterPlan.substatus });
  }),
  http.post('*/v1/clustering/plans/:clusterPlanCode/approved', async ({ params, request }) => {
    const plan = rowFor(params.clusterPlanCode);
    if (!plan) return undefined;
    const body = await readBody(request);
    if (typeof body.variantId !== 'string' || !body.variantId) return badRequest('variantId is required');
    const selected = plan.run?.variants.find((v) => v.variantId === body.variantId);
    if (!selected) return badRequest('Unknown variant');
    plan.selectedVariantId = body.variantId;
    plan.clusterPlan.clusterCount = selected.chosenK;
    transition(plan, 'APPROVED', 'FINALIZED');
    return HttpResponse.json({ clusterPlanCode: plan.clusterPlan.clusterPlanCode, variantId: body.variantId, approvedVariantId: `${body.variantId}-approved`, approvedVariantName: selected.name, chosenK: selected.chosenK, stores: selected.stores });
  }),
];
