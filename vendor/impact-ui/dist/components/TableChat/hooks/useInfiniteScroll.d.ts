/**
 * Custom hook for infinite scroll functionality using Intersection Observer
 * @param {Function} fetchMore - Function to fetch more data
 * @param {Object} options - Configuration options
 * @returns {Object} - { loadMoreRef, isLoading, hasMore, error, loadMore }
 */
declare const useInfiniteScroll: (fetchMore: any, options?: {}) => {
    loadMoreRef: import('react').MutableRefObject<null>;
    isLoading: boolean;
    hasMore: boolean;
    error: null;
    loadMore: () => Promise<void>;
    reset: () => void;
    updateHasMore: (newHasMore: any) => void;
    updateCurrentPage: (newPage: any) => void;
    currentPage: number;
};
export default useInfiniteScroll;
//# sourceMappingURL=useInfiniteScroll.d.ts.map