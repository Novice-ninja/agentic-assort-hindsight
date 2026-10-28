!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".chat-skeleton-container{background-color:#f9f9f9;border-radius:8px;box-shadow:0 1px 2px #0000001a;max-width:610px;overflow:hidden}.chat-skeleton,.chat-skeleton-container{display:flex;flex-direction:column;height:100%;width:100%}.chat-header-skeleton{align-items:center;background-color:#fff;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;padding:12px 16px}.chat-header-left{align-items:center;display:flex;gap:12px}.chat-info{display:flex;flex-direction:column;gap:4px}.chat-header-right{align-items:center;display:flex;gap:8px}.chat-body{background-color:#f5f5f5;flex:1;overflow-y:auto;padding:16px}.chat-message-list-skeleton{display:flex;flex-direction:column;gap:16px;width:100%}.thread-skeleton{max-width:550px}.date-separator-skeleton{display:flex;justify-content:center;margin:8px 0}.message-skeleton{display:flex;gap:8px;max-width:70%;width:100%}.message-skeleton.own-message{align-self:flex-end;flex-direction:row-reverse}.message-content-skeleton{display:flex;flex-direction:column;gap:4px}.message-meta-skeleton{align-items:center;display:flex;gap:4px;margin-top:4px}.chat-footer-skeleton{background-color:#fff;border-top:1px solid #e0e0e0;padding:12px 16px}.chat-actions,.chat-input-container{align-items:center;display:flex;gap:8px}.chat-actions{justify-content:flex-end;margin-bottom:4px}.action-skeleton,.attach-skeleton,.avatar-skeleton,.date-skeleton,.emoji-skeleton,.icon-skeleton,.input-skeleton,.message-avatar-skeleton,.send-skeleton,.sender-skeleton,.status-skeleton,.text-skeleton,.time-skeleton,.title-skeleton{background-color:#e0e0e0}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx, jsxs } from "react/jsx-runtime";

import Skeleton from "../../../../node_modules/@mui/material/Skeleton/Skeleton.js";
const ChatMessageListSkeleton = ({ className, messageCount = 8 }) => {
  const renderSkeletonMessages = () => {
    const messages = [];
    for (let i = 0; i < messageCount; i++) {
      const isOwnMessage = i % 3 === 0;
      const hasDateSeparator = i % 4 === 0;
      if (hasDateSeparator) {
        messages.push(
          /* @__PURE__ */ jsx("div", { className: "date-separator-skeleton", children: /* @__PURE__ */ jsx(Skeleton, { className: "date-skeleton", height: 16, variant: "text", width: 80 }) }, `date-${i}`)
        );
      }
      messages.push(
        /* @__PURE__ */ jsxs("div", { className: `message-skeleton ${isOwnMessage ? "own-message" : ""}`, children: [
          !isOwnMessage && /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: "message-avatar-skeleton",
              height: 32,
              variant: "circular",
              width: 32
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "message-content-skeleton", children: [
            !isOwnMessage && /* @__PURE__ */ jsx(Skeleton, { className: "sender-skeleton", height: 16, variant: "text", width: 100 }),
            /* @__PURE__ */ jsx(
              Skeleton,
              {
                className: "text-skeleton",
                height: 20,
                variant: "text",
                width: isOwnMessage ? 200 : 180
              }
            ),
            /* @__PURE__ */ jsx(
              Skeleton,
              {
                className: "text-skeleton",
                height: 20,
                variant: "text",
                width: isOwnMessage ? 160 : 220
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "message-meta-skeleton", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "time-skeleton", height: 14, variant: "text", width: 60 }),
              isOwnMessage && /* @__PURE__ */ jsx(Skeleton, { className: "status-skeleton", height: 16, variant: "circular", width: 16 })
            ] })
          ] })
        ] }, `msg-${i}`)
      );
    }
    return messages;
  };
  return /* @__PURE__ */ jsx("div", { className: `chat-message-list-skeleton ${className}`, children: renderSkeletonMessages() });
};
export {
  ChatMessageListSkeleton as default
};
