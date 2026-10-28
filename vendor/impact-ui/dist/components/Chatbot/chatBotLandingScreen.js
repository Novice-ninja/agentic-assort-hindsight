import { jsxs, jsx } from "react/jsx-runtime";
import default_1 from "../../node_modules/@mui/icons-material/Clear.js";
import { Button } from "../Button/index.js";
function ChatBotLandingScreen({ onClose, isFullWidth }) {
  return /* @__PURE__ */ jsxs("div", { className: "chatbot-landing-screen-container", children: [
    !isFullWidth && /* @__PURE__ */ jsx("div", { className: "chatbot-landing-screen-container-close-icon", children: /* @__PURE__ */ jsx(
      Button,
      {
        className: "chatbot-component-header-close-icon",
        icon: /* @__PURE__ */ jsx(default_1, {}),
        iconPlacement: "left",
        size: "large",
        type: "default",
        variant: "text",
        onClick: onClose,
        "aria-label": "Close Iris chat",
        title: "Close Iris chat"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "chatbot-landing-screen-container-circle-1" }),
    /* @__PURE__ */ jsx("div", { className: "chatbot-landing-screen-container-circle-2" })
  ] });
}
export {
  ChatBotLandingScreen as default
};
