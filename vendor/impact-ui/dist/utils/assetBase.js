import { resolveAssetBase } from "./assetBaseDefault.js";
import { DEFAULT_IMPACT_UI_ASSET_BASE } from "./assetBaseDefault.js";
function getAssetUrl(relativePath) {
  const base = resolveAssetBase();
  const path = relativePath.replace(/^\/+/, "");
  return `${base}/${path}`;
}
export {
  DEFAULT_IMPACT_UI_ASSET_BASE,
  getAssetUrl
};
