# Hindsight — follow-up QA and resume instructions

This is an actionable handoff for the next session. The local redesign is implemented, but this document does **not** assert that all 90 requirements passed native QA or that the latest build was published. No additional product changes should be made merely to expand the scope of this handoff.

## Start here

1. Read `qa/redesign/native-final-runbook.md` and its JSON. They map 28 screens, 12 workflows, 30 metric invariants and 90 requirements to 12 connected native runs. The runbook is a plan, not an execution log.
2. Read `qa/redesign/browser-r67/final-native-events.json`. At this handoff snapshot it has 20 observations, across several build hashes. Read each observation and its build; one records an inbound-display failure that was subsequently repaired in source. Do not count 20 observations as 20 passing requirements.
3. Read `qa/redesign/browser-r67/design-alignment-native-checks.json` for the separate 18 earlier targeted native observations. Do not merge these into a universal final-build claim.
4. Identify the actual serving build and record its `WorkspacePage-*.js` hash before replay. The latest recorded phone observation used `WorkspacePage-8pxhXtyD.js`; later permission/export repairs may be in a newer build. The build hash is evidence identity, not a desired hardcoded value.
5. Use the existing Chrome/CUA workflow for native checks. Source/model tests do not replace native screenshots, real downloads or keyboard/layout verification. Do not run two agents against the same browser.

Canonical entry: `/assort/hindsight?mode=in-season`. PLR entry: `/assort/hindsight?mode=plr`. `/agentic-assort/*` compatibility redirects should still resolve. See the root README for the current start and deployment instructions. Standard local commands are `npm install`, `npm run dev`, and `npm run build`; a preview uses port 5174 by default. Coordinate builds because all agents share `dist`.

## Preserve the evidence boundary

- Native observations already cover configuration/library, PLR scorecard and prefix, launch/event drills, Comp, item–store–pair navigation and Back, a two-store comparison, desktop matrix final pages, breadth, Mix drills, draft/approval boundaries, component failure/retry, Iris clarification/failure and a saved-view restore. The journal contains exact cuts and limitations.
- A real **390 × 844** phone check passed for the matrix pair list: 3,240 pairs, 25 per page, 130 pages, next/back, exact Houston pair navigation, reachable shared supply and document width 390. This is a matrix/pair observation, **not** a signoff of every phone screen.
- Earlier XLSX export clicks appear in the journal, but the files were not independently available for parsing. Native Save As dialogs became disabled/queued; Downloads is also blocked by macOS privacy to shell reads, including an approved elevated read-only attempt. No permission workaround was attempted. There is currently no actual-download proof in `qa/redesign/native-exports`.
- Generated controls in `qa/redesign/mix-export-model-controls`, `export-workbook-validation.json`, old priority exports, and the four-SKU algorithm controls are **not** substitutes for current native downloads.

## First replay: material repairs after the recorded native runs

### 1. Permission projection — final repair gate

The permission agent was finishing the final repair at handoff. Read its current reports and source before declaring it complete. Test the actual latest integrated build, not an older captured screenshot.

- Start with a permitted merchant session; author an observation, learning, case note or saved-view text containing GM/COGS evidence and a distinctive number. Switch to restricted margin access through Demo settings.
- Verify the denied metric cannot reappear through cards, tables, case text, decision history, saved views, notices, Iris evidence/context, drill destinations or export rows/metadata. Permitted sales and quantity must remain usable.
- Switch access back and check that the local records were projected rather than destructively erased. Switching role alone must not grant margin access.
- Parse a real restricted workbook independently. Denied fields and authored denied values must be absent on **every** worksheet, including nested metadata. Access-policy explanatory text is allowed; a blanket search for the word “margin” is not a sufficient leak test.
- Record which source test report and build were used. A successful strict/model check is valuable, but label it separately from native execution.

### 2. Chase inbound display

Open Decisions → case `FQ01`, or the exact pair `1000037 × ST1001`. Use Season and full access. Select **Chase existing inbound** and compatible selling units. The selected existing inbound must display **200**, with `PO-NORTHPORT-200` checked. The old observed value **0** was a repaired display bug, not a valid limitation.

Try 201: validation must reject the excess and retain the form. Save 200 with valid owner/reason: draft must retain this exact pair, original UOM and PO evidence. Do not describe a saved draft or approval as execution. The canonical ledger and stock must not change.

