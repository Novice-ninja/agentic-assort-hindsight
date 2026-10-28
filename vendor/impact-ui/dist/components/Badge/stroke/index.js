import { jsx } from "react/jsx-runtime";
import StrokeIconLabelBadges from "./strokeIconLabelBadges/index.js";
import StrokeOnlyIconBadges from "./strokeOnlyIconBadges/index.js";
import StrokeOnlyLabelBadges from "./strokeOnlyLabelBadges/index.js";
function StrokeBadges({
  label,
  icon,
  color,
  isIcon,
  size,
  ...args
}) {
  if (isIcon && label) {
    return /* @__PURE__ */ jsx(
      StrokeIconLabelBadges,
      {
        color,
        icon,
        isIcon,
        label,
        size,
        ...args
      }
    );
  }
  if (isIcon && !label) {
    return /* @__PURE__ */ jsx(StrokeOnlyIconBadges, { color, icon, isIcon, size, ...args });
  }
  return /* @__PURE__ */ jsx(StrokeOnlyLabelBadges, { color, label, size, ...args });
}
export {
  StrokeBadges as default
};
