import { jsxs, jsx } from "react/jsx-runtime";
import HelperText from "./HelperText.js";
import FormControl from "../../node_modules/@mui/material/FormControl/FormControl.js";
import OutlinedInput from "../../node_modules/@mui/material/OutlinedInput/OutlinedInput.js";
function VanillaInput({
  label,
  isRequired = false,
  isHelperText = false,
  helperText,
  focusedText,
  isError = false,
  isDisabled = false,
  htmlFor,
  size = "large",
  className = "",
  id,
  "data-testid": dataTestId,
  inputProps,
  ...args
}) {
  const inputId = id ?? htmlFor;
  const labelFor = htmlFor ?? id;
  const getContainerClass = () => {
    let baseClass = `impact_inputbox_container ${size} ${className}`;
    if (isError) {
      baseClass += " impact_input_error";
    } else if (isDisabled) {
      baseClass += " impact_input_disabled";
    }
    return baseClass.trim();
  };
  return /* @__PURE__ */ jsxs(FormControl, { className: getContainerClass(), children: [
    label && /* @__PURE__ */ jsxs("label", { htmlFor: labelFor, children: [
      label,
      " ",
      isRequired && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      OutlinedInput,
      {
        ...args,
        "aria-invalid": isError,
        disabled: isDisabled,
        error: isError,
        id: inputId,
        inputProps: {
          ...inputProps,
          ...dataTestId ? { "data-testid": dataTestId } : {}
        }
      }
    ),
    isHelperText && /* @__PURE__ */ jsx(HelperText, { focusedText, helper: helperText })
  ] });
}
export {
  VanillaInput as default
};
