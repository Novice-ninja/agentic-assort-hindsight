import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import default_1$2 from "../../../../../node_modules/@mui/icons-material/Close.js";
import default_1 from "../../../../../node_modules/@mui/icons-material/ExpandLessOutlined.js";
import default_1$1 from "../../../../../node_modules/@mui/icons-material/ExpandMoreOutlined.js";
import default_1$3 from "../../../../../node_modules/@mui/icons-material/Search.js";
import { getAssetUrl } from "../../../../../utils/assetBase.js";
import { Button } from "../../../../Button/index.js";
import { Input } from "../../../../Input/index.js";
import { Menu } from "../../../../Menu/index.js";
import { chartConfig } from "../../chatConfig.js";
import AvatarGroup from "../AvatarGroup/AvatarGroup.js";
import { ChatNotificationSettings } from "../ChatNotificationSettings/ChatNotificationSettings.js";
import { useTranslation } from "../../../../../i18n/useTranslation.js";
const PinnedIcon = getAssetUrl("icons/pinnedIcon.svg");
const SearchIcon = getAssetUrl("icons/searchIcon.svg");
const UserPlusIcon = getAssetUrl("icons/userPlusIcon1.svg");
const ThreedotIcon = getAssetUrl("icons/treedotIcon.svg");
const ChatHeaderAction = ({
  enableSearch,
  messageSearchValue,
  handleOpenMessageSearch,
  handleCloseMessageSearch,
  handleMessageSearchChange,
  onParticipantsClick,
  participants,
  onPinnedClick,
  threeDotMenuOptions,
  showNotificationSettings,
  handleNotificationSettingsClose,
  onThreeDotMenuClick,
  externalHandlers,
  isLoadingOptions,
  isSearching,
  filteredMenuOptions,
  menuSearchQuery,
  setMenuSearchQuery,
  renderCustomHeader,
  threeDotMenuOpen,
  onSaveNotification,
  selectedMenuItems,
  setSelectedMenuItems,
  handleThreeDotMenuClose,
  notificationSettings,
  maxAvatars = 2,
  selectedRadioOption,
  chatId,
  menuOptions,
  externalSavingMembers,
  chatHeaderConfig,
  ...restProps
}) => {
  const { t } = useTranslation();
  const {
    showSearch = chartConfig.tableChatRightSectionConfig.tableChatHeaderConfig.showSearch,
    showPinned = chartConfig.tableChatRightSectionConfig.tableChatHeaderConfig.showPinned,
    showParticipants = chartConfig.tableChatRightSectionConfig.tableChatHeaderConfig.showParticipants,
    showThreeDotMenu = chartConfig.tableChatRightSectionConfig.tableChatHeaderConfig.showThreeDotMenu,
    className = chartConfig.tableChatRightSectionConfig.tableChatHeaderConfig.className,
    searchPlaceholder = chartConfig.tableChatRightSectionConfig.tableChatHeaderConfig.searchPlaceholder,
    isAddParticipantsAllowed = chartConfig.tableChatRightSectionConfig.tableChatHeaderConfig.isAddParticipantsAllowed
  } = restProps;
  const [openMenu, setOpenMenu] = useState(false);
  const [threeDotAnchorEl, setThreeDotAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isParticipantAdding, setIsParticipantAdding] = useState(false);
  const [isNotificationSettingsSaving, setIsNotificationSettingsSaving] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const handleThreeDotMenuClick = (event) => {
    onThreeDotMenuClick == null ? void 0 : onThreeDotMenuClick();
    setThreeDotAnchorEl(event.currentTarget);
  };
  const handleParticipantsClick = async (event) => {
    var _a;
    try {
      setAnchorEl(event.currentTarget);
      setOpenMenu(true);
      if (externalHandlers == null ? void 0 : externalHandlers.onParticipantsClick) {
        await ((_a = externalHandlers == null ? void 0 : externalHandlers.onParticipantsClick) == null ? void 0 : _a.call(externalHandlers));
      }
    } catch (error) {
      console.error("Error loading participants:", error);
    }
  };
  const handleNotificationSettingsClick = async (data) => {
    var _a;
    try {
      setIsNotificationSettingsSaving(true);
      if (externalHandlers == null ? void 0 : externalHandlers.onNotificationSettingChange) {
        await ((_a = externalHandlers == null ? void 0 : externalHandlers.onNotificationSettingChange) == null ? void 0 : _a.call(externalHandlers, data));
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setIsNotificationSettingsSaving(false);
    }
  };
  const fetchParticipants = async (radioOption) => {
    if (externalHandlers == null ? void 0 : externalHandlers.loadParticipantsAvatar) {
      const participants2 = await (externalHandlers == null ? void 0 : externalHandlers.loadParticipantsAvatar(
        radioOption,
        chatId
      ));
      setParticipantsList(participants2);
    }
  };
  useEffect(() => {
    if (chatId || externalSavingMembers) {
      fetchParticipants("existing");
    }
  }, [chatId, externalSavingMembers, menuOptions == null ? void 0 : menuOptions.length]);
  const handleParticipantAddOrRemove = async () => {
    var _a;
    try {
      setIsParticipantAdding(true);
      if (externalHandlers == null ? void 0 : externalHandlers.onParticipantAdd) {
        const result = await externalHandlers.onParticipantAdd(
          selectedMenuItems,
          selectedRadioOption,
          chatId
        );
        await ((_a = externalHandlers == null ? void 0 : externalHandlers.handleRadioButtonChange) == null ? void 0 : _a.call(externalHandlers, selectedRadioOption));
      }
    } catch (error) {
      console.error("Error adding participants:", error);
    } finally {
      setIsParticipantAdding(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `chat-header-right ${className} ${enableSearch ? "search-enabled" : ""}`, children: [
    showSearch && /* @__PURE__ */ jsx("div", { className: "chat-search-container", children: enableSearch ? /* @__PURE__ */ jsx("div", { className: "chat-search-input-container", children: /* @__PURE__ */ jsx(
      Input,
      {
        autoFocus: true,
        leftIcon: /* @__PURE__ */ jsx(default_1$3, {}),
        placeholder: searchPlaceholder,
        rightIcon: (messageSearchValue == null ? void 0 : messageSearchValue.length) > 0 ? /* @__PURE__ */ jsxs("div", { className: "chat-search-right-icon-container", children: [
          /* @__PURE__ */ jsx(
            default_1,
            {
              onClick: (e) => {
                var _a;
                e.stopPropagation();
                e.preventDefault();
                (_a = chatHeaderConfig == null ? void 0 : chatHeaderConfig.onSearchUp) == null ? void 0 : _a.call(chatHeaderConfig, messageSearchValue, chatId);
              }
            }
          ),
          /* @__PURE__ */ jsx(
            default_1$1,
            {
              onClick: (e) => {
                var _a;
                e.stopPropagation();
                e.preventDefault();
                (_a = chatHeaderConfig == null ? void 0 : chatHeaderConfig.onSearchDown) == null ? void 0 : _a.call(chatHeaderConfig, messageSearchValue, chatId);
              }
            }
          ),
          /* @__PURE__ */ jsx(default_1$2, {})
        ] }) : null,
        rightIconClick: handleCloseMessageSearch,
        type: "text",
        value: messageSearchValue,
        width: "100%",
        onChange: (e) => handleMessageSearchChange(e)
      }
    ) }) : /* @__PURE__ */ jsx(
      "img",
      {
        alt: "search",
        className: "search-icon",
        src: SearchIcon,
        onClick: handleOpenMessageSearch
      }
    ) }),
    showPinned && /* @__PURE__ */ jsx("div", { className: "chat-pinned", children: /* @__PURE__ */ jsx(
      Button,
      {
        className: "pinned_img",
        icon: /* @__PURE__ */ jsx("img", { className: "participants-img", src: PinnedIcon }),
        iconPlacement: "left",
        size: "large",
        type: "default",
        variant: "tertiary",
        onClick: onPinnedClick
      }
    ) }),
    showParticipants && /* @__PURE__ */ jsx("div", { className: "chat-participants", children: /* @__PURE__ */ jsxs("div", { className: "chat-participants-container", children: [
      participantsList.length > 0 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        AvatarGroup,
        {
          avatars: participantsList,
          maxAvatars,
          size: "sm"
        }
      ) }),
      isAddParticipantsAllowed ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            "aria-label": t("tableChat.header.viewAllParticipants", {
              count: participants.length
            }),
            className: "btn_border participants-button ",
            icon: /* @__PURE__ */ jsx("img", { className: "participants-img", src: UserPlusIcon }),
            iconPlacement: "left",
            size: "small",
            type: "default",
            variant: "tertiary",
            onClick: handleParticipantsClick
          }
        ),
        /* @__PURE__ */ jsx(
          Menu,
          {
            withActionButtons: true,
            anchorEl,
            customHeaderProps: {
              selectedItems: selectedMenuItems,
              externalHandlers: {
                // ...externalHandlers,
                // onRadioButtonChange: async (value) => {
                //   console.log("onRadioButtonChange", value);
                //   handleRadioChange(value);
                // },
              },
              isLoading: isLoadingOptions,
              isSearching,
              onSelectionChange: (newSelection) => {
                var _a;
                setSelectedMenuItems(newSelection);
                (_a = externalHandlers == null ? void 0 : externalHandlers.onSelectionChange) == null ? void 0 : _a.call(externalHandlers, newSelection);
              }
            },
            filteredOptions: filteredMenuOptions,
            iconPlacement: "left",
            menuContainerClassName: "participants-menu-container",
            MenuProps: {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right"
              }
            },
            open: openMenu,
            options: filteredMenuOptions,
            primaryButtonProps: {
              loading: isParticipantAdding,
              disabled: isParticipantAdding,
              label: selectedRadioOption === "new" ? t("tableChat.header.add") : t("tableChat.header.remove")
            },
            searchQuery: menuSearchQuery,
            selected: "add",
            onClearSelection: () => {
              var _a;
              setSelectedMenuItems([]);
              (_a = externalHandlers == null ? void 0 : externalHandlers.onClearSelection) == null ? void 0 : _a.call(externalHandlers);
            },
            onClose: () => {
              var _a;
              setOpenMenu(false);
              (_a = externalHandlers == null ? void 0 : externalHandlers.onClose) == null ? void 0 : _a.call(externalHandlers);
            },
            onPrimaryButtonClick: handleParticipantAddOrRemove,
            onSearchChange: (value) => {
              var _a;
              (_a = externalHandlers == null ? void 0 : externalHandlers.onSearchChange) == null ? void 0 : _a.call(externalHandlers, value);
            },
            onSelectAll: (allValues) => {
              var _a;
              setSelectedMenuItems(allValues);
              (_a = externalHandlers == null ? void 0 : externalHandlers.onSelectAll) == null ? void 0 : _a.call(externalHandlers, allValues);
            },
            onTertiaryButtonClick: () => {
              var _a;
              setOpenMenu(false);
              (_a = externalHandlers == null ? void 0 : externalHandlers.onClose) == null ? void 0 : _a.call(externalHandlers);
            },
            withCheckbox: true,
            renderCustomHeader
          }
        )
      ] }) : null
    ] }) }),
    showThreeDotMenu ? /* @__PURE__ */ jsx(
      Button,
      {
        className: "chat-header-right-button btn_border_participant ",
        icon: /* @__PURE__ */ jsx("img", { src: ThreedotIcon }),
        iconPlacement: "left",
        size: "small",
        type: "default",
        variant: "tertiary",
        onClick: handleThreeDotMenuClick
      }
    ) : null,
    /* @__PURE__ */ jsx(
      Menu,
      {
        anchorEl: threeDotAnchorEl,
        iconPlacement: "left",
        MenuProps: {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        },
        open: threeDotMenuOpen,
        selected: "add",
        onClose: () => {
          handleThreeDotMenuClose == null ? void 0 : handleThreeDotMenuClose();
        },
        menuContainerClassName: "three-dot-menu-container",
        options: threeDotMenuOptions
      }
    ),
    /* @__PURE__ */ jsx(
      ChatNotificationSettings,
      {
        isLoading: isNotificationSettingsSaving,
        isOpen: showNotificationSettings,
        notificationSettings,
        onClose: handleNotificationSettingsClose,
        onSaveNotification: handleNotificationSettingsClick
      }
    )
  ] });
};
export {
  ChatHeaderAction as default
};
