import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { ChatChannelItem } from "./ChatChannelItem.js";
import { useTranslation } from "../../../../i18n/useTranslation.js";
const isItemPinned = (item) => {
  var _a;
  return Boolean((item == null ? void 0 : item.isPinned) ?? ((_a = item == null ? void 0 : item.otherProps) == null ? void 0 : _a.is_pinned));
};
const ChatChannelList = ({
  channels,
  selectedChannelOrChatId,
  onChannelSelect,
  showChannelList,
  showCheckbox,
  handleChatSelect,
  selectedChat = [],
  onPinnedChatClick,
  handleToast
}) => {
  const { t } = useTranslation();
  const [pinnedOverrides, setPinnedOverrides] = useState({});
  useEffect(() => {
    if (!Array.isArray(channels)) return;
    setPinnedOverrides((prev) => {
      let changed = false;
      const next = { ...prev };
      channels.forEach((ch) => {
        if ((ch == null ? void 0 : ch.id) != null && prev[ch.id] !== void 0 && isItemPinned(ch) === Boolean(prev[ch.id])) {
          delete next[ch.id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [channels]);
  const getEffectivePinned = useCallback(
    (item) => {
      if ((item == null ? void 0 : item.id) != null && pinnedOverrides.hasOwnProperty(item.id)) {
        return Boolean(pinnedOverrides[item.id]);
      }
      return isItemPinned(item);
    },
    [pinnedOverrides]
  );
  const handlePinnedChange = useCallback((chatId, newPinned) => {
    setPinnedOverrides((prev) => ({ ...prev, [chatId]: newPinned }));
  }, []);
  const sortedChannels = Array.isArray(channels) ? [...channels].sort((a, b) => {
    const aPinned = getEffectivePinned(a);
    const bPinned = getEffectivePinned(b);
    if (aPinned === bPinned) return 0;
    return aPinned ? -1 : 1;
  }) : [];
  return /* @__PURE__ */ jsx("div", { className: "chat-channel-list", children: sortedChannels.length > 0 ? sortedChannels.map((channel, index) => /* @__PURE__ */ jsx(
    ChatChannelItem,
    {
      ...channel,
      handleChatSelect,
      handleToast,
      isPinned: getEffectivePinned(channel),
      isSelected: channel.id === selectedChannelOrChatId,
      selectedChat,
      showChannelList,
      showCheckbox,
      onClick: (e) => onChannelSelect(channel == null ? void 0 : channel.id, channel),
      onPinnedChange: handlePinnedChange,
      onPinnedChatClick
    },
    `${channel.id}-${index}`
  )) : /* @__PURE__ */ jsxs("div", { className: "no-channels-found-container", children: [
    /* @__PURE__ */ jsx("p", { className: "no-channels-found", children: showChannelList ? t("tableChat.channelList.noChannelsFound") : t("tableChat.channelList.noChatsFound") }),
    /* @__PURE__ */ jsx("p", { className: "no-channels-found-description", children: showChannelList ? t("tableChat.channelList.createChannelPrompt") : t("tableChat.channelList.createChatPrompt") })
  ] }) });
};
export {
  ChatChannelList
};
