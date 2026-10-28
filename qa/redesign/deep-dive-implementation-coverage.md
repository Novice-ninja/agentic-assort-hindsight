# R67 Deep Dive implementation handoff

The assigned views are ready for root’s integrated build and native walkthrough. Source/model checks are separate from actual browser acceptance.

The main workspace uses all 72 canonical SKUs and 45 stores. Matrix pages cover every item/store; the original four-item specification example remains a separate algorithm control, never an invented main-app population.

## Native checks before signoff

- Full item table/cards and three table presets; search aliases PWPS / OH CST$; between/missing/nonpositive filters, AND/OR and invalid bounds.
- Item name→Stores→pair→full store assortment→Back, checking exact values, local interval, original scope, selected columns/page/scroll and highlight.
- Matrix final item page (items 71–72) and final store page (stores 41–45); arrows across paging boundary, selection count, unknown disable and normalized export.
- At 390px: pair-list paging, item/store grids without frozen lead columns, metric filter/chooser controls, store comparison and supply ledger reachability.
- Breadth product/geography grouping, explicit TY/LY dates, unknown disabled drill, signed deltas, chain distinct union and member history.
- Compare 2 and 5 stores, reject 1 and 6; change measure/remove a store; exact scoped store-week productivity.
- Actual native aggregate export after filtering/sorting/preset change: Data row order, Scope/Definitions, Contributing pairs, source IDs/UOM/dates and restricted-margin exclusion.
- Detail trend week/month/metric selection, local interval drill and clear, keeping the applied original PLR period pinned.

## Requirement mapping

