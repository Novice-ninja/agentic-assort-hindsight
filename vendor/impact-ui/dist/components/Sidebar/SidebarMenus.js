import { jsxs, jsx } from "react/jsx-runtime";
import { useState, Fragment } from "react";
import default_1 from "../../node_modules/@mui/icons-material/KeyboardArrowDownOutlined.js";
import { ChildMenu } from "./ChildMenu.js";
import { ParentMenu } from "./ParentMenu.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const DEFAULT_VISIBLE_COUNT = 6;
function MenuConfig({
  showItem,
  isOpen,
  setIsOpen,
  childActive,
  parentActive,
  item,
  showChild,
  setShowChild,
  handleParentRouteChange,
  handleChildRouteChange,
  isMemoryRouter
}) {
  if (!showItem) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ParentMenu,
      {
        active: parentActive,
        handleRouteChange: handleParentRouteChange,
        isMemoryRouter,
        isOpen,
        item,
        setIsOpen,
        setShowChild,
        showChild
      }
    ),
    item.children && item.children.length > 0 ? /* @__PURE__ */ jsx(
      ChildMenu,
      {
        active: childActive,
        handleRouteChange: handleChildRouteChange,
        isMemoryRouter,
        menu: item.children,
        parent: item,
        showChild
      }
    ) : null
  ] });
}
function SidebarMenus({
  isOpen,
  setIsOpen,
  routes,
  parentActive,
  handleParentRouteChange,
  childActive,
  handleChildRouteChange,
  isMemoryRouter,
  visibleModulesCount = DEFAULT_VISIBLE_COUNT
}) {
  const { t } = useTranslation();
  const visibleMenu = routes.slice(0, visibleModulesCount);
  const hiddenMenu = routes.slice(visibleModulesCount);
  const [showChild, setShowChild] = useState("");
  const [showHiddenMenu, setShowHiddenMenu] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "impact-sidebar-routes-list", children: [
    visibleMenu.map((item) => /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
      MenuConfig,
      {
        childActive,
        handleChildRouteChange,
        handleParentRouteChange,
        isMemoryRouter,
        isOpen,
        item,
        parentActive,
        setIsOpen,
        setShowChild,
        showChild,
        showItem: true
      }
    ) }, item.value)),
    hiddenMenu.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          "aria-expanded": showHiddenMenu,
          className: [
            "impact-sidebar-routes-hidden-list-icon",
            showHiddenMenu ? "show-hidden-menu-icon" : ""
          ].filter(Boolean).join(" "),
          "data-item-type": "view-more",
          "data-item-value": "__view-more__",
          "data-sidebar-item": "",
          onClick: () => {
            setShowHiddenMenu((v) => !v);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowHiddenMenu((v) => !v);
            }
          },
          role: "menuitem",
          tabIndex: 0,
          children: [
            /* @__PURE__ */ jsx(default_1, { "aria-hidden": "true" }),
            " ",
            /* @__PURE__ */ jsx("span", { children: showHiddenMenu ? t("sidebar.viewLess") : t("sidebar.viewMore") })
          ]
        }
      ),
      hiddenMenu.map((item) => /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
        MenuConfig,
        {
          childActive,
          handleChildRouteChange,
          handleParentRouteChange,
          isMemoryRouter,
          isOpen,
          item,
          parentActive,
          setIsOpen,
          setShowChild,
          showChild,
          showItem: showHiddenMenu
        }
      ) }, item.value))
    ] }) : null
  ] });
}
SidebarMenus.displayName = "SidebarMenus";
export {
  SidebarMenus
};
