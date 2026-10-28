!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".chat-skeleton-container{background-color:#f9f9f9;border-radius:8px;box-shadow:0 1px 2px #0000001a;max-width:610px;overflow:hidden}.chat-skeleton,.chat-skeleton-container{display:flex;flex-direction:column;height:100%;width:100%}.chat-header-skeleton{align-items:center;background-color:#fff;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;padding:12px 16px}.chat-header-left{align-items:center;display:flex;gap:12px}.chat-info{display:flex;flex-direction:column;gap:4px}.chat-header-right{align-items:center;display:flex;gap:8px}.chat-body{background-color:#f5f5f5;flex:1;overflow-y:auto;padding:16px}.chat-message-list-skeleton{display:flex;flex-direction:column;gap:16px;width:100%}.thread-skeleton{max-width:550px}.date-separator-skeleton{display:flex;justify-content:center;margin:8px 0}.message-skeleton{display:flex;gap:8px;max-width:70%;width:100%}.message-skeleton.own-message{align-self:flex-end;flex-direction:row-reverse}.message-content-skeleton{display:flex;flex-direction:column;gap:4px}.message-meta-skeleton{align-items:center;display:flex;gap:4px;margin-top:4px}.chat-footer-skeleton{background-color:#fff;border-top:1px solid #e0e0e0;padding:12px 16px}.chat-actions,.chat-input-container{align-items:center;display:flex;gap:8px}.chat-actions{justify-content:flex-end;margin-bottom:4px}.action-skeleton,.attach-skeleton,.avatar-skeleton,.date-skeleton,.emoji-skeleton,.icon-skeleton,.input-skeleton,.message-avatar-skeleton,.send-skeleton,.sender-skeleton,.status-skeleton,.text-skeleton,.time-skeleton,.title-skeleton{background-color:#e0e0e0}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsxs, jsx } from "react/jsx-runtime";

import Skeleton from "../../../../node_modules/@mui/material/Skeleton/Skeleton.js";
const ChatFooterSkeleton = () => {
  return /* @__PURE__ */ jsxs("div", { className: "chat-footer-skeleton", children: [
    /* @__PURE__ */ jsx("div", { className: "chat-actions", children: /* @__PURE__ */ jsx(
      Skeleton,
      {
        className: "action-skeleton",
        height: 24,
        style: { borderRadius: "12px" },
        variant: "rectangular",
        width: 80
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "chat-input-container", children: [
      /* @__PURE__ */ jsx(
        Skeleton,
        {
          className: "input-skeleton",
          height: 40,
          style: { borderRadius: "20px" },
          variant: "rectangular",
          width: "100%"
        }
      ),
      /* @__PURE__ */ jsx(Skeleton, { className: "emoji-skeleton", height: 36, variant: "circular", width: 36 }),
      /* @__PURE__ */ jsx(Skeleton, { className: "send-skeleton", height: 40, variant: "circular", width: 40 })
    ] })
  ] });
};
export {
  ChatFooterSkeleton as default
};
