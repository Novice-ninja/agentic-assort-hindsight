function isModifiedClick(event) {
  if (!event) return false;
  const e = event;
  return event.defaultPrevented || e.button != null && e.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}
export {
  isModifiedClick
};
