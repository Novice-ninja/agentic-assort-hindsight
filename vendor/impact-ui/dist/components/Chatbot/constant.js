import { getAssetUrl } from "../../utils/assetBase.js";
const NotificationIcon = getAssetUrl("icons/bell.svg");
const BookMarkIcon = getAssetUrl("icons/bookmarkIcon.svg");
const HistoryIcon = getAssetUrl("icons/historyIcon.svg");
const NewChatIcon = getAssetUrl("icons/newChatIcon.svg");
const PageIcon = getAssetUrl("icons/pageIcon.svg");
const menuItems = [
  { key: "bookmark", icon: BookMarkIcon },
  { key: "history", icon: HistoryIcon },
  { key: "page", icon: PageIcon },
  {
    key: "notification",
    icon: NotificationIcon,
    iconClassName: "chatbot-component-menu-container-icon-notification"
  }
];
const mandatoryTabList = [{ key: "history", icon: HistoryIcon }];
const newChatMenuItem = {
  key: "newchat",
  icon: NewChatIcon,
  className: "chatbot-component-menu-container-icon-new-chat"
};
export {
  mandatoryTabList,
  menuItems,
  newChatMenuItem
};
