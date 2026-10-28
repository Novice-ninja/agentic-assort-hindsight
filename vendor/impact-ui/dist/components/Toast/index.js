!function(){"use strict";try{if("undefined"!=typeof document){var a=document.createElement("style");a.appendChild(document.createTextNode('.ia-styles.ia-snackbar .MuiPaper-root{border-radius:4px;box-shadow:0 10px 30px #00000026;height:51px;justify-content:center;text-align:center}.ia-styles.ia-snackbar .MuiPaper-root:after{background:tomato;border-radius:0 0 4px 4px;bottom:0;content:" ";height:4px;left:0;position:absolute;right:0}.ia-styles.ia-snackbar .css-1arijsr-MuiSnackbar-root{z-index:999999}.ia-styles.ia-snackbar .MuiSnackbarContent-message{font-size:14px;font-weight:500}.ia-styles.ia-snackbar.ia-snackbar-success .MuiPaper-root{background:#3bb273}.ia-styles.ia-snackbar.ia-snackbar-success .MuiPaper-root:after{background:#89d1ab}.ia-styles.ia-snackbar.ia-snackbar-info .MuiPaper-root{background:#4259ee}.ia-styles.ia-snackbar.ia-snackbar-info .MuiPaper-root:after{background:#687af1}.ia-styles.ia-snackbar.ia-snackbar-warning .MuiPaper-root{background:#e1bc29}.ia-styles.ia-snackbar.ia-snackbar-warning .MuiPaper-root:after{background:#edd77f}.ia-styles.ia-snackbar.ia-snackbar-warning .MuiSnackbarContent-message{color:#0d152c}.ia-styles.ia-snackbar.ia-snackbar-error .MuiPaper-root{background:#ec4c5c}.ia-styles.ia-snackbar.ia-snackbar-error .MuiPaper-root:after{background:#ed9998}')),document.head.appendChild(a)}}catch(r){console.error("vite-plugin-css-injected-by-js",r)}}();
import { createElement } from "react";

import { useTranslation } from "../../i18n/useTranslation.js";
import Snackbar from "../../node_modules/@mui/material/Snackbar/Snackbar.js";
function Toast({
  isOpen = true,
  position = "top-right",
  message,
  variant = "success",
  onClose,
  autoHideDuration = 5e3,
  zIndex = 1400,
  className,
  "data-testid": dataTestId,
  ...args
}) {
  const { t } = useTranslation();
  const resolvedMessage = message ?? t("toast.defaultMessage");
  const [vertical, horizontal] = position.split("-");
  return /* @__PURE__ */ createElement(
    Snackbar,
    {
      ...args,
      key: `${vertical}-${horizontal}`,
      anchorOrigin: { vertical, horizontal },
      autoHideDuration: autoHideDuration ?? void 0,
      className: `ia-styles ia-snackbar ia-snackbar-${variant} ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      message: resolvedMessage,
      open: isOpen,
      sx: { zIndex },
      onClose
    }
  );
}
Toast.displayName = "Toast";
export {
  Toast
};
