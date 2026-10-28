!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.new-dynamic-layout-container{background-color:#fff;border-radius:24px!important;box-shadow:0 0 4px #ababab40;display:flex;flex-direction:column;top:0;right:24px;bottom:24px;left:24px;justify-content:center;position:absolute}.new-dynamic-layout-container .new-dynamic-layout-header{border-bottom:1px solid #d9dde7;display:flex;flex-direction:column;gap:8px;padding:24px}.new-dynamic-layout-container .new-dynamic-layout-header h1{color:#0d152c;font-size:24px;font-weight:800;line-height:36px}.new-dynamic-layout-container .new-dynamic-layout-header p{color:#7a8294;font-size:12px;font-weight:500;line-height:16px;text-transform:capitalize}.new-dynamic-layout-container .new-dynamic-layout-body{background-position:100% 0;background-repeat:no-repeat;background-size:contain;border-bottom-right-radius:24px;display:flex;flex:1;min-height:0;overflow:hidden;padding:24px}.new-dynamic-layout-container .new-dynamic-layout-body .left-panel{border-right:1px solid #d9dde7;padding-right:24px;width:var(--left-panel-width,220px)}.new-dynamic-layout-container .new-dynamic-layout-body .left-panel .left-panel-content{display:flex;flex-direction:column;height:100%;justify-content:space-between}.new-dynamic-layout-container .new-dynamic-layout-body .left-panel .left-panel-image{height:130px;margin:0 auto;width:132px}.new-dynamic-layout-container .new-dynamic-layout-body .right-column{display:flex;flex-direction:column;justify-content:space-between;min-height:0;padding-left:24px;width:calc(100% - var(--left-panel-width, 220px))}.new-dynamic-layout-container .new-dynamic-layout-body .right-column .right-content{display:flex;flex:1;flex-direction:column;min-height:0;overflow-x:hidden;overflow-y:auto}.new-dynamic-layout-container .new-dynamic-layout-body .right-column .new-dynamic-layout-footer{border-top:1px solid #d9dde7;display:flex;justify-content:space-between;padding-top:24px}.new-dynamic-layout-container .new-dynamic-layout-body .right-column .new-dynamic-layout-footer .footer-right-group{align-items:center;display:flex;gap:12px}@media screen and (min-width:1400px) and (max-width:1600px){.new-dynamic-layout-body{padding:20px}.left-panel-image{width:100%}}@media screen and (max-width:1399px){.new-dynamic-layout-body{padding:16px}.left-panel{flex-shrink:0;padding-right:16px;width:fit-content}.right-column{flex:1;padding-left:16px;width:auto}.left-panel-image{height:auto;max-width:132px;width:100%}}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useRef } from "react";

import { getAssetUrl } from "../../utils/assetBase.js";
import Box from "../../node_modules/@mui/material/Box/Box.js";
const NewDynamicLayout = ({
  title,
  description,
  leftPanel,
  rightContent,
  leftPanelWidth,
  className,
  footer,
  ...props
}) => {
  const contentRef = useRef(null);
  const contentBackgroundImage = getAssetUrl("images/review-tech-bg.webp");
  return /* @__PURE__ */ jsxs(Box, { className: `new-dynamic-layout-container ${className || ""}`, ...props, children: [
    /* @__PURE__ */ jsxs(Box, { className: "new-dynamic-layout-header", children: [
      /* @__PURE__ */ jsx("h1", { children: title }),
      description && /* @__PURE__ */ jsx("p", { children: description })
    ] }),
    /* @__PURE__ */ jsxs(
      Box,
      {
        className: "new-dynamic-layout-body",
        style: leftPanelWidth ? {
          "--left-panel-width": typeof leftPanelWidth === "number" ? `${leftPanelWidth}px` : leftPanelWidth
        } : void 0,
        sx: { backgroundImage: `url(${contentBackgroundImage})` },
        children: [
          /* @__PURE__ */ jsx(Box, { className: "left-panel", children: leftPanel }),
          /* @__PURE__ */ jsxs(Box, { className: "right-column", children: [
            /* @__PURE__ */ jsx(Box, { className: "right-content", children: React__default.cloneElement(rightContent, { contentRef }) }),
            footer && /* @__PURE__ */ jsx(Box, { className: "new-dynamic-layout-footer", children: footer })
          ] })
        ]
      }
    )
  ] });
};
export {
  NewDynamicLayout
};
