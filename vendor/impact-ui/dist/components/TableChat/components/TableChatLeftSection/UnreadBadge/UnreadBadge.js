import { jsx } from "react/jsx-runtime";
const UnreadBadge = ({
  count,
  maxCount = 99,
  className = "unread-badge",
  showZero = false
}) => {
  if (!showZero && (!count || count <= 0)) {
    return null;
  }
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  return /* @__PURE__ */ jsx("span", { className, children: displayCount });
};
export {
  UnreadBadge
};
