!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".MuiChip-root.impact_badges_icon_label_subtle{background:#f2f3f4;cursor:default;height:24px;max-width:max-content;padding:2px 8px}.MuiChip-root.impact_badges_icon_label_subtle .MuiChip-label{color:#5f6673;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;padding:0}.MuiChip-root.impact_badges_icon_label_subtle.small-badge{height:20px}.MuiChip-root.impact_badges_icon_label_subtle.small-badge .MuiChip-label{line-height:16px}.MuiChip-root.impact_badges_icon_label_subtle svg{color:#5f6673!important;font-size:14px!important;height:14px;margin:0 6px 0 0!important;width:14px}.MuiChip-root.impact_badges_icon_label_subtle.Mui-focusVisible,.MuiChip-root.impact_badges_icon_label_subtle:hover{background:#f2f3f4}.MuiChip-root.info-badge-subtle svg{color:#5267f4!important}.MuiChip-root.success-badge-subtle svg{color:#0b832f!important}.MuiChip-root.warning-badge-subtle svg{color:#8c6f06!important}.MuiChip-root.error-badge-subtle svg{color:#d62f2d!important}")),document.head.appendChild(i)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function SubtleIconLabelBadges({
  label,
  icon,
  color,
  size,
  isIcon: _isIcon,
  ...args
}) {
  const getSubtleBadgesColor = (colorValue) => {
    switch (colorValue) {
      case "info":
        return "info-badge-subtle";
      case "error":
        return "error-badge-subtle";
      case "warning":
        return "warning-badge-subtle";
      case "success":
        return "success-badge-subtle";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsx(
    Chip,
    {
      className: `impact_badges_icon_label_subtle ${getSubtleBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      icon,
      label,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  SubtleIconLabelBadges as default
};
