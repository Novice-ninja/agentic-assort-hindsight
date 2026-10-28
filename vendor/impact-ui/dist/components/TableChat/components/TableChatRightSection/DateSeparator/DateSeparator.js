!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".date-separator{align-items:center;background-color:#fff;display:flex;justify-content:center;left:220px;margin:12px 0;padding:4px 8px 4px 0;position:sticky;top:-10px;transition:opacity .3s ease;width:140px;z-index:999}.date-separator .impact_badges_only_label_stroke{background:linear-gradient(90deg,#f5f5f5 6%,#f5f5f500 120%),#fff;border:1px solid #d9dde7}.date-separator .MuiChip-label,.date-separator .date-text{color:#60697d!important;font-size:12px!important;font-weight:500!important;padding:4px 12px}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx } from "react/jsx-runtime";
import { Badge } from "../../../../Badge/index.js";

import { useTranslation } from "../../../../../i18n/useTranslation.js";
const DateSeparator = ({ date, className = "date-separator" }) => {
  const { t, locale } = useTranslation();
  const formatDate = (date2) => {
    if (!date2) return "";
    const today = /* @__PURE__ */ new Date();
    const msgDate = new Date(date2);
    if (isNaN(msgDate.getTime())) return "";
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const msgOnly = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
    const diffDays = (todayOnly - msgOnly) / (1e3 * 60 * 60 * 24);
    if (diffDays === 0) return t("tableChat.dateSeparator.today");
    if (diffDays === 1) return t("tableChat.dateSeparator.yesterday");
    return msgDate.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const label = formatDate(date);
  if (!label) return null;
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(Badge, { color: "default", label, size: "small", variant: "stroke" }) });
};
export {
  DateSeparator
};
