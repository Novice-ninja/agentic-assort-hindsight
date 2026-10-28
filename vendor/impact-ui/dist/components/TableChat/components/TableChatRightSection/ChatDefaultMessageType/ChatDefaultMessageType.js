!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.chat-message .message-text{background-color:#eceefd;border-radius:10px;box-shadow:0 1px 2px #0000000f;color:#1f2b4d;flex-shrink:0;font-size:14px;line-height:1.4;max-width:100%;overflow-wrap:break-word;padding:8px 12px;transition:box-shadow .25s ease,transform .2s ease,background-color .25s ease;white-space:pre-wrap;width:fit-content;word-break:normal}.chat-message .message-text:hover{box-shadow:0 2px 10px #00000014;transform:translateY(-1px)}.chat-message .message-text.highlighted-message-content{animation:highlightScalePulse 1.5s infinite;border:2px solid #4259ee;box-shadow:0 0 8px #4259ee4d}.chat-message .message-text .priority-container{align-items:center;display:flex;justify-content:flex-start;margin-bottom:12px}.chat-message .message-text .priority-container .priority-label{align-items:center;display:flex;font-size:14px;gap:4px}.chat-message .message-text.low{border-left:3px solid #31935f}.chat-message .message-text.medium{border-left:3px solid #e1bc29}.chat-message .message-text.high{border-left:3px solid #e15554}.chat-message .message-text.normal{border-left:3px solid #4259ee}.chat-message .message-text p{color:#60697d;font-size:14px;font-style:normal;font-weight:500;letter-spacing:.14px;line-height:160%;margin:0 0 4px;text-align:left}.chat-message .message-text p:last-child{margin-bottom:0}.chat-message .message-text .message-content{display:block;margin:0;max-width:100%;width:auto}.chat-message .message-text .message-content p{color:#60697d;font-size:14px;font-style:normal;font-weight:500;letter-spacing:.14px;line-height:160%;margin:0;text-align:left}.chat-message .message-text .message-content p:last-child{margin-bottom:0}.chat-message .message-text .message-content .mention{background-color:#4259ee1a;border:1px solid #4259ee4d;border-radius:4px;color:#4259ee;display:inline-block;font-weight:600;margin:0 2px;padding:0 6px;text-decoration:none;transition:all .2s ease}.chat-message .message-text .message-content .mention:hover{background-color:#4259ee26;border-color:#4259ee80}.chat-message .message-text .message-content strong{color:#60697d;font-weight:700}.chat-message .message-text .message-content em{color:#60697d;font-style:italic}.chat-message .message-text .message-content u{color:#60697d;text-decoration:underline}.chat-message .message-text .message-content mark{background-color:#fef3c7;border-radius:4px;color:#60697d;padding:2px 4px}.chat-message .message-text .message-content a{color:#4259ee;text-decoration:underline}.chat-message .message-text .message-content a:hover{color:#1531e8}.chat-message .message-text .message-content ol,.chat-message .message-text .message-content ul{margin:8px 0;padding-left:20px}.chat-message .message-text .message-content ol li,.chat-message .message-text .message-content ul li{color:#60697d;margin:4px 0}.chat-message .message-text .message-content h1,.chat-message .message-text .message-content h2,.chat-message .message-text .message-content h3,.chat-message .message-text .message-content h4,.chat-message .message-text .message-content h5,.chat-message .message-text .message-content h6{color:#60697d;font-weight:600;margin:12px 0 8px}.chat-message .message-text .message-content h1:first-child,.chat-message .message-text .message-content h2:first-child,.chat-message .message-text .message-content h3:first-child,.chat-message .message-text .message-content h4:first-child,.chat-message .message-text .message-content h5:first-child,.chat-message .message-text .message-content h6:first-child{margin-top:0}.chat-message .message-text .message-content h1{font-size:20px}.chat-message .message-text .message-content h2{font-size:18px}.chat-message .message-text .message-content h3{font-size:16px}.chat-message .message-text .message-content h4{font-size:15px}.chat-message .message-text .message-content h5{font-size:14px}.chat-message .message-text .message-content h6{font-size:13px}.chat-message .message-text .message-action-info-container{align-items:center;display:flex;gap:8px}.chat-message .message-text .message-action-info-container .pin-button{display:flex;transition:opacity .2s ease,transform .2s ease}.chat-message .message-text .message-action-info-container .pin-button-hover{display:flex;max-width:0;opacity:0;overflow:hidden;pointer-events:none;transform:scale(.85);transition:opacity .25s ease,max-width .25s ease,transform .25s ease}.chat-message .message-text:hover .message-action-info-container .pin-button-hover{max-width:32px;opacity:1;pointer-events:auto;transform:scale(1)}.chat-message .flex-end{justify-content:flex-end;min-height:24px}.chat-message.assistant-message .message-text{background:linear-gradient(92.25deg,#f8f9fb -.92%,#f2f4fb 98.11%);color:#60697d;transition:box-shadow .25s ease,transform .2s ease,background-color .25s ease}.chat-message.assistant-message .message-text:hover{box-shadow:0 2px 10px #0000000f;transform:translateY(-1px)}.message-header{align-items:center;display:flex;gap:6px;justify-content:flex-end;margin-top:4px;transition:gap .25s ease}.message-header .message-action-container{align-items:center;display:flex;gap:4px;margin-right:auto;max-width:0;opacity:0;overflow:hidden;pointer-events:none;transform:translate(6px);transition:opacity .25s ease,max-width .25s ease,transform .25s ease}.message-header .message-action-container img,.message-header .message-action-container svg{color:#b4bac7;cursor:pointer;transition:color .2s ease,transform .2s ease;width:14px}.message-header .message-action-container img:hover,.message-header .message-action-container svg:hover{color:#4259ee;transform:scale(1.08)}.message-header .message-action-container.visibility-enabled,.message-text:hover .message-action-container{max-width:96px;opacity:1;pointer-events:auto;transform:translate(0)}.btn_border_default{background-color:initial!important;border:none!important}.message-timestamp{color:#7a8294;font-size:11px;font-variant-numeric:tabular-nums;font-weight:500;letter-spacing:.02em;opacity:.85;white-space:nowrap}.message-timestamp .edited-label{color:#7a8294;font-style:italic;font-weight:400;opacity:.75}@keyframes highlightScalePulse{0%{box-shadow:0 0 #4259ee00;transform:scale(1)}30%{box-shadow:0 0 12px #4259ee99;transform:scale(1.03)}60%{box-shadow:0 0 10px #4259ee66;transform:scale(.98)}to{box-shadow:0 0 8px #4259ee4d;transform:scale(1)}}')),document.head.appendChild(e)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { getAssetUrl } from "../../../../../utils/assetBase.js";
import { Button } from "../../../../Button/index.js";

import { useTranslation } from "../../../../../i18n/useTranslation.js";
const ThreeDotIcon = getAssetUrl("icons/treedotIcon.svg");
const TreadChatIcon = getAssetUrl("icons/treadChatIcon.svg");
const PinnedIcon = getAssetUrl("icons/pinedIcon.svg");
const UnpinIcon = getAssetUrl("icons/unpinedIcon.svg");
const CheckBlueIcon = getAssetUrl("icons/checkBlueIcon.svg");
const WarningRedIcon = getAssetUrl("icons/warningRedIcon.svg");
const ThumbsUpYellowIcon = getAssetUrl("icons/thumbsUpYellowIcon.svg");
const NotAllowedGreenIcon = getAssetUrl("icons/notAllowedGreenIcon.svg");
const ChatDefaultMessageType = ({
  content,
  timestamp,
  handleClickOnMoreOptions,
  priority = "default",
  edited = false,
  onThreadClick,
  pinned,
  visibility,
  onPin,
  isUser = true,
  isThreadIconVisible,
  isPinChatIconvisible,
  isHighlighted = false,
  highlightColor = null
}) => {
  const { t } = useTranslation();
  const renderContent = (content2) => {
    if (typeof content2 === "string") {
      const hasHtmlTags = /<[^>]*>/g.test(content2);
      if (hasHtmlTags) {
        const sanitizedContent = DOMPurify.sanitize(content2, {
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
        return /* @__PURE__ */ jsx("div", { className: "message-content", dangerouslySetInnerHTML: { __html: sanitizedContent } });
      } else {
        return /* @__PURE__ */ jsx("p", { children: content2 });
      }
    } else {
      return content2;
    }
  };
  const [showPinned, setShowPinned] = useState(pinned);
  const customHighlightStyle = isHighlighted && highlightColor ? {
    borderColor: highlightColor,
    boxShadow: `0px 0px 8px ${highlightColor}40`
    // 40 is 25% opacity in hex
  } : {};
  const handlePin = async (isPinned) => {
    try {
      const pinnedResponse = await onPin(isPinned);
      setShowPinned(pinnedResponse == null ? void 0 : pinnedResponse.isPinned);
    } catch (error) {
      console.error("Error pinning message:", error);
    }
  };
  useEffect(() => {
    setShowPinned(pinned);
  }, [pinned]);
  const priorityContent = {
    normal: /* @__PURE__ */ jsxs("span", { className: "priority-label", children: [
      /* @__PURE__ */ jsx("img", { alt: "checkBlueIcon", src: CheckBlueIcon }),
      " ",
      t("tableChat.priority.normal")
    ] }),
    high: /* @__PURE__ */ jsxs("span", { className: "priority-label", children: [
      /* @__PURE__ */ jsx("img", { alt: "warningRedIcon", src: WarningRedIcon }),
      " ",
      t("tableChat.priority.high")
    ] }),
    medium: /* @__PURE__ */ jsxs("span", { className: "priority-label", children: [
      /* @__PURE__ */ jsx("img", { alt: "thumbsUpYellowIcon", src: ThumbsUpYellowIcon }),
      " ",
      t("tableChat.priority.medium")
    ] }),
    low: /* @__PURE__ */ jsxs("span", { className: "priority-label", children: [
      /* @__PURE__ */ jsx("img", { alt: "notAllowedGreenIcon", src: NotAllowedGreenIcon }),
      " ",
      t("tableChat.priority.low")
    ] })
  };
  const showPriority = priority && priority !== "default" && priorityContent[priority];
  const pinnedIconSrc = showPinned ? PinnedIcon : UnpinIcon;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `message-text ${priority} ${isHighlighted ? "highlighted-message-content" : ""}`,
      style: customHighlightStyle,
      children: [
        showPriority ? /* @__PURE__ */ jsx("section", { className: "priority-container", children: priorityContent[priority] }) : null,
        renderContent(content),
        /* @__PURE__ */ jsxs("div", { className: `message-header ${!isUser ? "flex-end" : ""}`, children: [
          isUser ? /* @__PURE__ */ jsxs("div", { className: `message-action-container ${visibility ? "visibility-enabled" : ""}`, children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "btn_border_default participants-button",
                icon: /* @__PURE__ */ jsx("img", { alt: "threedot", src: ThreeDotIcon }),
                iconPlacement: "left",
                size: "small",
                type: "default",
                variant: "tertiary",
                onClick: handleClickOnMoreOptions
              }
            ),
            isThreadIconVisible && /* @__PURE__ */ jsx(
              Button,
              {
                className: "btn_border_default participants-button",
                icon: /* @__PURE__ */ jsx("img", { alt: "thread", src: TreadChatIcon }),
                iconPlacement: "left",
                size: "large",
                type: "default",
                variant: "tertiary",
                onClick: onThreadClick
              }
            )
          ] }) : null,
          /* @__PURE__ */ jsxs("div", { className: "message-action-info-container", children: [
            /* @__PURE__ */ jsxs("div", { style: { display: !isPinChatIconvisible ? "none" : "inline" }, children: [
              showPinned && /* @__PURE__ */ jsx(
                Button,
                {
                  className: "pin-button",
                  icon: /* @__PURE__ */ jsx("img", { src: pinnedIconSrc }),
                  iconPlacement: "left",
                  size: "small",
                  type: "default",
                  variant: "tertiary",
                  onClick: () => {
                    handlePin(!showPinned);
                  }
                }
              ),
              !showPinned && /* @__PURE__ */ jsx(
                Button,
                {
                  className: "pin-button-hover",
                  icon: /* @__PURE__ */ jsx("img", { src: PinnedIcon }),
                  iconPlacement: "left",
                  size: "small",
                  type: "default",
                  variant: "tertiary",
                  onClick: () => {
                    handlePin(!showPinned);
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "message-timestamp", children: [
              timestamp,
              edited && /* @__PURE__ */ jsxs("span", { className: "edited-label", children: [
                " ",
                t("commentsPanel.edited")
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
};
export {
  ChatDefaultMessageType as default
};
