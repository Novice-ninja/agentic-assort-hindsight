const ts=require('typescript'),fs=require('fs'),path=require('path');const root=path.resolve('src');const aliases=Object.fromEntries(['app','pages','modules','shared','config','mocks','assets','design-system'].map(x=>['@'+x,path.join(root,x)]));
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?files(path.join(dir,d.name)):[path.join(dir,d.name)]).filter(f=>/\.(ts|tsx|js|jsx)$/.test(f));}
const exportedSymbols=new Map(),imports=[];
for(const f of files(root)){let text=fs.readFileSync(f,'utf8');let emitted=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,allowJs:true}}).outputText;const ast=ts.createSourceFile(f,emitted,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 for(const s of ast.statements){if(s.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)){
  if(s.name)exportedSymbols.set(s.name.text,[...(exportedSymbols.get(s.name.text)||[]),f]);
  if(ts.isVariableStatement(s))for(const d of s.declarationList.declarations){ const names=[];function collect(n){if(ts.isIdentifier(n))names.push(n.text);else if(ts.isObjectBindingPattern(n)||ts.isArrayBindingPattern(n))for(const x of n.elements)if(ts.isBindingElement(x))collect(x.name);}collect(d.name);for(const name of names)exportedSymbols.set(name,[...(exportedSymbols.get(name)||[]),f]);}
 }
 if(ts.isExportDeclaration(s)&&s.exportClause&&ts.isNamedExports(s.exportClause))for(const e of s.exportClause.elements)exportedSymbols.set(e.name.text,[...(exportedSymbols.get(e.name.text)||[]),f]);
 if(ts.isImportDeclaration(s)){const p=s.moduleSpecifier.text;if(typeof p!=='string')continue;let base;if(p.startsWith('.'))base=path.resolve(path.dirname(f),p);else if(aliases[p.split('/')[0]])base=path.join(aliases[p.split('/')[0]],p.split('/').slice(1).join('/'));else continue;
 const resolved=['','.ts','.tsx','.js','.jsx','.json','.css','/index.ts','/index.tsx','/index.js'].some(e=>{try{return fs.statSync(base+e).isFile()}catch{return false}});if(resolved)continue;
 const names=s.importClause?.namedBindings&&ts.isNamedImports(s.importClause.namedBindings)?s.importClause.namedBindings.elements.map(x=>x.propertyName?.text||x.name.text):[];imports.push({from:path.relative(process.cwd(),f),specifier:p,target:path.relative(process.cwd(),base),names,default:s.importClause?.name?.text, candidates:Object.fromEntries(names.map(n=>[n,(exportedSymbols.get(n)||[]).map(f=>path.relative(process.cwd(),f))]))});
 }}
}
for(const i of imports)i.candidates=Object.fromEntries(i.names.map(n=>[n,(exportedSymbols.get(n)||[]).map(f=>path.relative(process.cwd(),f))]));
fs.writeFileSync('qa/missing-runtime-imports-ast.json',JSON.stringify(imports,null,2));console.log('Unresolved runtime imports:', imports.length);
