import { jsxs, jsx } from "react/jsx-runtime";
import { useTranslation } from "../../../../../i18n/useTranslation.js";
import Box from "../../../../../node_modules/@mui/material/Box/Box.js";
import CircularProgress from "../../../../../node_modules/@mui/material/CircularProgress/CircularProgress.js";
import IconButton from "../../../../../node_modules/@mui/material/IconButton/IconButton.js";
import ReplayIcon from "../../../../../node_modules/@mui/icons-material/esm/Replay.js";
import ClearIcon from "../../../../../node_modules/@mui/icons-material/esm/HighlightOff.js";
const scssStyles = `
.image-uploader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #f0f0f0;
  border: 1px solid transparent;
  transition: border-color 0.3s ease-in-out;
}

.image-uploader-container.error {
  border-color: #f44336; /* Red border on error */
}

.upload-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
}

.image-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.action-overlay {
  position: absolute;
  top: 0; 
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 16px;
  position: relative;

}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  z-index: 10;
}

.error-icons {
  display: flex;
  gap: 0px;
}
  .clear-icon-container{
    position: absolute;
    top: -8px;
    right: -8px;
  }
`;
const injectStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = scssStyles;
  document.head.appendChild(style);
};
injectStyles();
const ImageUploader = ({ image, isLoading, isError, handleClear, handleRetry }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs(Box, { className: `image-uploader-container ${isError ? "error" : ""}`, children: [
    (image || isLoading || isError) && /* @__PURE__ */ jsx(
      "img",
      {
        alt: t("tableChat.imageUploader.preview"),
        className: "image-preview",
        src: image || "https://placehold.co/200x200?text=Preview"
      }
    ),
    (isLoading || isError) && /* @__PURE__ */ jsxs(Box, { className: "action-overlay", children: [
      isLoading && /* @__PURE__ */ jsx(CircularProgress, { size: 20 }),
      isError && /* @__PURE__ */ jsxs(Box, { className: "error-icons", children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            "aria-label": t("tableChat.imageUploader.retryUpload"),
            color: "default",
            onClick: handleRetry,
            children: /* @__PURE__ */ jsx(ReplayIcon, { sx: { fontSize: 20 } })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "clear-icon-container", children: /* @__PURE__ */ jsx(
          IconButton,
          {
            "aria-label": t("tableChat.imageUploader.clearImage"),
            color: "default",
            onClick: handleClear,
            children: /* @__PURE__ */ jsx(ClearIcon, { sx: { fontSize: 20 } })
          }
        ) })
      ] })
    ] }),
    image && !isLoading && !isError && /* @__PURE__ */ jsx("div", { className: "clear-icon-container", children: /* @__PURE__ */ jsx(
      IconButton,
      {
        "aria-label": t("tableChat.imageUploader.clearImage"),
        color: "default",
        onClick: handleClear,
        children: /* @__PURE__ */ jsx(ClearIcon, { sx: { fontSize: 20 } })
      }
    ) })
  ] });
};
export {
  ImageUploader as default
};
