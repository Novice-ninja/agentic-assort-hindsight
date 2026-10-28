import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BreadcrumbItem } from '@shared/components';

const PAGE_LABEL_KEYS: Record<string, string> = {
  '/': 'nav:nav.decisionDashboard',
  '': 'nav:nav.decisionDashboard',
  '/dashboard': 'nav:nav.decisionDashboard',
  '/dashboard/': 'nav:nav.decisionDashboard',
  '/hindsight': 'hindsight:title',
  '/plans': 'nav:nav.allPlan',
  '/plans/create': 'planning:createPlan.title',
  '/products': 'products:products.title',
  '/locations': 'locations:locations.title',
  '/admin': 'nav:nav.planningAdmin',
  '/assortment-period': 'nav:nav.assortmentPeriod',
  '/location-clustering': 'nav:nav.locationClustering',
  '/clustering': 'nav:nav.locationClustering',
  '/clustering/create': 'clustering:create.title',
  '/planning-rules': 'nav:nav.planningRules',
  '/logout': 'nav:nav.logout',
};

/**
 * Fallback breadcrumbs derived from the current pathname.
 * Pages that call `useSetBreadcrumbs` override these automatically.
 */
export function useBreadcrumbItems(): BreadcrumbItem[] {
  const { pathname } = useLocation();
  const { t } = useTranslation([
    'common',
    'hindsight',
    'dashboard',
    'nav',
    'products',
    'locations',
    'admin',
    'planning',
    'clustering',
  ]);

  return useMemo(() => {
    const home: BreadcrumbItem = {
      label: t('common:breadcrumb.home'),
      href: '__home__',
    };
    const stripped = pathname.replace(/^\/(?:agentic-assort|assort)/, '');
    const pageKey = PAGE_LABEL_KEYS[stripped] ?? 'nav:nav.decisionDashboard';
    return [home, { label: t(pageKey) }];
  }, [pathname, t]);
}
