!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-styles.ia-prompt .MuiDialogContent-root{align-items:center;display:flex;flex-direction:column;gap:8px;justify-content:flex-start;padding:0 0 12px}.ia-styles.ia-prompt .MuiDialogContent-root .MuiDialogContentText-root{align-items:center;color:#60697d;display:flex;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;justify-content:center;padding:0 24px;text-align:center;width:400px;word-wrap:break-word;box-sizing:border-box;overflow-wrap:break-word}.ia-styles.ia-prompt .MuiDialog-paper{border-radius:8px;box-shadow:0 0 4px #0000001f;min-height:224px;min-width:400px;position:relative}.ia-styles.ia-prompt .MuiDialog-paper h2{align-items:center;color:#0d152c;display:flex;font-size:16px;font-weight:800;justify-content:center;line-height:24px;padding:0 40px;text-align:center}.ia-styles.ia-prompt .ia-prompt-close-button{cursor:pointer;display:flex;justify-content:flex-end;padding-right:16px;padding-top:8px}.ia-styles.ia-prompt .ia-prompt-close-icon{color:#60697d;cursor:pointer}.ia-styles.ia-prompt .ia-prompt-close-icon:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-styles.ia-prompt .ia-prompt-close-icon:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-styles.ia-prompt .ia-prompt-info-icon-container{align-items:center;background-color:#eceefd;background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/prompt-info-icon.svg);background-position:50%;background-repeat:no-repeat;border-radius:12px;display:flex;height:48px;justify-content:center;width:48px}.ia-styles.ia-prompt .ia-prompt-info-icon-container.ia-prompt-warning{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/prompt-warning-icon.svg);background-color:#f6ebbf;background-position:50%;background-repeat:no-repeat}.ia-styles.ia-prompt .ia-prompt-info-icon-container.ia-prompt-error{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/prompt-delete-icon.svg);background-color:#fceeee;background-position:50%;background-repeat:no-repeat}.ia-styles.ia-prompt .ia-prompt-info-icon-container.ia-prompt-success{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/prompt-success-icon.svg);background-color:#ebf7f1;background-position:50%;background-repeat:no-repeat}.ia-styles.ia-prompt .MuiDialogActions-root{gap:12px;justify-content:center;padding:16px}.ia-styles.ia-prompt .MuiDialogActions-root>:not(:first-of-type){margin-left:0}.ia-styles.ia-prompt .ia-styles.ia-btn.ia-btn-contained:focus{outline:none}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { Button } from "../Button/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Dialog from "../../node_modules/@mui/material/Dialog/Dialog.js";
import CloseIcon from "../../node_modules/@mui/icons-material/esm/Close.js";
import DialogContent from "../../node_modules/@mui/material/DialogContent/DialogContent.js";
import DialogTitle from "../../node_modules/@mui/material/DialogTitle/DialogTitle.js";
import DialogContentText from "../../node_modules/@mui/material/DialogContentText/DialogContentText.js";
import DialogActions from "../../node_modules/@mui/material/DialogActions/DialogActions.js";
function getVariantClassName(variant) {
  switch (variant) {
    case "error":
      return "ia-prompt-error";
    case "success":
      return "ia-prompt-success";
    case "warning":
      return "ia-prompt-warning";
    case "info":
    default:
      return "ia-prompt-info";
  }
}
function Prompt({
  variant = "info",
  title,
  children,
  primaryButtonLabel,
  secondaryButtonLabel,
  isOpen,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  handleClose,
  primaryButtonProps,
  secondaryButtonProps,
  ...args
}) {
  const { t } = useTranslation();
  const variantClassName = useMemo(() => getVariantClassName(variant), [variant]);
  return /* @__PURE__ */ jsxs(
    Dialog,
    {
      "aria-describedby": "alert-dialog-description",
      "aria-labelledby": "alert-dialog-title",
      className: `ia-styles ia-prompt ${variantClassName}`,
      open: isOpen,
      onClose: handleClose,
      ...args,
      children: [
        handleClose && /* @__PURE__ */ jsx(
          "div",
          {
            "aria-label": t("common.close"),
            className: "ia-prompt-close-button",
            role: "button",
            tabIndex: 0,
            onClick: handleClose,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") handleClose();
            },
            children: /* @__PURE__ */ jsx(CloseIcon, { className: "ia-prompt-close-icon" })
          }
        ),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx("div", { className: `ia-prompt-info-icon-container ${variantClassName}` }),
          /* @__PURE__ */ jsx(DialogTitle, { className: `ia-dialog-title ${variantClassName}`, id: "alert-dialog-title", children: title }),
          /* @__PURE__ */ jsx(DialogContentText, { className: "ia-dialog-content", id: "alert-dialog-description", children })
        ] }),
        /* @__PURE__ */ jsxs(DialogActions, { children: [
          secondaryButtonLabel ? /* @__PURE__ */ jsx(Button, { variant: "text", onClick: onSecondaryButtonClick, ...secondaryButtonProps, children: secondaryButtonLabel }) : null,
          primaryButtonLabel && variant !== "success" ? /* @__PURE__ */ jsx(
            Button,
            {
              autoFocus: true,
              type: variant === "error" ? "destructive" : "default",
              onClick: onPrimaryButtonClick,
              ...primaryButtonProps,
              children: primaryButtonLabel
            }
          ) : null
        ] })
      ]
    }
  );
}
Prompt.displayName = "Prompt";
export {
  Prompt
};
