!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-fileUpload-container{align-items:stretch;background-color:#fff;border-radius:16px;box-shadow:0 0 16px 2px #0000000f;display:flex;flex-direction:column;gap:16px;min-height:274px;padding:16px;width:550px}.ia-fileUpload-container .ia-fileUpload-heading{color:#0d152c;font-size:16px;font-weight:800;line-height:24px;text-align:left}.ia-fileUpload-container .ia-fileUpload-subHeading{color:#7a8294;font-size:14px;font-weight:500;line-height:20px;margin-top:2px;text-align:left}.ia-fileUpload-container .ia-fileUpload-container-header{align-items:center;display:flex;justify-content:space-between}.ia-fileUpload-container .ia-fileUpload-container-header .ia-fileUpload-container-header-title{display:flex;flex-direction:column;gap:2px}.ia-fileUpload-container .ia-fileUpload-container-header .ia-fileUpload-container-header-title .ia-fileUpload-container-header-title-primary{color:#0d152c;font-family:Manrope,sans-serif;font-size:16px;font-weight:800;line-height:24px}.ia-fileUpload-container .ia-fileUpload-container-header .ia-fileUpload-container-header-title .ia-fileUpload-container-header-title-secondary{color:#7a8294;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px}.ia-fileUpload-container .ia-fileUpload-container-header .ia-fileUpload-container-header-closeIcon{color:#60697d;cursor:pointer}.ia-fileUpload{align-items:center;background-color:initial;border:1px dashed #b3bdf8;border-radius:8px;display:flex;flex-direction:column;height:148px;justify-content:center;margin:auto;padding:24px 16px;position:relative;width:100%}.ia-fileUpload:before{background:var(--ia-file-upload-icon) no-repeat center/contain;content:"";display:block;flex-shrink:0;height:55px;width:55px}.ia-fileUpload .ia-fileUpload-hr{color:#7a8294;font-size:12px;font-weight:500;line-height:15px;text-align:center;width:25px}.ia-fileUpload .ia-fileUpload-hr:before{left:calc(50% - 100px)}.ia-fileUpload .ia-fileUpload-hr:after,.ia-fileUpload .ia-fileUpload-hr:before{background-color:#d9dde7;content:"";height:1px;position:absolute;top:112px;width:80px}.ia-fileUpload .ia-fileUpload-hr:after{right:calc(50% - 100px)}.ia-fileUpload input{height:calc(2px + 100%);left:-1px;opacity:0;position:absolute;top:-1px;width:calc(2px + 100%)}.ia-fileUpload .ia-fileUpload-label{color:#1f2b4d;font-size:14px;font-weight:500;line-height:20px;text-align:center}.ia-fileUpload.ia-fileUpload-error{border:1px solid #e15554;box-shadow:inset 0 0 20px #e155541f}.ia-fileUpload.ia-fileUpload-error .ia-fileUpload-label{color:#e15554}.ia-fileUpload.ia-fileUpload-disabled{opacity:.5;pointer-events:none}.ia-fileUpload.ia-fileUpload-dragOver{background:none;border:1px solid #4259ee;box-shadow:inset 0 0 96px 23px #4259ee24;justify-content:center}.ia-fileUpload.ia-fileUpload-dragOver:before{display:none}.ia-fileUpload.ia-fileUpload-dragOver .ia-fileUpload-dragOverLabel{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:700;line-height:21px}.ia-fileUpload.ia-fileUpload-dragOver button{border-color:#1849d6!important;color:#1849d6!important}.ia-fileUpload .ia-fileUpload-label-secondary{color:#7a8294;font-size:12px;font-weight:500;line-height:16px;text-align:center}.ia-fileUpload .ia-fileUpload-label-primary,.ia-fileUpload-validFileType{align-items:center;display:flex;gap:4px}.ia-fileUpload-validFileType{color:#60697d;font-size:14px;font-weight:500;height:16px;letter-spacing:.01em;line-height:16.1px}.ia-fileUpload-validFileType button:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-fileUpload-validFileType button:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-fileUpload-validFileType button:focus{outline:none!important}.ia-fileUpload-validFileType button[data-fileUpload=templateDownload]{padding:0}.ia-fileUpload-validFileType .ia-fileUpload-validFileType-container{position:relative}.ia-fileUpload-validFileType .ia-fileUpload-validFileType-container .ia-fileUpload-validFileType-arrow{cursor:pointer;height:11px;margin-top:2px;width:11px}.ia-fileUpload-validFileType .ia-fileUpload-validFileType-container .ia-fileUpload-validFileType-arrow.rotate{transform:rotate(180deg)}.ia-fileUpload-validFileType .ia-fileUpload-validFileType-menu{background-color:#fff;border-radius:8px;bottom:32px;box-shadow:0 0 4px #0000001f;display:flex;flex-direction:column;gap:5px;left:0;padding-bottom:16px;padding-top:16px;position:absolute;width:100px;z-index:99}.ia-fileUpload-validFileType .ia-fileUpload-validFileType-menu .ia-fileUpload-validFileType-menu-item{align-items:center;color:#1f2b4d;cursor:pointer;display:flex;font-size:14px;font-weight:500;height:25px;line-height:20px;padding-left:18px;text-align:left}.ia-fileUpload-validFileType .ia-fileUpload-validFileType-menu .ia-fileUpload-validFileType-menu-item:hover{background-color:#f5f6fa}.ia-fileUpload-previewItem{align-items:stretch;border:1px solid #e7e7e7;border-radius:12px;display:flex;flex-direction:column;gap:8px;justify-content:space-between;padding:16px}.ia-fileUpload-previewItem img{max-height:36px;max-width:36px}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress{display:flex;gap:8px;justify-content:space-between;z-index:99}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details{display:flex;gap:8px}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItemIcon{background-repeat:no-repeat;height:36px;width:36px}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItem-info{display:flex;flex-direction:column;gap:2px;justify-content:space-between}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItem-info .ia-fileUpload-previewItem-name{color:#0b0b0b;font-size:12px;font-weight:700;line-height:18px}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItem-info .ia-fileUpload-previewItem-name.ia-fileUpload-previewItem-name-failed{color:#7a8294}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItem-info .ia-fileUpload-previewItem-size{color:#6d6d6d;font-size:12px;font-weight:500;line-height:16px;text-align:left}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItem-info .ia-fileUpload-previewItem-size.uploadFailed{color:#e15554}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItem-info .ia-fileUpload-previewItem-size.uploading{color:#0000}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-details .ia-fileUpload-previewItem-info .ia-fileUpload-previewItem-size.disabled{color:#7a8294}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-actions{align-items:center;display:flex;gap:14px}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-actions .ia-fileUpload-previewItem-action{color:#4259ee;cursor:pointer}.ia-fileUpload-previewItem .ia-fileUpload-previewItem-exceptProgress .ia-fileUpload-previewItem-actions .ia-fileUpload-previewItem-action.removeIcon{color:#60697d}.ia-fileUpload-previewItem .ia-fileUpload-progress .progressbar_layout{margin:0}.ia-fileUpload-previewItem .ia-fileUpload-progress .progressbar_label_container{margin:-24px 0 8px}.ia-fileUpload-previewItem .ia-fileUpload-previewItem:hover .ia-fileUpload-previewItem-del{opacity:1}.ia-fileUpload-actions{display:flex;gap:16px;justify-content:flex-end}.ia-fileUpload-validFileType-menu .MuiPaper-root{min-width:226px}.ia-fileUpload-validFileType-menu .MuiPaper-root .ia-btn-icon{margin-bottom:0}.ia-template-preview{background-color:#e9e3f2;border-radius:8px;box-shadow:0 0 16px 2px #0000000f;padding:12px}.ia-template-preview .ia-template-preview__title{color:#0d152c;font-size:14px;font-weight:800;line-height:21px;margin:0 0 10px}.ia-template-preview .ia-template-preview__grid-wrapper{border:1px solid #d9dde7;border-radius:4px;overflow-x:auto}.ia-template-preview .ia-template-preview__table{background-color:#fff;border-collapse:collapse;table-layout:fixed;width:100%}.ia-template-preview .ia-template-preview__table td,.ia-template-preview .ia-template-preview__table th{border:1px solid #d9dde7;font-size:12px;line-height:20px;padding:0;text-align:center}.ia-template-preview .ia-template-preview__col-header,.ia-template-preview .ia-template-preview__row-header{background-color:#f3f4f6;color:#6b7280;font-size:12px;font-weight:500}.ia-template-preview .ia-template-preview__row-header{max-width:28px;min-width:28px!important;width:28px}.ia-template-preview .ia-template-preview__cell{background-color:#fff}.ia-template-preview .ia-template-preview__cell-value{color:#0d152c;font-size:12px;font-weight:600;overflow:hidden;padding-inline:2px;text-overflow:ellipsis;white-space:nowrap}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import default_1 from "../../node_modules/@mui/icons-material/Clear.js";
import { Button } from "../Button/index.js";
import { Menu } from "../Menu/index.js";
import { ProgressBar } from "../ProgressBar/index.js";
import { FILE_TYPE_MIME_MAP, SIZE_CONVENTIONS } from "./FileUpload.types.js";
import { loadFileUploadAssets } from "./fileUploadAssets.loader.js";
import { TemplatePreview } from "./TemplatePreview.js";
import { useFileUploadTemplateState } from "./useFileUploadTemplateState.js";

import { useTranslation } from "../../i18n/useTranslation.js";
function FileUpload({
  fileList,
  onFileListChange,
  disabled = false,
  numberOfFiles: numFiles = 1,
  validFileTypes = [
    { fileType: "xlsx", templateDownloader: void 0, typeOverride: false },
    { fileType: "csv", templateDownloader: void 0, typeOverride: false }
  ],
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryButtonClick,
  primaryButtonProps,
  onSecondaryButtonClick,
  secondaryButtonProps,
  onClose,
  customFailedActionButton,
  options: templateColumnOptions,
  selectedValues: templateColumnSelections,
  onMenuPrimaryButtonClick: onTemplateMenuPrimaryClick,
  onTertiaryButtonClick: onTemplateMenuTertiaryClick,
  showHeader = true,
  headerTitle,
  headerSubtitle,
  showCloseIcon = true,
  width,
  height,
  className,
  id,
  "data-testid": dataTestId,
  "aria-label": ariaLabel,
  role = "region"
}) {
  var _a;
  const { t } = useTranslation();
  const resolvedHeaderTitle = headerTitle ?? t("fileUpload.headerTitle");
  const resolvedAriaLabel = ariaLabel ?? t("fileUpload.ariaLabel");
  const wrapperRef = useRef(null);
  const fileUploadRef = useRef(null);
  const hiddenFileUploadRef = useRef(null);
  const containerRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [showDownLoadMenu, setShowDownLoadMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const numberOfFiles = numFiles >= 1 ? Math.floor(numFiles) : 1;
  const uploadSubtitle = headerSubtitle ?? t(numberOfFiles > 1 ? "fileUpload.subtitleMany" : "fileUpload.subtitleOne", {
    count: numberOfFiles
  });
  const {
    selected,
    hasTemplateOptions,
    menuOptions,
    handleMenuSelectionChange,
    handleMenuPrimaryClick,
    handleMenuTertiaryClick
  } = useFileUploadTemplateState({
    options: templateColumnOptions,
    selectedValues: templateColumnSelections,
    onMenuPrimaryButtonClick: onTemplateMenuPrimaryClick,
    onTertiaryButtonClick: onTemplateMenuTertiaryClick
  });
  const activateOnEnterOrSpace = useCallback(
    (handler) => (e) => {
      if (!handler) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler(e);
      }
    },
    []
  );
  const [assets, setAssets] = useState(null);
  useEffect(() => {
    void loadFileUploadAssets().then(setAssets);
  }, []);
  const getPreviewIconUrl = useCallback(
    (key, failed) => {
      if (!key || !assets) return void 0;
      if (failed) {
        if (key === "csv") return assets.failedCsvIconUrl;
        if (key === "xls" || key === "xlsx") return assets.failedExcelIconUrl;
        return void 0;
      }
      if (key === "csv") return assets.csvIconUrl;
      if (key === "xls" || key === "xlsx") return assets.excelIconUrl;
      if (key === "text") return assets.textIconUrl;
      return void 0;
    },
    [assets]
  );
  const currentFileType = useMemo(() => {
    return validFileTypes.flatMap((f) => FILE_TYPE_MIME_MAP[f.fileType] ?? []).join(",");
  }, [validFileTypes]);
  const onDragEnter = useCallback(() => {
    var _a2;
    setIsDraggedOver(true);
    (_a2 = wrapperRef.current) == null ? void 0 : _a2.classList.add("ia-fileUpload-dragOver");
  }, []);
  const onDragLeave = useCallback(() => {
    var _a2;
    setIsDraggedOver(false);
    (_a2 = wrapperRef.current) == null ? void 0 : _a2.classList.remove("ia-fileUpload-dragOver");
  }, []);
  const onFileDrop = useCallback(
    (e, isDragEvent = false) => {
      const newFiles = isDragEvent ? e.dataTransfer.files : e.target.files;
      if (!newFiles || newFiles.length === 0) return;
      const filesToAdd = [];
      const maxFilesToAdd = numberOfFiles - fileList.length;
      for (let i = 0; i < Math.min(newFiles.length, maxFilesToAdd); i++) {
        const newFile = newFiles[i];
        if (!newFile) continue;
        const isValid = validFileTypes.some(
          (vft) => vft.typeOverride ? vft.fileType === newFile.type : (FILE_TYPE_MIME_MAP[vft.fileType] ?? []).includes(newFile.type)
        );
        if (!isValid) {
          setIsError(true);
          continue;
        }
        const exists = fileList.some((f) => f.file.name === newFile.name && f.file.size === newFile.size) || filesToAdd.some((f) => f.file.name === newFile.name && f.file.size === newFile.size);
        if (exists) continue;
        filesToAdd.push({
          file: newFile,
          progress: 0,
          isUploadRunning: false,
          failed: false
        });
      }
      if (filesToAdd.length > 0) {
        setIsError(false);
        onFileListChange([...fileList, ...filesToAdd]);
      }
    },
    [fileList, numberOfFiles, validFileTypes, onFileListChange]
  );
  const onDrop = useCallback(
    (e) => {
      var _a2;
      e.preventDefault();
      e.stopPropagation();
      setIsDraggedOver(false);
      (_a2 = wrapperRef.current) == null ? void 0 : _a2.classList.remove("ia-fileUpload-dragOver");
      onFileDrop(e, true);
    },
    [onFileDrop]
  );
  const fileRemove = useCallback(
    (file) => {
      const idx = fileList.indexOf(file);
      if (idx === -1) return;
      const updated = [...fileList];
      updated.splice(idx, 1);
      onFileListChange(updated);
    },
    [fileList, onFileListChange]
  );
  const onUploadClick = useCallback(() => {
    var _a2;
    (_a2 = hiddenFileUploadRef.current) == null ? void 0 : _a2.click();
  }, []);
  const templateDownloader = useMemo(() => {
    if (!Array.isArray(validFileTypes)) return null;
    return validFileTypes.find((vft) => vft.templateDownloader) ?? null;
  }, [validFileTypes]);
  const selectedFileType = useMemo(() => {
    var _a2, _b;
    return ((_a2 = validFileTypes.find((vft) => vft.fileType === "xlsx")) == null ? void 0 : _a2.fileType) ?? ((_b = validFileTypes[0]) == null ? void 0 : _b.fileType) ?? "xlsx";
  }, [validFileTypes]);
  const tertiaryFileType = useMemo(() => {
    var _a2;
    return (_a2 = validFileTypes.find((vft) => vft.fileType !== "xlsx")) == null ? void 0 : _a2.fileType;
  }, [validFileTypes]);
  const handleMenuClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleTemplateDownloadMenu = useCallback(() => {
    setShowDownLoadMenu((prev) => !prev);
  }, []);
  const handleClickOutside = useCallback((event) => {
    const target = event.target;
    if (!target.closest(".ia-fileUpload-validFileType-container") && !target.closest(".ia-fileUpload-validFileType-menu-item")) {
      setShowDownLoadMenu(false);
      setIsOpen(false);
    }
  }, []);
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowDownLoadMenu(false);
      }
    };
    if (showDownLoadMenu) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDownLoadMenu, handleClickOutside]);
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      "aria-label": resolvedAriaLabel,
      className: `ia-fileUpload-container ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      id,
      role,
      style: { width },
      children: [
        showHeader && /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-container-header", children: [
          /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-container-header-title", children: [
            resolvedHeaderTitle && /* @__PURE__ */ jsx("span", { className: "ia-fileUpload-container-header-title-primary", children: resolvedHeaderTitle }),
            uploadSubtitle && /* @__PURE__ */ jsx("span", { className: "ia-fileUpload-container-header-title-secondary", children: uploadSubtitle })
          ] }),
          showCloseIcon && onClose && /* @__PURE__ */ jsx(
            default_1,
            {
              "aria-label": t("fileUpload.closeAria"),
              className: "ia-fileUpload-container-header-closeIcon",
              role: "button",
              tabIndex: 0,
              onClick: onClose,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onClose();
                }
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: hiddenFileUploadRef,
            accept: currentFileType,
            multiple: numberOfFiles > 1,
            style: { display: "none" },
            type: "file",
            value: "",
            onChange: onFileDrop
          }
        ),
        fileList.length >= numberOfFiles ? null : /* @__PURE__ */ jsx(
          "div",
          {
            ref: wrapperRef,
            className: `ia-styles ia-fileUpload ${isError ? "ia-fileUpload-error" : ""} ${disabled ? "ia-fileUpload-disabled" : ""}`,
            role: "button",
            style: {
              height,
              ...assets && !isDraggedOver ? {
                ["--ia-file-upload-icon"]: `url(${isError ? assets.fileUploadErrorBgUrl : assets.fileUploadBgUrl})`
              } : {}
            },
            tabIndex: 0,
            onClick: (e) => {
              e.preventDefault();
            },
            onDragEnter,
            onDragLeave,
            onDragOver: (e) => {
              e.preventDefault();
            },
            onDrop,
            onKeyDown: (e) => {
              e.preventDefault();
            },
            children: isDraggedOver ? /* @__PURE__ */ jsx("div", { className: "ia-fileUpload-dragOverLabel", children: t("fileUpload.dragInProgress") }) : /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-label", children: [
              /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-label-primary", children: [
                isError ? t("fileUpload.typeNotSupported") : /* @__PURE__ */ jsx("p", { className: "ia-fileUpload-label", children: t("fileUpload.dragLabel") }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: fileUploadRef,
                    accept: currentFileType,
                    "aria-hidden": "true",
                    multiple: numberOfFiles > 1,
                    tabIndex: -1,
                    title: (_a = fileList[0]) == null ? void 0 : _a.file.name,
                    type: "file",
                    value: "",
                    onChange: onFileDrop
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    "data-testid": "file-upload-choose-btn",
                    disabled: isDraggedOver,
                    variant: "url",
                    onClick: onUploadClick,
                    onDragEnter,
                    children: t("fileUpload.chooseFile")
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "ia-fileUpload-label-secondary", children: t(
                validFileTypes.length > 1 ? "fileUpload.supportsMany" : "fileUpload.supportsOne",
                {
                  types: validFileTypes.map((vft) => `.${vft.fileType}`).join(", ")
                }
              ) })
            ] })
          }
        ),
        templateDownloader ? /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-validFileType", children: [
          /* @__PURE__ */ jsx("p", { className: "ia-fileUpload-label-secondary", children: t("fileUpload.simplifyUpload") }),
          " ",
          /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-validFileType-container", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                "aria-expanded": validFileTypes.length > 1 || templateColumnOptions ? showDownLoadMenu || isOpen : void 0,
                "aria-haspopup": validFileTypes.length > 1 || templateColumnOptions ? "menu" : void 0,
                "aria-label": t("fileUpload.downloadTemplateAria"),
                role: "button",
                style: { display: "flex", alignItems: "center", gap: "4px" },
                tabIndex: 0,
                onClick: (e) => {
                  var _a2;
                  setIsOpen(true);
                  setAnchorEl(e.currentTarget);
                  if (validFileTypes.length > 1 || templateColumnOptions) {
                    handleTemplateDownloadMenu();
                  } else {
                    (_a2 = templateDownloader.templateDownloader) == null ? void 0 : _a2.call(templateDownloader);
                  }
                },
                onKeyDown: (e) => {
                  var _a2;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (validFileTypes.length > 1 || templateColumnOptions) {
                      handleTemplateDownloadMenu();
                    } else {
                      (_a2 = templateDownloader.templateDownloader) == null ? void 0 : _a2.call(templateDownloader);
                    }
                  }
                },
                children: [
                  /* @__PURE__ */ jsx(Button, { "data-fileUpload": "templateDownload", tabIndex: -1, variant: "url", children: t("fileUpload.downloadTemplate") }),
                  assets && /* @__PURE__ */ jsx(
                    "img",
                    {
                      alt: "",
                      "aria-hidden": "true",
                      className: `ia-fileUpload-validFileType-arrow ${(validFileTypes.length > 1 || templateColumnOptions) && showDownLoadMenu ? "rotate" : ""}`,
                      src: validFileTypes.length > 1 || templateColumnOptions ? assets.downArrow : assets.uploadDownloadIcon
                    }
                  ),
                  templateColumnOptions && isOpen && /* @__PURE__ */ jsx(
                    Menu,
                    {
                      withActionButtons: true,
                      withCheckbox: true,
                      anchorEl,
                      customHeaderProps: {
                        onSelectionChange: handleMenuSelectionChange,
                        selectedItems: selected
                      },
                      iconPlacement: "left",
                      menuContainerClassName: "ia-fileUpload-validFileType-menu",
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "left"
                        },
                        transformOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        }
                      },
                      open: isOpen,
                      options: menuOptions,
                      primaryButtonProps: {
                        label: selectedFileType,
                        icon: assets ? /* @__PURE__ */ jsx("img", { alt: "", src: assets.uploadDownloadIcon }) : void 0
                      },
                      tertiaryButtonLabel: tertiaryFileType,
                      tertiaryButtonProps: {
                        icon: assets ? /* @__PURE__ */ jsx("img", { alt: "", src: assets.uploadDownloadIcon }) : void 0
                      },
                      onClose: handleMenuClose,
                      onPrimaryButtonClick: () => {
                        handleMenuPrimaryClick(selectedFileType);
                      },
                      onTertiaryButtonClick: handleMenuTertiaryClick
                    }
                  )
                ]
              }
            ),
            showDownLoadMenu && !templateColumnOptions && /* @__PURE__ */ jsx("div", { className: "ia-fileUpload-validFileType-menu", role: "menu", children: validFileTypes.map((vft) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "ia-fileUpload-validFileType-menu-item",
                role: "menuitem",
                tabIndex: 0,
                onClick: () => {
                  var _a2;
                  (_a2 = vft.templateDownloader) == null ? void 0 : _a2.call(vft);
                  setShowDownLoadMenu(false);
                },
                onKeyDown: (e) => {
                  var _a2;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    (_a2 = vft.templateDownloader) == null ? void 0 : _a2.call(vft);
                    setShowDownLoadMenu(false);
                  }
                },
                children: `.${vft.fileType}`
              },
              vft.fileType
            )) })
          ] })
        ] }) : null,
        hasTemplateOptions && templateDownloader ? /* @__PURE__ */ jsx(TemplatePreview, { selectedColumns: selected }) : null,
        fileList.map((item) => {
          let fileSize = item.file.size;
          let i = 0;
          while (fileSize > 1024) {
            fileSize = fileSize / 1024;
            i += 1;
          }
          const iconKey = Object.keys(FILE_TYPE_MIME_MAP).find(
            (key) => (FILE_TYPE_MIME_MAP[key] ?? []).includes(item.file.type)
          );
          return /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-previewItem", children: [
            /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-previewItem-exceptProgress", children: [
              /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-previewItem-details", children: [
                !item.isUploadRunning && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `ia-fileUpload-previewItemIcon ${item.failed ?? item.disabled ? "ia-fileUpload-previewItemIcon-failed" : ""} ${iconKey ?? ""}`,
                    style: {
                      backgroundImage: (() => {
                        const url = getPreviewIconUrl(iconKey, item.failed ?? false);
                        return url ? `url(${url})` : void 0;
                      })()
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-previewItem-info", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `ia-fileUpload-previewItem-name ${item.failed ?? item.disabled ? "ia-fileUpload-previewItem-name-failed" : ""}`,
                      children: item.file.name
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `ia-fileUpload-previewItem-size ${item.failed ? "uploadFailed" : ""} ${item.isUploadRunning ? "uploading" : ""} ${item.disabled ? "disabled" : ""}`,
                      children: item.failed ? item.failedMessage ?? t("fileUpload.uploadFailed") : `${fileSize.toFixed(0)}${SIZE_CONVENTIONS[i]}`
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `ia-fileUpload-previewItem-actions ${item.failed ?? item.disabled ? "ia-fileUpload-previewItem-actions-failed" : ""}`,
                  children: item.failed ? item.failedMessage ? customFailedActionButton : /* @__PURE__ */ jsxs(Fragment, { children: [
                    assets && /* @__PURE__ */ jsx(
                      "img",
                      {
                        alt: t("fileUpload.remove"),
                        "aria-label": t("fileUpload.removeAria", { name: item.file.name }),
                        className: "ia-fileUpload-previewItem-action removeIcon",
                        role: "button",
                        src: assets.fileUploadDownloadIcon,
                        style: item.disabled ? { opacity: 0.5, pointerEvents: "none" } : void 0,
                        tabIndex: item.disabled ? -1 : 0,
                        onClick: () => {
                          fileRemove(item);
                        },
                        onKeyDown: activateOnEnterOrSpace(() => {
                          fileRemove(item);
                        })
                      }
                    ),
                    item.onRetry && assets && /* @__PURE__ */ jsx(
                      "img",
                      {
                        alt: t("fileUpload.retry"),
                        "aria-label": t("fileUpload.retryAria", { name: item.file.name }),
                        className: "ia-fileUpload-previewItem-action",
                        role: "button",
                        src: assets.fileUploadRetryIcon,
                        style: item.disabled ? { opacity: 0.5, pointerEvents: "none" } : void 0,
                        tabIndex: item.disabled ? -1 : 0,
                        onClick: item.onRetry,
                        onKeyDown: activateOnEnterOrSpace(item.onRetry)
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    item.onPause && assets && /* @__PURE__ */ jsx(
                      "img",
                      {
                        alt: t("fileUpload.pause"),
                        "aria-label": t("fileUpload.pauseAria", { name: item.file.name }),
                        className: "ia-fileUpload-previewItem-action",
                        role: "button",
                        src: assets.uploadPauseIcon,
                        style: item.disabled ? { opacity: 0.5, pointerEvents: "none" } : void 0,
                        tabIndex: item.disabled ? -1 : 0,
                        onClick: item.onPause,
                        onKeyDown: activateOnEnterOrSpace(item.onPause)
                      }
                    ),
                    assets && /* @__PURE__ */ jsx(
                      "img",
                      {
                        alt: item.isUploadRunning ? t("fileUpload.cancel") : t("fileUpload.remove"),
                        "aria-label": item.isUploadRunning ? t("fileUpload.cancelAria", { name: item.file.name }) : t("fileUpload.removeAria", { name: item.file.name }),
                        className: "ia-fileUpload-previewItem-action removeIcon",
                        role: "button",
                        src: item.isUploadRunning ? assets.uploadCloseIcon : assets.fileUploadDownloadIcon,
                        style: item.disabled ? { opacity: 0.5, pointerEvents: "none" } : void 0,
                        tabIndex: item.disabled ? -1 : 0,
                        onClick: () => {
                          fileRemove(item);
                        },
                        onKeyDown: activateOnEnterOrSpace(() => {
                          fileRemove(item);
                        })
                      }
                    )
                  ] })
                }
              )
            ] }),
            item.isUploadRunning && /* @__PURE__ */ jsx("div", { className: "ia-fileUpload-progress", children: /* @__PURE__ */ jsx(
              ProgressBar,
              {
                showTime: Boolean(item.timeRemaining),
                time: item.timeRemaining,
                value: item.progress ?? 0
              }
            ) })
          ] }, `${item.file.name}-${item.file.size}`);
        }),
        /* @__PURE__ */ jsxs("div", { className: "ia-fileUpload-actions", children: [
          secondaryButtonLabel && /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: onSecondaryButtonClick, ...secondaryButtonProps, children: secondaryButtonLabel }),
          primaryButtonLabel && /* @__PURE__ */ jsx(
            Button,
            {
              disabled: fileList.length === 0,
              variant: "primary",
              onClick: onPrimaryButtonClick,
              ...primaryButtonProps,
              children: primaryButtonLabel
            }
          )
        ] })
      ]
    }
  );
}
FileUpload.displayName = "FileUpload";
export {
  FILE_TYPE_MIME_MAP,
  FileUpload,
  SIZE_CONVENTIONS
};
