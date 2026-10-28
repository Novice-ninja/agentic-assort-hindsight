!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.popover-container{border-radius:12px!important;box-shadow:0 0 4px #0000001f;margin-top:2px;min-width:240px;padding:12px}.popover-container .popover-content{display:flex;flex-direction:column;gap:12px}.popover-container .popover-content .popover-header{align-items:center;display:flex;justify-content:space-between}.popover-container .popover-content .popover-header .popover-header-title{color:#0d152c;font-size:14px;font-weight:800;line-height:21px}.popover-container .popover-content .popover-header .popover-close-icon:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.popover-container .popover-content .popover-header .popover-close-icon:focus:not(:focus-visible){box-shadow:none;outline:none}.popover-container .popover-content .popover-body{height:calc(100% - 40px);overflow-y:auto;width:100%}.popover-container .popover-content .popover-footer .popover-footer-content{display:flex;flex-direction:column;gap:8px}.popover-container .popover-content .popover-footer .popover-footer-content .divider-line{background:#d9dde7;height:1px;width:100%}.popover-container .popover-content .popover-footer .popover-footer-content .popover-footer-buttons{display:flex;gap:12px;justify-content:flex-end}')),document.head.appendChild(e)}}catch(o){console.error("vite-plugin-css-injected-by-js",o)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import default_1 from "../../node_modules/@mui/icons-material/Close.js";
import { Button } from "../Button/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Popover$1 from "../../node_modules/@mui/material/Popover/Popover.js";
function Popover({
  children,
  title,
  onClose,
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonProps,
  secondaryButtonProps,
  slotProps,
  "data-testid": dataTestId,
  ...props
}) {
  var _a;
  const { t } = useTranslation();
  const mergedSlotProps = {
    ...slotProps,
    paper: {
      ...slotProps == null ? void 0 : slotProps.paper,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      className: ["popover-container", (_a = slotProps == null ? void 0 : slotProps.paper) == null ? void 0 : _a.className].filter(Boolean).join(" ")
    }
  };
  return /* @__PURE__ */ jsx(Popover$1, { ...props, slotProps: mergedSlotProps, onClose, children: /* @__PURE__ */ jsxs("div", { className: "popover-content", "data-testid": dataTestId, children: [
    /* @__PURE__ */ jsxs("div", { className: "popover-header", children: [
      /* @__PURE__ */ jsx("span", { className: "popover-header-title", children: title }),
      onClose != null && /* @__PURE__ */ jsx(
        default_1,
        {
          "aria-label": t("common.close"),
          className: "popover-close-icon",
          "data-testid": "popover-close-icon",
          fontSize: "small",
          role: "button",
          sx: { color: "#60697D", cursor: "pointer" },
          tabIndex: 0,
          onClick: (event) => {
            onClose(event, "backdropClick");
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClose(e, "backdropClick");
            }
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "popover-body", children }),
    /* @__PURE__ */ jsx("div", { className: "popover-footer", children: /* @__PURE__ */ jsxs("div", { className: "popover-footer-content", children: [
      primaryButtonLabel != null || secondaryButtonLabel != null ? /* @__PURE__ */ jsx("div", { className: "divider-line" }) : null,
      /* @__PURE__ */ jsxs("div", { className: "popover-footer-buttons", children: [
        secondaryButtonLabel != null && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "tertiary",
            onClick: onSecondaryButtonClick,
            ...secondaryButtonProps,
            children: secondaryButtonLabel
          }
        ),
        primaryButtonLabel != null && /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: onPrimaryButtonClick, ...primaryButtonProps, children: primaryButtonLabel })
      ] })
    ] }) })
  ] }) });
}
Popover.displayName = "Popover";
export {
  Popover
};
