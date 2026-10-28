import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer as createHttpServer} from 'node:http';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'http://localhost/assort/hindsight',pretendToBeVisual:true});
for(const key of['window','document','navigator','HTMLElement','Element','Node','Event','MouseEvent','MutationObserver','getComputedStyle'])Object.defineProperty(globalThis,key,{value:key==='getComputedStyle'?dom.window.getComputedStyle.bind(dom.window):dom.window[key],configurable:true});
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);globalThis.IS_REACT_ACT_ENVIRONMENT=true;dom.window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});
const React=await import('react'),{createRoot}=await import('react-dom/client'),{act}=React,{createServer}=await import('vite'),{default:createCache}=await import('@emotion/cache');
const server=await createServer({server:{middlewareMode:true,hmr:{server:createHttpServer()}},appType:'custom',logLevel:'error'}),root=createRoot(document.getElementById('root')),checks=[];
try{const ui=await server.ssrLoadModule('/src/modules/hindsight/redesign/components/ui.tsx'),emotion=await server.ssrLoadModule('/vendor/impact-ui/dist/node_modules/@emotion/react/dist/emotion-react.browser.esm.js');let received=[];
 function Harness(){const[value,setValue]=React.useState('2026-08-07');return React.createElement(ui.DesignInput,{type:'date',label:'Observation window end','aria-label':'Observation window end',value,min:'2026-01-01',max:'2026-12-31',onChange:event=>{received.push(event.target.value);setValue(event.target.value);}});}
 await act(async()=>root.render(React.createElement(emotion.CacheProvider,{value:createCache({key:'dateqa'})},React.createElement(Harness))));
 const input=document.querySelector('input[type=date]');assert(input);assert.equal(input.value,'2026-08-07');assert.equal(input.min,'2026-01-01');assert.equal(input.max,'2026-12-31');checks.push({name:'Actual Impact date input preserves controlled ISO date and bounds',pass:true});
 const setter=Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set;
 await act(async()=>{setter.call(input,'2026-07-31');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
 assert.deepEqual(received,['2026-07-31']);assert.equal(input.value,'2026-07-31');assert.equal(input.getAttribute('value'),'2026-07-31');checks.push({name:'Native input event changes the actual Impact date field and controlled React value',pass:true});
 await act(async()=>{setter.call(input,'2026-07-24');input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});assert.equal(received.at(-1),'2026-07-24');assert.equal(input.value,'2026-07-24');checks.push({name:'Native change event also forwards the ISO date without segmentation coercion',pass:true});
 await act(async()=>{setter.call(input,'');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});assert.equal(received.at(-1),'');assert.equal(input.value,'');checks.push({name:'Clearing a date forwards an empty value for explicit validation',pass:true});
 fs.writeFileSync('qa/redesign/design-input-date-checks.json',JSON.stringify({kind:'Actual recovered ImpactInput and shared DesignInput mounted in jsdom, native input/change events; no native Chrome date-segmentation automation claim',passed:checks.length,checks},null,2)+'\n');console.log(`${checks.length} actual date input checks passed.`);
}finally{await act(async()=>root.unmount());await server.close();dom.window.close();}
