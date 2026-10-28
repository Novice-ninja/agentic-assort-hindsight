# Final design-system implementation audit

The main screens now use the actual original controls, KPI assets, card language, filter panel, tabs, chat host and DataGrid. No remaining material source blocker was identified after the five authorized repairs below. This is not final native or pixel-parity signoff.

No Chrome was operated. Existing screenshots were inspected as saved files. Application edits were limited to the seven files recorded in the JSON companion.

## Repaired in source

- **Redundant date-button cloud under every trend** — Removed default repeated date controls. Chart click/zoom and the existing From/To controls remain; exact interval row actions are inside the collapsed accessible data table. Evidence: final-design-repair-checks.json. Final native replay is still required.
- **Custom near-copy of original image-preview modal** — Uses the same shared Modal, portal, previewDialog and previewImage classes as original ItemThumbnail. Preserves focus trap, Escape, backdrop, Close and explicit item-route action. Evidence: final-design-repair-checks.json. Final native replay is still required.
- **Undefined color-bg/color-text aliases in active grouped rows and launch counts** — Replaced only those aliases with actual color-surface-muted and color-text-primary tokens, including unused scaffolding rules. Evidence: final-display-polish-checks.json. Final native replay is still required.
- **Canonical UOM enums displayed in chart axis, case form/supply text and decision log** — Uses existing formatUnit for readable display. Select option values, saved canonical units, numeric values, export and mutation payloads are unchanged. Evidence: final-display-polish-checks.json. Final native replay is still required.
- **Existing selected inbound displayed zero while canonical guard accepted200** — Current open-order membership no longer excludes a valid line merely because it has reviewId. Uses exact item/store/UOM and retains unique source IDs. Canonical data unchanged. Evidence: case-inbound-display-checks.json. Final native replay is still required.

The six chart/modal checks, ten display/token/payload checks, and three actual case/provider inbound checks pass. Four changed TSX files parse. These are distinct evidence groups, not additional native acceptance claims.

## Remaining notes

- **DSN01** (P3): The three-column execution acknowledgement table is intentionally a small native semantic table, with12px type rather than main DataGrid14px. It is not a fake input: its checkboxes are actual Impact controls. Inspect the phone presentation; consolidate with WorkspaceTable later if one table component is required everywhere. Source: views/CaseDetailView.tsx:122; views/decisions.module.css:1 .ackTable.
- **DSN02** (P3): Metric helpers clamp to one line and do not expose their complete ReactNode text as a title. The screenshots show some reasons truncated. Global dates/definitions remain available; a future tooltip/full helper affordance would improve information access without adding persistent gray paragraphs. Source: components/ui.module.css:10 .metricHelper; components/ui.tsx:42.
- **DSN03** (P3): ConcentrationChart still relies on Highcharts default tooltip styling while composition/trend set original tooltip treatment explicitly. Colors/fonts are correct; verify hover appearance in native QA rather than claiming pixel identity from source. Source: views/MixView.tsx:61.
- **DSN04** (delivery): At audit snapshot this file shows the scrolled trend, not the Summary card section. Parent acknowledged and will recapture; do not use it as the Summary illustration. Source: qa/redesign/browser-r67/final-DygDkuZn/plr-summary.jpg.

Unused old scaffolding rules remain in some CSS files, including native table/modal/map styles. They are not active UI and were not counted as visible defects. The original-style Iris textarea is deliberate, and matrix/breadth state buttons are required domain controls.

## Efficient remaining acceptance

- Replay repaired inbound display after final build: visible200, compatible selling-unit label, save guard201 rejected/200 accepted.
- Replay repaired chart/image preview: no default date cloud; collapsed table row exact drill; original modal on desktop and phone.
- Native matrix arrow crossing/Enter and390px paginated pair-list; comparison5/6 bound; saved-view full local/table state restore.
- Report Loading and Retained failure geometry/date after Failed/Retry already observed; Iris other period/denominator/context-change paths.
- Current native exports require independent parsed-file proof. Existing export-workbook-validation.json is non-browser4×4/$24K evidence only.
- Final1024/390 detail/configuration/case/Iris geometry, frozen screenshot captions, extracted source clean build and portable package boots.

The current journal contains 20 newer observations across Bv/Dyg/ptsd builds, separate from18 earlier targeted checks. Preserve failures and repaired replays. The runbook maps90 requirements but does not assert they all passed.

Actual download analysis is waiting for parent to place files in the workspace: macOS denied Downloads enumeration even after authorized read-only escalation. Earlier generated or priority workbooks must not substitute for current UI-download evidence.
