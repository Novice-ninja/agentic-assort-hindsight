import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import default_1$1 from "../../../../node_modules/@mui/icons-material/BookmarkBorderOutlined.js";
import default_1 from "../../../../node_modules/@mui/icons-material/DeleteOutlineOutlined.js";
import default_1$2 from "../../../../node_modules/@mui/icons-material/FileDownloadOutlined.js";
import moment from "moment";
import { getAssetUrl } from "../../../../utils/assetBase.js";
import { Badge } from "../../../Badge/index.js";
import { Button } from "../../../Button/index.js";
import { Checkbox } from "../../../Checkbox/index.js";
import { Tooltip } from "../../../Tooltip/index.js";
import { useTranslation } from "../../../../i18n/useTranslation.js";
const OpenInNewIcon = getAssetUrl("icons/OpenInNew.svg");
const SyncReloadIcon = getAssetUrl("icons/SyncReload.svg");
const NotificationReadIcon = getAssetUrl("icons/notification-read.svg");
const NotificationBookmarkIcon = getAssetUrl("icons/notification-bookmark.svg");
const BookMarkedFillIcon = getAssetUrl("icons/bookMarkedFill.svg");
const NOTIFICATION_DESCRIPTION_VISIBLE_MAX = 150;
function getVisibleTextLengthFromHtml(html) {
  if (!html) {
    return 0;
  }
  const doc = new DOMParser().parseFromString(
    `<div data-notification-desc-root>${html}</div>`,
    "text/html"
  );
  const root = doc.querySelector("[data-notification-desc-root]");
  return root ? root.textContent.length : 0;
}
function truncateHtmlByVisibleLength(html, maxVisibleLen) {
  if (!html || maxVisibleLen <= 0) {
    return { html: "", isTruncated: false };
  }
  const doc = new DOMParser().parseFromString(
    `<div data-notification-desc-root>${html}</div>`,
    "text/html"
  );
  const sourceRoot = doc.querySelector("[data-notification-desc-root]");
  if (!sourceRoot) {
    return { html, isTruncated: false };
  }
  const fullLen = sourceRoot.textContent.length;
  if (fullLen <= maxVisibleLen) {
    return { html, isTruncated: false };
  }
  let remaining = maxVisibleLen;
  function processNode(node) {
    if (remaining <= 0) {
      return null;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text) {
        return null;
      }
      if (text.length <= remaining) {
        remaining -= text.length;
        return doc.createTextNode(text);
      }
      const chunk = text.slice(0, remaining);
      remaining = 0;
      return doc.createTextNode(chunk);
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;
      const clone = element.cloneNode(false);
      for (const child of Array.from(element.childNodes)) {
        if (remaining <= 0) {
          break;
        }
        const processed = processNode(child);
        if (processed) {
          clone.appendChild(processed);
        }
      }
      if (clone.childNodes.length === 0 && element.childNodes.length === 0) {
        return clone;
      }
      if (clone.childNodes.length === 0 && element.childNodes.length > 0) {
        return null;
      }
      return clone;
    }
    return null;
  }
  const out = doc.createElement("div");
  for (const child of Array.from(sourceRoot.childNodes)) {
    if (remaining <= 0) {
      break;
    }
    const processed = processNode(child);
    if (processed) {
      out.appendChild(processed);
    }
  }
  return { html: out.innerHTML, isTruncated: true };
}
function invokeHandler(handler, type, notificationPanels, setNotificationPanels, list) {
  handler == null ? void 0 : handler(type, notificationPanels, setNotificationPanels, list);
}
function getStatusClass(status) {
  switch (status) {
    case "fail":
      return "status-fail";
    case "pending":
      return "status-pending";
    case "success":
    default:
      return "status-success";
  }
}
function isInteractiveNotificationTarget(target, currentTarget) {
  const interactiveElements = [
    "a",
    "button",
    "input",
    '[role="button"]',
    ".nav-link",
    "[data-clickable]"
  ];
  return interactiveElements.some((selector) => {
    const closest = target.closest(selector);
    if (closest == null) {
      return false;
    }
    if (currentTarget instanceof Node && closest.contains(currentTarget)) {
      return false;
    }
    return target.matches(selector) || closest != null;
  });
}
function NotificationListItem({
  list,
  type,
  notificationPanels,
  setNotificationPanels,
  displayFormat,
  isHoverOnCard = false,
  isDeleteAlwaysVisible = false
}) {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const titleRef = useRef(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const handleSelectChange = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      invokeHandler(list.handleSelectChange, type, notificationPanels, setNotificationPanels, list);
    },
    [list, notificationPanels, setNotificationPanels, type]
  );
  const description = list.description;
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return void 0;
    const check = () => {
      setIsTitleTruncated(el.scrollWidth > el.clientWidth);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [list.label]);
  const { visibleTextLength, truncatedHtml } = useMemo(() => {
    const len = getVisibleTextLengthFromHtml(description);
    if (len <= NOTIFICATION_DESCRIPTION_VISIBLE_MAX) {
      return { visibleTextLength: len, truncatedHtml: description };
    }
    return {
      visibleTextLength: len,
      truncatedHtml: truncateHtmlByVisibleLength(description, NOTIFICATION_DESCRIPTION_VISIBLE_MAX).html
    };
  }, [description]);
  const showHeaderIcons = !!list.showOverdueIcon || !!list.showFastApproachingIcon;
  const showBookmarkControl = list.handleBookMark != null || Boolean(list.showBookMark);
  const handleRowActivate = useCallback(
    (e) => {
      const target = e.target;
      if (target.closest(".impact-notification-list-item-checkbox") != null) {
        return;
      }
      if (isInteractiveNotificationTarget(target, e.currentTarget)) {
        return;
      }
      if ("key" in e) {
        invokeHandler(
          list.handleSelectChange,
          type,
          notificationPanels,
          setNotificationPanels,
          list
        );
        return;
      }
      handleSelectChange(e);
    },
    [handleSelectChange, list, notificationPanels, setNotificationPanels, type]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-label": t("notification.itemAriaLabel"),
      className: `impact-notification-list-item ${list.selected ? "list-item-selected" : ""} ${!list.read ? "list-item-read" : ""} ${isHoverOnCard ? "impact-notification-list-item-hover-on-card" : ""}`,
      role: "button",
      tabIndex: 0,
      children: [
        list.checkBoxClick && /* @__PURE__ */ jsx("div", { className: "impact-notification-list-item-checkbox", children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: Boolean(list.selected),
            variant: "default",
            onChange: (event) => {
              event.stopPropagation();
              invokeHandler(
                list.checkBoxClick,
                type,
                notificationPanels,
                setNotificationPanels,
                list
              );
            }
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: `impact-notification-list-item-icon ${getStatusClass(list.status)}`, children: /* @__PURE__ */ jsx("div", { className: "impact-notification-list-item-icon-line" }) }),
        /* @__PURE__ */ jsxs("div", { className: "impact-notification-list-item-container", children: [
          /* @__PURE__ */ jsxs("div", { className: "impact-notification-list-item-header", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `impact-notification-list-item-header-left impact-notification-list-item-header-left--btns-${[list.handleDeleteNotification, list.handleBookMark || list.showBookMark, list.handleDownloadNotification].filter(Boolean).length}`,
                children: [
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      orientation: "top",
                      title: isTitleTruncated ? list.label : "",
                      variant: "tertiary",
                      children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          ref: titleRef,
                          className: "impact-notification-list-item-title",
                          onClick: handleRowActivate,
                          onKeyDown: (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleRowActivate(e);
                            }
                          },
                          children: list.label
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "impact-notification-list-item-title-icons", children: [
                    list.handleRedirect && /* @__PURE__ */ jsx(Tooltip, { orientation: "top", title: t("notification.goTo"), variant: "tertiary", children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "title-icon-btn",
                        role: "button",
                        tabIndex: 0,
                        onClick: (e) => {
                          var _a;
                          e.stopPropagation();
                          (_a = list.handleRedirect) == null ? void 0 : _a.call(list, type, notificationPanels, setNotificationPanels, list);
                        },
                        children: /* @__PURE__ */ jsx(
                          "img",
                          {
                            alt: t("notification.openInNewAlt"),
                            className: "impact-notification-title-icon",
                            src: OpenInNewIcon
                          }
                        )
                      }
                    ) }),
                    list.handleSync && /* @__PURE__ */ jsx(Tooltip, { orientation: "top", title: t("notification.sync"), variant: "tertiary", children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "title-icon-btn",
                        role: "button",
                        tabIndex: 0,
                        onClick: (e) => {
                          var _a;
                          e.stopPropagation();
                          (_a = list.handleSync) == null ? void 0 : _a.call(list, type, notificationPanels, setNotificationPanels, list);
                        },
                        children: /* @__PURE__ */ jsx(
                          "img",
                          {
                            alt: t("notification.syncAlt"),
                            className: `impact-notification-title-icon${list.isSyncing ? " impact-notification-sync-icon--rotating" : ""}`,
                            src: SyncReloadIcon
                          }
                        )
                      }
                    ) }),
                    list.titleIconsContent
                  ] }),
                  showHeaderIcons && /* @__PURE__ */ jsx("span", { className: "impact-notification-separator" }),
                  list.showNOverdueIcon && /* @__PURE__ */ jsx(Tooltip, { orientation: "top", title: t("notification.noOverdue"), variant: "tertiary", children: /* @__PURE__ */ jsx("img", { alt: "notification-read", src: NotificationReadIcon }) }),
                  list.showFastApproachingIcon && /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      orientation: "top",
                      title: t("notification.fastApproaching"),
                      variant: "tertiary",
                      children: /* @__PURE__ */ jsx("img", { alt: "notification-bookmark", src: NotificationBookmarkIcon })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "impact-notification-list-item-header-right", children: [
              list.handleDeleteNotification && /* @__PURE__ */ jsx(Tooltip, { orientation: "top", title: t("notification.delete"), variant: "tertiary", children: /* @__PURE__ */ jsx(
                Button,
                {
                  className: isDeleteAlwaysVisible ? "impact-notification-list-item-delete-btn" : "",
                  icon: /* @__PURE__ */ jsx(default_1, {}),
                  size: "small",
                  variant: "text",
                  onClick: (e) => {
                    var _a;
                    e.stopPropagation();
                    (_a = list.handleDeleteNotification) == null ? void 0 : _a.call(
                      list,
                      type,
                      notificationPanels,
                      setNotificationPanels,
                      list
                    );
                  }
                }
              ) }),
              showBookmarkControl && /* @__PURE__ */ jsx(
                Tooltip,
                {
                  orientation: "top",
                  title: list.bookMarked ? t("notification.removeBookmark") : t("notification.bookmark"),
                  variant: "tertiary",
                  children: /* @__PURE__ */ jsx(
                    Button,
                    {
                      className: list.bookMarked ? "impact-notification-list-item-bookmark-btn" : void 0,
                      disabled: list.showBookMark,
                      icon: list.bookMarked ? /* @__PURE__ */ jsx("img", { alt: "bookmarked", src: BookMarkedFillIcon }) : /* @__PURE__ */ jsx(default_1$1, {}),
                      size: "small",
                      variant: "text",
                      onClick: (event) => {
                        event.stopPropagation();
                        invokeHandler(
                          list.handleBookMark,
                          type,
                          notificationPanels,
                          setNotificationPanels,
                          list
                        );
                      }
                    }
                  )
                }
              ),
              list.handleDownloadNotification && /* @__PURE__ */ jsx(Tooltip, { orientation: "top", title: t("notification.download"), variant: "tertiary", children: /* @__PURE__ */ jsx(
                Button,
                {
                  icon: /* @__PURE__ */ jsx(default_1$2, {}),
                  size: "small",
                  variant: "text",
                  onClick: (e) => {
                    var _a;
                    e.stopPropagation();
                    (_a = list.handleDownloadNotification) == null ? void 0 : _a.call(
                      list,
                      type,
                      notificationPanels,
                      setNotificationPanels,
                      list
                    );
                  }
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "impact-notification-list-item-schedule", children: [
            /* @__PURE__ */ jsx("div", { className: "impact-notification-list-item-date", children: moment(list.date).format(displayFormat) }),
            /* @__PURE__ */ jsx("div", { className: "impact-notification-list-item-separator", children: "-" }),
            /* @__PURE__ */ jsx("div", { className: "impact-notification-list-item-date", children: moment(list.time).format("LTS") }),
            list.bookMarked && /* @__PURE__ */ jsx(
              Badge,
              {
                isIcon: true,
                color: "info",
                icon: /* @__PURE__ */ jsx(default_1$1, {}),
                label: t("notification.bookmarked"),
                size: "small",
                variant: "subtle"
              }
            )
          ] }),
          visibleTextLength > NOTIFICATION_DESCRIPTION_VISIBLE_MAX ? /* @__PURE__ */ jsxs("div", { className: "impact-notification-list-item-description", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                dangerouslySetInnerHTML: {
                  __html: showMore ? description : truncatedHtml
                }
              }
            ),
            !showMore ? /* @__PURE__ */ jsxs(Fragment, { children: [
              "... ",
              /* @__PURE__ */ jsx(
                "span",
                {
                  role: "button",
                  tabIndex: 0,
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowMore((prev) => !prev);
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowMore((prev) => !prev);
                    }
                  },
                  children: t("notification.readMore")
                }
              )
            ] }) : /* @__PURE__ */ jsx(
              "span",
              {
                role: "button",
                tabIndex: 0,
                onClick: (e) => {
                  e.stopPropagation();
                  setShowMore((prev) => !prev);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMore((prev) => !prev);
                  }
                },
                children: t("notification.readLess")
              }
            )
          ] }) : /* @__PURE__ */ jsx(
            "div",
            {
              className: "impact-notification-list-item-description",
              dangerouslySetInnerHTML: { __html: description }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "impact-notification-list-item-action-btns", children: [
            list.handleMarkCompleted && /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                variant: "secondary",
                onClick: (event) => {
                  event.stopPropagation();
                  invokeHandler(
                    list.handleMarkCompleted,
                    type,
                    notificationPanels,
                    setNotificationPanels,
                    list
                  );
                },
                children: t("notification.markAsCompleted")
              }
            ),
            list.handleMoveToPending && /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                variant: "text",
                onClick: (event) => {
                  event.stopPropagation();
                  invokeHandler(
                    list.handleMoveToPending,
                    type,
                    notificationPanels,
                    setNotificationPanels,
                    list
                  );
                },
                children: list.moveToPendingText ?? t("notification.moveToPending")
              }
            ),
            list.customActionContent,
            list.handleMarkAsRead && /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                variant: "url",
                onClick: (event) => {
                  event.stopPropagation();
                  invokeHandler(
                    list.handleMarkAsRead,
                    type,
                    notificationPanels,
                    setNotificationPanels,
                    list
                  );
                },
                children: !list.read ? t("notification.markAsRead") : t("notification.markAsUnread")
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  NotificationListItem
};
