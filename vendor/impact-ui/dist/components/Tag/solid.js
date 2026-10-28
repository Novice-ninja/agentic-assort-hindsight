import { jsx } from "react/jsx-runtime";
import default_1 from "../../node_modules/@mui/icons-material/Close.js";
import { getSize } from "./utils.js";
import Chip from "../../node_modules/@mui/material/Chip/Chip.js";
function SolidTags({
  label,
  size,
  icon,
  onClick,
  isRemovable,
  onDelete,
  ref,
  ...chipProps
}) {
  const sizeClass = getSize(size);
  if (icon && isRemovable) {
    return /* @__PURE__ */ jsx(
      Chip,
      {
        ...chipProps,
        ref,
        className: `impact-tag-solid ${sizeClass}`,
        deleteIcon: icon,
        label,
        variant: "outlined",
        onClick,
        onDelete
      }
    );
  }
  if (!icon && isRemovable) {
    return /* @__PURE__ */ jsx(
      Chip,
      {
        ...chipProps,
        ref,
        className: `impact-tag-solid ${sizeClass}`,
        deleteIcon: /* @__PURE__ */ jsx(default_1, {}),
        label,
        variant: "outlined",
        onClick,
        onDelete
      }
    );
  }
  return /* @__PURE__ */ jsx(
    Chip,
    {
      ...chipProps,
      ref,
      className: `impact-tag-solid ${sizeClass}`,
      label,
      variant: "outlined",
      onClick
    }
  );
}
export {
  SolidTags as default
};
