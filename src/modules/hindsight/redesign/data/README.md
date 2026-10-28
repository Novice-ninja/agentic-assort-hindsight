# Hindsight shared calculation and session foundation

This isolated R67 model uses the frozen priority demo's 72 flooring styles and45 stores. It does not alter that priority application. All transactional allocations, historical membership, supply, approvals and review cases below are deterministic synthetic design-session data; none is represented as recovered client history.

## Entry points and one story

`index.ts` exports the complete typed API. `demoDataset` and `flooringDataset` are the same main dataset. `getDefaultDataset()` returns it. `products` and `stores` are the canonical main masters. `getScenarioDataset(id)` returns a stable, indexed edge-case variant. `story-contract.json` records the exact main narrative and limitations. The prior4×4 design figure is retained under `controlFixtures.ts`, `controlApi.ts`, `control-story-contract.json` and its unchanged24 invariant groups; it is not a second user-visible master.

SS26 season facts reconcile to$8,400,000,182,400 selling units and31.6% GM across item, store, pair, brand and trend views. Bamboo is12 styles,$1,049,808.28 and23,836 units. Northport uses canonical style1000037/articleNOR-WO-DWR, Westridge,$1.6M season sales and−29.3% vsLY. Northport has zero **sellable** stock;3374 physical blocked units are explicitly unavailable. Inbound200 and sharedDC900 are separate records; allocated200 is not added twice.

`SELLING_UNIT_TBC` is an explicit unconfirmed synthetic selling unit. There is no inferred conversion to square feet or packs. Allocated selling area is a separate84,000sqft ledger, with$100/sqft season productivity. Mixed units retain separate subtotals and suppress incompatible quantity, ASP, supply and sell-through sums.

## Dated grain and calendar

The main grain is item×store×complete prototype week:336,960 facts, comprising52 TY and52 mappedLY weeks for3240 pairs. Extra calendar keys anchor comparison metadata without fabricating earlier facts. Monday–Sunday calendar alignment is **definition TBC**. The SS26 prototype has26 completed selling weeks from26January through26July2026; the review/snapshot ends31July. The current and historical version keys are explicit, never inferred from calendar-year strings.

Inventory has one exact pair×31July snapshot. A missing historical date returns missing, never current inventory. Original-period EOP inventory is unavailable when its cutoff lacks an exact snapshot. Sales window changes retain the selected stock date. Backward WOS always uses four compatible completed weeks ending at that stock date. Partial open-week normalized demand requires daily qualifying sales; no daily feed is supplied, so the numerator stays unavailable. Unknown range exposure is not zero exposure.

Opening+receipts+transfer-in−transfer-out±adjustments−netquantity=physical ending at the full season grain; blocked units distinguish physical and sellable stock. Approved buys, demand plan, receipts and future open orders remain separate. SharedDC is not store stock or received supply. Signed adjustments retain their sign. Customer return movements are informational because returns are already netted in net sales quantity; they are not added again to available supply. The PLR API exposes every bridge component, expected and observed physical ending, sellable ending, blocked ending, and a reconciliation difference. Nonzero differences carry the Reconcile state. `physicalFlowDifference` exposes reconciliation explicitly.

## Strategic review and original cohort

The immutable original approval comprises66 styles×45 stores=2970 pairs. The six lowest-season-sales styles are explicitly synthetic later additions, not a claimed client decision. Original actual$8,373,352.01 +later-addition actual$26,647.99=$8.4M. The original cohort plan is$8.8M; its synthetic same-cohort revision is$8.1M. The latest all72-style plan is separately$8.6M. These values must retain their different denominators. The priority application's older scalar baseline is not presented as a recovered approval record.

The valid strategic review is the frozen selling-window calendar. Default `PLR` covers the complete window; an elapsed review passes a contiguous prefix in `scope.weekIds`. `isContiguousReviewPrefix(scope,dataset?)` validates that policy. Tactical selectors can analyze other compatible weeks, but those subsets are not elapsed PLR reviews. `getPlrReview` pins its default to the approved window and phases explicit prefixes. Launch counters use original approved pairs due by the cutoff; later exits/closures stay in the cohort. Two future pairs, two late, one unactivated and one unknown-history pair are distinct. Unknown history suppresses a verified execution percentage and exposes bounds.

## Scope and selectors

`createDefaultScope(mode?,dataset?)` derives master/date/review/calendar values dynamically. In-season defaults R4; flexible presets are LW/R4/R13/R52/MTD/QTD/YTD/SEASON/CUSTOM. PLR UI is locked to its approved review calendar and L0; only an elapsed prefix is variable.

