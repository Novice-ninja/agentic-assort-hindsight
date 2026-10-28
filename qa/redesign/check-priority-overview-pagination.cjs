/** Real React hook client tests in jsdom; no browser automation or production backend. */
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const esbuild=require('esbuild');
const root=path.resolve(__dirname,'../..');fs.mkdirSync(path.join(root,'.local'),{recursive:true});
const temp=fs.mkdtempSync(path.join(root,'.local/overview-pagination-'));
const {JSDOM}=require('jsdom');const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/assort/hindsight',pretendToBeVisual:true});
const prior={};
for(const [key,value] of Object.entries({window:dom.window,document:dom.window.document,navigator:dom.window.navigator,HTMLElement:dom.window.HTMLElement,Element:dom.window.Element,CustomEvent:dom.window.CustomEvent,MutationObserver:dom.window.MutationObserver,IS_REACT_ACT_ENVIRONMENT:true})){
 prior[key]=Object.getOwnPropertyDescriptor(global,key);Object.defineProperty(global,key,{configurable:true,writable:true,value});
}
const React=require('react');const {createRoot}=require('react-dom/client');const {act}=React;
const mounted=new Set();
function renderHook(hook,{initialProps}){
 let props=initialProps;const result={current:undefined};
 function Host(){result.current=hook(props);return null;}
 const container=document.createElement('div');document.body.append(container);const root=createRoot(container);mounted.add(root);
 act(()=>root.render(React.createElement(Host)));
 return{result,rerender(next){act(()=>{props=next;root.render(React.createElement(Host));});},unmount(){act(()=>root.unmount());mounted.delete(root);container.remove();}};
}
function cleanup(){for(const root of mounted)act(()=>root.unmount());mounted.clear();}
const checks=[];
const check=(name,fn)=>{fn();checks.push({name,pass:true});};
(async()=>{
 try {
  const outfile=path.join(temp,'hooks.cjs');
  await esbuild.build({absWorkingDir:root,stdin:{contents:"export * from './src/modules/hindsight/hooks/useTopStyleColors';export * from './src/modules/hindsight/hooks/useOverviewRecommendations';export * from './src/modules/hindsight/priority/flooringScope';",resolveDir:root,loader:'ts'},bundle:true,packages:'external',platform:'node',format:'cjs',outfile,logLevel:'silent',plugins:[{name:'isolate-http-boundary',setup(build){
   build.onResolve({filter:/^@config\/env$/},()=>({path:'env',namespace:'pagination-test'}));build.onResolve({filter:/^@shared\/services$/},()=>({path:'http',namespace:'pagination-test'}));
   build.onLoad({filter:/.*/,namespace:'pagination-test'},a=>({contents:a.path==='env'?"export const env={goApiBaseUrl:'/agentic-assort-go/api'};":"export const apiClient={post:(...args)=>globalThis.__overviewPost(...args)};",loader:'js'}));
  }}]});
  const api=require(outfile),plan='PLAN-KB-001',full=structuredClone(api.getFlooringScope(plan));
  const bamboo=structuredClone(full);bamboo.find(e=>e.levelNo==='l1_name').selectedValues=['Bamboo'];
  const empty=structuredClone(full);empty.find(e=>e.levelNo==='l1_name').selectedValues=[];
  let requests=[];
  global.__overviewPost=(url,body,options={})=>new Promise((resolve,reject)=>requests.push({url,body:structuredClone(body),signal:options.signal,resolve,reject}));
  const response=(request,ids,{cursor='',hasMore=false,totalCount=ids.length}={})=>({status:true,data:{type:request.body.recommendationType,products:ids.map((id,index)=>request.body.recommendationType==='topStyleColors'?{article:id,styleId:id,productName:id,label:'50%',rank:index+1}:{product_id:id,style_id:id,article:id,product_name:id,rank:index+1}),pagination:{cursor,hasMore,totalCount,pageSize:2}}});
  const settle=async(request,ids,pagination)=>act(async()=>{request.resolve(response(request,ids,pagination));await Promise.resolve();});
  for(const kind of ['topStyleColors','missedOpportunities','carryForwards']){
   requests=[];api.applyFlooringScope(full,plan);
   const {result,unmount,rerender}=renderHook(({enabled})=>kind==='topStyleColors'?api.useTopStyleColors({planCode:plan,topN:2,enabled}):api.useOverviewRecommendations({planCode:plan,recommendationType:kind,top:2,enabled}),{initialProps:{enabled:true}});
   assert.equal(requests.length,1);const first=requests[0];await settle(first,['full-1','full-2'],{cursor:'full-next',hasMore:true,totalCount:4});
   act(()=>result.current.loadMore());const oldNext=requests[1];assert.equal(oldNext.body.cursor,'full-next');
   act(()=>api.applyFlooringScope(bamboo,plan));const cutFirst=requests[2];
   check(`${kind}: applying Bamboo starts a fresh captured-scope first page while old pagination is in flight`,()=>{
    assert.equal(requests.length,3);assert.equal(cutFirst.body.cursor,'');assert.deepEqual(cutFirst.body.hierarchyScope,bamboo);assert.equal(oldNext.signal.aborted,true);
    assert.equal(result.current.items.length,0);assert.equal(result.current.hasMore,false);assert.equal(result.current.totalCount,0);assert.equal(result.current.status,'loading');
   });
   await settle(cutFirst,['bamboo-1'],{cursor:'bamboo-next',hasMore:true,totalCount:2});
   await settle(oldNext,['full-stale']);
   const ids=()=>result.current.items.map(i=>i.article);
   check(`${kind}: an out-of-order old next page cannot append rows or clear the new cursor`,()=>{assert.deepEqual(ids(),['bamboo-1']);assert.equal(result.current.totalCount,2);});
   act(()=>result.current.loadMore());const cutNext=requests[3];assert.equal(cutNext.body.cursor,'bamboo-next');assert.deepEqual(cutNext.body.hierarchyScope,bamboo);
   await settle(cutNext,['bamboo-2']);
   check(`${kind}: next pages use only the captured scope and matching cursor`,()=>assert.deepEqual(ids(),['bamboo-1','bamboo-2']));
   const beforeCancel=requests.length;const draft=structuredClone(bamboo);draft.find(e=>e.levelNo==='l1_name').selectedValues=['Hardwood'];rerender({enabled:true});
   check(`${kind}: an unapplied draft and Cancel do not replace the applied rows or fetch`,()=>{assert.equal(requests.length,beforeCancel);assert.deepEqual(ids(),['bamboo-1','bamboo-2']);});
   act(()=>api.applyFlooringScope(empty,plan));const emptyFirst=requests.at(-1);await settle(emptyFirst,[]);
   check(`${kind}: explicit empty scope clears rows, totals and pagination`,()=>{assert.deepEqual(emptyFirst.body.hierarchyScope,empty);assert.equal(emptyFirst.body.cursor,'');assert.deepEqual(ids(),[]);assert.equal(result.current.totalCount,0);assert.equal(result.current.hasMore,false);});
   act(()=>api.applyFlooringScope(full,plan));const allFirst=requests.at(-1);await settle(allFirst,['all-1'],{cursor:'all-next',hasMore:true,totalCount:2});
   check(`${kind}: restoring all begins at page one without a Bamboo cursor`,()=>{assert.equal(allFirst.body.cursor,'');assert.deepEqual(allFirst.body.hierarchyScope,full);assert.deepEqual(ids(),['all-1']);});
   act(()=>result.current.loadMore());const disabledNext=requests.at(-1);rerender({enabled:false});await settle(disabledNext,['late-disabled']);
   check(`${kind}: disabling aborts and invalidates pending pages`,()=>{assert.equal(disabledNext.signal.aborted,true);assert.equal(result.current.status,'idle');assert.deepEqual(ids(),[]);assert.equal(result.current.hasMore,false);});
   rerender({enabled:true});const restart=requests.at(-1);assert.equal(restart.body.cursor,'');unmount();
   await settle(restart,['after-unmount']);
   check(`${kind}: reenable and unmount use a new generation and cancel transport`,()=>assert.equal(restart.signal.aborted,true));
  }
  fs.writeFileSync(path.join(__dirname,'priority-overview-pagination-checks.json'),JSON.stringify({kind:'Actual React hooks in jsdom with deferred API boundary; not Chrome acceptance',passed:checks.length,checks},null,2)+'\n');
  console.log(`${checks.length} Overview client pagination checks passed.`);
 } finally {
  cleanup();delete global.__overviewPost;for(const [key,descriptor] of Object.entries(prior)){if(descriptor)Object.defineProperty(global,key,descriptor);else delete global[key];}
  dom.window.close();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
