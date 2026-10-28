!function(){"use strict";try{if("undefined"!=typeof document){var o=document.createElement("style");o.appendChild(document.createTextNode(".MuiChip-root.impact_badges_only_icon_stroke{background:#fff;border:1px solid #c3c8d4;cursor:default!important;height:24px;max-width:24px;padding:4px;width:24px}.MuiChip-root.impact_badges_only_icon_stroke.small-badge{height:20px;width:20px}.MuiChip-root.impact_badges_only_icon_stroke svg{color:#5f6673;font-size:14px!important;height:14px;margin:0!important;width:14px}.MuiChip-root.impact_badges_only_icon_stroke span{display:none}.MuiChip-root.impact_badges_only_icon_stroke.Mui-focusVisible,.MuiChip-root.impact_badges_only_icon_stroke:hover{background:#f5f6fa}")),document.head.appendChild(o)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function StrokeOnlyIconBadges({ color, icon, size, ...args }) {
  const getStrokeBadgesColor = (colorValue) => {
    switch (colorValue) {
      case "info":
        return "info-badge-stroke";
      case "error":
        return "error-badge-stroke";
      case "warning":
        return "warning-badge-stroke";
      case "success":
        return "success-badge-stroke";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsx(
    Chip,
    {
      className: `impact_badges_only_icon_stroke ${getStrokeBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      icon,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  StrokeOnlyIconBadges as default
};
