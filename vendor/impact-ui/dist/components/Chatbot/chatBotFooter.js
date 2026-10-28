import { jsx } from "react/jsx-runtime";
import "react";
function ChatBotFooter({ footerText }) {
  return /* @__PURE__ */ jsx("div", { className: "chatbot-component-footer", children: /* @__PURE__ */ jsx("span", { className: "chatbot-component-footer-text", children: footerText }) });
}
export {
  ChatBotFooter
};
