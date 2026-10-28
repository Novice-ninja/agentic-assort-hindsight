import { formatUserDisplayName } from '@shared/utils/userInfo';

/** `0` is the backend marker for a plan created by the clustering agent. */
export function createdByLabel(createdBy: string | null, agentLabel: string): string {
  const value = createdBy?.trim() ?? '';
  if (value === '0') return agentLabel;
  if (!value) return '-';
  return formatUserDisplayName(value);
}
