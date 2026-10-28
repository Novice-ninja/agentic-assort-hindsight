import { jsxs, jsx } from "react/jsx-runtime";
import Checkbox from "../../node_modules/@mui/material/Checkbox/Checkbox.js";
function WithoutFormLabel({
  defaultChecked,
  checked,
  onChange,
  isDisabled = false,
  label,
  isRequired = false,
  ...args
}) {
  const isChecked = checked ?? defaultChecked;
  return /* @__PURE__ */ jsxs("div", { className: "impact-form-checkbox-container", children: [
    /* @__PURE__ */ jsx(
      Checkbox,
      {
        ...args,
        disableRipple: true,
        checked,
        className: "impact-checkbox-container default-variant",
        defaultChecked,
        disabled: isDisabled,
        inputProps: {
          "aria-label": typeof label === "string" ? label : "Checkbox"
        },
        onChange,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.click();
          }
        }
      }
    ),
    isRequired ? /* @__PURE__ */ jsxs("div", { className: "impact-checkbox-label-with-required", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `impact-checkbox-label ${isChecked ? "checked" : ""} ${isDisabled ? "disabled" : ""}`,
          children: label
        }
      ),
      /* @__PURE__ */ jsx("span", { children: "*" })
    ] }) : /* @__PURE__ */ jsx(
      "div",
      {
        className: `impact-checkbox-label ${isChecked ? "checked" : ""} ${isDisabled ? "disabled" : ""}`,
        children: label
      }
    )
  ] });
}
export {
  WithoutFormLabel as default
};
