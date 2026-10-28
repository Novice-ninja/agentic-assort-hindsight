import { jsxs, jsx } from "react/jsx-runtime";
import { useTextOverflow } from "../../../../../utils/useTextOverflow.js";
import { Tooltip } from "../../../../Tooltip/index.js";
import { useTranslation } from "../../../../../i18n/useTranslation.js";
const ChatHeaderInfo = ({ title, createdBy, createdAt, chatId, showChatId = false }) => {
  const { t } = useTranslation();
  const fullText = `${chatId && showChatId ? t("tableChat.header.idSegment", { id: chatId.slice(0, 6) }) : ""}${createdBy ? t("tableChat.header.createdBySegment", { createdBy }) : ""}${createdAt ? t("tableChat.header.atSegment", { createdAt }) : ""}`;
  const { textRef: fullTextRef, isOverflowing: isFullTextOverflowing } = useTextOverflow([
    fullText,
    title
  ]);
  return /* @__PURE__ */ jsxs("div", { className: "chat-header-content", children: [
    /* @__PURE__ */ jsx("h1", { className: "chat-title chat-text-ellipsis", title, children: title }),
    fullText ? /* @__PURE__ */ jsx("div", { className: "chat-info-outer", children: /* @__PURE__ */ jsx(
      Tooltip,
      {
        isHoverEnabled: isFullTextOverflowing,
        orientation: "bottom",
        title: fullText,
        variant: "tertiary",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: fullTextRef,
            className: `chat-info-container ${isFullTextOverflowing ? "chat-text-ellipsis" : ""}`,
            title: isFullTextOverflowing ? fullText : void 0,
            children: fullText
          }
        )
      }
    ) }) : null
  ] });
};
export {
  ChatHeaderInfo as default
};
