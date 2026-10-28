import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { getAssetUrl } from "../../utils/assetBase.js";
import { ChatBotFooter } from "./chatBotFooter.js";
import ChatInput from "./chatInput.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const SmartBotIcon = getAssetUrl("icons/smartBotAlan.svg");
const SunIcon = getAssetUrl("icons/sun.webp");
const getGreeting = (t) => {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour >= 5 && hour < 12) return t ? t("chatBot.greeting.morning") : "Good Morning";
  if (hour >= 12 && hour < 16) return t ? t("chatBot.greeting.afternoon") : "Good Afternoon";
  return t ? t("chatBot.greeting.evening") : "Good Evening";
};
function NewChatComponent({
  onClose: _onClose,
  userName,
  inputValue,
  setInputValue,
  setIsNewChat,
  onSendIconClick,
  userChats,
  setUserChats,
  moduleList: _moduleList,
  onModuleClick: _onModuleClick,
  activeList,
  handleRefresh,
  handleSaveChat,
  handleMicClick,
  hideMenuArrow: _hideMenuArrow,
  isModuleListLoading: _isModuleListLoading,
  suggestionBanner,
  isStopIcon,
  onStopIconClick,
  onCloseSuggestionBanner,
  showSuggestionBanner,
  customInputComponent,
  footerText
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(() => getGreeting(t));
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    setGreeting(getGreeting(t));
  }, [t]);
  return /* @__PURE__ */ jsx("div", { className: "chatbot-component-body", children: /* @__PURE__ */ jsxs("div", { className: "chatbot-component-body-container", children: [
    /* @__PURE__ */ jsx("div", { className: `chatbot-component-body-icon${loading ? " rotating" : ""}`, children: /* @__PURE__ */ jsx("img", { alt: "smartbot", src: SmartBotIcon }) }),
    /* @__PURE__ */ jsxs("div", { className: "chatbot-component-body-text", children: [
      /* @__PURE__ */ jsxs("span", { className: "chatbot-component-body-text-title", children: [
        greeting,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "chatbot-component-body-text-username", children: [
          userName,
          "!"
        ] }),
        /* @__PURE__ */ jsx("img", { alt: t("chatBot.sunAlt"), src: SunIcon })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "chatbot-component-body-text-description", children: t("chatBot.irisIntro") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "chatbot-component-body-input-container", children: /* @__PURE__ */ jsx(
      ChatInput,
      {
        newChatScreen: true,
        activeList,
        customInputComponent,
        handleMicClick,
        handleRefresh,
        handleSaveChat,
        inputValue,
        isStopIcon,
        minRows: 4,
        setInputValue,
        setIsNewChat,
        setUserChats,
        showSuggestionBanner,
        suggestionBanner,
        userChats,
        onCloseSuggestionBanner,
        onSendIconClick,
        onStopIconClick
      }
    ) }),
    /* @__PURE__ */ jsx(ChatBotFooter, { footerText })
  ] }) });
}
export {
  NewChatComponent
};
