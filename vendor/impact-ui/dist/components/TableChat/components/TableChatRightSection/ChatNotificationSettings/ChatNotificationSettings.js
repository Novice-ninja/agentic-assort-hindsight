!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.notification-backdrop{height:100vh;left:0;position:fixed;top:0;width:100vw;z-index:999}.notification-settings-card{background:#fff;border:1px solid #d9dde7;border-radius:16px;box-shadow:0 8px 32px #0000001f;width:386px;z-index:1000}.notification-settings-card .notification-settings-header{padding:20px 24px 4px}.notification-settings-card .notification-settings-header h3{color:#0d152c;font-size:16px;font-weight:600;line-height:1.4;margin:0}.notification-settings-card .notification-settings-content{padding:12px 24px}.notification-settings-card .notification-settings-content .notification-options{display:flex;flex-direction:column;gap:4px}.notification-settings-card .notification-settings-content .notification-options .notification-option{align-items:flex-start;cursor:pointer;display:flex;gap:12px;padding:6px 0}.notification-settings-card .notification-settings-content .notification-options .notification-option input[type=radio]{display:none}.notification-settings-card .notification-settings-content .notification-options .notification-option .radio-custom{align-items:center;border:2px solid #b4bac7;border-radius:50%;display:flex;flex-shrink:0;height:20px;justify-content:center;margin-top:1px;transition:all .2s ease;width:20px}.notification-settings-card .notification-settings-content .notification-options .notification-option .radio-custom:after{background-color:#4259ee;border-radius:50%;content:"";height:8px;opacity:0;transform:scale(0);transition:all .2s ease;width:8px}.notification-settings-card .notification-settings-content .notification-options .notification-option input[type=radio]:checked+.radio-custom{border-color:#4259ee}.notification-settings-card .notification-settings-content .notification-options .notification-option input[type=radio]:checked+.radio-custom:after{opacity:1;transform:scale(1)}.notification-settings-card .notification-settings-content .notification-options .notification-option .option-text{color:#1f2b4d;font-size:16px;font-weight:400;line-height:1.5}.notification-settings-card .notification-settings-content .notification-options .notification-option:hover .radio-custom{border-color:#6b7280}.notification-settings-card .notification-settings-content .notification-options .notification-option:hover input[type=radio]:checked+.radio-custom{border-color:#4259ee}.notification-settings-card .notification-settings-content .notification-options .mentions-checkbox{margin-bottom:4px;margin-left:32px;margin-top:4px}.notification-settings-card .notification-settings-content .notification-options .mentions-checkbox .ia-checkbox-container .ia-checkbox-input+.ia-checkbox-label{color:#6b7280;font-size:14px;font-weight:400}.notification-settings-card .notification-settings-content .notification-separator{background-color:#f3f4f6;height:1px;margin:16px 0 20px}.notification-settings-card .notification-settings-content .mute-section .ia-checkbox-container{margin-bottom:12px}.notification-settings-card .notification-settings-content .mute-section .ia-checkbox-container .ia-checkbox-input+.ia-checkbox-label{color:#1f2b4d;font-size:16px;font-weight:400}.notification-settings-card .notification-settings-content .mute-section .mute-description{margin-bottom:4px;margin-left:32px;margin-top:8px}.notification-settings-card .notification-settings-content .mute-section .mute-description p{color:#6b7280;font-size:14px;line-height:1.5;margin:0 0 8px}.notification-settings-card .notification-settings-content .mute-section .mute-description p:last-child{margin-bottom:0}.notification-settings-card .notification-settings-actions{border-radius:0 0 16px 16px;border-top:1px solid #f3f4f6;display:flex;gap:12px;justify-content:flex-end;padding:16px 12px 20px 24px}.notification-settings-card .notification-settings-actions .ia-styles.ia-btn.ia-btn-link:hover{text-decoration:none}.notification-settings-card .notification-settings-actions button{border-radius:6px;font-size:14px;font-weight:500;height:36px;min-width:80px;transition:all .2s ease}.notification-settings-card .notification-settings-actions button[variant=tertiary]{background-color:initial;border:1px solid #b4bac7;color:#1f2b4d}.notification-settings-card .notification-settings-actions button[variant=tertiary]:hover{background-color:#f9fafb;border-color:#d9dde7}.notification-settings-card .notification-settings-actions button[variant=primary]{background-color:#4259ee;border:1px solid #4259ee;color:#fff}.notification-settings-card .notification-settings-actions button[variant=primary]:hover{background-color:#1531e8;border-color:#1531e8}@keyframes slideInUp{0%{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,10px)}}')),document.head.appendChild(i)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "../../../../Button/index.js";
import { Checkbox } from "../../../../Checkbox/index.js";
import { Prompt } from "../../../../Prompt/index.js";
import { RadioButtonGroup } from "../../../../RadioButtonGroup/index.js";

import { useTranslation } from "../../../../../i18n/useTranslation.js";
const ChatNotificationSettings = ({
  isOpen,
  onClose,
  isLoading,
  position = { top: 60, right: 32 },
  onSaveNotification,
  notificationSettings
}) => {
  const { t } = useTranslation();
  const [notificationSetting, setNotificationSetting] = useState(
    (notificationSettings == null ? void 0 : notificationSettings.notificationSetting) || "all"
  );
  const [includeChannelMentions, setIncludeChannelMentions] = useState(
    (notificationSettings == null ? void 0 : notificationSettings.includeChannelMentions) || false
  );
  const [muteChannel, setMuteChannel] = useState((notificationSettings == null ? void 0 : notificationSettings.muteChannel) || false);
  const channelName = (notificationSettings == null ? void 0 : notificationSettings.channelName) || "general";
  const handleSave = () => {
    onSaveNotification({
      notificationSetting,
      includeChannelMentions,
      muteChannel
    });
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "notification-backdrop", onClick: onClose }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "notification-settings-card",
        style: {
          position: "absolute",
          top: position.top,
          right: position.right,
          transform: "translate(0%, 0%)"
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "notification-settings-header", children: /* @__PURE__ */ jsx("h3", { children: t("tableChat.notifications.sendNotificationFor") }) }),
          /* @__PURE__ */ jsxs("div", { className: "notification-settings-content", children: [
            /* @__PURE__ */ jsxs("div", { className: "notification-options", children: [
              /* @__PURE__ */ jsx(
                RadioButtonGroup,
                {
                  options: [
                    {
                      label: t("tableChat.notifications.allNewMessages"),
                      value: "all"
                    }
                  ],
                  value: notificationSetting,
                  onChange: (_e, val) => {
                    setNotificationSetting(val);
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                RadioButtonGroup,
                {
                  options: [
                    {
                      label: t("tableChat.notifications.mentions"),
                      value: "mentions"
                    }
                  ],
                  value: notificationSetting,
                  onChange: (_e, val) => {
                    setIncludeChannelMentions(false);
                    setMuteChannel(false);
                    setNotificationSetting(val);
                  }
                }
              ),
              notificationSetting === "mentions" && /* @__PURE__ */ jsx("div", { className: "mentions-checkbox", children: /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: includeChannelMentions,
                  label: /* @__PURE__ */ jsx("span", { children: t("tableChat.notifications.alsoInclude", {
                    channel: channelName
                  }) }),
                  variant: "default",
                  onChange: (e) => {
                    setIncludeChannelMentions(e.target.checked);
                  }
                }
              ) }),
              /* @__PURE__ */ jsx(
                RadioButtonGroup,
                {
                  options: [
                    {
                      label: t("tableChat.notifications.nothing"),
                      value: "nothing"
                    }
                  ],
                  value: notificationSetting,
                  onChange: (_e, val) => {
                    setNotificationSetting(val);
                    setIncludeChannelMentions(false);
                    setMuteChannel(false);
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "notification-separator" }),
            /* @__PURE__ */ jsxs("div", { className: "mute-section", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: muteChannel,
                  label: t("tableChat.notifications.muteChannel"),
                  variant: "default",
                  onChange: (e) => {
                    setMuteChannel(e.target.checked);
                    setIncludeChannelMentions(false);
                    setNotificationSetting("nothing");
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                Prompt,
                {
                  handleClose: () => {
                    setMuteChannel(false);
                  },
                  isOpen: muteChannel,
                  secondaryButtonLabel: t("tableChat.notifications.unmuteChannel"),
                  title: t("tableChat.notifications.mutedTitle"),
                  variant: "warning",
                  onSecondaryButtonClick: () => {
                    setMuteChannel(false);
                  },
                  children: t("tableChat.notifications.mutedDescription")
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mute-description", children: [
                /* @__PURE__ */ jsx("p", { children: t("tableChat.notifications.muteDescLine1") }),
                /* @__PURE__ */ jsx("p", { children: t("tableChat.notifications.muteDescLine2") })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "notification-settings-actions", children: [
            /* @__PURE__ */ jsx(Button, { className: "cancel-button", variant: "url", onClick: handleCancel, children: t("common.cancel") }),
            /* @__PURE__ */ jsx(Button, { disabled: isLoading, variant: "primary", onClick: handleSave, children: isLoading ? t("table.views.saving") : t("tableChat.notifications.saveChanges") })
          ] })
        ]
      }
    )
  ] });
};
export {
  ChatNotificationSettings
};
