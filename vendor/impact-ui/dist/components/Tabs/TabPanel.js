import { jsx } from "react/jsx-runtime";
import Box from "../../node_modules/@mui/material/Box/Box.js";
function CustomTabPanel({
  children,
  value,
  selectedValue,
  index,
  remountOnTabChange = true,
  ...other
}) {
  const isSelected = value === selectedValue;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-labelledby": `simple-tab-${index}`,
      className: "ia-styles ia-tabPanel",
      hidden: !isSelected,
      id: `simple-tabpanel-${index}`,
      role: "tabpanel",
      ...other,
      children: remountOnTabChange ? isSelected && /* @__PURE__ */ jsx(Box, { children }) : /* @__PURE__ */ jsx(Box, { children })
    }
  );
}
CustomTabPanel.displayName = "CustomTabPanel";
export {
  CustomTabPanel
};
