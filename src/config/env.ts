/**
 * Typed, validated environment access. The ONLY place env vars are read.
 * Values are injected at build time via Webpack DefinePlugin (process.env.*),
 * never via import.meta.env (we are Vite-free).
 */
export type AppEnvironment = 'development' | 'production' | 'test' | 'uat';

interface Env {
  apiBaseUrl: string;
  /**
   * Absolute base for the real Go backend (plans, product-performance KPIs, ...). These
   * endpoints are cross-origin and bypass the MSW `apiBaseUrl` prefix, so the host lives in
   * one place here rather than being hardcoded at each call site.
   */
  goApiBaseUrl: string;
  /**
   * Absolute base for the agent service that generates the AI insights. It is a different
   * service from the Go backend and sits on its own path, so it cannot be derived from
   * `goApiBaseUrl`.
   */
  agentApiBaseUrl: string;
  defaultLocale: string;
  appEnv: AppEnvironment;
  /** Tenant the host shell mounted this remote for. Empty when running standalone. */
  client: string;
  /**
   * Commercial licence keys for the vendor UI layer. Empty until supplied by the
   * environment — the grid and charts fall back to their unlicensed behaviour, which is
   * why these are read here and never inlined at a call site.
   */
  /** Fallback user email until a real auth system is in place. */
  defaultUserEmail: string;
  agGridLicenseKey: string;
  highchartsLicenseKey: string;
  /**
   * PostHog Cloud project API key. Empty disables tracking so local/test builds
   * do not send events until the key is supplied at build time.
   */
  posthogKey: string;
  /** PostHog Cloud ingestion host. US cloud by default; EU is `https://eu.i.posthog.com`. */
  posthogHost: string;
  /** Phase-one default mirrors the deployed connection error; sample is an explicit developer opt-in. */
  localIrisMode: 'connection-error' | 'sample';
}

/** Variables the build did not substitute. Reported once, after `env` is assembled. */
const notInjected: string[] = [];

/**
 * Reads one build-time variable.
 *
 * DefinePlugin substitutes `process.env.*` at build time, so there is no `process` in the
 * browser to fall back on. A variable the build did not substitute would throw on first access
 * and take the whole app down — a harsh punishment for adding a variable and not restarting the
 * dev server, since Webpack reads its own config only at startup. Reading through here degrades
 * that to the default below, and says so.
 */
function fromBuild(key: string, read: () => string | undefined): string | undefined {
  try {
    return read();
  } catch {
    notInjected.push(key);
    return undefined;
  }
}

function readString(value: string | undefined, fallback: string): string {
  return value && value.length > 0 ? value : fallback;
}

function readEnvironment(value: string | undefined): AppEnvironment {
  if (value === 'production' || value === 'test' || value === 'development' || value === 'uat') {
    return value;
  }
  // Deployed "devs" / sandbox builds are still non-production.
  if (value === 'devs' || value === 'sandbox') {
    return 'development';
  }
  return 'development';
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
}

const baseUrl = localStorage.getItem('baseUrl');

export const env: Env = {
  apiBaseUrl: readString(
    fromBuild('APP_API_BASE_URL', () => process.env.APP_API_BASE_URL),
    `https://${baseUrl}/api`,
  ),
  goApiBaseUrl: readString(
    fromBuild('APP_GO_API_BASE_URL', () => process.env.APP_GO_API_BASE_URL),
    `https://${baseUrl}/agentic-assort-go/api`,
  ),
  agentApiBaseUrl: readString(
    fromBuild('APP_AGENT_API_BASE_URL', () => process.env.APP_AGENT_API_BASE_URL),
    `https://${baseUrl}/api/assort-agent`,
  ),
  localIrisMode:
    fromBuild('APP_LOCAL_IRIS_MODE', () => process.env.APP_LOCAL_IRIS_MODE) === 'sample'
      ? 'sample'
      : 'connection-error',
  defaultLocale: readString(
    fromBuild('APP_DEFAULT_LOCALE', () => process.env.APP_DEFAULT_LOCALE),
    'en',
  ),
  appEnv: readEnvironment(fromBuild('APP_ENV', () => process.env.APP_ENV)),
  client: readString(
    fromBuild('CLIENT', () => process.env.CLIENT),
    '',
  ),
  defaultUserEmail: readString(
    fromBuild('APP_USER_EMAIL', () => process.env.APP_USER_EMAIL),
    'qa@impactanalytics.co',
  ),
  agGridLicenseKey: readString(
    fromBuild('APP_AG_GRID_LICENSE_KEY', () => process.env.APP_AG_GRID_LICENSE_KEY),
    '',
  ),
  highchartsLicenseKey: readString(
    fromBuild('APP_HIGHCHARTS_LICENSE_KEY', () => process.env.APP_HIGHCHARTS_LICENSE_KEY),
    '',
  ),
  posthogKey: readString(
    fromBuild('APP_POSTHOG_KEY', () => process.env.APP_POSTHOG_KEY),
    'phc_tnDs8bF62KUoBBk2X3TRGW6aU2CC3Ks7UdCDs5nzDjxT',
  ),
  posthogHost: readString(
    fromBuild('APP_POSTHOG_HOST', () => process.env.APP_POSTHOG_HOST),
    'https://us.i.posthog.com',
  ),
};

if (notInjected.length > 0) {
  console.warn(
    `[config] ${notInjected.join(', ')} were not injected at build time, so their defaults are ` +
      'in use. Webpack reads webpack.config.js once at startup — restart the dev server after ' +
      'adding a variable.',
  );
}

export const isDev = env.appEnv === 'development';
export const isProd = env.appEnv === 'production';
/**
 * MSW browser mock layer. Off by default so Go/backend calls hit the network.
 * Opt in explicitly with `APP_USE_MOCKS=true` at build/dev time.
 */
export const useMocks = readBoolean(
  fromBuild('APP_USE_MOCKS', () => process.env.APP_USE_MOCKS),
  false,
);
