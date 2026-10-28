!function(){"use strict";try{if("undefined"!=typeof document){var o=document.createElement("style");o.appendChild(document.createTextNode(".impact-form-checkbox-container{align-items:center;display:flex;flex-direction:row;margin:0!important}.impact-form-checkbox-container .MuiCheckbox-root.impact-checkbox-container{background:#fff;border:1px solid #c3c8d4;border-radius:4px;height:16px;margin-right:7px;padding:4px!important;width:16px}.impact-form-checkbox-container .MuiCheckbox-root.impact-checkbox-container.Mui-focusVisible{background-color:#fff;box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-form-checkbox-container .MuiCheckbox-root.impact-checkbox-container.Mui-disabled.Mui-focusVisible,.impact-form-checkbox-container .MuiCheckbox-root.impact-checkbox-container:focus:not(.Mui-focusVisible){box-shadow:none;outline:none}.impact-form-checkbox-container .MuiCheckbox-root.impact-checkbox-container:hover{border:1px solid #4259ee}.impact-form-checkbox-container .MuiCheckbox-root.impact-checkbox-container>svg{fill:#0000;height:21px;width:21px}.impact-form-checkbox-container .MuiCheckbox-root.default-variant.Mui-checked{background:#eceefd url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/tick.svg) no-repeat;background-position:50%;background-size:10px;border:1px solid #4259ee}.impact-form-checkbox-container .MuiCheckbox-root.default-variant.Mui-checked.Mui-disabled{background:#f8f9fb url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/tick-disabled.svg) no-repeat;background-position:50%;background-size:cover;background-size:10px;border:1px solid #d9dde7}.impact-form-checkbox-container .MuiCheckbox-root.dashed-variant.Mui-checked{background:#eceefd url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/checkbox-dash.svg) no-repeat!important;background-position:50%!important;background-size:10px!important;border:1px solid #4259ee!important}.impact-form-checkbox-container .MuiCheckbox-root.dashed-variant.Mui-checked.Mui-disabled{background:#f8f9fb url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/checkbox-dash-disabled.svg) no-repeat!important;background-position:50%!important;background-size:cover!important;background-size:10px!important;border:1px solid #d9dde7!important}.impact-form-checkbox-container .MuiFormControlLabel-root{margin-left:0}.impact-form-checkbox-container .MuiCheckbox-colorPrimary.impact_checkbox_custom.Mui-checked>svg{display:none;fill:#eceefd}.impact-form-checkbox-container .MuiCheckbox-root.Mui-disabled{background-color:#f8f9fb;border:1px solid #d9dde7;pointer-events:none}.impact-form-checkbox-container .MuiCheckbox-root.MuiTypography-root{font-family:Manrope,sans-serif;font-weight:500}.impact-form-checkbox-container .MuiCheckbox-root.impact_checkbox_custom:hover,.impact-form-checkbox-container .MuiFormControlLabel-root:hover .impact_checkbox_custom{border:1px solid #4259ee!important}.impact-form-checkbox-container .MuiCheckbox-root.checkbox_custom:hover:after{background:#fff}.impact-form-checkbox-container .MuiCheckbox-root.MuiCheckbox-colorPrimary.impact_checkbox_custom.Mui-checked:after{display:none}.impact-form-checkbox-container .MuiCheckbox-root.impact_checkbox_custom.Mui-checked.Mui-disabled>svg,.impact-form-checkbox-container .MuiCheckbox-root.impact_checkbox_custom.impact_checkbox_dash.Mui-checked.Mui-disabled>svg{fill:#efefef}.impact-form-checkbox-container .MuiCheckbox-root.impact_checkbox_custom.Mui-disabled:after{background:#efefef;border:1px solid #d4d4d4}.impact-form-checkbox-container .MuiCheckbox-root.impact_checkbox_custom:hover{background-color:#fff0!important}.impact-form-checkbox-container .MuiTypography-root:hover .impact_checkbox_custom{display:none!important}.impact-form-checkbox-container .MuiFormControlLabel-asterisk{color:#da1e28}.impact-form-checkbox-container .impact-checkbox-label-with-required{align-items:flex-start;display:flex;gap:4px}.impact-form-checkbox-container .impact-checkbox-label-with-required span{color:#ec4c5c}.impact-form-checkbox-container .MuiFormControlLabel-label{align-items:center;color:#7a8294;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px}.impact-form-checkbox-container .impact-checkbox-label{color:#7a8294;display:inline-block;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.impact-form-checkbox-container .impact-checkbox-label.checked{color:#0d152c}.impact-form-checkbox-container .impact-checkbox-label.disabled{color:#b4bac7}.impact-form-checkbox-container.checked .MuiFormControlLabel-label{color:#0d152c}.MuiFormControlLabel-label.Mui-disabled{color:#b4bac7!important}.impact-form-checkbox{align-items:center;display:flex}.impact-form-checkbox .MuiCheckbox-root.impact-checkbox-container{cursor:pointer;margin-right:2px}.impact-arrow-button{color:#60697d;cursor:pointer;font-size:16px!important}.impact-arrow-button.up{transform:rotate(180deg)}.ia-styles.ia-checkbox-menu .MuiPaper-root{background:#fff;border:1px solid #f0f0f0;border-radius:12px;box-shadow:0 1px 6px #1a277c24;margin-left:7px;margin-top:4px;max-height:180px;min-width:240px;padding:0 6px}.ia-styles.ia-checkbox-menu .MuiList-root{display:flex;flex-direction:column;gap:4px}.ia-styles.ia-checkbox-menu .MuiButtonBase-root{align-items:center;border:2px solid #0000;color:#1f2b4d;display:flex;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;gap:8px;height:35px;line-height:20px;padding:0 12px}.ia-styles.ia-checkbox-menu .MuiButtonBase-root.Mui-focusVisible{background:#fff;border:2px solid #4259ee;border-radius:8px}.ia-styles.ia-checkbox-menu .MuiButtonBase-root:hover{background:#f5f6fa;border-radius:8px;color:#1f2b4d}.ia-styles.ia-checkbox-menu .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root.Mui-selected{background-color:#eceefd;border-radius:8px}")),document.head.appendChild(o)}}catch(c){console.error("vite-plugin-css-injected-by-js",c)}}();
import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import Dashed from "./Dashed.js";
import Default from "./Default.js";

const Checkbox = forwardRef(
  ({
    label,
    variant = "default",
    disabled = false,
    required = false,
    defaultChecked,
    checked,
    onChange,
    withoutFormLabel = false,
    withDropDown = false,
    dropDownData,
    onDropDownCheckBoxClick,
    ...args
  }, ref) => {
    if (variant === "dashed") {
      return /* @__PURE__ */ jsx(
        Dashed,
        {
          ...args,
          ref,
          checked,
          defaultChecked,
          isDisabled: disabled,
          isRequired: required,
          label,
          onChange
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Default,
      {
        ...args,
        ref,
        checked,
        defaultChecked,
        dropDownData,
        isDisabled: disabled,
        isRequired: required,
        label,
        withDropDown,
        withoutFormLabel,
        onChange,
        onDropDownCheckBoxClick
      }
    );
  }
);
Checkbox.displayName = "Checkbox";
export {
  Checkbox
};
