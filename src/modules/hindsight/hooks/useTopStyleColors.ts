import { useCallback, useEffect, useRef, useState } from "react";
import type { LoadStatus } from "@shared/types";
import { useFlooringScope } from "../priority/flooringScope";
import { getTopStyleColors } from "../api/getTopStyleColors";
import {
  TOP_STYLE_COLORS_PAGE_SIZE,
  type TopStyleColorItem,
  type TopStyleColorsPagination,
} from "../types";

export type TopStyleColorsPageStatus = "idle" | "loading" | "failed";

export interface TopStyleColorsParams {
  planCode?: string;
  /** Page size; defaults to `TOP_STYLE_COLORS_PAGE_SIZE` and is clamped server-side too. */
  topN?: number;
  /** Only fetch while true — e.g. gate on the Overview tab being active. */
  enabled?: boolean;
}

export interface TopStyleColorsResult {
  items: TopStyleColorItem[];
  /** Initial page status. */
  status: LoadStatus;
  /** Status of a subsequent page while earlier items stay visible. */
  pageStatus: TopStyleColorsPageStatus;
  hasMore: boolean;
  totalCount: number;
  /** Fetch the next page when `hasMore` and nothing is already in flight. */
  loadMore: () => void;
  /** Re-run the first page (also used after an initial failure). */
  retry: () => void;
  /** Re-try only the failed next page. */
  retryPage: () => void;
}

function emptyPagination(): TopStyleColorsPagination {
  return {
    cursor: "",
    pageSize: TOP_STYLE_COLORS_PAGE_SIZE,
    hasMore: false,
    totalCount: 0,
  };
}

function mergeByArticle(
  existing: readonly TopStyleColorItem[],
  incoming: readonly TopStyleColorItem[],
): TopStyleColorItem[] {
  if (incoming.length === 0) return [...existing];
  const seen = new Set(existing.map((item) => item.article));
  const next = [...existing];
  for (const item of incoming) {
    if (seen.has(item.article)) continue;
    seen.add(item.article);
    next.push(item);
  }
  return next;
}

/**
 * Loads Top Performing Style-Colors for a plan with keyset (cursor) pagination.
 *
 * First page replaces the list; further pages append. Changing `planCode` clears items and the
 * cursor entirely — a cursor from another plan is invalid. Requests are keyed so a stale
 * response never overwrites a newer plan's state.
 */
export function useTopStyleColors({
  planCode,
  topN = TOP_STYLE_COLORS_PAGE_SIZE,
  enabled = true,
}: TopStyleColorsParams): TopStyleColorsResult {
  const [items, setItems] = useState<TopStyleColorItem[]>([]);
  const [pagination, setPagination] =
    useState<TopStyleColorsPagination>(emptyPagination);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [pageStatus, setPageStatus] =
    useState<TopStyleColorsPageStatus>("idle");

  const flooring = useFlooringScope(planCode);
  const requestKey = JSON.stringify([
    planCode,
    topN,
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
        setPagination(emptyPagination());
        cursorRef.current = "";
        hasMoreRef.current = false;
      } else {
        setPageStatus("loading");
      }

      try {
        const data = await getTopStyleColors(
          {
            planCode,
            top: topN,
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
          mode === "initial"
            ? data.products
            : mergeByArticle(prev, data.products),
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
          setPagination(emptyPagination());
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
    [planCode, topN, enabled, requestKey, flooring.scope],
  );

  useEffect(() => {
    if (!enabled || planCode === undefined || planCode.length === 0) {
      requestIdRef.current += 1;
      inFlightRef.current = false;
      abortRef.current?.abort();
      cursorRef.current = "";
      hasMoreRef.current = false;
      boundKeyRef.current = "";
      setItems([]);
      setPagination(emptyPagination());
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
  }, [enabled, planCode, topN, requestKey, fetchPage]);

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
