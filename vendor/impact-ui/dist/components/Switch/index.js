!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".ia-styles.ia-switch-container{align-items:center;display:flex;gap:6px}.ia-styles.ia-switch-container .ia-switch-label{color:#60697d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:17.5px;text-align:left}.ia-styles.ia-switch-container .ia-switch-label.ia-switch-disabled{color:#b4bac7}.ia-styles.ia-switch{height:16px;padding:0;position:relative;width:24px}.ia-styles.ia-switch:has(.Mui-focusVisible){box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-styles.ia-switch .MuiButtonBase-root.MuiSwitch-switchBase{background-color:initial!important}.ia-styles.ia-switch .MuiSwitch-thumb{box-shadow:none;color:#c3c8d4;height:10px;left:15px;position:absolute;top:3px;width:10px}.ia-styles.ia-switch .Mui-checked{color:#4259ee!important;transform:translate(10px)}.ia-styles.ia-switch .Mui-checked .MuiSwitch-thumb{color:#4259ee;left:13px}.ia-styles.ia-switch .Mui-checked:not(.Mui-disabled)+.MuiSwitch-track{background-color:#eceefd!important;border:1px solid #b3bdf8}.ia-styles.ia-switch .MuiButtonBase-root{bottom:0;color:#b4bac7;left:-12px;margin:auto;padding:0;position:absolute;top:0;width:24px}.ia-styles.ia-switch .MuiSwitch-track{background-color:#fff;border:1px solid #c3c8d4;border-radius:8px;height:16px;opacity:1;width:24px}.ia-styles.ia-switch.ia-switch-disabled .MuiSwitch-switchBase:not(.Mui-checked) .MuiSwitch-thumb{color:#d9dde7}.ia-styles.ia-switch.ia-switch-disabled .MuiSwitch-switchBase:not(.Mui-checked)+.MuiSwitch-track{background-color:#f8f9fb!important;border-color:1px solid #d9dde7}.ia-styles.ia-switch.ia-switch-disabled .MuiSwitch-switchBase.Mui-checked.Mui-disabled .MuiSwitch-thumb{color:#b3bdf8}.ia-styles.ia-switch.ia-switch-disabled .MuiSwitch-switchBase.Mui-checked.Mui-disabled+.MuiSwitch-track{background-color:#eceefd!important}")),document.head.appendChild(i)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";

import Switch$1 from "../../node_modules/@mui/material/Switch/Switch.js";
const Switch = forwardRef(
  ({
    value = false,
    leftLabel = "",
    rightLabel = "",
    disabled = false,
    onChange,
    className = "",
    id,
    "data-testid": dataTestId,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...args
  }, ref) => {
    const switchClassName = useMemo(() => {
      let retVal = `ia-styles ia-switch ${className}`;
      if (disabled) {
        retVal += " ia-switch-disabled";
      }
      if (!value) {
        retVal += " ia-switch-off";
      }
      return retVal.trim();
    }, [disabled, value, className]);
    const labelClassName = useMemo(() => {
      let retVal = "ia-styles ia-switch-label";
      if (disabled) {
        retVal += " ia-switch-disabled";
      }
      return retVal;
    }, [disabled]);
    const leftLabelStyle = {
      color: value && !disabled ? "#1f2b4d" : void 0
    };
    const rightLabelStyle = {
      color: value && !disabled ? "#1F2B4D" : void 0
    };
    const computedAriaLabel = ariaLabel ?? (leftLabel || rightLabel ? `${leftLabel} ${rightLabel}`.trim() : void 0);
    return /* @__PURE__ */ jsxs("div", { className: "ia-styles ia-switch-container", role: "group", children: [
      leftLabel ? /* @__PURE__ */ jsx("span", { className: labelClassName, style: leftLabelStyle, children: leftLabel }) : null,
      /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsx(
        Switch$1,
        {
          ref,
          disableRipple: true,
          checked: value,
          className: switchClassName,
          disabled,
          id,
          inputProps: {
            "aria-label": computedAriaLabel,
            "aria-labelledby": ariaLabelledBy,
            "data-testid": dataTestId
          },
          onChange,
          ...args
        }
      ) }),
      rightLabel ? /* @__PURE__ */ jsx("span", { className: labelClassName, style: rightLabelStyle, children: rightLabel }) : null
    ] });
  }
);
Switch.displayName = "Switch";
export {
  Switch
};
