!function(){"use strict";try{if("undefined"!=typeof document){var t=document.createElement("style");t.appendChild(document.createTextNode(".impact_emptystate{align-items:center;background-color:#fff;border:1px solid #ebebf0;border-radius:12px;box-sizing:border-box;display:flex;flex-direction:column;height:auto;justify-content:center;margin:0 auto;padding:40px 20px;text-align:center;width:884px}.impact_emptystate .impact_center_svg{align-items:center;display:flex;height:150px;justify-content:center;margin-bottom:12px;min-height:180px;overflow:hidden;position:relative;width:225px}.impact_emptystate .impact_center_svg_with_icon{background:none!important;min-height:180px}.impact_emptystate .impact_heading{color:#1f2b4d;font-size:20px;font-weight:700;margin-bottom:16px}.impact_emptystate .impact_paragraph{color:#5f6673;font-size:16px;font-weight:500;line-height:21px;margin-bottom:40px;margin-top:12px;text-align:center;width:650px}.impact_emptystate .bottom_cta_container{align-items:center;display:flex;flex-wrap:wrap;gap:16px;justify-content:center}.impact_emptystate .bottom_cta_container .primary_btn{border:none;border-radius:8px}.impact_emptystate .bottom_cta_container .primary_btn,.impact_emptystate .bottom_cta_container .secondary_btn{box-sizing:border-box;cursor:pointer;font-size:14px;font-weight:500;height:32px;line-height:20px;padding:6px 12px;text-transform:capitalize}.impact_emptystate .bottom_cta_container .secondary_btn{background:#fff;border:1px solid #c3c8d4;border-radius:8px;color:#1f2b4d}")),document.head.appendChild(t)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { Button } from "../Button/index.js";
import { EmptyStateImage } from "./EmptyStateImage.js";

import { useTranslation } from "../../i18n/useTranslation.js";
function EmptyState({
  heading,
  description = "",
  secondaryButtonLabel,
  onSecondaryButtonClick,
  primaryButtonLabel,
  onPrimaryButtonClick,
  emptyStateIcon = null,
  emptyStateBottomOptions = null,
  primaryButtonProps = {},
  secondaryButtonProps = {},
  className = "",
  id,
  "data-testid": dataTestId,
  "aria-label": ariaLabel,
  role = "region"
}) {
  const { t } = useTranslation();
  const resolvedAriaLabel = ariaLabel ?? t("emptyState.ariaLabel");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-label": resolvedAriaLabel,
      className: `impact_emptystate ${className}`.trim(),
      "data-testid": dataTestId,
      id,
      role,
      children: [
        /* @__PURE__ */ jsx("div", { className: `impact_center_svg ${emptyStateIcon ? "impact_center_svg_with_icon" : ""}`, children: emptyStateIcon ?? /* @__PURE__ */ jsx(EmptyStateImage, {}) }),
        /* @__PURE__ */ jsx("div", { className: "impact_heading", children: heading }),
        /* @__PURE__ */ jsx("div", { className: "impact_paragraph", children: description }),
        /* @__PURE__ */ jsxs("div", { className: "bottom_cta_container", children: [
          emptyStateBottomOptions,
          secondaryButtonLabel != null && /* @__PURE__ */ jsx(
            Button,
            {
              className: "secondary_btn",
              variant: "secondary",
              onClick: onSecondaryButtonClick,
              ...secondaryButtonProps,
              children: secondaryButtonLabel
            }
          ),
          primaryButtonLabel != null && /* @__PURE__ */ jsx(Button, { className: "primary_btn", onClick: onPrimaryButtonClick, ...primaryButtonProps, children: primaryButtonLabel })
        ] })
      ]
    }
  );
}
EmptyState.displayName = "EmptyState";
export {
  EmptyState
};
