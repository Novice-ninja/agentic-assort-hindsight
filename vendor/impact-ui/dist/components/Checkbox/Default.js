import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import WithDropDown from "./WithDropDown.js";
import WithoutFormLabel from "./WithoutFormLabel.js";
import FormControlLabel from "../../node_modules/@mui/material/FormControlLabel/FormControlLabel.js";
import Checkbox from "../../node_modules/@mui/material/Checkbox/Checkbox.js";
const Default = forwardRef(function Default2({
  defaultChecked,
  checked,
  onChange,
  isRequired = false,
  isDisabled = false,
  label,
  withoutFormLabel = false,
  withDropDown = false,
  dropDownData,
  onDropDownCheckBoxClick,
  id,
  "data-testid": dataTestId,
  ...args
}, ref) {
  if (withoutFormLabel) {
    return /* @__PURE__ */ jsx(
      WithoutFormLabel,
      {
        ...args,
        checked,
        defaultChecked,
        isDisabled,
        isRequired,
        label,
        onChange
      }
    );
  }
  if (withDropDown && dropDownData && dropDownData.length > 0) {
    return /* @__PURE__ */ jsx(
      WithDropDown,
      {
        ...args,
        checked,
        defaultChecked,
        dropDownData,
        isDisabled,
        isRequired,
        label,
        onChange,
        onDropDownCheckBoxClick
      }
    );
  }
  const isChecked = checked || defaultChecked;
  return /* @__PURE__ */ jsx(
    FormControlLabel,
    {
      className: `impact-form-checkbox-container ${isChecked ? "checked" : ""}`,
      control: /* @__PURE__ */ jsx(
        Checkbox,
        {
          ...args,
          ref,
          disableRipple: true,
          checked,
          className: "impact-checkbox-container default-variant",
          defaultChecked,
          disabled: isDisabled,
          id,
          inputProps: { "data-testid": dataTestId },
          onChange,
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.click();
            }
          }
        }
      ),
      disabled: isDisabled,
      label,
      required: isRequired
    }
  );
});
export {
  Default as default
};
