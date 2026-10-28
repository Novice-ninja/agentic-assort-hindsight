import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ImpactSidebar } from '@shared/components/vendor/impact-ui';
import type { SidebarRoute } from '@shared/components/vendor/impact-ui';
import { logout } from '@shared/services';
import { FOOTER_NAV, PRIMARY_NAV } from '@config/navigation';
import { Icon } from './icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { t } = useTranslation('nav');
  const navigate = useNavigate();
  const location = useLocation();

  const routes: SidebarRoute[] = useMemo(
    () =>
      PRIMARY_NAV.map((item) => ({
        label: t(item.labelKey),
        icon: <Icon name={item.icon} />,
        value: item.key,
        link: '/' + item.to,
        isDisabled: item.disabled,
      })),
    [t],
  );

  const actionRoutes: SidebarRoute[] = useMemo(
    () =>
      FOOTER_NAV.filter((item) => item.key !== 'logout').map((item) => ({
        label: t(item.labelKey),
        icon: <Icon name={item.icon} />,
        value: item.key,
        link: '/' + item.to,
        isDisabled: item.disabled,
      })),
    [t],
  );

  const parentActive = useMemo(() => {
    const childRoutes: Record<string, string> = {
      '/assort/hindsight': 'plans',
      '/assort/clustering': 'locationClustering',
    };
    for (const [prefix, key] of Object.entries(childRoutes)) {
      if (location.pathname.startsWith(prefix)) return key;
    }

    const allItems = [...PRIMARY_NAV, ...FOOTER_NAV];
    const sorted = [...allItems].sort((a, b) => b.to.length - a.to.length);
    const match = sorted.find((item) => {
      const path = '/' + item.to;
      if (item.key === 'dashboard') {
        return location.pathname === path || location.pathname === path + '/';
      }
      return location.pathname.startsWith(path);
    });
    return match?.key ?? 'dashboard';
  }, [location.pathname]);

  const handleParentRouteChange = (route: SidebarRoute) => {
    if (route.link) {
      navigate(route.link);
    }
  };

  const handleChildRouteChange = (child: SidebarRoute) => {
    if (child.link) {
      navigate(child.link);
    }
  };

  const handleLogOut = () => logout();

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ImpactSidebar
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      routes={routes}
      actionRoutes={actionRoutes}
      parentActive={parentActive}
      childActive=""
      handleParentRouteChange={handleParentRouteChange}
      handleChildRouteChange={handleChildRouteChange}
      handleLogOut={handleLogOut}
      handleClose={handleClose}
      isMemoryRouter={false}
    />
  );
}
