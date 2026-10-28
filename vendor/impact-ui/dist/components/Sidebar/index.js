!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode('.impact-sidebar-container{background-color:#0d152c;color:#fff;height:100%;left:0;min-height:100vh;overflow:hidden;padding:12px;position:fixed;top:0;transition:all .2s ease-in;width:64px;z-index:1200}.impact-sidebar-container .impact-sidebar-toggle-btns{display:flex;justify-content:flex-start;width:40px}.impact-sidebar-container .impact-sidebar-routes-list{box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start;margin:34px -12px 0;max-height:calc(100% - 200px);overflow-y:auto;scrollbar-width:none}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item-link{color:#fff;text-decoration:none;width:100%}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item{align-items:center;display:flex;flex-shrink:0;gap:24px;height:48px;overflow:hidden;padding:14px 20px;position:relative;transition:width .2s ease-in,gap .2s ease-in,background-color .2s ease-in;width:64px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item:before{background-color:#3bb273;border-radius:0 4px 4px 0;content:"";height:0;left:0;position:absolute;top:0;transition:height .2s linear;width:4px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item:hover{background-color:#1f2b4d;cursor:pointer}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item .impact-sidebar-routes-list-item-icon svg{font-size:20px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item .impact-sidebar-routes-list-item-icon img{filter:brightness(0) saturate(100%) invert(100%) sepia(0) saturate(2%) hue-rotate(133deg) brightness(106%) contrast(101%);height:20px;width:20px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item .impact-sidebar-routes-list-item-children-indicator-horizontal{transition:width .2s ease-in,gap .2s ease-in,background-color .2s ease-in}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item .impact-sidebar-routes-list-item-children-indicator-horizontal svg{font-size:20px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item .indicator-turn-up{transform:rotate(-90deg)}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item .impact-sidebar-routes-list-item-label{align-items:center;display:flex;justify-content:space-between;overflow:hidden;width:100%}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-item .impact-sidebar-routes-list-item-label-text{flex-shrink:1;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;line-height:19.12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.impact-sidebar-container .impact-sidebar-routes-list .route-active{background-color:#1f2b4d}.impact-sidebar-container .impact-sidebar-routes-list .route-active:before{height:100%}.impact-sidebar-container .impact-sidebar-routes-list .route-disabled{color:#7a8294;pointer-events:none}.impact-sidebar-container .impact-sidebar-routes-list .route-disabled svg{color:#7a8294}.impact-sidebar-container .impact-sidebar-routes-list .route-disabled img{filter:brightness(0) saturate(100%) invert(58%) sepia(7%) saturate(821%) hue-rotate(184deg) brightness(87%) contrast(84%)}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-children{align-items:flex-start;display:flex;flex-direction:column;height:0;margin-top:8px;opacity:0;overflow:hidden;padding-left:24px;position:relative;transition:width .2s ease-in,gap .2s ease-in,background-color .2s ease-in;visibility:hidden}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-children:before{background-color:#1f2b4d;border-radius:0 4px 4px 0;content:"";height:var(--before-height);left:24px;position:absolute;top:0;width:4px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-children .impact-sidebar-routes-list-item-children{align-items:center;display:flex;flex-shrink:0;gap:22px;height:48px;overflow:hidden;padding:14px 20px;transition:all .2s ease-in;width:60px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-children .impact-sidebar-routes-list-item-children .impact-sidebar-routes-list-item-child-iconsvg{font-size:20px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-children .impact-sidebar-routes-list-item-children .impact-sidebar-routes-list-item-child-icon img{filter:brightness(0) saturate(100%) invert(100%) sepia(0) saturate(2%) hue-rotate(133deg) brightness(106%) contrast(101%);height:20px;width:20px}.impact-sidebar-container .impact-sidebar-routes-list .impact-sidebar-routes-list-children .impact-sidebar-routes-list-item-children .impact-sidebar-routes-list-item-child-label{flex-shrink:1;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;line-height:19.12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.impact-sidebar-container .impact-sidebar-routes-hidden-list{height:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out;visibility:hidden}.impact-sidebar-container .show-hidden-menu{height:100%;opacity:1;visibility:visible}.impact-sidebar-container .impact-sidebar-routes-hidden-list-icon{align-items:center;display:flex;flex-shrink:0;gap:20px;height:48px;overflow:hidden;padding:14px 20px;transition:width 50ms ease-in;width:64px}.impact-sidebar-container .impact-sidebar-routes-hidden-list-icon svg{color:#3bb273;transition:transform .2s ease-in}.impact-sidebar-container .impact-sidebar-routes-hidden-list-icon:hover{background-color:#1f2b4d;cursor:pointer}.impact-sidebar-container .impact-sidebar-routes-hidden-list-icon span{flex-shrink:0;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;line-height:19.12px}.impact-sidebar-container .show-hidden-menu-icon svg{transform:rotate(-180deg)}.impact-sidebar-container .impact-sidebar-actions-container{bottom:0;display:flex;flex-direction:column;justify-content:center;margin:0 -12px;position:absolute;width:inherit}.impact-sidebar-container .impact-sidebar-actions-container:before{background-color:#31416e;content:"";height:1px;left:0;position:absolute;top:-12px;width:100%}.impact-sidebar-container .impact-sidebar-actions-container .impact-sidebar-routes-list{margin:0}.impact-sidebar-container .impact-sidebar-actions-container .impact-sidebar-actions-list-item{align-items:center;display:flex;gap:22px;height:48px;overflow:hidden;padding:14px 20px;transition:all .2s ease-in;width:60px}.impact-sidebar-container .impact-sidebar-actions-container .impact-sidebar-actions-list-item .impact-sidebar-actions-list-item-label{font-family:Manrope,sans-serif;font-size:14px;font-weight:400;line-height:19.12px}.impact-sidebar-container .impact-sidebar-actions-container .logout-container{color:#3bb273}.impact-sidebar-container .impact-sidebar-actions-container .logout-container:hover{background-color:#31416e;cursor:pointer}.impact-sidebar-container .impact-sidebar-actions-container .logout-container .logout-container-img{width:20px}.sidebar-open{width:280px}.sidebar-open .impact-sidebar-routes-list .impact-sidebar-routes-list-item{gap:22px;width:100%}.sidebar-open .impact-sidebar-routes-list .impact-sidebar-routes-list-item-children-indicator-horizontal{transform:rotate(90deg)}.sidebar-open .impact-sidebar-routes-list .impact-sidebar-routes-list-children .impact-sidebar-routes-list-item-children{gap:22px;width:100%}.sidebar-open .impact-sidebar-routes-list .impact-sidebar-routes-hidden-list-icon{width:100%}.sidebar-open .impact-sidebar-routes-list .child-route-visible{height:var(--before-height);min-height:var(--before-height);opacity:1;visibility:visible}.sidebar-open .impact-sidebar-routes-list .child-route-visible .impact-sidebar-routes-list-item-children:hover{background-color:#31416e;cursor:pointer}.sidebar-open .impact-sidebar-routes-list .child-route-visible .impact-sidebar-routes-list-item-children:before{background-color:#3bb273;content:"";height:0;left:1px;position:absolute;top:0;width:3px}.sidebar-open .impact-sidebar-routes-list .child-route-visible .child-route-active{color:#3bb273;cursor:pointer;position:relative}.sidebar-open .impact-sidebar-routes-list .child-route-visible .child-route-active .impact-sidebar-routes-list-item-child-icon svg{color:#3bb273}.sidebar-open .impact-sidebar-routes-list .child-route-visible .child-route-active .impact-sidebar-routes-list-item-child-icon img{filter:brightness(0) saturate(100%) invert(52%) sepia(87%) saturate(322%) hue-rotate(96deg) brightness(97%) contrast(86%)}.sidebar-open .impact-sidebar-routes-list .child-route-visible .child-route-active:before{animation:childAnimation 1s forwards}@keyframes childAnimation{0%{height:0}to{height:100%}}.sidebar-open .impact-sidebar-routes-list .child-route-visible .child-route-disabled{color:#7a8294;pointer-events:none}.sidebar-open .impact-sidebar-routes-list .child-route-visible .child-route-disabled svg{color:#7a8294}.sidebar-open .impact-sidebar-routes-list .child-route-visible .child-route-disabled img{filter:brightness(0) saturate(100%) invert(58%) sepia(7%) saturate(821%) hue-rotate(184deg) brightness(87%) contrast(84%)}.sidebar-open .impact-sidebar-actions-container:before{left:12px;width:calc(100% - 24px)}.sidebar-open .impact-sidebar-actions-container .impact-sidebar-actions-list-item{gap:22px;width:100%}.impact-sidebar-toggle-btns:hover{cursor:pointer}.impact-sidebar-toggle-btns{--ia-focus-ring-inset:-4px;position:relative}.impact-sidebar-toggle-btns:focus-visible{outline:none;position:relative;z-index:1}.impact-sidebar-toggle-btns:focus-visible:after{border:2px solid var(--ia-focus-color,#4259ee);border-radius:12px;content:"";inset:var(--ia-focus-ring-inset,2px);pointer-events:none;position:absolute}.impact-sidebar-toggle-btns:focus:not(:focus-visible){outline:none}.impact-sidebar-routes-list-item:focus-visible{outline:none;position:relative;z-index:1}.impact-sidebar-routes-list-item:focus-visible:after{border:2px solid var(--ia-focus-color,#4259ee);border-radius:12px;content:"";inset:var(--ia-focus-ring-inset,2px);pointer-events:none;position:absolute}.impact-sidebar-routes-list-item:focus:not(:focus-visible){outline:none}.impact-sidebar-routes-list-item-children:focus-visible{outline:none;z-index:1}.impact-sidebar-routes-list-item-children:focus-visible:after{border:2px solid var(--ia-focus-color,#4259ee);border-radius:12px;content:"";inset:var(--ia-focus-ring-inset,2px);pointer-events:none;position:absolute}.impact-sidebar-routes-list-item-children:focus:not(:focus-visible){outline:none}.impact-sidebar-routes-list-item-children:focus-visible{position:relative}.impact-sidebar-routes-hidden-list-icon{position:relative}.impact-sidebar-routes-hidden-list-icon:focus-visible{outline:none;position:relative;z-index:1}.impact-sidebar-routes-hidden-list-icon:focus-visible:after{border:2px solid var(--ia-focus-color,#4259ee);border-radius:12px;content:"";inset:var(--ia-focus-ring-inset,2px);pointer-events:none;position:absolute}.impact-sidebar-routes-hidden-list-icon:focus:not(:focus-visible){outline:none}.impact-sidebar-actions-list-item:focus-visible{outline:none;z-index:1}.impact-sidebar-actions-list-item:focus-visible:after{border:2px solid var(--ia-focus-color,#4259ee);border-radius:12px;content:"";inset:var(--ia-focus-ring-inset,2px);pointer-events:none;position:absolute}.impact-sidebar-actions-list-item:focus:not(:focus-visible){outline:none}.impact-sidebar-actions-list-item:focus-visible{position:relative}')),document.head.appendChild(i)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useCallback, useEffect } from "react";
import { getAssetUrl } from "../../utils/assetBase.js";
import { SidebarActions } from "./SidebarActions.js";
import { SidebarMenus } from "./SidebarMenus.js";
import { useShortcut } from "../Shortcuts/useShortcut.js";

