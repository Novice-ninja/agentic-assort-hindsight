const FILE_TYPE_MIME_MAP = {
  pdf: ["application/pdf"],
  image: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
    "image/tiff"
  ],
  xls: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ],
  xlsx: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ],
  csv: ["text/csv"],
  text: ["text/plain"],
  html: ["text/html"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  zip: ["application/x-zip-compressed", "application/zip"],
  default: ["application/octet-stream"]
};
const SIZE_CONVENTIONS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
export {
  FILE_TYPE_MIME_MAP,
  SIZE_CONVENTIONS
};
