# Priority SS26 flooring demo data

This adapter addresses the uploaded **Hindsight Netlify App – Design Team Fix List (SS)**, A1–A4 and C4, in the current three-tab application. It is separate from the 67-page redesign experiment under `modules/hindsight/redesign/data`. The recovered phase-one JSON files remain unchanged as provenance.

Every number here is synthetic demonstration data. Product names, article short codes, the 72 By Item style IDs and the original 45 store identities seed the example. Choosing By Item style ID `1000037` as Northport's canonical demo identity is a deliberate conflict-resolution choice, not a verified client master-data crosswalk. Existing financial values are rescaled and five real brand names are assigned consistently; the resulting brand assignments are illustrative, not a recovered client brand master.

## One quantitative dictionary

- Net sales **$8,400,000**, selling quantity **182,400**, GM dollars **$2,654,400**, weighted GM **31.6%**, **72** canonical styles.
- Brand sales: Woodland Reserve **$2,301,600  / 27.4%**, Westridge **$1,839,600  / 21.9%**, American Spirit **$1,696,800  / 20.2%**, Lifescapes **$1,461,600  / 17.4%**, Bruce **$1,100,400  / 13.1%**. Northport, Hillside and Seashell are product style names, never brands.
- Quantity is a placeholder selling-unit count. A canonical flooring pack/UOM and conversion policy require F&D confirmation; the adapter does not relabel these counts as measured square feet.
- Northport `1000037`  / `NOR-WO-DWR`: **$1.6M**, **−29.3% vs LY**, strong in-stock demand, interrupted supply, zero end-of-season sellable store stock in this synthetic example. A stockout and lower full-season sales can coexist; both Overview and By Item carry this same explanation.
- Hardwood, Engineered Hardwood and Bamboo are the only categories. The full grid is **3 categories × 6 clusters = 18 cells**. A–F are the only cluster names; commentary counts and the lowest cell are computed from those cells.
- The 45 stores retain `ST1001`–`ST1045`. Stable style×store leaves (`flooringItemStores`) conserve sales, quantity, GM dollars, supply, stock and allocated area. Scope changes select those existing leaves rather than reallocate a new store story. Stock is one dated snapshot, not a time sum. Valid absolute ST% is sold quantity /available supply; negative changes are never used as ST%.

## Definition-TBC placeholders

`FLOORING_DEFINITIONS` is the shared copy source. Every C4 field exposes `definitionStatus: 'Synthetic · definition TBC'`.

- R4/R13 are net sales across the last 4/13 completed prototype weeks ending **26 Jul 2026**. R52 includes those 26 season weeks plus 26 preceding weeks. Calendar alignment is illustrative and requires approval; the existing season label remains SS26.
- Full-scope R4 **$845,799.66**, R13 **$3,504,027.54**, R52 **$15,691,973.05** are computed from the same deterministic phasing, not independently entered summary numbers.
- Sales per sq ft = season net sales /**allocated selling area**, currently **84,000 sq ft** for the full scope, or **$100/sq ft**. This provisional area-productivity formula is distinct from AUR. F&D must confirm whether this is their intended denominator; it is not asserted as an observed client definition.
- LY sales **$7,865,168.54**, latest Plan **$8.6M**, original PLR baseline **$8.8M** are separate amounts. The PLR baseline is synthetic and immutable in this adapter, not a claim that a real approval feed was recovered.
- Supply, stock, returns, store area, margin allocation, rolling phasing and local availability cases are synthetic. Northport's zero closing stock includes an illustrative supply/adjustment story; available season supply and closing stock are separate quantities and are not silently equated.

## Binding and scope

`getFlooringTotals`, `getFlooringMixRows`, `getFlooringStores`, `getFlooringWeekly`, `getFlooringCategoryCluster`, `getFlooringNarratives` and `getFlooringInsight` share `selectFlooringItems`. They accept explicit `HierarchyScopeEntry[]` or a `{hierarchyScope}` filter object. Both `selectAll` and `select_all` recipes support search, exclusions and explicit includes. Empty product scope returns no store observations, rather than 45 false 0% cells.

The priority global-config response advertises the three represented hierarchy levels L0/L1/L2. Filter values and style counts are grouped from the same 72 canonical IDs; ancestor selections, search and Select-All recipes cascade through those actual groups. A stale mounted client requesting phantom L3 receives an explicit L2 compatibility resolution, while fresh clients use the real three-level master.

The existing API handlers call `flooringRequestFilters`, which reads the single applied workspace scope owned by `modules/hindsight/priority/flooringScope.ts` when endpoint bodies omit it. Existing local Working Plan overrides remain in their original in-memory store.

Both Sales Mix data modules project these same rows. The active component passes its selected real attribute and shared scope; the compatibility defaults remain the same brand view. The upper share column is a sales-share measure, not growth. Dynamic By Item/attribute API cells provide visible LY, Plan, original PLR, R4/R13/R52 and sales/area columns with TBC labels. By Item ratio cells also retain additive numerator/denominator/multiplier evidence for weighted GM%, ST%, AUR, ROS and area-productivity group rolls. Unknown WOH/markdown group bases are not fabricated.

Chart handlers respect the requested units/dollar metric. Pareto contribution derives from that additive metric; rates and prices have no additive cumulative share. Weekly/monthly rates recompute from facts. No unavailable prior-period COGS is invented. Fresh summary/narrative endpoint tests cover full → Bamboo → empty → all scope transitions; Bamboo yields $1,049,808.28, 23,836 units and 12 styles, with Walnut at 39.6% of sales and no off-scope Northport claim. Explicit request scope and nondefault plan aliases are honored. UI cache invalidation is owned by the workspace hooks, separately from these API checks.

Current frontend wire slot `ly` is explicitly labeled **SS26 actual · synthetic**, and `lly` **SS25 LY · synthetic**. Unsupported optimization/forecast clones are omitted. Chart-specific summaries derive from their numeric-week or product-type payload; unidentified charts receive no repeated scorecard text. Top Performing uses canonical values, sorts before pagination and recomputes ranks after scope filtering.

## Verification

Run from the application root:

```sh
./node_modules/.bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --resolveJsonModule --esModuleInterop src/mocks/flooringDemo/index.ts
./node_modules/.bin/esbuild src/mocks/flooringDemo/flooringDemo.test.ts --bundle --platform=node --format=esm --outfile=/tmp/hindsight-flooring-demo.test.mjs
node /tmp/hindsight-flooring-demo.test.mjs
```

`test-results.json` records 22 meaningful grouped checks of allocation conservation, identity, weighted totals, all attribute cuts, period/area guards, 45-store leaf reconciliation, 18 cells, Select-All recipes, actual three-tab MSW endpoint responses, Northport identity/story, C4 fields, metric-aware charts, chart-specific summaries, sorted top ranks, applied scope, canonical filter-option counts, the real source Pareto hierarchy mapping and recommendation save/refetch/clear. These are source/API/calculation checks, not browser claims. Root owns visual and browser verification.

## Illustrative material images

All 72 canonical style IDs have reproducible code-native SVG plank/grain swatches under `public/demo-flooring/`, with species, colour and finish recorded in `manifest.json`. These are clearly illustrative material renderings, not authentic product photography. By Item visual/table and Top Performing responses share the same canonical URL. The thumbnail component prefers that URL for known IDs even if an old cached response contains apparel imagery; loading uses the existing skeleton and failure/unknown IDs use a neutral material swatch. No garment photograph or garment placeholder remains in those fallback paths. Recreate the SVGs by bundling/running `generateSwatches.ts`; tests validate all 72 identities, hashes and actual endpoint image mappings.
