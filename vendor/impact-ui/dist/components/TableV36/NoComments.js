import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/North.js";
import { Button } from "../Button/index.js";
import { MentionEditor } from "../common/MentionEditor/index.js";
const extractMentionedUsers = (editorJSON) => {
  const mentionedUsers = [];
  const traverseNodes = (node) => {
    if (node.type === "mention" && node.attrs) {
      const user = {
        id: node.attrs.id,
        name: node.attrs.label || node.attrs.name,
        ...node.attrs.avatar && { avatar: node.attrs.avatar },
        ...node.attrs.status && { status: node.attrs.status }
      };
      if (!mentionedUsers.find((u) => u.id === user.id)) {
        mentionedUsers.push(user);
      }
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverseNodes);
    }
  };
  if (editorJSON == null ? void 0 : editorJSON.content) {
    editorJSON.content.forEach(traverseNodes);
  }
  return mentionedUsers;
};
const NoComments = ({
  onAddComment,
  cellId,
  position,
  isInsidePortal = false,
  editCommentText = "",
  isLoading = false,
  error = null,
  onClearError,
  isEditFlow,
  onUpdateComment,
  setEditingComment,
  loadParticipantsAvatar
}) => {
  const [inputValue, setInputValue] = useState(editCommentText);
  useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [height, setHeight] = useState("auto");
  const [isMultiLine, setIsMultiLine] = useState(false);
  const editorRef = useRef(null);
  const prevHeightRef = useRef(null);
  useRef(false);
  const checkMultiLineContent = useCallback(() => {
    var _a;
    if (!((_a = editorRef.current) == null ? void 0 : _a.editor)) return;
    try {
      const editorElement = editorRef.current.editor.view.dom;
      if (!editorElement) return;
      const computedStyle = window.getComputedStyle(editorElement);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
      const actualHeight = editorElement.scrollHeight;
      const isContentMultiLine = actualHeight > lineHeight * 1.5;
      setIsMultiLine(isContentMultiLine);
    } catch (error2) {
      console.warn("Error checking multi-line content:", error2);
    }
  }, []);
  useEffect(() => {
    if (inputValue === "") {
      setIsFixed(false);
      setIsScrollable(false);
      prevHeightRef.current = null;
    }
  }, [inputValue]);
  useEffect(() => {
    if (editCommentText === null) {
      setInputValue("");
    } else {
      setInputValue(editCommentText);
    }
  }, [editCommentText]);
  useEffect(() => {
    let cellElement = null;
    let styleElement = null;
    const timer = setTimeout(() => {
      var _a, _b;
      if ((_a = editorRef.current) == null ? void 0 : _a.focus) {
        cellElement = document.querySelector(".ag-cell-focus");
        if (cellElement) {
          const rowIndex = (_b = cellElement.closest(".ag-row")) == null ? void 0 : _b.getAttribute("row-index");
          const colId = cellElement.getAttribute("col-id");
          if (rowIndex && colId) {
            const customCSS = `
              .ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${colId}"]:after {
                content: " ";
                position: absolute;
                top: 0;
                bottom: 0;
                width: 3px;
                background: #4259ee;
                left: 0;
              }
            `;
            styleElement = document.createElement("style");
            styleElement.textContent = customCSS;
            styleElement.setAttribute("data-comment-focus", "true");
            document.head.appendChild(styleElement);
            cellElement.setAttribute("data-comment-focused", "true");
          }
        }
        editorRef.current.focus({ preventScroll: true });
      }
    }, 50);
    return () => {
      clearTimeout(timer);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
      if (cellElement) {
        cellElement.removeAttribute("data-comment-focused");
      }
    };
  }, []);
  const handleAddComment = (e) => {
    var _a;
    e.stopPropagation();
    if (inputValue.trim() && !isLoading) {
      let taggedUsers = [];
      try {
        if ((_a = editorRef.current) == null ? void 0 : _a.editor) {
          const editorJSON = editorRef.current.editor.getJSON();
          taggedUsers = extractMentionedUsers(editorJSON);
        }
      } catch (error2) {
        console.warn("Error extracting mentioned users:", error2);
      }
      onAddComment(cellId, inputValue, taggedUsers);
      setInputValue("");
    }
  };
  const handleInputChange = (e) => {
    setInputValue(e);
    if (error && onClearError) {
      onClearError();
    }
    setTimeout(() => {
      checkMultiLineContent();
    }, 0);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `no-comments-container ${isInsidePortal ? "in-portal" : "as-banner"} ${isFixed ? "stacked" : ""} ${!isFixed || inputValue === "" ? "empty" : ""} ${!isFixed ? "single-line-textarea" : ""}`,
      style: !isInsidePortal ? {
        top: position == null ? void 0 : position.top,
        left: position == null ? void 0 : position.left,
        maxHeight: "182px"
        // Match chat-input-wrapper max-height
      } : {
        gap: "10px",
        maxHeight: "182px"
      },
      onClick: (e) => {
        e.stopPropagation();
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "comment-input-wrapper",
            style: {
              flexDirection: isMultiLine ? "column" : "row",
              gap: isMultiLine ? "8px" : "0"
            },
            children: [
              /* @__PURE__ */ jsx(
                MentionEditor,
                {
                  ref: editorRef,
                  chatId: cellId,
                  disabled: isLoading,
                  isMultiLine,
                  loadParticipantsAvatar,
                  maxLength: 1e3,
                  placeholder: "Type message...",
                  value: inputValue,
                  onChange: handleInputChange,
                  onSend: handleAddComment
                }
              ),
              !isEditFlow && /* @__PURE__ */ jsx(
                Button,
                {
                  disabled: isLoading || !inputValue.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim(),
                  icon: /* @__PURE__ */ jsx(default_1, {}),
                  size: "small",
                  style: { display: "flex" },
                  variant: "primary",
                  onClick: handleAddComment
                }
              )
            ]
          }
        ),
        isEditFlow && /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px" }, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              disabled: isLoading,
              size: "small",
              variant: "tertiary",
              onClick: () => {
                setInputValue("");
                setEditingComment(null);
              },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              disabled: isLoading,
              loading: isLoading,
              size: "small",
              variant: "primary",
              onClick: () => onUpdateComment(inputValue),
              children: "Save"
            }
          )
        ] })
      ]
    }
  );
};
export {
  NoComments as default
};
