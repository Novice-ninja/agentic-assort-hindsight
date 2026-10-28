export interface DebouncedFunction<T extends (...args: Parameters<T>) => void> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}
/**
 * Creates a debounced function that delays invoking func until after delay milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns A debounced version of the function with a cancel method
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debouncedSearch('hello'); // Will only execute after 300ms of no calls
 * debouncedSearch.cancel(); // Cancels any pending invocation
 */
export declare const debounce: <T extends (...args: Parameters<T>) => void>(func: T, delay: number) => DebouncedFunction<T>;
//# sourceMappingURL=debounce.d.ts.map