import type { Mode } from '../data';
import type { DeepDivePreset, WorkspaceRoute } from './types';

export const WORKSPACE_BASE = '/assort/hindsight';
const PRESETS: DeepDivePreset[] = ['items', 'stores', 'matrix', 'breadth', 'attributes', 'custom'];
const DETAILS = ['item', 'store', 'pair', 'case'];
const decode = (value: string) => { try { return decodeURIComponent(value); } catch { return value; } };

export function normalizeWorkspaceRoute(input: WorkspaceRoute): WorkspaceRoute {
  if (!input || !['overview', 'deep-dive', 'decisions', 'items', 'stores', 'mix', ...DETAILS].includes(input.view)) return { view: 'overview' };
  if (input.view === 'items') return { ...input, view: 'deep-dive', preset: 'items' };
  if (input.view === 'stores') return { ...input, view: 'deep-dive', preset: input.subview === 'matrix' ? 'matrix' : input.subview === 'breadth' ? 'breadth' : 'stores' };
  if (input.view === 'mix') return { ...input, view: 'overview', subview: 'sales-mix', preset: undefined };
  if (input.view === 'deep-dive') {
    const preset = PRESETS.includes(input.preset as DeepDivePreset) ? input.preset! : 'items';
    return { ...input, preset, subview: preset === 'matrix' || preset === 'breadth' ? preset : input.subview };
  }
  return input;
}

export function routePath(input: WorkspaceRoute): string {
  const route = normalizeWorkspaceRoute(input);
  if (route.view === 'overview') return WORKSPACE_BASE + (route.subview === 'sales-mix' ? '/overview/sales-mix' : '');
  if (route.view === 'deep-dive') return `${WORKSPACE_BASE}/deep-dive/${route.preset ?? 'items'}` + (route.subview && route.subview !== route.preset ? `/${encodeURIComponent(route.subview)}` : '');
  if (route.view === 'decisions') return `${WORKSPACE_BASE}/decisions` + (route.subview ? `/${encodeURIComponent(route.subview)}` : '');
  let path = `${WORKSPACE_BASE}/${route.view}/${encodeURIComponent(route.id ?? '')}`;
  if (route.view === 'pair') path += `/${encodeURIComponent(route.storeId ?? '')}`;
  if (route.subview) path += `/${encodeURIComponent(route.subview)}`;
  return path;
}

export function parseWorkspaceRoute(pathname: string, search = ''): WorkspaceRoute {
  const canonical = pathname.replace(/^\/agentic-assort(?=\/|$)/, '/assort');
  const parts = (canonical.startsWith(WORKSPACE_BASE) ? canonical.slice(WORKSPACE_BASE.length) : '').split('/').filter(Boolean).map(decode);
  const focus = new URLSearchParams(search).get('focus');
  let route: WorkspaceRoute;
  if (parts[0] === 'deep-dive') route = normalizeWorkspaceRoute({ view: 'deep-dive', preset: parts[1] as DeepDivePreset, subview: parts[2] });
  else if (DETAILS.includes(parts[0])) route = { view: parts[0] as WorkspaceRoute['view'], id: parts[1], ...(parts[0] === 'pair' ? { storeId: parts[2], subview: parts[3] } : { subview: parts[2] }) };
  else if (['items', 'stores', 'mix'].includes(parts[0])) route = normalizeWorkspaceRoute({ view: parts[0] as WorkspaceRoute['view'], subview: parts[1] });
  else if (parts[0] === 'decisions') route = { view: 'decisions', subview: parts[1] };
  else route = { view: 'overview', ...(parts[1] === 'sales-mix' ? { subview: 'sales-mix' } : {}) };
  return focus ? { ...route, focusItemId: focus } : route;
}

export function workspaceUrl(mode: Mode, route: WorkspaceRoute): string {
  const query = new URLSearchParams({ mode });
  if (route.focusItemId) query.set('focus', route.focusItemId);
  return routePath(route) + '?' + query.toString();
}

export function workspaceRouteKey(mode: Mode, route: WorkspaceRoute): string {
  return mode + ':' + routePath(route) + (route.focusItemId ? ':focus=' + route.focusItemId : '');
}

export function parentWorkspaceRoute(route: WorkspaceRoute): WorkspaceRoute {
  if (route.view === 'case') return { view: 'decisions' };
  if (route.view === 'store' || route.view === 'pair') return { view: 'deep-dive', preset: 'stores' };
  if (route.view === 'item') return { view: 'deep-dive', preset: 'items' };
  return { view: 'overview' };
}
