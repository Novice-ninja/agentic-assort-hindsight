!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact_drawer_filter_container_medium{height:100%;width:675px}.impact_drawer_filter_container_large{height:100%;width:840px}.MuiBox-root{width:auto}.impact_drawer_filter_container{display:flex;flex-direction:column;position:relative}.impact_drawer_filter_container .impact_drawer_filter_header{align-items:center;background:#fff;border-bottom:1px solid #d9dde7;display:flex;justify-content:space-between;padding:9px 16px;position:sticky;top:0;z-index:1}.impact_drawer_filter_container .impact_drawer_filter_header .impact_drawer_filter_left_header{align-items:center;display:flex;gap:16px}.impact_drawer_filter_container .impact_drawer_filter_header .impact_drawer_filter_left_header .impact_drawer_filter_left_heading_icon{background:#fff url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/filter-icon.svg) no-repeat;background-position:50%;background-size:14px;border:1px solid #eceefd;border-radius:8px;height:32px;width:32px}.impact_drawer_filter_container .impact_drawer_filter_header .impact_drawer_filter_left_header .impact_drawer_filter_left_heading{color:#1f2b4d;font-size:18px;font-weight:700}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel{background:#f5f6fa;border-right:1px solid #d9dde7;flex-shrink:0;height:100%;padding-top:10px;width:200px}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs{display:flex;flex-direction:column;gap:8px;padding:0 8px}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact-drawer-filter-separator{background-color:#d9dde7;display:block;height:1px;margin-left:-8px;margin-right:-8px;width:200px}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab{align-items:center;display:flex;justify-content:space-between;padding:6px 8px 6px 18px}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab:focus:not(:focus-visible){box-shadow:none;outline:none}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab:hover{background-color:#eceefd;border-radius:8px;cursor:pointer}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab_content{align-items:center;display:flex;gap:10px;width:85%}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab_icon img,.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab_icon svg{color:#60697d;display:flex;height:16px;width:16px}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab_label{color:#60697d;display:flex;flex-direction:row;font-size:16px;gap:4px;line-height:20px;overflow:hidden;white-space:nowrap}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab_label span{overflow:hidden;text-overflow:ellipsis}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab_label-required{color:#ec4c5c}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .impact_drawer_filter_tab_badges{background-color:#fff;border-radius:8px;box-sizing:border-box;color:#60697d;font-size:12px;height:18px;line-height:18px;min-width:27px;padding:0 8px;text-align:center}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_active{background-color:#eceefd;border-radius:8px}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_active .impact_drawer_filter_tab_icon svg,.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_active .impact_drawer_filter_tab_label{color:#4259ee}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_active .impact_drawer_filter_tab_icon img{filter:brightness(0) saturate(100%) invert(30%) sepia(100%) saturate(4545%) hue-rotate(231deg) brightness(103%) contrast(87%)}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_active .impact_drawer_filter_tab_badges{color:#4259ee}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_disabled .impact_drawer_filter_tab_badges,.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_disabled .impact_drawer_filter_tab_icon svg,.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_disabled .impact_drawer_filter_tab_label,.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_disabled svg{color:#b4bac7}.impact_drawer_filter_container .impact_drawer_filter_container_left_panel .impact_drawer_filter_left_filters_tabs .filter_tab_disabled:hover{background-color:#f5f6fa;cursor:default}.impact_drawer_filter_container .impact-drawer-filter-main-container{display:flex;flex-direction:row;flex-shrink:0;height:calc(100% - 40px)}.impact_drawer_filter_container .impact_drawer_filter_container_right_panel{width:640px}.impact_drawer_filter_container .impact_drawer_filter_container_right_panel .impact_drawer_filter_body{height:calc(100% - 60px);overflow-y:auto;padding:16px;position:relative;width:100%;z-index:0}.impact_drawer_filter_container .impact_drawer_filter_container_right_panel .impact_drawer_filter_footer{align-items:center;background:#fff;border-top:1px solid #d9dde7;bottom:0;display:flex;height:56px;justify-content:space-between;left:200px;padding:0 16px;position:absolute;right:0;z-index:1}.impact_drawer_filter_container .impact_drawer_filter_container_right_panel .impact_drawer_filter_footer .impact_drawer_filter_footer_left_container,.impact_drawer_filter_container .impact_drawer_filter_container_right_panel .impact_drawer_filter_footer .impact_drawer_filter_footer_right_container{align-items:center;display:flex;gap:8px}.impact_drawer_filter_container .impact_drawer_filter_container_right_panel .impact_drawer_filter_footer_no_buttons{height:100%}')),document.head.appendChild(e)}}catch(r){console.error("vite-plugin-css-injected-by-js",r)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { FilterPanelHeader } from "./FilterPanelHeader.js";
import { PanelFooter } from "./PanelFooter.js";
import { PanelSidebar } from "./PanelSidebar.js";

import Drawer from "../../node_modules/@mui/material/Drawer/Drawer.js";
function getSizeClass(size) {
  switch (size) {
    case "medium":
      return "impact_drawer_filter_container_medium";
    default:
      return "impact_drawer_filter_container_large";
  }
}
function FilterPanel({
  className,
  title,
  size,
  anchor = "right",
  isOpen,
  setIsOpen,
  active,
  setActive,
  filters,
  handleClose,
  primaryButtonLabel,
  onPrimaryButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  tertiaryButtonLabel,
  onTertiaryButtonClick,
  quaternaryButtonLabel,
  onQuaternaryButtonClick,
  primaryButtonProps,
  secondaryButtonProps,
  tertiaryButtonProps,
  quaternaryButtonProps,
  alwaysRender = false,
  "data-testid": dataTestId,
  ...drawerProps
}) {
  var _a;
  const toggleDrawer = (_drawerAnchor, _open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    if (handleClose) {
      handleClose();
    } else {
      setIsOpen == null ? void 0 : setIsOpen(!isOpen);
    }
  };
  const activeItems = filters.filter((item) => item.value === active);
  const activeContent = (_a = activeItems[0]) == null ? void 0 : _a.children;
  const containerClass = ["impact_drawer_filter_container", getSizeClass(size), className ?? ""].filter(Boolean).join(" ");
  if (!tertiaryButtonLabel && !secondaryButtonLabel && !primaryButtonLabel) {
    return /* @__PURE__ */ jsx(Drawer, { anchor, open: isOpen, onClose: toggleDrawer(), ...drawerProps, children: /* @__PURE__ */ jsxs("div", { className: containerClass, "data-testid": dataTestId, children: [
      /* @__PURE__ */ jsx(FilterPanelHeader, { title, toggleDrawer: toggleDrawer() }),
      /* @__PURE__ */ jsxs("div", { className: "impact-drawer-filter-main-container", children: [
        /* @__PURE__ */ jsx(PanelSidebar, { active, filters, setActive }),
        /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_container_right_panel", children: /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_body impact_drawer_filter_footer_no_buttons", children: activeContent }) })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Drawer, { anchor, open: isOpen, onClose: toggleDrawer(), ...drawerProps, children: /* @__PURE__ */ jsxs("div", { className: containerClass, "data-testid": dataTestId, children: [
    /* @__PURE__ */ jsx(FilterPanelHeader, { title, toggleDrawer: toggleDrawer() }),
    /* @__PURE__ */ jsxs("div", { className: "impact-drawer-filter-main-container", children: [
      /* @__PURE__ */ jsx(PanelSidebar, { active, filters, setActive }),
      /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_container_right_panel", children: [
        alwaysRender ? filters.map((item) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "impact_drawer_filter_body",
            style: {
              display: item.value === active ? "block" : "none"
            },
            children: item.children
          },
          item.id ?? item.value
        )) : /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_body", children: activeContent }),
        /* @__PURE__ */ jsx(
          PanelFooter,
          {
            primaryButtonLabel,
            primaryButtonProps,
            quaternaryButtonLabel,
            quaternaryButtonProps,
            secondaryButtonLabel,
            secondaryButtonProps,
            tertiaryButtonLabel,
            tertiaryButtonProps,
            onPrimaryButtonClick,
            onQuaternaryButtonClick,
            onSecondaryButtonClick,
            onTertiaryButtonClick
          }
        )
      ] })
    ] })
  ] }) });
}
FilterPanel.displayName = "FilterPanel";
export {
  FilterPanel,
  FilterPanelHeader,
  PanelFooter,
  PanelSidebar
};
