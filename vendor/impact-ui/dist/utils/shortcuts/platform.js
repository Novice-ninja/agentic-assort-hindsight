const MAC_PATTERN = /Mac|iPod|iPhone|iPad/;
const isMac = typeof navigator !== "undefined" && MAC_PATTERN.test(navigator.platform || navigator.userAgent);
export {
  isMac
};
