import type { Permission } from '@config/permissions';
import { personaHas } from './persona';

/** Gate UI and client checks against the active clustering persona. */
export function can(permission: Permission): boolean {
  return personaHas(permission);
}
