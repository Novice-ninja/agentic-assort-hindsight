!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.dropdown-menu{background:#fff;border-radius:8px;box-shadow:0 4px 12px #0000001a;display:flex;flex-direction:column;max-height:250px;min-width:180px;overflow:auto;padding:8px;position:relative}.dropdown-menu .mention-item{align-items:center;background-color:initial;border:none;border-radius:4px;color:#0d152c;cursor:pointer;display:flex;font-size:14px;gap:12px;padding:8px 12px;text-align:left;transition:all .2s ease;width:100%}.dropdown-menu .mention-item .mention-avatar{align-items:center;display:flex;justify-content:center}.dropdown-menu .mention-item .mention-info{display:flex;flex:1;flex-direction:column;gap:2px}.dropdown-menu .mention-item .mention-name{font-weight:400;line-height:1.2}.dropdown-menu .mention-item .mention-status{font-size:11px;font-weight:400;line-height:1;opacity:.7;text-transform:capitalize}.dropdown-menu .mention-item .mention-status.online{color:#22c55e}.dropdown-menu .mention-item .mention-status.offline{color:#b4bac7}.dropdown-menu .mention-item:hover,.dropdown-menu .mention-item:hover.is-selected{background-color:#f5f5f5}.dropdown-menu .mention-item.is-selected{background-color:#f0f0f0;font-weight:500}.dropdown-menu .mention-item:focus{box-shadow:0 0 0 2px #4259ee33;outline:none}.dropdown-menu .item{color:#b4bac7;font-size:14px;padding:8px 12px;text-align:center}.dropdown-menu .mention-loading{align-items:center;color:#b4bac7;display:flex;font-size:14px;gap:8px;padding:12px;text-align:center}.dropdown-menu .mention-loading .loading-spinner{animation:spin 1s linear infinite;border:2px solid #f5f5f5;border-radius:50%;border-top-color:#4259ee;height:16px;width:16px}.dropdown-menu .mention-error{color:#ef4444;font-size:14px;padding:12px;text-align:center}.dropdown-menu .mention-no-result{color:#b4bac7;font-size:14px;padding:12px;text-align:center}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.dropdown-menu::-webkit-scrollbar{width:6px}.dropdown-menu::-webkit-scrollbar-track{background:#f5f5f5;border-radius:3px}.dropdown-menu::-webkit-scrollbar-thumb{background:#d4d4d4;border-radius:3px}.dropdown-menu::-webkit-scrollbar-thumb:hover{background:#c7c7c7}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";

import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { ChatAvatar } from "../TableChatRightSection/AvatarGroup/AvatarGroup.js";
import { useTranslation } from "../../../../i18n/useTranslation.js";
const MentionList = forwardRef((props, ref) => {
  var _a;
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      props.command({
        id: item.id,
        label: item.name
      });
    }
  };
  const upHandler = () => {
    if (props.items.length === 0) return;
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };
  const downHandler = () => {
    if (props.items.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };
  const enterHandler = () => {
    selectItem(selectedIndex);
  };
  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);
  useEffect(() => {
    if (props.items && typeof props.items.then === "function") {
      setIsLoading(true);
      props.items.finally(() => {
        setIsLoading(false);
      });
    }
  }, [props.items]);
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }
      return false;
    }
  }));
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "dropdown-menu", children: /* @__PURE__ */ jsxs("div", { className: "mention-loading", children: [
      /* @__PURE__ */ jsx("div", { className: "loading-spinner" }),
      /* @__PURE__ */ jsx("span", { children: t("tableChat.mention.loadingUsers") })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "dropdown-menu", children: ((_a = props.items) == null ? void 0 : _a.length) ? props.items.map((item, index) => /* @__PURE__ */ jsxs(
    "button",
    {
      className: `mention-item ${index === selectedIndex ? "is-selected" : ""}`,
      onClick: () => {
        selectItem(index);
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "mention-avatar", children: /* @__PURE__ */ jsx(ChatAvatar, { name: item.name, size: "sm", src: item.avatar }) }),
        /* @__PURE__ */ jsxs("div", { className: "mention-info", children: [
          /* @__PURE__ */ jsx("span", { className: "mention-name", children: item == null ? void 0 : item.name }),
          item.status && /* @__PURE__ */ jsx("span", { className: "mention-status", children: item.status })
        ] })
      ]
    },
    item.id || index
  )) : /* @__PURE__ */ jsx("div", { className: "mention-no-result", children: t("tableChat.mention.noUsersFound") }) });
});
export {
  MentionList
};
