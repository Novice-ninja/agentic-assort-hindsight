import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer as createHttpServer} from 'node:http';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'http://localhost/assort/hindsight',pretendToBeVisual:true});
for(const key of['window','document','navigator','HTMLElement','Element','Node','Event','MouseEvent','MutationObserver','getComputedStyle'])Object.defineProperty(globalThis,key,{value:key==='getComputedStyle'?dom.window.getComputedStyle.bind(dom.window):dom.window[key],configurable:true});
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);globalThis.IS_REACT_ACT_ENVIRONMENT=true;
dom.window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});dom.window.HTMLElement.prototype.scrollIntoView=function(){};dom.window.scrollTo=()=>{};
const React=await import('react'),{createRoot}=await import('react-dom/client'),{act}=React,{createServer}=await import('vite'),{default:createCache}=await import('@emotion/cache');
const unbound=createHttpServer(),server=await createServer({server:{middlewareMode:true,hmr:{server:unbound}},appType:'custom',logLevel:'error'}),root=createRoot(document.getElementById('root'));
try{
 const ui=await server.ssrLoadModule('/src/modules/hindsight/redesign/components/ui.tsx'),emotion=await server.ssrLoadModule('/vendor/impact-ui/dist/node_modules/@emotion/react/dist/emotion-react.browser.esm.js');let checkedEvent,selectEvent;
 const checks=[];
 function Harness(){const[checked,setChecked]=React.useState(false),[selected,setSelected]=React.useState('');return React.createElement(React.Fragment,null,React.createElement(ui.DesignCheckbox,{checked,'aria-label':'Select canonical pair',onChange:event=>{checkedEvent=event.target.checked;setChecked(event.target.checked);}}),React.createElement(ui.NativeDesignSelect,{'aria-label':'DS preset',value:selected,onChange:event=>{selectEvent=event.target.value;setSelected(event.target.value);}},React.createElement('option',{value:''},'Off'),React.createElement('option',{value:'velocity'},'Velocity'),React.createElement('option',{value:'denied',disabled:true},'Unavailable')));}
 await act(async()=>{root.render(React.createElement(emotion.CacheProvider,{value:createCache({key:'dsdom'})},React.createElement(Harness)));});
 const checkbox=document.querySelector('input[type=checkbox]');assert.equal(checkbox?.getAttribute('aria-label'),'Select canonical pair');checks.push({name:'Real recovered Checkbox input retains supplied accessible name after vendor overwrite',pass:true});
 await act(async()=>{checkbox.click();});assert.equal(checkedEvent,true);assert(checkbox.checked);checks.push({name:'Real recovered Checkbox click preserves native event.target.checked and controlled state',pass:true});
 fs.writeFileSync('qa/redesign/design-system-dom-markup.html',document.getElementById('root').innerHTML);
 const trigger=document.querySelector('[aria-label="DS preset"]');assert(trigger);await act(async()=>{trigger.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));});
 const options=[...document.querySelectorAll('[role=option]')],velocity=options.find(option=>option.textContent.includes('Velocity'));assert(velocity,'Actual recovered select option did not open');await act(async()=>{velocity.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));});assert.equal(selectEvent,'velocity');checks.push({name:'Actual recovered Select option produces the existing native-compatible value event',pass:true});
 fs.writeFileSync('qa/redesign/design-system-dom-checks.json',JSON.stringify({kind:'Actual recovered vendor components mounted in jsdom; not Chrome or visual acceptance',passed:checks.length,checkCount:checks.length,checks},null,2)+'\n');console.log(JSON.stringify({passed:checks.length}));
}finally{await act(async()=>root.unmount());await server.close();dom.window.close();}
