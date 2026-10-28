/**
 * Thin ResizeObserver helper for watching an element's size.
 * Prefer this over viewport breakpoints when the thing that changes
 * size is a specific div (e.g. the resizable chatbot panel).
 */
export interface ElementSize {
    width: number;
    height: number;
}
/** Current width/height of an element. */
export declare function getSize(el: Element): ElementSize;
/**
 * Watch an element with ResizeObserver.
 * Fires immediately with the current size, then on every resize.
 * Returns an unsubscribe function.
 *
 * @example
 * const stop = onResize(panelEl, ({ width, height }) => {
 *   console.log(width, height);
 * });
 * // later: stop();
 */
export declare function onResize(el: Element, callback: (size: ElementSize) => void): () => void;
//# sourceMappingURL=onResize.d.ts.map