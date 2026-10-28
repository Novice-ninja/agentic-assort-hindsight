import { useState, useRef, useEffect, useCallback } from "react";
function useKeyboardNavigation({
  options = [],
  isOpen,
  onSelect,
  onClose,
  isMulti = false,
  selectedOption = null,
  getOptionDisabled = () => false,
  onHighlightChange,
  onNavigateUp,
  hasSelectAll = false,
  onSelectAllToggle
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const prevOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      if (hasSelectAll) {
        setHighlightedIndex(-1);
      } else {
        let startIndex = 0;
        if (!isMulti && selectedOption) {
          const idx = options.findIndex((o) => o.value === selectedOption.value);
          if (idx >= 0) startIndex = idx;
        }
        setHighlightedIndex(startIndex);
      }
    } else if (!isOpen && prevOpenRef.current) {
      setHighlightedIndex(-1);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex((prev) => {
        if (prev >= options.length) return Math.max(0, options.length - 1);
        if (prev === -1 && hasSelectAll) return -1;
        if (prev < 0 && options.length > 0) return 0;
        return prev;
      });
    }
  }, [options.length, isOpen, hasSelectAll]);
  const findNextEnabled = useCallback(
    (start, direction) => {
      const len = options.length;
      if (len === 0) return -1;
      let idx = start;
      for (let i = 0; i < len; i++) {
        idx = (idx + direction + len) % len;
        const option = options[idx];
        if (option && !getOptionDisabled(option)) return idx;
      }
      return start;
    },
    [options, getOptionDisabled]
  );
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (highlightedIndex === -1 && hasSelectAll) {
            const first = findNextEnabled(-1, 1);
            setHighlightedIndex(first);
            onHighlightChange == null ? void 0 : onHighlightChange(first);
          } else if (hasSelectAll && highlightedIndex >= options.length - 1) {
            setHighlightedIndex(-1);
            onHighlightChange == null ? void 0 : onHighlightChange(-1);
          } else {
            const next = findNextEnabled(highlightedIndex, 1);
            setHighlightedIndex(next);
            onHighlightChange == null ? void 0 : onHighlightChange(next);
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (highlightedIndex === -1 && hasSelectAll) {
            const last = options.length - 1;
            setHighlightedIndex(last);
            onHighlightChange == null ? void 0 : onHighlightChange(last);
            break;
          }
          if (highlightedIndex === 0 && hasSelectAll) {
            setHighlightedIndex(-1);
            onHighlightChange == null ? void 0 : onHighlightChange(-1);
            break;
          }
          if (highlightedIndex <= 0 && onNavigateUp) {
            setHighlightedIndex(-1);
            onNavigateUp();
            break;
          }
          const prev = findNextEnabled(highlightedIndex, -1);
          setHighlightedIndex(prev);
          onHighlightChange == null ? void 0 : onHighlightChange(prev);
          break;
        }
        case "Home": {
          e.preventDefault();
          const first = findNextEnabled(-1, 1);
          setHighlightedIndex(first);
          onHighlightChange == null ? void 0 : onHighlightChange(first);
          break;
        }
        case "End": {
          e.preventDefault();
          const last = findNextEnabled(options.length, -1);
          setHighlightedIndex(last);
          onHighlightChange == null ? void 0 : onHighlightChange(last);
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (highlightedIndex === -1 && hasSelectAll && onSelectAllToggle) {
            onSelectAllToggle();
          } else if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            const opt = options[highlightedIndex];
            if (opt && !getOptionDisabled(opt)) {
              onSelect == null ? void 0 : onSelect(opt, highlightedIndex);
            }
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          onClose == null ? void 0 : onClose();
          break;
        }
        case "Tab":
          onClose == null ? void 0 : onClose();
          break;
      }
    },
    [
      isOpen,
      highlightedIndex,
      options,
      findNextEnabled,
      onSelect,
      onClose,
      getOptionDisabled,
      onHighlightChange,
      onNavigateUp,
      hasSelectAll,
      onSelectAllToggle
    ]
  );
  return {
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown
  };
}
export {
  useKeyboardNavigation
};