Scope carries product/store IDs, independent product/location facets, exact optional pair IDs, population, comparison, stock/range dates, UOM, access, metric filters and local search/attribute/range filters. Nonempty product/store IDs anchor legacy detail spreads. Empty IDs with selection`all` or unset mean all; empty with selection`selected` or`none` mean none. `pairIds` unset is unrestricted; present`[]` is none. `withProductIds`, `withStoreIds`, `withPairScope` make these choices explicit. Present facet arrays are conjunctions; present empty facet arrays are empty populations. Metric rules operate at canonical pair grain; unknown/missing/restricted measures never match numerical comparisons.

`selectScopedPairs`, `aggregatePairs`, `getItemRows`, `getStoreRows`, `getMixRows`, `getTrend`, `getBreadth`, `getPairFact`, `getPlrReview` and `resolveWorkspace` all accept the same Scope/Dataset. `getMixRows` optionally takes a fourth exact contributing-pair array, so local pair filters never become a broader product×store cross join. `comparisonRangeDate` exposes the mapped historical membership date. Ratios use sums; duplicate pair leaves are deduplicated. SKU/store/pair/case counts are distinct identities, never interchangeable. Historical mix uses frozen approved color/GBB attributes; unconnected GBB is retained as Unknown.

Indexes are cached by immutable fact/range/inventory/supply/plan identities, not reconstructed context wrappers. Pair results have bounded immutable-fixture caching with scope+case revision keys. Full-season workspace cold resolve measured~535ms, warm~155ms, with26-point trend~112ms in Node during development; these are observations, not a browser performance promise. New edits must not introduce pair×whole-ledger scans.

## Pure review mutations

`createInitialSession(dataset?)` clones only authored review records. `saveDecisionDraft(state,input,now?,dataset?)` and `editDecisionDraft(state,id,input,now?,dataset?)` validate canonical pairs, evidence, compatible units, dates, duplicate commitments and action-specific constraints. Chase references existing linked supply; no second order is created. Transfer validates a distinct destination and known source sellable cap; Bulk out validates the cap. Swap requires ranged outgoing and eligible, not-already-ranged incoming pairs at the same stores.

`advanceDecision` enforces Draft→approval→execution acknowledgement→review separately. Actor permissions are explicit prototype inputs. Partial acknowledgements union completed pairs across retries; later success clears that pair's failure, other failures remain, repeated references are idempotent. Terminal records stay auditable. Acknowledgements never mutate the actual range or supply ledger; no external orders, transfers or executions are called.

The six case families are Shortages, Coverage/excess, New item, Nonproductive, Bulk out and Lifecycle/exit. `saveCase` merges new signals onto an existing open canonical-pair case without changing its original trigger or inflating case counts. Cases retain evaluation timestamp/scope/data version. Rules requiring source MIP remain unavailable because that feed is not connected. Case family membership alone is not a claimed validated exception predicate.

`saveObservation` retains observed and recorded dates, author/source, visibility, confidence and evidence class. `saveLearning` requires original review/version/question/evidence/owner; Accepted additionally needs a conclusion and identified reviewer. Optional scope/author/recordedAt/visibility provenance is retained for authored decisions and learnings. These local visibility fields are not authenticated ACLs.

## Access and unresolved definitions

`projectDataset(dataset,access)` removes recognizedCOGS, plannedGM and GM-derived case values/narration before a frozen Iris/export snapshot. Restricted GM is null/restricted, never zero. Underlying projected ledger arrays are reused across authored-record changes. Prototype roles are not production authorization. Freely authored text requires a future authenticated data-classification policy.

`catalogue.json` preserves all87 report KPI records and their source/inferred/proposed/unresolved evidence statuses. `metricDefinitions` exposes supported calculations and explicit unavailable reasons for others. GBB, vendor, region/district, source MIP, daily availability, forward forecast and historical inventory are not fabricated. The material SVGs are illustrative swatches, not authentic product photography.

## Verification

Run strict isolated data TypeScript:

```
./node_modules/.bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --resolveJsonModule --esModuleInterop src/modules/hindsight/redesign/data/index.ts
```

Bundle/run `canonical.test.ts` and `foundation.test.ts` with esbuild `--bundle --platform=node --format=esm`, then Node. Canonical results (18 grouped checks) are `test-results.json`; preserved controls are `control-test-results.json`. Tests cover exact shared totals, full→Bamboo→none→all, all period cuts, valid PLR prefixes/cohort/phasing, supply flow, access projection, unknown/negative/missing/mixed edge cases, six queues, validated mutations and partial execution retries. They do not claim UI/browser coverage.
