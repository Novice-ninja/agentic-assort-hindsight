#!/usr/bin/env python3
"""Record current emitted-source and localhost byte checks; never implies native acceptance."""
from pathlib import Path
import argparse
import hashlib
import json
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--origin', default='http://127.0.0.1:5174')
parser.add_argument('--purpose', default='Coordinated frozen-source QA build')
args = parser.parse_args()
qa = ROOT/'qa/redesign'
checked = {}
for mapped in ROOT.glob('dist/assets/*.map'):
    try:
        contents = json.loads(mapped.read_text())
    except (ValueError, UnicodeError):
        continue
    for source, content in zip(contents.get('sources', []), contents.get('sourcesContent', [])):
        if content is None:
            continue
        file = (mapped.parent/source.split('?', 1)[0]).resolve()
        if not file.is_relative_to(ROOT/'src') or not file.is_file() or file.suffix not in {'.ts', '.tsx', '.js', '.jsx', '.css', '.json'}:
            continue
        checked[str(file.relative_to(ROOT))] = {'same': file.read_text() == content, 'map': str(mapped.relative_to(ROOT))}
result = {
    'purpose': 'Current emitted source-map text compared with source; not native acceptance.',
    'checkedFiles': len(checked),
    'exactMatches': sum(value['same'] for value in checked.values()),
    'differences': [{'file': key, 'map': value['map']} for key, value in checked.items() if not value['same']],
}
(qa/'coordinated-build-source-map-check.json').write_text(json.dumps(result, indent=2)+'\n')
assert not result['differences'], result['differences']
manifest = {str(file.relative_to(ROOT)): hashlib.sha256(file.read_bytes()).hexdigest()
            for file in sorted(ROOT.glob('src/**/*')) if file.is_file()}
(qa/'coordinated-source-hashes.json').write_text(json.dumps({
    'scope': 'All application source files under src at coordinated build; separate from native acceptance.',
    'files': len(manifest), 'sha256': manifest}, indent=2)+'\n')
js = next(ROOT.glob('dist/assets/WorkspacePage-*.js'))
read = lambda path: urllib.request.urlopen(args.origin+path).read()
http = {
    'origin': args.origin, 'route': '/assort/hindsight/overview',
    'indexMatchesCurrent': read('/assort/hindsight/overview') == (ROOT/'dist/index.html').read_bytes(),
    'workspaceMatchesCurrent': read('/assets/'+js.name) == js.read_bytes(),
    'workspaceChunk': js.name, 'workspaceSha256': hashlib.sha256(js.read_bytes()).hexdigest(),
    'css': [file.name for file in ROOT.glob('dist/assets/WorkspacePage-*.css')],
    'browserAppearanceVerified': False, 'purpose': args.purpose,
}
assert http['indexMatchesCurrent'] and http['workspaceMatchesCurrent']
(qa/'shared-design-system-preview-http-check.json').write_text(json.dumps(http, indent=2)+'\n')
print(json.dumps({'sourceMap': result, 'sourceFiles': len(manifest), 'http': http}, indent=2))
