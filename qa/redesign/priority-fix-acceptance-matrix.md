# Priority fix-list acceptance plan

The current release keeps Overview, By Item and Sales Mix. Complete Sections A, B and C first; Section A5 is conditional because Watchlist is hidden. Section D is explicitly held for Omar’s layout confirmation. The 67-page redesign draft source remains preserved and is not integrated into this priority release.

All 17 embedded reference screenshots were extracted and reviewed as a contact sheet; C3 was also inspected at its original image resolution. Results below remain a plan until actual browser evidence is attached.

Current evidence is mapped separately in [priority-coverage-audit.md](priority-coverage-audit.md) and its JSON. The status lines below preserve the initial implementation plan; they are not 83 browser passes. Later user steering authorizes future structural work after priority completion, while Section D remains outside this priority release.

## A1 One dataset behind every tab (totals and brand list)

Status: planned. Owner: local_data.

1. At the identical unfiltered SS26 / Flooring scope, Overview, By Item, Sales Mix and brand charts reconcile to $8.4M sales and 182,400 sales units.
2. Every brand view uses one canonical brand dictionary; style names Northport, Hillside and Seashell do not masquerade as brands.
3. Brand share uses each brand sales divided by the same scoped sales denominator; Woodland Reserve share matches across all three surfaces.
4. After a Category/Subcategory cut, the summary strip, table leaf sums, brand total and contribution shares reconcile under that same cut.
5. All quantities, sales, GM and stock are derived from the same synthetic ledger; rate totals recalculate from numerators/denominators rather than averaging percentages.
6. Synthetic source status remains visible; no generated value is represented as an actual F&D client fact.

## A2 Same product, one ID, one story

Status: planned. Owner: local_data.

1. Northport and all repeated products have exactly one stable canonical product ID across current visible tabs.
2. The same product sales, stock condition and growth story agree across Overview and By Item.
3. When both demand/stockout and relative underperformance apply, the explanation distinguishes them and does not present conflicting categorical labels.
4. Any ID crosswalk is explicit; matching descriptions alone do not fabricate product identity.
5. Watchlist alignment is recorded as deferred while C6 hides that concept.

## A3 Remove apparel and non-flooring leftovers

Status: planned. Owner: local_data.

1. No Footwear, Premium, Outlet or apparel category wording remains in the flooring cluster grid or commentary.
2. Grid row identities match the current selected flooring categories; an unselected Laminate row does not remain in a Hardwood / Engineered Hardwood / Bamboo scope.
3. Cluster labels are A–F.
4. Combination count is calculated as displayed row count times displayed cluster count; red-cell count is counted from those same cells and thresholds.
5. Changing category selection updates both the visible grid and its narrative count.

## A4 Copy cleanup: double full stops and repeated insight text

Status: planned. Owner: local_data / root.

1. Sentence case is used for narrative prose; brand/category proper names retain their correct case.
2. No doubled terminal full stop remains in rendered insight prose or its tooltip.
3. Each attribute chart has a metric/lens-specific insight or omits one; the identical generic product-type paragraph is not copied above every chart.
4. Quantified narrative values match the selected chart and scope.

## A5 Watchlist counters do not add up

Status: conditional_deferred_watchlist_hidden. Owner: deferred with C6.

1. If the Watchlist is later made visible, mutually exclusive Critical + High + Watch counts equal the items-needing-attention headline.
2. Total Scanned is a separately computed larger population, not copied from each priority count.
3. No Watchlist entry is exposed in the current three-tab release.

## B1 Division dropdown stays open

Status: planned. Owner: source_build.

1. Choose an individual Division option: the dropdown closes immediately.
2. The selected division is applied/displayed; dependent values follow the existing scope contract.
3. Reopen and use keyboard selection; the menu closes and focus returns predictably.

## B2 Netlify badge and header overlap content

Status: planned. Owner: source_build.

1. The preview contains no Powered by Netlify badge overlaying page content.
2. At 798 px width, the header decoration and top-right controls do not overlap the filter bar.
3. Check desktop and a narrower viewport; content and buttons remain reachable without horizontal page overflow.
4. Only branding/deployment chrome is changed; unrelated product controls remain clickable.

External dependency: A hosted preview badge may also require Netlify project configuration; local HTML/CSS removal alone is not proof of the hosted deployment state.

## B3 Narrative card text is clipped

Status: planned. Owner: root.

1. All three bullets in each card are fully readable, or text is cleanly truncated before a distinct Read More control.
2. Read More expands the correct narrative and the control does not cover the last visible line.
3. Expanded/collapsed and narrow layouts remain readable.

## B4 Load error and URL naming (deployment)

Status: planned. Owner: source_build.

1. A direct Hindsight URL lands in Hindsight; initial loading has no error toast and no empty Decision Dashboard flash.
2. Canonical local route, document title, header and breadcrumb use Assort.
3. Old agentic-assort routes redirect compatibly so existing links still open the intended screen.
4. A direct reload of By Item and Sales Mix works.
5. Hosted site naming is verified separately when deployed; local naming does not claim that a remote Netlify project was renamed.

External dependency: Renaming the actual hosted Netlify site/address requires deployment project control; preserve an explicit pending external task if unavailable.

## C1 Replace per-object Ask Iris with one entry point

Status: planned. Owner: source_build / root.

1. A context-aware header Iris control carries the current screen and filters.
2. Repeated literal Ask Iris text is removed from object controls; if contextual controls are retained, they are symbol-only with accessible names and correct object context.
3. No context button silently opens an unrelated chart or stale selection.
4. Keyboard activation, close and focus return remain usable.
5. Interpretation of the document ambiguity is explicit: its Expected line permits icon-only contextual buttons, while the issue text prefers one entry point.

