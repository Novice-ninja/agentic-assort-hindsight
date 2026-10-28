# Deployment handoff

Source: https://github.com/Novice-ninja/agentic-assort-hindsight (private).

Vercel project: `novice-ninjas-projects/agentic-assort-hindsight`.

Initial release source commit: `800f5f9`. Deployment was requested before remaining optional acceptance checks. See [release notes](RELEASE_NOTES.md) and [follow-up QA](HINDSIGHT_FOLLOWUP_QA.md).

## Build and publish

```sh
npm ci --legacy-peer-deps
npm run build
vercel deploy --prod --yes --scope novice-ninjas-projects --archive=tgz
```

`vercel.json` preserves the canonical `/assort/*` and legacy `/agentic-assort/*` single-page routes. The runtime uses synthetic browser-local data and needs HTTPS for its service worker. There is no business backend or shared persistence.

Source was pushed using the existing authenticated GitHub account over HTTPS. Local secrets, installed dependencies, recovery inputs, client attachments and large generated archives were excluded. Required published library files under `vendor/impact-ui/dist/node_modules` are tracked source, not installed root dependencies.

The initial Vercel upload failed; the compressed archive upload succeeded and started the cloud build. Final URL and readiness are recorded below when confirmed. The local `.vercel/project.json` holds the project association and is intentionally ignored.

Automatic future deployments are **not connected**. The user subsequently approved the ongoing integration, but Vercel could not connect to the private repository; browser setup requires GitHub/Vercel sign-in. The user explicitly deferred that sign-in/setup to a later session. One-time CLI publication is complete and independent of this optional integration. Resume from Vercel project Settings → Git after signing in; do not assume future pushes deploy yet.

## Resume QA

Read `HINDSIGHT_FOLLOWUP_QA.md` first. Compact source tests, matrices and JSON observation journals are committed under `qa/redesign`. Large local screenshots, original client documents and the 158 MiB generated export oracle are excluded; regenerate expected facts using the committed script. Test browser exports as actual downloads, independently of generated workbook controls.

## Published release

- App: https://agentic-assort-hindsight.vercel.app/assort/hindsight
- Deployment: `dpl_5Ac2rRB7Upxq3RLkAqaCD9861YN2` — Vercel confirmed `READY`, production.
- Inspection: https://vercel.com/novice-ninjas-projects/agentic-assort-hindsight/5Ac2rRB7Upxq3RLkAqaCD9861YN2
- Hosted smoke check: canonical route returned HTTP 200 without Vercel login; service worker returned JavaScript/HTTP 200 with no-store and root scope. Chrome showed all three primary tabs, 72 styles, 45 stores, R4 sales $845.8K, quantity18.4K, six cases, no broken images and no document overflow at1440 ×722.
- Screenshot: [published Overview](hindsight-live-release.jpg).

This smoke check is not full acceptance. Runtime remains the same frozen synthetic-data demo described in the release notes. Source, configuration, test notes and later documentation-only commits are on `main` in GitHub.
