import type { Permission } from './permissions';

export const ROUTES = {
  dashboard: '/assort/dashboard',
  products: '/assort/products',
  locations: '/assort/locations',
  plans: '/assort/plans',
  createPlan: '/assort/plans/create',
  // Platform areas linked from the dashboard "Review" actions (placeholder destinations).
  hindsight: '/assort/hindsight',
  clustering: '/assort/clustering',
  createClusterPlan: '/assort/clustering/create',
  describeClusterPlan: '/assort/clustering/describe',
  clusteringPlan: '/assort/clustering/:planId',
  strategy: '/assort/strategy',
  attributes: '/assort/attributes',
  linePlanning: '/assort/line-planning',
  agentHub: '/assort/agent-hub',
  reports: '/assort/reports',
  admin: '/assort/admin',
  settings: '/assort/settings',
  logout: '/assort/logout',
  home: 'assort/dashboard',
} as const;

export type RouteKey = keyof typeof ROUTES;

export interface RouteMeta {
  key: RouteKey;
  path: string;
  titleKey: string;
  icon: string;
  requiredPermission?: Permission;
}

export const ROUTE_METADATA: RouteMeta[] = [
  { key: 'dashboard', path: ROUTES.dashboard, titleKey: 'nav.dashboard', icon: 'grid' },
  {
    key: 'products',
    path: ROUTES.products,
    titleKey: 'nav.products',
    icon: 'box',
    requiredPermission: 'products:read',
  },
  {
    key: 'locations',
    path: ROUTES.locations,
    titleKey: 'nav.locations',
    icon: 'map-pin',
    requiredPermission: 'locations:read',
  },
  {
    key: 'plans',
    path: ROUTES.plans,
    titleKey: 'nav.plans',
    icon: 'plans',
    requiredPermission: 'plans:read',
  },
  {
    key: 'hindsight',
    path: ROUTES.hindsight,
    titleKey: 'nav.hindsight',
    icon: 'history',
    requiredPermission: 'hindsight:read',
  },
  {
    key: 'clustering',
    path: ROUTES.clustering,
    titleKey: 'nav.locationClustering',
    icon: 'globe',
    requiredPermission: 'clustering:read',
  },
];
