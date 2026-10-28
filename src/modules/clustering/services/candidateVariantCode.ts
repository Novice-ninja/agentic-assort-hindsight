import type { ClusterResultCandidate } from '../types';

/** Run-API variant ids are UUIDs, so every run card shows the same fixed code. */
export const RUN_VARIANT_CODE = 'VA';

/** Run-API candidates carry `scores`; mock candidates do not. */
export const isRunCandidate = (candidate: ClusterResultCandidate) => candidate.scores !== undefined;

/** Mock variant ids end in a word token (`variant-a`) → `VA`. */
export function variantShortCode(variantId: string) {
  const token = variantId.split('-').pop() ?? variantId;
  return `V${token.charAt(0).toUpperCase()}`;
}

/** The short code shown next to `K = {k}` on every candidate surface (3 Best cards, Gate 2). */
export function candidateVariantCode(candidate: ClusterResultCandidate) {
  return isRunCandidate(candidate) ? RUN_VARIANT_CODE : variantShortCode(candidate.variantId);
}
