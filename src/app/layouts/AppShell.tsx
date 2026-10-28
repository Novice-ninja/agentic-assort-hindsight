import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ImpactBreadcrumbs } from '@shared/components/vendor/impact-ui';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useBreadcrumbItems } from './useBreadcrumbItems';
import { PageChromeProvider, usePageChrome } from './PageChromeContext';
import type { BreadcrumbEntry } from './PageChromeContext';
import styles from './AppShell.module.css';

function AppShellContent() {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const fallbackItems = useBreadcrumbItems();
  const { breadcrumbAction, setBreadcrumbAction, breadcrumbItems } = usePageChrome();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hindsight owns one persistent workspace across its nested report/detail routes.
  // Clearing this slot on every child URL ran after the workspace's publishing
  // effect and removed its review-mode controls. Clear only when its owner changes.
  const breadcrumbActionOwner = /^\/(?:assort|agentic-assort)\/hindsight(?:\/|$)/.test(pathname) && !/\/hindsight\/legacy(?:\/|$)/.test(pathname) ? 'hindsight-workspace' : pathname;
  useEffect(() => {
    setBreadcrumbAction(null);
  }, [breadcrumbActionOwner, setBreadcrumbAction]);

  const fallbackList: BreadcrumbEntry[] = useMemo(
    () =>
      fallbackItems.map((item, i) => ({
        type: `crumb-${i}`,
        label: item.label,
        onClick: item.href
          ? () => {
              if (item.href === '__home__') {
                window.location.assign(window.location.origin + '/home');
                return;
              }
              navigate(item.href!);
            }
          : undefined,
      })),
    [fallbackItems, navigate],
  );

  const entries = breadcrumbItems ?? fallbackList;

  const list = useMemo(
    () => entries.map((e) => ({ id: e.type, type: e.type, label: e.label, onClick: e.onClick, disabled: e.disabled })),
    [entries],
  );

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>
        {t('app.skipToContent')}
      </a>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={styles.body}>
        <Header notificationCount={3} />
        <div className={styles.breadcrumbBar}>
          <ImpactBreadcrumbs list={list} />
          {breadcrumbAction ? (
            <div className={styles.breadcrumbActions}>{breadcrumbAction}</div>
          ) : null}
        </div>
        <main id="main-content" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppShell() {
  return (
    <PageChromeProvider>
      <AppShellContent />
    </PageChromeProvider>
  );
}
