!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".MuiChip-root.impact_badges_icon_label_filled{background:#5f6673;cursor:default;height:24px;max-width:max-content;padding:2px 8px}.MuiChip-root.impact_badges_icon_label_filled .MuiChip-label{color:#fff;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;padding:0}.MuiChip-root.impact_badges_icon_label_filled.small-badge{height:20px}.MuiChip-root.impact_badges_icon_label_filled.small-badge .MuiChip-label{line-height:16px}.MuiChip-root.impact_badges_icon_label_filled svg{color:#fff!important;font-size:14px!important;height:14px;margin:0 6px 0 0!important;width:14px}.MuiChip-root.impact_badges_icon_label_filled.Mui-focusVisible,.MuiChip-root.impact_badges_icon_label_filled:hover{background:#5f6673}")),document.head.appendChild(i)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function FilledIconLabelBadges({
  label,
  icon,
  color,
  size,
  ...args
}) {
  const getFilledBadgesColor = (colorValue) => {
    switch (colorValue) {
      case "info":
        return "info-badge-filled";
      case "error":
        return "error-badge-filled";
      case "warning":
        return "warning-badge-filled";
      case "success":
        return "success-badge-filled";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsx(
    Chip,
    {
      className: `impact_badges_icon_label_filled ${getFilledBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      icon,
      label,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  FilledIconLabelBadges as default
};
