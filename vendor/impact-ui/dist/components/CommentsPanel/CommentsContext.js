import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Comment as Comment_default, CheckTickAll as CheckTickAll_default, DeleteBlack as DeleteBlack_default, EditBlack as EditBlack_default } from "../../node_modules/@impactsmartsuite/impact-icons/dist/index.js";
import { Menu } from "../Menu/index.js";
import { Prompt } from "../Prompt/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const CommentsContext = createContext(null);
function CommentsProvider({ commentProps, children }) {
  const { t } = useTranslation();
  const [comments, setComments] = useState((commentProps == null ? void 0 : commentProps.comments) || {});
  const [resolvedComments, setResolvedComments] = useState((commentProps == null ? void 0 : commentProps.resolvedComments) || []);
  const [isCommentResolvedAlertOpen, setIsCommentResolvedAlertOpen] = useState(false);
  const commentsBeforeResolvedViewRef = useRef(null);
  const resolvedCommentsBeforeResolvedViewRef = useRef(null);
  useEffect(() => {
    if (commentProps == null ? void 0 : commentProps.comments) {
      setComments(commentProps.comments);
    }
    if (commentProps == null ? void 0 : commentProps.resolvedComments) {
      setResolvedComments(commentProps.resolvedComments);
    }
  }, [commentProps]);
  const [popup, setPopup] = useState(null);
  const [commentMode, setCommentMode] = useState(false);
  const [showCommentPanel, setShowCommentPanel] = useState((commentProps == null ? void 0 : commentProps.defaultShowPanel) ?? false);
  const [editingComment, setEditingComment] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentMenuType, setCurrentMenuType] = useState("commentMenu");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [threadToDelete, setThreadToDelete] = useState(null);
  const [isDeleteConfirmationLoading, setIsDeleteConfirmationLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const commentItemClickHandlerRef = useRef(null);
  const registerCommentItemClickHandler = useCallback((handler) => {
    commentItemClickHandlerRef.current = handler;
  }, []);
  const onCommentItemClick = useCallback(
    (...args) => {
      if (commentItemClickHandlerRef.current) {
        commentItemClickHandlerRef.current(...args);
      } else if (commentProps == null ? void 0 : commentProps.onCommentItemClick) {
        commentProps.onCommentItemClick(...args);
      }
    },
    [commentProps == null ? void 0 : commentProps.onCommentItemClick]
  );
  useMemo(() => {
    if (!popup) {
      setMenuAnchorEl(null);
      setEditingComment(null);
      setSelectedComment(null);
    }
  }, [popup]);
  const toggleCommentMode = useCallback(() => {
    setCommentMode((prev) => !prev);
    setPopup(null);
    setEditingComment(null);
    setSelectedComment(null);
  }, []);
  const getEffectiveCellId = useCallback(
    (baseCellId) => {
      const isResolved = Array.isArray(resolvedComments) ? resolvedComments.includes(baseCellId) : false;
      if (!isResolved) return baseCellId;
      const prefix = `${baseCellId}__t`;
      const allKeys = Object.keys(comments || {});
      const threadIndices = allKeys.filter((k) => k === baseCellId || k.startsWith(prefix)).map((k) => {
        const m = k.match(new RegExp(`^${baseCellId}__t(\\d+)$`));
        return m ? parseInt(m[1], 10) : 0;
      }).filter((n) => !Number.isNaN(n));
      const nextIndex = threadIndices.length ? Math.max(...threadIndices) + 1 : 1;
      return `${baseCellId}__t${nextIndex}`;
    },
    [comments, resolvedComments]
  );
  const getLatestUnresolvedThreadId = useCallback(
    (baseCellId) => {
      const prefix = `${baseCellId}__t`;
      const allKeys = Object.keys(comments || {});
      const candidates = allKeys.filter((k) => k === baseCellId || k.startsWith(prefix));
      if (candidates.length === 0) return null;
      const unresolved = candidates.filter((k) => {
        var _a;
        return !((_a = resolvedComments == null ? void 0 : resolvedComments.includes) == null ? void 0 : _a.call(resolvedComments, k));
      });
      if (unresolved.length === 0) return null;
      const withIndex = unresolved.map((k) => {
        const m = k.match(new RegExp(`^${baseCellId}__t(\\d+)$`));
        return { id: k, idx: m ? parseInt(m[1], 10) : 0 };
      });
      withIndex.sort((a, b) => b.idx - a.idx);
      return withIndex[0].id;
    },
    [comments, resolvedComments]
  );
  const handleMenuClick = useCallback(
    (event, comment = null, type = "commentMenu") => {
      setMenuAnchorEl(event.currentTarget);
      setCurrentMenuType(type);
      if (typeof comment === "string") {
        const val = comments[comment];
        setSelectedComment({ ...val, id: comment });
      } else {
        setSelectedComment(comment);
      }
    },
    [comments]
  );
  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
    setSelectedComment(null);
  }, []);
  const getMenuOptions = useCallback(
    (menuType, comment) => {
      var _a, _b;
      const effectiveComment = comment !== void 0 ? comment : selectedComment;
      const config = (commentProps == null ? void 0 : commentProps.configuration) || {};
      if (menuType === "topMenu") {
        const isObj = effectiveComment && typeof effectiveComment === "object";
        const isRead = isObj ? (_a = effectiveComment[0]) == null ? void 0 : _a.read : effectiveComment == null ? void 0 : effectiveComment.read;
        const author = isObj ? (_b = effectiveComment[0]) == null ? void 0 : _b.author : effectiveComment == null ? void 0 : effectiveComment.author;
        const options = [];
        if (!config.disableMarkAsRead) {
          options.push({
            label: isRead ? t("commentsPanel.markAsUnread") : t("commentsPanel.markAsRead"),
            onClick: async () => {
              if (selectedComment == null ? void 0 : selectedComment.read) {
                await (commentProps == null ? void 0 : commentProps.handleMarkAsUnread(selectedComment.id));
              } else {
                await (commentProps == null ? void 0 : commentProps.handleMarkAsRead(selectedComment.id));
              }
              setMenuAnchorEl(null);
              setSelectedComment(null);
            },
            value: "mark-as-unread",
            icon: isRead ? /* @__PURE__ */ jsx(Comment_default, {}) : /* @__PURE__ */ jsx(CheckTickAll_default, {})
          });
        }
        if (!config.disableDeleteThread && author == (commentProps == null ? void 0 : commentProps.author)) {
          options.push({
            label: t("commentsPanel.deleteThread"),
            icon: /* @__PURE__ */ jsx(DeleteBlack_default, {}),
            onClick: () => {
              setThreadToDelete({
                cellId: selectedComment == null ? void 0 : selectedComment.id,
                data: selectedComment
              });
              setShowDeleteConfirmation(true);
              setMenuAnchorEl(null);
              setSelectedComment(null);
            },
            value: "delete-thread"
          });
        }
        return options;
      } else {
        const options = [];
        if (!config.disableEditComment) {
          options.push({
            label: t("commentsPanel.edit"),
            icon: /* @__PURE__ */ jsx(EditBlack_default, {}),
            onClick: () => {
              if (selectedComment) {
                setEditingComment(selectedComment);
              }
              setMenuAnchorEl(null);
              setSelectedComment(null);
            },
            value: "edit"
          });
        }
        if (!config.disableDeleteComment) {
          options.push({
            label: t("commentsPanel.delete"),
            icon: /* @__PURE__ */ jsx(DeleteBlack_default, {}),
            onClick: () => {
              setCommentToDelete({
                cellId: popup == null ? void 0 : popup.cellId,
                data: popup == null ? void 0 : popup.data,
                comment: selectedComment
              });
              setShowDeleteConfirmation(true);
              setMenuAnchorEl(null);
              setSelectedComment(null);
            },
            value: "delete"
          });
        }
        return options;
      }
    },
    [commentProps, selectedComment, popup == null ? void 0 : popup.cellId, popup == null ? void 0 : popup.data, t]
  );
  const handleMouseLeave = useCallback(() => {
    if ((popup == null ? void 0 : popup.openedBy) === "hover") {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!menuAnchorEl) {
          setPopup(null);
          setEditingComment(null);
          setSelectedComment(null);
        }
      }, 200);
    } else {
      setPopup(null);
      setEditingComment(null);
      setSelectedComment(null);
    }
  }, [popup, menuAnchorEl]);
  const handleMouseEnter = useCallback(() => {
    if ((popup == null ? void 0 : popup.openedBy) === "hover") {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, [popup]);
  const handleUpdateComment = useCallback(
    async (commentId, newText) => {
      if (commentId === null) {
        setEditingComment(null);
        return;
      }
      if (!(newText == null ? void 0 : newText.trim())) return;
      setIsCommentLoading(true);
      setCommentError(null);
      try {
        const commentToUpdate = editingComment;
        if (!commentToUpdate) return;
        let response;
        if (commentProps == null ? void 0 : commentProps.handleCommentEdit) {
          response = await commentProps.handleCommentEdit(
            newText.trim(),
            commentToUpdate,
            commentId
          );
        }
        if (response) {
          setComments(response);
        }
        setEditingComment(null);
      } catch (error) {
        console.error("Error updating comment:", error);
        setCommentError(t("commentsPanel.updateFailed"));
      } finally {
        setIsCommentLoading(false);
      }
    },
    [editingComment, commentProps, t]
  );
  const handleAddComment = useCallback(
    async (cellId, inputValue, taggedUsers) => {
      if (!(inputValue == null ? void 0 : inputValue.trim())) {
        setCommentError(t("commentsPanel.commentEmpty"));
        return;
      }
      const isEditing = editingComment !== null;
      try {
        setIsCommentLoading(true);
        setCommentError(null);
        let response;
        if (isEditing) {
          response = await (commentProps == null ? void 0 : commentProps.handleCommentEdit(
            inputValue.trim(),
            editingComment,
            editingComment.id,
            taggedUsers
          ));
        } else {
          response = await (commentProps == null ? void 0 : commentProps.handleSaveComment(
            cellId,
            inputValue.trim(),
            popup == null ? void 0 : popup.data,
            taggedUsers
          ));
        }
        if (response) {
          setComments(response);
        } else {
          if (isEditing) {
            setComments((prev) => {
              var _a;
              return {
                ...prev,
                [cellId]: ((_a = prev[cellId]) == null ? void 0 : _a.map(
                  (c) => c.id === editingComment.id ? {
                    ...c,
                    text: inputValue.trim(),
                    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                    isEdited: true
                  } : c
                )) || []
              };
            });
          } else {
            const newComment = {
              id: Date.now(),
              text: inputValue.trim(),
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              author: (commentProps == null ? void 0 : commentProps.author) || t("commentsPanel.currentUser"),
              isEdited: false
            };
            setComments((prev) => ({
              ...prev,
              [cellId]: [...prev[cellId] || [], newComment]
            }));
          }
        }
        if (!comments[cellId]) setPopup(null);
        setEditingComment(null);
        setSelectedComment(null);
      } catch (error) {
        console.error("Error saving comment:", error);
        setCommentError(
          (error == null ? void 0 : error.message) || (isEditing ? t("commentsPanel.updateFailedShort") : t("commentsPanel.saveFailed"))
        );
      } finally {
        setIsCommentLoading(false);
      }
    },
    [
      popup == null ? void 0 : popup.data,
      editingComment,
      commentProps == null ? void 0 : commentProps.handleSaveComment,
      commentProps == null ? void 0 : commentProps.handleCommentEdit,
      commentProps == null ? void 0 : commentProps.author,
      t
    ]
  );
  const handleMarkAsResolved = useCallback(
    async (cellId, commentsForCell) => {
      const config = (commentProps == null ? void 0 : commentProps.configuration) || {};
      if (config.disableMarkAsResolved) return;
      let response;
      if (commentProps == null ? void 0 : commentProps.handleMarkAsResolved) {
        response = await commentProps.handleMarkAsResolved(cellId, commentsForCell);
      }
      if (response) {
        setResolvedComments(response);
      } else {
        setResolvedComments((prev) => [...prev, cellId]);
      }
      setIsCommentResolvedAlertOpen(true);
      setTimeout(() => {
        setIsCommentResolvedAlertOpen(false);
      }, 2e3);
      setPopup(null);
      setEditingComment(null);
      setSelectedComment(null);
    },
    [commentProps == null ? void 0 : commentProps.handleMarkAsResolved, commentProps == null ? void 0 : commentProps.configuration]
  );
  const handleUnresolve = useCallback(
    async (cellId) => {
      if (commentProps == null ? void 0 : commentProps.handleUnresolve) {
        await commentProps.handleUnresolve(cellId);
      }
      setResolvedComments((prev) => prev.filter((id) => id !== cellId));
    },
    [commentProps == null ? void 0 : commentProps.handleUnresolve]
  );
  const handleDeleteConfirm = useCallback(async () => {
    var _a, _b, _c;
    if (commentToDelete) {
      try {
        setIsDeleteConfirmationLoading(true);
        const updatedComment = await ((_b = commentProps == null ? void 0 : commentProps.handleCommentDelete) == null ? void 0 : _b.call(
          commentProps,
          (_a = commentToDelete.comment) == null ? void 0 : _a.id,
          commentToDelete.comment
        ));
        if (updatedComment) {
          setComments(updatedComment);
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      } finally {
        setIsDeleteConfirmationLoading(false);
      }
    } else if (threadToDelete) {
      try {
        setIsDeleteConfirmationLoading(true);
        const updatedComment = await ((_c = commentProps == null ? void 0 : commentProps.handleThreadDelete) == null ? void 0 : _c.call(
          commentProps,
          threadToDelete.cellId,
          threadToDelete.data
        ));
        if (updatedComment) {
          setComments(updatedComment);
        }
      } catch (error) {
        console.error("Error deleting thread:", error);
      } finally {
        setIsDeleteConfirmationLoading(false);
      }
    }
    setShowDeleteConfirmation(false);
    setCommentToDelete(null);
  }, [commentToDelete, threadToDelete, commentProps]);
  const handleDeleteCancel = useCallback((e) => {
    e.stopPropagation();
    setShowDeleteConfirmation(false);
    setCommentToDelete(null);
  }, []);
  const clearCommentError = useCallback(() => {
    setCommentError(null);
  }, []);
  const onShowResolvedCommentsRequest = useCallback(async () => {
    if (!(commentProps == null ? void 0 : commentProps.handleFetchResolvedComments)) return;
    commentsBeforeResolvedViewRef.current = comments;
    resolvedCommentsBeforeResolvedViewRef.current = resolvedComments;
    const result = await commentProps.handleFetchResolvedComments();
    if (result) {
      if (result.comments !== void 0) setComments(result.comments);
      if (result.resolvedComments !== void 0) setResolvedComments(result.resolvedComments);
    }
  }, [comments, resolvedComments, commentProps == null ? void 0 : commentProps.handleFetchResolvedComments]);
  const onExitResolvedCommentsView = useCallback(() => {
    if (commentsBeforeResolvedViewRef.current != null && resolvedCommentsBeforeResolvedViewRef.current != null) {
      setComments(commentsBeforeResolvedViewRef.current);
      setResolvedComments(resolvedCommentsBeforeResolvedViewRef.current);
      commentsBeforeResolvedViewRef.current = null;
      resolvedCommentsBeforeResolvedViewRef.current = null;
    }
  }, []);
  const value = useMemo(
    () => ({
      comments,
      setComments,
      resolvedComments,
      setResolvedComments,
      isCommentResolvedAlertOpen,
      setIsCommentResolvedAlertOpen,
      popup,
      setPopup,
      commentMode,
      setCommentMode,
      showCommentPanel,
      setShowCommentPanel,
      editingComment,
      setEditingComment,
      selectedComment,
      setSelectedComment,
      menuAnchorEl,
      currentMenuType,
      showDeleteConfirmation,
      commentToDelete,
      threadToDelete,
      isDeleteConfirmationLoading,
      isCommentLoading,
      commentError,
      hoverTimeoutRef,
      toggleCommentMode,
      getEffectiveCellId,
      getLatestUnresolvedThreadId,
      handleMenuClick,
      handleMenuClose,
      getMenuOptions,
      handleMouseLeave,
      handleMouseEnter,
      handleUpdateComment,
      handleAddComment,
      handleMarkAsResolved,
      handleUnresolve,
      handleDeleteConfirm,
      handleDeleteCancel,
      clearCommentError,
      registerCommentItemClickHandler,
      onCommentItemClick,
      onShowResolvedCommentsRequest: (commentProps == null ? void 0 : commentProps.handleFetchResolvedComments) ? onShowResolvedCommentsRequest : void 0,
      onExitResolvedCommentsView: (commentProps == null ? void 0 : commentProps.handleFetchResolvedComments) ? onExitResolvedCommentsView : void 0,
      commentProps
    }),
    [
      comments,
      resolvedComments,
      isCommentResolvedAlertOpen,
      popup,
      commentMode,
      showCommentPanel,
      editingComment,
      selectedComment,
      menuAnchorEl,
      currentMenuType,
      showDeleteConfirmation,
      commentToDelete,
      threadToDelete,
      isDeleteConfirmationLoading,
      isCommentLoading,
      commentError,
      toggleCommentMode,
      getEffectiveCellId,
      getLatestUnresolvedThreadId,
      handleMenuClick,
      handleMenuClose,
      getMenuOptions,
      handleMouseLeave,
      handleMouseEnter,
      handleUpdateComment,
      handleAddComment,
      handleMarkAsResolved,
      handleUnresolve,
      handleDeleteConfirm,
      handleDeleteCancel,
      clearCommentError,
      registerCommentItemClickHandler,
      onCommentItemClick,
      onShowResolvedCommentsRequest,
      onExitResolvedCommentsView,
      commentProps
    ]
  );
  return /* @__PURE__ */ jsxs(CommentsContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsx(
      Menu,
      {
        anchorEl: menuAnchorEl,
        iconPlacement: "left",
        MenuProps: {
          sx: {
            zIndex: 9999
          }
        },
        open: Boolean(menuAnchorEl),
        options: getMenuOptions(currentMenuType),
        onClose: handleMenuClose
      }
    ),
    /* @__PURE__ */ jsx(
      Prompt,
      {
        handleClose: handleDeleteCancel,
        isOpen: showDeleteConfirmation,
        primaryButtonLabel: isDeleteConfirmationLoading ? t("commentsPanel.deleting") : t("commentsPanel.delete"),
        primaryButtonProps: {
          type: "destructive"
        },
        secondaryButtonLabel: t("common.cancel"),
        style: { zIndex: 1e4 },
        title: t("commentsPanel.deleteCommentTitle"),
        variant: "error",
        onPrimaryButtonClick: handleDeleteConfirm,
        onSecondaryButtonClick: handleDeleteCancel,
        children: t("commentsPanel.deleteConfirmMessage")
      }
    )
  ] });
}
function useComments() {
  return useContext(CommentsContext);
}
export {
  CommentsContext,
  CommentsProvider,
  useComments
};
