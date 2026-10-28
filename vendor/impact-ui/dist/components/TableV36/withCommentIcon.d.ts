/**
 * True when a column's `cellRenderer` still ends up painting just the raw value, so AG Grid's
 * truncation-based tooltip is meaningful for it. Covers both "no renderer at all" and this HOC
 * wrapping nothing, which is what every column looks like once the comment feature is enabled.
 */
export declare const isPlainValueRenderer: (colDef: any) => any;
/**
 * Returns a memoized HOC wrapper for the given renderer.
 * Prefer this over calling `withCommentIcon` directly when building columnDefs.
 */
export declare const getCachedCommentIconWrapper: (Renderer: any) => any;
export declare const withCommentIcon: (Renderer: any) => any;
//# sourceMappingURL=withCommentIcon.d.ts.map