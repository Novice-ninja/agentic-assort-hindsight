import type { IconName } from '@app/layouts/icons';
import type { Permission } from './permissions';

export interface NavItem {
  key: string;
  labelKey: string;
  icon: IconName;
  to: string;
  requiredPermission?: Permission;
  disabled?: boolean;
}

/** Primary navigation shown in the sidebar. Empty: the app launches straight into Hindsight. */
export const PRIMARY_NAV: NavItem[] = [];

/** Footer navigation (admin actions + logout). */
export const FOOTER_NAV: NavItem[] = [
  {
    key: 'admin',
    labelKey: 'nav.planningAdmin',
    icon: 'planningAdmin',
    to: 'agentic-assort/admin',
    disabled: true,
  },
  {
    key: 'assortmentPeriod',
    labelKey: 'nav.assortmentPeriod',
    icon: 'assortmentPeriod',
    to: 'agentic-assort/assortment-period',
    disabled: true,
  },
  {
    key: 'locationClustering',
    labelKey: 'nav.locationClustering',
    icon: 'locationClustering',
    to: 'agentic-assort/clustering',
    requiredPermission: 'clustering:read',
  },
  {
    key: 'planningRules',
    labelKey: 'nav.planningRules',
    icon: 'planningRules',
    to: 'agentic-assort/planning-rules',
    disabled: true,
  },
  {
    key: 'logout',
    labelKey: 'nav.logout',
    icon: 'logout',
    to: 'agentic-assort/logout',
  },
];
