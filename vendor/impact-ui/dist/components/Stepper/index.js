!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-styles.ia-stepper{font-family:Manrope,sans-serif!important}.ia-styles.ia-stepper.MuiStepContent-root{border-left:none;bottom:0;margin-left:12px;padding-left:20px;padding-right:8px;position:absolute}.ia-styles.ia-stepper.MuiBox-root{max-width:none}.ia-styles.ia-stepper.ia-stepper{font-family:Manrope,sans-serif}.ia-styles.ia-stepper.ia-stepper .MuiStep-horizontal{align-items:center;background:#fff;border-radius:8px;cursor:pointer;display:flex;height:44px;padding-left:12px;padding-right:12px;position:relative;width:100%}.ia-styles.ia-stepper.ia-stepper .MuiStep-horizontal:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-styles.ia-stepper.ia-stepper .MuiStep-horizontal:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-active{background:#4259ee;border-radius:8px;color:#4259ee}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-active .MuiStepIcon-text{fill:#fff;font-family:Manrope,sans-serif}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-iconContainer .MuiSvgIcon-root{background:#d9dde7;border-radius:8px;color:#d9dde7;height:24px;width:24px}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-iconContainer .MuiSvgIcon-root .MuiStepIcon-text{fill:#7a8294;font-family:Manrope,sans-serif;font-weight:800}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-completed{background:#3bb273 url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/checkmark.svg) no-repeat;background-position:50%;background-size:16px;border-radius:6px;color:#3bb273;position:relative}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-vertical .MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-active{background:#4259ee;color:#4259ee;height:20px;width:20px}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-vertical .MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-active .MuiStepIcon-text{fill:#fff}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-vertical .MuiStepLabel-iconContainer .MuiSvgIcon-root{background:#7a8294;color:#7a8294;height:20px;width:20px}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-vertical .MuiStepLabel-iconContainer .MuiSvgIcon-root .MuiStepIcon-text{fill:#fff;font-weight:700}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-vertical .MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-completed{background:#3bb273;background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/checkmark.svg);background-position:50%;background-repeat:no-repeat;background-size:12px;color:#3bb273;height:20px;width:20px}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-labelContainer .MuiStepLabel-label{font-family:Manrope,sans-serif;font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ia-styles.ia-stepper.ia-stepper .MuiStepLabel-labelContainer .MuiStepLabel-label.Mui-completed{color:#3bb273}.ia-styles.ia-stepper .MuiTypography-caption{font-family:Manrope,sans-serif}.ia-styles.ia-stepper .MuiStepLabel-label.Mui-completed+.MuiTypography-root.MuiTypography-caption{color:#3bb273}.ia-styles.ia-stepper .MuiStepConnector-root{margin-left:20px}.ia-styles.ia-stepper .MuiStepConnector-root .MuiStepConnector-line{border-color:#b4bac7;border-style:dashed;width:23px}.ia-styles.ia-stepper .MuiStep-horizontal:has(.Mui-active){border-bottom:2px solid #4259ee!important}.ia-styles.ia-stepper .MuiStep-horizontal:has(.Mui-active):before{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/stepper-triangle.svg) no-repeat;background-size:13px;bottom:-10px;content:" ";height:10px;left:18px;position:absolute;width:13px}.ia-styles.ia-stepper .MuiStep-root:has(.Mui-completed){border-bottom:2px solid #108431!important}.ia-styles.ia-stepper .MuiStep-vertical{border-radius:8px;padding:8px;position:relative}.ia-styles.ia-stepper .MuiStep-vertical.Mui-completed{background:#ebf7f1;border:1px solid #ebf7f1!important}.ia-styles.ia-stepper .MuiStep-vertical:has(.Mui-active){background:#eceefd;border:1px solid #eceefd!important}.ia-styles.ia-stepper .MuiStepLabel-vertical{padding:0!important}.ia-styles.ia-stepper.progress .progress-steps{display:flex;gap:8px;margin-bottom:0}.ia-styles.ia-stepper.progress .progress-steps .step{background-color:#eceefd;border-radius:4px;height:8px;transition:background-color .3s ease;width:132px}.ia-styles.ia-stepper.progress .progress-steps .step.active,.ia-styles.ia-stepper.progress .progress-steps .step.completed{background-color:#4259ee}.ia-styles.ia-stepper.progress .step-labels{display:flex;justify-content:space-between}.ia-styles.ia-stepper.progress .step-labels .step-label{color:#6b7280;cursor:pointer;font-size:14px;font-weight:500;transition:color .3s ease}.ia-styles.ia-stepper.progress .step-labels .step-label.active,.ia-styles.ia-stepper.progress .step-labels .step-label.completed{color:#3649c6}.ia-styles.ia-stepper.numbered .numbered-steps{align-items:center;display:flex;gap:16px;margin-bottom:32px}.ia-styles.ia-stepper.numbered .numbered-steps .step{align-items:center;background-color:#e8e8e8;border-radius:50%;color:#666;display:flex;font-size:14px;font-weight:600;height:32px;justify-content:center;transition:all .3s ease;width:32px}.ia-styles.ia-stepper.numbered .numbered-steps .step.active{background-color:#3649c6;color:#fff}.ia-styles.ia-stepper.numbered .numbered-steps .step:not(:last-child):after{background-color:#e8e8e8;content:"";height:2px;position:absolute;right:-16px;width:16px}.ia-styles.ia-stepper.labeled .labeled-steps{align-items:center;display:flex;gap:24px;margin-bottom:32px}.ia-styles.ia-stepper.labeled .labeled-steps .step{align-items:center;display:flex;gap:8px}.ia-styles.ia-stepper.labeled .labeled-steps .step .step-number{align-items:center;background-color:#e8e8e8;border-radius:50%;color:#666;display:flex;font-size:12px;font-weight:600;height:24px;justify-content:center;transition:all .3s ease;width:24px}.ia-styles.ia-stepper.labeled .labeled-steps .step .step-label{color:#666;font-size:14px;transition:color .3s ease}.ia-styles.ia-stepper.labeled .labeled-steps .step.active .step-number{background-color:#3649c6;color:#fff}.ia-styles.ia-stepper.labeled .labeled-steps .step.active .step-label{color:#1a1a1a;font-weight:600}.ia-styles.ia-stepper.labeled .labeled-steps .step:not(:last-child):after{background-color:#e8e8e8;content:"";display:block;height:1px;margin-left:8px;width:24px}.ia-styles.ia-stepper .status-config{flex:1}.ia-styles.ia-stepper .status-config .MuiStepLabel-label{align-items:center;display:flex;justify-content:space-between;max-width:none!important}.ia-stepper.MuiStepper-horizontal .MuiStepLabel-label.Mui-active,.ia-stepper.MuiStepper-horizontal .MuiStepLabel-label.Mui-active+.MuiTypography-root.MuiTypography-caption{color:#0d152c}.ia-stepper.MuiStepper-vertical .MuiStepLabel-label.Mui-active,.ia-stepper.MuiStepper-vertical .MuiStepLabel-label.Mui-active+.MuiTypography-root.MuiTypography-caption{color:#4259ee}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { Badge } from "../Badge/index.js";

import Stepper$1 from "../../node_modules/@mui/material/Stepper/Stepper.js";
import Step from "../../node_modules/@mui/material/Step/Step.js";
import StepLabel from "../../node_modules/@mui/material/StepLabel/StepLabel.js";
import Typography from "../../node_modules/@mui/material/Typography/Typography.js";
const MUI_VARIANTS = ["elevation", "outlined"];
function DefaultStepper({
  steps,
  activeStep,
  orientation,
  handleStep,
  width = "100%",
  variant,
  ...args
}) {
  const muiVariant = variant && MUI_VARIANTS.includes(variant) ? variant : void 0;
  return /* @__PURE__ */ jsx(
    Stepper$1,
    {
      activeStep,
      className: "ia-styles ia-stepper ia-stepper-horizontal",
      orientation: orientation ?? "horizontal",
      sx: { width },
      variant: muiVariant,
      ...args,
      children: steps.length > 0 && steps.map((step, index) => /* @__PURE__ */ jsx(
        Step,
        {
          tabIndex: handleStep ? 0 : -1,
          onClick: () => handleStep == null ? void 0 : handleStep(index),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleStep == null ? void 0 : handleStep(index);
            }
          },
          children: /* @__PURE__ */ jsxs(
            StepLabel,
            {
              className: step.statusConfig ? "status-config" : "",
              optional: step.description ? /* @__PURE__ */ jsx(Typography, { variant: "caption", children: step.description }) : null,
              children: [
                step.label,
                step.statusConfig && /* @__PURE__ */ jsx(
                  Badge,
                  {
                    color: step.statusConfig.color,
                    icon: step.statusConfig.icon,
                    isIcon: !!step.statusConfig.icon,
                    label: step.statusConfig.label,
                    variant: "subtle"
                  }
                )
              ]
            }
          )
        },
        step.label
      ))
    }
  );
}
function ProgressStepper({
  steps,
  activeStep,
  handleStep
}) {
  return /* @__PURE__ */ jsx("div", { className: "ia-styles ia-stepper progress", children: /* @__PURE__ */ jsx("div", { className: "progress-steps", children: steps.map((step, index) => /* @__PURE__ */ jsx(
    "div",
    {
      className: `step ${index === activeStep ? "active" : ""} ${index < activeStep ? "completed" : ""}`,
      role: "button",
      tabIndex: handleStep ? 0 : -1,
      onClick: () => handleStep == null ? void 0 : handleStep(index),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStep == null ? void 0 : handleStep(index);
        }
      }
    },
    step.label
  )) }) });
}
function Stepper({
  steps,
  activeStep,
  orientation = "horizontal",
  handleStep,
  variant = "default",
  ...args
}) {
  if (variant === "progress") {
    return /* @__PURE__ */ jsx(ProgressStepper, { activeStep, handleStep, steps });
  }
  return /* @__PURE__ */ jsx(
    DefaultStepper,
    {
      activeStep,
      handleStep,
      orientation,
      steps,
      variant: variant === "mui" ? "default" : variant,
      ...args
    }
  );
}
Stepper.displayName = "Stepper";
export {
  Stepper
};
