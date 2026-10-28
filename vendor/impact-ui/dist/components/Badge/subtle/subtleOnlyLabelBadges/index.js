!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".MuiChip-root.impact_badges_only_label_subtle{background:#f2f3f4;cursor:default;height:24px;max-width:max-content;padding:2px 8px}.MuiChip-root.impact_badges_only_label_subtle .MuiChip-label{color:#5f6673;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;padding:0}.MuiChip-root.impact_badges_only_label_subtle.small-badge{height:20px}.MuiChip-root.impact_badges_only_label_subtle.small-badge .MuiChip-label{line-height:16px}.MuiChip-root.impact_badges_only_label_subtle svg{cursor:default!important;height:14px;width:14px}.MuiChip-root.impact_badges_only_label_subtle.Mui-focusVisible,.MuiChip-root.impact_badges_only_label_subtle:hover{background:#f2f3f4}.MuiChip-root.info-badge-subtle{background:#f1f3fe}.MuiChip-root.info-badge-subtle .MuiChip-label{color:#5267f4}.MuiChip-root.info-badge-subtle.Mui-focusVisible,.MuiChip-root.info-badge-subtle:hover{background:#f1f3fe}.MuiChip-root.success-badge-subtle{background:#f4fff7}.MuiChip-root.success-badge-subtle .MuiChip-label{color:#0b832f}.MuiChip-root.success-badge-subtle.Mui-focusVisible,.MuiChip-root.success-badge-subtle:hover{background:#f4fff7}.MuiChip-root.warning-badge-subtle{background:#fdfae9}.MuiChip-root.warning-badge-subtle .MuiChip-label{color:#8c6f06}.MuiChip-root.warning-badge-subtle.Mui-focusVisible,.MuiChip-root.warning-badge-subtle:hover{background:#fdfae9}.MuiChip-root.error-badge-subtle{background:#fef4f5}.MuiChip-root.error-badge-subtle .MuiChip-label{color:#d62f2d}.MuiChip-root.error-badge-subtle.Mui-focusVisible,.MuiChip-root.error-badge-subtle:hover{background:#fef4f5}")),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function SubtleOnlyLabelBadges({
  label,
  color,
  size,
  isIcon: _isIcon,
  icon: _icon,
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
      className: `impact_badges_only_label_subtle ${getSubtleBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      label,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  SubtleOnlyLabelBadges as default
};
