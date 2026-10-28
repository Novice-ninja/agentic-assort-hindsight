!function(){"use strict";try{if("undefined"!=typeof document){var o=document.createElement("style");o.appendChild(document.createTextNode(".impact-tooltip-container .MuiTooltip-tooltip{align-items:center;border-radius:8px;box-shadow:0 0 12px #1a277c24;display:flex;font-family:Manrope,sans-serif;font-size:14px;justify-content:center;line-height:21px;min-height:30px;padding:8px;text-align:left;white-space:pre-wrap;word-break:break-word}.impact-tooltip-container .MuiTooltip-arrow{margin-bottom:-.65em!important}.primary-tooltip .MuiTooltip-tooltip{background:#4259ee;color:#fff}.primary-tooltip .MuiTooltip-arrow{color:#4259ee}.secondary-tooltip .MuiTooltip-tooltip{background:#fff;color:#4259ee}.secondary-tooltip .MuiTooltip-arrow{color:#fff}.tertiary-tooltip .MuiTooltip-tooltip{background:#0d152c;color:#f5f5f5}.tertiary-tooltip .MuiTooltip-arrow{color:#0d152c}.feature-tooltip .MuiTooltip-tooltip{background:linear-gradient(274.01deg,#fdf0ec .91%,#fcf8ea 103.39%) padding-box,linear-gradient(270deg,#687af1,#ed7955) border-box;border:1px solid #0000;border-radius:12px;box-shadow:0 0 20px #687af133,0 0 40px #ed79551f;color:#1e293b;font-size:14px;line-height:1.4;max-width:280px;min-height:unset;padding:0}.feature-tooltip .impact-tooltip-feature-content{display:flex;flex-direction:column;gap:6px;padding:12px 16px}.feature-tooltip .impact-tooltip-feature-title{color:#0f172a;font-size:15px;font-weight:700;line-height:1.3}.feature-tooltip .impact-tooltip-feature-description{color:#1e293b;font-size:14px;font-weight:400;line-height:1.45}.feature-tooltip .MuiTooltip-arrow{color:#fdf0ec;filter:drop-shadow(0 1px 2px rgba(0,0,0,.08))}")),document.head.appendChild(o)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, isValidElement, cloneElement } from "react";

import Tooltip$1 from "../../node_modules/@mui/material/Tooltip/Tooltip.js";
const getVariantClass = (variant) => {
  switch (variant) {
    case "secondary":
      return "secondary-tooltip";
    case "tertiary":
      return "tertiary-tooltip";
    case "feature":
      return "feature-tooltip";
    default:
      return "primary-tooltip";
  }
};
const Tooltip = forwardRef(
  ({
    title,
    description,
    orientation = "top",
    variant = "primary",
    children,
    isHoverEnabled = true,
    className,
    id,
    "data-testid": dataTestId,
    ...rest
  }, ref) => {
    const tooltipTitle = variant === "feature" ? /* @__PURE__ */ jsxs("span", { className: "impact-tooltip-feature-content", children: [
      /* @__PURE__ */ jsx("span", { className: "impact-tooltip-feature-title", children: title }),
      description ? /* @__PURE__ */ jsx("span", { className: "impact-tooltip-feature-description", children: description }) : null
    ] }) : title;
    const tooltipChild = isValidElement(children) && (id || dataTestId) ? cloneElement(children, {
      id,
      "data-testid": dataTestId
    }) : children;
    return /* @__PURE__ */ jsx(
      Tooltip$1,
      {
        ref,
        arrow: true,
        classes: {
          popper: `impact-tooltip-container ${getVariantClass(variant)} ${className ?? ""}`.trim()
        },
        disableFocusListener: !isHoverEnabled,
        disableHoverListener: !isHoverEnabled,
        disableTouchListener: !isHoverEnabled,
        placement: orientation,
        PopperProps: {
          sx: {
            zIndex: 9999
          }
        },
        title: tooltipTitle,
        ...rest,
        children: tooltipChild
      }
    );
  }
);
Tooltip.displayName = "Tooltip";
export {
  Tooltip
};
