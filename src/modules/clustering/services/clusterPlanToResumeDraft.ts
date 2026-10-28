import type { HierarchyScopeEntry } from '@modules/planning/types';
import type {
  ClusterDraft,
  ClusterPlan,
  ClusterPlanAttribute,
  ClusterPlanLanding,
  ClusterRunMode,
} from '../types';

function attributesOf(plan: ClusterPlan): ClusterPlanAttribute[] {
  return Array.isArray(plan.attributes) ? plan.attributes : [];
}

function attributeValue(plan: ClusterPlan, name: string): unknown {
  return attributesOf(plan).find((item) => item.attributeName === name)?.attributeValue;
}

function stringList(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  return raw
    .map((item) => (typeof item === 'number' && Number.isFinite(item) ? String(item) : item))
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim());
}

function optionalId(value: unknown): string | null {
  const [first] = stringList(value);
  return first ?? null;
}

function runMode(value: unknown): ClusterRunMode {
  const raw = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return raw === 'AUTONOMOUS' ? 'autonomous' : 'gated';
}

function hierarchyScope(plan: ClusterPlan): HierarchyScopeEntry[] {
  const l0 = stringList(attributeValue(plan, 'l0_name'));
  const l1 = stringList(attributeValue(plan, 'l1_name'));
  const entries: HierarchyScopeEntry[] = [];
  if (l0.length > 0) {
    entries.push({ levelName: 'Sales Organisation', levelNo: 'l0_name', selectedValues: l0 });
  }
  if (l1.length > 0) {
    entries.push({ levelName: 'Category', levelNo: 'l1_name', selectedValues: l1 });
  }
  return entries;
}

function baselinePeriodIds(plan: ClusterPlan): string[] {
  const baseline = attributeValue(plan, 'baseline_data');
  if (typeof baseline !== 'object' || baseline === null) return [];
  const ids: string[] = [];
  for (const key of ['ly', 'lly'] as const) {
    const share = (baseline as Record<string, unknown>)[key];
    if (typeof share !== 'object' || share === null) continue;
    const code = (share as { seasonCode?: unknown }).seasonCode;
    const id = optionalId(code);
    if (id) ids.push(id);
  }
  return ids;
}

/** Builds the in-memory wizard draft from a listing snapshot + resolved landing. */
export function clusterPlanToResumeDraft(
  plan: ClusterPlan,
  landing: ClusterPlanLanding,
): ClusterDraft {
  const selectedPeriodIds = baselinePeriodIds(plan);
  return {
    planId: plan.id,
    name: plan.name,
    productId: plan.productId,
    seasonId: optionalId(attributeValue(plan, 'target_season_code')) ?? plan.seasonId,
    channelId: optionalId(attributeValue(plan, 'channel_code')) ?? plan.channelId,
    countryIds:
      stringList(attributeValue(plan, 'countries')).length > 0
        ? stringList(attributeValue(plan, 'countries'))
        : plan.countryIds,
    hierarchyScope: hierarchyScope(plan),
    runMode: runMode(attributeValue(plan, 'clustering_mode')),
    clusterPlanCode: plan.id,
    attributeOverrides: {},
    confirmedAttributeKey: null,
    selectedPeriodId: selectedPeriodIds[0] ?? null,
    selectedPeriodIds,
    overriddenPeriodIds: [],
    selectedCandidateId: null,
    currentStep: landing.step,
    landingSection: landing.section,
    resumeSection: landing.section,
  };
}
