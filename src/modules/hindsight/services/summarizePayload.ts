import { replaceSpecialCharacter } from '@shared/utils/format';
import type { ContributionData, SegmentSummarizeRequest } from '../types';

/** Contribution cards are one shape of card to the agent, whatever dimension they break down. */
export const CONTRIBUTION_CARD_TYPE = 'segment';

/**
 * Builds the summarize request for a contribution card from the data already on screen.
 *
 * Pure and total: the card's own model carries everything the service needs, so hovering never
 * asks the contribution endpoint for anything a second time. Null means there is nothing worth
 * summarising — the service rejects an empty `series`, and a card with no segments has no
 * insight to give.
 *
 * Labels are decoded on the way out. The backend encodes punctuation as `__ia_char_NN`, and an
 * insight that quoted those tokens back would read as a bug to a planner.
 */
export function buildSummarizePayload(card: ContributionData): SegmentSummarizeRequest | null {
  const dimension = card.metricId.trim();
  if (dimension === '') return null;

  const data = card.slices
    .filter((slice) => Number.isFinite(slice.value))
    .map((slice) => ({
      label: String(replaceSpecialCharacter(slice.labelKey)),
      value: slice.value,
    }));

  if (data.length === 0) return null;

  return {
    cardType: CONTRIBUTION_CARD_TYPE,
    dimension,
    series: [{ name: dimension, data }],
  };
}
