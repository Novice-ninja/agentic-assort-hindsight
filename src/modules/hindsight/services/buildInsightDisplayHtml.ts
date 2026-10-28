import { prepareNarrativeHtml } from './narrativeSanitize';

export interface InsightDisplayHtml {
  titleHtml: string;
  bodyHtml: string;
}

/**
 * Builds the rich Ask Iris user-bubble payload from a widget title + plain insight body.
 * Season Narrative already has feed HTML; strip/AIStrip insights use this so they share
 * the same gradient bubble via `displayHtml`.
 */
export function buildInsightDisplayHtml(
  title: string,
  body: string,
): InsightDisplayHtml {
  return {
    titleHtml: prepareNarrativeHtml(title.trim()),
    bodyHtml: prepareNarrativeHtml(body.trim()),
  };
}
