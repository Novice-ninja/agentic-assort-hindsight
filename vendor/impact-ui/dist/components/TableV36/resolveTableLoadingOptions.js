const DEFAULT_LOADING_ROW_COUNT = 6;
const DEFAULT_SUPPRESS_OVERLAYS = ["noMatchingRows", "exporting"];
const defaultLoadingRowsByCount = /* @__PURE__ */ new Map();
const resolveLoadingRowCount = (loadingRowCount) => typeof loadingRowCount === "number" && Number.isFinite(loadingRowCount) && loadingRowCount > 0 ? Math.floor(loadingRowCount) : DEFAULT_LOADING_ROW_COUNT;
const getDefaultLoadingRows = (rowCount) => {
  let cached = defaultLoadingRowsByCount.get(rowCount);
  if (!cached) {
    cached = { rowCount };
    defaultLoadingRowsByCount.set(rowCount, cached);
  }
  return cached;
};
function resolveTableLoadingOptions(input) {
  const isServerSide = input.rowModelType === "serverSide";
  const isInfinite = input.rowModelType === "infinite";
  const isClientSide = !isServerSide && !isInfinite;
  const rowCount = resolveLoadingRowCount(input.loadingRowCount);
  const showClientSkeleton = isClientSide && (input.loading === true || input.loading == null && input.rowData == null);
  return {
    usesBlockRowModel: isInfinite,
    showClientSkeleton,
    loading: showClientSkeleton ? true : input.loading,
    loadingRows: showClientSkeleton ? input.loadingRows ?? getDefaultLoadingRows(rowCount) : input.loadingRows,
    suppressServerSideFullWidthLoadingRow: isServerSide ? input.suppressServerSideFullWidthLoadingRow ?? true : input.suppressServerSideFullWidthLoadingRow,
    serverSideInitialRowCount: isServerSide ? input.serverSideInitialRowCount ?? rowCount : input.serverSideInitialRowCount,
    suppressOverlays: input.suppressOverlays ?? DEFAULT_SUPPRESS_OVERLAYS
  };
}
const restoringSkeletonApis = /* @__PURE__ */ new WeakSet();
function restoreServerSideSkeletonRowCount(api, loadingRowCount) {
  if (!api || restoringSkeletonApis.has(api)) return false;
  const target = resolveLoadingRowCount(loadingRowCount);
  const displayed = api.getDisplayedRowCount();
  if (displayed <= 0 || displayed >= target) return false;
  for (let i = 0; i < displayed; i++) {
    const node = api.getDisplayedRowAtIndex(i);
    if (!(node == null ? void 0 : node.stub)) return false;
  }
  restoringSkeletonApis.add(api);
  try {
    api.setRowCount(target, false);
  } finally {
    restoringSkeletonApis.delete(api);
  }
  return true;
}
export {
  DEFAULT_LOADING_ROW_COUNT,
  resolveLoadingRowCount,
  resolveTableLoadingOptions,
  restoreServerSideSkeletonRowCount
};
