import { useRef, useCallback } from "react";
const TYPEAHEAD_TIMEOUT = 500;
function useTypeahead({
  options = [],
  setHighlightedIndex,
  isActive = true
}) {
  const bufferRef = useRef("");
  const timerRef = useRef(null);
  const handleTypeahead = useCallback(
    (e) => {
      if (!isActive) return false;
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return false;
      e.preventDefault();
      bufferRef.current += e.key.toLowerCase();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, TYPEAHEAD_TIMEOUT);
      const matchIndex = options.findIndex(
        (opt) => String(opt.label ?? "").toLowerCase().startsWith(bufferRef.current)
      );
      if (matchIndex >= 0) {
        setHighlightedIndex(matchIndex);
      }
      return true;
    },
    [options, setHighlightedIndex, isActive]
  );
  const resetBuffer = useCallback(() => {
    bufferRef.current = "";
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  return { handleTypeahead, resetBuffer };
}
export {
  useTypeahead
};
