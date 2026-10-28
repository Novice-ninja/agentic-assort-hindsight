import { isHierarchyLevelSelected } from '@modules/planning/services/filterHierarchy';
import type { HierarchyLevelDef, HierarchyScopeEntry } from '@modules/planning/types';

export const NAME_MAX_LENGTH = 100;

/** Letters, digits, hyphen, underscore, and space — same charset as the create-plan name. */
export const NAME_PATTERN = /^[A-Za-z0-9_\- ]+$/;

export interface ScopeFields {
  name: string;
  productId: string | null;
  /** Target season — `POST /v1/clustering/plans` requires `targetSeasonCode`. */
  seasonId: string | null;
  channelId: string | null;
  /** Cascaded product-hierarchy selections. A selection on any level satisfies Product. */
  hierarchyScope?: HierarchyScopeEntry[];
}

export interface ScopeValidationResult {
  valid: boolean;
  errors: {
    name?: 'required' | 'tooLong' | 'invalidChars';
    productId?: 'required';
    seasonId?: 'required';
    channelId?: 'required';
  };
}

export function normalizeName(name: string): string {
  return name.trim();
}

/**
 * Live name check for the Scope input. An empty name is not an error here — required is
 * enforced by `validateScope` and the disabled Next button, matching the create-plan field.
 */
export function clusterNameError(name: string): 'tooLong' | 'invalidChars' | null {
  const trimmed = normalizeName(name);
  if (!trimmed) return null;
  if (trimmed.length > NAME_MAX_LENGTH) return 'tooLong';
  if (!NAME_PATTERN.test(trimmed)) return 'invalidChars';
  return null;
}

/**
 * Product is satisfied by a legacy `productId`, or by the cascaded hierarchy.
 * When filter config marks levels `mandatory`, every one of those levels must be selected
 * (Sales Organisation alone does not satisfy a mandatory Category).
 */
export function hasProductSelection(
  fields: Pick<ScopeFields, 'productId' | 'hierarchyScope'>,
  hierarchyLevels?: readonly HierarchyLevelDef[],
): boolean {
  const scope = fields.hierarchyScope ?? [];
  const mandatory = (hierarchyLevels ?? []).filter((level) => level.mandatory);
  if (mandatory.length > 0) {
    return mandatory.every((level) =>
      isHierarchyLevelSelected(scope.find((entry) => entry.levelNo === level.levelNo)),
    );
  }
  if (fields.productId) return true;
  return scope.some(isHierarchyLevelSelected);
}

export function validateScope(
  fields: ScopeFields,
  hierarchyLevels?: readonly HierarchyLevelDef[],
): ScopeValidationResult {
  const errors: ScopeValidationResult['errors'] = {};
  const name = normalizeName(fields.name);
  if (!name) errors.name = 'required';
  else {
    const nameIssue = clusterNameError(fields.name);
    if (nameIssue) errors.name = nameIssue;
  }
  if (!hasProductSelection(fields, hierarchyLevels)) errors.productId = 'required';
  if (!fields.seasonId) errors.seasonId = 'required';
  if (!fields.channelId) errors.channelId = 'required';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function isNameTaken(
  name: string,
  existingNames: string[],
  currentName?: string,
): boolean {
  const normalized = normalizeName(name).toLowerCase();
  if (!normalized) return false;
  if (currentName && normalized === normalizeName(currentName).toLowerCase()) return false;
  return existingNames.some((existing) => existing.trim().toLowerCase() === normalized);
}
