import type { CreateClusterPlanResponse } from '../api/createClusterPlan';
import type { ClusterDraft, ClusterPlan, ClusterPlanAttribute } from '../types';

function attributeEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Merge create-response attributes with Scope selections the echo may omit (e.g. L0/L1).
 * The `/clustering/:planId` remount hydrates from this snapshot, so product hierarchy must
 * survive even when the POST body is not round-tripped on `attributes`.
 */
export function snapshotAttributesFromCreate(
  draft: ClusterDraft,
  created: CreateClusterPlanResponse,
): ClusterPlanAttribute[] {
  const byName = new Map<string, ClusterPlanAttribute>();
  for (const attribute of created.attributes ?? []) {
    if (attribute.attributeName) {
      byName.set(attribute.attributeName, {
        attributeName: attribute.attributeName,
        attributeValue: attribute.attributeValue,
      });
    }
  }
  const ensure = (name: string, value: unknown) => {
    if (attributeEmpty(value)) return;
    const existing = byName.get(name);
    if (existing && !attributeEmpty(existing.attributeValue)) return;
    byName.set(name, { attributeName: name, attributeValue: value });
  };
  const seasonCode = Number(draft.seasonId);
  ensure('target_season_code', Number.isInteger(seasonCode) ? seasonCode : draft.seasonId);
  if (draft.channelId) ensure('channel_code', [draft.channelId]);
  if (draft.countryIds.length > 0) ensure('countries', draft.countryIds);
  ensure('clustering_mode', draft.runMode === 'autonomous' ? 'AUTONOMOUS' : 'GATED');
  for (const entry of draft.hierarchyScope) {
    if (entry.selectedValues.length > 0) {
      ensure(entry.levelNo, entry.selectedValues);
    }
  }
  return [...byName.values()];
}

/** Listing-shaped snapshot stored in `location.state` after Scope create succeeds. */
export function clusterPlanSnapshotFromCreate(
  draft: ClusterDraft,
  created: CreateClusterPlanResponse,
): ClusterPlan {
  return {
    id: created.clusterPlanCode,
    name: created.clusterPlanName || draft.name,
    productId: draft.productId,
    seasonId: draft.seasonId,
    channelId: draft.channelId,
    countryIds: draft.countryIds,
    status: 'draft',
    statusDisplayName: created.status ?? null,
    substatus: 'ATTRIBUTE_SELECTION_PENDING',
    attributes: snapshotAttributesFromCreate(draft, created),
    currentStep: 'reviewRun',
    clusterCount: null,
    channelDisplay: draft.channelId,
    channelLabelKey: null,
    createdBy: null,
    createdOn: null,
    locked: false,
  };
}
