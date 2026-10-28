import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { memo, useState, useEffect } from "react";
import default_1$2 from "../../../../node_modules/@mui/icons-material/ChevronLeft.js";
import default_1 from "../../../../node_modules/@mui/icons-material/Close.js";
import default_1$3 from "../../../../node_modules/@mui/icons-material/DeleteOutlined.js";
import default_1$1 from "../../../../node_modules/@mui/icons-material/Search.js";
import AddChat from "./AddChatContainer/AddChatContainer.js";
import { ChatHeaderButton } from "./ChatHeaderButton/ChatHeaderButton.js";
import { Button } from "../../../Button/index.js";
import { Input } from "../../../Input/index.js";
import { useTranslation } from "../../../../i18n/useTranslation.js";
const ChatHeaderNavigation = memo(
  ({
    title,
    onBack,
    onSearchClick,
    showChannelList,
    isSearchOpen,
    showAddChatBtn,
    handleChatName,
    filterChannelsByTitle,
    selectedChat,
    selectedChannelInfo,
    handleToast,
    onDeleteTopics,
    isCreateNewChatOpen,
    setIsCreateNewChatOpen
  }) => {
    const { t } = useTranslation();
    const [showAddChat, setShowAddChat] = useState(isCreateNewChatOpen);
    useEffect(() => {
      setShowAddChat(Boolean(isCreateNewChatOpen));
    }, [isCreateNewChatOpen]);
    const renderSearch = () => /* @__PURE__ */ jsx(
      Input,
      {
        leftIcon: /* @__PURE__ */ jsx(default_1$1, {}),
        placeholder: t("tableChat.nav.searchChatPlaceholder"),
        rightIcon: /* @__PURE__ */ jsx(default_1, {}),
        rightIconClick: () => {
          onSearchClick(!onSearchClick);
          filterChannelsByTitle("");
        },
        type: "text",
        width: "100%",
        onChange: (e) => {
          filterChannelsByTitle(e.target.value);
        }
      }
    );
    const renderNavLeft = () => /* @__PURE__ */ jsxs("div", { className: "nav-left", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          className: "",
          icon: /* @__PURE__ */ jsx(default_1$2, {}),
          iconPlacement: "left",
          size: "small",
          type: "default",
          variant: "tertiary",
          onClick: onBack
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "nav-title", children: title })
    ] });
    const renderNavRight = () => /* @__PURE__ */ jsx("div", { className: "nav-right", children: (selectedChat == null ? void 0 : selectedChat.length) > 0 ? /* @__PURE__ */ jsx(
      Button,
      {
        className: "delete_chat_container",
        icon: /* @__PURE__ */ jsx(default_1$3, {}),
        iconPlacement: "left",
        size: "small",
        type: "destructive",
        variant: "secondary",
        onClick: () => onDeleteTopics == null ? void 0 : onDeleteTopics()
      }
    ) : /* @__PURE__ */ jsxs(Fragment, { children: [
      showAddChatBtn && /* @__PURE__ */ jsx(
        ChatHeaderButton,
        {
          label: t("tableChat.chatButton.label"),
          onClick: () => {
            setShowAddChat((prev) => !prev);
          }
        }
      ),
      showAddChat && /* @__PURE__ */ jsx(
        AddChat,
        {
          handleChatName,
          handleToast,
          selectedChannelInfo,
          setIsCreateNewChatOpen,
          setShowAddChat,
          showAddChat
        }
      ),
      onSearchClick && /* @__PURE__ */ jsx(
        Button,
        {
          className: "",
          icon: /* @__PURE__ */ jsx(default_1$1, {}),
          iconPlacement: "left",
          size: "small",
          type: "default",
          variant: "tertiary",
          onClick: onSearchClick
        }
      )
    ] }) });
    const renderChannelListHeader = () => /* @__PURE__ */ jsxs("div", { className: showChannelList && "channel-list-header", children: [
      /* @__PURE__ */ jsx("h1", { className: "nav-title", style: { cursor: "pointer" }, onClick: onBack, children: title }),
      isSearchOpen ? /* @__PURE__ */ jsx(
        Input,
        {
          leftIcon: /* @__PURE__ */ jsx(default_1$1, {}),
          placeholder: t("tableChat.nav.searchChannelPlaceholder"),
          rightIcon: /* @__PURE__ */ jsx(default_1, {}),
          rightIconClick: () => {
            onSearchClick(!onSearchClick);
            filterChannelsByTitle("");
          },
          type: "text",
          width: "100%",
          onChange: (e) => {
            filterChannelsByTitle(e.target.value);
          }
        }
      ) : /* @__PURE__ */ jsx("div", { className: "chanel_right_navigation", children: /* @__PURE__ */ jsx("div", { className: "chanel_search", children: /* @__PURE__ */ jsx(
        "svg",
        {
          fill: "none",
          height: "14",
          viewBox: "0 0 14 14",
          width: "14",
          xmlns: "http://www.w3.org/2000/svg",
          onClick: onSearchClick,
          children: /* @__PURE__ */ jsx(
            "path",
            {
              d: "M5.35163 10.7033C3.85592 10.7033 2.59005 10.1852 1.55403 9.14923C0.51801 8.11321 0 6.84734 0 5.35163C0 3.85592 0.51801 2.59005 1.55403 1.55403C2.59005 0.51801 3.85592 0 5.35163 0C6.84734 0 8.11321 0.51801 9.14923 1.55403C10.1852 2.59005 10.7033 3.85592 10.7033 5.35163C10.7033 5.9554 10.6072 6.52487 10.4151 7.06003C10.223 7.5952 9.96226 8.06861 9.63293 8.48027L13.7736 12.6209C13.9245 12.7719 14 12.964 14 13.1973C14 13.4305 13.9245 13.6226 13.7736 13.7736C13.6226 13.9245 13.4305 14 13.1973 14C12.964 14 12.7719 13.9245 12.6209 13.7736L8.48027 9.63293C8.06861 9.96226 7.5952 10.223 7.06003 10.4151C6.52487 10.6072 5.9554 10.7033 5.35163 10.7033ZM5.35163 9.0566C6.38079 9.0566 7.25557 8.6964 7.97599 7.97599C8.6964 7.25557 9.0566 6.38079 9.0566 5.35163C9.0566 4.32247 8.6964 3.44768 7.97599 2.72727C7.25557 2.00686 6.38079 1.64666 5.35163 1.64666C4.32247 1.64666 3.44768 2.00686 2.72727 2.72727C2.00686 3.44768 1.64666 4.32247 1.64666 5.35163C1.64666 6.38079 2.00686 7.25557 2.72727 7.97599C3.44768 8.6964 4.32247 9.0566 5.35163 9.0566Z",
              fill: "#60697D"
            }
          )
        }
      ) }) })
    ] });
    return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "chat-header-navigation", children: isSearchOpen ? renderSearch() : showChannelList ? renderChannelListHeader() : /* @__PURE__ */ jsxs(Fragment, { children: [
      renderNavLeft(),
      " ",
      renderNavRight()
    ] }) }) });
  }
);
export {
  ChatHeaderNavigation
};
