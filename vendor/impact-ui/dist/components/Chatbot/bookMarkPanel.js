import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import default_1 from "../../node_modules/@mui/icons-material/Add.js";
import default_1$1 from "../../node_modules/@mui/icons-material/DragIndicator.js";
import default_1$2 from "../../node_modules/@mui/icons-material/MoreVert.js";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Button } from "../Button/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const BookMarkIcon = getAssetUrl("icons/bookmarkIcon.svg");
const CloseIcon = getAssetUrl("icons/close.svg");
function BookMarkPanel({
  preDefinedQuestions,
  addedByYouQuestions,
  onClose
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("preDefined");
  return /* @__PURE__ */ jsx("div", { className: "book-mark-panel-container-wrapper", children: /* @__PURE__ */ jsxs("div", { className: "book-mark-panel-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "book-mark-panel-header", children: [
      /* @__PURE__ */ jsxs("div", { className: "book-mark-panel-header-left", children: [
        /* @__PURE__ */ jsx("img", { alt: t("chatBot.bookmark.alt"), src: BookMarkIcon }),
        /* @__PURE__ */ jsx("span", { className: "book-mark-panel-header-left-title", children: t("chatBot.bookmark.title") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "book-mark-panel-header-right", children: [
        /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(default_1, {}), iconPlacement: "right", variant: "secondary", children: t("chatBot.bookmark.add") }),
        /* @__PURE__ */ jsx("img", { alt: t("chatBot.closeAlt"), src: CloseIcon, onClick: onClose })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "book-mark-panel-tabs-container", children: /* @__PURE__ */ jsxs("div", { className: "bookmark-tabs", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `bookmark-tab ${activeTab === "preDefined" ? "active" : ""}`,
          onClick: () => {
            setActiveTab("preDefined");
          },
          children: t("chatBot.bookmark.preDefined")
        }
      ),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `bookmark-tab ${activeTab === "addedByYou" ? "active" : ""}`,
          onClick: () => {
            setActiveTab("addedByYou");
          },
          children: t("chatBot.bookmark.addedByYou")
        }
      )
    ] }) }),
    activeTab === "preDefined" ? preDefinedQuestions == null ? void 0 : preDefinedQuestions.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "bookmark-panel-body", children: [
      /* @__PURE__ */ jsx("span", { className: "drag-handle", children: "⋮⋮" }),
      /* @__PURE__ */ jsx("span", { className: "bookmark-question-text", children: item.question }),
      /* @__PURE__ */ jsx("span", { className: "bookmark-menu", children: "⋮" })
    ] }, idx)) : addedByYouQuestions == null ? void 0 : addedByYouQuestions.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "bookmark-panel-body", children: [
      /* @__PURE__ */ jsx(default_1$1, { fontSize: "small" }),
      /* @__PURE__ */ jsx("span", { className: "bookmark-question-text", children: item.question }),
      /* @__PURE__ */ jsx(default_1$2, { fontSize: "small" })
    ] }, idx))
  ] }) });
}
export {
  BookMarkPanel
};
