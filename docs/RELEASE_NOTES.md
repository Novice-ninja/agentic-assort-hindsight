# Hindsight redesign preview

27 October 2026

This release is a functional frontend demonstration of the redesigned Hindsight workspace. It connects the original PLR review with recent product and store performance, a scoped response draft, and reviewed learnings for the next PLR.

## Included

- Overview, Deep Dive and Decisions use the recovered application design system. PLR and In-season Review retain separate contexts.
- The original PLR keeps its 66 style and 2,970 pair approval fixed. Original actual sales of $8,373,352.01 remain separate from $26,647.99 of later additions and the full 72 style $8.4M season result. Tactical review defaults to four completed weeks, with $845,799.66 sales in the main demo.
- Product, store and pair workspaces share canonical evidence. Item and store tables, the paginated matrix, breadth, mix, source supply rows, saved views, an 87 entry metric library and scoped XLSX exports support investigation.
- Six review queues lead to validated drafts with exact pairs, evidence, owners and dates. Approval, local execution acknowledgement, outcome review and accepted destination learnings remain separate events.
- One header Iris entry and object menu Explain actions use frozen permitted context. Computed demo answers, clarification choices and failure/manual paths are available.
- An explicit illustrative Comp policy applies one location cohort to both comparison periods. Its version, members and exclusions are inspectable; it is not an F&D approved policy.

## Current boundaries

The main ledger contains 72 products and 45 stores with illustrative PLR, range and supply history. Selling units and the prototype fiscal calendar require client confirmation. Pending legacy metric definitions, unknown attributes and missing source fields are disclosed rather than inferred as approved facts.

There is no live F&D backend, external order execution or production entitlement service. Role changes and execution acknowledgements are labeled local simulations. Workspace records persist in browser session storage and are not a shared system of record. A stock snapshot or baseline comparison does not establish lost sales, causal uplift or a measured post-action result.

Geographic coordinates, governed dated cluster targets, specialist traffic/space feeds and some client source formulas are not connected. Corresponding views expose those limitations. The illustrated demo document remains provisional until its remaining screenshots are verified against the final build.

## Verification and deferred work

Selected native browser journeys and automated data, workflow and component regressions have been exercised. The critical authored-metadata permission repair also passed [eight provider, CaseDetail DOM and workbook regression groups](../qa/redesign/authored-permissions-checks.json), including access revocation, reload and restoration of authorized records.

This release does not claim complete native acceptance of all 90 requirements or every final-build desktop, tablet, phone, keyboard and downloaded-workbook path. Remaining QA and noncritical polish were intentionally deferred for the requested urgent publication. Follow [the remaining QA checklist](HINDSIGHT_FOLLOWUP_QA.md), the [90 requirement matrix](../qa/redesign/implementation-acceptance-matrix.json) and the [native event journal](../qa/redesign/browser-r67/final-native-events.json). Event records name the builds actually exercised; checks from earlier builds are not blanket proof of the published build.
