/** A fixture resolver is injected so recovery can be tested without a Service Worker. */
export interface LocalApiRecoveryOptions {
  origin: string;
  fetch: typeof globalThis.fetch;
  resolve: (request: Request) => Promise<Response | undefined>;
  onRecovered?: (request: Request) => void;
}

export function isLocalMockApi(url: URL, origin: string): boolean {
  return url.origin === origin && /^\/(?:api|agentic-assort-go\/api)(?:\/|$)/.test(url.pathname);
}

function isAbort(error: unknown, request: Request): boolean {
  if (request.signal.aborted) return true;
  return error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError');
}

/**
 * A replaced/idle Service Worker can lose the client that activated MSW. Vite then
 * answers a mock API path with SPA HTML (or 404/405). Replay that request against the
 * same in-page handler instances once, retaining preferences and Working Plan state.
 * Real JSON errors and user cancellations keep their normal error paths.
 */
export function createLocalApiRecoveryFetch(options: LocalApiRecoveryOptions): typeof globalThis.fetch {
  return async (input, init) => {
    const inputUrl = input instanceof Request ? input.url : String(input);
    const url = new URL(inputUrl, options.origin);
    if (!isLocalMockApi(url, options.origin)) return options.fetch(input, init);

    const request = new Request(input instanceof Request ? input : url.href, init);
    const replay = request.clone();
    let response: Response;
    try {
      response = await options.fetch(request);
    } catch (error) {
      if (isAbort(error, request)) throw error;
      const recovered = await options.resolve(replay);
      if (recovered) {
        options.onRecovered?.(replay);
        return recovered;
      }
      throw error;
    }

    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    if (response.status !== 204 && !contentType.includes('json')) {
      const recovered = await options.resolve(replay);
      if (recovered) {
        options.onRecovered?.(replay);
        return recovered;
      }
    }
    return response;
  };
}

let resilientFetch: typeof globalThis.fetch | undefined;

/** Only called by the HTTP client while APP_USE_MOCKS is enabled. */
export async function fetchWithLocalApiRecovery(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  resilientFetch ??= createLocalApiRecoveryFetch({
    origin: window.location.origin,
    fetch: globalThis.fetch.bind(globalThis),
    async resolve(request) {
      // These are the already-loaded handler instances, not a fresh fixture copy.
      const [{ worker }, { handleRequest }] = await Promise.all([
        import('./browser'),
        import('msw'),
      ]);
      return handleRequest(
        request,
        crypto.randomUUID(),
        [...worker.listHandlers()] as Parameters<typeof handleRequest>[2],
        { onUnhandledRequest: 'bypass' },
        { emit: () => false } as unknown as Parameters<typeof handleRequest>[4],
      );
    },
    onRecovered(request) {
      console.info(`[local preview] Recovered fixture response for ${request.method} ${new URL(request.url).pathname}`);
    },
  });
  return resilientFetch(input, init);
}
