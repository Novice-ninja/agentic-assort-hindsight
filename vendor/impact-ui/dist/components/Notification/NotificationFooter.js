import { jsxs, jsx } from "react/jsx-runtime";
import { Button } from "../Button/index.js";
function NotificationFooter({
  secondaryButtonLabel,
  onSecondaryButtonClick,
  primaryButtonLabel,
  onPrimaryButtonClick
}) {
  if (!secondaryButtonLabel && !primaryButtonLabel) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "impact-notification-footer-container", children: [
    secondaryButtonLabel && /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onSecondaryButtonClick, children: secondaryButtonLabel }),
    primaryButtonLabel && /* @__PURE__ */ jsx(Button, { onClick: onPrimaryButtonClick, children: primaryButtonLabel })
  ] });
}
NotificationFooter.displayName = "NotificationFooter";
export {
  NotificationFooter
};
