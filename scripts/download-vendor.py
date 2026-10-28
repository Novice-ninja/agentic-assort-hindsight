import pathlib,json,urllib.request,concurrent.futures,re,hashlib
root=pathlib.Path(__file__).parent.parent;out=root/'public'/'vendor';urls=set()
for p in (root/'vendor'/'impact-ui').rglob('*'):
 if p.suffix in ('.js','.css'):
  urls.update(re.findall(r'https://impact-kit[^\s\'"`)<>{}\\]+',p.read_text()))
# Only concrete literal assets; no dynamic base URLs.
urls={u for u in urls if re.search(r'\.(svg|png|jpg|woff2?|ttf)(\?.*)?$',u)}
fonts=out/'google-fonts.css';urls.update(re.findall(r'https://fonts.gstatic.com/[^)\s]+',fonts.read_text()))
def get(url):
 name='font-'+hashlib.sha256(url.encode()).hexdigest()[:14]+'.woff2' if 'fonts.gstatic' in url else url.rsplit('/',1)[-1]
 try:
  data=urllib.request.urlopen(url,timeout=30).read();(out/name).write_bytes(data);return url,'/vendor/'+name
 except Exception as e:return url,{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as p:res=dict(p.map(get,sorted(urls)))
mp=json.loads((out/'url-map.json').read_text());mp.update({k:v for k,v in res.items() if isinstance(v,str)});(out/'url-map.json').write_text(json.dumps(mp,indent=2));(out/'download-results.json').write_text(json.dumps(res,indent=2))
s=fonts.read_text()
for a,b in mp.items():s=s.replace(a,b)
fonts.write_text(s)
print('Requested',len(urls),'success',sum(isinstance(v,str) for v in res.values()),'failures',[(k,v) for k,v in res.items() if isinstance(v,dict)])
