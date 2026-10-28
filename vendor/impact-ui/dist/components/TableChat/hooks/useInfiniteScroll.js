import { useState, useRef, useEffect, useCallback } from "react";
const useInfiniteScroll = (fetchMore, options = {}) => {
  const {
    threshold = 0.1,
    // Intersection Observer threshold
    rootMargin = "100px",
    // Root margin for early triggering
    enabled = true,
    // Whether infinite scroll is enabled
    isRestoringScroll = null
    // Ref to check if scroll is being restored
  } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const isLoadingRef = useRef(false);
  const lastLoadTimeRef = useRef(0);
  const initialLoadRef = useRef(true);
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore || !enabled) {
      return;
    }
    const now = Date.now();
    if (now - lastLoadTimeRef.current < 1e3) {
      console.log("[useInfiniteScroll] Debouncing load more request");
      return;
    }
    lastLoadTimeRef.current = now;
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      console.log("[useInfiniteScroll] Loading more data, page:", page + 1);
      const result = await fetchMore(page + 1);
      if (result && Array.isArray(result) && result.length > 0) {
        setPage((prevPage) => prevPage + 1);
        console.log("[useInfiniteScroll] Loaded", result.length, "more items");
      } else {
        setHasMore(false);
        console.log("[useInfiniteScroll] No more data available - result:", result);
      }
    } catch (err) {
      console.error("[useInfiniteScroll] Error loading more data:", err);
      setError(err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchMore, page, hasMore, enabled]);
  useEffect(() => {
    if (!enabled || !hasMore) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingRef.current && hasMore) {
          if (isRestoringScroll == null ? void 0 : isRestoringScroll.current) {
            console.log("[useInfiniteScroll] Skipping load - scroll is being restored");
            return;
          }
          if (initialLoadRef.current) {
            console.log(
              "[useInfiniteScroll] Initial load detected, setting timer to enable and load"
            );
            setTimeout(() => {
              initialLoadRef.current = false;
              if (loadMoreRef.current && !isLoadingRef.current && hasMore) {
                if (isRestoringScroll == null ? void 0 : isRestoringScroll.current) {
                  console.log(
                    "[useInfiniteScroll] Timer: Skipping load - scroll is being restored"
                  );
                  return;
                }
                const container2 = loadMoreRef.current.closest(".table-chat-messages");
                if (container2) {
                  const scrollTop = container2.scrollTop;
                  const scrollHeight = container2.scrollHeight;
                  const threshold2 = Math.min(500, scrollHeight * 0.15);
                  const isNearTop = scrollTop < threshold2;
                  if (isNearTop) {
                    console.log("[useInfiniteScroll] Timer: Near top detected, loading more...");
                    loadMore();
                  } else {
                    console.log("[useInfiniteScroll] Timer: Not near top, skipping load", {
                      scrollTop,
                      scrollHeight,
                      isNearTop
                    });
                  }
                } else {
                  console.log(
                    "[useInfiniteScroll] Timer: Container not found, loading more anyway..."
                  );
                  loadMore();
                }
              } else {
                console.log("[useInfiniteScroll] Timer: Conditions not met for loading", {
                  hasLoadMoreRef: !!loadMoreRef.current,
                  isLoading: isLoadingRef.current,
                  hasMore
                });
              }
            }, 500);
            return;
          }
          const container = entry.target.closest(".table-chat-messages");
          if (container) {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            const threshold2 = Math.min(500, scrollHeight * 0.15);
            const isNearTop = scrollTop < threshold2;
            if (isNearTop) {
              console.log("[useInfiniteScroll] Near top detected, loading more...", {
                scrollTop,
                scrollHeight,
                clientHeight,
                isNearTop
              });
              loadMore();
            } else {
              console.log(
                "[useInfiniteScroll] Intersection detected but not near top, ignoring...",
                { scrollTop, scrollHeight, clientHeight, isNearTop }
              );
            }
          } else {
            console.log("[useInfiniteScroll] Container not found, loading more anyway...");
            loadMore();
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px 0px 0px 0px"
        // Only trigger when element is 200px from top
      }
    );
    observerRef.current = observer;
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, threshold, enabled, hasMore]);
  const reset = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    isLoadingRef.current = false;
    lastLoadTimeRef.current = 0;
    initialLoadRef.current = true;
  }, []);
  const updateHasMore = useCallback((newHasMore) => {
    setHasMore(newHasMore);
  }, []);
  const updateCurrentPage = useCallback(
    (newPage) => {
      setPage(newPage);
    },
    [page]
  );
  return {
    loadMoreRef,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset,
    updateHasMore,
    updateCurrentPage,
    currentPage: page
  };
};
export {
  useInfiniteScroll as default
};
