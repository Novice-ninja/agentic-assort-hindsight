!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-styles.ia-btn{background-color:#4259ee;border-radius:8px;border-style:solid;border-width:1px;color:#fff;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;gap:6px;height:32px;min-width:0;padding:6px 12px;text-transform:none}.ia-styles.ia-btn svg{color:inherit!important;height:16px;margin:0;padding:0;width:16px}.ia-styles.ia-btn svg path{fill:inherit!important}.ia-styles.ia-btn.ia-btn-with-icon{align-items:center;display:flex;gap:4px}.ia-styles.ia-btn.ia-btn-with-icon svg{color:inherit!important}.ia-styles.ia-btn.ia-btn-with-icon svg path{fill:inherit!important}.ia-styles.ia-btn.ia-btn-with-icon .ia-btn-loading-icon{align-items:center;animation:rotate 1s linear infinite;border-radius:50%;display:flex;height:16px;justify-content:center;margin-right:4px;width:16px}.ia-styles.ia-btn.ia-btn-only-icon{aspect-ratio:1/1}.ia-styles.ia-btn.ia-btn-large{height:32px}.ia-styles.ia-btn.ia-btn-medium{height:28px;padding:4px 12px}.ia-styles.ia-btn.ia-btn-small{height:24px;padding:2px 12px}.ia-styles.ia-btn.ia-btn-contained{border-width:0}.ia-styles.ia-btn.ia-btn-contained:hover{background-color:#29399f;color:#fff}.ia-styles.ia-btn.ia-btn-contained.ia-btn-disabled{background-color:#c3c8d4;border-width:0;color:#fff}.ia-styles.ia-btn.ia-btn-contained svg{color:#fff!important}.ia-styles.ia-btn.ia-btn-contained svg path{fill:#fff!important}.ia-styles.ia-btn.ia-btn-contained.ia-btn-destructive{background-color:#e15554;border-color:#c3c8d4;color:#fff}.ia-styles.ia-btn.ia-btn-contained.ia-btn-destructive:hover{background-color:#ab3939;border-color:#fceeee}.ia-styles.ia-btn.ia-btn-contained.ia-btn-destructive.ia-btn-disabled{background-color:#c3c8d4;border-width:0;color:#fff}.ia-styles.ia-btn.ia-btn-contained.ia-btn-destructive.ia-btn-disabled svg{color:#fff!important}.ia-styles.ia-btn.ia-btn-contained.ia-btn-destructive.ia-btn-disabled svg path{fill:#fff!important}.ia-styles.ia-btn.ia-btn-outlined{background-color:#fff;border-color:#4259ee;color:#4259ee}.ia-styles.ia-btn.ia-btn-outlined:hover{background-color:#eceefd;border-color:#3649c6;border-width:1px;color:#3649c6}.ia-styles.ia-btn.ia-btn-outlined:hover svg{color:#3649c6!important}.ia-styles.ia-btn.ia-btn-outlined:hover svg path{fill:#3649c6!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-disabled{background-color:#f8f9fb;border-color:#d9dde7;color:#b4bac7}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-disabled svg{color:#b4bac7!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-disabled svg path{fill:#b4bac7!important}.ia-styles.ia-btn.ia-btn-outlined svg{color:#3649c6!important}.ia-styles.ia-btn.ia-btn-outlined svg path{fill:#3649c6!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive{background-color:#fff;border-color:#c3c8d4;color:#1f2b4d}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive:hover{background-color:#fceeee;border-color:#e15554;color:#e15554}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive:hover svg{color:#e15554!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive:hover svg path{fill:#e15554!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive svg{color:#1f2b4d!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive svg path{fill:#1f2b4d!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive.ia-btn-disabled{background-color:#f8f9fb;border-color:#d9dde7;color:#b4bac7}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive.ia-btn-disabled svg{color:#b4bac7!important}.ia-styles.ia-btn.ia-btn-outlined.ia-btn-destructive.ia-btn-disabled svg path{fill:#b4bac7!important}.ia-styles.ia-btn.ia-btn-text{background-color:#f5f6fa;border-width:0;color:#60697d}.ia-styles.ia-btn.ia-btn-text:hover{background-color:#eceefd;border-width:0;color:#3649c6}.ia-styles.ia-btn.ia-btn-text:hover svg{color:#3649c6!important}.ia-styles.ia-btn.ia-btn-text:hover svg path{fill:#3649c6!important}.ia-styles.ia-btn.ia-btn-text.ia-btn-disabled{background-color:#f8f9fb;border-width:0;color:#b4bac7}.ia-styles.ia-btn.ia-btn-text.ia-btn-disabled svg{color:#b4bac7!important}.ia-styles.ia-btn.ia-btn-text.ia-btn-disabled svg path{fill:#b4bac7!important}.ia-styles.ia-btn.ia-btn-text svg{color:#60697d!important}.ia-styles.ia-btn.ia-btn-text svg path{fill:#60697d!important}.ia-styles.ia-btn.ia-btn-link{background-color:initial;border:none;color:#4259ee;padding:0}.ia-styles.ia-btn.ia-btn-link:hover{background-color:initial;text-decoration:underline}.ia-styles.ia-btn.ia-btn-link.ia-btn-disabled{background-color:initial;border:none;color:#b4bac7}.ia-styles.ia-btn.ia-btn-link.ia-btn-disabled svg{color:#b4bac7!important}.ia-styles.ia-btn.ia-btn-link.ia-btn-disabled svg path{fill:#b4bac7!important}.ia-styles.ia-btn.ia-btn-link svg{color:#4259ee!important}.ia-styles.ia-btn.ia-btn-link svg path{fill:#4259ee!important}.ia-styles.ia-btn.ia-btn-tertiary{background-color:#fff;border-color:#c3c8d4;color:#1f2b4d}.ia-styles.ia-btn.ia-btn-tertiary:hover{background-color:#eceefd;border-color:#3649c6;border-width:1px;color:#3649c6}.ia-styles.ia-btn.ia-btn-tertiary:hover svg{color:#3649c6!important}.ia-styles.ia-btn.ia-btn-tertiary:hover svg path{fill:#3649c6!important}.ia-styles.ia-btn.ia-btn-tertiary.ia-btn-disabled{background-color:#f8f9fb;border-color:#d9dde7;color:#b4bac7}.ia-styles.ia-btn.ia-btn-tertiary.ia-btn-disabled svg{color:#b4bac7!important}.ia-styles.ia-btn.ia-btn-tertiary.ia-btn-disabled svg path{fill:#b4bac7!important}.ia-styles.ia-btn.ia-btn-tertiary svg{color:#1f2b4d!important}.ia-styles.ia-btn.ia-btn-tertiary svg path{fill:#1f2b4d!important}.ia-styles.ia-btn:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-styles.ia-btn:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-styles.ia-btn.Mui-disabled:focus-visible,.ia-styles.ia-btn.ia-btn-disabled:focus-visible,.ia-styles.ia-btn.ia-switch-disabled:focus-visible,.ia-styles.ia-btn.impact-select-disabled:focus-visible,.ia-styles.ia-btn.impact_input_disabled:focus-visible,.ia-styles.ia-btn.route-disabled:focus-visible,.ia-styles.ia-btn:disabled:focus-visible,.ia-styles.ia-btn[aria-disabled=true]:focus-visible{box-shadow:none;outline:none}.ia-btn-loading-icon{display:flex}@keyframes loader{0%{transform:rotate(45deg)}to{transform:rotate(405deg)}}.ia-btn-loading-icon .ia-btn-loading-track{animation-delay:0s;animation-duration:1s;animation-iteration-count:infinite;animation-name:loader;animation-timing-function:linear;border-radius:50%;border-style:solid;border-width:2px;box-sizing:border-box;display:inline-block;height:14px;position:relative;width:14px}.ia-btn-loading-icon .ia-btn-loading-track.ia-btn-loading-light{border-color:#5f6673 #7a829440 #7a829440}.ia-btn-loading-icon .ia-btn-loading-track.ia-btn-loading-dark{border-color:#fff #edeefd40 #edeefd40}.ia-btn-icon{height:16px;margin-bottom:3px;width:16px}.ia-btn-icon-loading{height:14px;margin-bottom:0}')),document.head.appendChild(i)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";

import { useTranslation } from "../../i18n/useTranslation.js";
import Button$1 from "../../node_modules/@mui/material/Button/Button.js";
const Button = forwardRef(
  ({
    children,
    size = "large",
    variant = "contained",
    loading = false,
    icon,
    iconPlacement = "left",
    disabled,
    className = "",
    type = "default",
    htmlType = "button",
    "aria-label": ariaLabel,
    ...args
  }, ref) => {
    const { t } = useTranslation();
    const convertedVariant = useMemo(() => {
      switch (variant) {
        case "secondary":
        case "outlined":
          return "outlined";
        case "tertiary":
          return "tertiary";
        case "text":
          return "text";
        case "url":
          return "link";
        case "primary":
        case "contained":
        default:
          return "contained";
      }
    }, [variant]);
    const classStr = useMemo(() => {
      let retVal = `ia-styles ia-btn ${type === "destructive" ? "ia-btn-destructive" : ""} ${className}`;
      switch (convertedVariant) {
        case "outlined":
          retVal += " ia-btn-outlined";
          break;
        case "link":
          retVal += " ia-btn-link";
          break;
        case "text":
          retVal += " ia-btn-text";
          break;
        case "tertiary":
          retVal += " ia-btn-tertiary";
          break;
        case "contained":
        default:
          retVal += " ia-btn-contained";
          break;
      }
      switch (size) {
        case "small":
          retVal += " ia-btn-small";
          break;
        case "medium":
          retVal += " ia-btn-medium";
          break;
        case "large":
        default:
          retVal += " ia-btn-large";
          break;
      }
      if (disabled) {
        retVal += " ia-btn-disabled";
      }
      if (icon) {
        if (children) {
          retVal += " ia-btn-with-icon";
        } else {
          retVal += " ia-btn-only-icon";
        }
      }
      return retVal;
    }, [children, convertedVariant, size, disabled, icon, type, className]);
    const finalLabel = useMemo(() => {
      if (variant === "url" && !disabled && loading && children) {
        return t("common.loading");
      }
      return children;
    }, [variant, disabled, loading, children, t]);
    const finalIcon = useMemo(() => {
      if (!icon && !loading) {
        return null;
      }
      return /* @__PURE__ */ jsx("div", { className: `ia-btn-icon ${loading ? "ia-btn-icon-loading" : ""}`, children: loading && (convertedVariant !== "link" || !children) ? /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "ia-btn-loading-icon", children: /* @__PURE__ */ jsx(
        "span",
        {
          className: `ia-btn-loading-track ia-btn-loading-${convertedVariant === "contained" ? "dark" : "light"}`
        }
      ) }) : icon });
    }, [icon, loading, convertedVariant, children]);
    const buttonProps = {
      ref,
      className: classStr,
      disabled,
      ...args
    };
    if (iconPlacement === "right") {
      return /* @__PURE__ */ jsxs(
        Button$1,
        {
          ...buttonProps,
          disableElevation: true,
          disableRipple: true,
          "aria-label": ariaLabel,
          disabled,
          type: htmlType,
          children: [
            finalLabel,
            finalIcon
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs(
      Button$1,
      {
        ...buttonProps,
        disableElevation: true,
        disableRipple: true,
        "aria-label": ariaLabel,
        disabled,
        type: htmlType,
        children: [
          finalIcon,
          finalLabel
        ]
      }
    );
  }
);
Button.displayName = "Button";
export {
  Button
};
