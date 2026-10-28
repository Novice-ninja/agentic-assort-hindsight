!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.table-left-panel-container{background:#fff;border-radius:16px;box-shadow:12px 13px 45px -1px #0000001a;flex-shrink:0;max-width:350px;overflow:hidden;width:350px}.table-left-panel-container:before{background:linear-gradient(180deg,#4259ee99,#4259ee33,#4259ee00);border-radius:16px;content:"";top:0;right:0;bottom:0;left:0;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1px;pointer-events:none;position:absolute}.table-left-panel-container .ia-styles.ia-btn.ia-btn-tertiary,.table-left-panel-container .ia-styles.ia-btn.ia-btn-tertiary:hover{background:none!important;box-shadow:none!important}.chat-header-navigation{align-items:center;background:#fff;border-bottom:1px solid #d9dde7;border-top-left-radius:10px;border-top-right-radius:10px;display:flex;justify-content:space-between;padding:12px 16px}.chat-header-navigation .nav-left{align-items:center;display:flex;gap:7px}.chat-header-navigation .nav-left button{background:none;border:none!important;box-shadow:none}.chat-header-navigation .nav-title{color:#0d152c;font-size:16px;font-weight:800;line-height:24px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:130px}.chat-header-navigation .nav-right{align-items:center;display:flex;gap:8px;position:relative}.chat-header-navigation .nav-right button{background:none;border:none!important;box-shadow:none}.chat-header-navigation .nav-icon-button{align-items:center;background:#0000;border:none;border-radius:6px;color:#7a8294;cursor:pointer;display:flex;height:20px;justify-content:center;transition:all .2s ease;width:20px}.chat-header-navigation .nav-icon-button:hover{color:#4259ee}.chat-header-navigation .nav-icon-button:focus{outline-offset:1px}.chat-header-navigation .chat-button{background:#4259ee!important;border-radius:8px!important;box-shadow:none!important;color:#fff!important;font-size:14px!important;font-weight:500!important;height:32px;padding:6px 12px!important;width:77px}.chat-header-navigation .chat-button:hover{background:#2b44ec!important}.chat-header-navigation .chat-button .ia-btn-icon{margin-right:4px}.chat-header-navigation .impact_inputbox_container_with_icons{width:100%}.channel_list{background:#f2f4fb}.channel_list,.chat-channel-item,.chat_list{align-items:baseline;border-radius:8px;cursor:pointer;display:flex;gap:12px;padding:12px 16px;transition:background-color .2s ease}.channel_list .ia-styles.ia-avatar,.chat-channel-item .ia-styles.ia-avatar,.chat_list .ia-styles.ia-avatar{background:#7a8294;border-radius:16px}.channel_list:hover,.chat-channel-item:hover,.chat_list:hover{background:#eceefd}.channel_list:hover .ia-styles.ia-avatar,.channel_list:hover .unread-badge,.chat-channel-item:hover .ia-styles.ia-avatar,.chat-channel-item:hover .unread-badge,.chat_list:hover .ia-styles.ia-avatar,.chat_list:hover .unread-badge{background:#4259ee}.channel_list.selected,.chat-channel-item.selected,.chat_list.selected{background:#eceefd}.channel_list.selected .ia-styles.ia-avatar,.channel_list.selected .unread-badge,.chat-channel-item.selected .ia-styles.ia-avatar,.chat-channel-item.selected .unread-badge,.chat_list.selected .ia-styles.ia-avatar,.chat_list.selected .unread-badge{background:#4259ee}.channel_list.muted,.chat-channel-item.muted,.chat_list.muted{opacity:.7}.channel_list:focus,.chat-channel-item:focus,.chat_list:focus{outline-offset:-2px}.channel_list:last-child,.chat-channel-item:last-child,.chat_list:last-child{border-bottom:none}.channel-checkbox{align-items:center;display:flex;padding-top:2px}.channel-checkbox input[type=checkbox]{accent-color:#4259ee;border:1px solid #d9dde7;border-radius:3px;cursor:pointer;height:16px;width:16px}.channel-checkbox input[type=checkbox]:checked{background:#4259ee;border-color:#4259ee}.channel-avatar{border-radius:16px;flex-shrink:0;margin-top:2px}.channel-avatar .ia-avatar{font-size:14px!important;font-weight:600!important;height:32px!important;width:32px!important}.channel-content{flex:1;min-width:0}.channel-header{align-items:center;display:flex;justify-content:space-between;margin-bottom:4px}.channel-title{color:#0d152c;flex:1;font-size:16px;font-weight:600;height:24px;line-height:24px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.channel-meta.selected{background:#eceefd}.muted-icon{color:#7a8294;font-size:16px!important}.unread-badge{align-items:center;background:#7a8294;border-radius:10px;color:#fff;display:flex;font-size:10px;font-weight:400;height:18px;justify-content:center;line-height:1;min-width:18px;padding:2px 6px}.channel-subtitle{color:#7a8294;margin:0 0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.channel-subtitle,.channel-time{font-size:12px;font-weight:500;line-height:16px}.channel-time{color:#b4bac7}@media (max-width:768px){.chat-header-navigation .nav-title{font-size:15px}.chat-header-navigation .chat-button{font-size:13px!important;padding:4px 8px!important}.chat-channel-item{padding:10px 12px}.channel-title{font-size:13px}.channel-subtitle{font-size:12px}}.table-left-panel-container{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/tableChat_bg.svg);background-position:50%;background-repeat:repeat;background-size:cover;box-shadow:0 1px 3px #0000001a;position:relative}.chat-header-navigation{background:#0000;border-bottom-color:#d9dde7;box-shadow:0 1px 3px #0000001a;height:64px;overflow:hidden;padding-left:16px;position:relative}.nav-title{color:#fff}.chat-channel-list{display:flex;flex-direction:column;gap:12px;margin:8px;max-height:calc(100vh - 150px);overflow-y:auto}.chat-channel-list .no-channels-found-container{align-items:center;background:#f2f4fb;border-radius:8px;display:flex;flex-direction:column;gap:12px;justify-content:center;padding:12px}.chat-channel-list .no-channels-found-container .no-channels-found{color:#0d152c;font-size:16px;font-weight:600}.chat-channel-list .no-channels-found-container .no-channels-found-description{color:#7a8294;font-size:12px;font-weight:500;line-height:16px;text-align:center}.chat-channel-item.selected,.chat-channel-item:hover{background:#eceefd}.channel-time{color:#60697d}.channel-list-header{align-items:center;display:flex;justify-content:space-between;width:100%}.chanel_icon{background:#fff;border:1px solid #c3c8d4;border-radius:8px;max-height:32px;padding:8px}.chanel_search{align-items:center;background:#f5f6fa;border-radius:8px;display:flex;height:32px;justify-content:center;width:32px}.chanel_search svg{cursor:pointer}.chanel_right_navigation{display:flex;gap:8px}.delete_chat_container{height:32px!important;width:32px}.pinnedChat_container{display:flex;justify-content:space-between}.pinnedChat_container .pinnedChat{opacity:0;transition:opacity .2s ease}.chat_list:hover .pinnedChat_container .pinnedChat{opacity:1}')),document.head.appendChild(e)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}}();
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ChatChannelList } from "./ChatChannelList.js";
import { ChatHeaderNavigation } from "./ChatHeaderNavigation.js";
import { SkeletonList } from "../SkeletonList.js";

