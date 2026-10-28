!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('.impact-header-container{align-items:center;background-color:#fff;box-shadow:0 0 16px 2px #0000000f;display:flex;height:56px;justify-content:space-between;left:64px;min-width:700px;padding:0 24px;position:fixed;top:0;width:calc(100% - 64px);z-index:1199}.impact-header-container-left-side{align-items:center;display:flex;flex-direction:row;gap:14px;justify-content:flex-start}.impact-header-logo{height:36px;width:91px}.impact-header-logo:hover{cursor:pointer}.impact-header-separator{background-color:#d9dde7;display:block;height:24px;width:1px}.impact-header-title{color:#1f2b4d;font-size:16px;font-weight:800;line-height:24px}.impact-header-container-right-side{align-items:center;display:flex;flex-direction:row;gap:24px;justify-content:flex-start}.impact-header-avatar:hover,.impact-header-comments-button:hover,.impact-header-help-container:hover,.impact-header-language-button:hover,.impact-header-message-container:hover,.impact-header-notification-container:hover{cursor:pointer}.impact-header-language-button,.impact-header-language-container{align-items:center;display:flex}.impact-header-language-button{gap:4px;height:20px;justify-content:center}.impact-header-language-icon-placeholder{border:1.5px solid #1f2b4d;border-radius:50%;display:inline-block;height:20px;width:20px}.impact-header-language-flag-placeholder{background-color:#f5f6fa;border:1px solid #d9dde7;border-radius:2px;display:inline-block;height:14px;width:20px}.impact-header-comments-container{align-items:center;display:flex;position:relative}.impact-header-comments-button{align-items:center;border-radius:4px;display:flex;justify-content:center;padding:4px}.header-comments-dropdown{background-color:#fff;border-radius:8px;box-shadow:0 4px 16px #00000029;overflow:hidden;position:absolute;right:0;top:calc(100% + 8px);z-index:10000}.header-comments-dropdown .comment-panel-main-container{max-height:500px;position:relative}.header-comments-dropdown .comment-panel-main-container.display-comment-panel{bottom:unset;max-height:500px;min-height:400px}.header-comments-dropdown .comment-panel-main-container .comment-panel-body{flex:1;overflow:auto;position:relative;top:auto}.header-comments-dropdown .comment-panel-main-container .impact_emptystate{border:none;border-radius:0;margin:0;min-height:auto;padding:20px;width:auto}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_center_svg_with_icon{min-height:0}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_center_svg{height:auto}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_heading{font-size:14px;line-height:21px;margin-bottom:0}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_paragraph{color:#7a8294;font-size:10px;font-weight:500;line-height:14px;margin-top:0;width:285px}.header-comments-dropdown .comment-panel-main-container .comment-panel-content{bottom:auto;max-height:380px;position:relative;top:auto}.impact-header-bot-container{align-items:center;background-color:#0f1937;background:linear-gradient(-45deg,#2ac2aa,#6666ef,#f26922,#8863c0,#0f1937);background-size:400% 400%;border-radius:8px;cursor:pointer;display:flex;height:34px;padding-inline:11px;position:relative}.impact-header-bot-container:after{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/smartBot.svg) no-repeat;background-position:50%;background-size:16px;content:"";height:16px;position:absolute;width:16px}.impact-header-bot-container:before{background:linear-gradient(167deg,#2ac2ee,#6962ef,#f26921);border-radius:9px;bottom:-1px;content:"";left:-1px;position:absolute;right:-1px;top:-1px;z-index:-1}.impact-header-bot-container:hover:not(.impact-header-bot-container-disabled){animation:gradient 2s ease infinite;background:linear-gradient(-45deg,#2ac2ee,#6962ef,#f26921);background-size:400% 400%}.impact-header-bot-container:hover:not(.impact-header-bot-container-disabled):before{background:none}.impact-header-bot-container{animation:gradient 5s ease infinite}.impact-header-bot-container .impact-header-bot-container-text{color:#fff;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;padding-left:23px}@keyframes gradient{0%{background-position:0 20% 40% 60% 80%}50%{background-position:80% 50%}to{background-position:0 20% 40% 60% 80%}}.impact-header-bot-container-disabled{animation:none;background-color:#d9dde7;background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/smartBot.svg),none;background-position:10px 50%;background-repeat:no-repeat;background-size:20px 20px;cursor:not-allowed}.impact-header-bot-container-disabled:before{background:none}.impact-header-notification-container{position:relative}.impact-header-notification-dnd-container{height:16px;left:14px;position:absolute;top:-5px;width:16px}.impact-header-notification-indicator-container{height:8px;left:14px;position:absolute;top:0;width:8px}.impact-header-notification-indicator-outer-circle{animation:waves 1.5s ease-out infinite;background-color:#fceeee;border-radius:50%;height:10px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:10px}.impact-header-notification-indicator-inner-circle{background-color:#c64746;border-radius:50%;height:8px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:8px}.impact-header-avatar .ia-avatar{background-color:#31935f!important;border-radius:8px;color:#fff;line-height:30px}.impact-header-lang-label{color:#60697d;font-size:14px;font-weight:600}@keyframes waves{0%{height:8px;width:8px}to{height:16px;width:16px}}')),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useRef, useEffect } from "react";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Avatar } from "../Avatar/index.js";
import CommentsPanel from "../CommentsPanel/index.js";
import { CommentsProvider } from "../CommentsPanel/CommentsContext.js";
import { Menu } from "../Menu/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import { useI18n } from "../../i18n/useI18n.js";
import { LOCALE_REGISTRY } from "../../locales/index.js";
const ImpactLogoHD2 = getAssetUrl("icons/IA_Logo.svg");
const NotificationIcon = getAssetUrl("icons/bell.svg");
const HelpIcon = getAssetUrl("icons/help-icon.svg");
const KeyboardShortcutsIcon = getAssetUrl("icons/keyboardShortuctIcon.svg");
const MessageIconDisabled = getAssetUrl("icons/message-icon-disabled.svg");
const MessageIcon = getAssetUrl("icons/message-icon.svg");
const NotificationDNDIcon = getAssetUrl("icons/notification-dnd.svg");
const CommentIconHeaderSvg = getAssetUrl("icons/comment-gray.svg");
const GlobalIcon = getAssetUrl("icons/Globe.svg");
const FLAG_WIDTH = 24;
const FLAG_HEIGHT = 20;
const renderLanguageFlag = (icon) => {
  if (!icon) {
    return /* @__PURE__ */ jsx("span", { className: "impact-header-language-flag-placeholder" });
  }
  return /* @__PURE__ */ jsx("img", { alt: "", height: FLAG_HEIGHT, src: icon, width: FLAG_WIDTH });
};
function Header({
  title,
  userName,
  handleLogoClick,
  showNotificationIcon = true,
  notificationIndicator = true,
  handleNotificationClick,
  showHelpIcon = true,
  handleHelpClick,
  showMessageIcon = true,
  handleMessageClick,
  showChatBotIcon = true,
  handleChatBotClick,
  isMessageIconDisabled = false,
  isNotificationDnd = false,
  dropMenuOptions = [{ label: userName ?? "User", onClick: () => {
  } }],
  userMenuPopup,
  isChatBotDisabled = false,
  centerComponent,
  avatarProps,
  avatarType = "withoutPicture",
  showKeyboardShortcuts = false,
  handleKeyboardShortcutsClick,
  commentProps,
  onCommentsClick,
  commentsPanel,
  className,
  id,
  "data-testid": dataTestId,
  role = "banner",
  showLanguageIcon = false,
  enabledLocales = ["en-US", "de-DE"],
  onLanguageChange
}) {
  var _a;
  const { t } = useTranslation();
  const { locale, setLocale } = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const languageMenuOpen = Boolean(languageAnchorEl);
  const resolvedLanguageOptions = useMemo(() => {
    const locales = Array.isArray(enabledLocales) ? enabledLocales : [];
    return locales.map((code) => {
      const entry = LOCALE_REGISTRY[code];
      if (!entry) {
        console.warn(
          `[impact-ui] Header: locale "${code}" is not in LOCALE_REGISTRY. Add it to src/locales/index.ts or pass full objects via enabledLocales.`
        );
        return null;
      }
      return { value: code, ...entry };
    }).filter(
      (option) => Boolean(option)
    );
  }, [enabledLocales]);
  const showCommentsButton = Boolean(commentProps);
  const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);
  const commentsBtnRef = useRef(null);
  const commentsPanelRef = useRef(null);
  const handleCommentsButtonClick = (event) => {
    event.stopPropagation();
    if (onCommentsClick) {
      onCommentsClick(event);
    } else {
      setCommentsPanelOpen((prev) => !prev);
    }
  };
  useEffect(() => {
    if (!commentsPanelOpen) return;
    const handleClickOutside = (event) => {
      const target = event.target;
      if (commentsPanelRef.current && !commentsPanelRef.current.contains(target) && commentsBtnRef.current && !commentsBtnRef.current.contains(target) && !target.closest(".MuiPopover-root")) {
        setCommentsPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentsPanelOpen]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `impact-header-container ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      id,
      role,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "impact-header-container-left-side", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-label": t("header.logo"),
              className: "impact-header-logo",
              role: "button",
              tabIndex: 0,
              onClick: handleLogoClick,
              onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && (handleLogoClick == null ? void 0 : handleLogoClick()),
              children: /* @__PURE__ */ jsx("img", { alt: t("header.logoAlt"), height: "100%", src: ImpactLogoHD2, width: "100%" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "impact-header-separator" }),
          /* @__PURE__ */ jsx("div", { className: "impact-header-title", children: title })
        ] }),
        centerComponent,
        /* @__PURE__ */ jsxs("div", { className: "impact-header-container-right-side", children: [
          showKeyboardShortcuts && /* @__PURE__ */ jsx(
            "div",
            {
              "aria-label": t("header.keyboardShortcuts"),
              className: "impact-header-help-container",
              id: "impact-header-keyboard-shortcuts-button",
              role: "button",
              tabIndex: 0,
              onClick: handleKeyboardShortcutsClick,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleKeyboardShortcutsClick == null ? void 0 : handleKeyboardShortcutsClick();
                }
              },
              children: /* @__PURE__ */ jsx("img", { alt: "", height: "100%", src: KeyboardShortcutsIcon, width: "100%" })
            }
          ),
          showHelpIcon && /* @__PURE__ */ jsx(
            "div",
            {
              "aria-label": t("header.help"),
              className: "impact-header-help-container",
              role: "button",
              tabIndex: 0,
              onClick: handleHelpClick,
              onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && (handleHelpClick == null ? void 0 : handleHelpClick()),
              children: /* @__PURE__ */ jsx("img", { alt: "", height: "100%", src: HelpIcon, width: "100%" })
            }
          ),
          showLanguageIcon ? /* @__PURE__ */ jsxs("div", { className: "impact-header-language-container", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                "aria-label": t("header.languageAlt"),
                className: "impact-header-language-button",
                role: "button",
                tabIndex: 0,
                onClick: (event) => {
                  setLanguageAnchorEl(event.currentTarget);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLanguageAnchorEl(e.currentTarget);
                  }
                },
                children: [
                  /* @__PURE__ */ jsx("img", { alt: t("header.languageAlt"), height: "24px", src: GlobalIcon, width: "24px" }),
                  /* @__PURE__ */ jsx("span", { className: "impact-header-lang-label", children: (_a = LOCALE_REGISTRY[locale]) == null ? void 0 : _a.iconLabel })
                ]
              }
            ),
            (resolvedLanguageOptions == null ? void 0 : resolvedLanguageOptions.length) > 0 && /* @__PURE__ */ jsx(
              Menu,
              {
                anchorEl: languageAnchorEl,
                open: languageMenuOpen,
                options: resolvedLanguageOptions == null ? void 0 : resolvedLanguageOptions.map((option) => ({
                  label: option == null ? void 0 : option.label,
                  value: option == null ? void 0 : option.value,
                  icon: renderLanguageFlag(option.icon),
                  onClick: () => {
                    void setLocale(option == null ? void 0 : option.value);
                    onLanguageChange == null ? void 0 : onLanguageChange(option == null ? void 0 : option.value);
                    setLanguageAnchorEl(null);
                  }
                })),
                selected: { value: locale },
                onClose: () => {
                  setLanguageAnchorEl(null);
                }
              }
            )
          ] }) : null,
          isMessageIconDisabled && showMessageIcon && /* @__PURE__ */ jsx(
            "div",
            {
              "aria-label": t("header.messageDisabled"),
              className: "impact-header-message-container",
              role: "button",
              tabIndex: 0,
              children: /* @__PURE__ */ jsx("img", { alt: "", height: "100%", src: MessageIconDisabled, width: "100%" })
            }
          ),
          !isMessageIconDisabled && showMessageIcon && /* @__PURE__ */ jsx(
            "div",
            {
              "aria-label": t("header.message"),
              className: "impact-header-message-container",
              role: "button",
              tabIndex: 0,
              onClick: handleMessageClick,
              onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && (handleMessageClick == null ? void 0 : handleMessageClick()),
              children: /* @__PURE__ */ jsx("img", { alt: "", height: "100%", src: MessageIcon, width: "100%" })
            }
          ),
          isNotificationDnd && showNotificationIcon && /* @__PURE__ */ jsx(
            "div",
            {
              "aria-label": t("header.notifications"),
              className: "impact-header-notification-container",
              role: "button",
              tabIndex: 0,
              onClick: handleNotificationClick,
              onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && (handleNotificationClick == null ? void 0 : handleNotificationClick()),
              children: /* @__PURE__ */ jsx("img", { alt: "", height: "100%", src: NotificationDNDIcon, width: "100%" })
            }
          ),
          !isNotificationDnd && showNotificationIcon && /* @__PURE__ */ jsxs(
            "div",
            {
              "aria-label": t("header.notifications"),
              className: "impact-header-notification-container",
              role: "button",
              tabIndex: 0,
              onClick: handleNotificationClick,
              onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && (handleNotificationClick == null ? void 0 : handleNotificationClick()),
              children: [
                /* @__PURE__ */ jsx("img", { alt: "", height: "100%", src: NotificationIcon, width: "100%" }),
                notificationIndicator && /* @__PURE__ */ jsxs("div", { className: "impact-header-notification-indicator-container", children: [
                  /* @__PURE__ */ jsx("div", { className: "impact-header-notification-indicator-outer-circle" }),
                  /* @__PURE__ */ jsx("div", { className: "impact-header-notification-indicator-inner-circle" })
                ] })
              ]
            }
          ),
          showCommentsButton && /* @__PURE__ */ jsxs("div", { className: "impact-header-comments-container", style: { position: "relative" }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                ref: commentsBtnRef,
                "aria-label": t("header.comments"),
                className: "impact-header-comments-button",
                role: "button",
                tabIndex: 0,
                onClick: handleCommentsButtonClick,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCommentsButtonClick(e);
                  }
                },
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: t("header.commentsAlt"),
                    height: "24",
                    src: CommentIconHeaderSvg,
                    width: "24"
                  }
                )
              }
            ),
            commentsPanelOpen && /* @__PURE__ */ jsx("div", { ref: commentsPanelRef, className: "header-comments-dropdown", children: commentsPanel ?? /* @__PURE__ */ jsx(CommentsProvider, { commentProps: { ...commentProps, defaultShowPanel: true }, children: /* @__PURE__ */ jsx(
              CommentsPanel,
              {
                visibleSortOptions: ["opt1", "opt3", "opt4"],
                onClose: () => {
                  setCommentsPanelOpen(false);
                }
              }
            ) }) })
          ] }),
          showChatBotIcon && /* @__PURE__ */ jsx(
            "div",
            {
              "aria-disabled": isChatBotDisabled,
              "aria-label": t("header.askIris"),
              className: `impact-header-bot-container ${isChatBotDisabled ? "impact-header-bot-container-disabled" : ""}`,
              role: "button",
              tabIndex: isChatBotDisabled ? -1 : 0,
              onClick: () => !isChatBotDisabled && (handleChatBotClick == null ? void 0 : handleChatBotClick()),
              onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && !isChatBotDisabled && (handleChatBotClick == null ? void 0 : handleChatBotClick()),
              children: /* @__PURE__ */ jsx("span", { className: "impact-header-bot-container-text", children: t("header.askIris") })
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-expanded": open,
              "aria-haspopup": "menu",
              "aria-label": t("header.userMenu"),
              className: "impact-header-avatar",
              role: "button",
              tabIndex: 0,
              onClick: (event) => {
                const target = event.currentTarget;
                if (userMenuPopup) {
                  setAnchorEl((prev) => prev ? null : target);
                } else {
                  setAnchorEl(target);
                }
              },
              onKeyDown: (e) => {
                if (e.key !== "Enter" && e.key !== " ") {
                  return;
                }
                const target = e.currentTarget;
                if (userMenuPopup) {
                  setAnchorEl((prev) => prev ? null : target);
                } else {
                  setAnchorEl(target);
                }
              },
              children: /* @__PURE__ */ jsx(Avatar, { label: userName, size: "small", type: avatarType, ...avatarProps })
            }
          ),
          userMenuPopup ? userMenuPopup(anchorEl) : dropMenuOptions && dropMenuOptions.length > 0 && /* @__PURE__ */ jsx(
            Menu,
            {
              anchorEl,
              open,
              options: dropMenuOptions,
              onClose: () => {
                setAnchorEl(null);
              }
            }
          )
        ] })
      ]
    }
  );
}
Header.displayName = "Header";
export {
  Header
};
