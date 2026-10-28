# Assort — Hindsight demo

The working build is a **QA candidate**, with **Overview / Deep Dive / Decisions**, separate In-season and PLR modes, and the recovered original app shell, Impact controls, tokens, tables and Iris chrome. Browser acceptance is still in progress. This is a synthetic-data design-session prototype; it does not connect to a production F&D system.

Frozen phase-one archives remain under `artifacts/`; the verified three-tab priority archives remain under `artifacts/priority-fixes/`. Those snapshots are unchanged. The original priority experience is also available in the working app at `/assort/hindsight/legacy`. Candidate engineering archives use `artifacts/redesign-candidate/`; they are not a final signoff.

## Run

Node.js 22 on macOS was tested. Versions are locked; Windows execution was not tested.

```sh
npm ci --legacy-peer-deps
npm run dev
```

Open **http://127.0.0.1:5173/assort/hindsight**. For a production build:

```sh
npm run build
npm run preview
```

Open **http://127.0.0.1:5174/assort/hindsight**. Rebuild and reload the production preview after source changes. Old `/agentic-assort/*` links preserve their suffix, query, hash and state through the canonical `/assort/*` redirect.

The build requires no business backend. Local browser fixtures handle adjacent prototype flows. `npm ci` generates the matching `public/mockServiceWorker.js`. Service Workers require localhost or HTTPS; opening `index.html` through `file://` will not work. If an obsolete preview worker remains, close old preview tabs and reload the current build.

## Current candidate behavior

The shared synthetic flooring master contains **72 products and 45 stores**. Full SS26 season totals are **$8.4M sales and 182,400 selling units**; the In-season default is **R4**, so its totals are smaller. Quantity UOM is **Selling units · definition TBC**, never inferred as square feet. New business formulas and demo policy versions are proposals for client review, not approved client definitions.

PLR uses an approved review/calendar and contiguous completed selling-window cutoff; In-season uses flexible periods. Product, location, period, inventory date, range date, population, comparison and local drill cohorts remain explicit. A selected empty population stays empty. Demo Comp is opt-in and freezes a versioned eligible store cohort for both periods. Stock/range snapshots are independently dated; missing historical evidence stays unavailable.

Back/Forward and saved configurations restore scope, local pair/week cuts and personal table/chart controls. Per-mode session storage retains browser-local cases, drafts, observations and learnings. Local reset is explicit. These records are not stored in a business backend. Role/access choices are illustrative local projections, not production authentication or authorization. Approval is distinct from execution; execution acknowledgement records a local reference only.

The single existing header Iris entry opens the recovered chat host. Responses are clearly labeled, computed from frozen visible evidence. Recognized ambiguous product/store/time/denominator references ask for explicit choices; this is a deterministic guard, not a general NLP service. Retry/manual routes remain available. No live generative AI, feedback delivery or backend execution is connected. The S15 denominator example remains a one-row inference with cell aliases, not a governed universal formula or direct workbook-cell viewer.

Report-card loading, failure, retained evidence and Retry are local rehearsal states exposed through Demo settings; they are not production request failure simulation. Canonical zero/missing/restricted/stale metric states remain distinct. Temporary notifications use the original Toast component; unavailable-storage warnings remain visible.

## Source and provenance

- `src/modules/hindsight/redesign/`: mounted workspace, selectors, canonical demo data, lifecycle helpers, scope/session context and views.
- `src/pages/Hindsight/`, `src/modules/hindsight/priority/`: preserved three-tab priority experience.
- `src/mocks/flooringDemo/`, `src/mocks/pdfData/`: synthetic priority ledger and recovered original fixtures for adjacent flows.
- `src/shared/components/`, `src/app/layouts/`, `src/design-system/`: recovered shared controls, shell and tokens.
- `vendor/impact-ui/`: recovered published library source, including published sources nested under `dist/node_modules`.
- `public/fonts.css`, `public/vendor/`, `src/assets/`: local fonts/icons/assets.
- `vite.config.ts`: recovery/build adapters and local environment injection.

The reconstruction began with public frontend bundles, source maps and assets from the user-owned preview. It does not recover the private repository, backend, production database, authentication or generative service. Raw recovery evidence is excluded from portable packages. See `PROVENANCE.md` and `qa/source-build.md`.

Recovered `?hash` CSS files become portable `.css.exports.json` export maps in ZIPs. Keep those maps and edit the corresponding ordinary `.module.css`. Vite composes classes; its scope callback must return only the first mapped token.

## Verification and limits

Current shared functional evidence is summarized in `qa/redesign/shared-workspace-integration.md`. The parent browser logs and final full-clause audit are authoritative for native acceptance; source/component passes are not visual proof. Historical phase-one and priority counts describe only those frozen snapshots. A successful Vite production build does not mean the recovered project passes a complete strict TypeScript check: unavailable original type declarations and recovery errors remain.

Native review is ongoing across desktop, phone, filters, saved state, Iris and decision flows. No unqualified pixel-perfect, all-clause-complete, production-security or production-execution claim is made. Native segmented date entry has a tool-specific limitation; actual ImpactInput change-event behavior is tested separately. Export and source lineage evidence is recorded with its exact view/scope and must not be generalized beyond tested states.

This demo is configured for Vercel and Netlify. See [release notes](docs/RELEASE_NOTES.md) and the [next-session test backlog](docs/HINDSIGHT_FOLLOWUP_QA.md). The owner requested publication before the remaining optional acceptance tests; this is a demo release, not full production signoff. Deployment details are recorded in `docs/DEPLOYMENT.md` after publication.

## Candidate package

```sh
npm run build
python3 scripts/package-handoff.py --output artifacts/redesign-candidate --preview --include-redesign
```

The source ZIP contains editable source, locked dependencies, public assets, published UI-library source and QA evidence. It excludes installed dependencies, compiled `dist`, raw recovery bundles and the private original baseline. The built-preview ZIP contains the compiled frontend, a dependency-free Node localhost static server and startup notes. Run `node serve-preview.cjs` inside that extracted preview folder; choose an unused `PORT` if needed.

`qa/redesign/verify-redesign-candidate.py` verifies an independent offline clean install/build and exact emitted JS/CSS identity. Its verification and archive checksums are sidecars, avoiding self-referential ZIP hashes. A candidate snapshot may be refreshed after a native defect; only a later explicit QA promotion makes it a final handoff.
