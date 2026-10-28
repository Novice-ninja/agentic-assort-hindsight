import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { getAssetUrl } from "../../../../../utils/assetBase.js";
import { useTranslation } from "../../../../../i18n/useTranslation.js";
const ThreeDotIcon = getAssetUrl("icons/treedotIcon.svg");
const TreadChatIcon = getAssetUrl("icons/treadChatIcon.svg");
const PinnedIcon = getAssetUrl("icons/pinedIcon.svg");
const UnpinIcon = getAssetUrl("icons/unpinedIcon.svg");
const ChatEditedMessageType = ({
  content,
  timestamp,
  handleClickOnMoreOptions,
  priority = "default",
  edited = false,
  onThreadClick,
  pinned,
  onPin
}) => {
  const { t } = useTranslation();
  const [showPinned, setShowPinned] = useState(pinned);
  const handlePin = async (isPinned) => {
    try {
      const response = await onPin(isPinned);
      console.log("Response: [DefaultMessageType]", response);
      if (response) {
        setShowPinned(isPinned);
      }
      return response;
    } catch (error) {
      console.error("Error pinning message:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `message-text ${priority}`, children: [
    typeof content === "string" ? /* @__PURE__ */ jsx("p", { children: content }) : content,
    /* @__PURE__ */ jsxs("div", { className: `message-header ${!isUser ? "flex-end" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "message-action-container", children: [
        /* @__PURE__ */ jsx("img", { alt: "threedot", src: ThreeDotIcon, onClick: handleClickOnMoreOptions }),
        /* @__PURE__ */ jsx("img", { alt: "treaddd", src: TreadChatIcon, onClick: onThreadClick })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "message-action-info-container", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            alt: "unpinned",
            height: 12.63,
            src: pinned ? PinnedIcon : UnpinIcon,
            style: { cursor: "pointer" },
            width: 12.63,
            onClick: () => handlePin(!showPinned)
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "message-action-info", children: [
          timestamp,
          edited && /* @__PURE__ */ jsxs("span", { className: "edited-label", children: [
            " ",
            t("commentsPanel.edited")
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  ChatEditedMessageType as default
};
