import type { ReactNode } from 'react';
import { useAppConfigBootstrap } from '@modules/appConfig';

/**
 * Requests the application and KPI config once, as high in the tree as the store allows.
 *
 * It renders its children immediately rather than gating them on the request: the store starts
 * on the baked-in fallback config, so a slow or failing config endpoint costs nothing but the
 * newer values. Must sit inside `StoreProvider`.
 */
export function AppConfigProvider({ children }: { children: ReactNode }) {
  useAppConfigBootstrap();
  return <>{children}</>;
}
