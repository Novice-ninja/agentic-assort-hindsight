!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".MuiChip-root.impact_badges_icon_label_stroke{background:#fff;border:1px solid #5f6673;cursor:default;height:24px;max-width:max-content;padding:2px 8px}.MuiChip-root.impact_badges_icon_label_stroke .MuiChip-label{color:#5f6673;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;padding:0}.MuiChip-root.impact_badges_icon_label_stroke.small-badge{height:20px}.MuiChip-root.impact_badges_icon_label_stroke.small-badge .MuiChip-label{line-height:16px}.MuiChip-root.impact_badges_icon_label_stroke svg{color:#5f6673;font-size:14px!important;height:14px;margin:0 6px 0 0!important;width:14px}.MuiChip-root.impact_badges_icon_label_stroke.Mui-focusVisible,.MuiChip-root.impact_badges_icon_label_stroke:hover{background:#fff}")),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function StrokeIconLabelBadges({
  color,
  label,
  icon,
  size,
  ...args
}) {
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
      className: `impact_badges_icon_label_stroke ${getStrokeBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      icon,
      label,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  StrokeIconLabelBadges as default
};
