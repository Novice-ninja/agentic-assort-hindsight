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

Automatic future deployments are **not connected**. Automatic approval review rejected granting Vercel ongoing access to the private GitHub repository without explicit approval. One-time CLI publication is independent of that optional integration.

## Resume QA

Read `HINDSIGHT_FOLLOWUP_QA.md` first. Compact source tests, matrices and JSON observation journals are committed under `qa/redesign`. Large local screenshots, original client documents and the 158 MiB generated export oracle are excluded; regenerate expected facts using the committed script. Test browser exports as actual downloads, independently of generated workbook controls.

Published URL: pending final Vercel readiness check.
