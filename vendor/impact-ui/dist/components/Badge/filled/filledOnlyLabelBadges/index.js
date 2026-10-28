!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".MuiChip-root.impact_badges_only_label_filled{background:#5f6673;cursor:default;height:24px;max-width:max-content;padding:2px 8px}.MuiChip-root.impact_badges_only_label_filled .MuiChip-label{color:#fff;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;padding:0}.MuiChip-root.impact_badges_only_label_filled.small-badge{height:20px}.MuiChip-root.impact_badges_only_label_filled.small-badge .MuiChip-label{line-height:16px}.MuiChip-root.impact_badges_only_label_filled svg{cursor:default!important;height:14px;width:14px}.MuiChip-root.impact_badges_only_label_filled.Mui-focusVisible,.MuiChip-root.impact_badges_only_label_filled:hover{background:#5f6673}.MuiChip-root.info-badge-filled,.MuiChip-root.info-badge-filled.Mui-focusVisible,.MuiChip-root.info-badge-filled:hover{background:#5267f4}.MuiChip-root.success-badge-filled,.MuiChip-root.success-badge-filled.Mui-focusVisible,.MuiChip-root.success-badge-filled:hover{background:#108431}.MuiChip-root.warning-badge-filled,.MuiChip-root.warning-badge-filled.Mui-focusVisible,.MuiChip-root.warning-badge-filled:hover{background:#ffe174}.MuiChip-root.warning-badge-filled .MuiChip-label{color:#1f2b4d}.MuiChip-root.warning-badge-filled svg{color:#1f2b4d!important}.MuiChip-root.error-badge-filled,.MuiChip-root.error-badge-filled.Mui-focusVisible,.MuiChip-root.error-badge-filled:hover{background:#ec4c5c}")),document.head.appendChild(i)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function FilledOnlyLabelBadges({
  label,
  color,
  size,
  icon: _icon,
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
      className: `impact_badges_only_label_filled ${getFilledBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      label,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  FilledOnlyLabelBadges as default
};
