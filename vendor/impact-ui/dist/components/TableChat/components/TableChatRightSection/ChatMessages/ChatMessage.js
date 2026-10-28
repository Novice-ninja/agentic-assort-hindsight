!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.chat-message{align-items:flex-start;box-sizing:border-box;display:flex;gap:8px;min-width:0;transition:transform .2s ease;width:100%}.chat-message.user-message{flex-direction:row-reverse}.chat-message.user-message>.message-content{align-items:flex-end;margin-left:48px;text-align:right}.chat-message.user-message .message-actions{justify-content:flex-end}.chat-message.assistant-message>.message-content{align-items:flex-start;margin-right:48px}.chat-message .message-header{align-items:center;display:flex;gap:6px;justify-content:flex-end}.chat-message .message-header .message-action-container{align-items:center;display:flex;gap:4px;margin-right:auto;max-width:0;opacity:0;overflow:hidden;pointer-events:none;transform:translate(6px);transition:opacity .25s ease,max-width .25s ease,transform .25s ease}.chat-message .message-header .message-action-container img,.chat-message .message-header .message-action-container svg{color:#b4bac7;cursor:pointer;transition:color .2s ease,transform .2s ease;width:14px}.chat-message .message-header .message-action-container.visibility-enabled{max-width:96px;opacity:1;pointer-events:auto;transform:translate(0)}.chat-message .message-header .message-action-info-container{align-items:center;display:flex;gap:8px}.chat-message .message-header .message-action-info-container svg{color:#b4bac7;cursor:pointer}.chat-message .message-header .message-action-info-container .message-action-info{color:#b4bac7;font-size:12px}.chat-message .message-header .message-action-info-container .message-timestamp{color:#60697d;font-size:11px;font-variant-numeric:tabular-nums;font-weight:500;letter-spacing:.02em;opacity:.85;white-space:nowrap}.chat-message .message-header .message-action-info-container .ia-styles.ia-btn.ia-btn-tertiary{background:#0000;border:none}.chat-message .flex-end{justify-content:flex-end!important}.chat-message.assistant-message .message-text,.chat-message.user-message .message-text{margin-left:0;margin-right:0}.chat-message>.message-content{display:flex;flex:0 1 auto;flex-direction:column;max-width:calc(100% - 40px);min-width:0;width:auto}.ia-styles.ia-menu.more-options-menu .MuiPaper-root{max-width:332px;min-width:220px}.delete_modal_txt{color:#0d152c;font-size:16px;font-style:normal;font-weight:800;line-height:24px}.delete_modal_subTxt{color:#60697d;font-size:12px;font-style:normal;font-weight:500;line-height:16px;text-align:center}.chat-message:hover .message-actions{opacity:1}.chat-message .message-action-container.visibility-enabled,.chat-message .message-text:hover .message-action-container{max-width:96px;opacity:1;pointer-events:auto;transform:translate(0)}')),document.head.appendChild(e)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { getAssetUrl } from "../../../../../utils/assetBase.js";
import { Menu } from "../../../../Menu/index.js";
import { Prompt } from "../../../../Prompt/index.js";
import ChatDefaultMessageType from "../ChatDefaultMessageType/ChatDefaultMessageType.js";
import { ChatDeletedMessageType } from "../ChatDeleteMessageType/ChatDeletedMessageType.js";
import ChatEditedMessageType from "../ChatEditedMessageType/ChatEditedMessageType.js";
import { ChatMessageAvatar } from "../ChatMessageAvatar/ChatMessageAvatar.js";

import { useTranslation } from "../../../../../i18n/useTranslation.js";
const EditIcon = getAssetUrl("icons/pencilIcon.svg");
const DeleteIcon = getAssetUrl("icons/deleteIcon.svg");
const ChatMessage = ({
  messageId,
  author,
  authorName,
  authorAvatar,
  content,
  timestamp,
  isUser = false,
  showActions = true,
  showAvatar = true,
  isDeleted = false,
  edited = false,
  deleted = false,
  onReply,
  onReact,
  onBookmark,
  onPin,
  pinned,
  onMore,
  onEdit,
  onMessageDelete,
  onRefetchMessages,
  type = "default",
  priority = "default",
  actions = [],
  className = "",
  onThreadClick,
  isThreadIconVisible,
  isPinChatIconvisible,
  isHighlighted = false,
  highlightColor = null
}) => {
  const { t } = useTranslation();
  const [moreOptionsAnchorEl, setMoreOptionsAnchorEl] = useState(null);
  const [moreOptionsMenuOpen, setMoreOptionsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const moreOptionsOptions = [
    // {
    //   label: "Reply",
    //   value: "reply",
    //   icon: <img src={ReplyIcon} alt="reply" />,
    //   onClick: () => {
    //     console.log("Reply");
    //   },
    // },
    {
      label: t("commentsPanel.edit"),
      value: "edit",
      icon: /* @__PURE__ */ jsx("img", { alt: "edit", src: EditIcon }),
      onClick: () => {
        if (onEdit) {
          onEdit();
        }
        setMoreOptionsMenuOpen(false);
      }
    },
    // {
    //   label: "Unpin",
    //   value: "unpin",
    //   icon: <img src={UnpinIcon} alt="unpin" />,
    //   onClick: () => {
    //     console.log("Unpin");
    //   },
    // },
    {
      label: t("commentsPanel.delete"),
      value: "delete",
      icon: /* @__PURE__ */ jsx("img", { alt: "delete", src: DeleteIcon }),
      onClick: () => {
        handleDeleteClick();
      }
    }
  ];
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setMoreOptionsMenuOpen(false);
  };
  const handleMsgDelete = async (messageId2) => {
    try {
      setDeleting(true);
      if (onMessageDelete) {
        const response = await onMessageDelete(messageId2);
        console.log("[ChatMessage] Message deleted successfully", response);
      }
      setShowDeleteModal(false);
    } catch (err) {
      console.error("[ChatMessage] Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };
  const messageClass = `chat-message ${isUser ? "user-message" : "assistant-message"} ${isHighlighted ? "highlighted-message" : ""} ${className}`;
  const handleClickOnMoreOptions = (e) => {
    e.stopPropagation();
    setMoreOptionsAnchorEl(e.currentTarget);
    setMoreOptionsMenuOpen(true);
  };
  const isMessageDeleted = isDeleted || deleted;
  const messageTypes = {
    deleted: /* @__PURE__ */ jsx(ChatDeletedMessageType, { isUser, timestamp }),
    default: /* @__PURE__ */ jsx(
      ChatDefaultMessageType,
      {
        content,
        edited,
        handleClickOnMoreOptions,
        highlightColor,
        isHighlighted,
        isPinChatIconvisible,
        isThreadIconVisible,
        isUser,
        pinned,
        priority,
        timestamp,
        visibility: moreOptionsMenuOpen,
        onPin,
        onThreadClick
      }
    ),
    editable: /* @__PURE__ */ jsx(
      ChatEditedMessageType,
      {
        content,
        edited,
        handleClickOnMoreOptions,
        isUser,
        pinned,
        priority,
        timestamp,
        onThreadClick
      }
    )
  };
  return /* @__PURE__ */ jsxs("div", { className: messageClass, children: [
    showAvatar && !isUser && /* @__PURE__ */ jsx(ChatMessageAvatar, { authorAvatar, authorName }),
    /* @__PURE__ */ jsxs("div", { className: "message-content", children: [
      messageTypes[isMessageDeleted ? "deleted" : type],
      /* @__PURE__ */ jsx(
        Menu,
        {
          anchorEl: moreOptionsAnchorEl,
          iconPlacement: "top",
          menuContainerClassName: "more-options-menu",
          open: moreOptionsMenuOpen,
          options: moreOptionsOptions,
          selected: "Edit",
          onClose: () => {
            console.log("onClose");
            setMoreOptionsMenuOpen(false);
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      Prompt,
      {
        handleClose: () => {
          setShowDeleteModal(false);
        },
        isOpen: showDeleteModal,
        primaryButtonLabel: deleting ? t("commentsPanel.deleting") : t("commentsPanel.delete"),
        secondaryButtonLabel: t("common.cancel"),
        title: t("tableChat.message.deleteConfirmTitle"),
        variant: "error",
        onPrimaryButtonClick: () => {
          handleMsgDelete(messageId);
        },
        onSecondaryButtonClick: () => {
          setShowDeleteModal(false);
        },
        children: t("tableChat.message.deleteConfirmMessage")
      }
    )
  ] });
};
export {
  ChatMessage
};
