import { jsxs, jsx } from "react/jsx-runtime";
import { isMac } from "../../utils/shortcuts/platform.js";
import { KeyCombo } from "./Keycombo.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const Screen2 = ({ videoSrc }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "screen2-container", children: [
    videoSrc && /* @__PURE__ */ jsx("video", { autoPlay: true, loop: true, muted: true, playsInline: true, className: "screen-video", src: videoSrc }),
    /* @__PURE__ */ jsx(
      KeyCombo,
      {
        description: t("keyboardShortcuts.screen2.description"),
        firstSymbol: isMac ? "⌥" : null,
        firstText: isMac ? t("keyboardShortcuts.key.option") : t("keyboardShortcuts.key.alt"),
        secondText: "F"
      }
    )
  ] });
};
export {
  Screen2
};
