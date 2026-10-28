!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact_drawer_container_medium{height:100%;width:375px}.impact_drawer_container_large{height:100%;width:526px}.MuiBox-root{width:auto}.impact_drawer_container{--ia-focus-bg:#eceefd;position:relative}.impact_drawer_container .impact_drawer_header{align-items:center;background:#eceefd;display:flex;height:40px;justify-content:space-between;padding:0 16px;position:sticky;top:0;z-index:1}.impact_drawer_container .impact_drawer_header .impact_drawer_heading{font-size:16px;font-weight:700}.impact_drawer_container .impact_drawer_header .close_icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/close.svg) no-repeat;background-position:50%;background-size:16px;cursor:pointer;height:16px;width:16px}.impact_drawer_container .impact_drawer_header .close_icon:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact_drawer_container .impact_drawer_header .close_icon:focus:not(:focus-visible){box-shadow:none;outline:none}.impact_drawer_container .impact_drawer_body{height:calc(100% - 100px);overflow-y:auto;padding:16px;position:relative;width:100%;z-index:0}.impact_drawer_container .impact_drawer_footer{align-items:center;background:#fff;border-top:1px solid #d9dde7;bottom:0;display:flex;height:56px;left:0;padding:0 16px;position:absolute;right:0;z-index:1}.impact_drawer_container .impact_drawer_footer .ia-styles.ia-btn.ia-btn-link{text-decoration:none}.impact_drawer_container .impact_drawer_footer .impact_drawer_footer_right_container{align-items:center;display:flex;gap:8px;margin-left:auto}.panel-resizer{cursor:col-resize;height:100%;position:absolute;top:0;width:5px;z-index:10}.panel-resizer.panel-resizer-left{left:0}.panel-resizer.panel-resizer-right{right:0}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "../Button/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Drawer from "../../node_modules/@mui/material/Drawer/Drawer.js";
function getSize(size) {
  switch (size) {
    case "medium":
      return "impact_drawer_container_medium";
    default:
      return "impact_drawer_container_large";
  }
}
function Panel({
  className,
  title,
  size,
  anchor = "right",
  open,
  setIsOpen,
  children,
  onClose,
  primaryButtonLabel,
  onPrimaryButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  primaryButtonProps,
  secondaryButtonProps,
  width,
  zIndex = 1500,
  customFooterContent,
  resizable,
  minWidth = 375,
  maxWidth,
  onResize,
  ...args
}) {
  const { t } = useTranslation();
  const parseDrawerWidth = (value) => value != null ? parseInt(String(value), 10) : 526;
  const [drawerWidth, setDrawerWidth] = useState(parseDrawerWidth(width));
  useEffect(() => {
    setDrawerWidth(parseDrawerWidth(width));
  }, [width]);
  const toggleDrawer = (_anchor, isOpen) => (event, _reason) => {
    const e = event;
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    if (onClose) {
      onClose();
    }
    setIsOpen == null ? void 0 : setIsOpen(isOpen);
  };
  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = drawerWidth;
    const min = minWidth;
    const max = maxWidth ?? window.innerWidth - 100;
    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      let newWidth = anchor === "left" ? startWidth + delta : startWidth - delta;
      if (newWidth < min) newWidth = min;
      if (newWidth > max) newWidth = max;
      setDrawerWidth(newWidth);
      onResize == null ? void 0 : onResize(newWidth);
    };
    const onMouseUp = () => {
      document.body.classList.remove("no-select");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.body.classList.add("no-select");
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const getCurrentWidth = () => {
    if (resizable) return `${drawerWidth}px`;
    if (width) return `${width}px`;
    return void 0;
  };
  const resizerHandle = resizable ? /* @__PURE__ */ jsx(
    "div",
    {
      className: `panel-resizer ${anchor === "left" ? "panel-resizer-right" : "panel-resizer-left"}`,
      onMouseDown: handleResizeMouseDown
    }
  ) : null;
  const hasFooterButtons = secondaryButtonLabel || primaryButtonLabel;
  return /* @__PURE__ */ jsx(
    Drawer,
    {
      anchor,
      open,
      sx: {
        "& .MuiDrawer-paper": {
          zIndex: `${zIndex}`,
          overflow: "visible"
        }
      },
      onClose: toggleDrawer(anchor, false),
      ...args,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `impact_drawer_container ${getSize(size)} ${className ?? ""}`,
          style: { width: getCurrentWidth() },
          children: [
            resizerHandle,
            /* @__PURE__ */ jsxs("div", { className: "impact_drawer_header", children: [
              /* @__PURE__ */ jsx("div", { className: "impact_drawer_heading", children: title }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-label": t("common.close"),
                  className: "close_icon",
                  "data-testid": "panel-close-button",
                  role: "button",
                  tabIndex: 0,
                  onClick: toggleDrawer(anchor, false),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleDrawer(anchor, false)(e);
                    }
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "impact_drawer_body",
                style: !hasFooterButtons ? { height: "calc(100% - 40px)" } : void 0,
                children
              }
            ),
            (hasFooterButtons || customFooterContent) && /* @__PURE__ */ jsxs("div", { className: "impact_drawer_footer", children: [
              customFooterContent ?? null,
              /* @__PURE__ */ jsxs("div", { className: "impact_drawer_footer_right_container", children: [
                secondaryButtonLabel && /* @__PURE__ */ jsx(Button, { variant: "url", onClick: onSecondaryButtonClick, ...secondaryButtonProps, children: secondaryButtonLabel }),
                primaryButtonLabel && /* @__PURE__ */ jsx(Button, { onClick: onPrimaryButtonClick, ...primaryButtonProps, children: primaryButtonLabel })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
export {
  Panel
};
