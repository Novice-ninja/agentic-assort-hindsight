import { jsx } from "react/jsx-runtime";
import { Checkbox } from "../../../../Checkbox/index.js";
const ChannelCheckbox = ({
  checked = false,
  onChange,
  id,
  className = "channel-checkbox-input",
  disabled = false,
  handleChatSelect,
  selectedChat,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "channel-checkbox",
      onClick: (e) => {
        e.stopPropagation();
      },
      children: /* @__PURE__ */ jsx(
        Checkbox,
        {
          checked: selectedChat == null ? void 0 : selectedChat.includes(id),
          label: "",
          variant: "default",
          onChange: (e) => {
            e.stopPropagation();
            handleChatSelect(id);
          }
        }
      )
    }
  );
};
export {
  ChannelCheckbox
};
