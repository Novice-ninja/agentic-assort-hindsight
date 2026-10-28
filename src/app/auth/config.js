const TENANT_MAPPING = {
  BRISCOES: 'briscoes',
  KIK: 'kik',
};

/**
 * Resolve Firebase web config from the host's `localStorage.baseUrl`.
 * Read on each call — the remote may boot before the shell writes baseUrl.
 */
export function getAuthConfig() {
  const raw =
    typeof localStorage !== 'undefined' ? localStorage.getItem('baseUrl') || '' : '';
  const TENANT = raw.split('.')[0] || '';
  const ENV = raw.split('.')[1] || '';

  if (!TENANT) {
    return {};
  }

  if (ENV === 'devs' || ENV === 'test' || ENV === 'sandbox' || TENANT.includes('localhost')) {
    if (TENANT.toLocaleLowerCase() === TENANT_MAPPING.BRISCOES) {
      return {
        apiKey: 'AIzaSyBKFZ9FajIJ64M9N3oqtSiEvDZFggUS5fQ',
        authDomain: 'briscoes-01082024.firebaseapp.com',
      };
    }
    if (TENANT.toLocaleLowerCase() === TENANT_MAPPING.KIK) {
      return {
        apiKey: 'AIzaSyCtMv580ozzrYHYxRPIsKDAuRNR5xT5Yf0',
        authDomain: 'kik-14022025.firebaseapp.com',
      };
    }
    return {
      apiKey: 'AIzaSyDAZfJzJ57rMOyAgmLCgSc3L1NkpnKdFVY',
      authDomain: 'impactsmart.firebaseapp.com',
    };
  }

  if (TENANT.toLocaleLowerCase() === TENANT_MAPPING.KIK) {
    return {
      apiKey: 'AIzaSyCtMv580ozzrYHYxRPIsKDAuRNR5xT5Yf0',
      authDomain: 'kik-14022025.firebaseapp.com',
    };
  }

  return {
    apiKey: 'AIzaSyCo4HZ-TWBP8U36B8d_klhy3ZPg0Jc5D3k',
    authDomain: 'impactsmart-prod.firebaseapp.com',
  };
}

/** @deprecated Prefer getAuthConfig() so baseUrl is read after the host shell mounts. */
const authConfig = getAuthConfig();
export default authConfig;
