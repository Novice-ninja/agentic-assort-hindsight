import { useCallback, useEffect, useRef, useState } from "react";
import type { LoadStatus } from "@shared/types";
import { useFlooringScope } from "../priority/flooringScope";
import { getOverviewRecommendations } from "../api/getOverviewRecommendations";
import {
  RECOMMENDATIONS_PAGE_SIZE,
  type RecommendationItem,
  type RecommendationsPagination,
  type RecommendationType,
} from "../types";

export type RecommendationsPageStatus = "idle" | "loading" | "failed";

export interface OverviewRecommendationsParams {
  planCode?: string;
  recommendationType: RecommendationType;
  /** Page size; defaults to this panel's constant and is clamped in the service. */
  top?: number;
  /** Only fetch while true — e.g. gate on the Overview tab being active. */
  enabled?: boolean;
}

export interface OverviewRecommendationsResult {
  items: RecommendationItem[];
  /** Initial page status. */
  status: LoadStatus;
  /** Status of a subsequent page while earlier items stay visible. */
  pageStatus: RecommendationsPageStatus;
  hasMore: boolean;
  totalCount: number;
  /** Fetch the next page when `hasMore` and nothing is already in flight. */
  loadMore: () => void;
  /** Re-run the first page (also used after an initial failure). */
  retry: () => void;
  /** Re-try only the failed next page. */
  retryPage: () => void;
}

function emptyPagination(pageSize: number): RecommendationsPagination {
  return { cursor: "", pageSize, hasMore: false, totalCount: 0 };
}

function mergeById(
  existing: readonly RecommendationItem[],
  incoming: readonly RecommendationItem[],
): RecommendationItem[] {
  if (incoming.length === 0) return [...existing];
  const seen = new Set(existing.map((item) => item.id));
  const next = [...existing];
  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
  }
  return next;
}

/**
 * Loads one Overview recommendations panel with keyset (cursor) pagination.
 *
 * First page replaces the list; further pages append in server order, de-duplicated by product
 * id. Changing `planCode` or `recommendationType` clears items and the cursor entirely — a cursor
 * only means anything to the query that produced it. Requests are keyed and aborted, so a late
 * response can neither overwrite newer state nor populate a stale panel.
 */
export function useOverviewRecommendations({
  planCode,
  recommendationType,
  top = RECOMMENDATIONS_PAGE_SIZE[recommendationType],
  enabled = true,
}: OverviewRecommendationsParams): OverviewRecommendationsResult {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [pagination, setPagination] = useState<RecommendationsPagination>(() =>
    emptyPagination(top),
  );
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [pageStatus, setPageStatus] =
    useState<RecommendationsPageStatus>("idle");

  const flooring = useFlooringScope(planCode);
  const requestKey = JSON.stringify([
    planCode,
    recommendationType,
    top,
    enabled,
    flooring.revision,
    flooring.scope,
  ]);
  const activeKeyRef = useRef(requestKey);
  activeKeyRef.current = requestKey;
  const boundKeyRef = useRef("");
  const [boundKey, setBoundKey] = useState("");

  const requestIdRef = useRef(0);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const cursorRef = useRef("");
  const hasMoreRef = useRef(false);

  const fetchPage = useCallback(
    async (mode: "initial" | "next") => {
      if (
        !enabled ||
        planCode === undefined ||
        planCode.length === 0 ||
        activeKeyRef.current !== requestKey
      )
        return;
      // A next page waits its turn; a first page replaces whatever is in flight, because the
      // plan or panel it belonged to is no longer the one being shown.
      if (
        mode === "next" &&
        (inFlightRef.current ||
          !hasMoreRef.current ||
          boundKeyRef.current !== requestKey)
      )
        return;

      const requestId = ++requestIdRef.current;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      inFlightRef.current = true;

      if (mode === "initial") {
        boundKeyRef.current = requestKey;
        setBoundKey(requestKey);
        setStatus("loading");
        setPageStatus("idle");
        setItems([]);
        setPagination(emptyPagination(top));
        cursorRef.current = "";
        hasMoreRef.current = false;
      } else {
        setPageStatus("loading");
      }

      try {
        const data = await getOverviewRecommendations(
          {
            planCode,
            recommendationType,
            top,
            cursor: mode === "initial" ? "" : cursorRef.current,
            hierarchyScope: JSON.parse(JSON.stringify(flooring.scope)),
          },
          { signal: controller.signal },
        );

        if (
          requestId !== requestIdRef.current ||
          requestKey !== activeKeyRef.current
        )
          return;

        cursorRef.current = data.pagination.cursor;
        hasMoreRef.current = data.pagination.hasMore;
        setPagination(data.pagination);
        setItems((prev) =>
          mode === "initial" ? data.items : mergeById(prev, data.items),
        );
        setStatus("succeeded");
        setPageStatus("idle");
      } catch {
        if (
          requestId !== requestIdRef.current ||
          requestKey !== activeKeyRef.current
        )
          return;
        if (mode === "initial") {
          setStatus("failed");
          setItems([]);
          setPagination(emptyPagination(top));
        } else {
          setPageStatus("failed");
        }
      } finally {
        if (
          requestId === requestIdRef.current &&
          requestKey === activeKeyRef.current
        ) {
          inFlightRef.current = false;
        }
      }
    },
    [planCode, recommendationType, top, enabled, requestKey, flooring.scope],
  );

  useEffect(() => {
    if (!enabled || planCode === undefined || planCode.length === 0) {
      requestIdRef.current += 1;
      inFlightRef.current = false;
      cursorRef.current = "";
      hasMoreRef.current = false;
      boundKeyRef.current = "";
      setItems([]);
      setPagination(emptyPagination(top));
      setStatus("idle");
      setPageStatus("idle");
      return;
    }
    void fetchPage("initial");
    return () => {
      requestIdRef.current += 1;
      inFlightRef.current = false;
      abortRef.current?.abort();
    };
  }, [enabled, planCode, recommendationType, top, requestKey, fetchPage]);

  const loadMore = useCallback(() => {
    if (status !== "succeeded" || pageStatus === "loading") return;
    void fetchPage("next");
  }, [fetchPage, pageStatus, status]);

  const retry = useCallback(() => {
    void fetchPage("initial");
  }, [fetchPage]);

  const retryPage = useCallback(() => {
    if (pageStatus !== "failed") return;
    void fetchPage("next");
  }, [fetchPage, pageStatus]);

  const matches = boundKey === requestKey;
  const available =
    enabled && typeof planCode === "string" && planCode.length > 0;
  return {
    items: matches && available ? items : [],
    status: available ? (matches ? status : "loading") : "idle",
    pageStatus: matches && available ? pageStatus : "idle",
    hasMore: matches && available && pagination.hasMore,
    totalCount: matches && available ? pagination.totalCount : 0,
    loadMore,
    retry,
    retryPage,
  };
}
