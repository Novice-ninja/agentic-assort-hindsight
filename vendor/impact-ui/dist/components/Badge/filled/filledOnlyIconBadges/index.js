!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".MuiChip-root.impact_badges_only_icon_filled{background:#5f6673;cursor:default!important;height:24px;max-width:24px;padding:4px;width:24px}.MuiChip-root.impact_badges_only_icon_filled.small-badge{height:20px;width:20px}.MuiChip-root.impact_badges_only_icon_filled svg{color:#fff;font-size:14px!important;height:14px;margin:0!important;width:14px}.MuiChip-root.impact_badges_only_icon_filled span{display:none}.MuiChip-root.impact_badges_only_icon_filled.Mui-focusVisible,.MuiChip-root.impact_badges_only_icon_filled:hover{background:#5f6673}")),document.head.appendChild(i)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";

import Chip from "../../../../node_modules/@mui/material/Chip/Chip.js";
function FilledOnlyIconBadges({ color, icon, size, ...args }) {
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
      className: `impact_badges_only_icon_filled ${getFilledBadgesColor(
        color
      )} ${size === "small" ? "small-badge" : ""}`,
      icon,
      ...{ ...args, disableRipple: true }
    }
  );
}
export {
  FilledOnlyIconBadges as default
};
