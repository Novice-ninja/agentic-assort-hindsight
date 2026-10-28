const DEFAULT_STARTING_POINTS = 3;

export function optionCount(
  activeVariantCount: number,
  kValueCount: number,
  startingPoints: number = DEFAULT_STARTING_POINTS,
): number {
  return activeVariantCount * kValueCount * startingPoints;
}

export function activeVariantCount(variants: Array<{ removed: boolean }>): number {
  return variants.filter((variant) => !variant.removed).length;
}
