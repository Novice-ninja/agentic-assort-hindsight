#!/usr/bin/env python3
"""Clean-install and rebuild the priority source ZIP without changing the working app.

The source ZIP is a snapshot: this report is written afterwards, so its archive SHA refers
to the tested ZIP even if the report is later included in a refreshed evidence-only archive.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--archive', type=Path, default=ROOT/'artifacts/priority-fixes/agentic-assort-source.zip')
parser.add_argument('--reference-dist', type=Path, default=ROOT/'dist')
parser.add_argument('--output', type=Path, default=ROOT/'qa/redesign/priority-package-verification.json')
parser.add_argument('--online', action='store_true', help='Allow npm registry access instead of using the existing cache only.')
args = parser.parse_args()


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def run(command: list[str], cwd: Path, log: Path) -> None:
    with log.open('w') as output:
        result = subprocess.run(command, cwd=cwd, stdout=output, stderr=subprocess.STDOUT)
    if result.returncode:
        raise RuntimeError(f'{command[0]} failed with {result.returncode}; see {log}')


archive = args.archive.resolve()
work = Path(tempfile.mkdtemp(prefix='assort-priority-source-'))
with zipfile.ZipFile(archive) as zipped:
    for name in zipped.namelist():
        parts = Path(name).parts
        if name.startswith('/') or '..' in parts:
            raise ValueError(f'Unsafe archive path: {name}')
    zipped.extractall(work)
project = work/'agentic-assort-local'
if not (project/'package-lock.json').is_file():
    raise FileNotFoundError('Source ZIP has no package-lock.json.')
if (project/'src/modules/hindsight/redesign').exists():
    raise AssertionError('The priority handoff must omit the unmounted draft redesign.')

# Match the normalized runtime snapshot, including the CSS export-map aliases used by ZIPs.
spec = importlib.util.spec_from_file_location('handoff_packager', ROOT/'scripts/package-handoff.py')
packager = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(packager)
runtime = []
for source, original in packager.source_files():
    if not original.startswith(('src/', 'public/', 'vendor/')) and original not in {
        'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'index.html', 'netlify.toml',
    }:
        continue
    relative, data, _ = packager.portable_file(source, original)
    candidate = project/relative
    if not candidate.is_file() or candidate.read_bytes() != data:
        raise AssertionError(f'Archive differs from the current runtime source: {relative}')
    runtime.append({'path': relative, 'sha256': sha(data)})

install = ['npm', 'ci', '--legacy-peer-deps']
if not args.online:
    install.append('--offline')
logs = ROOT/'qa/redesign'
run(install, project, logs/'priority-clean-install.log')
run(['npm', 'run', 'build'], project, logs/'priority-clean-build.log')

def compiled(folder: Path) -> dict[str, str]:
    return {file.relative_to(folder).as_posix(): sha(file.read_bytes())
            for file in sorted(folder.rglob('*')) if file.is_file() and file.suffix in {'.js', '.css'}}

expected = compiled(args.reference_dist.resolve())
actual = compiled(project/'dist')
if expected != actual:
    missing = sorted(set(expected)-set(actual))
    extra = sorted(set(actual)-set(expected))
    changed = sorted(path for path in set(expected)&set(actual) if expected[path] != actual[path])
    raise AssertionError(f'Compiled snapshot differs: missing={missing}, extra={extra}, changed={changed}')
node = subprocess.check_output(['node', '--version'], text=True).strip()
report = {
    'stage': 'Priority source archive clean install and production rebuild',
    'verifiedAt': datetime.now(timezone.utc).isoformat(),
    'testedPlatform': f'macOS with Node.js {node}; Windows not tested',
    'testedSourceArchive': str(archive.relative_to(ROOT)),
    'testedSourceArchiveSha256': sha(archive.read_bytes()),
    'extractedProject': str(project),
    'excludedUnmountedRedesign': True,
    'cleanInstall': {'command': ' '.join(install), 'exitCode': 0},
    'cleanBuild': {'command': 'npm run build', 'exitCode': 0},
    'compiledComparison': {'reference': str(args.reference_dist.resolve()),
                           'jsCssFiles': len(expected), 'byteIdentical': True, 'files': expected},
    'normalizedRuntimeFiles': {'count': len(runtime), 'allMatchWorkingSource': True,
                               'digest': sha(json.dumps(runtime, sort_keys=True).encode())},
    'notes': [
        'This verifies the packaged runtime source and emitted JS/CSS, not browser acceptance.',
        'Strict whole-project TypeScript checking remains incomplete because original declaration-only files were unavailable.',
        'The extracted project is retained for independent inspection; the working app was not modified.',
    ],
}
args.output.write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps({'passed': True, 'runtimeFiles': len(runtime), 'compiledJsCss': len(expected),
                  'extractedProject': str(project), 'report': str(args.output)}, indent=2))
