!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.comment-panel-main-container{background-color:#fff;box-shadow:0 0 4px #0000001f;display:flex;flex-direction:column;opacity:0;overflow:hidden;transition:all .2s ease-in-out;visibility:hidden;width:0}.comment-panel-main-container .comment-panel-header{align-items:center;background-color:#eceefd;display:flex;justify-content:space-between;padding:12px 16px}.comment-panel-main-container .comment-panel-header h2{color:#0d152c;font-family:Manrope,sans-serif;font-size:16px;font-weight:700;margin:0}.comment-panel-main-container .comment-panel-header .close_icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/close.svg) no-repeat;background-position:50%;background-size:12px;cursor:pointer;height:12px;width:12px}.comment-panel-main-container .comment-panel-header .close_icon:hover{background:#eceefd url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/close.svg) no-repeat;background-position:50%;background-size:12px;color:#3649c6}.comment-panel-main-container .comment-panel-body{bottom:0;left:0;padding-top:8px;position:absolute;right:0;top:40px}.comment-panel-main-container .comment-panel-search-panel{align-items:center;display:flex;justify-content:space-between;padding:0 12px}.comment-panel-main-container .comment-panel-search-panel .left-input-icon{padding-top:2px}.comment-panel-main-container .comment-panel-search-panel .ia-styles.ia-btn.ia-btn-small{padding:14px!important}.comment-panel-main-container .comment-panel-search-panel .impact_inputbox_container_with_icons{width:279px}.comment-panel-main-container .comment-panel-content{bottom:0;display:flex;flex-direction:column;gap:0;left:0;line-height:20px;overflow:auto;padding:8px 12px;position:absolute;right:0;top:40px}.comment-panel-main-container .comment-panel-item{background-color:initial;cursor:pointer;padding:16px;position:relative}.comment-panel-main-container .comment-panel-item:not(:last-child){margin-bottom:16px}.comment-panel-main-container .comment-panel-item:not(:last-child):after{background:#d9dde7;bottom:-8px;content:"";height:1px;left:16px;position:absolute;right:16px}.comment-panel-main-container .comment-panel-item.active{background-color:#eceefd;border-radius:16px}.comment-panel-main-container .comment-panel-item-header{align-items:flex-start;display:flex;justify-content:space-between;margin-bottom:12px}.comment-panel-main-container .comment-panel-item-header .comment-panel-item-header-left{align-items:flex-start;display:flex;gap:8px}.comment-panel-main-container .comment-panel-item-header .comment-panel-author-info{display:flex;flex-direction:column;gap:2px}.comment-panel-main-container .comment-panel-item-header .comment-panel-author-info span:first-child{color:#31416e;font-size:14px;font-weight:600;line-height:21px}.comment-panel-main-container .comment-panel-item-header .comment-panel-author-info span:last-child{color:#60697d;font-size:12px;font-weight:500;line-height:16px}.comment-panel-main-container .comment-panel-item-header .comment-panel-item-header-right{align-items:baseline;display:flex}.comment-panel-main-container .comment-panel-item-header .comment-panel-item-header-right .comment-panel-action-icon{padding:8px}.comment-panel-main-container .comment-panel-item-header .comment-panel-item-header-right .comment-panel-action-icon svg{height:16px;width:16px}.comment-panel-main-container .comment-panel-item-header .comment-panel-item-header-right .comment-panel-action-button{background-color:initial;padding:8px}.comment-panel-main-container .comment-panel-item-content{color:#1f2b4d;display:-webkit-box;font-size:14px;font-weight:500;line-clamp:3;-webkit-line-clamp:3;line-height:20px;-webkit-box-orient:vertical;max-height:60px;overflow:hidden;text-overflow:ellipsis;white-space:normal}.comment-panel-main-container .comment-panel-item-footer{background:none;border:none;color:#4259ee;cursor:pointer;font-size:14px;font-weight:500;line-height:20px;padding:0;text-align:left}.comment-panel-main-container .comment-panel-item-footer-row{align-items:center;display:flex;gap:8px;justify-content:space-between;margin-top:12px;width:100%}.comment-panel-main-container .comment-panel-item-footer-link{color:#4259ee}.comment-panel-main-container .comment-panel-item-footer-muted{color:#7a8294;cursor:default}.comment-panel-main-container .impact_emptystate{border:none;border-radius:0;bottom:0;left:0;margin:0;min-height:auto;padding:0;position:absolute;right:0;top:2px;width:auto}.comment-panel-main-container .impact_emptystate .impact_center_svg_with_icon{min-height:0}.comment-panel-main-container .impact_emptystate .impact_center_svg{height:auto}.comment-panel-main-container .impact_emptystate .impact_heading{font-size:14px;line-height:21px;margin-bottom:0}.comment-panel-main-container .impact_emptystate .impact_paragraph{color:#7a8294;font-size:10px;font-weight:500;line-height:14px;margin-top:0;width:inherit;width:285px}.comment-panel-main-container.display-comment-panel{border-radius:8px;gap:8px;min-height:480px;opacity:1;padding:0;visibility:visible;width:355px;z-index:999}.comment-panel-main-container.display-comment-panel .comment-panel-header{border-bottom:none}.comment-panel-main-container.display-comment-panel .comment-panel-header .close_icon{padding:0}.header-comments-dropdown{border-radius:8px;box-shadow:0 4px 16px #00000029;margin-top:4px;overflow:hidden;position:absolute;right:0;top:100%;z-index:10000}.header-comments-dropdown .comment-panel-main-container{max-height:500px;position:relative}.header-comments-dropdown .comment-panel-main-container.display-comment-panel{bottom:unset;max-height:500px;min-height:400px}.header-comments-dropdown .comment-panel-main-container .comment-panel-body{flex:1;overflow:auto;position:relative;top:auto}.header-comments-dropdown .comment-panel-main-container .impact_emptystate{border:none;border-radius:0;margin:0;min-height:auto;padding:20px;width:auto}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_center_svg_with_icon{min-height:0}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_center_svg{height:auto}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_heading{font-size:14px;line-height:21px;margin-bottom:0}.header-comments-dropdown .comment-panel-main-container .impact_emptystate .impact_paragraph{color:#7a8294;font-size:10px;font-weight:500;line-height:14px;margin-top:0;width:285px}.header-comments-dropdown .comment-panel-main-container .comment-panel-content{bottom:auto;max-height:380px;min-height:300px;position:relative;top:auto}')),document.head.appendChild(e)}}catch(n){console.error("vite-plugin-css-injected-by-js",n)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Search as Search_default, MaterialSymbolsSort as MaterialSymbolsSort_default, MoreHorizontal as MoreHorizontal_default, SuccessFill as SuccessFill_default, SuccessGray as SuccessGray_default } from "../../node_modules/@impactsmartsuite/impact-icons/dist/index.js";
import moment from "moment";
import { getAssetUrl } from "../../utils/assetBase.js";
import { getUserAvatarColor } from "../../utils/avatarColor.js";
import { toInnerHTML } from "../../utils/html.js";
import { Avatar } from "../Avatar/index.js";
import { Badge } from "../Badge/index.js";
import { Button } from "../Button/index.js";
import { EmptyState } from "../EmptyState/index.js";
import { Input } from "../Input/index.js";
import { Menu } from "../Menu/index.js";
import { useComments } from "./CommentsContext.js";

import { useTranslation } from "../../i18n/useTranslation.js";
const EmptyStateIcon = (props) => /* @__PURE__ */ jsx("img", { alt: "", src: getAssetUrl("icons/commentEmptyStateIcon.svg"), ...props });
const NoFilterResultsIcon = (props) => /* @__PURE__ */ jsx("img", { alt: "", src: getAssetUrl("icons/no-filter-results.svg"), ...props });
const COMMENT_SEARCH_OPTIONS = [
  { labelKey: "commentsPanel.sortByDate", value: "opt1" },
  { labelKey: "commentsPanel.sortByUnread", value: "opt2" },
  { labelKey: "commentsPanel.showResolved", value: "opt3" },
  { labelKey: "commentsPanel.onlyYourThreads", value: "opt4" }
];
function CommentsPanel({ className, style, onClose, visibleSortOptions }) {
  const { t } = useTranslation();
  const ctx = useComments();
  const [activeItem, setActiveItem] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("opt1");
  const [isLoadingResolvedComments, setIsLoadingResolvedComments] = useState(false);
  const comments = (ctx == null ? void 0 : ctx.comments) ?? {};
  const resolvedComments = ctx == null ? void 0 : ctx.resolvedComments;
  const commentProps = ctx == null ? void 0 : ctx.commentProps;
  const popup = ctx == null ? void 0 : ctx.popup;
  const configuration = (commentProps == null ? void 0 : commentProps.configuration) || {};
  const badgeKey = commentProps == null ? void 0 : commentProps.badgeKey;
  const showThreadBadge = Boolean(badgeKey);
  const getThreadBadgeLabel = (threadComments) => {
    var _a;
    if (!showThreadBadge) return null;
    const badgeLabel = (_a = threadComments == null ? void 0 : threadComments[0]) == null ? void 0 : _a[badgeKey];
    return badgeLabel ? String(badgeLabel) : null;
  };
  const filteredEntries = useMemo(() => {
    const entries = Object.entries(comments);
    if (!entries.length) return [];
    const lower = (searchTerm || "").toLowerCase();
    const currentAuthor = commentProps == null ? void 0 : commentProps.author;
    let filtered = entries.filter(([_key, value]) => {
      if (!lower) return true;
      return value.some(
        (comment) => {
          var _a, _b, _c, _d;
          return ((_b = (_a = comment.text) == null ? void 0 : _a.toLowerCase) == null ? void 0 : _b.call(_a).includes(lower)) || ((_d = (_c = comment.author) == null ? void 0 : _c.toLowerCase) == null ? void 0 : _d.call(_c).includes(lower));
        }
      );
    });
    const getTime = (entry) => {
      var _a, _b;
      const ts = (_b = (_a = entry == null ? void 0 : entry[1]) == null ? void 0 : _a[0]) == null ? void 0 : _b.timestamp;
      const t2 = ts ? new Date(ts).getTime() : NaN;
      return Number.isNaN(t2) ? -Infinity : t2;
    };
    const isThreadUnread = (entry) => {
      const [, value] = entry;
      return value[0] && !value[0].isRead;
    };
    if (selectedOption === "opt1") {
      return filtered.sort((a, b) => getTime(b) - getTime(a));
    } else if (selectedOption === "opt2") {
      filtered = filtered.filter(([key]) => {
        const isResolved = Array.isArray(resolvedComments) && resolvedComments.includes(key);
        return !isResolved;
      });
      return filtered.sort((a, b) => {
        const unreadA = isThreadUnread(a);
        const unreadB = isThreadUnread(b);
        if (unreadA !== unreadB) return unreadB - unreadA;
        return getTime(b) - getTime(a);
      });
    } else if (selectedOption === "opt3") {
      filtered = filtered.filter(([key]) => {
        const isResolved = Array.isArray(resolvedComments) && resolvedComments.includes(key);
        return isResolved;
      });
      return filtered.sort((a, b) => getTime(b) - getTime(a));
    } else if (selectedOption === "opt4") {
      filtered = filtered.filter(([key]) => {
        const isResolved = Array.isArray(resolvedComments) && resolvedComments.includes(key);
        return !isResolved;
      });
      if (currentAuthor) {
        filtered = filtered.filter(([, value]) => value[0] && value[0].author === currentAuthor);
      }
      return filtered.sort((a, b) => getTime(b) - getTime(a));
    } else {
      filtered = filtered.filter(([key]) => {
        const isResolved = Array.isArray(resolvedComments) && resolvedComments.includes(key);
        return !isResolved;
      });
      return filtered.sort((a, b) => getTime(b) - getTime(a));
    }
  }, [comments, searchTerm, selectedOption, resolvedComments, commentProps == null ? void 0 : commentProps.author]);
  useEffect(() => {
    if (!popup) {
      setActiveItem(null);
    }
  }, [popup]);
  if (!ctx) return null;
  const {
    showCommentPanel,
    setShowCommentPanel,
    onCommentItemClick,
    handleMenuClick,
    getMenuOptions,
    handleMarkAsResolved,
    handleUnresolve,
    onShowResolvedCommentsRequest,
    onExitResolvedCommentsView
  } = ctx;
  const handleSearchMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleSearchMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handleOptionClick = async (option) => {
    setMenuAnchorEl(null);
    if (selectedOption === "opt3" && option.value !== "opt3" && onExitResolvedCommentsView) {
      onExitResolvedCommentsView();
    }
    if (option.value === "opt3" && onShowResolvedCommentsRequest) {
      setIsLoadingResolvedComments(true);
      try {
        await onShowResolvedCommentsRequest();
      } finally {
        setIsLoadingResolvedComments(false);
      }
    }
    setSelectedOption(option.value);
  };
  const availableSortOptions = visibleSortOptions ? COMMENT_SEARCH_OPTIONS.filter((option) => visibleSortOptions.includes(option.value)) : COMMENT_SEARCH_OPTIONS;
  const menuOptions = availableSortOptions.map((option) => ({
    ...option,
    label: t(option.labelKey),
    onClick: () => handleOptionClick(option),
    selected: selectedOption === option.value
  }));
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    if (moment(timestamp).isValid()) {
      return moment.utc(timestamp).local().format("LT, L");
    }
    return timestamp;
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `comment-panel-main-container ${showCommentPanel ? "display-comment-panel" : ""} ${className || ""}`,
      style,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "comment-panel-header", children: [
          /* @__PURE__ */ jsx("h2", { children: t("commentsPanel.title") }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "close_icon",
              role: "button",
              tabIndex: 0,
              onClick: () => {
                setShowCommentPanel(false);
                setSelectedOption("opt1");
                onExitResolvedCommentsView == null ? void 0 : onExitResolvedCommentsView();
                onClose == null ? void 0 : onClose();
              },
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowCommentPanel(false);
                  setSelectedOption("opt1");
                  onExitResolvedCommentsView == null ? void 0 : onExitResolvedCommentsView();
                  onClose == null ? void 0 : onClose();
                }
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "comment-panel-body", children: [
          Object.keys(comments).length > 0 && /* @__PURE__ */ jsxs("div", { className: "comment-panel-search-panel", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                leftIcon: /* @__PURE__ */ jsx(Search_default, {}),
                placeholder: t("commentsPanel.searchPlaceholder"),
                type: "text",
                value: searchTerm,
                onChange: (e) => {
                  setSearchTerm(e.target.value);
                }
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "sortIcon",
                disabled: false,
                icon: /* @__PURE__ */ jsx(MaterialSymbolsSort_default, { fontSize: "small" }),
                iconPlacement: "left",
                size: "small",
                type: "default",
                variant: "tertiary",
                onClick: handleSearchMenuClick
              }
            )
          ] }),
          Object.keys(comments).length > 0 ? /* @__PURE__ */ jsx("div", { className: "comment-panel-content", children: isLoadingResolvedComments ? /* @__PURE__ */ jsx(
            EmptyState,
            {
              description: t("commentsPanel.loadingResolvedDescription"),
              emptyStateIcon: /* @__PURE__ */ jsx(NoFilterResultsIcon, {}),
              heading: t("commentsPanel.loadingResolvedHeading")
            }
          ) : filteredEntries.length === 0 ? /* @__PURE__ */ jsx(
            EmptyState,
            {
              description: selectedOption === "opt3" ? t("commentsPanel.noResolvedDescription") : searchTerm ? t("commentsPanel.searchNoMatchDescription", {
                term: searchTerm
              }) : t("commentsPanel.noMatchingDescription"),
              emptyStateIcon: /* @__PURE__ */ jsx(NoFilterResultsIcon, {}),
              heading: t("commentsPanel.noResultsHeading")
            }
          ) : filteredEntries.map(([key, value]) => {
            var _a, _b, _c;
            const isActive = activeItem === key;
            const timestamp = formatTimestamp(value[0].timestamp);
            const author = (_a = value[0]) == null ? void 0 : _a.author;
            const isRead = ((_b = value[0]) == null ? void 0 : _b.isRead) ?? ((_c = value[0]) == null ? void 0 : _c.read);
            const isResolved = Array.isArray(resolvedComments) && resolvedComments.find((comment) => comment === key);
            const topMenuOptions = typeof getMenuOptions === "function" ? getMenuOptions("topMenu", value) : [];
            const hasTopMenuOptions = Array.isArray(topMenuOptions) && topMenuOptions.length > 0;
            const threadBadgeLabel = getThreadBadgeLabel(value);
            const replyCount = value.length - 1;
            const showFooterRow = showThreadBadge || replyCount > 0;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: `comment-panel-item ${isActive ? "active" : ""}`,
                onClick: () => {
                  setActiveItem(key);
                  onCommentItemClick(key, value);
                  if (commentProps == null ? void 0 : commentProps.closeOnItemClick) {
                    setShowCommentPanel(false);
                    onClose == null ? void 0 : onClose();
                  }
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "comment-panel-item-header", children: [
                    /* @__PURE__ */ jsxs("div", { className: "comment-panel-item-header-left", children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            position: "relative",
                            display: "inline-block",
                            padding: "2.5px 0px"
                          },
                          children: /* @__PURE__ */ jsx(
                            Avatar,
                            {
                              label: author,
                              size: "small",
                              style: {
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                backgroundColor: getUserAvatarColor(author)
                              },
                              type: "withoutPicture"
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "comment-panel-author-info", children: [
                        /* @__PURE__ */ jsx("span", { children: author }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          timestamp,
                          !isRead && !isResolved && /* @__PURE__ */ jsx(
                            "span",
                            {
                              "aria-label": t("commentsPanel.unread"),
                              style: {
                                display: "inline-block",
                                width: 8,
                                height: 8,
                                backgroundColor: "#E15554",
                                borderRadius: "100%",
                                verticalAlign: "middle",
                                margin: "4px 0px 4px 6px"
                              }
                            }
                          )
                        ] }),
                        value[0].isEdited && /* @__PURE__ */ jsx("span", { children: t("commentsPanel.edited") })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "comment-panel-item-header-right", children: [
                      !isResolved && hasTopMenuOptions && !((configuration == null ? void 0 : configuration.disableMarkAsRead) && (configuration == null ? void 0 : configuration.disableDeleteThread)) && /* @__PURE__ */ jsx(
                        Button,
                        {
                          className: "comment-panel-action-button",
                          disabled: false,
                          icon: /* @__PURE__ */ jsx(MoreHorizontal_default, { fontSize: "small" }),
                          iconPlacement: "left",
                          size: "small",
                          type: "text",
                          variant: "text",
                          onClick: (e) => {
                            e.stopPropagation();
                            handleMenuClick(e, key, "topMenu");
                          }
                        }
                      ),
                      !(configuration == null ? void 0 : configuration.disableMarkAsResolved) && /* @__PURE__ */ jsx("div", { className: "comment-panel-action-icon", children: isResolved ? /* @__PURE__ */ jsx(
                        "div",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            if (handleUnresolve) handleUnresolve(key);
                          },
                          children: /* @__PURE__ */ jsx(SuccessFill_default, { fontSize: "small" })
                        }
                      ) : /* @__PURE__ */ jsx(
                        "div",
                        {
                          onClick: (e) => {
                            if (isResolved) return;
                            e.stopPropagation();
                            if (handleMarkAsResolved) handleMarkAsResolved(key, value);
                          },
                          children: /* @__PURE__ */ jsx(SuccessGray_default, { fontSize: "small" })
                        }
                      ) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "comment-panel-item-content",
                      dangerouslySetInnerHTML: toInnerHTML(value[0].text)
                    }
                  ),
                  showFooterRow && /* @__PURE__ */ jsxs("div", { className: "comment-panel-item-footer-row", children: [
                    replyCount > 0 ? /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "url",
                        onClick: () => onCommentItemClick(key, value),
                        children: replyCount === 1 ? t("commentsPanel.reply", { count: replyCount }) : t("commentsPanel.replies", { count: replyCount })
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "comment-panel-item-footer comment-panel-item-footer-muted", children: t("commentsPanel.noReplies") }),
                    threadBadgeLabel && /* @__PURE__ */ jsx(
                      Badge,
                      {
                        color: "default",
                        label: threadBadgeLabel,
                        size: "small",
                        variant: "subtle"
                      }
                    )
                  ] })
                ]
              },
              key
            );
          }) }) : /* @__PURE__ */ jsx(
            EmptyState,
            {
              description: t("commentsPanel.emptyDescription"),
              emptyStateIcon: /* @__PURE__ */ jsx(EmptyStateIcon, {}),
              heading: t("commentsPanel.emptyHeading")
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Menu,
          {
            anchorEl: menuAnchorEl,
            iconPlacement: "left",
            MenuProps: {
              sx: {
                zIndex: 9999
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right"
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right"
              }
            },
            open: Boolean(menuAnchorEl),
            options: menuOptions,
            selected: { value: selectedOption },
            onClose: handleSearchMenuClose
          }
        )
      ]
    }
  );
}
export {
  CommentsPanel as default
};
