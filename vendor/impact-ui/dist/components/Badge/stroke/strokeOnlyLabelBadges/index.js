!function(){"use strict";try{if("undefined"!=typeof document){var o=document.createElement("style");o.appendChild(document.createTextNode(".MuiChip-root.impact_badges_only_label_stroke{background:#fff;border:1px solid #5f6673;height:24px!important;max-width:max-content;min-height:24px;padding:2px 8px}.MuiChip-root.impact_badges_only_label_stroke .MuiChip-label{color:#5f6673;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;padding:0}.MuiChip-root.impact_badges_only_label_stroke.small-badge{height:20px}.MuiChip-root.impact_badges_only_label_stroke.small-badge .MuiChip-label{line-height:16px}.MuiChip-root.impact_badges_only_label_stroke.Mui-focusVisible,.MuiChip-root.impact_badges_only_label_stroke:hover{background:#fff}.MuiChip-root.info-badge-stroke{background:#fff;border:1px solid #5267f4}.MuiChip-root.info-badge-stroke .MuiChip-label,.MuiChip-root.info-badge-stroke svg{color:#4259ee}.MuiChip-root.info-badge-stroke.Mui-focusVisible,.MuiChip-root.info-badge-stroke:hover{background-color:#fff}.MuiChip-root.success-badge-stroke{background:#fff;border:1px solid #108431}.MuiChip-root.success-badge-stroke .MuiChip-label,.MuiChip-root.success-badge-stroke svg{color:#108431}.MuiChip-root.success-badge-stroke.Mui-focusVisible,.MuiChip-root.success-badge-stroke:hover{background:#fff}.MuiChip-root.warning-badge-stroke{background:#fff;border:1px solid #8c6f06}.MuiChip-root.warning-badge-stroke .MuiChip-label,.MuiChip-root.warning-badge-stroke svg{color:#8c6f06}.MuiChip-root.warning-badge-stroke.Mui-focusVisible,.MuiChip-root.warning-badge-stroke:hover{background:#fff}.MuiChip-root.error-badge-stroke{background:#fff;border:1px solid #d62f2d}.MuiChip-root.error-badge-stroke .MuiChip-label,.MuiChip-root.error-badge-stroke svg{color:#d62f2d}.MuiChip-root.error-badge-stroke.Mui-focusVisible,.MuiChip-root.error-badge-stroke:hover{background:#fff}")),document.head.appendChild(o)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function StrokeOnlyLabelBadges({
  color,
  size,
  icon: _icon,
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
      className: `impact_badges_only_label_stroke ${getStrokeBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  StrokeOnlyLabelBadges as default
};
