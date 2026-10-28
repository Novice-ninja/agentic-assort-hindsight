!function(){"use strict";try{if("undefined"!=typeof document){var o=document.createElement("style");o.appendChild(document.createTextNode(".ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root{padding:3px 8px;padding-left:0!important}.ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root.Mui-focusVisible{outline:none}.ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root.Mui-focusVisible .MuiSvgIcon-root:first-of-type{border-radius:50%;outline:2px solid var(--ia-focus-color,#4259ee);outline-offset:2px}.ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root.Mui-disabled.Mui-focusVisible,.ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root.Mui-disabled.Mui-focusVisible .MuiSvgIcon-root,.ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root:focus:not(.Mui-focusVisible),.ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root:focus:not(.Mui-focusVisible) .MuiSvgIcon-root{outline:none}.MuiFormGroup-root.orientation-row{flex-direction:row;gap:8px}.MuiFormGroup-root.orientation-row .ia-radioButton:first-child{margin-left:0!important}.MuiFormGroup-root.orientation-row .ia-radioButton:last-child{margin-right:0!important}.MuiFormGroup-root.orientation-column{flex-direction:column;gap:8px}.MuiFormGroup-root.orientation-column .ia-radioButton{margin:0!important}.ia-radioButton .MuiSvgIcon-root{border:1px solid #c3c8d4;border-radius:50%;height:16px;width:16px}.ia-radioButton path{display:none}.ia-radioButton:hover .MuiSvgIcon-root{border:1px solid #4259ee}.ia-radioButton-disabled .MuiSvgIcon-root{background:#f5f6fa;border:1px solid #d9dde7!important}.ia-radioButton.ia-radioButton-disabled .MuiSvgIcon-root:nth-child(2){background:#b3bdf8!important;border:none;border:1px solid #b3bdf8!important;border-radius:50%;bottom:0;height:10px;left:0;margin:auto;padding:0;position:absolute;right:0;top:0;width:10px}.ia-radioButton .MuiSvgIcon-root:nth-child(2){background:#4259ee;border:none;border-radius:50%;bottom:0;height:10px;left:0;margin:auto;padding:0;position:absolute;right:0;top:0;width:10px}.ia-radioButton .Mui-checked .MuiSvgIcon-root{background:#0000;border:1px solid #4259ee;border-radius:50%;height:16px;width:16px}.ia-radioButton .Mui-checked .MuiSvgIcon-root path{display:none}.ia-radioButton .Mui-checked .MuiSvgIcon-root:nth-child(2){background:#4259ee;border:none;border-radius:50%;bottom:0;height:10px;left:0;margin:auto;padding:0;position:absolute;right:0;top:0;width:10px}.ia-radioButton .MuiTypography-root{color:#5f6673;font-family:Manrope,sans-serif;font-size:14px;font-weight:500}.ia-radioButton .MuiRadio-root.Mui-checked+.MuiTypography-root{color:#1f2b4d}.ia-radioGroup-wrapper{display:flex;flex-direction:column;gap:16px}.ia-radioGroup-label{color:#31416e;font-size:12px;font-weight:700;line-height:20px;text-transform:capitalize}")),document.head.appendChild(o)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";

import RadioGroup from "../../node_modules/@mui/material/RadioGroup/RadioGroup.js";
import FormControlLabel from "../../node_modules/@mui/material/FormControlLabel/FormControlLabel.js";
import Radio from "../../node_modules/@mui/material/Radio/Radio.js";
function RadioButton({
  selfProps: { icon, label, ...selfProps },
  id,
  parentProps
}) {
  const radioButtonClassName = useMemo(() => {
    let retVal = "ia-styles ia-radioButton";
    if (selfProps.disabled ?? parentProps.isDisabled) retVal += " ia-radioButton-disabled";
    if (selfProps.value === parentProps.selectedOption) retVal += " ia-radioButton-selected";
    return retVal;
  }, [selfProps.disabled, selfProps.value, parentProps.isDisabled, parentProps.selectedOption]);
  const { value, disabled: _optDisabled, ...restSelf } = selfProps;
  const labelContent = icon != null ? /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    icon,
    label
  ] }) : label;
  const isDisabled = selfProps.disabled ?? parentProps.isDisabled ?? parentProps.disabled ?? false;
  return /* @__PURE__ */ jsx(
    FormControlLabel,
    {
      className: radioButtonClassName,
      control: /* @__PURE__ */ jsx(Radio, { disableRipple: true }),
      disabled: isDisabled,
      id: `${id}--${value}`,
      label: labelContent,
      value,
      ...restSelf
    }
  );
}
function RadioButtonGroup({
  options,
  isDisabled,
  disabled,
  selectedOption,
  value,
  onChange,
  name,
  orientation = "column",
  label,
  className = "",
  id,
  "data-testid": dataTestId,
  ...args
}) {
  const resolvedValue = value ?? selectedOption ?? "";
  const groupDisabled = isDisabled ?? disabled ?? false;
  const orientationClass = orientation === "row" ? "orientation-row" : "orientation-column";
  return /* @__PURE__ */ jsxs("div", { className: "ia-styles ia-radioGroup-wrapper", children: [
    label && /* @__PURE__ */ jsx("p", { className: "ia-radioGroup-label", children: label }),
    /* @__PURE__ */ jsx(
      RadioGroup,
      {
        "aria-labelledby": name,
        className: `ia-styles ia-radioGroup ${orientationClass} ${className}`.trim(),
        "data-testid": dataTestId,
        id,
        name,
        value: resolvedValue,
        onChange,
        ...args,
        children: options.map((opt) => /* @__PURE__ */ jsx(
          RadioButton,
          {
            id,
            parentProps: {
              ...args,
              isDisabled: groupDisabled,
              disabled: groupDisabled,
              selectedOption: resolvedValue
            },
            selfProps: opt
          },
          opt.value
        ))
      }
    )
  ] });
}
RadioButtonGroup.displayName = "RadioButtonGroup";
export {
  RadioButtonGroup
};
