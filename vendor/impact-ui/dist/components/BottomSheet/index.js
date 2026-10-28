!function(){"use strict";try{if("undefined"!=typeof document){var t=document.createElement("style");t.appendChild(document.createTextNode(".bottom-sheet{bottom:0;left:0;position:fixed;right:0;transition:height .3s ease-in-out}.bottom-sheet .MuiDialog-container{align-items:flex-end}.bottom-sheet .MuiDialog-paper{border-radius:16px 16px 0 0;margin:0;max-width:100%}.bottom-sheet .MuiDialog-paper,.bottom-sheet .ia_modalPopover.ia_modal_medium{transition:height .3s ease-in-out;width:100%}.bottom-sheet .ia_modalPopover{background:#fff;border-radius:16px 16px 0 0;bottom:0;left:0;margin:auto;position:absolute;right:0}.bottom-sheet .ia_modalBody{bottom:0}.bottom-sheet.with-footer .ia_modalBody{bottom:56px}.ia_modalHeader{padding:12px 16px 24px}.modal-actions{gap:25px!important}")),document.head.appendChild(t)}}catch(o){console.error("vite-plugin-css-injected-by-js",o)}}();
import { jsx } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { Modal } from "../Modal/index.js";

function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
  footerOptions,
  maxHeight = "calc(100vh - 64px)",
  withExpandIcon = false,
  onExpand,
  primaryButtonLabel,
  secondaryButtonLabel,
  ...props
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState("auto");
  const [contentNode, setContentNode] = useState(null);
  const hasFooterOptions = footerOptions != null && footerOptions !== false;
  const hasFooterButtons = Boolean(primaryButtonLabel || secondaryButtonLabel);
  const hasFooter = hasFooterOptions || hasFooterButtons;
  const autoHeight = !withExpandIcon;
  const handleExpandClick = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    onExpand == null ? void 0 : onExpand(next);
  };
  const measure = useCallback(() => {
    const body = contentNode == null ? void 0 : contentNode.parentElement;
    if (!contentNode || !body) return;
    const styles = window.getComputedStyle(body);
    const chrome = (parseFloat(styles.top) || 0) + (parseFloat(styles.bottom) || 0) + (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const next = contentNode.scrollHeight + chrome;
    setContentHeight((prev) => {
      const capped = typeof maxHeight === "number" ? Math.min(next, maxHeight) : next;
      return typeof prev === "number" && Math.abs(prev - capped) < 1 ? prev : capped;
    });
  }, [contentNode, maxHeight]);
  useEffect(() => {
    if (!open) {
      setContentHeight("auto");
      return void 0;
    }
    if (!autoHeight || !contentNode) return void 0;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(contentNode);
    return () => {
      observer.disconnect();
    };
  }, [open, autoHeight, contentNode, measure]);
  const mergedClassName = [
    "bottom-sheet",
    isExpanded ? "expanded" : "",
    hasFooter ? "with-footer" : "",
    className ?? ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx(
    Modal,
    {
      isBottomSheet: true,
      className: mergedClassName,
      footerOptions,
      height: autoHeight ? contentHeight : void 0,
      isExpanded,
      maxHeight: autoHeight ? maxHeight : void 0,
      open,
      primaryButtonLabel,
      secondaryButtonLabel,
      title,
      withExpandIcon,
      onClose,
      onExpand: handleExpandClick,
      ...props,
      children: /* @__PURE__ */ jsx("div", { ref: setContentNode, className: "bottom-sheet-content", children })
    }
  );
}
BottomSheet.displayName = "BottomSheet";
export {
  BottomSheet
};
