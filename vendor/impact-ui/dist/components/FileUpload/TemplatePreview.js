import { jsxs, jsx } from "react/jsx-runtime";
import { useTranslation } from "../../i18n/useTranslation.js";
const COLUMN_LETTERS = Array.from({ length: 9 }, (_, i) => String.fromCharCode(65 + i));
function formatCellLabel(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function TemplatePreview({ selectedColumns }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "ia-template-preview", "data-testid": "file-upload-template-preview", children: [
    /* @__PURE__ */ jsx("h3", { className: "ia-template-preview__title", children: t("fileUpload.templatePreview") }),
    /* @__PURE__ */ jsx("div", { className: "ia-template-preview__grid-wrapper", children: /* @__PURE__ */ jsxs("table", { className: "ia-template-preview__table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "ia-template-preview__row-header" }),
        COLUMN_LETTERS.map((letter) => /* @__PURE__ */ jsx("th", { className: "ia-template-preview__col-header", children: letter }, letter))
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "ia-template-preview__row-header", children: "1" }),
          COLUMN_LETTERS.map((_, i) => /* @__PURE__ */ jsx("td", { className: "ia-template-preview__cell", children: selectedColumns[i] ? /* @__PURE__ */ jsx("div", { className: "ia-template-preview__cell-value", children: formatCellLabel(selectedColumns[i] ?? "") }) : null }, i))
        ] }),
        [2, 3].map((row) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "ia-template-preview__row-header", children: row }),
          COLUMN_LETTERS.map((_, i) => /* @__PURE__ */ jsx("td", { className: "ia-template-preview__cell" }, i))
        ] }, row))
      ] })
    ] }) })
  ] });
}
TemplatePreview.displayName = "TemplatePreview";
export {
  TemplatePreview
};
