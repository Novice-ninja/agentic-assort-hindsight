import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import default_1 from "../../../../node_modules/@mui/icons-material/NotificationsOff.js";
import { getAssetUrl } from "../../../../utils/assetBase.js";
import { ChannelCheckbox } from "./ChannelCheckbox/ChannelCheckbox.js";
import { UnreadBadge } from "./UnreadBadge/UnreadBadge.js";
import { Avatar } from "../../../Avatar/index.js";
import { useTranslation } from "../../../../i18n/useTranslation.js";
const PinnedIcon = getAssetUrl("icons/pinedIcon.svg");
const ChatChannelItem = ({
  id,
  title,
  subtitle,
  timestamp,
  unreadCount,
  avatar,
  isSelected,
  isMuted,
  onClick,
  showChannelList,
  showCheckbox = true,
  handleChatSelect = { handleChatSelect },
  selectedChat,
  onPinnedChatClick,
  onPinnedChange,
  handleToast,
  isPinned: isPinnedProp,
  ...rest
}) => {
  const { t } = useTranslation();
  const isPinned = Boolean(isPinnedProp ?? rest.isPinned);
  const handlePinnedChatClick = async (chatId, newPinned) => {
    if (onPinnedChatClick) {
      onPinnedChange == null ? void 0 : onPinnedChange(chatId, newPinned);
      try {
        const response = await onPinnedChatClick(chatId, newPinned);
        onPinnedChange == null ? void 0 : onPinnedChange(chatId, response);
      } catch (error) {
        onPinnedChange == null ? void 0 : onPinnedChange(chatId, !newPinned);
        handleToast(true, t("tableChat.channelItem.errorPinningChat"), "error");
        console.error("Error pinning chat:", error);
      }
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `${showChannelList ? "channel_list" : "chat_list"}  ${isSelected ? "selected" : ""} ${isMuted ? "muted" : ""}`,
      role: "button",
      tabIndex: 0,
      onClick: (e) => {
        e.stopPropagation();
        onClick == null ? void 0 : onClick(id);
      },
      onKeyPress: (e) => {
        if (e.key === "Enter" || e.key === " ") onClick == null ? void 0 : onClick(id);
      },
      children: [
        !showChannelList && /* @__PURE__ */ jsxs(Fragment, { children: [
          showCheckbox && /* @__PURE__ */ jsx(
            ChannelCheckbox,
            {
              handleChatSelect,
              id,
              selectedChat
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "channel-avatar", children: /* @__PURE__ */ jsx(Avatar, { label: (avatar == null ? void 0 : avatar.label) || title, size: "medium", src: avatar == null ? void 0 : avatar.src }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "channel-content", children: [
          /* @__PURE__ */ jsxs("div", { className: "channel-header", children: [
            /* @__PURE__ */ jsx("h3", { className: "channel-title", children: title }),
            /* @__PURE__ */ jsxs("div", { children: [
              isMuted && /* @__PURE__ */ jsx(default_1, { className: "muted-icon", fontSize: "small" }),
              /* @__PURE__ */ jsx(UnreadBadge, { count: unreadCount })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "channel-subtitle", children: subtitle }),
          /* @__PURE__ */ jsxs("div", { className: "pinnedChat_container", children: [
            /* @__PURE__ */ jsx("span", { className: "channel-time", children: timestamp }),
            !showChannelList && /* @__PURE__ */ jsx(
              "img",
              {
                alt: "",
                "aria-label": isPinned ? t("tableChat.channelItem.unpinChat") : t("tableChat.channelItem.pinChat"),
                className: isPinned ? "pinnedChat pinnedChat--active" : "pinnedChat",
                role: "button",
                src: PinnedIcon,
                tabIndex: 0,
                onClick: (e) => {
                  e.stopPropagation();
                  handlePinnedChatClick(id, !isPinned);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePinnedChatClick(id, !isPinned);
                  }
                }
              }
            )
          ] })
        ] })
      ]
    }
  );
};
export {
  ChatChannelItem
};
