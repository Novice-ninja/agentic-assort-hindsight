import { jsx, jsxs } from "react/jsx-runtime";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Tooltip } from "../Tooltip/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const LogOutIcon = getAssetUrl("icons/logout-icon.svg");
function SidebarActions({ open, handleLogOut }) {
  const { t } = useTranslation();
  const logoutLabel = t("sidebar.logout");
  const logoutRow = /* @__PURE__ */ jsxs(
    "div",
    {
      className: "impact-sidebar-actions-list-item logout-container",
      "data-item-type": "action",
      "data-item-value": "logout",
      "data-sidebar-item": "",
      role: "menuitem",
      tabIndex: 0,
      onClick: () => {
        handleLogOut == null ? void 0 : handleLogOut();
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleLogOut == null ? void 0 : handleLogOut();
        }
      },
      children: [
        /* @__PURE__ */ jsx("img", { alt: logoutLabel, className: "logout-container-img", src: LogOutIcon }),
        /* @__PURE__ */ jsx("div", { className: "impact-sidebar-actions-list-item-label", children: logoutLabel })
      ]
    }
  );
  if (open) {
    return logoutRow;
  }
  return /* @__PURE__ */ jsx(Tooltip, { orientation: "right", title: logoutLabel, variant: "tertiary", children: logoutRow });
}
SidebarActions.displayName = "SidebarActions";
export {
  SidebarActions
};
