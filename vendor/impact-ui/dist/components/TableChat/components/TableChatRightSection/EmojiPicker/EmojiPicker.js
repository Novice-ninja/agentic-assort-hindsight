import { jsx } from "react/jsx-runtime";
import EmojiPicker from "emoji-picker-react";
import Popover from "../../../../../node_modules/@mui/material/Popover/Popover.js";
const TableChatEmojiPicker = ({ open, onClose, onEmojiClick, anchorEl }) => {
  const handleEmojiClick = (emojiObject) => {
    onEmojiClick == null ? void 0 : onEmojiClick(emojiObject.emoji);
  };
  return /* @__PURE__ */ jsx(
    Popover,
    {
      anchorEl,
      anchorOrigin: {
        vertical: "top",
        horizontal: "left"
      },
      open,
      transformOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      onClose,
      children: /* @__PURE__ */ jsx("div", { style: { padding: "8px" }, children: /* @__PURE__ */ jsx(EmojiPicker, { height: 400, width: 350, onEmojiClick: handleEmojiClick }) })
    }
  );
};
export {
  TableChatEmojiPicker as default
};
