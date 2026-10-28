import type { SeasonNarrativeInsight } from '../types';

/** Strips insight-feed / HTML tags to plain text for the WS `query` field. */
export function stripToPlainText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|main-h|sub-h)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Card title + full body as plain text for `{ type: "query", query }` — no prompt wrapper.
 * IA char tokens are left encoded: the agent resolves product names from the backend form.
 */
export function insightToPlainText(insight: SeasonNarrativeInsight): string {
  const title = stripToPlainText(insight.title);
  const bodyParts: string[] = [];
  for (const block of insight.body) {
    if (block.type === 'text' && typeof block.data === 'string') {
      const plain = stripToPlainText(block.data);
      if (plain) bodyParts.push(plain);
    }
  }
  const body = bodyParts.join('\n\n');
  if (title && body) return `${title}\n\n${body}`;
  return title || body;
}
