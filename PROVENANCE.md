# Source provenance

The reconstruction starts from the user-owned deployed preview at:
https://agentic-assort-preview-13118.netlify.app/agentic-assort/hindsight

Publicly delivered JavaScript, CSS, source maps, image assets, font files and observed UI states were recovered during the session on 27 October 2026. Public source maps supplied application and published component module source. The flooring fixture JSON literals were recovered from the delivered preview bundle. This is not a recovery of the team's private repository, backend, production database, authentication service, or generative AI service.

`qa/source-build.md` documents restoration adapters and narrow build/cascade fixes. `qa/data-offline-audit.md` documents local service behavior and intentional differences. `qa/asset-mapping.json`, `qa/css-asset-mapping.json`, and `qa/fixture-provenance.json` record asset/fixture evidence and hashes. `qa/` also retains representative browser comparisons and service-check results.

The public impact-ui package shell is included under `vendor/impact-ui`. All 474 component/library modules present in the deployed source maps were overlaid. Its developer-only Husky prepare hook was removed from package metadata for portable installation; it is not required to build or run this application. One unused development compatibility export was restored for Rollup parsing, as documented in the source build audit. Runtime dependencies are pinned by package-lock.json and retain their respective package licenses.

The full workspace retains the raw downloaded evidence under `recovered/` and the private original frontend baseline under `qa/baseline-public/`. These bulky directories are excluded from the portable source ZIP. The source ZIP includes `HANDOFF.json` with its complete file hashes and CSS export-map filename aliases. Windows-safe CSS export-map JSON files preserve the deployed class names without requiring question marks in filenames.

The phase-one source and ready-built archives under the top-level `artifacts/` directory remain unchanged. Their hashes are recorded in `artifacts/HANDOFF-SHA256.json`. The working source has since received the 27 October priority fixes: renamed Assort routes, three visible tabs, a consistent synthetic SS26 flooring ledger, proposed metric columns and narrow changes to the existing controls. Those new figures are illustrative, with definitions marked TBC; they are not additional recovered client data. Current priority acceptance is tracked separately under `qa/redesign/`.

The broader 67-page redesign source is retained under `src/modules/hindsight/redesign/` in the full working workspace, but is not mounted in this priority release and is excluded from the priority source ZIP by default. The user has now approved Overview / Deep Dive / Decisions for the next stage, after verification of this priority snapshot; the isolated earlier draft needs adaptation to that structure. New handoffs use a separate output folder, `artifacts/priority-fixes/`, without replacing phase one.

The portable archive is an editable local prototype. The default local Iris flow mirrors the observed original connection-error state; a labeled sample responder is an explicit developer opt-in. The separate built-preview archive contains the compiled frontend and a dependency-free localhost static server. No remote Netlify project has been renamed or deployed. See README.md for known limitations and startup commands.

## Mounted redesign candidate

The working source now mounts the approved Overview / Deep Dive / Decisions workspace under `/assort/hindsight/*`, with the priority source experience retained at `/assort/hindsight/legacy`. This supersedes the earlier paragraph describing the redesign as unmounted, which remains historical provenance for the frozen priority package. The new canonical 72-product/45-store ledger is synthetic; it is not recovered client actuals. Proposed metrics, Comp policy, local records, report-state rehearsal and deterministic computed Iris replies are explicitly local design-session behavior.

Candidate source and built-preview archives are created under `artifacts/redesign-candidate/` with `--include-redesign`. Their evidence records the exact source/build snapshot; native acceptance is ongoing and no final promotion or deployment is implied. Frozen phase-one and priority archives remain unchanged. The main candidate Iris behavior differs from the preserved priority connection-error mirror: it demonstrates computed frozen evidence and clarification choices without a live AI service.
