/**
 * Hook to detect if text content is overflowing its container
 * Useful for conditionally showing tooltips or truncation indicators
 *
 * @returns Object containing ref to attach to element and overflow state
 *
 * @example
 * function Component() {
 *   const { textRef, isOverflowing } = useTextOverflow();
 *   return (
 *     <div ref={textRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
 *       {isOverflowing && <Tooltip content="Full text..." />}
 *       Long text content...
 *     </div>
 *   );
 * }
 */
export declare const useTextOverflow: (deps?: unknown[]) => {
    textRef: React.RefObject<HTMLElement>;
    isOverflowing: boolean;
};
//# sourceMappingURL=useTextOverflow.d.ts.map