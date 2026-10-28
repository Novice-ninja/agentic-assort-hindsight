/**
 * Subscribes to a CSS media query via `window.matchMedia` and returns whether it currently
 * matches. Re-renders when the match state changes (e.g. the viewport crosses the threshold).
 *
 * @param query - A valid CSS media query string, e.g. `'(max-width: 768px)'`.
 * @param defaultMatches - Value returned during SSR / before `window` is available. Defaults to `false`.
 */
export declare function useMediaQuery(query: string, defaultMatches?: boolean): boolean;
//# sourceMappingURL=useMediaQuery.d.ts.map