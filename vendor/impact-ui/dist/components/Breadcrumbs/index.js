!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-styles.ia-breadcrumb{color:#4259ee;cursor:pointer;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;letter-spacing:-.01em;line-height:16.1px;text-align:left}.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home){border-radius:4px}.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home):focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home):focus:not(:focus-visible){box-shadow:none;outline:none}.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home).Mui-disabled:focus-visible,.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home).ia-btn-disabled:focus-visible,.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home).ia-switch-disabled:focus-visible,.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home).impact-select-disabled:focus-visible,.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home).impact_input_disabled:focus-visible,.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home).route-disabled:focus-visible,.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home):disabled:focus-visible,.ia-styles.ia-breadcrumb:not(.ia-breadcrumb-home)[aria-disabled=true]:focus-visible{box-shadow:none;outline:none}.ia-styles.ia-breadcrumb.ia-breadcrumb-disabled{color:#60697d}.ia-styles.ia-breadcrumb.ia-breadcrumb-home svg{display:flex}.ia-styles.ia-breadcrumb.ia-breadcrumb-home svg path{height:11.67px;width:10.67px}.ia-styles.ia-breadcrumb.ia-breadcrumb-extras{margin-left:5px;margin-right:-1px}.ia-styles.ia-breadcrumb:hover:not(.ia-breadcrumb-noLink):not(.ia-breadcrumb-disabled){color:#4259ee}.ia-styles.ia-breadcrumb:hover:not(.ia-breadcrumb-noLink):not(.ia-breadcrumb-disabled) path{fill:#4259ee}.ia-styles.ia-breadcrumb.ia-breadcrumb-noLink{color:#1f2b4d;cursor:default;font-weight:800}.MuiBreadcrumbs-root .MuiBreadcrumbs-separator{font-size:20px;margin-left:0;margin-right:0;margin-top:3px}.MuiBreadcrumbs-root .MuiBreadcrumbs-li:has(>*>.ia-breadcrumb-extras){height:24px}.MuiBreadcrumbs-root .MuiBreadcrumbs-li:has(>*>.ia-breadcrumb-extras) div{align-items:center;display:flex}.ia-breadcrumb-extras svg{fill:#6b7280!important;margin-top:1px}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import default_1$1 from "../../node_modules/@mui/icons-material/KeyboardArrowRight.js";
import default_1 from "../../node_modules/@mui/icons-material/MoreHoriz.js";
import { Menu } from "../Menu/index.js";
import { HomeIcon } from "./HomeIcon.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Link from "../../node_modules/@mui/material/Link/Link.js";
import Breadcrumbs$1 from "../../node_modules/@mui/material/Breadcrumbs/Breadcrumbs.js";
function Breadcrumbs({
  list,
  className = "",
  id,
  "data-testid": dataTestId,
  ...rest
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };
  const breadCrumbList = useMemo(() => {
    const filtered = list.filter((_, idx) => idx < 2 || idx > list.length - 3);
    const temp = filtered.map((item, index, arr) => {
      const isLast = index === arr.length - 1;
      if (!isLast) {
        return /* @__PURE__ */ jsx(
          Link,
          {
            "aria-label": item.label === "Home" || item.label === t("breadcrumbs.home") ? t("breadcrumbs.home") : void 0,
            className: `ia-styles ia-breadcrumb ${item.label === "Home" || item.label === t("breadcrumbs.home") ? "ia-breadcrumb-home" : ""} ${item.disabled ? "ia-breadcrumb-disabled" : ""}`,
            href: !item.disabled && item.to || void 0,
            underline: "none",
            onClick: !item.disabled && item.onClick || void 0,
            children: item.label === "Home" || item.label === t("breadcrumbs.home") ? /* @__PURE__ */ jsx(HomeIcon, {}) : item.label
          },
          item.label
        );
      }
      return /* @__PURE__ */ jsx("span", { className: "ia-styles ia-breadcrumb ia-breadcrumb-noLink", children: item.label }, item.label);
    });
    const extras = list.filter((_, idx) => idx >= 2 && idx <= list.length - 3);
    if (extras.length > 0 && temp.length > 1) {
      const secondItem = temp[1];
      temp[1] = /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex" }, children: [
        secondItem,
        /* @__PURE__ */ jsxs("div", { className: "ia-styles ia-breadcrumb ia-breadcrumb-extras", children: [
          /* @__PURE__ */ jsx(default_1, { onClick: handleClick }),
          /* @__PURE__ */ jsx(
            Menu,
            {
              anchorEl,
              open: isOpen,
              options: extras.map((e) => ({
                ...e,
                label: e.label,
                onClick: e.onClick ?? (() => window.open(e.to))
              })),
              onClose
            }
          )
        ] }, "extras")
      ] }, "extras-wrapper");
    }
    return temp;
  }, [list, isOpen]);
  return /* @__PURE__ */ jsx(
    Breadcrumbs$1,
    {
      "aria-label": t("breadcrumbs.ariaLabel"),
      separator: /* @__PURE__ */ jsx(default_1$1, { sx: { height: "15px", width: "12px" } }),
      sx: { lineHeight: "21px" },
      ...rest,
      className,
      "data-testid": dataTestId,
      id,
      children: breadCrumbList
    }
  );
}
Breadcrumbs.displayName = "Breadcrumbs";
export {
  Breadcrumbs
};
