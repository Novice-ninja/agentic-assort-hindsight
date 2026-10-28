!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.avatar-stack-container{align-items:center;background-color:#f0f0f0;display:flex;flex-direction:column;font-family:Inter,sans-serif;gap:2rem;justify-content:center;min-height:100vh}.avatar-stack{display:flex;gap:8px}.avatar-wrapper{position:relative}.avatar-wrapper:not(:first-child){margin-left:-20px}.avatar-wrapper--sm:not(:first-child){margin-left:-15px}.avatar-wrapper--md:not(:first-child){margin-left:-20px}.avatar-wrapper--lg:not(:first-child){margin-left:-30px}.avatar{align-items:center;background-color:#31935f;border-color:#fff;border-radius:50%;border-style:solid;color:#fff;display:flex;font-weight:600;justify-content:center;overflow:hidden;position:relative}.avatar img{height:100%;object-fit:cover;width:100%}.avatar__initials{text-transform:uppercase}.avatar--sm{font-size:12px;height:24px;width:24px}.avatar--md{font-size:16px;height:32px;width:32px}.avatar--lg{font-size:20px;height:36px;width:36px}.avatar--more{background-color:#f1f3fe;border-color:#b3bdf8;color:#4259ee;font-size:12px;font-weight:500}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";

import { useTranslation } from "../../../../../i18n/useTranslation.js";
const getInitials = (name = "") => {
  const [firstName, lastName] = name.split(" ");
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }
  return name.charAt(0);
};
const getAvatarColor = (name = "") => {
  const colors = [
    "#FF6B6B",
    // Red
    "#4ECDC4",
    // Teal
    "#45B7D1",
    // Blue
    "#96CEB4",
    // Green
    "#FFEAA7",
    // Yellow
    "#DDA0DD",
    // Plum
    "#98D8C8",
    // Mint
    "#F7DC6F",
    // Light Yellow
    "#BB8FCE",
    // Light Purple
    "#85C1E9",
    // Light Blue
    "#F8C471",
    // Orange
    "#82E0AA",
    // Light Green
    "#F1948A",
    // Light Red
    "#85929E",
    // Gray
    "#D7BDE2",
    // Lavender
    "#1A237E",
    // Deep Purple
    "#283593",
    // Indigo
    "#283593"
    // Indigo
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};
const ChatAvatar = ({ src, name, size }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [src]);
  const handleError = () => {
    setHasError(true);
  };
  const showImage = src && !hasError;
  const avatarColor = getAvatarColor(name);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `avatar avatar--${size}`,
      style: !showImage ? { backgroundColor: avatarColor } : {},
      title: name,
      children: showImage ? /* @__PURE__ */ jsx("img", { alt: name, src, onError: handleError }) : /* @__PURE__ */ jsx("span", { className: "avatar__initials", children: getInitials(name) })
    }
  );
};
const MoreAvatar = ({ count, size }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `avatar avatar--${size} avatar--more`,
      title: t("tableChat.avatar.more", { count }),
      children: /* @__PURE__ */ jsxs("span", { children: [
        "+",
        count
      ] })
    }
  );
};
const AvatarGroup = ({ avatars = [], maxAvatars = 3, size = "md" }) => {
  const effectiveMaxAvatars = Math.min(Math.max(1, maxAvatars), avatars.length);
  const visibleAvatars = avatars.slice(0, effectiveMaxAvatars);
  const hiddenAvatarsCount = Math.max(0, avatars.length - effectiveMaxAvatars);
  return /* @__PURE__ */ jsxs("div", { className: "avatar-stack", children: [
    visibleAvatars.map((user, index) => {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `avatar-wrapper avatar-wrapper--${size}`,
          style: { zIndex: index },
          children: /* @__PURE__ */ jsx(ChatAvatar, { name: user.label, size, src: user.url })
        },
        user.id || index
      );
    }),
    hiddenAvatarsCount > 0 && /* @__PURE__ */ jsx(
      "div",
      {
        className: `avatar-wrapper avatar-wrapper--${size}`,
        style: { zIndex: visibleAvatars.length + 1 },
        children: /* @__PURE__ */ jsx(MoreAvatar, { count: hiddenAvatarsCount, size })
      }
    )
  ] });
};
export {
  ChatAvatar,
  AvatarGroup as default
};
