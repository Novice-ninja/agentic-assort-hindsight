import type { ContributionCardDto, ContributionData } from '../types';

/**
 * Adapter between the contribution API and the widget's own model.
 *
 * The API sends a share per segment and no absolute value; `ContributionWidget` derives shares
 * from `value`. Feeding the percentage in as the value keeps every proportion and legend figure
 * exact, and confines the difference between the two models to this function — when the payload
 * changes, only this changes.
 */
export function toContributionData(card: ContributionCardDto): ContributionData {
  const total = card.segments.reduce((sum, segment) => sum + segment.percentage, 0);

  return {
    instanceId: `contribution-${card.dimension}`,
    metricId: card.dimension,
    dimension: card.dimension,
    slices: card.segments.map((segment) => ({
      id: segment.id,
      // Tenant data (a colour, a size), so it is displayed as given rather than translated.
      labelKey: segment.label,
      value: segment.percentage,
      sharePercent: total === 0 ? 0 : segment.percentage / total,
      isOthers: segment.id.toLowerCase() === 'others',
    })),
  };
}

/** Preserve dimension identity on an empty scope so each card retains its own heading. */
export function toContributionDataList(
  cards: readonly ContributionCardDto[],
): ContributionData[] {
  return cards.map(toContributionData);
}
