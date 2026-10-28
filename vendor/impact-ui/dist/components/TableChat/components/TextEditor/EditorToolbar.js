!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.editor-toolbar{align-items:center;background-color:var(--toolbar-bg,#fff);display:flex;flex-wrap:wrap;gap:8px;padding:8px}.editor-toolbar .format-button{border-radius:4px;color:var(--icon-color,#60697d);padding:4px;transition:all .2s ease}.editor-toolbar .format-button:hover{background-color:var(--hover-bg,#f5f5f5)}.editor-toolbar .format-button.is-active{background-color:var(--active-bg,#e2f4ff);color:var(--active-color,#4259ee)}.editor-toolbar .format-button:disabled{cursor:not-allowed;opacity:.5;pointer-events:none}.editor-toolbar .format-group{border-right:1px solid var(--border-color,#f0f0f0);display:flex;gap:4px;padding:0 4px}.editor-toolbar .format-group:last-child{border-right:none}@media (max-width:768px){.editor-toolbar{gap:4px;padding:4px}.editor-toolbar .format-button{padding:3px}.editor-toolbar .format-group{padding:0 2px}}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import React__default from "react";
import default_1 from "../../../../node_modules/@mui/icons-material/AttachFile.js";
import default_1$9 from "../../../../node_modules/@mui/icons-material/Brush.js";
import default_1$f from "../../../../node_modules/@mui/icons-material/FormatBold.js";
import default_1$e from "../../../../node_modules/@mui/icons-material/FormatItalic.js";
import default_1$c from "../../../../node_modules/@mui/icons-material/FormatListBulleted.js";
import default_1$b from "../../../../node_modules/@mui/icons-material/FormatListNumbered.js";
import default_1$1 from "../../../../node_modules/@mui/icons-material/Image.js";
import default_1$2 from "../../../../node_modules/@mui/icons-material/InsertEmoticon.js";
import default_1$d from "../../../../node_modules/@mui/icons-material/Link.js";
import default_1$6 from "../../../../node_modules/@mui/icons-material/Looks3.js";
import default_1$5 from "../../../../node_modules/@mui/icons-material/Looks4.js";
import default_1$4 from "../../../../node_modules/@mui/icons-material/Looks5.js";
import default_1$3 from "../../../../node_modules/@mui/icons-material/Looks6.js";
import default_1$8 from "../../../../node_modules/@mui/icons-material/LooksOne.js";
import default_1$7 from "../../../../node_modules/@mui/icons-material/LooksTwo.js";
import default_1$a from "../../../../node_modules/@mui/icons-material/StrikethroughS.js";
import { ChatIconButton } from "../TableChatLeftSection/ChatIconButton/ChatIconButton.js";

import { useTranslation } from "../../../../i18n/useTranslation.js";
const TOOLBAR_ITEMS = {
  bold: {
    icon: default_1$f,
    ariaLabel: "tableChat.toolbar.bold",
    command: "toggleBold"
  },
  italic: {
    icon: default_1$e,
    ariaLabel: "tableChat.toolbar.italic",
    command: "toggleItalic"
  },
  link: {
    icon: default_1$d,
    ariaLabel: "tableChat.toolbar.addLink",
    command: "toggleLink"
  },
  bulletList: {
    icon: default_1$c,
    ariaLabel: "tableChat.toolbar.bulletList",
    command: "toggleBulletList"
  },
  orderedList: {
    icon: default_1$b,
    ariaLabel: "tableChat.toolbar.numberedList",
    command: "toggleOrderedList"
  },
  strike: {
    icon: default_1$a,
    ariaLabel: "tableChat.toolbar.strikeThrough",
    command: "toggleStrike"
  },
  highlight: {
    icon: default_1$9,
    ariaLabel: "tableChat.toolbar.highlight",
    command: "toggleHighlight"
  },
  h1: {
    icon: default_1$8,
    ariaLabel: "tableChat.toolbar.heading1",
    command: "toggleH1"
  },
  h2: {
    icon: default_1$7,
    ariaLabel: "tableChat.toolbar.heading2",
    command: "toggleH2"
  },
  h3: {
    icon: default_1$6,
    ariaLabel: "tableChat.toolbar.heading3",
    command: "toggleH3"
  },
  h4: {
    icon: default_1$5,
    ariaLabel: "tableChat.toolbar.heading4",
    command: "toggleH4"
  },
  h5: {
    icon: default_1$4,
    ariaLabel: "tableChat.toolbar.heading5",
    command: "toggleH5"
  },
  h6: {
    icon: default_1$3,
    ariaLabel: "tableChat.toolbar.heading6",
    command: "toggleH6"
  }
};
const EditorToolbar = React__default.forwardRef(
  ({
    editor,
    activeStates = {},
    enabledItems = Object.keys(TOOLBAR_ITEMS),
    onFileSelect,
    onImageSelect,
    onEmojiSelect,
    className = ""
  }, ref) => {
    const { t } = useTranslation();
    const fileInputRef = React__default.useRef(null);
    const imageInputRef = React__default.useRef(null);
    React__default.useImperativeHandle(ref, () => ({
      fileInput: fileInputRef.current,
      imageInput: imageInputRef.current
    }));
    const handleCommand = React__default.useCallback(
      (command) => {
        console.log("EditorToolbar - editor[command]:", editor == null ? void 0 : editor[command]);
        if (editor == null ? void 0 : editor[command]) {
          editor[command]();
        } else {
          console.warn(`Command ${command} not available on editor:`, editor);
        }
      },
      [editor]
    );
    return /* @__PURE__ */ jsxs("div", { className: `editor-toolbar ${className}`, children: [
      onFileSelect && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileInputRef,
            accept: ".pdf,.doc,.docx,.txt,.xls,.xlsx",
            style: { display: "none" },
            type: "file",
            onChange: onFileSelect
          }
        ),
        /* @__PURE__ */ jsx(
          ChatIconButton,
          {
            ariaLabel: t("tableChat.toolbar.attachFile"),
            className: "format-button",
            icon: /* @__PURE__ */ jsx(default_1, { fontSize: "small", style: { width: "16px", height: "16px" } }),
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            }
          }
        )
      ] }),
      onImageSelect && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: imageInputRef,
            accept: "image/*",
            style: { display: "none" },
            type: "file",
            onChange: onImageSelect
          }
        ),
        /* @__PURE__ */ jsx(
          ChatIconButton,
          {
            ariaLabel: t("tableChat.toolbar.uploadImage"),
            className: "format-button",
            icon: /* @__PURE__ */ jsx(default_1$1, { fontSize: "small", style: { width: "16px", height: "16px" } }),
            onClick: () => {
              var _a;
              return (_a = imageInputRef.current) == null ? void 0 : _a.click();
            }
          }
        )
      ] }),
      onEmojiSelect && /* @__PURE__ */ jsx(
        ChatIconButton,
        {
          ariaLabel: t("tableChat.toolbar.addEmoji"),
          className: "format-button",
          icon: /* @__PURE__ */ jsx(default_1$2, { fontSize: "small", style: { width: "16px", height: "16px" } }),
          onClick: onEmojiSelect
        }
      ),
      enabledItems.map((itemKey) => {
        const item = TOOLBAR_ITEMS[itemKey];
        if (!item) return null;
        const Icon = item.icon;
        return /* @__PURE__ */ jsx(
          ChatIconButton,
          {
            ariaLabel: t(item.ariaLabel),
            className: `format-button ${activeStates[itemKey] ? "is-active" : ""}`,
            icon: /* @__PURE__ */ jsx(Icon, { fontSize: "small", style: { width: "16px", height: "16px" } }),
            onClick: () => {
              handleCommand(item.command);
            }
          },
          itemKey
        );
      })
    ] });
  }
);
export {
  EditorToolbar
};
