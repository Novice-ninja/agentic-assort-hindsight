import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, Fragment } from "react";
import moment from "moment";
import { ChatBotFooter } from "./chatBotFooter.js";
import ChatInput from "./chatInput.js";
import { getDateLabel, formatAMPM } from "./utils.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function ConversationScreen({
  userChats,
  setUserChats,
  onSendIconClick,
  conversation,
  isAssistantThinking,
  activeList,
  onLikeClick,
  onDislikeClick,
  inputText,
  handleRefresh,
  handleSaveChat,
  handleMicClick,
  suggestionBanner,
  isStopIcon,
  onStopIconClick,
  onCloseSuggestionBanner,
  showSuggestionBanner,
  customInputComponent,
  footerText,
  isCollapsed
}) {
  const { t, locale } = useTranslation();
  const [input, setInput] = useState(inputText ?? "");
  const [conversationMessages, setConversationMessages] = useState([]);
  const conversationBodyRef = useRef(null);
  useEffect(() => {
    setInput(inputText ?? "");
  }, [inputText]);
  useEffect(() => {
    const conversationsObj = conversation.conversations || {};
    const firstKey = Object.keys(conversationsObj)[0];
    const thread = firstKey ? conversationsObj[firstKey] : void 0;
    const messagesArr = (thread == null ? void 0 : thread.messages) || [];
    const mapped = messagesArr.map((msg) => ({
      ...msg,
      role: msg.userType === "bot" ? "assistant" : "user",
      text: msg.bodyText,
      type: msg.jsx ? "jsx" : msg.bodyType,
      formComponent: msg.bodyType === "form" ? msg.formComponent : void 0,
      tableComponent: msg.bodyType === "table" ? msg.tableComponent : void 0,
      timestamp: msg.timeStamp === "" ? "" : moment(msg.timeStamp, "DD-MM-YYYY HH:mm:ss").format("MM-DD-YYYY HH:mm:ss"),
      jsx: msg.jsx,
      thinkingResponse: msg.thinkingResponse
    }));
    setConversationMessages(mapped);
  }, [conversation]);
  useEffect(() => {
    const body = conversationBodyRef.current;
    if (!body) return;
    if (typeof body.scrollTo === "function") {
      body.scrollTo({
        top: body.scrollHeight,
        behavior: "smooth"
      });
    } else {
      body.scrollTop = body.scrollHeight;
    }
  }, [conversationMessages, isAssistantThinking, conversation]);
  const handleLikeClick = (chat, idx) => {
    chat.isAnimateLike = true;
    const timeout = setTimeout(() => {
      chat.isAnimateLike = false;
    }, 1e3);
    onLikeClick == null ? void 0 : onLikeClick(chat, idx);
    return () => {
      clearTimeout(timeout);
    };
  };
  const handleDislikeClick = (chat, idx) => {
    chat.isAnimateDislike = true;
    const timeout = setTimeout(() => {
      chat.isAnimateDislike = false;
    }, 1e3);
    onDislikeClick == null ? void 0 : onDislikeClick(chat, idx);
    return () => {
      clearTimeout(timeout);
    };
  };
  return /* @__PURE__ */ jsxs("div", { className: "conversation-screen-container", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: conversationBodyRef,
        className: `conversation-body-container ${showSuggestionBanner ? "show-suggestion-banner" : ""} ${isCollapsed ? "collapsed" : ""}`,
        children: [
          conversationMessages.map((chat, idx) => {
            var _a, _b, _c;
            const prevMsg = conversationMessages[idx - 1];
            const showDateLabel = idx === 0 || chat.timestamp && (prevMsg == null ? void 0 : prevMsg.timestamp) && new Date(chat.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
            return /* @__PURE__ */ jsxs(Fragment, { children: [
              showDateLabel && /* @__PURE__ */ jsx("div", { className: "time_stamp_badge_chat_container", children: /* @__PURE__ */ jsx("div", { className: "time_stamp_badge_chat", children: getDateLabel(chat.timestamp, t, locale) }) }),
              chat.role === "user" ? /* @__PURE__ */ jsx("div", { className: "user_chat_messages_container", children: /* @__PURE__ */ jsxs("div", { className: "user_chat_message", children: [
                /* @__PURE__ */ jsx("div", { className: "user_chat_message_text", children: chat.text }),
                /* @__PURE__ */ jsx("div", { className: "time_chat", children: chat.timestamp ? formatAMPM(new Date(chat.timestamp)) : "" })
              ] }) }) : chat.role === "assistant" ? /* @__PURE__ */ jsxs("div", { className: "assistant_chat_messages_container", children: [
                chat.firstMessage ? /* @__PURE__ */ jsx("div", { className: "chat_logo_circle" }) : /* @__PURE__ */ jsx("div", { className: "chat_logo_circle_empty" }),
                /* @__PURE__ */ jsxs("div", { className: "response_main_container", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `assistant_with_dropdown_container ${chat.thinkingResponse ? "" : "dis_none"}`,
                      children: (_a = chat.thinkingResponse) == null ? void 0 : _a.thinkingHeading
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `assistant_main_container ${chat.bodyType === "questions" ? "questions-container" : ""}`,
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "assistant_text_container", children: [
                          chat.type === "jsx" && chat.jsx,
                          chat.type === "form" && chat.formComponent,
                          chat.type === "table" && chat.tableComponent,
                          chat.type === "text" && chat.text
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "time_chat", children: chat.timestamp ? formatAMPM(new Date(chat.timestamp)) : "" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "assistant_actions_container", children: [
                    /* @__PURE__ */ jsxs("div", { className: "left_icon_container_action", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: `asst_feedback_buttons good_feedback ${chat.enableLikes ? "" : "dis_none"} ${((_b = chat.extra) == null ? void 0 : _b.status) === "liked" ? "liked" : ""} ${chat.isAnimateLike ? "animatingLike" : ""}`,
                          onClick: () => handleLikeClick(chat, idx)
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: `asst_feedback_buttons bad_feedback ${chat.enableLikes ? "" : "dis_none"} ${((_c = chat.extra) == null ? void 0 : _c.status) === "disliked" ? "disliked" : ""} ${chat.isAnimateDislike ? "animatingDislike" : ""}`,
                          onClick: () => handleDislikeClick(chat, idx)
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: `asst_feedback_buttons speaker ${chat.enableSpeaker ? "" : "dis_none"}`
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "button_url_container", children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: `asst_feedback_buttons ${chat.enableNewThread ? "" : "dis_none"}`,
                        children: t("chatBot.newThread")
                      }
                    ) }),
                    /* @__PURE__ */ jsx("div", { className: "button_url_container", children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: `asst_feedback_buttons ${chat.enableAddToPage ? "" : "dis_none"}`,
                        children: t("chatBot.addToPage")
                      }
                    ) })
                  ] })
                ] })
              ] }) : null
            ] }, idx);
          }),
          isAssistantThinking && /* @__PURE__ */ jsxs("div", { className: "assistant_chat_messages_container", children: [
            /* @__PURE__ */ jsx("div", { className: "chat_logo_circle" }),
            /* @__PURE__ */ jsxs("div", { className: `loading_messages ${isAssistantThinking ? "" : "dis_none"}`, children: [
              /* @__PURE__ */ jsx("span", { className: "dot" }),
              /* @__PURE__ */ jsx("span", { className: "dot" }),
              /* @__PURE__ */ jsx("span", { className: "dot" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "conversation-footer-container", children: /* @__PURE__ */ jsx(
      ChatInput,
      {
        activeList,
        customInputComponent,
        handleMicClick,
        handleRefresh,
        handleSaveChat,
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
  ConversationScreen
};
