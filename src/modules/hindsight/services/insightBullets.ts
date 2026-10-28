import type { InsightBullet } from '../types';

/**
 * `Bullet 1: `, `Bullet 3 (Conclusion & Recommendation): ` and the like are prompt scaffolding
 * rather than copy. The pattern is deliberately loose because the prompt that produces them is
 * not the only prompt this endpoint serves.
 */
const SCAFFOLDING = /^\s*bullet\s*\d*\s*(?:\(([^)]*)\))?\s*[:.\-–]\s*/i;

/**
 * Turns the service's sentences into bullets fit to display.
 *
 * Anything that does not carry a recognised prefix is passed through untouched, so a change of
 * prompt format shows a slightly scruffy sentence rather than dropping the insight entirely.
 */
export function parseInsightBullets(response: readonly string[]): InsightBullet[] {
  return response
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => {
      const match = SCAFFOLDING.exec(entry);
      if (match === null) return { text: entry };

      const text = entry.slice(match[0].length).trim();
      // A prefix and nothing else would render as an empty bullet, so keep what arrived.
      if (text.length === 0) return { text: entry };

      const qualifier = match[1]?.trim();
      return qualifier !== undefined && qualifier.length > 0 ? { text, qualifier } : { text };
    });
}
