import { jsxs, jsx } from "react/jsx-runtime";
import { useTranslation } from "../../i18n/useTranslation.js";
function NotificationHeader({
  title,
  expand,
  setExpand,
  toggleDrawer,
  anchor
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "impact-notification-header", children: [
    /* @__PURE__ */ jsx("div", { className: "impact-notification-heading", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "impact-notification-header-action-btns", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": expand ? t("notification.collapseAria") : t("notification.expandAria"),
          className: `impact-notification-header-expand-btn ${expand ? "collapse-icon" : "expand-icon"}`,
          type: "button",
          onClick: () => {
            setExpand(!expand);
          }
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "impact-notification-separator" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": t("common.close"),
          className: "impact-notification-header-close-btn",
          type: "button",
          onClick: toggleDrawer(anchor, false)
        }
      )
    ] })
  ] });
}
NotificationHeader.displayName = "NotificationHeader";
export {
  NotificationHeader
};
