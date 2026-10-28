import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'node:http';
import createCache from '@emotion/cache';
// Attach HMR to an unbound in-memory HTTP server: this SSR check opens no network listener.
const unbound=createHttpServer();
const server=await createServer({server:{middlewareMode:true,hmr:{server:unbound}},appType:'custom',logLevel:'error'});
try{
 const ui=await server.ssrLoadModule('/src/modules/hindsight/redesign/components/ui.tsx');
 const emotion=await server.ssrLoadModule('/vendor/impact-ui/dist/node_modules/@emotion/react/dist/emotion-react.browser.esm.js');
 const render=element=>renderToStaticMarkup(React.createElement(emotion.CacheProvider,{value:createCache({key:'ds-qa'})},element));
 const checks=[];
 const check=(name,run)=>{run();checks.push({name,pass:true});};
 const metric=render(React.createElement(ui.MetricCard,{label:'Net sales',value:'$8.4M',comparison:'+12.1% vs LY',helper:'Same canonical population'}));
 check('KPI markup uses both exact recovered background assets',()=>{assert(metric.includes('kpi-card-grid-bg.svg'));assert(metric.includes('kpi-card-ellipse-bg.svg'));assert(metric.includes('$8.4M'));});
 const input=render(React.createElement(ui.DesignInput,{type:'number',label:'Quantity',value:0,min:0,max:100,step:.5,'aria-label':'Quantity test',onChange(){}}));
 check('Real Impact input retains zero and numeric constraints with accessible label',()=>{assert(input.includes('MuiOutlinedInput'));assert(input.includes('value="0"'));assert(input.includes('min="0"'));assert(input.includes('max="100"'));assert(input.includes('step="0.5"'));assert(input.includes('aria-label="Quantity test"'));});
 const textarea=render(React.createElement(ui.DesignTextarea,{label:'Observation',value:'Merchant evidence',onChange(){}}));
 check('Real Impact multiline input renders a textarea with supplied value',()=>{assert(textarea.includes('MuiOutlinedInput'));assert(textarea.includes('<textarea'));assert(textarea.includes('Merchant evidence'));});
 const select=render(React.createElement(ui.NativeDesignSelect,{'aria-label':'Preset',value:'',onChange(){}},React.createElement('option',{value:''},'Off'),React.createElement('option',{value:'a',disabled:true},'Unavailable option')));
 check('Native option adapter renders an actual Impact select with a valid empty-value selection',()=>{assert(select.includes('Off'));assert(select.includes('select'));assert(!select.includes('<select'));});
 const pill=render(React.createElement(ui.Pill,{tone:'success'},'Approved'));
 check('Status pills render the actual recovered Impact Badge',()=>{assert(pill.includes('impact_badges_only_label_subtle'));assert(pill.includes('success-badge-subtle'));assert(pill.includes('Approved'));});
 const card=render(React.createElement(ui.WorkspaceCard,{title:'Store performance',subtitle:'Exact canonical evidence'},'Body'));
 check('Workspace surface preserves semantic labeled section and compact title',()=>{assert(card.includes('<section'));assert(card.includes('aria-labelledby'));assert(card.includes('Store performance'));assert(card.includes('title="Exact canonical evidence"'));});
 fs.writeFileSync('qa/redesign/design-system-ssr-checks.json',JSON.stringify({kind:'Actual recovered vendor/server-render markup checks; not browser interaction or visual acceptance',passed:checks.length,checkCount:checks.length,checks},null,2)+'\n');
 console.log(JSON.stringify({passed:checks.length,checkCount:checks.length}));
}finally{await server.close();}
