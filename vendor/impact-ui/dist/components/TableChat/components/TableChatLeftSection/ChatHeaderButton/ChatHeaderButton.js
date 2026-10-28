import { jsx } from "react/jsx-runtime";
import default_1 from "../../../../../node_modules/@mui/icons-material/Add.js";
import { Button } from "../../../../Button/index.js";
import { useTranslation } from "../../../../../i18n/useTranslation.js";
const ChatHeaderButton = ({
  onClick,
  label,
  icon = /* @__PURE__ */ jsx(default_1, { fontSize: "small" }),
  variant = "contained",
  size = "large",
  className = "chat-button",
  type = "button",
  ...props
}) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(
    Button,
    {
      className,
      icon,
      size,
      variant,
      onClick,
      ...props,
      children: label ?? t("tableChat.chatButton.label")
    }
  );
};
export {
  ChatHeaderButton
};
