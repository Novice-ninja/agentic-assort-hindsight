import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/Clear.js";
import default_1$1 from "../../node_modules/@mui/icons-material/SaveOutlined.js";
import TextareaAutosize from "react-textarea-autosize";
import { getAssetUrl } from "../../utils/assetBase.js";
import { onResize } from "../../utils/onResize.js";
import { Button } from "../Button/index.js";
import { Tooltip } from "../Tooltip/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
import Box from "../../node_modules/@mui/material/Box/Box.js";
import IconButton from "../../node_modules/@mui/material/IconButton/IconButton.js";
const chatbotBannerIcon = getAssetUrl("icons/chatbotBannerIcon.svg");
const MicIcon = getAssetUrl("icons/chatBotMicIcon.svg");
const RefreshIcon = getAssetUrl("icons/chatBotRefreshIcon.svg");
const SendIcon = getAssetUrl("icons/chatBotSendIcon.svg");
const ChatbotStopIcon = getAssetUrl("icons/chatbotStopIcon.svg");
const COMPACT_INPUT_WIDTH = 480;
function ChatInput({
  inputValue,
  setInputValue,
  setIsNewChat,
  onSendIconClick,
  setUserChats,
  userChats,
  handleRefresh,
  handleSaveChat,
  handleMicClick,
  activeList,
  uniqueId,
  suggestionBanner,
  isStopIcon,
  onStopIconClick,
  minRows = 1,
  newChatScreen = false,
  customScreen = false,
  onCloseSuggestionBanner,
  showSuggestionBanner,
  customInputComponent
}) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [isCompact, setIsCompact] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [height, setHeight] = useState("auto");
  const MAX_HEIGHT = 142;
  const handleHeightChange = (textareaHeight) => {
    if (!textareaHeight) return;
    if (!inputValue.trim()) {
      setIsFixed(false);
      setIsScrollable(false);
      setHeight("auto");
      return;
    }
    if (textareaHeight > 40) setIsFixed(true);
    setIsScrollable(textareaHeight >= MAX_HEIGHT);
    const newHeight = textareaHeight > (newChatScreen ? 88 : 40) ? textareaHeight + 40 : "auto";
    if (newHeight !== "auto") setHeight(newHeight <= MAX_HEIGHT ? newHeight : MAX_HEIGHT);
  };
  useEffect(() => {
    if (inputValue === "") {
      setHeight("auto");
      setIsFixed(false);
    }
  }, [inputValue]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return onResize(container, ({ width }) => {
      setIsCompact(width < COMPACT_INPUT_WIDTH);
    });
  }, []);
  const handleSendMessage = () => {
    var _a;
    setIsNewChat == null ? void 0 : setIsNewChat(false);
    setInputValue("");
    (_a = inputRef.current) == null ? void 0 : _a.blur();
    const newUserChat = {
      id: userChats.length + 1,
      text: inputValue,
      role: "user",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    setUserChats((prev) => [...prev, newUserChat]);
    onSendIconClick == null ? void 0 : onSendIconClick(newUserChat, activeList, uniqueId);
  };
  const handleStopIconClick = () => {
    onStopIconClick == null ? void 0 : onStopIconClick(activeList);
  };
  return /* @__PURE__ */ jsxs(
    Box,
    {
      ref: containerRef,
      className: `chat-input-box ${newChatScreen ? "new-chat-screen" : ""} ${customScreen ? "custom-screen" : ""}`,
      children: [
        showSuggestionBanner && /* @__PURE__ */ jsxs("div", { className: "suggestion-banner", children: [
          /* @__PURE__ */ jsxs("div", { className: "suggestion-banner-content", children: [
            /* @__PURE__ */ jsx("img", { alt: "suggestion", src: chatbotBannerIcon }),
            /* @__PURE__ */ jsx("span", { className: "suggestion-banner-text", children: suggestionBanner.freeTextContent })
          ] }),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              disableRipple: true,
              size: "small",
              sx: { color: "#60697D" },
              onClick: onCloseSuggestionBanner,
              children: /* @__PURE__ */ jsx(default_1, { fontSize: "small", sx: { fontSize: "16px" } })
            }
          )
        ] }),
        customInputComponent ? customInputComponent : /* @__PURE__ */ jsx("div", { className: "chat-input-container", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `chat-input-wrapper ${isFixed ? "stacked" : ""} ${(!isFixed || inputValue === "") && !newChatScreen ? "empty" : ""} ${!newChatScreen && !isFixed ? "single-line-textarea" : ""}`,
            style: { height },
            children: [
              /* @__PURE__ */ jsx(
                TextareaAutosize,
                {
                  ref: inputRef,
                  className: `chat-textarea ${isScrollable ? "scrollable" : ""}`,
                  minRows,
                  placeholder: t("chatBot.inputPlaceholder"),
                  value: inputValue,
                  onChange: (e) => {
                    setInputValue(e.target.value);
                  },
                  onHeightChange: handleHeightChange,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (inputValue.trim().length > 0) handleSendMessage();
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: `chat-actions ${isFixed ? "fixed" : ""}`, children: [
                handleRefresh && /* @__PURE__ */ jsx(
                  Button,
                  {
                    icon: /* @__PURE__ */ jsx("img", { alt: "refresh", src: RefreshIcon }),
                    iconPlacement: "left",
                    size: isCompact ? "medium" : "large",
                    type: "default",
                    variant: "url",
                    onClick: handleRefresh
                  }
                ),
                handleMicClick && /* @__PURE__ */ jsx(
                  Button,
                  {
                    icon: /* @__PURE__ */ jsx("img", { alt: "mic", src: MicIcon }),
                    iconPlacement: "left",
                    size: isCompact ? "medium" : "large",
                    type: "default",
                    variant: "tertiary",
                    onClick: handleMicClick
                  }
                ),
                handleSaveChat && /* @__PURE__ */ jsx(Tooltip, { title: t("chatBot.saveChat"), variant: "tertiary", children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    icon: /* @__PURE__ */ jsx(default_1$1, {}),
                    iconPlacement: "left",
                    id: "chat-input-save-button",
                    size: isCompact ? "medium" : "large",
                    type: "default",
                    variant: "tertiary",
                    onClick: handleSaveChat
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    className: isStopIcon ? "stop-icon-button" : "",
                    icon: !isStopIcon ? /* @__PURE__ */ jsx("img", { alt: "send", src: SendIcon }) : /* @__PURE__ */ jsx("img", { alt: "stop", src: ChatbotStopIcon }),
                    iconPlacement: "left",
                    id: "chat-input-send-button",
                    size: isCompact ? "medium" : "large",
                    type: "default",
                    variant: "primary",
                    onClick: !isStopIcon ? handleSendMessage : handleStopIconClick
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  ChatInput as default
};
