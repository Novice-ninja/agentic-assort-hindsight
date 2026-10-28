import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import FormControlLabel from "../../node_modules/@mui/material/FormControlLabel/FormControlLabel.js";
import Checkbox from "../../node_modules/@mui/material/Checkbox/Checkbox.js";
const Dashed = forwardRef(function Dashed2({ defaultChecked, checked, onChange, isRequired = false, isDisabled = false, label, ...args }, ref) {
  const isChecked = checked ?? defaultChecked;
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
          className: "impact-checkbox-container dashed-variant",
          defaultChecked,
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
  Dashed as default
};
