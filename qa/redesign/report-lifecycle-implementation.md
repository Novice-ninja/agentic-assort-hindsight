# Component loading and retry — HSP60, page 60

The local implementation is complete. Eight actual React/provider/card checks and three actual Drawer/control checks pass. Native layout and Chrome walkthrough remain separate acceptance evidence.

`WorkspaceCard` registers its semantic report ID and readable title. Only mounted reports appear under **Filter Settings → Demo settings → Report component rehearsal**. Explicit `reportId` and `reportTitle` props support repeated or non-text headings. The current inventory contains 48 card locations; dynamically titled cards register their actual mounted title.

The four rehearsal states are Ready, Loading, Failed, and Refresh failed with retained evidence. **Show component state** affects the selected report and closes the drawer. It does not apply pending product, location, time, access, or role drafts. The control explicitly discloses that no production request is sent.

Loading and failure preserve the original child DOM and its layout footprint. Hidden content is inert and removed from the accessibility tree. The existing card title stays visible. Skeletons reuse the original SeasonSummaryWidget shimmer. A failure has one real Impact Retry button for that report. Retry changes no scope or view state, and returns keyboard focus to the report heading. A neighboring failed report remains failed.

Retained failure leaves the same evidence readable and shows the source refresh timestamp supplied by the dataset. Independent stock and range dates remain in the existing scope strip. An applied scope or local selection change immediately clears the old rehearsal state, without introducing an apparel/default-category fallback or reactivating that failure after Back. Empty results and missing feeds retain their existing distinct messages and gain no automatic Retry button.

Evidence:

- `report-lifecycle-component-checks.json`: eight checks against the actual provider, WorkspaceCard, boundary and recovered Impact controls. Covers child identity, selected state, sorting, hidden columns, independent failures, timestamp, scope change and live registry cleanup.
- `report-rehearsal-drawer-checks.json`: three checks against the actual Drawer and controls with a semantic workspace host and canonical dataset. Covers the real option event, targeted failure, drawer close, zero Apply calls and component Retry.
- `report-lifecycle-implementation.json`: source checks and card inventory. All five changed/integrated TSX modules parse without errors.
- `report-lifecycle-tsc.log`: the repository still has recovered declaration errors; no diagnostics reference the lifecycle, shared UI, Drawer or WorkspacePage files.

For native verification, select the Overview trend report and rehearse Loading, then Failed. Check its dimensions and neighboring reports. In Deep Dive, select rows, change sort and hide a column before failing Item performance; verify Retry preserves them. Rehearse retained failure and inspect its date. Apply a legitimate empty/missing-data scope separately and confirm its original message remains distinct.

Production request adapters, cache replacement, network timeout policy and service retries remain external integrations. The synchronous local rehearsal demonstrates the specified frontend lifecycle without claiming those services exist. jsdom checks do not establish pixel dimensions or native visual parity.