Source/model proof: `case-inbound-display-checks.json` (3 cases, actual CaseDetail/WorkspaceProvider/canonical guard). Replay the affected native display after integration.

### 3. Chart and image DS repairs

- A trend must use the original Highcharts treatment and real point/interval interactions, without the former gray cloud of one button per week. Inspect a point, a From/To interval and an accessible data-table row; the exact contributing interval must survive a drill and Back.
- In By Item Cards or the leaderboard, enlarge a material image. It must use the recovered original Modal and ItemThumbnail preview classes, trap focus, close by Escape/backdrop/Close and restore focus. Merely opening the image must not navigate. **Open item performance** is the explicit navigation action.
- Case/log/chart quantity labels should read human units such as “selling units (TBC)” or “sq ft”, while saved decisions and workbook units retain their canonical enum values.

Proof reports: `final-design-repair-checks.json` (6), `final-display-polish-checks.json` (10), and `final-design-system-audit.md`. These include semantic host limitations and are not pixel assertions.

### 4. Mix filtered export — now repaired

In in-season Season, open Attributes/Brand, search **Woodland**, then **Export visible groups**. The Data sheet must contain Woodland Reserve, 19 SKUs, **$2,301,600**, **44,861** quantity, and **27.4%** sales share. Contributing pairs must contain exactly **855** leaves (19 × 45), all belonging to those products. It must no longer export all 3,240 parent leaves for this one visible group.

The denominator is deliberately **not** renormalized by the search. Scope metadata must separately identify the full pre-search parent: 72 SKUs, 45 stores, 3,240 pairs, $8.4M. Preserve the same applied/local cuts and original percentage.

The repair is frozen in `MixView.tsx`. `mix-export-adapter-checks.json` and `mix-export-xlsx-checks.json` pass five cases: full brands, Woodland, exact diagonal pairs, no matching groups and restricted Woodland. They execute the actual source adapter and independently parse generated bytes. Actual UI download remains to be captured.

## Actual workbook capture and independent validation

Save one workbook at a time directly into **`qa/redesign/native-exports`** through the native Save dialog, or have the user copy it into that workspace directory. Do not bypass macOS privacy or infer completion from a download click. Wait until the file is present and stable; record filename, SHA-256, size, Exported-at metadata, source version, build, route and exact UI cut. Re-export after the final integration if a workbook was captured before a material writer repair.

Use independent `openpyxl` parsing. The canonical comparison oracle is `qa/redesign/native-export-oracle.json`; its provenance explicitly says it is expected values, not browser evidence. Regenerate with `build-native-export-oracle.ts` if the ledger legitimately changes. Reconcile numerics directly from downloaded leaf rows as well as comparing against the oracle. Preserve IDs as IDs, numbers as numeric cells, null/missing reasons and the separate stock/range/performance dates. No text-derived formula should become an Excel formula.

Required native captures:

1. **Comp policy, Season:** inspect/export the draft policy. It should expose 45 decisions, 44 eligible stores and the explicit ST1045 holdout. Exact actual/LY cohorts must match. Policy is illustrative, not client approved. Applied Comp Season totals: **$8,139,313.95**, **176,740** quantity, **3,168** pairs. Verify policy/version/reason/week metadata.
2. **By Item, search 1000037, all 45 stores, Season:** Data one Northport SKU, **$1,600,000**, **23,288** quantity; Contributing pairs 45 exact stores. Search/selection/sort/visible-column metadata must be truthful.
3. **Pair 1000037 × ST1001 supply:** opening 143, receipt 574, open PO **200** with ETA **4 Aug 2026**, shared DC pool **900**, allocated 200. The DC pool is one shared source, not Houston's available stock. These rows must retain grain, source IDs and anchor pair.
4. **Dated membership for that pair:** source membership records and effective dates must match the canonical range-history feed. Do not infer range from sales or aggregate source counts.
5. **Store comparison Houston/San Antonio:** exactly two store rows and the corresponding **144** leaf pairs for the same 72-product Season population. Ratio metrics must recalculate from each store's leaves. Ensure selected stores and highlighted measure are in Scope.
6. **Full matrix, with two diagonal selections:** Data **3,240** unique exact pair IDs, 72 products and 45 stores; sales **$8,400,000** and quantity **182,400**. Pagination must not truncate export. Two checked diagonal pairs are view-state selections; they must not silently broaden into four pairs or silently restrict a clearly full-population export.
7. **Mix Woodland:** exact 855-leaf repair described above; keep parent denominator separate.
8. **Restricted export:** capture after the final permission repair. Test denied numeric fields plus a distinctive authored denied value across every sheet, while permitted totals and exact IDs remain intact. Full-access default has **87** definitions; the current restricted catalogue legitimately has **85** permitted definitions, so do not require 87 when denied definitions are intentionally removed.

