import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import default_1$4 from "../../node_modules/@mui/icons-material/Clear.js";
import default_1$1 from "../../node_modules/@mui/icons-material/KeyboardArrowDown.js";
import default_1 from "../../node_modules/@mui/icons-material/KeyboardArrowUp.js";
import default_1$2 from "../../node_modules/@mui/icons-material/RemoveRounded.js";
import default_1$3 from "../../node_modules/@mui/icons-material/SaveOutlined.js";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Button } from "../Button/index.js";
import { Loader } from "../Loader/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const ActiveIcon = getAssetUrl("icons/activeModuleIcon.svg");
const HomeIcon = getAssetUrl("icons/chat-home-icon.svg");
const CloseThreadIcon = getAssetUrl("icons/close.svg");
const SmartBotIcon = getAssetUrl("icons/smartBotAlan.svg");
const CollapseIcon = getAssetUrl("icons/Collapse.svg");
const ExpandIcon = getAssetUrl("icons/expand-icon.svg");
function ChatbotModuleMenu({
  hideMenuArrow,
  onModuleClick,
  moduleList,
  activeList,
  hideChildren = false,
  isModuleListLoading,
  hideSmartBotIcon = false,
  hideCenterOptions = false,
  threadList: threadListProp = [],
  activeThread: activeThreadProp,
  handleSavedChat,
  onClose,
  isFullWidth,
  handleCloseThread: handleCloseThreadProp,
  handleThreadClick,
  onMinimiseChatBot,
  dragHandleProps,
  isCollapsed = false,
  onToggleCollapse
}) {
  var _a;
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(
    ((_a = moduleList.find((module) => module.isActive)) == null ? void 0 : _a.name) || ""
  );
  const [threadList, setThreadList] = useState(threadListProp);
  const [activeThread, setActiveThread] = useState(activeThreadProp || threadListProp[0]);
  const handleCloseThread = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    if (handleCloseThreadProp) {
      handleCloseThreadProp(e, idx);
    } else {
      const newThreadList = [...threadList];
      newThreadList.splice(idx, 1);
      setThreadList(newThreadList);
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!target.closest(".chatbot-component-header-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `conversation-screen-container-header ${dragHandleProps ? "draggable" : ""} ${isCollapsed ? "collapsed" : ""}`,
      onPointerDown: dragHandleProps == null ? void 0 : dragHandleProps.onPointerDown,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "left_logo_arrow_container", children: [
          !hideSmartBotIcon && /* @__PURE__ */ jsx("div", { className: "conversation_chatbot_logo_container", children: /* @__PURE__ */ jsx("img", { alt: "smartbot", draggable: false, src: SmartBotIcon }) }),
          !hideMenuArrow && /* @__PURE__ */ jsxs("div", { className: "menu_arrow", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                icon: isDropdownOpen ? /* @__PURE__ */ jsx(default_1, {}) : /* @__PURE__ */ jsx(default_1$1, {}),
                iconPlacement: "right",
                size: hideChildren ? "small" : "medium",
                type: "default",
                variant: "text",
                onClick: () => {
                  setIsDropdownOpen(!isDropdownOpen);
                },
                children: !hideChildren && t("chatBot.moduleMenu.module")
              }
            ),
            isDropdownOpen && /* @__PURE__ */ jsx(
              "div",
              {
                className: `chatbot-component-header-dropdown-container ${isDropdownOpen ? "open" : ""}`,
                children: isModuleListLoading ? /* @__PURE__ */ jsx(Loader, {}) : /* @__PURE__ */ jsx("div", { className: `item ${isCollapsed ? "isCollapsed" : ""}`, children: moduleList.map((module, idx) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `item-container ${isCollapsed ? "isCollapsed" : ""}`,
                    onClick: () => {
                      setActiveModule(module.name ?? "");
                      onModuleClick == null ? void 0 : onModuleClick(module.id, module.name, activeList);
                      setIsDropdownOpen(false);
                    },
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "item-content", children: [
                        typeof module.icon === "string" ? /* @__PURE__ */ jsx("img", { alt: module.key ?? module.name, src: module.icon }) : module.icon,
                        /* @__PURE__ */ jsxs("div", { className: "item-content-text", children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `item-content-text-name ${isCollapsed ? "collapsed" : ""}`,
                              children: module.name
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `item-content-text-description ${isCollapsed ? "collapsed" : ""}`,
                              children: module.description
                            }
                          )
                        ] })
                      ] }),
                      activeModule === module.name && /* @__PURE__ */ jsx("img", { alt: "active", src: ActiveIcon })
                    ]
                  },
                  `${module.id ?? module.name ?? idx}`
                )) })
              }
            )
          ] })
        ] }),
        !isCollapsed && !hideCenterOptions && /* @__PURE__ */ jsxs("div", { className: "center_options_container", children: [
          /* @__PURE__ */ jsx("div", { className: "left_tabs_container", children: /* @__PURE__ */ jsx("ul", { children: threadList.map((thread, idx) => /* @__PURE__ */ jsx(
            "li",
            {
              className: `${activeThread === thread ? "active" : ""} ${thread === "Home" ? "home" : ""}`,
              role: "tab",
              tabIndex: 0,
              onClick: () => {
                setActiveThread(thread);
                handleThreadClick == null ? void 0 : handleThreadClick(thread, idx);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveThread(thread);
                  handleThreadClick == null ? void 0 : handleThreadClick(thread, idx);
                }
              },
              children: thread === "Home" ? /* @__PURE__ */ jsx("img", { alt: t("chatBot.moduleMenu.homeAlt"), draggable: false, src: HomeIcon }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                thread,
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "close_thread",
                    role: "button",
                    tabIndex: 0,
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCloseThread(e, idx);
                      }
                    },
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        alt: t("chatBot.moduleMenu.closeThreadAlt"),
                        draggable: false,
                        src: CloseThreadIcon,
                        onClick: (e) => {
                          handleCloseThread(e, idx);
                        }
                      }
                    )
                  }
                )
              ] })
            },
            idx
          )) }) }),
          /* @__PURE__ */ jsx("div", { className: "right_info_container" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "right_close_save_icon_container", children: [
          onMinimiseChatBot && !isFullWidth && /* @__PURE__ */ jsx("div", { className: "minimise_icon_container", children: /* @__PURE__ */ jsx(
            Button,
            {
              className: "chatbot-component-header-close-icon",
              icon: /* @__PURE__ */ jsx(default_1$2, {}),
              size: "small",
              type: "default",
              variant: "text",
              onClick: onMinimiseChatBot
            }
          ) }),
          handleSavedChat && /* @__PURE__ */ jsx("div", { className: "save_icon_container", children: /* @__PURE__ */ jsx(
            Button,
            {
              icon: /* @__PURE__ */ jsx(default_1$3, {}),
              iconPlacement: "left",
              size: "small",
              type: "default",
              variant: "text",
              onClick: handleSavedChat
            }
          ) }),
          onToggleCollapse && !isFullWidth && /* @__PURE__ */ jsx("div", { className: "collapse_icon_container", children: /* @__PURE__ */ jsx(
            Button,
            {
              "aria-label": isCollapsed ? "Expand chatbot" : "Collapse chatbot",
              icon: /* @__PURE__ */ jsx(
                "img",
                {
                  alt: "",
                  draggable: false,
                  height: isCollapsed ? 24 : 26,
                  src: isCollapsed ? ExpandIcon : CollapseIcon,
                  width: isCollapsed ? 24 : 26
                }
              ),
              size: "small",
              type: "default",
              variant: "text",
              onClick: onToggleCollapse
            }
          ) }),
          !isFullWidth && /* @__PURE__ */ jsx("div", { className: "close_icon_container", children: /* @__PURE__ */ jsx(
            Button,
            {
              icon: /* @__PURE__ */ jsx(default_1$4, {}),
              iconPlacement: "left",
              size: "small",
              type: "default",
              variant: "text",
              onClick: onClose,
              "aria-label": "Close Iris chat",
              title: "Close Iris chat"
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  ChatbotModuleMenu
};
