import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import default_1 from "../../node_modules/@mui/icons-material/Clear.js";
import { Button } from "../Button/index.js";
import { ChatBotFooter } from "./chatBotFooter.js";
import ChatInput from "./chatInput.js";
function CustomScreen({
  onClose,
  customScreenJsx,
  userChats,
  setUserChats,
  onSendIconClick,
  activeList,
  handleRefresh,
  handleMicClick,
  suggestionBanner,
  isStopIcon,
  onStopIconClick,
  onCloseSuggestionBanner,
  showSuggestionBanner,
  customInputComponent,
  isFullWidth,
  footerText
}) {
  const [input, setInput] = useState("");
  return /* @__PURE__ */ jsxs("div", { className: "chatbot-landing-screen-container", style: { pointerEvents: "auto" }, children: [
    !isFullWidth && /* @__PURE__ */ jsx("div", { className: "chatbot-landing-screen-container-close-icon", children: /* @__PURE__ */ jsx(
      Button,
      {
        className: "chatbot-component-header-close-icon",
        icon: /* @__PURE__ */ jsx(default_1, {}),
        iconPlacement: "left",
        size: "large",
        type: "default",
        variant: "text",
        onClick: onClose
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "chatbot-landing-screen-container-body", children: customScreenJsx }),
    /* @__PURE__ */ jsx("div", { className: "conversation-footer-container", children: /* @__PURE__ */ jsx(
      ChatInput,
      {
        customScreen: true,
        activeList,
        customInputComponent,
        handleMicClick,
        handleRefresh,
        inputValue: input,
        isStopIcon,
        minRows: 1,
        setInputValue: setInput,
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
  ] });
}
export {
  CustomScreen
};
