const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const base=path.resolve(__dirname,'../..'),temp=fs.mkdtempSync(path.join(base,'.local/numeric-presentation-'));
const checks=[];const check=(name,run)=>{run();checks.push({name,pass:true});};
(async()=>{try{
 const file=path.join(temp,'helpers.cjs');
 await esbuild.build({absWorkingDir:base,entryPoints:['src/modules/hindsight/redesign/views/viewHelpers.tsx'],bundle:true,packages:'external',platform:'node',format:'cjs',outfile:file,logLevel:'silent',plugins:[{name:'semantic-controls',setup(build){
 build.onResolve({filter:/@shared\/components\/(?:data|vendor\/impact-ui)$|\.\.\/components\/ui$|^\.\/ScreenChart$|\.css$/},args=>({path:args.path,namespace:'presentation-test'}));
 build.onResolve({filter:/^react(?:\/.*)?$/},args=>({path:args.path,external:true}));
 build.onLoad({filter:/.*/,namespace:'presentation-test'},args=>({loader:'js',resolveDir:base,contents:args.path.endsWith('.css')?'export default {}':args.path==='../components/ui'?"import React from 'react';export const MetricCard=p=>React.createElement('section',null,p.label,p.value,p.comparison,p.helper);export const DesignCheckbox=()=>null;export const DesignInput=()=>null;export const NativeDesignSelect=()=>null;export const DesignTextarea=()=>null;export const Button=()=>null;export const DataState=()=>null;export const Pill=()=>null;export const WorkspaceCard=()=>null;export const DesignPopover=()=>null":args.path.endsWith('ScreenChart')?'export const ScreenChart=()=>null':args.path.endsWith('impact-ui')?'export const ButtonGroup=()=>null':'export const DataGrid=()=>null'}));
 }}]});
 const {Metric,SummaryCards}=require(file);const quantity={value:23288,state:'ok',unit:'SELLING_UNIT_TBC'};
 const html=renderToStaticMarkup(React.createElement(Metric,{metric:quantity}));
 check('Compact numeric text keeps all digits and puts humane unit in tooltip',()=>{assert(html.includes('>23,288</span>'));assert(html.includes('title="23,288 selling units (TBC)"'));});
 const restricted=renderToStaticMarkup(React.createElement(Metric,{metric:{...quantity,state:'restricted',reason:'Margin restricted'}}));
 check('Restricted metric tooltip does not expose a hidden raw number',()=>{assert(!restricted.includes('23,288'));assert(restricted.includes('Restricted'));});
 const mixed=renderToStaticMarkup(React.createElement(Metric,{metric:{value:null,state:'not-applicable',unit:'mixed',reason:'Separate compatible subtotals'}}));
 check('Mixed or unavailable measure remains explicit rather than becoming zero',()=>{assert(mixed.includes('Not applicable'));assert(mixed.includes('Separate compatible subtotals'));});
 const total={quantity};const cards=renderToStaticMarkup(React.createElement(SummaryCards,{total}));
 check('Summary helper formats the source unit for merchants',()=>{assert(cards.includes('selling units (TBC)'));assert(!cards.includes('SELLING_UNIT_TBC'));});
 for(const name of ['ByItemView','ByStoreView']){const text=fs.readFileSync(path.join(base,`src/modules/hindsight/redesign/views/${name}.tsx`),'utf8'),columns=text.split('const columns: Column<')[1].split('  ];')[0];check(`${name} compact grid columns omit inline unit suffixes and show a common unit helper`,()=>{assert(!/\bunit\s*\//.test(columns));assert(text.includes('Quantity and stock: {formatUnit(total.quantity.unit)}'));});}
 fs.writeFileSync(path.join(__dirname,'numeric-unit-presentation-checks.json'),JSON.stringify({kind:'Actual Metric/SummaryCards rendering with semantic MetricCard stand-in plus compact-column source contracts; native clipping retest is separate',passed:checks.length,checks},null,2)+'\n');console.log(`${checks.length} numeric unit presentation checks passed.`);
}finally{fs.rmSync(temp,{recursive:true,force:true});}})().catch(error=>{console.error(error);process.exitCode=1;});
