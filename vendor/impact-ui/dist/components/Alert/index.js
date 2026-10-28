!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".ia-styles.ia-alert{align-items:flex-start;border:1px solid #c4e8d5;border-radius:8px;box-shadow:0 0 16px 5px #0000001f;box-sizing:border-box;display:flex;font-family:Manrope,sans-serif!important;font-size:12px!important;font-weight:500;min-height:36px;min-width:385px;padding:8px 16px!important;position:relative}.ia-styles.ia-alert .description{color:#60697d;font-size:12px;word-break:break-word}.ia-styles.ia-alert .MuiAlert-message{display:flex;flex-direction:column;flex-grow:1;gap:4px;justify-content:space-between;overflow:initial;padding:0}.ia-styles.ia-alert .MuiAlert-message button{color:#3649c6;font-size:12px;font-weight:500;height:16px;min-width:0;padding:0;text-transform:none}.ia-styles.ia-alert .MuiAlert-message button:not(:last-child){margin-right:6px}.ia-styles.ia-alert .MuiAlert-message button .MuiTouchRipple-root{visibility:hidden}.ia-styles.ia-alert .MuiAlert-message .close_btn_alert{background:#0000;color:#60697d}.ia-styles.ia-alert .MuiAlert-message .close_btn_alert:hover svg{color:#60697d!important}.ia-styles.ia-alert .MuiAlert-message .close_btn_alert:hover svg path{fill:#60697d!important}.ia-styles.ia-alert .MuiAlert-message .ia-alert-body{align-items:center;display:flex;flex-direction:row;gap:4px;padding:0}.ia-styles.ia-alert .MuiAlert-message .ia-alert-body>.MuiTypography-root{color:#0d152c;flex-grow:1;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;margin-bottom:0}.ia-styles.ia-alert.ia-subtleBackground{border:none!important;box-shadow:none!important}.ia-styles.ia-alert .MuiButtonBase-root:hover{background-color:initial;color:#29399f}.ia-styles.ia-alert .MuiAlert-icon{align-items:flex-start;font-size:18px;margin-right:12px;margin-top:-2px;opacity:1;padding:0}.ia-styles.ia-alert.MuiAlert-standardSuccess{background:#ebf7f1;border:1px solid #c4e8d5}.ia-styles.ia-alert.MuiAlert-standardSuccess .MuiAlert-icon{color:#3bb273}.ia-styles.ia-alert.MuiAlert-standardInfo{background:#e2f4ff;border:1px solid #c6cdfb}.ia-styles.ia-alert.MuiAlert-standardInfo .MuiAlert-icon{color:#4259ee}.ia-styles.ia-alert.MuiAlert-standardWarning{background:#fff8d5;border:1px solid #ffe770}.ia-styles.ia-alert.MuiAlert-standardWarning .MuiAlert-icon{color:#e1bc29}.ia-styles.ia-alert.MuiAlert-standardError{background:#feeaf3;border:1px solid #f3c1c0}.ia-styles.ia-alert.MuiAlert-standardError .MuiAlert-icon{color:#e15554}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import default_1$1 from "../../node_modules/@mui/icons-material/Cancel.js";
import default_1$4 from "../../node_modules/@mui/icons-material/CheckCircle.js";
import default_1 from "../../node_modules/@mui/icons-material/Close.js";
import default_1$3 from "../../node_modules/@mui/icons-material/Info.js";
import default_1$2 from "../../node_modules/@mui/icons-material/Warning.js";
import { Button } from "../Button/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Alert$1 from "../../node_modules/@mui/material/Alert/Alert.js";
import AlertTitle from "../../node_modules/@mui/material/AlertTitle/AlertTitle.js";
const Alert = forwardRef(
  ({
    severity,
    title,
    description = "",
    actionName = "",
    onAction,
    onClose,
    actionButtonProps,
    children: _children,
    subtleBackground,
    className = "",
    ...args
  }, ref) => {
    const { t } = useTranslation();
    const severityTitleKey = `alert.severity.${severity}`;
    const classStr = `ia-styles ia-alert ${subtleBackground ? "ia-subtleBackground" : ""} ${className}`.trim();
    return /* @__PURE__ */ jsxs(
      Alert$1,
      {
        ref,
        "aria-live": severity === "error" ? "assertive" : "polite",
        className: classStr,
        iconMapping: {
          success: /* @__PURE__ */ jsx(default_1$4, { fontSize: "small" }),
          info: /* @__PURE__ */ jsx(default_1$3, { fontSize: "small" }),
          warning: /* @__PURE__ */ jsx(default_1$2, { fontSize: "small" }),
          error: /* @__PURE__ */ jsx(default_1$1, { fontSize: "small" })
        },
        role: "alert",
        severity,
        ...args,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "ia-alert-body", children: [
            /* @__PURE__ */ jsx(AlertTitle, { children: title || t(severityTitleKey) }),
            actionName && onAction ? /* @__PURE__ */ jsx(
              Button,
              {
                "aria-label": actionName,
                size: "small",
                variant: "url",
                onClick: onAction,
                ...actionButtonProps,
                children: actionName
              }
            ) : null,
            onClose ? /* @__PURE__ */ jsx(
              Button,
              {
                "aria-label": t("alert.closeAria"),
                className: "close_btn_alert",
                size: "small",
                variant: "text",
                onClick: onClose,
                children: /* @__PURE__ */ jsx(default_1, { fontSize: "small" })
              }
            ) : null
          ] }),
          description ? /* @__PURE__ */ jsx("span", { className: "description", children: description }) : null
        ]
      }
    );
  }
);
Alert.displayName = "Alert";
export {
  Alert
};
