/** Component state tests in jsdom using the real provider, Iris component and selectors. Vendor buttons and chat host are semantic stand-ins; this is not visual/Chrome acceptance. */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), esbuild = require('esbuild');
const { JSDOM } = require('jsdom'), base = path.resolve(__dirname, '../..'), temp = fs.mkdtempSync(path.join(base, '.local/workspace-iris-'));
const dom = new JSDOM('<!doctype html><html><body><main id="main-content"></main><button id="header-iris">Ask Iris</button><div id="test-root"></div></body></html>', { url: 'http://localhost/assort/hindsight?mode=in-season', pretendToBeVisual: true });
const prior = {};
for (const [key,value] of Object.entries({ window:dom.window,document:dom.window.document,navigator:dom.window.navigator,HTMLElement:dom.window.HTMLElement,Element:dom.window.Element,CustomEvent:dom.window.CustomEvent,Event:dom.window.Event,requestAnimationFrame:dom.window.requestAnimationFrame.bind(dom.window),cancelAnimationFrame:dom.window.cancelAnimationFrame.bind(dom.window),IS_REACT_ACT_ENVIRONMENT:true })) { prior[key]=Object.getOwnPropertyDescriptor(global,key);Object.defineProperty(global,key,{configurable:true,writable:true,value}); }
const React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),{BrowserRouter}=require('react-router-dom');
const checks=[], test=(name,fn)=>{fn();checks.push({name,pass:true});}, pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const click = element => { assert(element,'Expected interaction control'); element.click(); };
(async()=>{let root;try{
 const file=path.join(temp,'iris.cjs');
 await esbuild.build({absWorkingDir:base,stdin:{contents:"export * from './src/modules/hindsight/redesign/context/WorkspaceContext';export * from './src/modules/hindsight/redesign/components/IrisWorkspace';",resolveDir:base,loader:'tsx'},bundle:true,packages:'external',platform:'node',format:'cjs',outfile:file,loader:{'.css':'empty','.svg':'dataurl'},logLevel:'silent',plugins:[{name:'semantic-test-boundaries',setup(build){
  build.onResolve({filter:/^\.\/ui$/},()=>({path:'buttons',namespace:'iris-test'}));build.onResolve({filter:/^@shared\/components\/primitives\/AIChatPanel$/},()=>({path:'panel',namespace:'iris-test'}));build.onResolve({filter:/^@shared\/context$/},()=>({path:'chat',namespace:'iris-test'}));build.onResolve({filter:/^@shared\/components\/vendor\/impact-ui$/},()=>({path:'buttons',namespace:'iris-test'}));
  build.onLoad({filter:/.*/,namespace:'iris-test'},args=>({resolveDir:base,loader:'js',contents:args.path==='panel'?"import React from 'react';export function AIChatPanel({open,conversation,customInput,onClose}){if(!open)return null;const messages=Object.values(conversation.conversations)[0].messages;return React.createElement('div',{role:'dialog','aria-label':'Iris'},React.createElement('button',{'aria-label':'Close Iris chat',onClick:onClose},'Close'),messages.map(m=>React.createElement('div',{key:m.id},m.jsx||m.bodyText)),customInput)}":args.path==='chat'?"const registerOpenChatInterceptor=(callback)=>{globalThis.__irisOpen=callback};const closeChat=()=>{};export const useAIChat=()=>({registerOpenChatInterceptor,closeChat});":"import React from 'react';export function Button({htmlType,type,variant,size,children,...props}){return React.createElement('button',{...props,type:htmlType||'button'},children)};export function DesignCheckbox({label,checked,onCheckedChange}){return React.createElement('label',null,React.createElement('input',{type:'checkbox',checked,onChange:e=>onCheckedChange(e.target.checked)}),label)};export const NativeDesignSelect=({children,label,orientation,width,searchable,...props})=>React.createElement('label',null,label,React.createElement('select',props,children));export const Pill=({children})=>React.createElement('span',null,children);export const ImpactBadge=()=>null,ImpactCheckbox=()=>null,ImpactInput=()=>null,ImpactSelect=()=>null,Popover=()=>null,ImpactTooltip=({children})=>children;"}));
 }}]});
 const api=require(file);let current;
 function Host(){current=api.useWorkspace();return React.createElement(api.IrisWorkspace);}
 root=createRoot(document.getElementById('test-root'));
 const run=async(fn,delay=25)=>{await act(async()=>{fn();await pause(delay);});await act(async()=>{await pause(35);});};
 await run(()=>root.render(React.createElement(BrowserRouter,{future:{v7_startTransition:true,v7_relativeSplatPath:true}},React.createElement(api.WorkspaceProvider,null,React.createElement(Host)))));
 const header=document.getElementById('header-iris');header.onclick=()=>global.__irisOpen({source:'header'});header.focus();
 await run(()=>click(header));
 test('One existing header interceptor opens the new contextual panel and focuses its composer',()=>{assert(document.querySelector('[data-testid="redesign-iris"]'));assert.equal(document.activeElement.id,'redesign-iris-prompt');assert(document.body.textContent.includes('Context ·'));});
 const find=text=>Array.from(document.querySelectorAll('button')).find(button=>button.textContent.trim()===text);
 const submit=()=>document.querySelector('form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
 await run(()=>click(find('What needs attention? ↗')));
 await run(submit,520);
 test('A sent question produces clearly labeled computed facts, hypothesis and contributing evidence',()=>{assert(document.body.textContent.includes('Computed demo response · observed facts'));assert(document.body.textContent.includes('Frozen selection: 72 distinct SKUs'));assert(document.body.textContent.includes('A hypothesis, not a measured cause.'));assert(find('Open contributing evidence'));});
 await run(()=>current.patchScope({productIds:[current.dataset.products[0].id],productSelection:'selected'}));
 test('Applying a new scope retains old evidence and requires an explicit context choice',()=>{assert(document.body.textContent.includes('View context changed'));assert(document.querySelector('button[aria-label="Send Iris question"]').disabled);});
 await run(()=>click(find('Keep previous context')));
 test('Keep previous context permits another question without rewriting earlier answers',()=>{assert(!document.body.textContent.includes('View context changed'));assert(document.body.textContent.includes('72 distinct SKUs'));});
 await run(()=>current.patchScope({window:'R13'}));
 await run(()=>click(find('Use current view')));
 test('Use current view adopts the new scope for later questions while preserving earlier answer scope',()=>{assert(!document.body.textContent.includes('View context changed'));assert(document.querySelector('[data-testid="redesign-iris"]').textContent.includes('R13'));assert(document.body.textContent.includes('72 distinct SKUs'));});
 await run(()=>current.applyScope({...current.scope,access:'restricted-margin'},{access:'restricted-margin',role:'viewer'}));
 test('Access revocation cannot expose denied financial context and disables authoring',()=>{assert.equal(current.can('draft'),false);assert(current.dataset.facts.every(fact=>fact.recognizedCogs===null));});
 await run(()=>{document.querySelector('details:last-child').open=true;});
 await run(()=>click(document.querySelector('.tools input')||Array.from(document.querySelectorAll('input[type="checkbox"]'))[0]));
 await run(()=>click(find('Start a new contextual conversation')));
 await run(()=>click(find('What needs attention? ↗')));
 await run(submit,520);
 test('Unavailable assistant retains the question, offers retry and manual evidence without blocking the workspace',()=>{assert(document.body.textContent.includes('Iris is unavailable'));assert(find('Retry'));assert(find('Open evidence'));assert(find('Continue manually'));});
 await run(()=>click(find('Retry')),100);
 test('Retry computes against the same frozen context and restores evidence actions',()=>{assert(!document.body.textContent.includes('Iris is unavailable'));assert(document.body.textContent.includes('Frozen selection: 1 distinct SKUs'));});
 await run(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
 test('Escape closes the panel and restores focus to its original header entry',()=>{assert.equal(document.querySelector('[data-testid="redesign-iris"]'),null);assert.equal(document.activeElement,header);});
 await run(()=>click(header));
 await run(()=>current.setActivePanel('filters'));
 test('Opening a scope dialog closes Iris so panels do not stack',()=>assert.equal(document.querySelector('[data-testid="redesign-iris"]'),null));
 await run(()=>current.resetDemo());
 await run(()=>click(header));
 test('Local demo reset clears prior assistant exchanges without affecting the existing header entry',()=>{assert(document.body.textContent.includes('What would you like to understand?'));assert(!document.body.textContent.includes('Computed demo response · observed facts'));});
 fs.writeFileSync(path.join(__dirname,'workspace-iris-checks.json'),JSON.stringify({kind:'Real React provider/Iris in jsdom, semantic vendor button/chat-host stand-ins, no Chrome/visual claim',passed:checks.length,checks},null,2)+'\n');console.log(`${checks.length} Iris component checks passed.`);
}finally{if(root)await act(async()=>root.unmount());delete global.__irisOpen;dom.window.close();for(const[key,descriptor]of Object.entries(prior)){if(descriptor)Object.defineProperty(global,key,descriptor);else delete global[key];}fs.rmSync(temp,{recursive:true,force:true});}})().catch(error=>{console.error(error);process.exitCode=1;});
