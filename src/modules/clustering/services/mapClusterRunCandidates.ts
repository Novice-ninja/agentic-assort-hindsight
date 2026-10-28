import { decodeIaString } from '@shared/utils/format';
import type { ClusterRunResponse, ClusterRunVariant } from '../api/runClusterPlan';
import type { ClusterResultCandidate } from '../types';

/**
 * Maps one run-API variant to a "3 Best" card. Only fields the API provides are filled:
 * `name`, `chosenK`, `stores`, `clusters[]`, `scores`, `isSelected`, `isRecommended`.
 * Separation is `scores.silhouette`, Stability is `scores.stability`; business fit and
 * stores-changing stay `null` rather than being invented. `isRecommended` is the badge;
 * `isSelected` is the default card.
 */
export function mapClusterRunCandidate(
  variant: ClusterRunVariant,
  index: number,
  context: { planId: string; clusterPlanCode: string; selectedId?: string | null },
): ClusterResultCandidate {
  const id = variant.variantId.trim() || `${context.clusterPlanCode}-variant-${index + 1}`;
  return {
    id,
    planId: context.planId,
    runId: context.clusterPlanCode,
    variantId: id,
    name: decodeIaString(variant.name),
    k: variant.chosenK,
    separation: variant.scores.silhouette,
    stability: variant.scores.stability,
    businessFit: null,
    storesPerCluster: variant.clusters.map((cluster) => cluster.stores),
    storesChangedCount: null,
    storesChangedPct: null,
    recommended: variant.isRecommended === true,
    selected: context.selectedId === id,
    storesTotal: variant.stores,
    clusters: variant.clusters.map((cluster) => ({
      label: decodeIaString(cluster.label),
      stores: cluster.stores,
    })),
    scores: { ...variant.scores },
  };
}

/**
 * Mock candidates have no API `isSelected`. Keep an existing pick, otherwise the
 * recommended card, otherwise the first.
 */
export function defaultFirstSelected(
  candidates: ClusterResultCandidate[],
): ClusterResultCandidate[] {
  if (candidates.length === 0 || candidates.some((candidate) => candidate.selected)) {
    return candidates;
  }
  const recommendedIndex = candidates.findIndex((candidate) => candidate.recommended);
  const pick = recommendedIndex >= 0 ? recommendedIndex : 0;
  return candidates.map((candidate, index) =>
    index === pick ? { ...candidate, selected: true } : candidate,
  );
}

/**
 * One card is selected: keep a pick the user already made, otherwise the variant the
 * run marked `isSelected`, otherwise the first. `isRecommended` never decides selection.
 */
function withApiSelection(
  candidates: ClusterResultCandidate[],
  apiSelectedIndex: number,
): ClusterResultCandidate[] {
  if (candidates.length === 0 || candidates.some((candidate) => candidate.selected)) {
    return candidates;
  }
  const pick = apiSelectedIndex >= 0 ? apiSelectedIndex : 0;
  return candidates.map((candidate, index) =>
    index === pick ? { ...candidate, selected: true } : candidate,
  );
}

/** API order is preserved; nothing is re-ranked or truncated here. */
export function mapClusterRunCandidates(
  data: ClusterRunResponse,
  context: { planId: string; selectedId?: string | null },
): ClusterResultCandidate[] {
  const apiSelectedIndex = data.variants.findIndex((variant) => variant.isSelected === true);
  return withApiSelection(
    data.variants.map((variant, index) =>
      mapClusterRunCandidate(variant, index, {
        ...context,
        clusterPlanCode: data.clusterPlanCode,
      }),
    ),
    apiSelectedIndex,
  );
}
