!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".message-avatar{flex-shrink:0}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx } from "react/jsx-runtime";

import { ChatAvatar } from "../AvatarGroup/AvatarGroup.js";
const ChatMessageAvatar = ({ authorName, authorAvatar }) => {
  return /* @__PURE__ */ jsx("div", { className: "message-avatar", children: /* @__PURE__ */ jsx(ChatAvatar, { name: authorName, size: "sm", src: authorAvatar }) });
};
export {
  ChatMessageAvatar
};
