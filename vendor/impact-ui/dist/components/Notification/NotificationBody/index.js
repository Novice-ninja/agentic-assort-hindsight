import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import default_1 from "../../../node_modules/@mui/icons-material/SettingsOutlined.js";
import { NotificationPanelContent } from "./NotificationPanelContent.js";
import { Button } from "../../Button/index.js";
import { Tabs } from "../../Tabs/index.js";
import { useTranslation } from "../../../i18n/useTranslation.js";
function NotificationBody({
  expand = false,
  notificationTabs,
  notificationPanels,
  onSettingButtonClick,
  handleTabChange,
  activeNotiTab,
  renderPanel,
  ...panelProps
}) {
  var _a;
  const { t } = useTranslation();
  const tabs = notificationTabs.length > 0 ? notificationTabs : [{ label: t("notification.tabAll"), value: "all" }];
  const panels = notificationPanels.length > 0 ? notificationPanels : [{ id: 0, value: "all" }];
  const [activeTab, setActiveTab] = useState(((_a = tabs[0]) == null ? void 0 : _a.value) ?? "");
  const selectedValue = activeNotiTab != null && activeNotiTab !== "" ? activeNotiTab : activeTab;
  const onChangeTab = useCallback(
    (_event, newValue) => {
      const val = typeof newValue === "number" ? String(newValue) : newValue;
      handleTabChange == null ? void 0 : handleTabChange(val);
      setActiveTab(val);
    },
    [handleTabChange]
  );
  const renderPanelContent = (item, index) => {
    if (renderPanel) {
      return renderPanel(item, index);
    }
    return /* @__PURE__ */ jsx(
      NotificationPanelContent,
      {
        expand,
        notificationPanels: panels,
        notificationTabs: tabs,
        panel: item,
        ...panelProps
      },
      item.value
    );
  };
  const tabPanels = panels.map((item, index) => renderPanelContent(item, index));
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `impact-notification-body-container ${expand ? "notification-body-container-full" : ""}`,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `impact-notification-body-header-container ${expand ? "body-header-container-full" : ""}`,
          children: [
            /* @__PURE__ */ jsx(
              Tabs,
              {
                tabNames: tabs,
                tabPanels,
                value: selectedValue,
                onChange: onChangeTab
              }
            ),
            onSettingButtonClick != null && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "impact-notification-separator" }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  icon: /* @__PURE__ */ jsx(default_1, {}),
                  size: "medium",
                  variant: "text",
                  onClick: onSettingButtonClick,
                  children: t("notification.settingAndHelp")
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
NotificationBody.displayName = "NotificationBody";
export {
  NotificationBody
};
