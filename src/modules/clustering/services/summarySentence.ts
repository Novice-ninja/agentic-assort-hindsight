/** `Bullet 1: `, `Bullet 3 (Conclusion): ` — prompt scaffolding, not copy. */
const SCAFFOLDING = /^\s*bullet\s*\d*\s*(?:\([^)]*\))?\s*[:.\-–—]\s*/i;

/** Envelope keys that may carry the narration, in the order they are tried. */
const TEXT_KEYS = ['response', 'data', 'summary', 'overall', 'text', 'insight', 'narration'];

function sentenceOf(value: unknown): string | null {
  if (typeof value === 'string') {
    const match = SCAFFOLDING.exec(value);
    const text = (match === null ? value : value.slice(match[0].length)).trim();
    return text.length > 0 ? text : null;
  }
  if (Array.isArray(value)) {
    const parts = value.map(sentenceOf).filter((part): part is string => part !== null);
    return parts.length > 0 ? parts.join(' ') : null;
  }
  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>;
    for (const key of TEXT_KEYS) {
      if (key in record) {
        const text = sentenceOf(record[key]);
        if (text !== null) return text;
      }
    }
  }
  return null;
}

/**
 * Collapses a `/v1/summarize` envelope to one display sentence for a single AI strip: every
 * bullet the service sent, scaffolding removed, joined in order. Accepts a bare string, an
 * array of bullets, or an envelope with the text under one of the usual keys. Null when
 * nothing usable arrived.
 */
export function parseSummarySentence(raw: unknown): string | null {
  return sentenceOf(raw);
}
