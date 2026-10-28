import type { ReactNode } from 'react';
import { hasPermission } from '@config/permissions';
import type { Permission, Role } from '@config/permissions';

// No auth system is in scope; the current role is fixed. Swap this for real
// session/role resolution when authentication is introduced.
const CURRENT_ROLE: Role = 'admin';

export function RouteGuard({
  permission,
  children,
}: {
  permission?: Permission;
  children: ReactNode;
}) {
  if (!hasPermission(CURRENT_ROLE, permission)) {
    return <div role="alert">You do not have access to this page.</div>;
  }
  return <>{children}</>;
}
