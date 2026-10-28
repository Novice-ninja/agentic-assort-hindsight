import json,pathlib,shutil,sys,hashlib
root=pathlib.Path(__file__).resolve().parent.parent;vendor=root/'public/vendor';mapping=json.loads((vendor/'url-map.json').read_text());records=[]
for src in sys.argv[1:]:
 for a in json.loads(pathlib.Path(src).read_text()).get('assets',[]):
  if not a['url'].startswith('https://impact-kit'):continue
  dst=vendor/a['name'];shutil.copyfile(a['path'],dst);mapping[a['url']]='/vendor/'+a['name'];records.append({'name':a['name'],'source':a['url'],'sha256':hashlib.sha256(dst.read_bytes()).hexdigest()})
  dist=root/'dist/vendor';dist.mkdir(parents=True,exist_ok=True);shutil.copyfile(dst,dist/a['name'])
(vendor/'url-map.json').write_text(json.dumps(mapping,indent=2))
p=root/'qa/browser-asset-provenance.json';prior=json.loads(p.read_text()) if p.exists() else [];prior.extend(records);p.write_text(json.dumps(prior,indent=2));print('Imported',len(records))