- **HSP21-item-base · pages 21, 22:** Table/cards use the same filtered canonical SKU rows. Grouping defaults off. Recovered DataGrid and Impact controls preserve identity, selection, typed filters and personal columns; 72 cards are paginated.
- **HSP22-item-tools · pages 22, 24:** Sales/stock, velocity/exposure, lifecycle/focus and source-parity presets; searchable aliases; locked identity on desktop and unpinned narrow layout. Controlled sort uses stable IDs and unavailable-last ordering. Data export follows current filtered/sorted aggregate rows; a separate worksheet retains exact contributing pairs.
- **HSP22-item-counts · pages 22:** Main counts use the canonical 72-SKU/45-store ledger. Footer/summary distinct union is recomputed from leaves, not summed store breadth. Original 4×4 specification figures remain algorithm controls in the data agent’s separate tests, not fabricated current main rows.
- **HSP23-velocity · pages 23:** Velocity preset shows qualifying ranged quantity, total net quantity, ranged pair-weeks and computed velocity. Filtered totals expose the same numerator/denominator and recomputed ratio.
- **HSP24-source-fields · pages 24:** MIP, MIP Sales By Location, PWPS, ELP, VP Avg and Active Assorted remain searchable exact source aliases with Definition pending. OH CST$ points to OH cost. No guessed expansion or source-definition approval is claimed; denied margin values remain restricted and are removed by workbook permissions.
- **HSP25-item-detail · pages 25:** Performance, Stores, PLR history and Actions/notes share a canonical SKU anchor. Current-range and all-candidate store lenses are explicit. Local interval/pair selection remains visible and removable.
- **HSP25-reverse-path · pages 25:** Item→Stores→shared Pair→full Store assortment clears the local SKU/pair restriction while retaining local fiscal interval and global applied scope; originating SKU is only a highlight. Context snapshots restore table search/sort/columns/group/page/selection; the table also records native grid scroll positions.
- **HSP25-missing-members · pages 25, 31, 59:** Unknown range history is labeled. Breadth identity drill disables when membership is unknown or matched LY date is absent. Aggregate source report fields remain definition-pending; no aggregate count creates invented canonical members.
- **HSP26-optional-map · pages 26:** Primary sortable store table is fully implemented. Geographic map is explicitly unavailable because canonical masters do not contain approved coordinates/boundaries. No inferred geography or false metric scale is drawn.
- **HSP26-cluster · pages 26:** A–F source labels support grouping and scoped search. Governed dated targets are not connected, so actual/target/pp-gap summary is disabled with a reason rather than generated as an approved comparison.
- **HSP27-store-index · pages 27:** Recovered DataGrid provides the store index; typed local conditions, search, region/district/cluster grouping, columns, exact exports and direct single-store detail. Aggregates use the same item-store leaves as By Item.
- **HSP28-store-detail · pages 28:** Assortment defaults; Change store is explicit. Product/time/snapshot filters persist. Population choices are inherited, current range, all eligible, exited and all candidates. Zero-sales ranged and stocked exited pairs are retained by canonical selectors.
- **HSP29-store-subviews · pages 29:** Assortment, Performance, Focus/actions and External reports. Highcharts trend uses exact fiscal points and an accessible data alternative; local week selection is removable and drills without changing the applied PLR prefix. Named top-20 ranking uses canonical ties. External feed needs/source grain are disclosed; no traffic or competition values are invented.
- **HSP29-compare · pages 29:** 2–5 stores are enforced; selected stores can be removed and comparison measure changed. All cards use the same product/date scope, open store-weeks and ratio definitions. Format/space comparability remains explicitly not connected.
- **HSP30-matrix · pages 30, 32:** Range/stock, net sales and backward R4 WOS share one canonical pair map. Search rows/columns, explicit all-candidates option, pair selection/comparison, scoped review and shared detail. Original PLR remains a fixed cohort.
- **HSP30-matrix-baseline · pages 30:** Main UI now uses 72×45 canonical identities. The original P101/P104 four-item matrix is retained solely as a separately passing data algorithm control. Every main cell state comes from dated canonical facts.
- **HSP31-breadth · pages 31:** Distinct TY/LY and signed delta use the same canonical membership set. Product grouping and Store/Region/District/Cluster grouping use distinct unions; TY and mapped LY dates are visible. Locations and member pairs are paginated, with dated source-member drill.
- **HSP32-matrix-failure · pages 32:** Unknown has patterned state text, valid zero remains R0 only when ranged, negative stock is reconciliation, outside-population cells are explicitly excluded and unavailable metrics never become zero. Unknown/unauthorized selections cannot enter bulk review.
- **HSP32-matrix-scale · pages 32:** Explicit 5/10-item and 5/10-store pages cover all 72×45 identities; no hidden slice. Arrows cross page boundaries and Enter opens pair evidence; Escape clears selection. Narrow layout uses a separately paginated pair list. Grid labels are pinned on desktop.
- **HSP33-pair-detail · pages 33, 34:** Shared canonical pair detail contains Performance, Availability/supply, Range/PLR history and Decisions/notes. Exact local interval and scope filters apply consistently; observed facts, hypotheses and follow-up decisions are separate.
- **HSP33-supply · pages 33, 34:** Physical store inventory, sellable stock, open orders/ETA and shared DC pool references stay separate grains. Recovered evidence grids preserve source IDs/dates/UOM/allocation. Separate source-ledger exports are offered; no inbound or DC pool is added to today’s sellable stock.
- **HSP35-leaderboard · pages 35:** By Item ranks a named measure and limit within the filtered period using stable ties. Name opens performance; actual canonical material image opens a focus-contained enlargement dialog only. No repeated Iris control is attached to each product.
- **HSP37-mix-bind · pages 37, 38:** Mix passes exact itemIds/storeIds/pairIds and local weekIds. Deep Dive intersects those leaves, treating present empty arrays as NONE, and Back retains the originating scope/controls. Root owns chart/denominator/source binding acceptance.
- **HSP38-mix-share · pages 38, 40:** Mix passes exact itemIds/storeIds/pairIds and local weekIds. Deep Dive intersects those leaves, treating present empty arrays as NONE, and Back retains the originating scope/controls. Root owns chart/denominator/source binding acceptance.
- **HSP39-gbb · pages 39:** Mix passes exact itemIds/storeIds/pairIds and local weekIds. Deep Dive intersects those leaves, treating present empty arrays as NONE, and Back retains the originating scope/controls. Root owns chart/denominator/source binding acceptance.
- **HSP40-mix-interactions · pages 40:** Mix passes exact itemIds/storeIds/pairIds and local weekIds. Deep Dive intersects those leaves, treating present empty arrays as NONE, and Back retains the originating scope/controls. Root owns chart/denominator/source binding acceptance.

Geographic coordinates, governed cluster targets, client source-alias approval and production feeds remain explicit external boundaries. No actual browser pass or production connection is claimed by this handoff.
