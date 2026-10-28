!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".pinned-panel{background:#fff;border-radius:10px;box-shadow:0 0 var(--Sizes-S-04,4px) 0 #0000001f;display:flex;flex-direction:column;height:100%;width:641px}.pinned-panel-header{align-items:center;border-bottom:1px solid #b3bdf8;display:flex;font-weight:600;height:64px;justify-content:space-between;padding:16px}.header-title{color:#0d152c;font-size:16px;font-style:normal;font-weight:800;line-height:24px}.close-btn{background:#0000;border:none;color:#3649c6;cursor:pointer;font-size:14px;font-weight:500}.pinned-panel-content{flex:1;overflow-y:auto;padding:16px}.pinned-title{color:#1f2b4d;font-size:14px;font-weight:500;font-weight:800;line-height:21px;margin-bottom:16px}.pinned-message{align-items:flex-start;background:linear-gradient(92deg,#f8f9fb -.92%,#f6f7fa 98.11%);border-radius:8px;cursor:pointer;display:flex;gap:12px;margin-bottom:12px;padding:12px}.pinned-avatar{align-items:center;background:#3bb273;border-radius:50%;color:#fff;display:flex;font-weight:600;height:36px;justify-content:center;width:36px}.pinned-info{flex:1}.pinned-meta{align-items:center;display:flex;font-size:14px;gap:8px}.pinned-meta .user-title{color:#1f2b4d;font-size:12px;font-style:normal;font-weight:700;line-height:20px}.pinned-meta span{color:#b4bac7;font-size:12px}.pinned-text{color:#1f2b4d;font-size:12px;font-style:normal;font-weight:700;line-height:20px;white-space:pre-wrap;word-break:break-word}.pinned-text .message-content-html p{color:#60697d;font-size:12px;font-weight:500;letter-spacing:.14px;line-height:160%;margin:0 0 8px}.pinned-text .message-content-html p:last-child{margin-bottom:0}.pinned-text .message-content-html .mention{background-color:#4259ee1a;border:1px solid #4259ee4d;border-radius:4px;color:#4259ee;display:inline-block;font-weight:600;margin:0 2px;padding:0 6px;text-decoration:none;transition:all .2s ease}.pinned-text .message-content-html .mention:hover{background-color:#4259ee26;border-color:#4259ee80}.pinned-text .message-content-html strong{color:#60697d;font-weight:700}.pinned-text .message-content-html em{color:#60697d;font-style:italic}.pinned-text .message-content-html u{color:#60697d;text-decoration:underline}.pinned-text .message-content-html s{color:#60697d;text-decoration:line-through}.pinned-text .message-content-html mark{background-color:#fef3c7;border-radius:4px;color:#60697d;padding:2px 4px}.pinned-text .message-content-html a{color:#4259ee;text-decoration:underline}.pinned-text .message-content-html a:hover{color:#1531e8}.pinned-text .message-content-html ol,.pinned-text .message-content-html ul{margin:8px 0;padding-left:20px}.pinned-text .message-content-html ol li,.pinned-text .message-content-html ul li{color:#60697d;font-size:12px;margin:4px 0}.pinned-text .message-content-html h1,.pinned-text .message-content-html h2,.pinned-text .message-content-html h3,.pinned-text .message-content-html h4,.pinned-text .message-content-html h5,.pinned-text .message-content-html h6{color:#60697d;font-weight:600;margin:12px 0 8px}.pinned-text .message-content-html h1:first-child,.pinned-text .message-content-html h2:first-child,.pinned-text .message-content-html h3:first-child,.pinned-text .message-content-html h4:first-child,.pinned-text .message-content-html h5:first-child,.pinned-text .message-content-html h6:first-child{margin-top:0}.pinned-text .message-content-html h1{font-size:18px}.pinned-text .message-content-html h2{font-size:16px}.pinned-text .message-content-html h3{font-size:15px}.pinned-text .message-content-html h4{font-size:14px}.pinned-text .message-content-html h5{font-size:13px}.pinned-text .message-content-html h6{font-size:12px}.user-titel{color:#1f2b4d!important;font-weight:700;line-height:20px}.time-stamp,.user-titel{font-size:12px;font-style:normal}.time-stamp{color:#7a8294}.pinned-time,.time-stamp{font-weight:500;line-height:16px}.pinned-time{color:#7a8294!important;font-size:12px;font-style:normal}.thread-message{align-items:flex-start;display:flex;margin:16px 0}.thread-message .thread-info{background:linear-gradient(92deg,#f8f9fb -.92%,#f6f7fa 98.11%);border-radius:12px;box-shadow:0 1px 3px #00000014;display:flex;flex-direction:column;gap:8px;margin-left:8px;max-width:80%;padding:12px 16px;width:100%}.thread-message .thread-meta{display:flex;justify-content:space-between;margin-bottom:4px}.thread-message .thread-meta .user-title{color:#1f2b4d;font-size:16px;font-style:normal;font-weight:600;line-height:24px}.thread-message .thread-quote{background:#fff;border-radius:8px;color:#60697d;font-size:14px;font-style:normal;font-weight:500;letter-spacing:.14px;line-height:160%;white-space:pre-wrap;word-break:break-word}.thread-message .thread-quote .message-content-html p{color:#60697d;font-size:14px;font-weight:500;line-height:160%;margin:0 0 8px}.thread-message .thread-quote .message-content-html p:last-child{margin-bottom:0}.thread-message .thread-quote .message-content-html .mention{background-color:#4259ee1a;border:1px solid #4259ee4d;border-radius:4px;color:#4259ee;display:inline-block;font-weight:600;margin:0 2px;padding:0 6px;text-decoration:none;transition:all .2s ease}.thread-message .thread-quote .message-content-html .mention:hover{background-color:#4259ee26;border-color:#4259ee80}.thread-message .thread-quote .message-content-html strong{font-weight:700}.thread-message .thread-quote .message-content-html em{font-style:italic}.thread-message .thread-quote .message-content-html u{text-decoration:underline}.thread-message .thread-quote .message-content-html s{text-decoration:line-through}.thread-message .thread-quote .message-content-html mark{background-color:#fef3c7;border-radius:4px;padding:2px 4px}.thread-message .thread-quote .message-content-html a{color:#4259ee;text-decoration:underline}.thread-message .thread-quote .message-content-html a:hover{color:#1531e8}.thread-message .thread-text{color:#1f2b4d;font-size:14px;font-style:normal;font-weight:500;letter-spacing:.14px;line-height:160%;margin-left:8px;white-space:pre-wrap;word-break:break-word}.thread-message .thread-text .message-content-html p{color:#60697d;font-size:14px;font-weight:500;letter-spacing:.14px;line-height:160%;margin:0 0 8px}.thread-message .thread-text .message-content-html p:last-child{margin-bottom:0}.thread-message .thread-text .message-content-html .mention{background-color:#4259ee1a;border:1px solid #4259ee4d;border-radius:4px;color:#4259ee;display:inline-block;font-weight:600;margin:0 2px;padding:0 6px;text-decoration:none;transition:all .2s ease}.thread-message .thread-text .message-content-html .mention:hover{background-color:#4259ee26;border-color:#4259ee80}.thread-message .thread-text .message-content-html strong{color:#60697d;font-weight:700}.thread-message .thread-text .message-content-html em{color:#60697d;font-style:italic}.thread-message .thread-text .message-content-html u{color:#60697d;text-decoration:underline}.thread-message .thread-text .message-content-html s{color:#60697d;text-decoration:line-through}.thread-message .thread-text .message-content-html mark{background-color:#fef3c7;border-radius:4px;color:#60697d;padding:2px 4px}.thread-message .thread-text .message-content-html a{color:#4259ee;text-decoration:underline}.thread-message .thread-text .message-content-html a:hover{color:#1531e8}.thread-message .thread-text .message-content-html ol,.thread-message .thread-text .message-content-html ul{margin:8px 0;padding-left:20px}.thread-message .thread-text .message-content-html ol li,.thread-message .thread-text .message-content-html ul li{color:#60697d;font-size:14px;margin:4px 0}.thread-message .thread-text .message-content-html h1,.thread-message .thread-text .message-content-html h2,.thread-message .thread-text .message-content-html h3,.thread-message .thread-text .message-content-html h4,.thread-message .thread-text .message-content-html h5,.thread-message .thread-text .message-content-html h6{color:#60697d;font-weight:600;margin:12px 0 8px}.thread-message .thread-text .message-content-html h1:first-child,.thread-message .thread-text .message-content-html h2:first-child,.thread-message .thread-text .message-content-html h3:first-child,.thread-message .thread-text .message-content-html h4:first-child,.thread-message .thread-text .message-content-html h5:first-child,.thread-message .thread-text .message-content-html h6:first-child{margin-top:0}.thread-message .thread-text .message-content-html h1{font-size:20px}.thread-message .thread-text .message-content-html h2{font-size:18px}.thread-message .thread-text .message-content-html h3{font-size:16px}.thread-message .thread-text .message-content-html h4{font-size:15px}.thread-message .thread-text .message-content-html h5{font-size:14px}.thread-message .thread-text .message-content-html h6{font-size:13px}.thread-message .thread-time{color:#60697d;font-size:12px;font-style:normal;font-weight:500;letter-spacing:.12px;line-height:160%;text-align:right}.thread-input input{border:1px solid #ddd;border-radius:12px;flex:1;font-size:14px;height:56px;outline:none;padding:8px 12px}.thread-input input:focus{border-color:#4259ee}.thread-input .send-btn{background:#4259ee;border:none;border-radius:50%;color:#fff;cursor:pointer;font-size:16px;height:36px;width:36px}.thread_title{color:#1f2b4d;font-size:16px;font-style:normal;font-weight:600;line-height:24px}.thread-quote-container{background:#fff;padding:8px}.pinned-message .deleted-message-content,.thread-message .deleted-message-content{align-items:center;color:#b4bac7;display:flex;font-size:14px;gap:8px;margin-top:4px}.pinned-message .deleted-message-content .delete-icon,.thread-message .deleted-message-content .delete-icon{color:#b4bac7;font-size:16px}.pinned-message .deleted-message-content .deleted-text,.thread-message .deleted-message-content .deleted-text{font-size:12px;font-style:italic;font-weight:500}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import default_1 from "../../../../../node_modules/@mui/icons-material/Block.js";
import DOMPurify from "dompurify";
import { getAssetUrl } from "../../../../../utils/assetBase.js";
import { Avatar } from "../../../../Avatar/index.js";
import { ChatAvatar } from "../AvatarGroup/AvatarGroup.js";
import { ChatInput } from "../ChatInput/ChatInput.js";

