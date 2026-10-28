/**
 * Time grain for Hindsight time-series charts. Maps to the charts API `rollupType`
 * and `encoding.x` fields.
 */
export type ChartTimeGrain = 'week' | 'month';

export type ChartRollupType = 'weekRollup' | 'monthRollup';

/** Versions the Regular + Promo time-series chart always asks for. */
export const REGULAR_PROMO_VERSIONS = [
  'ly',
  'lly',
  'optimisedLy',
  'forecast',
  'plan',
  'optimisedLLy',
] as const;

/**
 * Optional series stay out of the chart and legend until the backend returns real points
 * (not null / absent). Includes request keys and legacy response aliases.
 */
export const REGULAR_PROMO_OPTIMISED_VERSIONS = [
  'optimisedLy',
  'forecast',
  'plan',
  'ly_optimised',
  'lly_optimised',
  'optimisedLLy',
] as const;

export function rollupTypeForGrain(grain: ChartTimeGrain): ChartRollupType {
  return grain === 'month' ? 'monthRollup' : 'weekRollup';
}

export function encodingXForGrain(grain: ChartTimeGrain): 'week' | 'month' {
  return grain;
}

export function grainFromRollupType(rollup: string | undefined): ChartTimeGrain {
  return rollup === 'monthRollup' ? 'month' : 'week';
}

/** True when a series has at least one finite number — otherwise omit from the plot. */
export function seriesHasRenderableData(values: readonly (number | null)[]): boolean {
  return values.some((value) => value !== null && Number.isFinite(value));
}
