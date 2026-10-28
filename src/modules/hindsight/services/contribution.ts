import type { ContributionSlice } from '../types';

export interface ContributionInput {
  id: string;
  labelKey: string;
  value: number;
}

export interface ContributionOptions {
  topN: number;
  thresholdPercent: number;
  othersLabelKey?: string;
  showOthers?: boolean;
}

/**
 * Groups contribution values for display.
 *
 * Two rules here are easy to get subtly wrong, which is why they live in one tested
 * function: shares are measured against the combined total across every selected position
 * rather than any single one, and the "Others" slice is **omitted entirely** when nothing
 * falls below the threshold rather than being rendered at zero.
 */
export function buildContributionSlices(
  values: ContributionInput[],
  options: ContributionOptions,
): ContributionSlice[] {
  const { topN, thresholdPercent, othersLabelKey = 'contribution.others', showOthers = true } = options;

  const total = values.reduce((sum, v) => sum + v.value, 0);
  if (total === 0) return [];

  const withShare = values
    .map((v) => ({ ...v, sharePercent: v.value / total }))
    .sort((a, b) => b.sharePercent - a.sharePercent);

  const qualifying = withShare
    .slice(0, topN)
    .filter((v) => v.sharePercent >= thresholdPercent);

  const remainder = withShare.filter((v) => !qualifying.some((q) => q.id === v.id));

  const slices: ContributionSlice[] = qualifying.map((v) => ({
    id: v.id,
    labelKey: v.labelKey,
    value: v.value,
    sharePercent: v.sharePercent,
    isOthers: false,
  }));

  // No remainder means no "Others" slice at all. An "Others" at 0% would imply a category
  // exists when none does.
  if (!showOthers || remainder.length === 0) return slices;

  const othersValue = remainder.reduce((sum, v) => sum + v.value, 0);
  if (othersValue === 0) return slices;

  slices.push({
    id: 'others',
    labelKey: othersLabelKey,
    value: othersValue,
    sharePercent: othersValue / total,
    isOthers: true,
  });

  return slices;
}

/** The largest non-"Others" slice, for narration and for the centre label. */
export function leadingSlice(slices: ContributionSlice[]): ContributionSlice | undefined {
  return slices.filter((s) => !s.isOthers).sort((a, b) => b.sharePercent - a.sharePercent)[0];
}

export function contributionTotal(slices: ContributionSlice[]): number {
  return slices.reduce((sum, s) => sum + s.value, 0);
}
