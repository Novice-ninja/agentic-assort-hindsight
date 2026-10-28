import { useEffect } from "react";
const useClickOutside = ({
  isOpen,
  containerRef,
  menuRef,
  isCloseWhenClickOutside = true,
  onClose
}) => {
  useEffect(() => {
    if (!isOpen || !isCloseWhenClickOutside) {
      return;
    }
    const handleClickOutside = (event) => {
      var _a, _b;
      const target = event.target;
      const isInsideContainer = (_a = containerRef.current) == null ? void 0 : _a.contains(target);
      const isInsideMenu = (_b = menuRef == null ? void 0 : menuRef.current) == null ? void 0 : _b.contains(target);
      const isInsideSubmenu = target.closest(".ia-select-submenu");
      const isInsideStyledMenu = target.closest(".ia-select-container-v3-styled-menu");
      if (!isInsideContainer && !isInsideMenu && !isInsideSubmenu && !isInsideStyledMenu) {
        onClose(event);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, containerRef, menuRef, isCloseWhenClickOutside, onClose]);
};
export {
  useClickOutside
};
