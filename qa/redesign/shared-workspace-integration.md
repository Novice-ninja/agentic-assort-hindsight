# Shared workspace integration — functional foundation, visual review in progress

This note covers the shared shell, scope/session context, global filters, routing and Iris. It is not a completed redesign signoff. The user has asked for closer visual alignment to the recovered original. The shared shell, filters and Iris now reuse the recovered components directly; native Chrome visual review of the coordinated build remains open.

## Integration and preservation

- Canonical workspace route: `/assort/hindsight/*`. Primary navigation is Overview / Deep Dive / Decisions. Deep Dive presets are items, stores, matrix, breadth, attributes and custom.
- Old `/agentic-assort` links preserve their suffix and state through the canonical-prefix redirect. Internal items/stores/mix destinations normalize to the approved primary structure.
- The preserved three-tab source preview is `/assort/hindsight/legacy`. The independently frozen priority package and its running port 5176 server are untouched. New work will be packaged separately under `artifacts/redesign`.
- The workspace uses the single existing header Iris trigger through the host's interceptor. Explanations are menu actions. New detail pages are full routes and retain origin snapshots.

## State and permissions

Each review mode has its own applied scope, local drill, personal view controls and remembered route. Versioned session storage retains locally authored decisions, cases, observations and learnings. Back/Forward restores applied scope, local exact pair/week cohorts, table controls and scroll. Durable published-rule history and saved-view lists are deliberately excluded from navigation rollback.

Products and stores have explicit all/selected/none states. Clearing a selection never broadens it to all. Parent hierarchy changes report invalid children. The draft filter model remains separate until Apply, including prospective role/access changes. A PLR global scope is constrained to its approved calendar, Flooring L0 and a contiguous completed selling-window prefix. Tactical periods are flexible; inventory and range dates remain independent. Local interval drills do not rewrite the global approval.

Saved configurations capture applied scope, route, local drill and personal table/chart controls. Applying one captures the origin first, validates canonical members and stable card/metric IDs, restores the configuration atomically, and retains current access. It cannot republish rules or replace audit history. Unknown or retired references are rejected rather than silently broadening a scope.

The public context projects restricted COGS, planned GM and case/signal values before exposure. Margin-bearing free text is withheld. Unknown permissions are denied. Draft edits whitelist authorable fields and call the pure validation helper. Lifecycle changes use `advanceDecision` only. Approval does not imply execution; local execution acknowledgement requires its separate capability and explicit pair/reference evidence. Accepted learning edits require review permission and record a reviewing actor/time. Cases retain immutable original triggers and append distinct merged signals for a canonical pair.

## Iris evidence boundary

Responses are clearly labeled computed design-session responses, with observed facts separate from hypotheses and field observations. No live generative service or business backend is claimed. A request freezes scope, route, active view controls, exact contributing pair/week selections, data/definition versions and evidence dates. Context changes require Use current view or Keep previous context. A current filtered table with no rows remains an empty assistant cohort. Earlier contexts are projected again when margin access is revoked.

Retry, unavailable and manual-evidence paths remain available. Draft follow-up requires exactly one canonical pair and opens the normal case workflow. The recovered host retains its original chrome, bubbles, composer and controls. Its existing west handle is adapted for pointer and keyboard resizing, with compact448/expanded640 personal width clamped to the viewport. Escape, focus restoration and non-stacking scope/configuration state are implemented; native geometry/focus acceptance remains separate from component state tests. The source PWPS example is explicitly a one-row inference, not a universal governed denominator formula.

## Verification and limits

