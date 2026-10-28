import { useState, useRef, useLayoutEffect } from "react";
const useMenuPosition = ({
  isOpen,
  triggerRef,
  menuRef,
  withPortal = false,
  dropdownPosition
}) => {
  const [menuStyle, setMenuStyle] = useState({ opacity: 0 });
  const [placement, setPlacement] = useState("bottom");
  const positionUpdateRef = useRef(null);
  const lastPositionRef = useRef(null);
  const isHiddenRef = useRef(true);
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      if (!isHiddenRef.current) {
        setMenuStyle({ opacity: 0 });
        isHiddenRef.current = true;
      }
      return;
    }
    isHiddenRef.current = false;
    const calculatePosition = () => {
      if (!triggerRef.current) return null;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      let menuHeight = 320;
      if (menuRef == null ? void 0 : menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        menuHeight = menuRect.height || 320;
      }
      const placementHeight = Math.max(menuHeight, 320);
      const menuWidth = triggerRect.width;
      const spacing = 6;
      const viewportTopOffset = 64;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top - viewportTopOffset;
      let position = "bottom";
      if (dropdownPosition === "top" || dropdownPosition === "bottom") {
        position = dropdownPosition;
      } else {
        if (spaceBelow >= placementHeight + spacing) {
          position = "bottom";
        } else if (spaceAbove >= placementHeight + spacing) {
          position = "top";
        } else {
          position = spaceBelow >= spaceAbove ? "bottom" : "top";
        }
      }
      let top = 0;
      let bottom = null;
      let left = 0;
      if (withPortal) {
        if (position === "bottom") {
          top = triggerRect.bottom + scrollY + spacing;
        } else {
          top = triggerRect.top + scrollY - spacing;
        }
        left = triggerRect.left + scrollX;
        if (position === "bottom") {
          top = Math.max(viewportTopOffset + scrollY, top);
        }
      } else {
        if (position === "bottom") {
          top = triggerRect.height + spacing - 4;
        } else {
          bottom = triggerRect.height + spacing;
        }
        left = 0;
        if (position === "bottom") {
          const absoluteY = triggerRect.top;
          const minTopRelative = viewportTopOffset - absoluteY;
          top = Math.max(minTopRelative, top);
        }
      }
      if (withPortal) {
        let adjustedLeft = left - scrollX;
        if (adjustedLeft + menuWidth > viewportWidth) {
          adjustedLeft = Math.max(0, viewportWidth - menuWidth - 10);
        }
        if (adjustedLeft < 0) {
          adjustedLeft = 10;
        }
        left = adjustedLeft + scrollX;
      }
      return { top, bottom, left, width: menuWidth, position };
    };
    const applyPosition = (newPosition) => {
      const lastPos = lastPositionRef.current;
      if (!lastPos || lastPos.top !== newPosition.top || lastPos.bottom !== newPosition.bottom || lastPos.left !== newPosition.left || lastPos.width !== newPosition.width || lastPos.position !== newPosition.position) {
        lastPositionRef.current = {
          top: newPosition.top,
          bottom: newPosition.bottom,
          left: newPosition.left,
          width: newPosition.width,
          position: newPosition.position
        };
        const style = {
          width: newPosition.width + "px",
          minWidth: newPosition.width + "px",
          opacity: 1
        };
        if (withPortal) {
          style.left = newPosition.left;
          style.position = "absolute";
          style.top = newPosition.top;
          style.bottom = "auto";
          if (newPosition.position === "top") {
            style.transform = "translateY(-100%)";
          } else {
            style.transform = "none";
          }
        } else {
          if (newPosition.position === "top" && newPosition.bottom !== null) {
            style.bottom = `${newPosition.bottom}px`;
            style.top = "auto";
            style.transform = "none";
          } else {
            style.top = newPosition.top + "px";
            style.bottom = "auto";
            style.transform = "none";
          }
        }
        setMenuStyle(style);
        setPlacement(newPosition.position);
      }
    };
    const updatePosition = () => {
      if (positionUpdateRef.current !== null) {
        cancelAnimationFrame(positionUpdateRef.current);
      }
      positionUpdateRef.current = requestAnimationFrame(() => {
        const newPosition = calculatePosition();
        if (newPosition) {
          applyPosition(newPosition);
        }
        positionUpdateRef.current = null;
      });
    };
    const initialPos = calculatePosition();
    if (initialPos) {
      applyPosition(initialPos);
    }
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined" && triggerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updatePosition();
      });
      resizeObserver.observe(triggerRef.current);
      if (menuRef == null ? void 0 : menuRef.current) {
        resizeObserver.observe(menuRef.current);
      }
    }
    let resizeFrame = null;
    const handleResize = () => {
      if (resizeFrame !== null) return;
      resizeFrame = requestAnimationFrame(() => {
        updatePosition();
        resizeFrame = null;
      });
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      if (positionUpdateRef.current !== null) {
        cancelAnimationFrame(positionUpdateRef.current);
        positionUpdateRef.current = null;
      }
      if (resizeFrame !== null) {
        cancelAnimationFrame(resizeFrame);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      lastPositionRef.current = null;
    };
  }, [isOpen, triggerRef, menuRef, withPortal, dropdownPosition]);
  return { menuStyle, placement };
};
export {
  useMenuPosition
};
