const collectVisibleLeafIds = (columns) => {
  const ids = [];
  const walk = (cols) => {
    (cols || []).forEach((col) => {
      var _a;
      if (!col || col.headerName === "N/A") return;
      if ((_a = col.children) == null ? void 0 : _a.length) {
        walk(col.children);
      } else if (col.colId) {
        ids.push(col.colId);
      }
    });
  };
  walk(columns);
  return ids;
};
const ensureColumnGroupsExpanded = (api, colId) => {
  if (!api || !colId) return;
  const column = api.getColumn(colId);
  let group = (column == null ? void 0 : column.getParent()) ?? null;
  while (group) {
    if (!group.isExpanded()) {
      api.setColumnGroupOpened(group.getGroupId(), true);
    }
    group = group.getParent();
  }
};
const getSearchHighlightSegments = (text, searchText) => {
  const value = text ?? "";
  if (!searchText || !value) return [{ text: value, isMatch: false }];
  const matchIndex = value.toLowerCase().indexOf(searchText.toLowerCase());
  if (matchIndex === -1) return [{ text: value, isMatch: false }];
  const segments = [];
  if (matchIndex > 0) {
    segments.push({ text: value.slice(0, matchIndex), isMatch: false });
  }
  segments.push({
    text: value.slice(matchIndex, matchIndex + searchText.length),
    isMatch: true
  });
  const remainder = value.slice(matchIndex + searchText.length);
  if (remainder) {
    segments.push({ text: remainder, isMatch: false });
  }
  return segments;
};
const syncColumnSearchTextToGrid = (api, searchText) => {
  if (!api) return;
  const context = api.getGridOption("context");
  if (context && typeof context === "object") {
    context.columnSearchText = searchText || "";
  }
  api.refreshHeader();
};
export {
  collectVisibleLeafIds,
  ensureColumnGroupsExpanded,
  getSearchHighlightSegments,
  syncColumnSearchTextToGrid
};