import { useTranslation } from "../../../../../i18n/useTranslation.js";
const DEFAULT_CHAT_AVATAR = getAssetUrl("avatar_sample.webp");
const renderContent = (content) => {
  if (!content) return null;
  if (typeof content === "string") {
    const hasHtmlTags = /<[^>]*>/g.test(content);
    if (hasHtmlTags) {
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          "p",
          "span",
          "strong",
          "em",
          "u",
          "br",
          "a",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "s",
          "mark"
        ],
        ALLOWED_ATTR: [
          "class",
          "data-type",
          "data-id",
          "data-label",
          "data-mention-suggestion-char",
          "href",
          "target",
          "rel"
        ]
      });
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "message-content-html",
          dangerouslySetInnerHTML: { __html: sanitizedContent }
        }
      );
    } else {
      return /* @__PURE__ */ jsx("span", { children: content });
    }
  } else {
    return content;
  }
};
const MessageItem = ({ type, msg, onMessageClick }) => {
  const { t } = useTranslation();
  const isPinned = type === "pinned";
  const isDeleted = (msg == null ? void 0 : msg.type) === "deleted" || (msg == null ? void 0 : msg.deleted) === true;
  const handleClick = () => {
    if (onMessageClick && (msg == null ? void 0 : msg.id)) {
      onMessageClick(msg.id);
    }
  };
  if (isDeleted) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: isPinned ? "pinned-message" : "thread-message",
        style: { cursor: "pointer" },
        onClick: handleClick,
        children: [
          isPinned ? /* @__PURE__ */ jsx(
            Avatar,
            {
              label: msg == null ? void 0 : msg.userInitials,
              size: "small",
              src: (msg == null ? void 0 : msg.src) || DEFAULT_CHAT_AVATAR,
              type: "withoutPicture"
            }
          ) : /* @__PURE__ */ jsx(ChatAvatar, { name: msg == null ? void 0 : msg.userInitials, size: "sm", src: (msg == null ? void 0 : msg.src) || DEFAULT_CHAT_AVATAR }),
          /* @__PURE__ */ jsxs("div", { className: isPinned ? "pinned-info" : "thread-info", children: [
            isPinned && /* @__PURE__ */ jsxs("div", { className: "pinned-meta", children: [
              /* @__PURE__ */ jsx("span", { className: "user-title", children: msg.senderName }),
              type === "pinned" && /* @__PURE__ */ jsx("span", { className: "pinned-time", children: msg.timestamp })
            ] }),
            /* @__PURE__ */ jsx("div", { className: isPinned ? "pinned-text" : "thread-text", children: /* @__PURE__ */ jsxs("div", { className: "deleted-message-content", children: [
              /* @__PURE__ */ jsx(default_1, { className: "delete-icon" }),
              /* @__PURE__ */ jsx("span", { className: "deleted-text", children: t("tableChat.pinned.deletedByAuthor") })
            ] }) }),
            type === "thread" && /* @__PURE__ */ jsx("span", { className: "thread-time", children: msg.timestamp })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: isPinned ? "pinned-message" : "thread-message",
      style: { cursor: "pointer" },
      onClick: handleClick,
      children: [
        isPinned ? /* @__PURE__ */ jsx(
          Avatar,
          {
            label: msg == null ? void 0 : msg.userInitials,
            size: "small",
            src: (msg == null ? void 0 : msg.src) || DEFAULT_CHAT_AVATAR,
            type: "withoutPicture"
          }
        ) : /* @__PURE__ */ jsx(ChatAvatar, { name: msg == null ? void 0 : msg.userInitials, size: "sm", src: (msg == null ? void 0 : msg.src) || DEFAULT_CHAT_AVATAR }),
        /* @__PURE__ */ jsxs("div", { className: isPinned ? "pinned-info" : "thread-info", children: [
          isPinned && /* @__PURE__ */ jsxs("div", { className: "pinned-meta", children: [
            /* @__PURE__ */ jsx("span", { className: "user-title", children: msg.senderName }),
            type === "pinned" && /* @__PURE__ */ jsx("span", { className: "pinned-time", children: msg.timestamp })
          ] }),
          !isPinned && msg.quote && /* @__PURE__ */ jsxs("div", { className: "thread-quote-container", children: [
            /* @__PURE__ */ jsx("p", { className: "thread_title", children: msg.senderName }),
            /* @__PURE__ */ jsx("blockquote", { className: "thread-quote", children: renderContent(msg.quote) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: isPinned ? "pinned-text" : "thread-text", children: renderContent(msg.content) }),
          type === "thread" && /* @__PURE__ */ jsxs("span", { className: "thread-time", children: [
            msg.timestamp,
            msg.edited && /* @__PURE__ */ jsxs("span", { className: "edited-label", children: [
              " ",
              t("commentsPanel.edited")
            ] })
          ] })
        ] })
      ]
    }
  );
};
const PinnedPanel = ({
  type = "pinned",
  // "pinned" or "thread"
  messages = [],
  onClose,
  onMessageClick
  // Handler when a message is clicked
}) => {
  const { t } = useTranslation();
  const isPinned = type === "pinned";
  return /* @__PURE__ */ jsxs("div", { className: "pinned-panel", children: [
    /* @__PURE__ */ jsxs("div", { className: "pinned-panel-header", children: [
      /* @__PURE__ */ jsx("h1", { className: "header-title", children: isPinned ? t("tableChat.pinned.pinnedTitle") : t("tableChat.pinned.threadTitle") }),
      /* @__PURE__ */ jsx("button", { className: "close-btn", onClick: onClose, children: isPinned ? t("common.close") : t("tableChat.pinned.closeThread") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pinned-panel-content", children: [
      isPinned && /* @__PURE__ */ jsx("h4", { className: "pinned-title", children: t("tableChat.pinned.pinnedMessage") }),
      messages.map((msg, idx) => /* @__PURE__ */ jsx(MessageItem, { msg, type, onMessageClick }, msg.id))
    ] }),
    type === "thread" && /* @__PURE__ */ jsx(
      ChatInput,
      {
        maxLength: 500,
        placeholder: t("tableChat.pinned.threadMsgPlaceholder"),
        quickActionLabel: t("tableChat.input.quickAction"),
        showFormatting: true,
        showQuickAction: true,
        value: "",
        onAttach: "",
        onChange: () => {
        },
        onEmojiClick: () => {
        },
        onImageUpload: "",
        onSend: () => {
        }
      }
    )
  ] });
};
export {
  PinnedPanel
};
