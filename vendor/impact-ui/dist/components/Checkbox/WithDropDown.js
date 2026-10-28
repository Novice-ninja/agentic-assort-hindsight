import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import FormControlLabel from "../../node_modules/@mui/material/FormControlLabel/FormControlLabel.js";
import Checkbox from "../../node_modules/@mui/material/Checkbox/Checkbox.js";
import KeyboardArrowDown from "../../node_modules/@mui/icons-material/esm/KeyboardArrowDown.js";
import Menu from "../../node_modules/@mui/material/Menu/Menu.js";
import MenuItem from "../../node_modules/@mui/material/MenuItem/MenuItem.js";
function WithDropDown({
  defaultChecked,
  checked,
  onChange,
  isRequired = false,
  isDisabled = false,
  label,
  dropDownData,
  onDropDownCheckBoxClick,
  ...args
}) {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);
  const isOpen = Boolean(anchorEl);
  const onClose = () => {
    setAnchorEl(null);
    setOpenDropDown((prev) => !prev);
  };
  const handleClick = (event) => {
    setOpenDropDown((prev) => !prev);
    setAnchorEl(event.currentTarget);
    onDropDownCheckBoxClick == null ? void 0 : onDropDownCheckBoxClick(event);
  };
  const isChecked = checked ?? defaultChecked;
  return /* @__PURE__ */ jsxs("div", { className: "impact-form-checkbox", children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center" }, onClick: handleClick, children: [
      /* @__PURE__ */ jsx(
        FormControlLabel,
        {
          className: `impact-form-checkbox-container ${isChecked ? "checked" : ""}`,
          control: /* @__PURE__ */ jsx(
            Checkbox,
            {
              ...args,
              disableRipple: true,
              checked,
              className: "impact-checkbox-container default-variant",
              defaultChecked,
              disabled: isDisabled,
              onChange,
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.click();
                  setOpenDropDown(true);
                }
              }
            }
          ),
          disabled: isDisabled,
          label,
          required: isRequired
        }
      ),
      /* @__PURE__ */ jsx(KeyboardArrowDown, { className: `impact-arrow-button ${openDropDown ? "up" : "down"}` })
    ] }),
    /* @__PURE__ */ jsx(
      Menu,
      {
        autoFocus: true,
        anchorEl,
        className: "ia-styles ia-checkbox-menu",
        id: "basic-menu",
        MenuListProps: {
          "aria-labelledby": "basic-button",
          autoFocusItem: isOpen
        },
        open: isOpen,
        onClose,
        children: dropDownData.map((opt) => /* @__PURE__ */ jsx(
          MenuItem,
          {
            disableRipple: true,
            disableTouchRipple: true,
            disabled: opt.disabled,
            selected: selected === opt.value,
            onClick: () => {
              var _a;
              setSelected((prev) => prev === opt.value ? null : opt.value);
              (_a = opt.onClick) == null ? void 0 : _a.call(opt);
              onClose();
            },
            children: opt.label
          },
          opt.label
        ))
      }
    )
  ] });
}
export {
  WithDropDown as default
};
