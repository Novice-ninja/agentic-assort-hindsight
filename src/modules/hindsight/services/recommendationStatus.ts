import type { RecommendationStatus, RecommendationType } from '../types';

/** Colour treatment for the label. Matches the three tones the panels already style. */
export type RecommendationTone = 'error' | 'warning' | 'success';

/** Which of the three tile icons to composite. */
export type RecommendationIcon = 'attentionRed' | 'attentionGold' | 'checkbox';

export interface RecommendationStatusStyle {
  status: RecommendationStatus;
  tone: RecommendationTone;
  icon: RecommendationIcon;
}

/**
 * Severity is the only thing that decides an item's colour and its tile icon, so the two are
 * resolved together here rather than being re-derived at each call site.
 */
const STATUS_STYLES: Record<RecommendationStatus, RecommendationStatusStyle> = {
  flagged: { status: 'flagged', tone: 'error', icon: 'attentionRed' },
  watch: { status: 'watch', tone: 'warning', icon: 'attentionGold' },
  action: { status: 'action', tone: 'success', icon: 'checkbox' },
};

/**
 * Wire values accepted for each status.
 *
 * The backend has not settled on its vocabulary yet, so the words it is most likely to pick are
 * accepted up front — adopting its choice should be an entry here, not a change at a call site.
 * Matching is on this enumerated field only; the human-readable `label` is never inspected,
 * since that would break the moment the wording or the locale changes.
 */
const STATUS_ALIASES: Record<string, RecommendationStatus> = {
  flagged: 'flagged',
  flag: 'flagged',
  critical: 'flagged',
  negative: 'flagged',
  error: 'flagged',
  risk: 'flagged',
  watch: 'watch',
  warning: 'watch',
  attention: 'watch',
  neutral: 'watch',
  monitor: 'watch',
  action: 'action',
  inseasonaction: 'action',
  opportunity: 'action',
  positive: 'action',
  success: 'action',
  ok: 'action',
};

/**
 * Used when an item carries no severity.
 *
 * TODO(backend): remove once `products[].status` ships. The contract has no severity field, but
 * the design needs one per item, so each panel falls back to a colour that already appears in
 * it — red for a missed opportunity, the in-season action green for a carry-forward. Every item
 * in a panel therefore reads the same until the field arrives.
 */
export const DEFAULT_RECOMMENDATION_STATUS: Record<RecommendationType, RecommendationStatus> = {
  missedOpportunities: 'flagged',
  carryForwards: 'action',
};

/** Normalises a wire status, or `null` when it is absent or unrecognised. */
export function parseRecommendationStatus(
  value: string | null | undefined,
): RecommendationStatus | null {
  if (typeof value !== 'string') return null;
  const key = value.trim().toLowerCase().replace(/[\s_-]/g, '');
  return STATUS_ALIASES[key] ?? null;
}

/**
 * Resolves an item's colour and icon.
 *
 * Severity wins when present. If the backend omitted it, the human-readable label is tried
 * next — Carry-Forward sends `"Flagged"` / `"In-Season Action"` on `label` and no `status`,
 * which would otherwise paint every row with the panel default (green). An unrecognised
 * label still falls back per panel.
 */
export function resolveRecommendationStatusStyle(
  status: RecommendationStatus | null | undefined,
  type: RecommendationType,
  label?: string,
): RecommendationStatusStyle {
  const resolved =
    status ?? parseRecommendationStatus(label) ?? DEFAULT_RECOMMENDATION_STATUS[type];
  return STATUS_STYLES[resolved];
}
