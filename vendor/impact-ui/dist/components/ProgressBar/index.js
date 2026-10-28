!function(){"use strict";try{if("undefined"!=typeof document){var r=document.createElement("style");r.appendChild(document.createTextNode(".progressbar_layout{min-width:232px}.progress_container .progressbar_label_container{font-size:12px;font-weight:500;margin-bottom:4px}.progress_container .progressbar_status .MuiLinearProgress-root{background-color:#f3f4f6;border-radius:10px;height:8px}.progress_container .progressbar_status .MuiLinearProgress-bar{background-color:#4259ee;border-radius:8px}.progress_container_remaining .progressbar_label_container{color:#7a8294}.progress_container_completed .progressbar_label_container{color:#26734b;font-size:12px}.progress_container_completed .MuiLinearProgress-bar{background-color:#108431!important}.progress_container_failed .progressbar_label_container{color:#ab3939;font-size:12px}.progress_container_failed .MuiLinearProgress-bar{background-color:#ec4c5c!important}.progress_bar_remaining .MuiLinearProgress-bar{background-color:#4259ee}.progress_bar_completed .MuiLinearProgress-bar{background-color:#108431}.progress_bar_failed .MuiLinearProgress-bar{background-color:#ec4c5c}")),document.head.appendChild(r)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx, jsxs } from "react/jsx-runtime";

import { useTranslation } from "../../i18n/useTranslation.js";
import LinearProgress from "../../node_modules/@mui/material/LinearProgress/LinearProgress.js";
function getLabel(props, t) {
  if (props.customLabel) return props.customLabel;
  if (props.status === "completed") return t("progressBar.completed");
  if (props.status === "failed") return t("progressBar.failed");
  const percent = Math.round(props.value ?? 0);
  if (props.showTime !== false) {
    return t("progressBar.remaining", { percent, time: props.time ?? 0 });
  }
  return `${percent}%`;
}
function ProgressBar({
  value = 10,
  showTime = true,
  time = 30,
  customLabel,
  status = "remaining",
  LinearProgressProps: linearProps,
  id,
  "data-testid": dataTestId,
  "aria-label": ariaLabel,
  role = "progressbar"
}) {
  const { t } = useTranslation();
  const resolvedAriaLabel = ariaLabel ?? t("progressBar.ariaLabel");
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-label": resolvedAriaLabel,
      "aria-valuemax": 100,
      "aria-valuemin": 0,
      "aria-valuenow": value,
      className: "progressbar_layout",
      "data-testid": dataTestId,
      id,
      role,
      children: /* @__PURE__ */ jsxs("div", { className: `progress_container progress_container_${status}`, children: [
        /* @__PURE__ */ jsx("div", { className: "progressbar_label_container", children: /* @__PURE__ */ jsx("div", { className: "label_name", children: getLabel({ value, showTime, time, customLabel, status }, t) }) }),
        /* @__PURE__ */ jsx("div", { className: "progressbar_status", children: /* @__PURE__ */ jsx(
          LinearProgress,
          {
            className: `progress_bar progress_bar_${status}`,
            value,
            variant: "determinate",
            ...linearProps
          }
        ) })
      ] })
    }
  );
}
ProgressBar.displayName = "ProgressBar";
export {
  ProgressBar
};
