import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default from "react";
import { useTranslation } from "../../../../../i18n/useTranslation.js";
import Box from "../../../../../node_modules/@mui/material/Box/Box.js";
import Typography from "../../../../../node_modules/@mui/material/Typography/Typography.js";
import IconButton from "../../../../../node_modules/@mui/material/IconButton/IconButton.js";
import DownloadIcon from "../../../../../node_modules/@mui/icons-material/esm/FileDownload.js";
import ReplayIcon from "../../../../../node_modules/@mui/icons-material/esm/Replay.js";
import ClearIcon from "../../../../../node_modules/@mui/icons-material/esm/HighlightOff.js";
import CloseIcon from "../../../../../node_modules/@mui/icons-material/esm/Close.js";
import CircularProgress from "../../../../../node_modules/@mui/material/CircularProgress/CircularProgress.js";
const scssStyles = `
.file-uploader-container {
  display: flex;
  align-items: center;
  position: relative;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin: 2px 0;
  max-width: 300px;
}

.file-uploader-container.error {
  border: 1px solid #f44336;
}

.file-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.file-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.file-size {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message {
  font-size: 12px;
  color: #f44336;
  margin-top: 4px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}
`;
const injectStyles = () => {
  if (!document.getElementById("file-uploader-styles")) {
    const style = document.createElement("style");
    style.id = "file-uploader-styles";
    style.innerHTML = scssStyles;
    document.head.appendChild(style);
  }
};
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
const FileUploader = ({
  file,
  fileUrl,
  isLoading,
  isError,
  errorMessage,
  onClear,
  onRetry,
  onDownload
}) => {
  const { t } = useTranslation();
  const resolvedErrorMessage = errorMessage ?? t("tableChat.fileUploader.uploadFailed");
  React__default.useEffect(() => {
    injectStyles();
  }, []);
  const handleDownload = () => {
    if (fileUrl && onDownload) {
      onDownload(fileUrl, file.name);
    }
  };
  if (!file && !isLoading && !isError) return null;
  return /* @__PURE__ */ jsxs(Box, { className: `file-uploader-container ${isError ? "error" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "file-info", children: [
      /* @__PURE__ */ jsx(Typography, { className: "file-name", title: file == null ? void 0 : file.name, children: (file == null ? void 0 : file.name) || t("tableChat.fileUploader.unknownFile") }),
      file && /* @__PURE__ */ jsx(Typography, { className: "file-size", children: formatFileSize(file.size) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "action-buttons", children: [
      fileUrl && !isLoading && !isError && /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "small",
          title: t("tableChat.fileUploader.downloadFile"),
          onClick: handleDownload,
          children: /* @__PURE__ */ jsx(DownloadIcon, { sx: { fontSize: 20 } })
        }
      ),
      isError ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "small",
            title: t("tableChat.fileUploader.retryUpload"),
            onClick: onRetry,
            children: /* @__PURE__ */ jsx(ReplayIcon, { sx: { fontSize: 20 } })
          }
        ),
        /* @__PURE__ */ jsx(IconButton, { size: "small", title: t("common.clear"), onClick: onClear, children: /* @__PURE__ */ jsx(ClearIcon, { sx: { fontSize: 20 } }) })
      ] }) : /* @__PURE__ */ jsx(IconButton, { size: "small", title: t("tableChat.fileUploader.removeFile"), onClick: onClear, children: /* @__PURE__ */ jsx(CloseIcon, { sx: { fontSize: 20 } }) })
    ] }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "loading-overlay", children: /* @__PURE__ */ jsx(CircularProgress, { size: 20 }) }),
    isError && /* @__PURE__ */ jsx(Typography, { className: "error-message", children: resolvedErrorMessage })
  ] });
};
export {
  FileUploader as default
};
