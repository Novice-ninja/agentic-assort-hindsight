/**
 * Item-level recommendation override contracts for `POST /v1/plans/by-item/recommendation`.
 *
 * The endpoint is bucket-shaped rather than one-item-shaped: articles are grouped by the intent
 * being applied to them, and one call may carry several. It rejects a body whose buckets are all
 * empty (`at least one article required in keep, drop, mandatory, or clear`), rejects an article
 * that appears in both `keep` and `drop`, and requires `planCode`.
 */

/**
 * What a call asks for on an article's behalf. `keep` and `drop` set the recommendation;
 * `mandatory` marks an article as one that must stay in range; `clear` discards the override and
 * returns the article to the system's own verdict.
 */
export type RecommendationBucket = 'keep' | 'drop' | 'mandatory' | 'clear';

/** Buckets that name a recommendation a planner can pick from a dropdown. */
export const RECOMMENDATION_CHOICES = ['keep', 'drop'] as const;

/** A recommendation value the backend accepts as a choice, as opposed to `mandatory`/`clear`. */
export type RecommendationChoice = (typeof RECOMMENDATION_CHOICES)[number];

/**
 * Request body. `keep` and `drop` are always sent, empty or not, so the shape a planner sees on
 * the wire does not change with what they did. `mandatory` and `clear` are sent only when used.
 */
export interface RecommendationOverrideRequest {
  planCode: string;
  keep: string[];
  drop: string[];
  mandatory?: string[];
  clear?: string[];
}

/**
 * One article's state after the write.
 *
 * `effectiveReco` is authoritative — it is what the item now is, which is not necessarily what
 * was asked for. `staleBasis` arrives as `null` from the table endpoint and as a boolean here,
 * so it is typed for both.
 *
 * Newer backends may return `workingPlan` / `aiRecommendation` instead of the flat fields.
 * Consumers should prefer `workingPlan.value` when present.
 */
export interface RecommendationOverrideItem {
  article: string;
  effectiveReco?: string;
  overridden?: boolean;
  mandatory?: boolean;
  staleBasis?: boolean | null;
  /** Provenance, e.g. `override` for a planner's choice or `verdict` for the system's own. */
  source?: string;
  /** New-shape response: the planner's working-plan control after the write. */
  workingPlan?: {
    value: string;
    options: string[];
    editable: boolean;
    overridden: boolean;
  };
  /** New-shape response: the AI verdict + narration after the write. */
  aiRecommendation?: {
    value: string;
    narration: string;
  };
}

/**
 * Season codes come back as strings here and from the rest of the By Item family, while the
 * charts and KPI endpoints spell the same idea as a number. Typed as returned.
 */
export interface RecommendationOverrideData {
  planCode: string;
  referenceSeasonCode: string;
  planSeasonCode: string;
  items: RecommendationOverrideItem[];
}

export interface RecommendationOverrideResponse {
  status: boolean;
  data?: RecommendationOverrideData;
  message?: string;
}

/**
 * What the service function hands back: the data, plus the envelope's own message, which is what
 * the success toast says. Kept beside the data rather than inside it so the payload type stays
 * the payload type.
 */
export interface RecommendationOverrideResult extends RecommendationOverrideData {
  message?: string;
}

/**
 * The per-article recommendation state the views render, held in one place so a change made on a
 * table row, a card's front, or that same card's back is the same change.
 */
export interface ItemRecommendationState {
  effectiveReco: string;
  overridden: boolean;
  mandatory: boolean;
  staleBasis: boolean | null;
  source: string;
}
