!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.MuiChip-root.impact-tag{border:1px solid #b3bdf8;color:#60697d}.MuiChip-root.impact-tag:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.MuiChip-root.impact-tag:focus:not(:focus-visible){box-shadow:none;outline:none}.MuiChip-root.impact-tag.Mui-focusVisible{background:#eceefd}.MuiChip-root.impact-tag .MuiSvgIcon-root{color:#60697d;margin-left:10px;margin-right:-9px;width:16px}.MuiChip-root.impact-tag .MuiChip-deleteIcon{background-position:50%;background-size:16px;margin-left:-5px;margin-right:10px}.MuiChip-root.impact-tag-solid{background:#eceefd;border:none;border-radius:8px;color:#1f2b4d}.MuiChip-root.impact-tag-solid:hover{background:#eceefd}.MuiChip-root.impact-tag:hover{background:#fff;border:1px solid #b3bdf8;box-shadow:0 0 4px #0000001f}.MuiChip-root.impact-tag.MuiChip-outlined{background-color:#fff;border:1px solid #b3bdf8}.impact-tag-large{height:32px!important}.impact-tag-large .MuiChip-label{font-size:14px;font-weight:500;line-height:18px}.impact-tag-medium{height:24px!important}.impact-tag-medium .MuiChip-label{font-size:14px;line-height:20px}.impact-tag-small{height:22px!important}.impact-tag-small .MuiChip-label{font-size:12px;line-height:15px}.active_tags{background:#ff0}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import FilledTags from "./filled.js";
import SolidTags from "./solid.js";
import StrokeTags from "./stroke.js";

const Tag = forwardRef((props, ref) => {
  const {
    label,
    size = "large",
    variant = "filled",
    icon,
    onClick,
    isRemovable = false,
    onDelete,
    ...rest
  } = props;
  const commonProps = {
    label,
    size,
    icon,
    onClick,
    isRemovable,
    onDelete,
    ...rest,
    ref
  };
  if (variant === "stroke") {
    return /* @__PURE__ */ jsx(StrokeTags, { ...commonProps });
  }
  if (variant === "solid") {
    return /* @__PURE__ */ jsx(SolidTags, { ...commonProps });
  }
  return /* @__PURE__ */ jsx(FilledTags, { ...commonProps });
});
Tag.displayName = "Tag";
export {
  Tag
};
