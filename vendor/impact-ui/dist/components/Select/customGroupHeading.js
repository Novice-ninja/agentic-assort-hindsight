import { jsxs, jsx } from "react/jsx-runtime";
import { components } from "react-select";
import { Badge } from "../Badge/index.js";
const CustomGroupHeading = (props) => {
  const groupData = props.data;
  const {
    customBadgeLabel,
    customBadgeColor = "success",
    customBadgeStyles = {}
  } = groupData || {};
  return /* @__PURE__ */ jsxs("div", { className: "ia-select-group-heading-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "ia-select-group-heading-left", children: [
      groupData.icon && /* @__PURE__ */ jsx("div", { className: "group-icon", children: groupData.icon }),
      /* @__PURE__ */ jsx(components.GroupHeading, { ...props })
    ] }),
    customBadgeLabel && /* @__PURE__ */ jsx(
      Badge,
      {
        color: customBadgeColor,
        label: customBadgeLabel,
        size: "small",
        sx: customBadgeStyles,
        variant: "subtle"
      }
    )
  ] });
};
export {
  CustomGroupHeading
};