import { useTranslation } from "../../../../i18n/useTranslation.js";
const TableChatChannelHeader = ({
  title,
  channels = [],
  selectedChannelOrChatId,
  onBack,
  onChannelSelect,
  onMenuClick,
  onSearchClick,
  onMoreClick,
  showChannelList,
  setShowPinnedMsg,
  onThreadClick,
  isSearchOpen,
  headerConfig,
  showAddChatBtn = true,
  showCheckbox,
  handleChatName,
  filterChannelsByTitle,
  loadingChannels,
  selectedChannelInfo,
  handleToast,
  onPinnedChatClick,
  onDeleteTopics,
  selectedChat,
  handleChatSelect,
  isCreateNewChatOpen,
  setIsCreateNewChatOpen
}) => {
  const handleChannelSelect = (channelId, channelItem) => {
    onChannelSelect == null ? void 0 : onChannelSelect(channelId, channelItem);
  };
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("tableChat.channelHeader.createNewChat");
  const channelsToShow = channels;
  return /* @__PURE__ */ jsx("div", { className: "table-left-panel-container", children: loadingChannels ? /* @__PURE__ */ jsx("div", { style: { height: "100%" }, children: /* @__PURE__ */ jsx(SkeletonList, { text: t("tableChat.loadingMessages") }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ChatHeaderNavigation,
      {
        filterChannelsByTitle,
        handleChatName,
        handleToast,
        headerConfig,
        isCreateNewChatOpen,
        isSearchOpen,
        selectedChannelInfo,
        selectedChat,
        setIsCreateNewChatOpen,
        setShowPinnedMsg,
        showAddChatBtn,
        showChannelList,
        showSearchChat: headerConfig == null ? void 0 : headerConfig.showSearch,
        title: resolvedTitle,
        onBack,
        onDeleteTopics,
        onMenuClick,
        onMoreClick,
        onSearchClick,
        onThreadClick
      }
    ),
    /* @__PURE__ */ jsx(
      ChatChannelList,
      {
        channels: channelsToShow,
        handleChatSelect,
        handleToast,
        selectedChannelOrChatId,
        selectedChat,
        showChannelList,
        showCheckBox: headerConfig == null ? void 0 : headerConfig.leftChatPanel,
        showCheckbox,
        onChannelSelect: handleChannelSelect,
        onPinnedChatClick
      }
    )
  ] }) });
};
export {
  TableChatChannelHeader as default
};
