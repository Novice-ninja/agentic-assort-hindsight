export const PERMISSIONS = [
  'dashboard:read',
  'products:read',
  'locations:read',
  'hindsight:read',
  'admin:read',
  'admin:write',
  'plans:read',
  'plans:write',
  'clustering:read',
  'clustering:write',
  'clustering:approve',
  'clustering:signoff',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type Role = 'admin' | 'viewer';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'dashboard:read',
    'products:read',
    'locations:read',
    'hindsight:read',
    'admin:read',
    'admin:write',
    'plans:read',
    'plans:write',
    'clustering:read',
    'clustering:write',
    'clustering:approve',
    'clustering:signoff',
  ],
  viewer: [
    'dashboard:read',
    'products:read',
    'locations:read',
    'admin:read',
    'plans:read',
    'hindsight:read',
    'admin:write',
    'clustering:read',
  ],
};

export function hasPermission(role: Role, permission?: Permission): boolean {
  if (!permission) return true;
  return ROLE_PERMISSIONS[role].includes(permission);
}
