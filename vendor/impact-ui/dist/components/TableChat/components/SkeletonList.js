import { jsx } from "react/jsx-runtime";
import { Loader } from "../../Loader/index.js";
import { useTranslation } from "../../../i18n/useTranslation.js";
const SkeletonList = ({ count = 5, text }) => {
  const { t } = useTranslation();
  const resolvedText = text ?? t("common.loading");
  return /* @__PURE__ */ jsx("div", { className: "table-chat-right-section-container-empty loader-padding", children: [...Array(count)].map((_, i) => /* @__PURE__ */ jsx("div", { style: { marginBottom: 20 }, children: /* @__PURE__ */ jsx(Loader, { showSkeleton: true, progress: "100%", size: "large", text: resolvedText }) }, i)) });
};
export {
  SkeletonList
};
