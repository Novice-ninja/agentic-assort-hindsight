import { jsx } from "react/jsx-runtime";
import FilledIconLabelBadges from "./filledIconLabelBadges/index.js";
import FilledOnlyIconBadges from "./filledOnlyIconBadges/index.js";
import FilledOnlyLabelBadges from "./filledOnlyLabelBadges/index.js";
function FilledBadges({
  label,
  icon,
  color,
  isIcon,
  size,
  ...args
}) {
  if (isIcon && label) {
    return /* @__PURE__ */ jsx(FilledIconLabelBadges, { color, icon, label, size, ...args });
  }
  if (isIcon && !label) {
    return /* @__PURE__ */ jsx(FilledOnlyIconBadges, { color, icon, isIcon, size, ...args });
  }
  return /* @__PURE__ */ jsx(FilledOnlyLabelBadges, { color, label, size, ...args });
}
export {
  FilledBadges as default
};
