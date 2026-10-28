!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".MuiChip-root.impact_badges_only_icon_subtle{background:#5f6673;cursor:default!important;height:24px;max-width:24px;padding:4px;width:24px}.MuiChip-root.impact_badges_only_icon_subtle.small-badge{height:20px;width:20px}.MuiChip-root.impact_badges_only_icon_subtle svg{color:#fff;font-size:14px!important;height:14px;margin:0!important;width:14px}.MuiChip-root.impact_badges_only_icon_subtle span{display:none}.MuiChip-root.impact_badges_only_icon_subtle.Mui-focusVisible,.MuiChip-root.impact_badges_only_icon_subtle:hover{background:#5f6673}")),document.head.appendChild(i)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function SubtleOnlyIconBadges({
  color,
  icon,
  size,
  label: _label,
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
      className: `impact_badges_only_icon_subtle ${getSubtleBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      icon,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  SubtleOnlyIconBadges as default
};
