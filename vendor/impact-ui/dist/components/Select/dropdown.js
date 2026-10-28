import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { Portal } from "../Portal/index.js";
import { useMenuPosition } from "./hooks/useMenuPosition.js";
function Dropdown({
  children,
  dropDownPortalClassName = "",
  isOpen,
  target,
  onClose,
  disabled,
  containerRef: _containerRef,
  menuRef: externalMenuRef,
  withPortal,
  portalContainer,
  dropdownButtonRef,
  dropdownPosition,
  isKeyboardNav
}) {
  const internalMenuRef = useRef(null);
  const menuRef = externalMenuRef ?? internalMenuRef;
  const { menuStyle, placement: computedPlacement } = useMenuPosition({
    isOpen: isOpen && !disabled,
    triggerRef: dropdownButtonRef,
    menuRef,
    withPortal,
    dropdownPosition
  });
  const menuContent = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: menuRef,
        className: `ia-select-container-v3-styled-menu ${dropDownPortalClassName}`,
        "data-placement": computedPlacement,
        style: {
          ...menuStyle,
          position: withPortal ? "absolute" : void 0,
          marginTop: withPortal ? isKeyboardNav ? "0" : computedPlacement === "top" ? "0" : "-4px" : isKeyboardNav ? "4px" : "0"
        },
        children
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "ia-select-container-v3-blanket", onClick: onClose })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "ia-select-container-v3", children: [
    target,
    !disabled && isOpen ? /* @__PURE__ */ jsx(Fragment, { children: withPortal ? /* @__PURE__ */ jsx(Portal, { container: portalContainer ?? null, children: menuContent }) : menuContent }) : null
  ] });
}
export {
  Dropdown as default
};
