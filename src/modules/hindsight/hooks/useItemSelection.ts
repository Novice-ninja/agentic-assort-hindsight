import { useCallback, useMemo, useState } from 'react';

export interface ItemSelectionResult {
  /** Articles currently checked in either By Item view. */
  selectedArticles: ReadonlySet<string>;
  selectedCount: number;
  isSelected: (article: string) => boolean;
  toggle: (article: string) => void;
  setSelected: (articles: readonly string[], selected: boolean) => void;
  selectAll: (articles: readonly string[]) => void;
  clear: () => void;
}

/**
 * Article-level multi-select shared by Visuals View cards and Table View rows.
 *
 * Selection is keyed by article (the override endpoint's id), so a check made on a card is the
 * same check the matching table row shows after a view switch.
 */
export function useItemSelection(): ItemSelectionResult {
  const [selectedArticles, setSelectedArticles] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const isSelected = useCallback(
    (article: string) => article.length > 0 && selectedArticles.has(article),
    [selectedArticles],
  );

  const toggle = useCallback((article: string) => {
    if (article.length === 0) return;
    setSelectedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(article)) next.delete(article);
      else next.add(article);
      return next;
    });
  }, []);

  const setSelected = useCallback((articles: readonly string[], selected: boolean) => {
    setSelectedArticles((prev) => {
      const next = new Set(prev);
      for (const article of articles) {
        if (article.length === 0) continue;
        if (selected) next.add(article);
        else next.delete(article);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((articles: readonly string[]) => {
    setSelectedArticles(new Set(articles.filter((article) => article.length > 0)));
  }, []);

  const clear = useCallback(() => {
    setSelectedArticles(new Set());
  }, []);

  return useMemo(
    () => ({
      selectedArticles,
      selectedCount: selectedArticles.size,
      isSelected,
      toggle,
      setSelected,
      selectAll,
      clear,
    }),
    [selectedArticles, isSelected, toggle, setSelected, selectAll, clear],
  );
}
