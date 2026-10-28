!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact_inputbox_container label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:18px;margin-bottom:6px}.impact_inputbox_container fieldset{border:none!important}.impact_inputbox_container .MuiInputBase-root input.MuiInputBase-input{box-sizing:border-box;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;height:32px;min-width:240px;padding:0 12px;width:100%}.impact_inputbox_container .MuiInputBase-root{background:#fff;border:1px solid #c3c8d4;border-radius:8px;height:32px;padding:0;width:100%}.impact_inputbox_container .MuiInputBase-root:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact_inputbox_container .MuiInputBase-root:focus:not(:focus-visible){box-shadow:none;outline:none}.impact_inputbox_container.small .MuiInputBase-root{height:24px}.impact_inputbox_container.medium .MuiInputBase-root{height:28px}.impact_inputbox_container.small .MuiInputBase-root input.MuiInputBase-input{height:24px}.impact_inputbox_container.medium .MuiInputBase-root input.MuiInputBase-input{height:28px}.impact_inputbox_container .MuiInputBase-root:hover{border:1px solid #4259ee}.impact_inputbox_container.impact_input_disabled .MuiInputBase-root{background:#f2f4fb;border:1px solid #d9dde7}.impact_inputbox_container.impact_input_disabled .MuiInputBase-root:hover{border:1px solid #d9dde7!important;pointer-events:none!important}.impact_inputbox_container .MuiFormHelperText-root{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/info-icon.svg) no-repeat;background-position:0 1px;background-size:10px;color:#5f6673;font-size:10px;line-height:10px;margin-left:0;margin-top:6px;padding-left:15px}.impact_inputbox_container.impact_input_error .MuiFormHelperText-root{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/info-red.svg) no-repeat}.impact_inputbox_container.impact_input_error .MuiInputBase-root{border:1px solid #ec4c5c}.impact_inputbox_container.impact_input_error .MuiInputBase-root .MuiInputBase-input{color:#ec4c5c}.impact_inputbox_container.impact_input_error .MuiInputBase-root.Mui-focused{border:1px solid #ec4c5c!important;box-shadow:none}.impact_inputbox_container.impact_input_error .MuiFormHelperText-root{color:#ec4c5c!important}.impact_inputbox_container .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline{border-color:#4259ee}.impact_inputbox_container .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline{border-width:1px}.impact_inputbox_container .MuiInputBase-root.Mui-focused{border:1px solid #4259ee!important;box-shadow:none}.impact_inputbox_container_with_icons label{color:#60697d;font-size:12px;font-weight:500;line-height:18px;margin-bottom:6px}.impact_inputbox_container_with_icons .impact-input-wrapper{align-items:center;background-color:#fff;border:1px solid #c3c8d4;border-radius:8px;box-sizing:border-box;color:#1f2b4d;display:flex;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;gap:4px;height:32px;min-width:240px;padding:0 12px;width:100%}.impact_inputbox_container_with_icons .impact-input-wrapper .MuiInputBase-root{border:none;border-radius:8px;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;height:32px;padding:0;width:100%}.impact_inputbox_container_with_icons .impact-input-wrapper svg{color:#60697d;height:16px;width:16px}.impact_inputbox_container_with_icons .impact-input-wrapper:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact_inputbox_container_with_icons .impact-input-wrapper:focus:not(:focus-visible){box-shadow:none;outline:none}.impact_inputbox_container_with_icons .impact-input-wrapper:hover{border:1px solid #4259ee}.impact_inputbox_container_with_icons .impact-input-wrapper .MuiInputBase-root:hover{border:none}.impact_inputbox_container_with_icons .impact-input-wrapper .MuiInputBase-root input.MuiInputBase-input{border:none;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;height:inherit;line-height:20px;padding:0!important}.impact_inputbox_container_with_icons .impact-input-wrapper .MuiInputBase-root input.MuiInputBase-input:hover,.impact_inputbox_container_with_icons .impact-input-wrapper .MuiOutlinedInput-notchedOutline{border:none}.impact_inputbox_container_with_icons .impact-input-wrapper .left-input-icon,.impact_inputbox_container_with_icons .impact-input-wrapper .right-input-icon{align-self:center;cursor:pointer;display:flex;justify-self:center}.impact_inputbox_container_with_icons.small .impact-input-wrapper,.impact_inputbox_container_with_icons.small .impact-input-wrapper .MuiInputBase-root{height:24px}.impact_inputbox_container_with_icons.medium .impact-input-wrapper,.impact_inputbox_container_with_icons.medium .impact-input-wrapper .MuiInputBase-root{height:28px}.MuiFormHelperText-root{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/info-icon.svg) no-repeat;background-position:0;color:#7a8294!important;font-family:Manrope,sans-serif!important;margin-left:0!important;padding-left:14px}.input-with-error .impact-input-wrapper{border:1px solid #e15554!important;color:#e15554}.input-with-error .impact-input-wrapper svg{color:#ec4c5c;height:16px;width:16px}.input-with-error .MuiFormHelperText-root,.input-with-error .impact-input-wrapper input.MuiInputBase-input{color:#ec4c5c}.input-with-error .MuiFormHelperText-root{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/info-red.svg) no-repeat;background-position:0;color:#e15554!important}.input-with-disabled .impact-input-wrapper{background:#f8f9fb;border:1px solid #d9dde7;pointer-events:none!important}.input-with-disabled .impact-input-wrapper:hover{border:1px solid #d9dde7}.input-with-disabled .MuiFormHelperText-root{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/info-disabled.svg) no-repeat;background-position:0;color:#b4bac7!important}.icon-click-on-disabled .impact-input-wrapper,.icon-click-on-disabled .impact-input-wrapper .left-input-icon,.icon-click-on-disabled .impact-input-wrapper .right-input-icon{pointer-events:auto!important}.MuiOutlinedInput-root input::placeholder{color:#b4bac7;font-weight:500}.MuiOutlinedInput-root.Mui-focused input::placeholder{color:#1f2b4d;font-weight:500;opacity:1}.impact_input_error .MuiOutlinedInput-root input::placeholder{color:#ec4c5c!important}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:auto;margin:0}input[type=number]{-moz-appearance:textfield}.MuiOutlinedInput-root input:focus::placeholder,input:focus::placeholder{color:#0000}.input-with-disabled:not(.icon-click-on-disabled) .left-input-icon,.input-with-disabled:not(.icon-click-on-disabled) .right-input-icon{cursor:not-allowed;opacity:.5;pointer-events:none}')),document.head.appendChild(i)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import InputWithIcon from "./InputWithIcon.js";
import VanillaInput from "./VanillaInput.js";

const Input = forwardRef(
  ({
    label,
    isRequired = false,
    leftIcon,
    rightIcon,
    leftIconClick,
    rightIconClick,
    helperText,
    isHelperText = false,
    focusedText,
    autoComplete,
    isError = false,
    isDisabled = false,
    htmlFor,
    iconClickOnDisabled = false,
    size = "large",
    ...args
  }, ref) => {
    if (leftIcon ?? rightIcon) {
      return /* @__PURE__ */ jsx(
        InputWithIcon,
        {
          ...args,
          autoComplete,
          focusedText,
          helperText,
          htmlFor,
          iconClickOnDisabled,
          inputRef: ref,
          isDisabled,
          isError,
          isHelperText,
          isRequired,
          label,
          leftIcon,
          leftIconClick,
          rightIcon,
          rightIconClick,
          size
        }
      );
    }
    return /* @__PURE__ */ jsx(
      VanillaInput,
      {
        ...args,
        autoComplete,
        focusedText,
        helperText,
        htmlFor,
        inputRef: ref,
        isDisabled,
        isError,
        isHelperText,
        isRequired,
        label,
        size
      }
    );
  }
);
Input.displayName = "Input";
export {
  Input
};
