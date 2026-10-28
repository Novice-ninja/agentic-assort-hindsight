!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.MuiModal-root:has(>.MuiDialog-container)>.MuiModal-backdrop,.MuiModal-root:has(>.MuiDrawer-paper)>.MuiModal-backdrop,.MuiModal-root:has(>.ia_modalPopover)>.MuiModal-backdrop{background-color:var(--ia-modal-backdrop,#0d152ccc)}.ia_modalPopover{background:#fff;border-radius:8px;bottom:0;display:flex;flex-direction:column;left:0;margin:auto;position:absolute;right:0;top:0}.ia_modalPopover.is-bottom-sheet{border-radius:16px 16px 0 0;bottom:0;left:0;right:0;top:auto;transform:none;transition:height .3s ease-in-out;width:100%!important}.ia_modalPopover.is-bottom-sheet.with-expand-icon{height:465px!important}.ia_modalPopover.is-bottom-sheet.expanded{height:auto!important;top:100px}.ia_modalPopover .ia_modalHeader{align-items:center;background:#eceefd;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;padding:16px}.ia_modalPopover .ia_modalHeader .ia_modalHeading{color:#0d152c;font-size:16px;font-weight:700;line-height:16px}.ia_modalPopover .ia_modalHeader .modal-actions{align-items:center;display:flex;gap:8px}.ia_modalPopover .ia_modalHeader .close_icon,.ia_modalPopover .ia_modalHeader .collapse_icon,.ia_modalPopover .ia_modalHeader .expand_icon{background-color:initial;background-repeat:no-repeat;background-size:contain;border:none;cursor:pointer;height:24px;margin:0;padding:0;width:24px}.ia_modalPopover .ia_modalHeader .close_icon:focus-visible,.ia_modalPopover .ia_modalHeader .collapse_icon:focus-visible,.ia_modalPopover .ia_modalHeader .expand_icon:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia_modalPopover .ia_modalHeader .close_icon:focus:not(:focus-visible),.ia_modalPopover .ia_modalHeader .collapse_icon:focus:not(:focus-visible),.ia_modalPopover .ia_modalHeader .expand_icon:focus:not(:focus-visible){box-shadow:none;outline:none}.ia_modalPopover .ia_modalHeader .expand_icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/expand-icon.svg) no-repeat;background-position:50%;background-size:16px;height:16px;width:16px}.ia_modalPopover .ia_modalHeader .collapse_icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/collapse-icon-2.svg) no-repeat;background-position:50%;background-size:16px;height:16px;width:16px}.ia_modalPopover .ia_modalHeader .close_icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/close.svg) no-repeat;background-position:50%;background-size:16px;height:10px;width:10px}.ia_modalPopover .ia_modalBody{bottom:56px;box-sizing:border-box;flex:1;font-size:14px;line-height:22px;overflow:auto;padding:24px 16px 16px;position:absolute;top:48px;width:100%}.ia_modalPopover .ia_modalFooter{align-items:center;border-top:1px solid #d9dde7;bottom:0;display:flex;gap:16px;height:56px;justify-content:flex-end;left:0;padding-right:16px;position:absolute;right:0}.ia_modalPopover.ia_modal_small{height:304px;width:526px}.ia_modalPopover.ia_modal_medium{height:532px;width:800px}.ia_modalPopover.ia_modal_large{top:100px;right:100px;bottom:100px;left:100px}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { Button } from "../Button/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Modal$1 from "../../node_modules/@mui/material/Modal/Modal.js";
import Box from "../../node_modules/@mui/material/Box/Box.js";
function Modal({
  className = "",
  title,
  size = "medium",
  children,
  primaryButtonLabel,
  secondaryButtonLabel,
  open,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonProps,
  secondaryButtonProps,
  onClose,
  width,
  height,
  footerOptions,
  isBottomSheet = false,
  isExpanded = false,
  onExpand,
  maxHeight,
  zIndex = 1300,
  withExpandIcon = false,
  ...args
}) {
  const { t } = useTranslation();
  const modalClasses = [
    "ia_modalPopover",
    `ia_modal_${size}`,
    className,
    isBottomSheet ? "is-bottom-sheet" : "",
    isExpanded ? "expanded" : "",
    withExpandIcon ? "with-expand-icon" : ""
  ].filter(Boolean).join(" ");
  const style = { width, height, maxHeight };
  const handleClose = (event, _reason) => {
    onClose == null ? void 0 : onClose(event);
  };
  const headerActions = /* @__PURE__ */ jsxs("div", { className: "modal-actions", children: [
    isBottomSheet && withExpandIcon && /* @__PURE__ */ jsx(
      "button",
      {
        "aria-label": isExpanded ? t("modal.collapse") : t("modal.expand"),
        className: isExpanded ? "collapse_icon" : "expand_icon",
        type: "button",
        onClick: onExpand
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        "aria-label": t("common.close"),
        className: "close_icon",
        "data-testid": "modal-close-button",
        type: "button",
        onClick: (e) => {
          handleClose(e);
        }
      }
    )
  ] });
  if (!primaryButtonLabel && !secondaryButtonLabel) {
    return /* @__PURE__ */ jsx(
      Modal$1,
      {
        "aria-describedby": "modal-modal-description",
        "aria-labelledby": "modal-modal-title",
        open,
        sx: { "&.MuiModal-root": { zIndex: `${zIndex}` } },
        onClose: handleClose,
        ...args,
        children: /* @__PURE__ */ jsxs(Box, { className: modalClasses, style, children: [
          /* @__PURE__ */ jsxs("div", { className: "ia_modalHeader", children: [
            /* @__PURE__ */ jsx("div", { className: "ia_modalHeading", children: title }),
            headerActions
          ] }),
          /* @__PURE__ */ jsx("div", { className: "ia_modalBody", children }),
          footerOptions != null && /* @__PURE__ */ jsx("div", { className: "ia_modalFooter", children: footerOptions })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    Modal$1,
    {
      "aria-describedby": "modal-modal-description",
      "aria-labelledby": "modal-modal-title",
      open,
      sx: { "&.MuiModal-root": { zIndex: `${zIndex}` } },
      onClose: handleClose,
      ...args,
      children: /* @__PURE__ */ jsxs(Box, { className: modalClasses, style, children: [
        /* @__PURE__ */ jsxs("div", { className: "ia_modalHeader", children: [
          /* @__PURE__ */ jsx("div", { className: "ia_modalHeading", children: title }),
          headerActions
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ia_modalBody", children }),
        /* @__PURE__ */ jsxs("div", { className: "ia_modalFooter", children: [
          secondaryButtonLabel != null && /* @__PURE__ */ jsx(Button, { variant: "url", onClick: onSecondaryButtonClick, ...secondaryButtonProps, children: secondaryButtonLabel }),
          primaryButtonLabel != null && // eslint-disable-next-line jsx-a11y/no-autofocus
          /* @__PURE__ */ jsx(Button, { autoFocus: true, onClick: onPrimaryButtonClick, ...primaryButtonProps, children: primaryButtonLabel })
        ] })
      ] })
    }
  );
}
Modal.displayName = "Modal";
export {
  Modal
};
