!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-styles.ia-buttonGroup{color:#505c75;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;height:32px;text-transform:none}.ia-styles.ia-buttonGroup.ia-buttonGroup-disabled{background-color:#f8f9fb;border-color:#d9dde7;color:#b4bac7}.ia-styles.ia-buttonGroupButton{background:#fff;border-radius:0;border-right:0;font-family:Manrope,sans-serif;padding:0 12px;text-transform:none}.ia-styles.ia-buttonGroupButton:first-child{border-bottom-left-radius:8px;border-top-left-radius:8px}.ia-styles.ia-buttonGroupButton:last-child{border-bottom-right-radius:8px;border-right:1px solid #c3c8d4;border-top-right-radius:8px}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-withIcon{display:flex;gap:2px}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-withIcon:hover svg,.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-withIcon:hover svg path{fill:#4259ee}.ia-styles.ia-buttonGroupButton:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-styles.ia-buttonGroupButton:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-styles.ia-buttonGroupButton.Mui-disabled:focus-visible,.ia-styles.ia-buttonGroupButton.ia-btn-disabled:focus-visible,.ia-styles.ia-buttonGroupButton.ia-switch-disabled:focus-visible,.ia-styles.ia-buttonGroupButton.impact-select-disabled:focus-visible,.ia-styles.ia-buttonGroupButton.impact_input_disabled:focus-visible,.ia-styles.ia-buttonGroupButton.route-disabled:focus-visible,.ia-styles.ia-buttonGroupButton:disabled:focus-visible,.ia-styles.ia-buttonGroupButton[aria-disabled=true]:focus-visible{box-shadow:none;outline:none}.ia-styles.ia-buttonGroupButton:focus-visible{z-index:3}.ia-styles.ia-buttonGroupButton.Mui-focusVisible{background-color:#fff}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected.Mui-focusVisible{background-color:#eceefd}.ia-styles.ia-buttonGroupButton:hover{background:#fff;color:#4259ee}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-disabled{background:#f8f9fb;border-color:#d9dde7;color:#b4bac7}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-disabled:last-child{border-right:1px solid #d9dde7}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected{background:#eceefd;border:1px solid #4259ee;color:#4259ee;margin-left:-1px;position:relative;z-index:1}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected:first-child{margin-left:0}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected svg,.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected svg path{fill:#4259ee}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected+.ia-buttonGroupButton{border-left:#0000!important}.ia-buttonGroupButton-selected.ia-buttonGroupButton,.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected:last-child{border-right-color:#4259ee!important}.ia-buttonGroup-disabled .ia-buttonGroupButton-selected{background:#f8f9fb!important;border-color:#d9dde7!important;color:#b4bac7!important}.ia-styles.ia-buttonGroupButton{border:1px solid #c3c8d4;margin-left:-1px;position:relative;z-index:1}.ia-styles.ia-buttonGroupButton:first-child{margin-left:0}.ia-styles.ia-buttonGroupButton.ia-buttonGroupButton-selected{z-index:2}')),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";

import ToggleButtonGroup from "../../node_modules/@mui/material/ToggleButtonGroup/ToggleButtonGroup.js";
import ToggleButton$1 from "../../node_modules/@mui/material/ToggleButton/ToggleButton.js";
function ToggleButton({ selfProps, parentProps }) {
  const { icon, label, ...restSelf } = selfProps;
  const { selectedOption, isDisabled } = parentProps;
  const buttonClassName = useMemo(() => {
    let retVal = "ia-styles ia-buttonGroupButton";
    if (restSelf.disabled || isDisabled) {
      retVal += " ia-buttonGroupButton-disabled";
    }
    if (selfProps.value === selectedOption) {
      retVal += " ia-buttonGroupButton-selected";
    }
    if (icon) {
      retVal += " ia-buttonGroupButton-withIcon";
    }
    return retVal;
  }, [restSelf.disabled, isDisabled, selfProps.value, selectedOption, icon]);
  return /* @__PURE__ */ jsxs(ToggleButton$1, { disableRipple: true, className: buttonClassName, ...restSelf, children: [
    icon,
    label
  ] });
}
function ButtonGroup({
  options,
  selectedOption,
  isDisabled = false,
  onChange,
  className = "",
  id,
  "data-testid": dataTestId,
  ...args
}) {
  const groupClassName = useMemo(() => {
    let retVal = "ia-styles ia-buttonGroup";
    if (isDisabled) {
      retVal += " ia-buttonGroup-disabled";
    }
    return `${retVal} ${className}`.trim();
  }, [isDisabled, className]);
  return /* @__PURE__ */ jsx(
    ToggleButtonGroup,
    {
      ...args,
      className: groupClassName,
      "data-testid": dataTestId,
      id,
      orientation: "horizontal",
      value: selectedOption,
      children: options.map((opt) => /* @__PURE__ */ jsx(
        ToggleButton,
        {
          parentProps: { isDisabled, selectedOption },
          selfProps: {
            ...opt,
            onClick: onChange ? (event) => {
              onChange(event, opt.value);
            } : void 0
          }
        },
        opt.value
      ))
    }
  );
}
ButtonGroup.displayName = "ButtonGroup";
export {
  ButtonGroup
};
