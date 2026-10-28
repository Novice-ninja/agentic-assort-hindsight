import { useState, useRef, useCallback, useEffect } from "react";
const RESIZE_STEP = 8;
const RESIZE_STEP_LARGE = 32;
const BOTTOM_VIEWPORT_MARGIN = 24;
function resolveViewportMargin(input) {
  if (typeof input === "number") {
    return { top: input, right: input, bottom: input, left: input };
  }
  return {
    top: (input == null ? void 0 : input.top) ?? 0,
    right: (input == null ? void 0 : input.right) ?? 0,
    bottom: (input == null ? void 0 : input.bottom) ?? 0,
    left: (input == null ? void 0 : input.left) ?? 0
  };
}
function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
function safeCapturePointer(target, pointerId) {
  if (typeof target.setPointerCapture !== "function") return;
  try {
    target.setPointerCapture(pointerId);
  } catch {
  }
}
function safeReleasePointer(target, pointerId) {
  if (typeof target.releasePointerCapture !== "function") return;
  try {
    target.releasePointerCapture(pointerId);
  } catch {
  }
}
function clampRect(rect, opts) {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : Infinity;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : Infinity;
  const { margin } = opts;
  const boundsWidth = viewportWidth - margin.left - margin.right;
  const boundsHeight = viewportHeight - margin.top - margin.bottom;
  const width = clampNumber(rect.width, opts.minWidth, Math.min(opts.maxWidth, boundsWidth));
  const height = clampNumber(rect.height, opts.minHeight, Math.min(opts.maxHeight, boundsHeight));
  const x = clampNumber(
    rect.x,
    margin.left,
    Math.max(margin.left, viewportWidth - margin.right - width)
  );
  const y = clampNumber(
    rect.y,
    margin.top,
    Math.max(margin.top, viewportHeight - margin.bottom - height)
  );
  return { x, y, width, height };
}
function useDraggableResizable({
  initialRect,
  minWidth = 320,
  minHeight = 320,
  maxWidth = Infinity,
  maxHeight = Infinity,
  viewportMargin,
  disabled = false,
  onChange,
  onDragEnd,
  onResizeEnd
}) {
  const [rect, setRectState] = useState(initialRect);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const rectRef = useRef(rect);
  rectRef.current = rect;
  const savedRectRef = useRef(null);
  const rafRef = useRef(null);
  const pendingRectRef = useRef(null);
  const cleanupRef = useRef(null);
  const margin = resolveViewportMargin(viewportMargin);
  const limits = { minWidth, minHeight, maxWidth, maxHeight, margin };
  const { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft } = margin;
  const commitRect = useCallback(
    (next) => {
      const clamped = clampRect(next, limits);
      pendingRectRef.current = clamped;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          if (pendingRectRef.current) {
            setRectState(pendingRectRef.current);
            onChange == null ? void 0 : onChange(pendingRectRef.current);
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      onChange
    ]
  );
  const setRect = useCallback(
    (updater) => {
      const next = typeof updater === "function" ? updater(rectRef.current) : updater;
      const clamped = clampRect(next, limits);
      rectRef.current = clamped;
      setRectState(clamped);
      onChange == null ? void 0 : onChange(clamped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      onChange
    ]
  );
  const endInteraction = useCallback(() => {
    document.body.classList.remove("no-select");
    const cleanup = cleanupRef.current;
    cleanupRef.current = null;
    cleanup == null ? void 0 : cleanup();
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (pendingRectRef.current) {
      setRectState(pendingRectRef.current);
      onChange == null ? void 0 : onChange(pendingRectRef.current);
    }
  }, [onChange]);
  useEffect(
    () => () => {
      var _a;
      document.body.classList.remove("no-select");
      (_a = cleanupRef.current) == null ? void 0 : _a.call(cleanupRef);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );
  const startDrag = useCallback(
    (e) => {
      if (disabled) return;
      const target = e.currentTarget;
      const pointerId = e.pointerId;
      const startX = e.clientX;
      const startY = e.clientY;
      const startRect = rectRef.current;
      safeCapturePointer(target, pointerId);
      document.body.classList.add("no-select");
      setIsDragging(true);
      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        commitRect({ ...startRect, x: startRect.x - 24 + dx, y: startRect.y - 24 + dy });
      };
      const onUp = () => {
        safeReleasePointer(target, pointerId);
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointercancel", onUp);
        setIsDragging(false);
        endInteraction();
        onDragEnd == null ? void 0 : onDragEnd(rectRef.current);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
      cleanupRef.current = onUp;
    },
    [disabled, commitRect, endInteraction, onDragEnd]
  );
  const startResize = useCallback(
    (direction) => (e) => {
      if (disabled) return;
      e.stopPropagation();
      const target = e.currentTarget;
      const pointerId = e.pointerId;
      const startX = e.clientX;
      const startY = e.clientY;
      const startRect = rectRef.current;
      safeCapturePointer(target, pointerId);
      document.body.classList.add("no-select");
      setIsResizing(true);
      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let { x, y, width, height } = startRect;
        if (direction.includes("e")) width = startRect.width + dx;
        if (direction.includes("s")) height = startRect.height + dy;
        if (direction.includes("w")) {
          width = startRect.width - dx;
          x = startRect.x + dx;
        }
        if (direction.includes("n")) {
          height = startRect.height - dy;
          y = startRect.y + dy;
        }
        commitRect({ x, y, width, height });
      };
      const onUp = () => {
        safeReleasePointer(target, pointerId);
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointercancel", onUp);
        setIsResizing(false);
        endInteraction();
        onResizeEnd == null ? void 0 : onResizeEnd(rectRef.current);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
      cleanupRef.current = onUp;
    },
    [disabled, commitRect, endInteraction, onResizeEnd]
  );
  const handleResizeKeyDown = useCallback(
    (direction) => (e) => {
      if (disabled) return;
      const step = e.shiftKey ? RESIZE_STEP_LARGE : RESIZE_STEP;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      else return;
      e.preventDefault();
      const startRect = rectRef.current;
      let { x, y, width, height } = startRect;
      if (direction.includes("e")) width += dx;
      if (direction.includes("s")) height += dy;
      if (direction.includes("w")) {
        width -= dx;
        x += dx;
      }
      if (direction.includes("n")) {
        height -= dy;
        y += dy;
      }
      setRect({ x, y, width, height });
      onResizeEnd == null ? void 0 : onResizeEnd(rectRef.current);
    },
    [disabled, setRect, onResizeEnd]
  );
  const dragHandleProps = {
    onPointerDown: startDrag,
    onKeyDown: (e) => {
      if (disabled) return;
      const step = e.shiftKey ? RESIZE_STEP_LARGE : RESIZE_STEP;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      else return;
      e.preventDefault();
      setRect((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
  };
  const getResizeHandleProps = useCallback(
    (direction) => ({
      onPointerDown: startResize(direction),
      onKeyDown: handleResizeKeyDown(direction),
      role: "separator",
      tabIndex: 0,
      "aria-orientation": direction === "n" || direction === "s" ? "horizontal" : "vertical"
    }),
    [startResize, handleResizeKeyDown]
  );
  const collapseTo = useCallback(
    (size, options) => {
      savedRectRef.current = rectRef.current;
      setIsCollapsed(true);
      const m = (options == null ? void 0 : options.viewportMargin) === void 0 ? { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft } : resolveViewportMargin(options.viewportMargin);
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : size.width;
      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : size.height;
      const anchor = (options == null ? void 0 : options.anchor) ?? "bottom-right";
      const x = anchor.endsWith("right") ? viewportWidth - size.width - m.right : m.left;
      const y = anchor.startsWith("bottom") ? viewportHeight - size.height - m.bottom : m.top;
      const clamped = clampRect(
        { x, y, width: size.width, height: size.height },
        { minWidth: size.width, minHeight: size.height, maxWidth, maxHeight, margin: m }
      );
      rectRef.current = clamped;
      setRectState(clamped);
      onChange == null ? void 0 : onChange(clamped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxWidth, maxHeight, marginTop, marginRight, marginBottom, marginLeft, onChange]
  );
  const restore = useCallback(() => {
    if (savedRectRef.current) {
      setRect(savedRectRef.current);
      savedRectRef.current = null;
    }
    setIsCollapsed(false);
  }, [setRect]);
  return {
    rect,
    isDragging,
    isResizing,
    isCollapsed,
    setRect,
    dragHandleProps,
    getResizeHandleProps,
    collapseTo,
    restore
  };
}
export {
  BOTTOM_VIEWPORT_MARGIN,
  useDraggableResizable
};
