!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.content-wrapper{flex:1;min-height:100%}.form-section{width:100%}.form-section .form-section-title{color:#0d152c;font-size:16px;font-weight:600;margin-bottom:12px}.form-section .form-filter-block{background:#f7f9fd;border-radius:8px;margin-top:20px;padding:12px}.form-section .form-filter-block .form-filter-title{color:#0d152c;font-size:14px;font-weight:600;margin-bottom:16px}.form-section .form-filter-block .form-filter-fields{display:flex;flex-wrap:wrap;gap:24px}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { memo } from "react";
import default_1 from "../../node_modules/@mui/icons-material/ChevronLeft.js";
import default_1$1 from "../../node_modules/@mui/icons-material/ChevronRight.js";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Button } from "../Button/index.js";
import { NewDynamicLayout } from "../NewDynamicLayout/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
const createFlowImage = getAssetUrl("icons/create-item-flow-img.webp");
const LeftPanelContent = ({ leftPanelContent, leftPanelImage }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "left-panel-content", children: [
    leftPanelContent,
    leftPanelImage ? leftPanelImage : /* @__PURE__ */ jsx(
      "img",
      {
        alt: t("createItemFlow.imageAlt"),
        className: "left-panel-image",
        src: createFlowImage
      }
    )
  ] });
};
const RightContentPanel = ({ contentRef, children }) => /* @__PURE__ */ jsx("div", { ref: contentRef, className: "content-wrapper", children });
const NewCreateItemFlowComponent = ({
  leftPanelWidth,
  leftPanelContent = null,
  leftPanelImage = null,
  rightContent,
  title,
  description = "",
  prevButtonProps = {},
  extraButtonProp,
  nextButtonProps = {},
  customCSS,
  className
}) => {
  const { t } = useTranslation();
  const {
    children: prevLabel = t("createItemFlow.back"),
    icon: prevIcon,
    ...restPrevProps
  } = prevButtonProps;
  const {
    children: nextLabel = t("createItemFlow.next"),
    icon: nextIcon,
    ...restNextProps
  } = nextButtonProps;
  const resolvedTitle = title ?? t("createItemFlow.defaultTitle");
  return /* @__PURE__ */ jsx(
    NewDynamicLayout,
    {
      className,
      description,
      footer: /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: "icon" in prevButtonProps ? prevIcon : /* @__PURE__ */ jsx(default_1, {}),
            variant: restPrevProps.variant ?? "tertiary",
            ...restPrevProps,
            children: prevLabel
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "footer-right-group", children: [
          extraButtonProp,
          /* @__PURE__ */ jsx(
            Button,
            {
              icon: "icon" in nextButtonProps ? nextIcon : /* @__PURE__ */ jsx(default_1$1, {}),
              iconPlacement: nextButtonProps.iconPlacement ?? "right",
              variant: restNextProps.variant ?? "primary",
              ...restNextProps,
              children: nextLabel
            }
          )
        ] })
      ] }),
      leftPanel: /* @__PURE__ */ jsx(LeftPanelContent, { leftPanelContent, leftPanelImage }),
      leftPanelWidth,
      rightContent: /* @__PURE__ */ jsx(RightContentPanel, { children: rightContent }),
      style: customCSS,
      title: resolvedTitle
    }
  );
};
const NewCreateItemFlow = memo(NewCreateItemFlowComponent);
NewCreateItemFlow.displayName = "NewCreateItemFlow";
export {
  NewCreateItemFlow
};
