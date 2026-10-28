#!/usr/bin/env python3
"""Independently install and rebuild the candidate source ZIP, without changing the working app."""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--archive', type=Path, default=ROOT/'artifacts/redesign-candidate/agentic-assort-source.zip')
parser.add_argument('--reference-dist', type=Path, default=ROOT/'dist')
parser.add_argument('--output', type=Path, default=ROOT/'artifacts/redesign-candidate/package-verification.json')
args = parser.parse_args()

def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def run(command: list[str], cwd: Path, log: Path) -> None:
    with log.open('w') as output:
        result = subprocess.run(command, cwd=cwd, stdout=output, stderr=subprocess.STDOUT)
    if result.returncode:
        raise RuntimeError(f'{command[0]} failed with {result.returncode}; see {log}')

archive = args.archive.resolve()
work = Path(tempfile.mkdtemp(prefix='assort-redesign-candidate-source-'))
with zipfile.ZipFile(archive) as zipped:
    if zipped.testzip() is not None:
        raise AssertionError('ZIP integrity test failed.')
    for name in zipped.namelist():
        if name.startswith('/') or '..' in Path(name).parts:
            raise ValueError(f'Unsafe archive path: {name}')
    metadata = json.loads(zipped.read('agentic-assort-local/HANDOFF.json'))
    for entry in metadata['files']:
        payload = zipped.read('agentic-assort-local/' + entry['path'])
        if len(payload) != entry['bytes'] or sha(payload) != entry['sha256']:
            raise AssertionError('Manifest mismatch: ' + entry['path'])
        if re.search(r'[<>:"|?*]', entry['path']):
            raise AssertionError('Nonportable filename: ' + entry['path'])
    names = zipped.namelist()
    if any(name.startswith('agentic-assort-local/node_modules/') for name in names):
        raise AssertionError('Installed root dependencies must not be packaged.')
    if not any(name.startswith('agentic-assort-local/vendor/impact-ui/dist/node_modules/') for name in names):
        raise AssertionError('Published nested component-library sources are missing.')
    zipped.extractall(work)
project = work/'agentic-assort-local'
if not (project/'package-lock.json').is_file():
    raise FileNotFoundError('Source ZIP has no package-lock.json.')
if not (project/'src/modules/hindsight/redesign/WorkspacePage.tsx').is_file():
    raise AssertionError('The candidate must include the mounted redesign source.')

spec = importlib.util.spec_from_file_location('handoff_packager', ROOT/'scripts/package-handoff.py')
packager = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(packager)
runtime = []
for source, original in packager.source_files(include_redesign=True):
    if not original.startswith(('src/', 'public/', 'vendor/')) and original not in {
        'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'index.html', 'netlify.toml',
    }:
        continue
    relative, data, _ = packager.portable_file(source, original)
    candidate = project/relative
    if not candidate.is_file() or candidate.read_bytes() != data:
        raise AssertionError(f'Archive differs from the current runtime source: {relative}')
    runtime.append({'path': relative, 'sha256': sha(data)})

install = ['npm', 'ci', '--legacy-peer-deps', '--offline', '--no-audit', '--no-fund']
run(install, project, ROOT/'qa/redesign/candidate-clean-install.log')
run(['npm', 'run', 'build'], project, ROOT/'qa/redesign/candidate-clean-build.log')

def compiled(folder: Path) -> dict[str, str]:
    return {file.relative_to(folder).as_posix(): sha(file.read_bytes())
            for file in sorted(folder.rglob('*')) if file.is_file() and file.suffix in {'.js', '.css'}}

expected, actual = compiled(args.reference_dist.resolve()), compiled(project/'dist')
if expected != actual:
    missing, extra = sorted(set(expected)-set(actual)), sorted(set(actual)-set(expected))
    changed = sorted(path for path in set(expected)&set(actual) if expected[path] != actual[path])
    raise AssertionError(f'Compiled snapshot differs: missing={missing}, extra={extra}, changed={changed}')
node = subprocess.check_output(['node', '--version'], text=True).strip()
report = {
    'stage': 'Redesign candidate independent offline clean install and production rebuild; not final acceptance',
    'verifiedAt': datetime.now(timezone.utc).isoformat(),
    'testedPlatform': f'macOS with Node.js {node}; Windows not tested',
    'testedSourceArchive': str(archive.relative_to(ROOT)),
    'testedSourceArchiveSha256': sha(archive.read_bytes()),
    'extractedProject': str(project),
    'includedMountedRedesign': True,
    'zipIntegrityAndEveryManifestEntry': 'passed',
    'windowsSafeFilenames': True,
    'installedDependenciesExcluded': True,
    'publishedNestedVendorSourcesIncluded': True,
    'cleanInstall': {'command': ' '.join(install), 'exitCode': 0},
    'cleanBuild': {'command': 'npm run build', 'exitCode': 0},
    'compiledComparison': {'reference': str(args.reference_dist.resolve()), 'jsCssFiles': len(expected), 'byteIdentical': True, 'files': expected},
    'normalizedRuntimeFiles': {'count': len(runtime), 'allMatchWorkingSource': True, 'digest': sha(json.dumps(runtime, sort_keys=True).encode())},
    'notes': [
        'This verifies packaged runtime source and emitted JS/CSS, not native browser acceptance.',
        'Strict whole-project TypeScript checking remains incomplete because original declaration-only files were unavailable.',
        'The independent extracted project is retained; the working app and frozen archives were not modified.',
        'This candidate is not final full-clause signoff or a deployment.',
    ],
}
args.output.write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps({'passed': True, 'runtimeFiles': len(runtime), 'compiledJsCss': len(expected), 'extractedProject': str(project), 'report': str(args.output)}, indent=2))
