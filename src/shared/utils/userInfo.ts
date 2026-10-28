/**
 * Display label for a user identity. Emails (`user@host`) show the local part with the
 * first character capitalised; anything without `@` is returned unchanged.
 */
export function formatUserDisplayName(identity: string): string {
  const trimmed = identity.trim();
  if (!trimmed.includes('@')) return trimmed;

  const local = trimmed.split('@')[0] ?? '';
  if (local.length === 0) return trimmed;

  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function getUserInfo() {
  const userEmailId = localStorage.getItem('name');
  if (!userEmailId) {
    return { userName: '', userEmail: '' };
  }
  return {
    userName: formatUserDisplayName(userEmailId),
    userEmail: userEmailId,
  };
}
