import { jsx } from "react/jsx-runtime";
import SubtleIconLabelBadges from "./subtleIconLabelBadges/index.js";
import SubtleOnlyIconBadges from "./subtleIOnlyIconBadges/index.js";
import SubtleOnlyLabelBadges from "./subtleOnlyLabelBadges/index.js";
function SubtleBadges({
  label,
  icon,
  color,
  isIcon,
  size,
  ...args
}) {
  if (isIcon && label) {
    return /* @__PURE__ */ jsx(SubtleIconLabelBadges, { color, icon, label, size, ...args });
  }
  if (isIcon && !label) {
    return /* @__PURE__ */ jsx(SubtleOnlyIconBadges, { color, icon, isIcon, size, ...args });
  }
  return /* @__PURE__ */ jsx(SubtleOnlyLabelBadges, { color, label, size, ...args });
}
export {
  SubtleBadges as default
};
