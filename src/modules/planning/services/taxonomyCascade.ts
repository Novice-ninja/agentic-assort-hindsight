import type {
  HierarchyLevel,
  ProductHierarchyNode,
  ProductScopeSelection,
} from '../types';
import { EMPTY_SCOPE } from '../types';

export function nodesByLevel(
  taxonomy: ProductHierarchyNode[],
  level: HierarchyLevel,
): ProductHierarchyNode[] {
  return taxonomy.filter((n) => n.level === level);
}

/** Children of the given parents at a specific level. */
export function childrenOf(
  taxonomy: ProductHierarchyNode[],
  level: HierarchyLevel,
  parentIds: string[],
): ProductHierarchyNode[] {
  if (parentIds.length === 0) return [];
  const parents = new Set(parentIds);
  return taxonomy.filter((n) => n.level === level && n.parentId && parents.has(n.parentId));
}

export function departments(taxonomy: ProductHierarchyNode[]): ProductHierarchyNode[] {
  return nodesByLevel(taxonomy, 'department');
}

export function classesFor(
  taxonomy: ProductHierarchyNode[],
  departmentId: string | null,
): ProductHierarchyNode[] {
  return departmentId ? childrenOf(taxonomy, 'class', [departmentId]) : [];
}

export function subClassesFor(
  taxonomy: ProductHierarchyNode[],
  classIds: string[],
): ProductHierarchyNode[] {
  return childrenOf(taxonomy, 'subClass', classIds);
}

export function skusFor(
  taxonomy: ProductHierarchyNode[],
  subClassIds: string[],
): ProductHierarchyNode[] {
  return childrenOf(taxonomy, 'sku', subClassIds);
}

/**
 * A level is operable only when its parent has ≥1 selection (FR-023).
 * Department is always operable; the rest cascade.
 */
export function isLevelEnabled(level: HierarchyLevel, scope: ProductScopeSelection): boolean {
  switch (level) {
    case 'department':
      return true;
    case 'class':
      return Boolean(scope.departmentId);
    case 'subClass':
      return scope.classIds.length > 0;
    case 'sku':
      return scope.subClassIds.length > 0;
    default:
      return false;
  }
}

/** Changing the Department resets all descendant selections (FR-021). */
export function applyDepartmentChange(
  scope: ProductScopeSelection,
  departmentId: string | null,
): ProductScopeSelection {
  if (scope.departmentId === departmentId) return scope;
  return { ...EMPTY_SCOPE, departmentId };
}

/** Toggle a value in a level, pruning now-orphaned descendant selections. */
export function toggleScopeValue(
  taxonomy: ProductHierarchyNode[],
  scope: ProductScopeSelection,
  level: Exclude<HierarchyLevel, 'department'>,
  id: string,
): ProductScopeSelection {
  const key = `${level === 'class' ? 'classIds' : level === 'subClass' ? 'subClassIds' : 'skuIds'}` as
    | 'classIds'
    | 'subClassIds'
    | 'skuIds';
  const current = scope[key];
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  const updated: ProductScopeSelection = { ...scope, [key]: next };

  // Prune descendants no longer reachable from the remaining parents.
  if (level === 'class') {
    const validSub = new Set(subClassesFor(taxonomy, next).map((n) => n.id));
    updated.subClassIds = scope.subClassIds.filter((s) => validSub.has(s));
    const validSku = new Set(skusFor(taxonomy, updated.subClassIds).map((n) => n.id));
    updated.skuIds = scope.skuIds.filter((s) => validSku.has(s));
  } else if (level === 'subClass') {
    const validSku = new Set(skusFor(taxonomy, next).map((n) => n.id));
    updated.skuIds = scope.skuIds.filter((s) => validSku.has(s));
  }
  return updated;
}

/** Replace all selected ids at a level (Select All / Clear), pruning orphaned descendants. */
export function setScopeValues(
  taxonomy: ProductHierarchyNode[],
  scope: ProductScopeSelection,
  level: Exclude<HierarchyLevel, 'department'>,
  ids: string[],
): ProductScopeSelection {
  if (level === 'class') {
    const validSub = new Set(subClassesFor(taxonomy, ids).map((n) => n.id));
    const subClassIds = scope.subClassIds.filter((s) => validSub.has(s));
    const validSku = new Set(skusFor(taxonomy, subClassIds).map((n) => n.id));
    return { ...scope, classIds: ids, subClassIds, skuIds: scope.skuIds.filter((s) => validSku.has(s)) };
  }
  if (level === 'subClass') {
    const validSku = new Set(skusFor(taxonomy, ids).map((n) => n.id));
    return { ...scope, subClassIds: ids, skuIds: scope.skuIds.filter((s) => validSku.has(s)) };
  }
  return { ...scope, skuIds: ids };
}

/** Compact preview: first `max` labels plus a "+N" overflow count (FR-024). */
export function selectionSummary(
  nodes: ProductHierarchyNode[],
  selectedIds: string[],
  max = 2,
): { names: string[]; overflow: number } {
  const byId = new Map(nodes.map((n) => [n.id, n.label]));
  const labels = selectedIds.map((id) => byId.get(id)).filter((l): l is string => Boolean(l));
  return { names: labels.slice(0, max), overflow: Math.max(0, labels.length - max) };
}
