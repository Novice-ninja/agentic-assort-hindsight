import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useCallback, forwardRef } from "react";
import default_1 from "../../node_modules/@mui/icons-material/KeyboardArrowRightOutlined.js";
import { MemoryRouter, NavLink } from "react-router-dom";
import { Tooltip } from "../Tooltip/index.js";
import { isModifiedClick } from "./utils.js";
const ParentItemDiv = forwardRef(
  ({ item, active, showChild, isOpen, onClickRoute, ...rest }, ref) => {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isActive = item.value === active;
    const isExpanded = hasChildren && showChild === item.value;
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClickRoute(item);
        }
      },
      [item, onClickRoute]
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        "aria-current": isActive ? "page" : void 0,
        "aria-disabled": item.isDisabled || void 0,
        "aria-expanded": hasChildren ? isExpanded : void 0,
        className: [
          "impact-sidebar-routes-list-item",
          isActive ? "route-active" : "",
          item.isDisabled ? "route-disabled" : ""
        ].filter(Boolean).join(" "),
        "data-item-type": "parent",
        "data-item-value": item.value,
        "data-sidebar-item": "",
        role: "menuitem",
        tabIndex: item.isDisabled ? -1 : 0,
        onClick: (e) => {
          onClickRoute(item, e);
        },
        onKeyDown: handleKeyDown,
        ...hasChildren ? { "data-has-children": "" } : {},
        ...item.isDisabled ? { "data-disabled": "" } : {},
        ...rest,
        children: [
          /* @__PURE__ */ jsx("div", { className: "impact-sidebar-routes-list-item-icon", children: item.icon }),
          isOpen ? /* @__PURE__ */ jsxs("div", { className: "impact-sidebar-routes-list-item-label", children: [
            /* @__PURE__ */ jsx("span", { className: "impact-sidebar-routes-list-item-label-text", children: item.label }),
            hasChildren ? /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: [
                  "impact-sidebar-routes-list-item-children-indicator-horizontal",
                  isExpanded ? "indicator-turn-up" : ""
                ].filter(Boolean).join(" "),
                role: "presentation",
                children: /* @__PURE__ */ jsx(default_1, {})
              }
            ) : null
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            hasChildren ? /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: "impact-sidebar-routes-list-item-children-indicator-horizontal",
                role: "presentation",
                children: /* @__PURE__ */ jsx(default_1, {})
              }
            ) : null,
            /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "impact-sidebar-routes-list-item-label", children: item.label })
          ] })
        ]
      }
    );
  }
);
ParentItemDiv.displayName = "ParentItemDiv";
function ParentMenu({
  isOpen,
  setIsOpen,
  active,
  item,
  showChild,
  setShowChild,
  handleRouteChange,
  isMemoryRouter
}) {
  const hasLink = Boolean(item.link);
  const shouldUseNavLink = isMemoryRouter && hasLink;
  const handleClickOnRoute = useCallback(
    (routeItem, event) => {
      if (routeItem.children && routeItem.children.length > 0) {
        if (!isOpen) {
          setIsOpen(true);
        }
        if (showChild === routeItem.value) {
          setShowChild(null);
        } else {
          setShowChild(routeItem.value);
        }
        if (isModifiedClick(event)) {
          return;
        }
        if (routeItem.link) {
          handleRouteChange(routeItem, event);
        }
      } else {
        if (isModifiedClick(event)) {
          return;
        }
        handleRouteChange(routeItem, event);
      }
    },
    [isOpen, setIsOpen, showChild, setShowChild, handleRouteChange]
  );
  const itemProps = {
    item,
    active,
    showChild,
    isOpen,
    onClickRoute: handleClickOnRoute
  };
  const renderItemWrapper = (content) => {
    if (shouldUseNavLink) {
      return /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
        NavLink,
        {
          className: "impact-sidebar-routes-list-item-link",
          tabIndex: -1,
          to: item.openInNewPage ? "#" : item.link,
          children: content
        }
      ) });
    }
    return /* @__PURE__ */ jsx("div", { className: "impact-sidebar-routes-list-item-link", children: content });
  };
  const tooltipTitle = item.tooltip && item.tooltip.length > 0 ? item.tooltip : item.label;
  const menuItem = /* @__PURE__ */ jsx(ParentItemDiv, { ...itemProps });
  const renderClosedItem = () => {
    if (shouldUseNavLink) {
      return /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(Tooltip, { orientation: "right", title: tooltipTitle, variant: "tertiary", children: /* @__PURE__ */ jsx(
        NavLink,
        {
          className: "impact-sidebar-routes-list-item-link",
          tabIndex: -1,
          to: item.openInNewPage ? "#" : item.link,
          children: menuItem
        }
      ) }) });
    }
    return /* @__PURE__ */ jsx(Tooltip, { orientation: "right", title: tooltipTitle, variant: "tertiary", children: /* @__PURE__ */ jsx("div", { className: "impact-sidebar-routes-list-item-link", children: menuItem }) });
  };
  if (isOpen) {
    return renderItemWrapper(menuItem);
  }
  return renderClosedItem();
}
ParentMenu.displayName = "ParentMenu";
export {
  ParentMenu
};
