import type { Permission } from '@config/permissions';

export type ClusteringPersonaId =
  | 'admin'
  | 'planner'
  | 'approver'
  | 'signoff-owner'
  | 'restricted-viewer';

export const PERSONA_PERMISSIONS: Record<ClusteringPersonaId, Permission[]> = {
  admin: ['clustering:read', 'clustering:write', 'clustering:approve', 'clustering:signoff'],
  planner: ['clustering:read', 'clustering:write'],
  approver: ['clustering:read', 'clustering:approve'],
  'signoff-owner': ['clustering:read', 'clustering:signoff'],
  'restricted-viewer': ['clustering:read'],
};

let activePersona: ClusteringPersonaId = 'admin';

export function getActivePersona(): ClusteringPersonaId {
  return activePersona;
}

export function setActivePersona(persona: ClusteringPersonaId): void {
  activePersona = persona;
}

export function personaHas(permission: Permission): boolean {
  return PERSONA_PERMISSIONS[activePersona].includes(permission);
}
