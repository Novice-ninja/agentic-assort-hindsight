import { getAssetUrl } from "../../utils/assetBase.js";
let cached = null;
function loadFileUploadAssets() {
  if (cached) return Promise.resolve(cached);
  cached = {
    csvIconUrl: getAssetUrl("icons/csv-icon.svg"),
    downArrow: getAssetUrl("icons/downArrow.svg"),
    excelIconUrl: getAssetUrl("icons/excel-icon.svg"),
    failedCsvIconUrl: getAssetUrl("icons/failed-csv-icon.svg"),
    failedExcelIconUrl: getAssetUrl("icons/failed-excel-icon.svg"),
    fileUploadErrorBgUrl: getAssetUrl("icons/file-upload-error.svg"),
    fileUploadBgUrl: getAssetUrl("icons/file-upload.svg"),
    fileUploadDownloadIcon: getAssetUrl("icons/deleteIcon.svg"),
    fileUploadRetryIcon: getAssetUrl("icons/fileUploadRetryIcon.svg"),
    textIconUrl: getAssetUrl("icons/text-icon.svg"),
    uploadCloseIcon: getAssetUrl("icons/upload-close-icon.svg"),
    uploadPauseIcon: getAssetUrl("icons/upload-pause-icon.svg"),
    uploadDownloadIcon: getAssetUrl("icons/uploadDownloadIcon.svg")
  };
  return Promise.resolve(cached);
}
export {
  loadFileUploadAssets
};
