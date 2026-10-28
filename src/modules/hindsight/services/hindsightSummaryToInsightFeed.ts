import type { HindsightSummarySections } from '../types/hindsightSummary';
import type { SeasonNarrativeInsight } from '../types/seasonNarrative';

export interface SummarySectionMapEntry {
  sourceKey: keyof HindsightSummarySections;
  short_title: string;
}

/**
 * Single source of section order and card titles.
 * Titles come from this map (not the API). First card title is intentionally "Sales".
 * Figure colours (`<green>` / `<red>`) are owned by the agent response — do not re-tag here.
 */
export const SECTION_MAP: readonly SummarySectionMapEntry[] = [
  {
    sourceKey: 'assortment_and_attributes',
    short_title: 'Sales',
  },
  {
    sourceKey: 'whats_working',
    short_title: 'What Worked',
  },
  {
    sourceKey: 'whats_not_working',
    short_title: "What Didn't",
  },
  {
    sourceKey: 'where_to_adjust',
    short_title: 'Where We Can Do Better',
  },
] as const;

/**
 * Converts agent `summary` sections into the Season Narrative insight-feed shape.
 *
 * Bodies are passed through unchanged — the agent now sends pre-tagged HTML
 * (`<ul>`/`<ol>`/`<p>`, `<red>`, `<green>`). Re-running figure detection over that
 * markup would nest tags. Titles are still frontend-owned (`<main-h>`).
 * Missing / null section keys are skipped (sequence restarts from 1 among survivors).
 */
export function convertHindsightSummaryToInsightFeed(
  source: HindsightSummarySections | null | undefined,
): SeasonNarrativeInsight[] {
  if (source == null) return [];

  return SECTION_MAP.filter((section) => source[section.sourceKey] != null).map(
    (section, index) => {
      const text = String(source[section.sourceKey]);
      return {
        short_title: section.short_title,
        sequence: index + 1,
        title: `<main-h>${section.short_title}</main-h>`,
        body: [
          {
            type: 'text' as const,
            data: text,
          },
        ],
      };
    },
  );
}