## C2 Rename Season Scorecard

Status: planned. Owner: root.

1. The visible section heading is Summary.
2. The same section label is used by the demo walkthrough/script and accessible names.
3. No visible Season Scorecard title remains in the current app.

## C3 Replace hex store map with a table (and fix its copy)

Status: implemented in source; browser verification pending. Owner: parity_inventory.

1. The honeycomb/map is removed and the original 45 store identities remain available in a sortable table.
2. The table shows Store, Store ID, Cluster A–F and colour-shaded ST% cells.
3. Each column sorts in both directions; numeric ST sorting is numeric and ties use stable store ID.
4. Search by store name/ID/cluster changes the result count; clearing search restores the same store population.
5. Narrative names actual A–F clusters and derives its highest/lowest store-average rates from the displayed source population; no Premium/Outlet wording remains.
6. ST% is an absolute rate calculated from synthetic units and supply/buy, never the original signed change values.
7. Click a store to open its side panel with the matching identity, cluster, sales, sales units, GM, stock and ST KPIs from the same source.
8. Close button, backdrop and Escape close the panel; focus enters the panel, stays within it and returns to the originating store control.
9. Loading, error/retry and no-search-results states remain explicit.
10. Desktop, 798 px and narrow viewports retain all table content and panel controls without page overflow.
11. Rate shading is labeled as a demo convention with definition TBC, not an approved F&D target.

## C4 Add R4 / R13 / R52, sales per sq ft and PLR baseline columns

Status: planned. Owner: local_data + source_build / root.

1. R4, R13 and R52 columns are visible with synthetic values and an explicit definition TBC label.
2. Sales per sq ft is visible and labeled synthetic / definition TBC; it does not silently use selling-space productivity when the source is product area.
3. PLR baseline is visible next to LY and Plan where those comparison columns exist.
4. The Overview Summary exposes the same proposed period/baseline measures without claiming an original production PLR feed.
5. New fields flow into column chooser, sorting and actual workbook download where those controls already apply.
6. Period totals reconcile to their synthetic ledger definitions; one unrelated value is not relabeled for all three periods.

## C5 Weekly chart: fit to screen with zoom

Status: planned. Owner: root.

1. All 26 season weeks fit the chart container without an initial horizontal scrollbar.
2. A zoom or brush/range control narrows the visible weeks and visibly shows the selected interval.
3. Reset restores all 26 weeks.
4. Metric, subgroup and weekly/monthly changes remain correctly bound and the chart remains accessible at narrow widths.

## C6 Hide the Watchlist tab for now

Status: planned. Owner: source_build.

1. The visible primary tabs are exactly Overview, By Item and Sales Mix.
2. Watchlist is not moved into a Decisions tab or advertised elsewhere.
3. A saved direct Watchlist URL resolves safely without exposing an unvalidated day-one workflow.
4. Experimental Watchlist creation and decision-lifecycle mock-ups are absent from this priority release.

## D1 Master tabs and Deep Dive

Status: explicitly_deferred_pending_Omar. Owner: deferred to Omar confirmation.

1. Do not integrate this change into the priority release before Omar confirms the layout.
2. Preserve R67 draft source separately; its existence is not a claim that this structure is approved or released.
3. Overview / Deep Dive / Decisions, By Store, presets and folding Sales Mix into Overview change the page structure.

## D2 PLR review vs In-season mode

Status: explicitly_deferred_pending_Omar. Owner: deferred to Omar confirmation.

1. Do not integrate this change into the priority release before Omar confirms the layout.
2. Preserve R67 draft source separately; its existence is not a claim that this structure is approved or released.
3. The mode switch and restricted PLR calendar/L0 alter scope and workflows.

## D3 Scope lock and saved views / filters

Status: explicitly_deferred_pending_Omar. Owner: deferred to Omar confirmation.

1. Do not integrate this change into the priority release before Omar confirms the layout.
2. Preserve R67 draft source separately; its existence is not a claim that this structure is approved or released.
3. Scope lock, immutable original buy baseline and saved view/filter controls alter persistent configuration.

## D4 Complete filter set, including store hierarchy

Status: explicitly_deferred_pending_Omar. Owner: deferred to Omar confirmation.

1. Do not integrate this change into the priority release before Omar confirms the layout.
2. Preserve R67 draft source separately; its existence is not a claim that this structure is approved or released.
3. Adding region/district/store/cluster/time/population/lifecycle/attribute/unit groups changes the existing filter architecture.

## Critical browser sequence

1. Cold-load the renamed Assort URL at desktop and 798 px. Confirm no error toast, no Decision Dashboard flash, no Netlify badge, and the three permitted tabs.
2. Reconcile Summary, By Item and both Sales Mix tables at full scope and one category cut. Verify canonical brands and Northport identity/story.
3. Inspect every Overview narrative and chart-specific insight, then the selected category × A–F grid and its computed counts.
4. Verify proposed columns and actual downloads, then weekly full-season fit, zoom and reset.
5. Inspect all 45 C3 stores: sort each heading twice, search/clear, open a named store and compare panel values with the canonical fixture; close with Escape, backdrop and button, including focus return.
6. Repeat C3 table/panel and narrative Read More at narrow width; record screenshots and console/network failures separately.

C3 has 8 passing independent fixture/helper checks in `qa/redesign/priority-store-source-checks.json`. They verify canonical identities, exact totals, actual ST rates, sorting and derived commentary. They do not establish browser interaction or visual acceptance.
