const DEFAULT_IMPACT_UI_ASSET_BASE = "https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod";
function resolveAssetBase(fromEnv) {
  const base = DEFAULT_IMPACT_UI_ASSET_BASE;
  return base.replace(/\/+$/, "");
}
export {
  DEFAULT_IMPACT_UI_ASSET_BASE,
  resolveAssetBase
};
