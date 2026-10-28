import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { seriesColour } from '@shared/components/charts';
import { aggregatePairs, formatUnit, getMixRows, selectScopedPairs, type MixRow } from '../data';
import { useViewState, useWorkspace } from '../context/WorkspaceContext';
import { Button, DataState, DesignInput, NativeDesignSelect, EvidenceMenu, Pill, SectionHeading, Toolbar, WorkspaceCard } from '../components/ui';
import { ColumnChooser, DataTable, Metric, Tabs, stableSort, tableDefaults, type Column, type TableState } from './viewHelpers';
import { analysisScope } from './analysisScope';
import { exportRows } from '../helpers/exportWorkbook';
import styles from './mix.module.css';

const labels: Record<string,string> = {brand:'Brand',species:'Species',color:'Colour',finish:'Finish',subcategory:'Subcategory',gbb:'Assigned Good / Better / Best'};
export function MixView() {
  const {scope,dataset,localSelection,setLocalSelection,navigate,explainView,route}=useWorkspace();
  const [settings,setSettings]=useViewState('mix-settings',{lens:'brand',measure:'sales' as 'sales'|'quantity',view:'composition'});
  const [state,setState]=useViewState<TableState>('mix-table',{...tableDefaults,sort:{key:'sales',direction:'desc'}});
  const effectiveScope=useMemo(()=>analysisScope(scope,localSelection,dataset),[scope,localSelection,dataset]);
  const pairs=useMemo(()=>selectScopedPairs(effectiveScope,dataset).filter(pair=>(!localSelection?.itemIds||localSelection.itemIds.includes(pair.itemId))&&(!localSelection?.storeIds||localSelection.storeIds.includes(pair.storeId))&&(!localSelection?.pairIds||localSelection.pairIds.includes(pair.id))&&(!localSelection?.attribute||String((pair.item as any)[localSelection.attribute.lens]??'Unknown')===localSelection.attribute.value)),[effectiveScope,dataset,localSelection]);
  const total=useMemo(()=>aggregatePairs(pairs,dataset),[pairs,dataset]);
  const lens=settings.view==='gbb'?'gbb':settings.lens;
  const source=useMemo(()=>getMixRows(effectiveScope,lens,dataset,pairs),[effectiveScope,lens,dataset,pairs]);
  const rows=stableSort(source.filter(row=>row.label.toLowerCase().includes(state.search.toLowerCase())),state.sort,(row,key)=>key==='label'?row.label:key==='skuCount'?row.skuCount:(row as any)[key]?.value??null);
  const drill=(row:MixRow)=>navigate({view:'items'},{localSelection:{...localSelection,label:`${labels[lens]} · ${row.label}`,itemIds:row.itemIds,pairIds:row.pairIds,attribute:undefined}});
  const columns:Column<MixRow>[]=[
    {key:'label',label:labels[lens],locked:true,render:row=><button className={styles.link} onClick={()=>drill(row)}>{row.label}</button>,value:row=>row.label},
    {key:'skuCount',label:'Distinct SKUs',numeric:true,render:row=>row.skuCount},
    {key:'skuShare',label:'SKU share %',numeric:true,render:row=><Metric metric={row.skuShare}/>},
    {key:'sales',label:'Net sales $',numeric:true,render:row=><Metric metric={row.sales}/>},
    {key:'salesShare',label:'Sales share %',numeric:true,render:row=><Metric metric={row.salesShare}/>},
    {key:'quantity',label:'Compatible quantity',numeric:true,render:row=><Metric metric={row.quantity}/>},
    {key:'quantityShare',label:'Quantity share %',numeric:true,render:row=><Metric metric={row.quantityShare}/>},
    {key:'gmRate',label:'GM %',numeric:true,render:row=><Metric metric={row.gmRate}/>},
    {key:'asp',label:'Average unit retail',numeric:true,render:row=><Metric metric={row.asp}/>},
    {key:'productivityIndex',label:'Sales share / SKU share',numeric:true,render:row=><Metric metric={row.productivityIndex}/>},
    ...(lens==='gbb'||(scope.mode==='plr'&&lens==='color')?[{key:'attributeAsOf',label:'Assignment basis',render:(row:MixRow)=><>{row.attributeBasis}<small className={styles.assignmentDate}>{row.attributeAsOf??'Effective date unavailable'}</small></>}]:[]),
  ];
  const chartRows=source.slice().sort((a,b)=>(settings.measure==='sales'?b.sales.value??-Infinity:b.quantity.value??-Infinity)-(settings.measure==='sales'?a.sales.value??-Infinity:a.quantity.value??-Infinity));
  const contribution=(row:MixRow)=>settings.measure==='sales'?row.salesShare:row.quantityShare;
  const options=useMemo<Highcharts.Options>(()=>({chart:{type:'bar',backgroundColor:'transparent',height:Math.max(300,chartRows.length*56+65),style:{fontFamily:'Manrope, sans-serif'},spacing:[12,16,10,8]},title:{text:undefined},credits:{enabled:false},accessibility:{enabled:false},xAxis:{categories:chartRows.map(row=>row.label),lineColor:'#dce1e9',tickLength:0,labels:{style:{fontSize:'12px',color:'#60697d'}}},yAxis:{title:{text:'Share of the same selected population (%)',style:{fontSize:'11px',color:'#737d8e'}},gridLineColor:'#e7eaf0',gridLineDashStyle:'Dash',labels:{format:'{value}%',style:{fontSize:'11px',color:'#737d8e'}}},legend:{align:'left',itemStyle:{fontSize:'13px',fontWeight:'400',color:'#60697d'}},tooltip:{shared:true,valueSuffix:'%',valueDecimals:1,useHTML:true,className:'custom-tooltip',borderWidth:0,borderRadius:8,backgroundColor:'var(--color-surface, #ffffff)',style:{fontFamily:'Manrope, sans-serif',fontSize:'12px',color:'var(--color-text-primary, #1f2b4d)'}},plotOptions:{series:{animation:false,cursor:'pointer',point:{events:{click(){const row=chartRows[this.index];if(row)drill(row)}}}},bar:{borderWidth:0,borderRadius:3,groupPadding:.18,pointPadding:.1}},series:[{type:'bar',name:'Assortment share · distinct SKUs',color:seriesColour(1),data:chartRows.map(row=>row.skuShare.value)},{type:'bar',name:settings.measure==='sales'?'Net sales share':'Compatible quantity share',color:seriesColour(0),data:chartRows.map(row=>contribution(row).value)}]}),[source,settings.measure,scope,dataset,localSelection]);
  const concentration=chartRows.map((row,index)=>({...row,rank:index+1,cumulative:chartRows.slice(0,index+1).reduce((sum,value)=>sum+(contribution(value).value??0),0)}));
  const concentrationAvailable=chartRows.every(row=>(settings.measure==='sales'?row.sales.value:row.quantity.value)!==null&&(settings.measure==='sales'?row.sales.value!:row.quantity.value!)>=0&&contribution(row).value!==null);
  const exportView=()=>{
    const visiblePairIds=new Set(rows.flatMap(row=>row.pairIds));
    const contributingPairs=pairs.filter(pair=>visiblePairIds.has(pair.id));
    exportRows(`Mix ${lens}`,rows.map(row=>({...row})),effectiveScope,{dataset,contributingPairs,viewState:{
      ...state,lens,measure:settings.measure,localSelection,
      visibleGroupIds:rows.map(row=>row.id),
      exportedContributingPairCount:contributingPairs.length,
      shareDenominator:{basis:'Applied and local population before group search; group shares are not renormalized by search',itemCount:total.itemCount,storeCount:total.storeCount,pairCount:total.pairCount,sales:total.sales,quantity:total.quantity},
    }});
  };
  return <div className={styles.stack}>
    <SectionHeading title={route.view==='overview'?'Sales mix':'Attributes'} description="Compare assortment space with contribution, then investigate the exact products behind a group." actions={<Button disabled={!rows.length} onClick={exportView}>Export visible groups</Button>}/>
    {localSelection&&<div className={styles.selection}><span>Local selection · {localSelection.label}</span><Button variant="ghost" onClick={()=>setLocalSelection(null)}>Clear local selection</Button></div>}
    <Tabs value={settings.view} label="Mix views" tabs={[{id:'composition',label:'Composition'},{id:'concentration',label:'Concentration'},{id:'gbb',label:'Good / Better / Best'}]} onChange={view=>setSettings({...settings,view})}/>
    <Toolbar ariaLabel="Mix controls">{settings.view!=='gbb'&&<label>Attribute <NativeDesignSelect aria-label="Mix attribute" value={settings.lens} onChange={event=>setSettings({...settings,lens:event.target.value})}>{Object.entries(labels).filter(([key])=>key!=='gbb').map(([key,label])=><option key={key} value={key}>{label}</option>)}</NativeDesignSelect></label>}<label>Contribution <NativeDesignSelect aria-label="Mix contribution measure" value={settings.measure} onChange={event=>setSettings({...settings,measure:event.target.value as typeof settings.measure})}><option value="sales">Net sales</option><option value="quantity">Compatible quantity</option></NativeDesignSelect></label><Pill>{total.itemCount} distinct SKUs · {total.storeCount} stores · {total.pairCount} contributing pairs</Pill></Toolbar>
    {!rows.length?<DataState state="empty" description="No canonical product groups match the applied scope and local selection."/>:<>
      {settings.view==='gbb'&&<div className={styles.explanation}><Pill tone="purple">Assigned tiers</Pill><span>Good / Better / Best comes from product assignments, never a ranking by realized AUR. Unassigned products stay visible as Unknown. Assignment dates and governance are synthetic in this design session.</span></div>}
      <WorkspaceCard title={settings.view==='concentration'?`${labels[lens]} concentration`:`${labels[lens]} · assortment and contribution`} subtitle={settings.view==='concentration'?'Additive contribution ordered from largest to smallest; the cumulative curve uses the same denominator.':'Two measures, one product population. Select a group to inspect its exact contributing products.'} actions={<EvidenceMenu title="Mix analysis" definition="SKU share = distinct contributing SKUs in a group / all distinct contributing SKUs. Sales share = group net sales / scoped net sales. Productivity index = sales share / SKU share. Compatible quantity uses a single known unit; mixed units do not become an invented combined total." onExport={exportView} onExplain={()=>explainView({title:`${labels[lens]} mix`,metricId:'K34',selection:{label:`${lens} mix`,itemIds:[...new Set(pairs.map(pair=>pair.itemId))]},evidence:pairs.map(pair=>pair.id)})}/> }>
        {settings.measure==='quantity'&&total.quantity.value===null?<DataState state={total.quantity.state} title="A compatible quantity denominator is unavailable" description={total.quantity.reason??'Choose a single compatible unit, or use net sales.'}/>:settings.view==='concentration'?concentrationAvailable?<ConcentrationChart rows={concentration} measure={settings.measure} onDrill={drill}/>:<DataState state="no-positive-base" title="A cumulative concentration curve is not meaningful for this cut" description="Negative, missing or nonpositive-base contributions remain visible in the evidence table. They are not replaced by zeros in a Pareto curve."/>:<div className={styles.chart} aria-hidden="true"><HighchartsReact highcharts={Highcharts} options={options}/></div>}
        <p className={styles.note}>All {source.length} groups are included. Unknown values retain their numerator and denominator. Shares can differ by 0.1 percentage points when displayed values are rounded. Every group is also available as an accessible table link below.</p>
      </WorkspaceCard>
      <WorkspaceCard title={`${labels[lens]} evidence`} subtitle={`The same rows and denominator as the chart. Quantity unit: ${formatUnit(total.quantity.unit)}. Search limits visible groups; shares retain the applied denominator.`}><Toolbar><DesignInput type="search" aria-label="Search attribute groups" placeholder="Search groups" value={state.search} onChange={event=>setState({...state,search:event.target.value})}/><ColumnChooser columns={columns} hidden={state.hidden} onChange={hidden=>setState({...state,hidden})}/></Toolbar><DataTable rows={rows} columns={columns} state={state} onChange={setState} label="Attribute group evidence" total={<><strong>Distinct scoped total</strong><span>{total.itemCount} SKUs</span><span>Net sales <Metric metric={total.sales}/></span><span>Compatible quantity <Metric metric={total.quantity} unit/></span></>}/></WorkspaceCard>
    </>}
  </div>;
}

