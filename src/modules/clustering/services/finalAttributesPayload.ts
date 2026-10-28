import type { FinalAttributesRequest } from '../api/putFinalAttributes';
import type { ClusteringAttribute } from '../types';

function namesFor(
  rows: ClusteringAttribute[],
  category: ClusteringAttribute['category'],
): string[] {
  return rows
    .filter((row) => row.category === category && row.userSelected)
    .map((row) => row.id);
}

/** Groups currently selected Review attributes into the PUT final-attributes body. */
export function toFinalAttributesPayload(
  attributes: ClusteringAttribute[],
): FinalAttributesRequest {
  return {
    performanceAttributes: namesFor(attributes, 'performance'),
    productAttributes: namesFor(attributes, 'product'),
    storeAttributes: namesFor(attributes, 'store'),
  };
}

/** Applies draft overrides the same way the Review checkboxes do. */
export function withAttributeOverrides(
  attributes: ClusteringAttribute[],
  overrides: Record<string, boolean> | undefined,
): ClusteringAttribute[] {
  if (!overrides) return attributes;
  return attributes.map((attr) => ({
    ...attr,
    userSelected: overrides[attr.id] ?? attr.userSelected,
  }));
}

/**
 * Stable id list for the checkbox selection that produced the current variants.
 * Order does not matter; overrides win over the score row, matching the Review cards.
 */
export function attributeSelectionKey(
  attributes: ClusteringAttribute[],
  overrides?: Record<string, boolean>,
): string {
  return withAttributeOverrides(attributes, overrides)
    .filter((row) => row.userSelected)
    .map((row) => row.id)
    .sort()
    .join('\n');
}
