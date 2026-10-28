function getSize(el) {
  const { width, height } = el.getBoundingClientRect();
  return { width, height };
}
function onResize(el, callback) {
  if (typeof ResizeObserver === "undefined") {
    callback(getSize(el));
    return () => {
    };
  }
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const box = entry.borderBoxSize[0];
    callback(
      box ? { width: box.inlineSize, height: box.blockSize } : { width: entry.contentRect.width, height: entry.contentRect.height }
    );
  });
  observer.observe(el);
  callback(getSize(el));
  return () => {
    observer.disconnect();
  };
}
export {
  getSize,
  onResize
};
