import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { memo, useRef, useEffect } from "react";
import { getAssetUrl } from "../../utils/assetBase.js";
const CommentIndicator = (props) => /* @__PURE__ */ jsx("img", { alt: "", src: getAssetUrl("icons/comment-indicator.svg"), ...props });
const PLAIN_VALUE_CELL = "__impactPlainValueCell";
const isPlainValueRenderer = (colDef) => {
  var _a;
  return (colDef == null ? void 0 : colDef.cellRenderer) == null || (colDef == null ? void 0 : colDef.cellRenderer[PLAIN_VALUE_CELL]) === true || ((_a = colDef == null ? void 0 : colDef.extra) == null ? void 0 : _a.isPlainText);
};
const isTruncated = (element) => {
  if (!element) return false;
  return element.clientWidth < element.scrollWidth || element.clientHeight < element.scrollHeight;
};
const commentIconWrapperCache = /* @__PURE__ */ new WeakMap();
const undefinedRendererKey = { __undefinedRenderer: true };
const undefinedWrapperCache = /* @__PURE__ */ new Map();
const createCommentIconWrapper = (Renderer) => {
  const CommentIconCell = memo((props) => {
    var _a;
    const iconRef = useRef(null);
    const {
      handleCommentIconHover,
      handleMouseEnter,
      handleMouseLeave,
      popup: popupFromContext,
      popupRef,
      resolvedComments: resolvedCommentsFromContext,
      resolvedCommentsRef,
      getLatestUnresolvedThreadId,
      configuration,
      colIdentifierKey,
      comments: commentsFromContext,
      commentsRef
    } = props.context || {};
    const comments = (commentsRef == null ? void 0 : commentsRef.current) ?? commentsFromContext;
    const popup = (popupRef == null ? void 0 : popupRef.current) ?? popupFromContext;
    const resolvedComments = (resolvedCommentsRef == null ? void 0 : resolvedCommentsRef.current) ?? resolvedCommentsFromContext;
    const rowIdentifier = colIdentifierKey ? ((_a = props.data) == null ? void 0 : _a[colIdentifierKey]) || props.node.id : props.node.id;
    const baseCellId = `${rowIdentifier}__${props.column.getColId()}`;
    let effectiveCellId = baseCellId;
    if ((popup == null ? void 0 : popup.cellId) != baseCellId && !(configuration == null ? void 0 : configuration.disableMultiCommentThread)) {
      const baseResolved = Array.isArray(resolvedComments) ? resolvedComments.includes(baseCellId) : false;
      if (baseResolved) {
        const latestUnresolved = getLatestUnresolvedThreadId == null ? void 0 : getLatestUnresolvedThreadId(baseCellId);
        if (latestUnresolved) {
          effectiveCellId = latestUnresolved;
        } else {
          effectiveCellId = baseCellId;
        }
      }
    }
    const commentsArray = comments == null ? void 0 : comments[effectiveCellId];
    const hasComment = commentsArray && Array.isArray(commentsArray) && commentsArray.length > 0;
    const isPortalOpen = (popup == null ? void 0 : popup.cellId) === effectiveCellId;
    const displayValue = props.valueFormatted !== void 0 && props.valueFormatted !== null ? props.valueFormatted : props.value;
    const safeValue = displayValue !== null && typeof displayValue === "object" ? JSON.stringify(displayValue) : displayValue ?? "";
    const Content = Renderer ? /* @__PURE__ */ jsx(Renderer, { ...props }) : /* @__PURE__ */ jsx(Fragment, { children: safeValue });
    useEffect(() => {
      if (Renderer || typeof props.setTooltip !== "function" || safeValue === "") return;
      props.setTooltip(String(safeValue), () => {
        const cell = props.eParentOfValue ?? props.eGridCell;
        if (!cell) return false;
        const valueEl = cell.children.length === 0 ? cell : cell.querySelector(".ag-cell-value");
        return isTruncated(valueEl ?? cell);
      });
    });
    const isResolved = Array.isArray(resolvedComments) && resolvedComments.find((comment) => comment === effectiveCellId);
    const showBorder = hasComment && isPortalOpen;
    const showIcon = hasComment && !isResolved;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      showBorder && /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "1px solid #4259ee",
            boxSizing: "border-box",
            pointerEvents: "none",
            zIndex: 1
          }
        }
      ),
      Content,
      showIcon && /* @__PURE__ */ jsx(
        "div",
        {
          ref: iconRef,
          style: {
            position: "absolute",
            top: -18,
            right: 0,
            cursor: "pointer",
            zIndex: 2
          },
          title: `${commentsArray.length} comment${commentsArray.length > 1 ? "s" : ""}`,
          onMouseLeave: handleMouseLeave,
          onMouseOver: () => {
            handleMouseEnter == null ? void 0 : handleMouseEnter();
            handleCommentIconHover == null ? void 0 : handleCommentIconHover(props);
          },
          children: /* @__PURE__ */ jsx(CommentIndicator, {})
        }
      )
    ] });
  });
  CommentIconCell.displayName = `withCommentIcon(${(Renderer == null ? void 0 : Renderer.displayName) || (Renderer == null ? void 0 : Renderer.name) || "Cell"})`;
  CommentIconCell[PLAIN_VALUE_CELL] = !Renderer;
  return CommentIconCell;
};
const getCachedCommentIconWrapper = (Renderer) => {
  if (Renderer == null) {
    if (!undefinedWrapperCache.has(undefinedRendererKey)) {
      undefinedWrapperCache.set(undefinedRendererKey, createCommentIconWrapper(void 0));
    }
    return undefinedWrapperCache.get(undefinedRendererKey);
  }
  if (typeof Renderer !== "function") {
    return Renderer;
  }
  let cached = commentIconWrapperCache.get(Renderer);
  if (!cached) {
    cached = createCommentIconWrapper(Renderer);
    commentIconWrapperCache.set(Renderer, cached);
  }
  return cached;
};
export {
  getCachedCommentIconWrapper,
  isPlainValueRenderer
};
