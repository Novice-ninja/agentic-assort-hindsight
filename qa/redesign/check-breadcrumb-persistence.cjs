/** Actual AppShell/PageChrome route effects; nonlayout chrome components are semantic stand-ins. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'../..'),temp=fs.mkdtempSync(path.join(base,'.local/breadcrumb-check-'));
const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/assort/hindsight/overview',pretendToBeVisual:true});
const previous={};for(const[key,value]of Object.entries({window:dom.window,document:dom.window.document,navigator:dom.window.navigator,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})){previous[key]=Object.getOwnPropertyDescriptor(global,key);Object.defineProperty(global,key,{configurable:true,writable:true,value});}
const React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),{MemoryRouter,Routes,Route,useLocation,useNavigate}=require('react-router-dom');
const checks=[];let root;
(async()=>{try{
 const file=path.join(temp,'app-shell.cjs');
 await esbuild.build({absWorkingDir:base,stdin:{contents:"export {AppShell} from './src/app/layouts/AppShell';export {useSetBreadcrumbAction} from './src/app/layouts/PageChromeContext';",resolveDir:base,loader:'tsx'},bundle:true,platform:'node',format:'cjs',packages:'external',outfile:file,logLevel:'silent',plugins:[{name:'semantic-chrome',setup(build){
  build.onResolve({filter:/@shared\/components\/vendor\/impact-ui$|^\.\/(?:Header|Sidebar|useBreadcrumbItems)$|\.css$/},args=>({path:args.path,namespace:'test-chrome'}));
  build.onResolve({filter:/^react(?:\/.*)?$/},args=>({path:args.path,external:true}));
  build.onLoad({filter:/.*/,namespace:'test-chrome'},args=>({loader:'js',resolveDir:base,contents:args.path==='i18n'?"export const useTranslation=()=>({t:key=>key})":args.path.endsWith('.css')?'export default {}':args.path.includes('useBreadcrumbItems')?'export const useBreadcrumbItems=()=>[]':args.path.endsWith('/Header')?'export const Header=()=>null':args.path.endsWith('/Sidebar')?'export const Sidebar=()=>null':"import React from 'react';export const ImpactBreadcrumbs=()=>React.createElement('div',null,'Breadcrumbs')"}));
  build.onResolve({filter:/^react-i18next$/},()=>({path:'i18n',namespace:'test-chrome'}));
  build.onLoad({filter:/^i18n$/,namespace:'test-chrome'},()=>({contents:"export const useTranslation=()=>({t:key=>key})",loader:'js'}));
 }}]});
 const api=require(file);let navigate;
 function Publisher(){const set=api.useSetBreadcrumbAction(),location=useLocation();navigate=useNavigate();const primary=location.pathname.includes('deep-dive')||location.pathname.includes('/item/')?'deep-dive':location.pathname.includes('decisions')?'decisions':'overview';React.useEffect(()=>{set(React.createElement('button',{'aria-label':'Review mode'},primary));return()=>set(null);},[set,primary]);return null;}
 function LoadedPublisher(){const[ready,setReady]=React.useState(false);React.useEffect(()=>setReady(true),[]);return ready?React.createElement(Publisher):null;}
 root=createRoot(document.getElementById('root'));
 await act(async()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/assort/hindsight/overview'],future:{v7_startTransition:true,v7_relativeSplatPath:true}},React.createElement(Routes,null,React.createElement(Route,{element:React.createElement(api.AppShell)},React.createElement(Route,{path:'*',element:React.createElement(LoadedPublisher)}))))));
 const run=async pathname=>act(async()=>navigate(pathname));
 const expect=(name,value)=>{assert.equal(document.querySelector('[aria-label="Review mode"]')?.textContent,value);checks.push({name,pass:true});};
 expect('Loaded workspace publishes its breadcrumb mode controls','overview');
 await run('/assort/hindsight/deep-dive/items');expect('Primary navigation to Deep Dive retains controls after parent effects','deep-dive');
 await run('/assort/hindsight/deep-dive/stores');expect('Changing Deep Dive presets keeps the same mounted owner','deep-dive');
 await run('/assort/hindsight/item/10001/performance');expect('Opening a full detail route keeps review controls','deep-dive');
 await run('/assort/hindsight/decisions');expect('Decisions primary navigation retains controls','decisions');
 await run('/assort/hindsight/overview/sales-mix');expect('Return to Overview subview retains controls','overview');
 fs.writeFileSync(path.join(__dirname,'breadcrumb-persistence-checks.json'),JSON.stringify({kind:'Actual recovered AppShell/PageChrome effects in React/jsdom with semantic header/sidebar/breadcrumb rendering; native visual review remains separate',passed:checks.length,checks},null,2)+'\n');console.log(`${checks.length} breadcrumb persistence checks passed.`);
}finally{if(root)await act(async()=>root.unmount());dom.window.close();for(const[key,value]of Object.entries(previous)){if(value)Object.defineProperty(global,key,value);else delete global[key];}fs.rmSync(temp,{recursive:true,force:true});}})().catch(error=>{console.error(error);process.exitCode=1;});
