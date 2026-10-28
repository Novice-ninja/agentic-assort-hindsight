/**
 * Single source of truth for the asset origin, shared by runtime code (`assetBase.ts`)
 * and the Vite/Vitest/Storybook configs that inject `$impact-ui-asset-base` into SCSS.
 *
 * Must stay free of `import.meta.env` so Node-side config files can import it.
 */
/** Default prod asset origin (GCP-backed static files). Override with `VITE_IMPACT_UI_ASSET_BASE`. */
export declare const DEFAULT_IMPACT_UI_ASSET_BASE = "https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod";
/** Returns the configured base without trailing slashes, falling back to the prod default. */
export declare function resolveAssetBase(fromEnv?: string): string;
//# sourceMappingURL=assetBaseDefault.d.ts.map