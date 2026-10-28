!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.chat-header{align-items:center;background:#fff;border-bottom:1px solid #b3bdf8;border-radius:10px 10px 0 0;box-sizing:border-box;display:flex;height:64px;justify-content:space-between;min-width:0;overflow:hidden;padding:6px 20px 5px}.chat-header .chat-header-info-slot{flex:1 1 auto;max-width:calc(100% - 220px);min-width:0;overflow:hidden}.chat-header .chat-header-info-slot.is-collapsed{flex:0 0 0;max-width:0;overflow:hidden;visibility:hidden;width:0}.chat-header .chat-header-content{max-width:100%;width:100%}.chat-header .chat-header-content .chat-title{color:#1f2b4d;display:block;font-size:16px;font-style:normal;font-weight:800;line-height:24px;min-width:0}.chat-header .chat-header-content .chat-title .resolved-badge{align-items:center;color:#4259ee;display:flex;font-size:14px;font-style:normal;font-weight:500;line-height:20px}.chat-header .chat-header-content .chat-title .resolved-badge img{height:16px;margin-right:2px;width:16px}.chat-header .chat-header-content .chat-created-by,.chat-header .chat-header-content .chat-id{color:#c3c8d4;font-size:14px;font-style:normal;font-weight:500;line-height:21px}.chat-header .chat-header-content .chat-created-by{margin-left:5px}.chat-header .chat-header-content .chat-created-by:before{color:#c3c8d4;content:"|";margin-right:6px}.chat-header .chat-header-content .chat-info-outer{display:block;min-width:0;width:100%}.chat-header .chat-header-content .chat-info-outer>span{display:block!important;min-width:0;width:100%}.chat-header .chat-header-content .chat-info-container{color:#c3c8d4;display:block;font-size:14px;font-style:normal;font-weight:500;line-height:21px;max-width:100%;min-width:0;white-space:nowrap;width:100%}.chat-header .chat-header-content .chat-created-by-container{display:inline-block;max-width:100%}.chat-header .chat-header-content .chat-created-at{color:#c3c8d4;font-size:14px;font-style:normal;font-weight:500;line-height:21px}.chat-header .chat-header-content .chat-text-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chat-header .chat-participants{align-items:center;display:flex;gap:12px}.chat-header .chat-participants .participant-avatars{align-items:center;display:flex}.chat-header .chat-participants .participant-avatars .participant-avatar{border:2px solid #fff;box-shadow:0 1px 3px #0000001a}.chat-header .chat-participants .participant-avatars .more-participants{align-items:center;background:#eceefd;border:2px solid #fff;border-radius:50%;color:#4259ee;display:flex;font-size:11px;font-weight:600;height:24px;justify-content:center;margin-left:-8px;min-width:24px;padding:4px 6px}.chat-header .chat-participants .participants-button{background:none!important;border:none!important;border-radius:4px;color:#7a8294;cursor:pointer;padding:4px}.chat-pinned{cursor:pointer;padding:.25rem;transition:all .2s ease-in-out}.chat-header-right{align-items:center;display:flex;flex:0 0 auto;gap:.5rem;justify-content:flex-end;min-width:0}.chat-header-right.search-enabled{flex:1;min-width:0}.ia-styles.ia-menu.three-dot-menu-container .MuiPaper-root{margin-left:32px;margin-top:4px}.chat-search-container{align-items:center;display:flex;flex:0 0 auto;gap:.5rem;position:relative}.chat-search-container .search-icon{cursor:pointer;flex-shrink:0}.chat-search-container .chat-search-input-container{position:relative;width:100%}.chat-search-container .chat-search-input-container .chat-search-input{background:none;border:1px solid #f0f0f0;border-radius:8px;box-sizing:border-box;color:#60697d;font-family:inherit;font-size:14px;height:32px;line-height:1.4;outline:none;padding:.5rem 2rem .5rem 1.75rem;transition:all .2s ease-in-out;width:100%}.chat-search-container .chat-search-input-container .chat-search-input::placeholder{color:#60697d;font-size:12px;padding-left:.5rem}.chat-search-container .chat-search-input-container .chat-search-input:focus{border:1px solid #4259ee}.chat-search-container .chat-search-input-container .chat-input-search-icon{color:#b2c2e0;cursor:pointer;height:1.5rem;left:.25rem;position:absolute;top:.25rem;width:1.5rem}.chat-search-container .chat-search-input-container .chat-search-input-close-icon{color:#60697d;cursor:pointer;height:12px;position:absolute;right:.625rem;top:.625rem;width:12px}.search-enabled .chat-search-container{flex:1 1 auto;min-width:0}.chat-participants-container{align-items:center;display:flex;gap:.5rem;position:relative}.chat-header-right-button{align-items:center;background:#f5f6fa;border-radius:10px;cursor:pointer;display:flex;font-size:3em;height:32px;justify-content:center;padding:.5rem;width:32px}.chat-header-right-button:active{background-color:#e2f4ff;transform:scale(.98)}.ia-styles.ia-menu.participants-menu-container .MuiPaper-root{display:flex;flex-direction:column;margin-left:28px;overflow:hidden!important;width:260px}.ia-styles.ia-menu.participants-menu-container .menu-header{background:#fff;border-radius:16px 16px 0 0;flex-shrink:0;padding:4px 0 0;position:sticky;top:0;z-index:10}.ia-styles.ia-menu.participants-menu-container .MuiList-root{flex:1;overflow-x:hidden;padding-top:0}.ia-styles.ia-menu.participants-menu-container .MuiList-root::-webkit-scrollbar{width:6px}.ia-styles.ia-menu.participants-menu-container .MuiList-root::-webkit-scrollbar-track{background:#0000}.ia-styles.ia-menu.participants-menu-container .MuiList-root::-webkit-scrollbar-thumb{background:#c3c8d4;border-radius:3px}.ia-styles.ia-menu.participants-menu-container .MuiList-root::-webkit-scrollbar-thumb:hover{background:#b4bac7}.ia-styles.ia-menu.participants-menu-container .MuiMenu-paper{overflow:hidden!important}.ia-styles.ia-menu.participants-menu-container .MuiMenu-list{max-height:320px;overflow-x:hidden!important;overflow-y:auto!important}.ia-styles.ia-menu.participants-menu-container .MuiButtonBase-root{padding:6px 16px}.ia-styles.ia-menu.participants-menu-container .menu-header-radio-group-container .ia-radioGroup .MuiFormControlLabel-root .MuiButtonBase-root{padding-left:12px!important}.ia-styles.ia-menu.participants-menu-container .menu-header-radio-group-container .MuiButtonBase-root{padding:8px 8px 8px 14px}.ia-styles.ia-menu.participants-menu-container .ia-menu-action-button-container{background:#fff;border-top:none;bottom:0;box-sizing:border-box;display:flex;flex-shrink:0;gap:12px;justify-content:flex-end;margin-top:auto;padding:8px 8px 4px;position:sticky;width:100%;z-index:10}.participants-img{height:22px}.btn_border_participant{background:#f5f6fa!important;border:none!important;height:32px!important}.pinned_img{background:none;background-color:initial!important;border:none!important}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { getAssetUrl } from "../../../../../utils/assetBase.js";
import { MenuHeaderInfo } from "../../../../Menu/MenuHeaderInfo.js";

import ChatHeaderAction from "./ChatHeaderAction.js";
import ChatHeaderInfo from "./ChatHeaderInfo.js";
import { chartConfig } from "../../chatConfig.js";
import { useTranslation } from "../../../../../i18n/useTranslation.js";
const ActiveNotificationIcon = getAssetUrl("icons/active-notificationIcon.svg");
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
const ChatHeader = ({
  title,
  chatId,
  participants = [],
  className = "chat-header",
  participantsList,
  onSaveNotification,
  createdBy,
  createdAt,
  chatHeaderConfig = {},
  ...restProps
}) => {
  var _a;
  const { t } = useTranslation();
  const [enableSearch, setEnableSearch] = useState(false);
  const [threeDotMenuOpen, setThreeDotMenuOpen] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [messageSearchValue, setMessageSearchValue] = useState("");
  const [menuOptions, setMenuOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRadioOption, setSelectedRadioOption] = useState("");
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  useEffect(() => {
    var _a2, _b;
    if ((_a2 = chatHeaderConfig.headerConfig) == null ? void 0 : _a2.selectedRadioOptionMenu) {
      setSelectedRadioOption(
        ((_b = chatHeaderConfig.headerConfig) == null ? void 0 : _b.selectedRadioOptionMenu) || chartConfig.userConfig.radioButtonConfig.selectedRadioOption
      );
    }
  }, [(_a = chatHeaderConfig.headerConfig) == null ? void 0 : _a.selectedRadioOptionMenu]);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const fetchOptionsForRadio = async (radioValue) => {
    var _a2;
    try {
      console.log(`🔄 [API] Loading options for ${radioValue}...`);
      setIsLoadingOptions(true);
      setMenuOptions([]);
      setSelectedMenuItems([]);
      setMenuSearchQuery("");
      setLoadingError(null);
      const options = await ((_a2 = chatHeaderConfig.loadParticipants) == null ? void 0 : _a2.call(chatHeaderConfig, radioValue, chatId));
      if (options) {
        console.log(`✅ [API] ${radioValue} options loaded successfully`);
        setMenuOptions(options);
      }
    } catch (error) {
      console.error(`❌ [API] Error loading options for ${radioValue}:`, error);
      setLoadingError(t("tableChat.header.loadOptionsFailed", { name: radioValue }));
    } finally {
      setIsLoadingOptions(false);
    }
  };
  useEffect(() => {
    let isSubscribed = true;
    const performSearch = async () => {
      if (!menuSearchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      setLoadingError(null);
      try {
        if (chatHeaderConfig.onSearchChange) {
          const results = await chatHeaderConfig.onSearchChange(
            menuSearchQuery,
            selectedRadioOption,
            chatId
          );
          if (isSubscribed) {
            setSearchResults(results || []);
          }
        } else {
          const filteredResults = menuOptions.filter((option) => {
            var _a2, _b, _c, _d, _e;
            const labelMatch = (_a2 = option.label) == null ? void 0 : _a2.toLowerCase().includes(menuSearchQuery.toLowerCase());
            const emailMatch = (_c = (_b = option.otherProps) == null ? void 0 : _b.email) == null ? void 0 : _c.toLowerCase().includes(menuSearchQuery.toLowerCase());
            const userCodeMatch = (_e = (_d = option.otherProps) == null ? void 0 : _d.user_code) == null ? void 0 : _e.toString().includes(menuSearchQuery);
            return labelMatch || emailMatch || userCodeMatch;
          });
          if (isSubscribed) {
            setSearchResults(filteredResults);
          }
        }
      } catch (error) {
        if (isSubscribed) {
          setLoadingError(t("tableChat.header.searchFailed"));
          setSearchResults([]);
        }
      } finally {
        if (isSubscribed) {
          setIsSearching(false);
        }
      }
    };
    const debounceTimer = setTimeout(performSearch, 300);
    return () => {
      isSubscribed = false;
      clearTimeout(debounceTimer);
    };
  }, [menuSearchQuery, selectedRadioOption]);
  const getOptionsToShow = () => {
    if (isLoadingOptions) {
      return [];
    }
    if (menuSearchQuery.trim()) {
      return isSearching ? [] : searchResults;
    }
    return menuOptions;
  };
  const filteredMenuOptions = getOptionsToShow();
  const handleRadioButtonChange = async (value) => {
    setSelectedRadioOption(value);
    setMenuSearchQuery("");
    await fetchOptionsForRadio(value);
  };
  const localHandlers = {
    onSelectAll: (allValues) => {
      if (allValues.length === selectedMenuItems.length) {
        setSelectedMenuItems([]);
      } else {
        setSelectedMenuItems(allValues || filteredMenuOptions.map((opt) => opt.value));
      }
    },
    onClearSelection: () => {
      console.log("External clear selection handler [ChatHeader]");
      setSelectedMenuItems([]);
    },
    onRadioButtonChange: (value) => {
      console.log("📻 [External] Radio button change: [ChatHeader]", value);
      handleRadioButtonChange(value);
    },
    onMenuOptionChange: (value) => {
      console.log("External:[Menu Option] [ChatHeader]", value);
    }
  };
  const handleThreeDotMenuOptionClick = (optionId) => {
    console.log("Three-dot menu option clicked:", optionId);
    {
      setThreeDotMenuOpen(false);
      setShowNotificationSettings(true);
    }
  };
  const threeDotMenuOptions = [
    {
      id: "notifications",
      label: t("tableChat.header.notifications"),
      icon: /* @__PURE__ */ jsx("img", { alt: "notification", src: ActiveNotificationIcon }),
      onClick: () => {
        handleThreeDotMenuOptionClick("notifications");
      }
    }
  ];
  const handleNotificationSettingsClose = () => {
    setShowNotificationSettings(false);
  };
  const handleEnableMessageSearch = () => {
    setEnableSearch(true);
  };
  const handleCloseMessageSearch = () => {
    setEnableSearch(false);
    setMessageSearchValue("");
    if (chatHeaderConfig.onSearchClear) {
      chatHeaderConfig.onSearchClear();
    }
  };
  const debouncedSearch = useCallback(
    debounce(async (searchValue, chatId2) => {
      if (chatHeaderConfig.onSearchMessage) {
        await chatHeaderConfig.onSearchMessage(searchValue, chatId2);
      }
    }, 500),
    [chatHeaderConfig.onSearchMessage]
  );
  const handleMessageSearchChange = async (e) => {
    const searchValue = e.target.value;
    setMessageSearchValue(searchValue);
    debouncedSearch(searchValue, chatId);
  };
  const handlePinnedClick = () => {
    var _a2;
    (_a2 = chatHeaderConfig.onPinnedClick) == null ? void 0 : _a2.call(chatHeaderConfig, chatId);
  };
  const handleParticipantsClick = async () => {
    if (chatHeaderConfig.onParticipantsClick) {
      await chatHeaderConfig.onParticipantsClick(chatId);
    }
    if (menuOptions.length === 0 && selectedRadioOption) {
      await fetchOptionsForRadio(selectedRadioOption);
    }
  };
  const handleThreeDotMenuClose = () => {
    setThreeDotMenuOpen(false);
  };
  const handleThreeDotMenuClick = () => {
    setThreeDotMenuOpen(true);
  };
  const handleSaveNotificationSettings = (data) => {
    var _a2;
    console.log("[ChatHeader] handleSaveNotificationSettings", data);
    onSaveNotification == null ? void 0 : onSaveNotification(data);
    (_a2 = chatHeaderConfig.onNotificationSettingChange) == null ? void 0 : _a2.call(chatHeaderConfig, data);
  };
  const CleanupParticipantsData = () => {
    console.log("[ChatHeader] CleanupParticipantsData");
    setMenuOptions([]);
    setSelectedMenuItems([]);
    setMenuSearchQuery("");
    setIsLoadingParticipants(false);
    setIsLoadingOptions(false);
    setIsSearching(false);
    setSearchResults([]);
    setLoadingError(null);
  };
  const renderCustomHeader = (headerProps) => {
    var _a2;
    return /* @__PURE__ */ jsx(
      MenuHeaderInfo,
      {
        ...headerProps,
        customHeaderProps: {
          searchPlaceholder: t("tableChat.header.searchInHere"),
          selectAllLabel: t("common.selectAll"),
          clearButtonText: t("common.clear"),
          radioButtonProps: {},
          searchInputProps: {
            style: { fontSize: "14px" }
          }
        },
        externalHandlers: localHandlers,
        overrideConfig: {
          isSearchable: true,
          isSelectAllAllowed: true,
          showRadioButton: true,
          radioButtonOptions: (_a2 = chatHeaderConfig.headerConfig) == null ? void 0 : _a2.radioOptions,
          selectedRadioButton: selectedRadioOption
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: `chat-header ${className}`, children: [
    /* @__PURE__ */ jsx("div", { className: `chat-header-info-slot ${enableSearch ? "is-collapsed" : ""}`, children: /* @__PURE__ */ jsx(
      ChatHeaderInfo,
      {
        chatId,
        createdAt,
        createdBy,
        showChatId: chatHeaderConfig.showChatId ?? false,
        title
      }
    ) }),
    /* @__PURE__ */ jsx(
      ChatHeaderAction,
      {
        chatId,
        enableSearch,
        externalHandlers: {
          onSearchChange: (value) => {
            setMenuSearchQuery(value);
            if (chatHeaderConfig == null ? void 0 : chatHeaderConfig.onSearchChange) {
              chatHeaderConfig.onSearchChange(value);
            }
          },
          onSelectAll: localHandlers.onSelectAll,
          onClearSelection: localHandlers.onClearSelection,
          onSelectionChange: (newSelection) => {
            setSelectedMenuItems(newSelection);
          },
          onParticipantsClick: handleParticipantsClick,
          loadMenuOptions: chatHeaderConfig == null ? void 0 : chatHeaderConfig.loadMenuOptions,
          menuOptions,
          // loadParticipants: chatHeaderConfig?.loadParticipants,
          onClose: CleanupParticipantsData,
          onParticipantAdd: chatHeaderConfig == null ? void 0 : chatHeaderConfig.onParticipantAdd,
          onNotificationSettingChange: chatHeaderConfig == null ? void 0 : chatHeaderConfig.onNotificationSettingChange,
          onSearchMessage: handleMessageSearchChange,
          participantsList: chatHeaderConfig == null ? void 0 : chatHeaderConfig.participantsList,
          loadParticipantsAvatar: chatHeaderConfig == null ? void 0 : chatHeaderConfig.loadParticipantsAvatar,
          handleRadioButtonChange
        },
        filteredMenuOptions,
        handleCloseMessageSearch,
        handleMessageSearchChange,
        handleThreeDotMenuClose,
        isLoadingParticipants,
        isSearching,
        menuSearchQuery,
        messageSearchValue,
        selectedMenuItems,
        threeDotMenuOptions,
        onThreeDotMenuClick: handleThreeDotMenuClick,
        handleNotificationSettingsClose,
        renderCustomHeader,
        loadingError,
        handleOpenMessageSearch: handleEnableMessageSearch,
        notificationSettings: chatHeaderConfig == null ? void 0 : chatHeaderConfig.notificationSettings,
        ...restProps,
        participants,
        isLoadingOptions,
        setMenuSearchQuery,
        threeDotMenuOpen,
        setSelectedMenuItems,
        onPinnedClick: handlePinnedClick,
        onSaveNotification: handleSaveNotificationSettings,
        showNotificationSettings,
        ...chatHeaderConfig == null ? void 0 : chatHeaderConfig.headerConfig,
        chatHeaderConfig,
        externalSavingMembers: chatHeaderConfig == null ? void 0 : chatHeaderConfig.externalSavingMembers,
        menuOptions,
        selectedRadioOption
      }
    )
  ] });
};
export {
  ChatHeader
};
