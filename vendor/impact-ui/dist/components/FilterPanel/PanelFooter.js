import { jsxs, jsx } from "react/jsx-runtime";
import { Button } from "../Button/index.js";
function PanelFooter({
  quaternaryButtonLabel,
  onQuaternaryButtonClick,
  tertiaryButtonLabel,
  onTertiaryButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  primaryButtonLabel,
  onPrimaryButtonClick,
  primaryButtonProps,
  secondaryButtonProps,
  tertiaryButtonProps,
  quaternaryButtonProps
}) {
  return /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_footer", children: [
    /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_footer_left_container", children: [
      tertiaryButtonLabel ? /* @__PURE__ */ jsx(Button, { variant: "text", onClick: onTertiaryButtonClick, ...tertiaryButtonProps, children: tertiaryButtonLabel }) : null,
      quaternaryButtonLabel ? /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: onQuaternaryButtonClick, ...quaternaryButtonProps, children: quaternaryButtonLabel }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_footer_right_container", children: [
      secondaryButtonLabel ? /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: onSecondaryButtonClick, ...secondaryButtonProps, children: secondaryButtonLabel }) : null,
      primaryButtonLabel ? /* @__PURE__ */ jsx(Button, { onClick: onPrimaryButtonClick, ...primaryButtonProps, children: primaryButtonLabel }) : null
    ] })
  ] });
}
PanelFooter.displayName = "PanelFooter";
export {
  PanelFooter
};