function ConcentrationChart({rows,measure,onDrill}:{rows:(MixRow&{rank:number;cumulative:number})[];measure:'sales'|'quantity';onDrill:(row:MixRow)=>void}) {
  const options:Highcharts.Options={chart:{height:330,backgroundColor:'transparent',style:{fontFamily:'Manrope, sans-serif'}},title:{text:undefined},credits:{enabled:false},accessibility:{enabled:false},xAxis:{categories:rows.map(row=>row.label),labels:{style:{fontSize:'11px',color:'#737d8e'}},lineColor:'#dce1e9',tickLength:0},yAxis:[{title:{text:measure==='sales'?'Net sales (USD)':'Compatible quantity'},gridLineColor:'#e7eaf0',gridLineDashStyle:'Dash'},{title:{text:'Cumulative share (%)'},opposite:true,max:100,labels:{format:'{value}%'}}],legend:{itemStyle:{fontSize:'13px',fontWeight:'400'}},plotOptions:{series:{animation:false,cursor:'pointer',point:{events:{click(){const row=rows[this.index];if(row)onDrill(row)}}}}},series:[{type:'column',name:measure==='sales'?'Net sales':'Compatible quantity',color:seriesColour(1),borderRadius:3,data:rows.map(row=>measure==='sales'?row.sales.value:row.quantity.value)},{type:'line',name:'Cumulative contribution',color:seriesColour(0),yAxis:1,data:rows.map(row=>row.cumulative),tooltip:{valueSuffix:'%',valueDecimals:1}}]};
  return <div className={styles.chart} aria-hidden="true"><HighchartsReact highcharts={Highcharts} options={options}/></div>;
}