import { useTranslation } from "../../i18n/useTranslation.js";
const HamburgerClose = getAssetUrl("icons/collapse-icon.svg");
const HamburgerOpen = getAssetUrl("icons/hamburger-close.svg");
function Sidebar({
  isOpen,
  setIsOpen,
  handleClose,
  routes,
  actionRoutes,
  parentActive,
  handleParentRouteChange,
  childActive,
  handleChildRouteChange,
  handleLogOut,
  isCloseWhenClickOutside = true,
  isMemoryRouter = true,
  visibleModulesCount,
  className,
  id,
  "data-testid": dataTestId
}) {
  const { t } = useTranslation();
  const sidebarRef = useRef(null);
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);
  useShortcut(
    [
      {
        keys: "mod+b",
        id: "sidebar-toggle-mod-b",
        description: t("sidebar.shortcut.toggleSidebar"),
        handler: handleToggle
      },
      {
        keys: "alt+l",
        id: "sidebar-logout-alt-l",
        description: t("sidebar.shortcut.logOut"),
        handler: () => {
          handleLogOut();
        }
      }
    ],
    {
      namespace: "Sidebar",
      priority: 1,
      preventDefault: true
    }
  );
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isCloseWhenClickOutside && isOpen) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isCloseWhenClickOutside, handleClose]);
  const nav = /* @__PURE__ */ jsxs(
    "nav",
    {
      ref: sidebarRef,
      "aria-label": t("sidebar.mainNavigation"),
      className: `impact-sidebar-container ${isOpen ? "sidebar-open" : ""} ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      id,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-label": isOpen ? t("sidebar.collapseSidebar") : t("sidebar.expandSidebar"),
            className: "impact-sidebar-toggle-btns",
            role: "button",
            tabIndex: 0,
            onClick: handleClose,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClose();
              }
            },
            children: /* @__PURE__ */ jsx("img", { alt: "", src: isOpen ? HamburgerClose : HamburgerOpen })
          }
        ),
        /* @__PURE__ */ jsx(
          SidebarMenus,
          {
            childActive,
            handleChildRouteChange,
            handleParentRouteChange,
            isMemoryRouter,
            isOpen,
            parentActive,
            routes,
            setIsOpen,
            visibleModulesCount
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "impact-sidebar-actions-container", children: [
          actionRoutes && actionRoutes.length > 0 ? /* @__PURE__ */ jsx(
            SidebarMenus,
            {
              childActive,
              handleChildRouteChange,
              handleParentRouteChange,
              isMemoryRouter,
              isOpen,
              parentActive,
              routes: actionRoutes,
              setIsOpen
            }
          ) : null,
          /* @__PURE__ */ jsx(SidebarActions, { handleLogOut, open: isOpen })
        ] })
      ]
    }
  );
  return nav;
}
Sidebar.displayName = "Sidebar";
export {
  Sidebar
};
