import { useRef, useEffect } from "react";
function useScrollIntoView({
  highlightedIndex,
  containerRef,
  listRef,
  isVirtualized = false,
  isKeyboardNav = true
}) {
  const prevIndex = useRef(highlightedIndex);
  useEffect(() => {
    if (!isKeyboardNav) return;
    if (highlightedIndex < 0) return;
    if (highlightedIndex === prevIndex.current) return;
    prevIndex.current = highlightedIndex;
    if (isVirtualized && (listRef == null ? void 0 : listRef.current)) {
      listRef.current.scrollToItem(highlightedIndex, "smart");
      return;
    }
    if (containerRef == null ? void 0 : containerRef.current) {
      const items = containerRef.current.querySelectorAll('[role="option"]');
      const target = items[highlightedIndex];
      if (target && typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex, containerRef, listRef, isVirtualized, isKeyboardNav]);
}
export {
  useScrollIntoView
};
