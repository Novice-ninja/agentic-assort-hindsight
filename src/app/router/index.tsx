import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '@app/layouts';
import { ROUTES } from '@config/routes';
import { RouteGuard } from './RouteGuard';
import { ProductsPage } from '@pages/Products';
import { LocationsPage } from '@pages/Locations';
import { PlaceholderPage } from '@pages/Placeholder';
import { AdminPage } from '@pages/Admin';
import { CreatePlanPage, KbPlanRedirectPage } from '@pages/Plans';
import { HindsightFallback } from '@pages/Hindsight/HindsightFallback';
import { ClusteringFallback } from '@pages/Clustering/ClusteringFallback';
import { useMocks } from '@config/env';
import localPlans from '@mocks/pdfData/PL-plans.json';
import { buildStoredFilterStrip, savePlanFilterStrip } from '@modules/hindsight/services/buildPlanFilterStrip';
import { applyFlooringScope, getFlooringScope } from '@modules/hindsight/priority/flooringScope';

/**
 * Hindsight is code-split: it pulls in the grid and chart layers, which no other route needs.
 * Loading it on demand keeps that weight out of the initial bundle.
 */
const HindsightPage = lazy(async () => ({
  default: (await import('@pages/Hindsight')).HindsightPage,
}));
const HindsightWorkspacePage = lazy(async () => ({
  default: (await import('@modules/hindsight/redesign/WorkspacePage')).HindsightWorkspacePage,
}));
const ClusterPlansPage = lazy(async () => ({
  default: (await import('@pages/Clustering')).ClusterPlansPage,
}));
const ClusterWizardPage = lazy(async () => ({
  default: (await import('@pages/Clustering')).ClusterWizardPage,
}));
const DescribeClusterPlanPage = lazy(async () => ({
  default: (await import('@pages/Clustering')).DescribeClusterPlanPage,
}));

/**
 * Seed the existing local flooring plan directly. This avoids rendering the retired dashboard
 * or waiting for a plan-list redirect before the Hindsight loading state appears.
 */
function HindsightEntry({ destination = ROUTES.hindsight }: { destination?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasPlan = typeof (location.state as { planId?: unknown } | null)?.planId === 'string';
  // BrowserRouter subscribes to history in its layout effect. A child layout effect
  // runs first and can lose this navigation on a cold production mount; a passive
  // effect runs after the router listener exists. Keep the loading shell until then.
  useEffect(() => {
    if (!useMocks || hasPlan) return;
    const plan = localPlans.data[0];
    const levels: Record<string,string> = { Division:'l0_name', Category:'l1_name', 'Sub Category':'l2_name' };
    const hierarchyScope = plan.hierarchyScope.split(';').flatMap(part => {
      const separator = part.indexOf(':'); if (separator < 0) return [];
      const levelName = part.slice(0,separator).trim(); const levelNo = levels[levelName];
      return levelNo ? [{levelName,levelNo,selectedValues:part.slice(separator+1).split(',').map(value=>value.trim()).filter(Boolean)}] : [];
    });
    savePlanFilterStrip(buildStoredFilterStrip({id:plan.planCode,season:plan.planSeason,hierarchyScope}));
    applyFlooringScope(getFlooringScope(plan.planCode),plan.planCode);
    navigate(destination,{replace:true,state:{planId:plan.planCode,seasonCode:plan.planSeasonCode,referenceSeasonCode:plan.referenceSeasonCode,planName:plan.planName}});
  }, [hasPlan,navigate,destination]);
  if (useMocks && !hasPlan) return <HindsightFallback />;
  return <HindsightPage />;
}

function LegacyRouteRedirect() {
  const location = useLocation();
  return <Navigate replace to={location.pathname.replace(/^\/agentic-assort(?=\/|$)/,'/assort') + location.search + location.hash} state={location.state} />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* The dashboard is retired from the nav; its URL now lands on Hindsight too. */}
        <Route path={ROUTES.dashboard} element={<Navigate replace to={ROUTES.hindsight} />} />
        <Route path="/agentic-assort/*" element={<LegacyRouteRedirect />} />
        <Route
          path={ROUTES.products}
          element={
            <RouteGuard permission="products:read">
              <ProductsPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.locations}
          element={
            <RouteGuard permission="locations:read">
              <LocationsPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.plans}
          element={
            <RouteGuard permission="plans:read">
              <KbPlanRedirectPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.createPlan}
          element={
            <RouteGuard permission="plans:write">
              <CreatePlanPage />
            </RouteGuard>
          }
        />

        <Route
          path={`${ROUTES.hindsight}/legacy`}
          element={
            <RouteGuard permission="hindsight:read">
              <Suspense fallback={<HindsightFallback />}>
                <HindsightEntry destination={`${ROUTES.hindsight}/legacy`} />
              </Suspense>
            </RouteGuard>
          }
        />
        <Route path={`${ROUTES.hindsight}/*`} element={<RouteGuard permission="hindsight:read"><Suspense fallback={<HindsightFallback />}><HindsightWorkspacePage /></Suspense></RouteGuard>} />
        <Route
          path={ROUTES.clustering}
          element={
            <RouteGuard permission="clustering:read">
              <Suspense fallback={<ClusteringFallback />}>
                <ClusterPlansPage />
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.createClusterPlan}
          element={
            <RouteGuard permission="clustering:write">
              <Suspense fallback={<ClusteringFallback />}>
                <ClusterWizardPage />
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.describeClusterPlan}
          element={
            <RouteGuard permission="clustering:write">
              <Suspense fallback={<ClusteringFallback />}>
                <DescribeClusterPlanPage />
              </Suspense>
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.clusteringPlan}
          element={
            <RouteGuard permission="clustering:read">
              <Suspense fallback={<ClusteringFallback />}>
                <ClusterWizardPage />
              </Suspense>
            </RouteGuard>
          }
        />
        <Route path="/reports" element={<PlaceholderPage titleKey="nav.reports" />} />
        <Route
          path="/admin"
          element={
            <RouteGuard permission="admin:read">
              <AdminPage />
            </RouteGuard>
          }
        />
        <Route path="/settings" element={<PlaceholderPage titleKey="nav.settings" />} />
        <Route path="/logout" element={<PlaceholderPage titleKey="nav.logout" />} />
        {/* Default landing: any unmatched path (including "/") opens Hindsight for the KB Plan. */}
        <Route path="*" element={<Navigate replace to={ROUTES.hindsight} />} />
      </Route>
    </Routes>
  );
}
