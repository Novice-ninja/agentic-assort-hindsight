/** Verify client cache identity and explicit scope capture independently of browser providers. */
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const esbuild=require('esbuild');
const root=path.resolve(__dirname,'../..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'assort-insight-cache-'));
const outfile=path.join(temp,'client.cjs'),checks=[];
const priorWindow=global.window;global.window={setTimeout,clearTimeout};
const check=(name,fn)=>{fn();checks.push({name,pass:true});};
(async()=>{
 try {
  await esbuild.build({absWorkingDir:root,stdin:{contents:"export * from './src/modules/hindsight/api/getHindsightSummary';export * from './src/modules/hindsight/services/cardInsightIdentity';",resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile,logLevel:'silent',plugins:[{name:'isolated-http-boundary',setup(build){
   build.onResolve({filter:/^@config\/env$/},()=>({path:'env',namespace:'cache-test'}));
   build.onResolve({filter:/^@shared\/services$/},()=>({path:'http',namespace:'cache-test'}));
   build.onLoad({filter:/.*/,namespace:'cache-test'},args=>({contents:args.path==='env'?"export const env={agentApiBaseUrl:'/api/assort-agent'};export const isDev=false;":"export const apiClient={post:(...args)=>globalThis.__priorityPost(...args)};",loader:'js'}));
  }}]});
  const api=require(outfile),calls=[];
  global.__priorityPost=async(url,body)=>{
   calls.push({url,body:structuredClone(body)});
   return {plan_code:body.planCode,summary:{assortment_and_attributes:JSON.stringify(body.hierarchyScope)}};
  };
  const full=[{levelNo:'l1_name',selectedValues:['Hardwood','Engineered Hardwood','Bamboo']}],cut=[{levelNo:'l1_name',selectedValues:['Bamboo']}],empty=[{levelNo:'l1_name',selectedValues:[]}];
  const read=(hierarchyScope,extra={})=>api.getHindsightSummary({planCode:'PLAN-KB-001',hierarchyScope,...extra});
  const a=await read(full);await read(full);
  check('Identical plan and hierarchy reuse the matching cached summary',()=>assert.equal(calls.length,1));
  const b=await read(cut),c=await read(empty),back=await read(full);
  check('Full to Bamboo to empty to full keeps three isolated narratives and valid cache reuse',()=>{
   assert.equal(calls.length,3);assert.notDeepEqual(a,b);assert.notDeepEqual(b,c);assert.deepEqual(back,a);
   assert.deepEqual(calls[1].body.hierarchyScope,cut);assert.deepEqual(calls[2].body.hierarchyScope,empty);
  });
  await read(cut,{planCode:'OTHER-PLAN'});
  check('Explicit plan and hierarchy are both sent rather than inferred from a default plan',()=>{
   assert.equal(calls.at(-1).body.planCode,'OTHER-PLAN');assert.deepEqual(calls.at(-1).body.hierarchyScope,cut);assert(calls.at(-1).url.includes('OTHER-PLAN'));
  });
  await read(full,{refresh:true});
  check('Regeneration bypasses only the requested cached population',()=>assert.equal(calls.length,5));
  api.clearHindsightSummaryCache();
  const gates=[];
  global.__priorityPost=async(url,body)=>new Promise(resolve=>gates.push({body:structuredClone(body),resolve}));
  const first=read(full),second=read(cut);
  await Promise.resolve();
  gates[1].resolve({summary:{assortment_and_attributes:'Bamboo response'}});await second;
  gates[0].resolve({summary:{assortment_and_attributes:'Full response'}});await first;
  const cachedFull=await read(full),cachedCut=await read(cut);
  check('Out of order requests cannot overwrite another hierarchy cache entry',()=>{
   assert.equal(cachedFull.insights[0].body[0].data,'Full response');assert.equal(cachedCut.insights[0].body[0].data,'Bamboo response');
  });
  check('Card identity changes with actual data, applied hierarchy, plan and season',()=>{
   const x={planCode:'P',seasonCode:78,scope:'brand|flooring:1',payload:{cardType:'segment',hierarchyScope:full,points:[1,2]}};
   const key=api.cardInsightKey(x);assert.equal(key,api.cardInsightKey(structuredClone(x)));
   for(const variant of [{...x,payload:{...x.payload,points:[1,3]}},{...x,payload:{...x.payload,hierarchyScope:cut}},{...x,scope:'brand|flooring:2'},{...x,planCode:'Q'},{...x,seasonCode:74}])assert.notEqual(key,api.cardInsightKey(variant));
  });
  fs.writeFileSync(path.join(__dirname,'priority-insight-cache-checks.json'),JSON.stringify({kind:'Client narrative/cache boundary checks; hook and visual behavior require browser acceptance',passed:checks.length,checks},null,2)+'\n');
  console.log(`${checks.length} client insight cache checks passed.`);
 } finally {delete global.__priorityPost;if(priorWindow===undefined)delete global.window;else global.window=priorWindow;fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