- `check-workspace-context.cjs`: 50 passing groups in the actual React provider with jsdom/browser-history semantics. Covers mode isolation, Back/Forward/scroll/reload, all/none, PLR prefix policy, exact pair evidence, lifecycle permissions, immutable published history, accepted learning, full saved configurations, access projection unavailable storage, exact diagonal-pair observation provenance, versioned Comp Apply and saved anchors, invalid comparator preservation and local Iris cohort anchoring.
- `check-workspace-iris.cjs`: 11 passing component groups using the real provider, Iris and selectors. The recovered chat host and vendor controls are semantic stand-ins in this test; it is not visual acceptance. Covers header opening/focus, computed evidence, explicit context switching, revocation, retry/manual paths, Escape, panel exclusivity and local reset.
- `check-workspace-filters.cjs`: 9 passing groups using the actual drawer, provider and selectors with semantic vendor-control stand-ins. Covers all eight sections, draft/apply/cancel separation, explicit all/none, canonical Bamboo filtering, independent stock date and approved PLR cutoff. This is state behavior evidence, not visual acceptance.
- `check-iris-real-components.mjs`: 14 passing DOM groups with the actual Header, AIChatProvider (including original host), WorkspaceProvider, recovered Chatbot and FilterPanel. Covers open/close, nested navigation, Filter Cancel/reopen, valid timestamps, pointer/keyboard resizing, width persistence, viewport clamping, and the actual scoped clarification selector/confirmation path. This does not measure native browser geometry.
- `shared-shell-tsc.log`: the recovered application still has inherited missing declaration/type errors. The owned redesign context/components/page files have no targeted TypeScript errors. The coordinated design-system Vite build passed in 10.66 seconds after the coordinated Comp/Iris/report-state integrations and the final PLR table/caption copy repairs, collapsed chart evidence rows and recovered image-preview Modal. Its workspace chunk is `WorkspacePage-ptsd9Lsa.js`; the existing port 5174 preview was independently verified to serve identical current production bytes. All 557 application text files present in emitted source maps exactly match the current source; the complete source manifest contains 1,076 files. See `shared-design-system-build.log` and `shared-design-system-preview-http-check.json`.
- Browser, responsive visual and full cross-view acceptance remain root-owned and ongoing. Passing model/component checks does not establish that every clause or screen is complete.

## Remaining acceptance bounds

Mounted report cards now have a scoped local rehearsal lifecycle for loading, failure and retained stale evidence through ReportStateProvider and the actual WorkspaceCard boundary. Demo settings choose a mounted report and state; Retry clears only that report state and restores focus. This is a clearly labeled local demo, not a production request service. The component-owner checks cover actual provider/card and drawer controls; native end-to-end checks remain pending. Missing/zero/restricted metric semantics are distinct from that rehearsal lifecycle.

The S15 response names E2/H2/K2/L2/N2/AT2 and explicitly labels its arithmetic as a one-row inference; it has no direct source-workbook cell navigation yet. The general evidence action routes to the contributing assortment workspace. A deterministic guard now asks for exact SKU/store, interval, comparator or denominator choices when recognized references are ambiguous or outside the frozen cohort. Twenty pure groups and the actual recovered Select path cover this behavior. It does not claim general natural-language understanding or a generative backend.

The original filter strip's click-only +N interaction is inherited. Its complete accessible summary and All Filters provide alternate access to the membership values, but this is not a keyboard implementation of the +N popover. The final native keyboard/responsive/focus walkthrough and all cross-view clause checks remain open.

## Coordinated additions in the current QA build

- Demo Comp is opt-in; the default remains the complete canonical assortment. Global Apply captures a policy/version/window and exact eligible store cohort. Invalid policies/comparators preserve the previous scope. Local time cuts freeze that cohort, and saved views require a valid preserved anchor. A visible Demo Comp context label exposes the count/version.
- New workspace notifications use the original ToastProvider once per notice. Success/info messages expire; an unavailable-storage warning stays visible. Form validation stays in its originating form. Native post-workflow toast acceptance is pending.
- The source compile still reports inherited recovered-app declaration errors. There are no targeted TypeScript errors in the redesigned module; Vite production compilation passes. Native browser/visual acceptance is recorded by the parent and is not inferred from these component checks.
