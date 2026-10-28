import { jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { getAssetUrl } from "../../utils/assetBase.js";
const EMPTY_STATE_WEBP_PATHS = [
  "images/emptyState1.webp",
  "images/emptyState2.webp",
  "images/emptyState3.webp",
  "images/emptyState4.webp",
  "images/emptyState5.webp",
  "images/emptyState6.webp"
].map((f) => getAssetUrl(f));
function pickRandomUrl(urls) {
  if (urls.length === 0) return null;
  return urls[Math.floor(Math.random() * urls.length)] ?? null;
}
function EmptyStateImage() {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    const url = pickRandomUrl(EMPTY_STATE_WEBP_PATHS);
    if (url != null) {
      setSrc(url);
    }
  }, []);
  if (src == null) {
    return /* @__PURE__ */ jsx("div", { className: "impact_emptystate_placeholder", style: { width: 225, height: 150 } });
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      alt: "",
      decoding: "async",
      height: 150,
      loading: "eager",
      role: "presentation",
      src,
      style: { objectFit: "contain" },
      width: 225,
      ...{ fetchPriority: "high" }
    }
  );
}
export {
  EmptyStateImage
};
