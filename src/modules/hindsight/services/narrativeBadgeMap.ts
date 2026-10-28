/**
 * Frontend badge (emoji + tint) for Season Narrative cards.
 *
 * The insight payload has no emoji field — map by `short_title` (case-insensitive),
 * then `sequence`, then a default fallback so unmapped insights still render.
 */

export type NarrativeBadgeTone = 'lavender' | 'mint' | 'amber' | 'sky' | 'rose';

export interface NarrativeBadge {
  emoji: string;
  tone: NarrativeBadgeTone;
}

const DEFAULT_BADGE: NarrativeBadge = { emoji: '✨', tone: 'lavender' };

/** Prefer matching `short_title` (normalized). */
const BY_SHORT_TITLE: Readonly<Record<string, NarrativeBadge>> = {
  sales: { emoji: '💵', tone: 'lavender' },
  hotspots: { emoji: '🤩', tone: 'mint' },
  'what worked': { emoji: '🤩', tone: 'mint' },
  "what didn't": { emoji: '😔', tone: 'amber' },
  'what didnt': { emoji: '😔', tone: 'amber' },
  'where we can do better': { emoji: '😇', tone: 'sky' },
  'strong start': { emoji: '👍', tone: 'lavender' },
};

/** Fallback when short_title is unknown — cycles by sequence. */
const BY_SEQUENCE_FALLBACK: readonly NarrativeBadge[] = [
  { emoji: '💵', tone: 'lavender' },
  { emoji: '🤩', tone: 'mint' },
  { emoji: '😔', tone: 'amber' },
  { emoji: '😇', tone: 'sky' },
  { emoji: '💡', tone: 'rose' },
];

function normaliseTitle(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Resolves the emoji badge for an insight. Never throws; always returns a badge.
 */
export function resolveNarrativeBadge(
  shortTitle: string,
  sequence: number,
): NarrativeBadge {
  const fromTitle = BY_SHORT_TITLE[normaliseTitle(shortTitle)];
  if (fromTitle !== undefined) return fromTitle;

  if (sequence >= 1) {
    const index = (sequence - 1) % BY_SEQUENCE_FALLBACK.length;
    return BY_SEQUENCE_FALLBACK[index] ?? DEFAULT_BADGE;
  }

  return DEFAULT_BADGE;
}
