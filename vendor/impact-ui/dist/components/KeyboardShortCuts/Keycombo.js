import { jsxs, jsx } from "react/jsx-runtime";
import { isMac } from "../../utils/shortcuts/platform.js";
const Keys = ({
  firstSymbol,
  firstText,
  middleSymbol,
  middleText,
  secondText
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "keys", children: [
    /* @__PURE__ */ jsx("div", { className: "button-outer", children: /* @__PURE__ */ jsxs("div", { className: `button-inner ${!isMac ? "windows-key" : ""}`, children: [
      firstSymbol && /* @__PURE__ */ jsx("span", { className: "key-symbol", children: firstSymbol }),
      /* @__PURE__ */ jsx("span", { className: "key-text", children: firstText })
    ] }) }),
    middleText && /* @__PURE__ */ jsx("div", { className: "button-outer", children: /* @__PURE__ */ jsxs("div", { className: `button-inner ${!isMac ? "windows-key" : ""}`, children: [
      middleSymbol && /* @__PURE__ */ jsx("span", { className: "key-symbol", children: middleSymbol }),
      /* @__PURE__ */ jsx("span", { className: "key-text", children: middleText })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "button-outer single-key", children: /* @__PURE__ */ jsx("div", { className: "button-inner", children: /* @__PURE__ */ jsx("span", { className: "key-text", children: secondText }) }) })
  ] });
};
const KeyCombo = ({ firstSymbol, firstText, secondText, description }) => {
  return /* @__PURE__ */ jsxs("div", { className: "keycombo-container-wrapper", children: [
    /* @__PURE__ */ jsx("div", { className: "keycombo-container", children: /* @__PURE__ */ jsx(Keys, { firstSymbol, firstText, secondText }) }),
    /* @__PURE__ */ jsx("div", { className: "keycombo-description", children: description })
  ] });
};
export {
  KeyCombo,
  Keys
};
