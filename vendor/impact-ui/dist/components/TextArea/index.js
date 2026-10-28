!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact_textarea_label{color:#60697d;font-size:12px;padding-bottom:6px}.impact_textarea{margin-top:6px}.impact_textarea textarea{border:1px solid #d9dde7;border-radius:8px;min-height:100px;min-width:240px;padding:12px;position:relative;resize:none}.impact_textarea textarea:focus,.impact_textarea textarea:hover{border:1px solid #4259ee;outline:none}.impact_textarea_btm_container{display:flex;justify-content:space-between;margin-top:6px}.impact_textarea_btm_container .left_secondary_label_container,.impact_textarea_btm_container .right_numeric_container{color:#5f6673;font-size:10px}.impact_textarea_disabled .impact_textarea_label{color:#b4bac7}.impact_textarea_disabled textarea{background:#f8f9fb;color:#d9dde7;pointer-events:none}.impact_textarea_disabled .impact_textarea_btm_container .left_secondary_label_container{color:#b4bac7;text-align:start}.impact_textarea_disabled .impact_textarea_btm_container .right_numeric_container{color:#b4bac7}.impact_textarea_error textarea{color:#ab3939}textarea{font-family:Manrope,sans-serif!important}.impact_textarea_disabled textarea::-webkit-input-placeholder,textarea::-webkit-input-placeholder{color:#b4bac7}.impact_textarea_error .left_secondary_label_container,.impact_textarea_error .right_numeric_container{color:#ab3939}.impact_textarea_error textarea,.impact_textarea_error textarea:focus,.impact_textarea_error textarea:hover{border:1px solid #ec4c5c}.impact_textarea_error textarea{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/material-symbols_error.svg) no-repeat;background-position:top 12px right 12px;background-size:16px;padding-right:34px}.impact_textarea_success textarea{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/success-icon.svg) no-repeat;background-position:top 12px right 12px;background-size:16px;padding-right:34px}.impact_textarea_success textarea,.impact_textarea_success textarea:focus,.impact_textarea_success textarea:hover{border:1px solid #108431}.impact_textarea_success .left_secondary_label_container,.impact_textarea_success .right_numeric_container{color:#26734b}.impact_textarea_warning textarea{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/warning-fill.svg) no-repeat;background-position:top 12px right 12px;background-size:16px;border:1px solid #ffe174;padding-right:34px}.impact_textarea_warning textarea:focus,.impact_textarea_warning textarea:hover{border:1px solid #ffe174}.impact_textarea_warning .left_secondary_label_container,.impact_textarea_warning .right_numeric_container{color:#9d831c}.impact_textarea textarea::placeholder{color:#b4bac7;font-weight:400;transition:font-weight .2s ease}.impact_textarea_disabled textarea::placeholder{color:#b4bac7}.impact_textarea textarea:focus::placeholder{color:#0000}')),document.head.appendChild(e)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";

import { useTranslation } from "../../i18n/useTranslation.js";
import FormControl from "../../node_modules/@mui/material/FormControl/FormControl.js";
import { TextareaAutosize } from "../../node_modules/@mui/base/TextareaAutosize/TextareaAutosize.js";
function TextArea({
  label,
  maxRows = 5,
  placeholder,
  defaultValue,
  value,
  onChange,
  secondaryLabel,
  isDisabled,
  isRequired,
  characterLimit,
  isError = false,
  isSuccess = false,
  isWarning = false,
  width = "240px",
  height = "100px",
  className,
  id,
  "data-testid": dataTestId,
  onBlur,
  onFocus,
  ...restProps
}) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const currentValue = value ?? defaultValue ?? "";
  const displayValue = typeof value === "string" ? value : void 0;
  const displayDefaultValue = typeof value !== "string" ? defaultValue : void 0;
  const containerClass = [
    "impact_textarea_container",
    isDisabled && "impact_textarea_disabled",
    isError && "impact_textarea_error",
    isSuccess && "impact_textarea_success",
    isWarning && "impact_textarea_warning"
  ].filter(Boolean).join(" ");
  const textareaStyle = {
    minWidth: width,
    minHeight: height,
    width,
    height
  };
  const showBottomRow = Boolean(secondaryLabel ?? characterLimit);
  const renderTextarea = () => /* @__PURE__ */ jsx(
    TextareaAutosize,
    {
      "aria-label": label ?? t("textArea.defaultAriaLabel"),
      "data-testid": dataTestId,
      defaultValue: displayDefaultValue,
      disabled: isDisabled,
      id,
      maxRows,
      placeholder: isFocused ? "" : placeholder,
      style: textareaStyle,
      value: displayValue,
      onChange,
      ...restProps,
      onBlur: (e) => {
        setIsFocused(false);
        onBlur == null ? void 0 : onBlur(e);
      },
      onFocus: (e) => {
        setIsFocused(true);
        onFocus == null ? void 0 : onFocus(e);
      }
    }
  );
  if (!showBottomRow) {
    return /* @__PURE__ */ jsx(FormControl, { className: `impact_textarea_layout ${className ?? ""}`.trim(), children: /* @__PURE__ */ jsxs("div", { className: containerClass, children: [
      /* @__PURE__ */ jsxs("label", { className: "impact_textarea_label", children: [
        label,
        " ",
        isRequired && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "impact_textarea", children: renderTextarea() })
    ] }) });
  }
  const currentLength = String(currentValue).length;
  return /* @__PURE__ */ jsx(FormControl, { className: `impact_textarea_layout ${className ?? ""}`.trim(), children: /* @__PURE__ */ jsxs("div", { className: containerClass, children: [
    /* @__PURE__ */ jsxs("label", { className: "impact_textarea_label", children: [
      label,
      " ",
      isRequired && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "impact_textarea", children: renderTextarea() }),
    /* @__PURE__ */ jsxs("div", { className: "impact_textarea_btm_container", children: [
      /* @__PURE__ */ jsx("div", { className: "left_secondary_label_container", children: secondaryLabel ?? "" }),
      characterLimit != null && /* @__PURE__ */ jsxs("div", { className: "right_numeric_container", children: [
        currentLength,
        "/",
        characterLimit
      ] })
    ] })
  ] }) });
}
TextArea.displayName = "TextArea";
export {
  TextArea
};
