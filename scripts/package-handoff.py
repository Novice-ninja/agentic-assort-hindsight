#!/usr/bin/env python3
"""Create a portable source handoff; optionally create a separate static preview archive.

Installed dependencies are excluded. Published sources under vendor/impact-ui/dist/node_modules
are part of the component library and are deliberately included.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PREFIX = 'agentic-assort-local'
SKIP_PREFIXES = ('node_modules/', 'vendor/impact-ui/node_modules/', 'qa/baseline-public/')
SKIP_SCRIPTS = {'serve-original.cjs', 'download-vendor.py', 'import-browser-assets.py'}
ROOT_FILES = {'.gitignore', 'README.md', 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'PROVENANCE.md', 'netlify.toml'}

def walk(path: Path):
    for parent, directories, filenames in os.walk(path, followlinks=False):
        relative_parent = Path(parent).relative_to(ROOT)
        directories[:] = sorted(d for d in directories if d not in {'.git', '__pycache__'} and not any(
            (relative_parent / d).as_posix().startswith(prefix.rstrip('/')) for prefix in SKIP_PREFIXES
        ))
        for filename in sorted(filenames):
            if filename == '.DS_Store' or filename.endswith(('.timestamp.mjs', '.pyc')):
                continue
            source = Path(parent) / filename
            relative = source.relative_to(ROOT).as_posix()
            if any(relative.startswith(prefix) for prefix in SKIP_PREFIXES):
                continue
            yield source, relative

def source_files(include_redesign: bool = False):
    for filename in sorted(ROOT_FILES):
        source = ROOT / filename
        if source.is_file():
            yield source, filename
    for directory in ('src', 'public', 'vendor', 'scripts', 'qa'):
        for source, relative in walk(ROOT / directory):
            if not include_redesign and relative.startswith('src/modules/hindsight/redesign/'):
                continue
            if directory == 'scripts' and source.name in SKIP_SCRIPTS:
                continue
            if directory == 'qa':
                # Keep review evidence and executable checks, not intermediate bundle extraction.
                if source.suffix not in {'.md', '.json', '.txt', '.cjs', '.mjs', '.ts', '.py', '.png', '.jpg', '.jpeg', '.xlsx', '.csv', '.log'}:
                    continue
                if source.name.startswith(('recovered-json-', 'asset-symbols', 'compiled-module-ids', 'compiled-vendor-module-sources')):
                    continue
                # Final archive-hash verification is a sidecar: embedding it would change
                # the very ZIP hash that it verifies.
                if source.name in {'package-manifest.json', 'priority-package-verification.json'}:
                    continue
            yield source, relative

def portable_file(source: Path, relative: str):
    data = source.read_bytes()
    css_map = re.search(r'\.module\.css\?[^/]+$', relative)
    if css_map:
        match = re.search(r'export default (\{.*\});?\s*$', data.decode('utf-8'), re.S)
        if not match:
            raise ValueError(f'Invalid recovered CSS export map: {relative}')
        relative = relative.split('?')[0] + '.exports.json'
        data = (json.dumps(json.loads(match.group(1)), indent=2) + '\n').encode()
    for part in Path(relative).parts:
        if re.search(r'[<>:"|?*]', part):
            raise ValueError(f'Nonportable filename remains: {relative}')
    return relative, data, bool(css_map)

def add_bytes(archive: zipfile.ZipFile, name: str, data: bytes):
    info = zipfile.ZipInfo(name, date_time=(2026, 10, 27, 0, 0, 0))
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o100644 << 16
    archive.writestr(info, data, compresslevel=6)

def package_source(output: Path, include_redesign: bool = False):
    output.mkdir(parents=True, exist_ok=True)
    target = output / 'agentic-assort-source.zip'
    manifest = {'kind': 'editable-source', 'source': 'public deployed preview sources, local fixture adapters and recovered assets',
                'excludes': ['installed node_modules', 'dist build', 'raw recovered bundles/maps', 'private original baseline']
                    + ([] if include_redesign else ['unmounted R67 draft source retained in full workspace']),
                'redesignIncluded': include_redesign,
                'candidateOnly': include_redesign,
                'cssExportMapAliases': {}, 'files': []}
    used = set()
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for source, original in source_files(include_redesign):
            relative, data, renamed = portable_file(source, original)
            if relative in used:
                raise ValueError(f'Duplicate archive filename: {relative}')
            used.add(relative)
            if renamed:
                manifest['cssExportMapAliases'][original] = relative
            manifest['files'].append({'path': relative, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
            add_bytes(archive, PREFIX + '/' + relative, data)
        add_bytes(archive, PREFIX + '/HANDOFF.json', (json.dumps(manifest, indent=2) + '\n').encode())
    manifest['archive'] = str(target)
    manifest['archiveBytes'] = target.stat().st_size
    manifest['archiveSha256'] = hashlib.sha256(target.read_bytes()).hexdigest()
    (output / 'package-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return target, len(manifest['files']), len(manifest['cssExportMapAliases'])

def package_preview(output: Path, include_redesign: bool = False):
    if not (ROOT / 'dist/index.html').is_file():
        raise FileNotFoundError('Run npm run build before creating a preview archive.')
    target = output / 'agentic-assort-preview.zip'
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for source, relative in walk(ROOT / 'dist'):
            add_bytes(archive, 'agentic-assort-preview/' + relative, source.read_bytes())
        add_bytes(archive, 'agentic-assort-preview/serve-preview.cjs', (ROOT / 'scripts/serve-built-preview.cjs').read_bytes())
        readme = '''# Assort — ready-built local Hindsight preview

1. Extract this ZIP.
2. Open a terminal in the agentic-assort-preview folder.
3. Run: node serve-preview.cjs
4. Open: http://127.0.0.1:5174/assort/hindsight

Node.js 22 was tested on macOS. No npm install, Python or business backend is required.
Keep the terminal open; press Ctrl+C to stop. If port 5174 is occupied, set PORT to
another free port before running the command, for example on macOS/Linux:
PORT=5176 node serve-preview.cjs

The included dependency-free server binds only to 127.0.0.1. It supplies the correct
asset/worker MIME types and an HTML-route SPA fallback. Browser fixtures provide
business data; the server itself only serves frontend files. Service Workers require
localhost or HTTPS, so opening index.html directly from the filesystem will not work.

This build applies the 27 October priority fixes to Overview, By Item and Sales Mix.
The broader redesign and Section D structural changes are not mounted. Values come
from one synthetic SS26 flooring ledger; new metric definitions are marked TBC.
The old /agentic-assort/* routes redirect compatibly. The original phase-one mirror
is retained in separate unchanged archives. No external Netlify site was renamed.
Local Working Plan and created clustering data reset on hard reload. Iris defaults
to the same connection-error state observed in the original preview; no live AI or
feedback service is connected. The editable source ZIP contains the detailed QA,
provenance and known limits. Windows execution was not tested.
'''
        if include_redesign:
            readme = '''# Assort — redesign candidate preview (QA in progress)

1. Extract this ZIP.
2. Open a terminal in the agentic-assort-preview folder.
3. Run: node serve-preview.cjs
4. Open: http://127.0.0.1:5174/assort/hindsight

If 5174 is occupied, use another free port, for example:
PORT=5177 node serve-preview.cjs

Node.js 22 on macOS was tested. No npm install or business backend is required.
Windows execution was not tested. Keep the terminal open; Ctrl+C stops the server.
The dependency-free server binds only to localhost, serves the frontend with correct
MIME types, and supplies an HTML-only SPA fallback. Open through HTTP, not file://.

This is a candidate, not a final acceptance or deployment. The mounted workspace
uses Overview / Deep Dive / Decisions with separate PLR and In-season scopes.
The synthetic main dataset contains 72 flooring products and 45 stores. Full SS26
season totals are $8.4M sales and 182,400 selling units; the In-season default is R4.
Quantity units and proposed business definitions still require client confirmation.

Iris uses computed, frozen-scope design-session responses and deterministic
clarification controls. No live generative service or business execution is connected.
Decisions, cases, observations and learnings are browser-local demonstrations;
permissions and execution acknowledgement are illustrative, not production security.
Report loading/failure/retry controls are explicitly local rehearsal states.

The original three-tab priority experience is accessible at /assort/hindsight/legacy.
Frozen phase-one and priority archives are retained separately. Old /agentic-assort/*
links redirect compatibly. No Netlify deployment or remote site rename was performed.
Source, provenance, acceptance bounds and QA reports are in the separate source ZIP.
'''
        add_bytes(archive, 'agentic-assort-preview/README.txt', readme.encode())
    return target

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'artifacts' / 'priority-fixes')
    parser.add_argument('--preview', action='store_true', help='Also create a separate archive of the current dist build.')
    parser.add_argument('--include-redesign', action='store_true', help='Include the mounted redesign candidate source and candidate preview notes; omitted from frozen priority handoffs.')
    args = parser.parse_args()
    if args.output.resolve() == (ROOT / 'artifacts').resolve():
        parser.error('The top-level artifacts directory contains the frozen phase-one archives. Use a separate output directory, such as artifacts/priority-fixes.')
    target, count, renamed = package_source(args.output.resolve(), args.include_redesign)
    result = {'sourceArchive': str(target), 'files': count, 'portableCssMaps': renamed, 'bytes': target.stat().st_size}
    if args.preview:
        preview = package_preview(args.output.resolve(), args.include_redesign)
        result['previewArchive'] = str(preview)
        result['previewBytes'] = preview.stat().st_size
        result['previewSha256'] = hashlib.sha256(preview.read_bytes()).hexdigest()
    result['sourceSha256'] = hashlib.sha256(target.read_bytes()).hexdigest()
    print(json.dumps(result, indent=2))
