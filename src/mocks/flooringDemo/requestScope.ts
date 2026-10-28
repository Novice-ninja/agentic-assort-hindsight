import { getFlooringScope } from '../../modules/hindsight/priority/flooringScope';
import type { FlooringFilters } from './index';

/** Existing endpoint bodies do not all carry hierarchy; use the single applied workspace scope. */
export function flooringRequestFilters(body: Record<string, unknown> = {}): FlooringFilters {
  const nested=body.filters && typeof body.filters==='object' && !Array.isArray(body.filters) ? body.filters as Record<string,unknown> : {};
  const context=body.context && typeof body.context==='object' && !Array.isArray(body.context) ? body.context as Record<string,unknown> : {};
  const explicit=[nested.hierarchyScope,nested.hierarchy_scope,body.hierarchyScope,body.hierarchy_scope,context.hierarchyScope,context.hierarchy_scope].find(Array.isArray);
  const planCode=String(nested.planCode ?? nested.plan_code ?? body.planCode ?? body.plan_code ?? context.planCode ?? context.plan_code ?? 'PLAN-KB-001');
  return {...body,...nested,hierarchyScope:explicit ?? getFlooringScope(planCode)};
}
