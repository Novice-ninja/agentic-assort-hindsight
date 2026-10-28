import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { MemoryRouter, NavLink } from "react-router-dom";
import { isModifiedClick } from "./utils.js";
function childNavLinkTo(child) {
  return child.openInNewPage ? "#" : child.link;
}
function ChildMenu({
  parent,
  active,
  menu,
  showChild,
  handleRouteChange,
  isMemoryRouter
}) {
  const containerRef = useRef(null);
  const updateBeforeHeight = () => {
    const container = containerRef.current;
    if (container) {
      const contentHeight = container.scrollHeight;
      container.style.setProperty("--before-height", `${contentHeight}px`);
    }
  };
  useLayoutEffect(() => {
    updateBeforeHeight();
    window.addEventListener("resize", updateBeforeHeight);
    return () => {
      window.removeEventListener("resize", updateBeforeHeight);
    };
  }, []);
  useEffect(() => {
    updateBeforeHeight();
  }, [menu]);
  const makeKeyDownHandler = useCallback(
    (child) => (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRouteChange(parent, child);
      }
    },
    [parent, handleRouteChange]
  );
  const childItemProps = (child) => ({
    role: "menuitem",
    tabIndex: child.isDisabled ? -1 : 0,
    "aria-current": child.value === active ? "page" : void 0,
    "aria-disabled": child.isDisabled || void 0,
    "data-sidebar-item": "",
    "data-item-type": "child",
    "data-item-value": child.value,
    "data-parent-value": parent.value,
    ...child.isDisabled ? { "data-disabled": "" } : {},
    onKeyDown: makeKeyDownHandler(child)
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      "aria-hidden": showChild !== parent.value ? true : void 0,
      className: [
        "impact-sidebar-routes-list-children",
        showChild === parent.value ? "child-route-visible" : ""
      ].filter(Boolean).join(" "),
      "data-nav-collapsed": showChild !== parent.value ? "true" : void 0,
      role: "group",
      children: menu.map(
        (child) => isMemoryRouter ? /* @__PURE__ */ jsx(MemoryRouter, { children: /* @__PURE__ */ jsx(
          NavLink,
          {
            "aria-hidden": "true",
            className: "impact-sidebar-routes-list-item-link",
            tabIndex: -1,
            to: childNavLinkTo(child),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: [
                  "impact-sidebar-routes-list-item-children",
                  child.value === active ? "child-route-active" : "",
                  child.isDisabled ? "child-route-disabled" : ""
                ].filter(Boolean).join(" "),
                onClick: (event) => {
                  if (isModifiedClick(event)) return;
                  handleRouteChange(parent, child, event);
                },
                ...childItemProps(child),
                children: [
                  /* @__PURE__ */ jsx("div", { className: "impact-sidebar-routes-list-item-child-icon", children: child.icon }),
                  /* @__PURE__ */ jsx("div", { className: "impact-sidebar-routes-list-item-child-label", children: child.label })
                ]
              }
            )
          }
        ) }, child.value) : /* @__PURE__ */ jsxs(
          "div",
          {
            className: [
              "impact-sidebar-routes-list-item-children",
              child.value === active ? "child-route-active" : "",
              child.isDisabled ? "child-route-disabled" : ""
            ].filter(Boolean).join(" "),
            onClick: (event) => {
              if (isModifiedClick(event)) return;
              handleRouteChange(parent, child, event);
            },
            ...childItemProps(child),
            children: [
              /* @__PURE__ */ jsx("div", { className: "impact-sidebar-routes-list-item-child-icon", children: child.icon }),
              /* @__PURE__ */ jsx("div", { className: "impact-sidebar-routes-list-item-child-label", children: child.label })
            ]
          },
          child.value
        )
      )
    }
  );
}
ChildMenu.displayName = "ChildMenu";
export {
  ChildMenu
};
