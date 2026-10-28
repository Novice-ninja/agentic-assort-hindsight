import type { LocationStatus } from '../types';

const STATUS_VARIANT: Record<LocationStatus, 'success' | 'neutral' | 'warning'> = {
  open: 'success',
  closed: 'neutral',
  pending: 'warning',
};

export function locationStatusVariant(status: LocationStatus) {
  return STATUS_VARIANT[status];
}
