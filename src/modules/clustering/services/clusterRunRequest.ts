import type { ClusterRunRequest, ClusterRunVariantRequest } from '../api/runClusterPlan';
import type { ClusteringAttribute, Variant } from '../types';

export class ClusterRunRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClusterRunRequestError';
  }
}

/**
 * Builds the `POST .../plans/{code}/runs` body from the Review & Run cards the user kept
 * (`removed === false`). Attribute ids are the backend attribute names; they are grouped by
 * the category of the matching Review attribute row. Variants whose name cannot be resolved
 * use `resolveName` (the same string shown on the Review card badge).
 */
export function toClusterRunRequest(
  variants: Variant[],
  attributes: ClusteringAttribute[],
  resolveName: (variant: Variant) => string,
): ClusterRunRequest {
  const categoryOf = new Map(attributes.map((attr) => [attr.id, attr.category]));
  const active = variants.filter((variant) => !variant.removed);
  if (active.length === 0) {
    throw new ClusterRunRequestError('At least one variant is required to run clustering');
  }
  return {
    variants: active.map((variant): ClusterRunVariantRequest => {
      const body: ClusterRunVariantRequest = {
        variantId: variant.id,
        name: (variant.name ?? resolveName(variant)).trim(),
        product_attributes: [],
        performance_attributes: [],
        store_attributes: [],
      };
      for (const id of variant.attributeIds) {
        switch (categoryOf.get(id)) {
          case 'product':
            body.product_attributes.push(id);
            break;
          case 'performance':
            body.performance_attributes.push(id);
            break;
          case 'store':
            body.store_attributes.push(id);
            break;
          default:
            // Not in the Review catalogue (e.g. a stale id): there is no honest bucket for it.
            break;
        }
      }
      return body;
    }),
  };
}
