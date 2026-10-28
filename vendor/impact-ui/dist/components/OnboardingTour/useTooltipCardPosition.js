import { useRef, useState, useCallback, useLayoutEffect } from "react";
const ALL_PLACEMENTS = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "left-top",
  "left-bottom",
  "right-top",
  "right-bottom"
];
const TOP_BOTTOM_PLACEMENTS = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
];
const SIDE_PLACEMENTS = [
  "left-top",
  "left-bottom",
  "right-top",
  "right-bottom"
];
const ARROW_TIP_OFFSET = 32 + 9;
function getPlacementRect(placement, anchorRect, width, height, offset) {
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;
  const anchorCenterY = anchorRect.top + anchorRect.height / 2;
  let top = 0;
  let left = 0;
  switch (placement) {
    case "top-left":
      top = anchorRect.bottom + offset;
      left = anchorCenterX - ARROW_TIP_OFFSET;
      break;
    case "top-right":
      top = anchorRect.bottom + offset;
      left = anchorCenterX + ARROW_TIP_OFFSET - width;
      break;
    case "bottom-left":
      top = anchorRect.top - height - offset;
      left = anchorCenterX - ARROW_TIP_OFFSET;
      break;
    case "bottom-right":
      top = anchorRect.top - height - offset;
      left = anchorCenterX + ARROW_TIP_OFFSET - width;
      break;
    case "left-top":
      top = anchorCenterY - ARROW_TIP_OFFSET;
      left = anchorRect.right + offset;
      break;
    case "left-bottom":
      top = anchorCenterY + ARROW_TIP_OFFSET - height;
      left = anchorRect.right + offset;
      break;
    case "right-top":
      top = anchorCenterY - ARROW_TIP_OFFSET;
      left = anchorRect.left - width - offset;
      break;
    case "right-bottom":
      top = anchorCenterY + ARROW_TIP_OFFSET - height;
      left = anchorRect.left - width - offset;
      break;
  }
  return { top, left, right: left + width, bottom: top + height };
}
function getViewportOverflow(rect, viewportWidth, viewportHeight) {
  let overflow = 0;
  if (rect.top < 0) overflow += -rect.top;
  if (rect.left < 0) overflow += -rect.left;
  if (rect.bottom > viewportHeight) overflow += rect.bottom - viewportHeight;
  if (rect.right > viewportWidth) overflow += rect.right - viewportWidth;
  return overflow;
}
function getBestPlacement(anchorRect, width, height, offset, preferred) {
  if (preferred) return preferred;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scored = ALL_PLACEMENTS.map((placement) => {
    const rect = getPlacementRect(placement, anchorRect, width, height, offset);
    const overflow = getViewportOverflow(rect, viewportWidth, viewportHeight);
    const spareRoom = Math.min(
      rect.left,
      rect.top,
      viewportWidth - rect.right,
      viewportHeight - rect.bottom
    );
    return { placement, overflow, spareRoom };
  });
  const pickBest = (candidates) => {
    if (candidates.length === 0) return "top-right";
    return candidates.reduce((winner, current) => {
      if (current.spareRoom !== winner.spareRoom) {
        return current.spareRoom > winner.spareRoom ? current : winner;
      }
      return current.overflow < winner.overflow ? current : winner;
    }).placement;
  };
  const topBottomFits = scored.filter(
    (s) => TOP_BOTTOM_PLACEMENTS.includes(s.placement) && s.overflow === 0
  );
  if (topBottomFits.length > 0) {
    return pickBest(topBottomFits);
  }
  const sideFits = scored.filter((s) => SIDE_PLACEMENTS.includes(s.placement) && s.overflow === 0);
  if (sideFits.length > 0) {
    return pickBest(sideFits);
  }
  const topBottom = scored.filter((s) => TOP_BOTTOM_PLACEMENTS.includes(s.placement));
  const sides = scored.filter((s) => SIDE_PLACEMENTS.includes(s.placement));
  const bestTopBottomOverflow = Math.min(...topBottom.map((s) => s.overflow));
  const bestSideOverflow = Math.min(...sides.map((s) => s.overflow));
  return bestTopBottomOverflow <= bestSideOverflow ? pickBest(topBottom) : pickBest(sides);
}
const useTooltipCardPosition = (anchorRef, arrowPosition, { offset = 12, contentKey } = {}) => {
  const wrapperRef = useRef(null);
  const [wrapperStyle, setWrapperStyle] = useState({ opacity: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const [resolvedArrowPosition, setResolvedArrowPosition] = useState(
    arrowPosition ?? "top-right"
  );
  const positionUpdateRef = useRef(null);
  const lastStyleRef = useRef("");
  const calculatePosition = useCallback(() => {
    const anchor = anchorRef == null ? void 0 : anchorRef.current;
    const wrapper = wrapperRef.current;
    if (!anchor || typeof window === "undefined") {
      return null;
    }
    const anchorRect = anchor.getBoundingClientRect();
    const wrapperRect = wrapper == null ? void 0 : wrapper.getBoundingClientRect();
    const width = (wrapperRect == null ? void 0 : wrapperRect.width) ?? 0;
    const height = (wrapperRect == null ? void 0 : wrapperRect.height) ?? 0;
    const nextResolvedArrowPosition = getBestPlacement(
      anchorRect,
      width,
      height,
      offset,
      arrowPosition
    );
    if (nextResolvedArrowPosition !== resolvedArrowPosition) {
      setResolvedArrowPosition(nextResolvedArrowPosition);
    }
    const { top, left } = getPlacementRect(
      nextResolvedArrowPosition,
      anchorRect,
      width,
      height,
      offset
    );
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    return {
      position: "absolute",
      top: top + scrollY,
      left: left + scrollX,
      opacity: 1
    };
  }, [anchorRef, arrowPosition, contentKey, offset]);
  const applyPositionSync = useCallback(() => {
    const style = calculatePosition();
    if (!style) return;
    const styleKey = JSON.stringify(style);
    if (lastStyleRef.current === styleKey) return;
    lastStyleRef.current = styleKey;
    setWrapperStyle(style);
    setIsPositioned(true);
  }, [calculatePosition]);
  const applyPosition = useCallback(() => {
    if (positionUpdateRef.current !== null) {
      cancelAnimationFrame(positionUpdateRef.current);
    }
    positionUpdateRef.current = requestAnimationFrame(() => {
      applyPositionSync();
      positionUpdateRef.current = null;
    });
  }, [applyPositionSync]);
  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const anchorElement = anchorRef == null ? void 0 : anchorRef.current;
    if (!anchorElement) {
      return;
    }
    applyPositionSync();
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        applyPosition();
      });
      resizeObserver.observe(anchorElement);
      if (wrapperRef.current) {
        resizeObserver.observe(wrapperRef.current);
      }
    }
    const handleScroll = () => {
      applyPosition();
    };
    const handleResize = () => {
      applyPosition();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      if (positionUpdateRef.current !== null) {
        cancelAnimationFrame(positionUpdateRef.current);
        positionUpdateRef.current = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      lastStyleRef.current = "";
    };
  }, [anchorRef, applyPosition, contentKey]);
  return { wrapperRef, wrapperStyle, isPositioned, arrowPosition: resolvedArrowPosition };
};
export {
  useTooltipCardPosition
};
