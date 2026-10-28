import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {createServer} from 'vite';
import {createServer as createHttpServer} from 'node:http';
import createCache from '@emotion/cache';
const server=await createServer({server:{middlewareMode:true,hmr:{server:createHttpServer()}},appType:'custom',logLevel:'error'});
const checks=[];
try{
 const ui=await server.ssrLoadModule('/src/modules/hindsight/redesign/components/ui.tsx');
 const emotion=await server.ssrLoadModule('/vendor/impact-ui/dist/node_modules/@emotion/react/dist/emotion-react.browser.esm.js');
 for(const width of [180,'100%']){
  const html=renderToStaticMarkup(React.createElement(emotion.CacheProvider,{value:createCache({key:'sizing-qa'})},React.createElement(ui.DesignSelect,{width,value:'sales',options:[{value:'sales',label:'Net sales'}],onChange(){}})));
  const doc=new JSDOM(html).window.document,trigger=doc.querySelector('[role=combobox]');
  assert(trigger,'actual vendor combobox is present');
  const vendor=trigger.closest('.ia-select-main-container-v3'),wrapper=vendor.parentElement,container=vendor.lastElementChild;
  assert.equal(wrapper.style.width,width===180?'180px':'100%');
  assert.equal(wrapper.style.flexBasis,width===180?'180px':'100%');
  assert.equal(container.style.width,'100%');
  assert.notEqual(container.style.width,'0px');
  assert.equal(trigger.style.width,'100%');
  checks.push({name:`Select ${width} wrapper owns width/basis and actual vendor container does not collapse to zero`,pass:true});
 }
 fs.writeFileSync('qa/redesign/select-sizing-contract-checks.json',JSON.stringify({kind:'Actual recovered vendor markup/inline-sizing contract only; native geometry is separately reviewed in Chrome',passed:checks.length,checks},null,2)+'\n');
 console.log(`${checks.length} actual vendor Select sizing contracts passed.`);
}finally{await server.close();}
