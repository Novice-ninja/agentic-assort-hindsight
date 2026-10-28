import { jsxs, jsx } from "react/jsx-runtime";
import HelperText from "./HelperText.js";
import FormControl from "../../node_modules/@mui/material/FormControl/FormControl.js";
import OutlinedInput from "../../node_modules/@mui/material/OutlinedInput/OutlinedInput.js";
function InputWithIcon({
  label,
  isRequired = false,
  leftIcon,
  leftIconClick,
  rightIcon,
  rightIconClick,
  isError = false,
  isDisabled = false,
  helperText,
  isHelperText = false,
  focusedText,
  htmlFor,
  iconClickOnDisabled = false,
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
    let baseClass = `impact_inputbox_container_with_icons ${size} ${className}`;
    if (isError) {
      baseClass += " input-with-error";
    } else if (isDisabled) {
      baseClass += " input-with-disabled";
      if (iconClickOnDisabled) {
        baseClass += " icon-click-on-disabled";
      }
    }
    return baseClass.trim();
  };
  const handleLeftIconClick = () => {
    if (!isDisabled || iconClickOnDisabled) {
      leftIconClick == null ? void 0 : leftIconClick();
    }
  };
  const handleRightIconClick = () => {
    if (!isDisabled || iconClickOnDisabled) {
      rightIconClick == null ? void 0 : rightIconClick();
    }
  };
  const renderIconWrapper = (icon, side, iconClick, handleClick) => {
    const className2 = side === "left" ? "left-input-icon" : "right-input-icon";
    if (!iconClick) {
      return /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: className2, children: icon });
    }
    const isIconDisabled = isDisabled && !iconClickOnDisabled;
    return /* @__PURE__ */ jsx(
      "div",
      {
        "aria-label": `${side === "left" ? "Left" : "Right"} icon action`,
        className: className2,
        role: "button",
        tabIndex: isIconDisabled ? -1 : 0,
        onClick: handleClick,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        },
        children: icon
      }
    );
  };
  return /* @__PURE__ */ jsxs(FormControl, { className: getContainerClass(), children: [
    label && /* @__PURE__ */ jsxs("label", { htmlFor: labelFor, children: [
      label,
      " ",
      isRequired && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "impact-input-wrapper", children: [
      leftIcon && renderIconWrapper(leftIcon, "left", leftIconClick, handleLeftIconClick),
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
      rightIcon && renderIconWrapper(rightIcon, "right", rightIconClick, handleRightIconClick)
    ] }),
    isHelperText && /* @__PURE__ */ jsx(HelperText, { focusedText, helper: helperText })
  ] });
}
export {
  InputWithIcon as default
};
