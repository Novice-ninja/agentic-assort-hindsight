import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal as MoreHorizontal_default, SuccessFill as SuccessFill_default, SuccessGray as SuccessGray_default, Close as Close_default } from "../../node_modules/@impactsmartsuite/impact-icons/dist/index.js";
import moment from "moment";
import { createPortal } from "react-dom";
import { Avatar } from "../Avatar/index.js";
import { Button } from "../Button/index.js";
import NoComments from "./NoComments.js";
import { getUserAvatarColor } from "../../utils/avatarColor.js";
import { toInnerHTML } from "../../utils/html.js";
const CommentsPortal = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  cellId,
  position,
  author = "Current User",
  onMouseEnter,
  onMouseLeave,
  openedBy,
  onMenuClick,
  onMarkAsReadClick,
  onMarkAsResolvedClick,
  editCommentText = "",
  isLoading = false,
  error = null,
  onClearError,
  currentAuthor,
  editingComment = null,
  // Add editing comment prop
  onUpdateComment = null,
  // Add update comment handler
  setEditingComment,
  loadParticipantsAvatar,
  resolvedComments = [],
  messageId = null,
  configuration
}) => {
  if (!isOpen) return null;
  const [openFullReplies, setOpenFullReplies] = useState(openedBy == "click");
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [editingText, setEditingText] = useState("");
  const listRef = useRef(null);
  useEffect(() => {
    if (editingComment) {
      setEditingText(editingComment.text || "");
    }
  }, [editingComment]);
  useEffect(() => {
    var _a;
    if (openFullReplies && comments && comments.length > 0) {
      const safePad = 8;
      if (comments.length === 1) {
        const headerHeight = 50;
        const inputSectionHeight = 60;
        const metaHeight = 40;
        const lineHeight = 20;
        const charsPerLine = 45;
        const textLen = (((_a = comments[0]) == null ? void 0 : _a.text) || "").length;
        const lines = Math.max(1, Math.ceil(textLen / charsPerLine));
        const textHeight = Math.min(lines * lineHeight, 300);
        const desiredHeight = Math.min(
          headerHeight + metaHeight + textHeight + inputSectionHeight,
          500
        );
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const baseTop = (position == null ? void 0 : position.top) ?? 0;
        const fitsBelow = baseTop + desiredHeight <= viewportHeight - safePad;
        const keepTop = Math.max(safePad, baseTop);
        const clampTop = Math.max(safePad, viewportHeight - desiredHeight - safePad);
        const newTop = fitsBelow ? keepTop : clampTop;
        setAdjustedPosition({
          top: newTop,
          left: (position == null ? void 0 : position.left) ?? 0
        });
      } else {
        const desiredHeight = 500;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const maxTop = Math.max(safePad, viewportHeight - desiredHeight - safePad);
        const newTop = Math.min(Math.max(safePad, (position == null ? void 0 : position.top) || 0), maxTop);
        setAdjustedPosition({ top: newTop, left: (position == null ? void 0 : position.left) || 0 });
      }
    } else {
      setAdjustedPosition(position);
    }
  }, [openFullReplies, comments, position]);
  useEffect(() => {
    var _a;
    if (!isOpen) return;
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      try {
        if (messageId) {
          const messageElement = el.querySelector(`[data-message-id="${messageId}"]`);
          if (messageElement) {
            messageElement.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
            messageElement.style.backgroundColor = "#eceefd";
            messageElement.style.transition = "background-color 0.3s ease";
            setTimeout(() => {
              messageElement.style.backgroundColor = "";
            }, (configuration == null ? void 0 : configuration.messageIdHighlightTimer) || 3e3);
          } else {
            if (el.scrollHeight > el.clientHeight) {
              el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
            }
          }
        } else {
          if (el.scrollHeight > el.clientHeight) {
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
          }
        }
      } catch (e) {
      }
    });
    if (onMarkAsReadClick && !((_a = comments[0]) == null ? void 0 : _a.read)) onMarkAsReadClick(cellId);
  }, [isOpen, openFullReplies, comments == null ? void 0 : comments.length, messageId]);
  useEffect(() => {
    if (!isOpen) return;
    const isNoCommentsOutsidePortal = !(comments && comments.length > 0);
    if (!isNoCommentsOutsidePortal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (typeof onClose === "function") {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, comments, onClose]);
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    if (moment(timestamp).isValid()) {
      return moment.utc(timestamp).local().format("hh:mm A, MM-DD-YYYY");
    }
    return timestamp;
  };
  const isResolved = Array.isArray(resolvedComments) && resolvedComments.find((comment) => comment === cellId);
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "fixed",
          top: (adjustedPosition == null ? void 0 : adjustedPosition.top) || 0,
          left: (adjustedPosition == null ? void 0 : adjustedPosition.left) || 0,
          zIndex: 9999
        },
        onClick: onClose,
        onMouseEnter,
        onMouseLeave: !openFullReplies ? onMouseLeave : () => {
        },
        children: comments && (comments == null ? void 0 : comments.length) > 0 ? /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxHeight: "500px",
              paddingBottom: openFullReplies && isResolved ? "16px" : "0px"
            },
            className: `comments-portal-container ${!openFullReplies ? "clickable" : ""} ${(position == null ? void 0 : position.side) == "left" ? "left" : ""}`,
            onClick: (e) => {
              e.stopPropagation();
              if (!openFullReplies) {
                setOpenFullReplies(true);
              }
            },
            children: [
              openFullReplies && /* @__PURE__ */ jsx("div", { className: `comments-portal-header ${(position == null ? void 0 : position.side) == "left" ? "left" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "comments-portal-header-inner", children: [
                /* @__PURE__ */ jsx("h3", { children: "Comments" }),
                /* @__PURE__ */ jsxs("div", { className: "comments-portal-header-buttons", children: [
                  (comments == null ? void 0 : comments.length) >= 1 && !isResolved && !((configuration == null ? void 0 : configuration.disableMarkAsRead) && (configuration == null ? void 0 : configuration.disableDeleteThread)) && /* @__PURE__ */ jsx(
                    Button,
                    {
                      className: "",
                      disabled: false,
                      icon: /* @__PURE__ */ jsx(MoreHorizontal_default, { fontSize: "small" }),
                      iconPlacement: "left",
                      size: "small",
                      style: {
                        backgroundColor: "transparent",
                        maxHeight: "32px"
                      },
                      type: "default",
                      variant: "text",
                      onClick: (e) => {
                        onMenuClick(e, cellId, "topMenu");
                      }
                    }
                  ),
                  !(configuration == null ? void 0 : configuration.disableMarkAsResolved) && (isResolved ? /* @__PURE__ */ jsx(SuccessFill_default, { fontSize: "small" }) : /* @__PURE__ */ jsx(
                    "div",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        if (onMarkAsResolvedClick) onMarkAsResolvedClick(cellId, comments);
                      },
                      children: /* @__PURE__ */ jsx(SuccessGray_default, { className: "comment-success-icon", fontSize: "small" })
                    }
                  )),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      className: "comment-close",
                      disabled: false,
                      icon: /* @__PURE__ */ jsx(Close_default, { fontSize: "large" }),
                      iconPlacement: "left",
                      size: "small",
                      style: {
                        backgroundColor: "transparent",
                        padding: "4px 0px"
                      },
                      type: "default",
                      variant: "text",
                      onClick: onClose
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { ref: listRef, className: "comments-portal-list", children: comments.map((comment, index) => {
                const isCurrentAuthor = comment.author === currentAuthor;
                if (!openFullReplies && index > 0) {
                  return null;
                }
                return /* @__PURE__ */ jsxs("div", { "data-message-id": comment.id, children: [
                  /* @__PURE__ */ jsxs("div", { className: "comment-item-row-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "comment-item-author-section", children: [
                      /* @__PURE__ */ jsx(
                        Avatar,
                        {
                          className: "comment-item-avatar",
                          label: comment.author,
                          size: "small",
                          style: {
                            width: "6px",
                            height: "26px",
                            borderRadius: "6px",
                            padding: "3px 13px",
                            backgroundColor: getUserAvatarColor(comment.author)
                          },
                          type: "withoutPicture"
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "comment-item-author-name", children: comment.author }),
                      /* @__PURE__ */ jsxs("div", { className: "comment-item-timestamp", children: [
                        formatTimestamp(comment.timestamp),
                        comment.isEdited && /* @__PURE__ */ jsx("span", { children: "(edited)" })
                      ] })
                    ] }),
                    openFullReplies && isCurrentAuthor && (!(configuration == null ? void 0 : configuration.disableEditComment) || !(configuration == null ? void 0 : configuration.disableDeleteComment)) && /* @__PURE__ */ jsx(
                      Button,
                      {
                        className: "",
                        disabled: false,
                        icon: /* @__PURE__ */ jsx(MoreHorizontal_default, { fontSize: "small" }),
                        iconPlacement: "left",
                        size: "small",
                        style: { backgroundColor: "transparent" },
                        type: "default",
                        variant: "text",
                        onClick: (e) => {
                          onMenuClick(e, comment);
                        }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "comment-item-row-2", children: editingComment && editingComment.id === comment.id ? (
                    /* Show input field when editing this comment */
                    /* @__PURE__ */ jsx("div", { className: "comment-edit-input-wrapper", children: /* @__PURE__ */ jsx(
                      NoComments,
                      {
                        cellId: comment.id,
                        editCommentText: editingText,
                        error,
                        isEditFlow: true,
                        isInsidePortal: true,
                        isLoading,
                        loadParticipantsAvatar,
                        position,
                        setEditingComment,
                        onAddComment: onUpdateComment,
                        onClearError,
                        onUpdateComment: (text) => onUpdateComment(comment.id, text)
                      }
                    ) })
                  ) : (
                    /* Show normal comment text */
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `comment-item-text`,
                        dangerouslySetInnerHTML: toInnerHTML(comment.text)
                      }
                    )
                  ) })
                ] }, comment.id);
              }) }),
              openFullReplies && !isResolved && /* @__PURE__ */ jsxs("div", { className: "add-comment-section", children: [
                /* @__PURE__ */ jsx(
                  Avatar,
                  {
                    className: "comment-item-avatar",
                    label: currentAuthor,
                    size: "small",
                    style: {
                      width: "6px",
                      height: "26px",
                      borderRadius: "6px",
                      padding: "3px 13px",
                      backgroundColor: getUserAvatarColor(currentAuthor)
                    },
                    type: "withoutPicture"
                  }
                ),
                /* @__PURE__ */ jsx(
                  NoComments,
                  {
                    cellId,
                    error,
                    isInsidePortal: true,
                    isLoading,
                    loadParticipantsAvatar,
                    position,
                    onAddComment,
                    onClearError
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsx(
          NoComments,
          {
            cellId,
            editCommentText,
            error,
            isLoading,
            loadParticipantsAvatar,
            position,
            onAddComment,
            onClearError
          }
        )
      }
    ),
    document.body
  );
};
export {
  CommentsPortal as default
};