Common workbook checks: `Data`, `Scope`, `Definitions`, and `Contributing pairs` where requested; source **`flooring-ledger-ss26-v2`**; independent `stockAsOf` and `rangeAsOf` **31 Jul 2026**; original selling UOM **SELLING_UNIT_TBC**; original/illustrative/inferred statuses and source aliases retained. Report unavailable real downloads as pending, not passed from the generated controls.

## Remaining targeted desktop and responsive checks

Complete the corresponding steps in the JSON runbook; avoid restarting every successful unchanged flow.

- **NR04:** native typed numeric filters: AND/OR, between, missing and no-positive-base; search + sort + grouping + paging + column visibility; all 72 items reachable. Confirm view state survives exact child navigation and Back. Actual main tables are recovered DataGrid, not a static HTML substitute.
- **NR06:** verify five-store comparison allowed and six disabled; removing a store updates the real cohort and export. Existing two-store/minimum behavior is already observed.
- **NR07:** desktop matrix arrow navigation across row/column/page boundaries and Enter into the exact pair; selected diagonal identity remains exact. Final 8/8 item and 5/5 store pages already reached in native QA. Breadth's chain value is the distinct union at explicit TY/LY dates, not the sum of store counts. Unknown history must not fabricate member identities.
- **NR09–10:** replay any final permission-affected decision/learning/rule paths. Draft → Submitted → Approved/Awaiting execution is separate from acknowledgement and completed execution. No approval should mutate stock or invent measured uplift.
- **NR12 report lifecycle:** native Loading and Retained failure on one selected report; stable component geometry, dated retained evidence, only its Retry, unchanged scope/search/selection and no previous-category flash. Failed/Retry with preserved item search/selection and returned focus is already observed. Legitimate empty/missing states must remain separate.
- **NR12 Iris:** date/period ambiguity, denominator ambiguity, and changing workspace scope while clarification is pending. Exact clarification must not broaden the cohort. Unknown-SKU clarification, unavailable assistant fallback and 640px keyboard resize were already observed. No production assistant or execution service is connected.
- **Responsive:** retain the proven 390px matrix path. Check 1024px and 390px Overview, global drawer, Configuration, item detail, case draft/approval and Iris. Verify real viewport/document dimensions, keyboard reachability, readable values and no overlay clipping. An ordinary desktop screenshot with a phone filename is not mobile evidence.
- **DS:** inspect final trend/compare hover tooltips, actual original card/header/button/input treatment, and lower sections after scrolling. Known nonblocking items are in `final-design-system-audit.md`; do not invent a new design language while completing QA.

## Final documentation, package and deployment gate

1. Append new observations to `final-native-events.json` with build/route/viewport/action/result and screenshot paths. Preserve historical failures and add explicit repaired replays; do not retroactively relabel old evidence.
2. Recapture key screenshots from the actual final build. The earlier Dyg `plr-summary.jpg` was scrolled into a trend; it is unsuitable as a top-of-scorecard illustration. Ensure the demo document's annotated sections correspond to the captured section and build.
3. Record final source tests separately from native checks. Re-run only affected checks plus the integrated build. The four-SKU controls remain algorithm controls and must never be presented as the 72 × 45 UI population.
4. Verify a clean extracted source install/build and the ready-built package. Boot canonical, exact detail and legacy routes; inspect console errors/broken images and refresh behavior. Record the final runtime entry hash. Do not claim the old parity ZIP's boot as proof of the new redesign.
5. If publishing, identify the actual GitHub commit/Netlify deployment and open that URL for the smoke test. Local success does not prove deployed routing, assets or storage isolation. Keep the prototype's explicit production boundaries: synthetic data, unapproved fiscal/Comp definitions, unavailable feeds, local approval/acknowledgement and no real supply execution.

At resume, prioritize real export capture/parse and the latest permission/inbound/Mix replays, then the remaining high-value native states. Stop adding unrelated polish while a requested publish is urgent; document a limitation precisely if it remains unverified.
