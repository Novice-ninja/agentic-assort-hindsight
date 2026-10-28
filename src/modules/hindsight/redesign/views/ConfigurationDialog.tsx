import { useEffect, useState } from 'react';
import { Modal as ImpactModal } from 'impact-ui/Modal';
import { ImpactTabs } from '@shared/components/vendor/impact-ui';
import { metricCatalogue, type Scope } from '../data';
import { useWorkspace } from '../context/WorkspaceContext';
import type { ViewConfiguration, WorkspaceRoute } from '../context/types';
import { Button, DesignCheckbox, DesignInput, DesignSelect, Pill } from '../components/ui';
import { cardAvailability, defaultOverviewCards } from './overviewPolicy';
import styles from './configuration.module.css';

interface SavedViewBase { id:string; name:string; visibility:'Personal'|'Shared'; createdAt:string; sourceVersion:string; }
interface SavedView extends SavedViewBase { schema:2; configuration:ViewConfiguration; }
interface LegacySavedView extends SavedViewBase { schema:1; scope:Scope; route:WorkspaceRoute; cards:string[]; }
type StoredView = SavedView | LegacySavedView;
const TABS = [{value:'cards',label:'Summary cards'},{value:'library',label:'Metric library'},{value:'saved',label:'Saved views'}];
const marginCards = new Set(['K03','K04']);

export function ConfigurationDialog({open,section,onClose}:{open:boolean;section:'customize'|'saved';onClose:()=>void}) {
  const {mode,scope,dataset,getViewState,saveViewState,can,addNotice,captureViewConfiguration,applyViewConfiguration}=useWorkspace();
  const [tab,setTab]=useState(section==='saved'?'saved':'cards'),[search,setSearch]=useState(''),[selected,setSelected]=useState<string[]>([]);
  const [name,setName]=useState(''),[visibility,setVisibility]=useState<'Personal'|'Shared'>('Personal'),[expanded,setExpanded]=useState(''),[error,setError]=useState('');
  const [editingViewId,setEditingViewId]=useState<string|null>(null);
  useEffect(()=>{if(open){setTab(section==='saved'?'saved':'cards');setSelected([...getViewState('overview-cards',defaultOverviewCards(mode))]);setSearch('');setError('');setExpanded('');setEditingViewId(null);}},[open,section,mode,getViewState]);
  const catalogue=metricCatalogue,validIds=new Set([...catalogue.map(metric=>metric.id),'ranged-out']);
  const filtered=catalogue.filter(metric=>`${metric.id} ${metric.name} ${metric.source_labels} ${metric.evidence_status} ${metric.base_definition}`.toLowerCase().includes(search.toLowerCase()));
  const saved=getViewState<StoredView[]>('saved-workspace-views',[]);
  const canEdit=(view:StoredView)=>can(view.visibility==='Shared'?'publish-view':'save-personal-view');
  const cardsFor=(view:StoredView):string[]=>view.schema===2?(view.configuration.viewState['overview-cards'] as string[]|undefined)??defaultOverviewCards(view.configuration.scope.mode):view.cards;
  const cardProblem=(cards:string[],cardMode:string)=>cards.length!==6||new Set(cards).size!==6?'Choose six different Summary cards.':cards.some(id=>!validIds.has(id))?'This layout contains retired or unknown metric IDs. Remove those cards or restore the mode defaults.':cards.some(id=>!cardAvailability(cardMode,id).available)?'This layout contains metrics without a supported Summary calculation for this review mode. Remove those cards or restore the mode defaults.':'';
  const toggle=(id:string,checked:boolean)=>{setError('');setSelected(current=>checked?[...new Set([...current,id])]:current.filter(previous=>previous!==id));};
  const applyCards=()=>{
    const problem=cardProblem(selected,mode);if(problem){setError(problem);return;}
    if(editingViewId){
      const target=saved.find(view=>view.id===editingViewId);
      if(!target||target.schema!==2||!canEdit(target)){setError('This saved view cannot be updated with your current permissions.');return;}
      saveViewState('saved-workspace-views',saved.map(view=>view.id===target.id?{...target,configuration:{...target.configuration,viewState:{...target.configuration.viewState,'overview-cards':[...selected]}}}:view));
      addNotice(`${target.name}: six-card layout updated. Saved filters, selections and table settings are retained.`);setEditingViewId(null);setTab('saved');setError('');return;
    }
    saveViewState('overview-cards',[...selected]);addNotice(`Six Summary cards saved for ${mode==='plr'?'PLR':'In-season'} review.`);onClose();
  };
  const save=()=>{
    if(!name.trim()){setError('Give this view a name.');return;}
    if(!can(visibility==='Shared'?'publish-view':'save-personal-view')){setError('Your current role cannot save this view at that visibility.');return;}
    if(saved.some(view=>view.name.toLowerCase()===name.trim().toLowerCase())){setError('That view name already exists in this review mode.');return;}
    const configuration=captureViewConfiguration();
    configuration.viewState['overview-cards']=[...getViewState('overview-cards',defaultOverviewCards(mode))];
    const problem=cardProblem(configuration.viewState['overview-cards'] as string[],configuration.scope.mode);
    if(problem){setError(`Save a supported card layout first. ${problem}`);return;}
    const view:SavedView={id:`saved-${Date.now()}`,schema:2,name:name.trim(),configuration,visibility,createdAt:new Date().toISOString(),sourceVersion:dataset.version};
    saveViewState('saved-workspace-views',[...saved,view]);setName('');setError('');addNotice(`${view.name} saved with filters, local selections and view settings. Local design-session storage only.`);
  };
  const apply=(view:StoredView)=>{
    if(view.schema!==2){setError('This older view saved only scope and cards. Remove it and save the current view to capture local selections and table settings.');return;}
    const problem=cardProblem(cardsFor(view),view.configuration.scope.mode);
    if(problem){setError(`${view.name}: ${problem} Use Review cards to update the saved layout.`);return;}
    if(applyViewConfiguration(view.configuration)){addNotice(`${view.name} applied with saved filters, selections and view settings. Current access permissions are retained.`);onClose();}
    else setError('This saved view could not be applied. Its target, members, metric IDs or approved PLR calendar are no longer valid. The current workspace has been retained.');
  };
  const cardReason=(id:string)=>!cardAvailability(mode,id).available?cardAvailability(mode,id).reason:scope.access==='restricted-margin'&&marginCards.has(id)?'Restricted by your current access. Values remain withheld in cards, exports and Iris. An existing protected card slot may be retained.':'';
  const selectedProblem=cardProblem(selected,mode);
  return <ImpactModal open={open} onClose={onClose} title={section==='saved'?'Saved views':'Hindsight configuration'} className={styles.dialog} width="min(880px, calc(100vw - 32px))" height="min(760px, calc(100dvh - 40px))" maxHeight="calc(100dvh - 32px)" disableEnforceFocus footerOptions={<><Button onClick={onClose}>{tab==='cards'?'Cancel':'Close'}</Button>{tab==='cards'&&<Button variant="primary" disabled={!!selectedProblem} onClick={applyCards}>{editingViewId?'Update saved cards':'Save cards'}</Button>}</>}>
    <div className={styles.body}>
      <ImpactTabs tabNames={TABS} tabPanels={TABS.map(()=>null)} value={tab} isBlueBg={false} onChange={(_event,value)=>{setTab(String(value));setError('');if(value!=='cards')setEditingViewId(null);}}/>
      <p className={styles.note}>{mode==='plr'?'PLR review':'In-season review'} settings · {tab==='cards'?'Choose the six metrics that support this review. Changes apply when you save.':tab==='library'?'Stable metric definitions, source aliases and evidence status.':'Return to a saved scope and workspace configuration.'}</p>
      {error&&<div className={styles.error} role="alert">{error}</div>}
      {(tab==='cards'||tab==='library')&&<>
        <DesignInput className={styles.search} label="Search metrics" type="search" aria-label="Search metric library" placeholder="Name, stable ID, source alias or definition" value={search} onChange={event=>setSearch(event.target.value)}/>
        {tab==='cards'&&<div className={styles.selection}><div><strong>{selected.length} of 6 cards selected</strong>{editingViewId&&<small>Editing {saved.find(view=>view.id===editingViewId)?.name}</small>}</div><Button variant="ghost" onClick={()=>{setSelected(defaultOverviewCards(mode));setError('');}}>Restore mode defaults</Button><p>{selected.map(id=>id==='ranged-out'?'Ranged-out pairs':catalogue.find(metric=>metric.id===id)?.name??`${id} · retired`).join(' · ')}</p></div>}
        <p className={styles.note}>{filtered.length} of {catalogue.length} registered metrics. {tab==='cards'?'Metrics without a supported Summary calculation show why they cannot be selected.':'Observed, inferred and proposed evidence labels are preserved. A definition does not establish a connected source feed.'}</p>
        {tab==='cards'&&selected.filter(id=>!validIds.has(id)).map(id=><article className={styles.metric} key={id}><div className={styles.checkbox}><DesignCheckbox aria-label={`Remove retired card ${id}`} checked onChange={event=>toggle(id,event.target.checked)}/></div><div><strong>{id} · retired or unknown metric</strong><p>Remove this card or restore defaults before saving.</p></div></article>)}
        {tab==='cards'&&(!search||'ranged-out item store pairs'.includes(search.toLowerCase()))&&<article className={styles.metric}><div className={styles.checkbox}><DesignCheckbox aria-label="Show ranged-out item–store pairs" checked={selected.includes('ranged-out')} disabled={!selected.includes('ranged-out')&&(!cardAvailability(mode,'ranged-out').available||selected.length>=6)} onChange={event=>toggle('ranged-out',event.target.checked)}/></div><div className={styles.metricContent}><div className={styles.metricTitle}><strong>Ranged-out item–store pairs</strong><Pill>Derived count</Pill></div><p>Distinct currently ranged canonical pairs with known sellable inventory equal to zero. Unknown and negative stock remain separate states. This is a pair count, not stockout days.</p>{!cardAvailability(mode,'ranged-out').available&&<small className={styles.availability}>{cardAvailability(mode,'ranged-out').reason}</small>}</div></article>}
        <div className={styles.metrics}>{filtered.map(metric=>{
          const checked=selected.includes(metric.id),reason=cardReason(metric.id),unsupported=!cardAvailability(mode,metric.id).available;
          return <article key={metric.id} className={`${styles.metric} ${tab==='cards'&&unsupported?styles.unavailable:''}`}>
            {tab==='cards'&&<div className={styles.checkbox}><DesignCheckbox aria-label={`Show ${metric.id} ${metric.name}`} checked={checked} disabled={!checked&&(!!reason||selected.length>=6)} onChange={event=>toggle(metric.id,event.target.checked)}/></div>}
            <div className={styles.metricContent}><div className={styles.metricTitle}><strong>{metric.id} · {metric.name}</strong><Pill tone={metric.evidence_status.toLowerCase().includes('infer')?'warning':'neutral'}>{metric.evidence_status}</Pill>{tab==='cards'&&scope.access==='restricted-margin'&&marginCards.has(metric.id)&&<Pill>Restricted</Pill>}</div><p>{metric.base_definition}</p><small>Source aliases: {metric.source_labels||'Proposed; no confirmed alias'}</small>{tab==='cards'&&reason&&<small className={styles.availability}>{reason}</small>}<Button variant="ghost" className={styles.definitionButton} aria-expanded={expanded===metric.id} onClick={()=>setExpanded(expanded===metric.id?'':metric.id)}>{expanded===metric.id?'Hide definition':'View definition'}</Button>
              {expanded===metric.id&&<dl className={styles.definition}><dt>Grain / unit</dt><dd>{metric.grain_unit}</dd><dt>Aggregation guards</dt><dd>{metric.aggregation_guards}</dd><dt>Evidence</dt><dd>{metric.evidence}</dd><dt>Definition question</dt><dd>{metric.decisions_questions||'Client source-owner validation required.'}</dd><dt>Access and missing data</dt><dd>Restricted values are withheld before aggregation, exports and Iris context. Unknown, missing, invalid-base and valid zero remain separate states.</dd><dt>Version</dt><dd>Proposed base-v2 · source {dataset.version}</dd></dl>}
            </div>
          </article>;
        })}</div>
      </>}
      {tab==='saved'&&<>
        <div className={styles.form}><DesignInput label="View name" aria-label="Saved view name" value={name} onChange={event=>setName(event.target.value)} placeholder="SS26 Flooring · recent availability"/><DesignSelect label="Visibility" orientation="top" aria-label="Saved view visibility" value={visibility} width="100%" options={[{value:'Personal',label:'Personal'},{value:'Shared',label:'Shared',disabled:!can('publish-view')}]} onChange={value=>setVisibility(value as typeof visibility)}/><Button variant="primary" disabled={!name.trim()||!can(visibility==='Shared'?'publish-view':'save-personal-view')} onClick={save}>Save current view</Button></div>
        <p className={styles.note}>Save global filters and dates, local product/store/pair/week selections, the active tab, table search, conditions, sorting, grouping, columns, row selection and chart settings. Current permissions always apply. Decision and rule records remain independent.</p>
        {saved.length?<ul className={styles.saved}>{saved.map(view=>{
          const viewScope=view.schema===2?view.configuration.scope:view.scope,problem=cardProblem(cardsFor(view),viewScope.mode);
          return <li key={view.id}><div className={styles.savedContent}><div className={styles.metricTitle}><strong>{view.name}</strong><Pill>{view.visibility}</Pill>{view.schema!==2&&<Pill tone="warning">Older partial view</Pill>}{problem&&<Pill tone="warning">Review cards</Pill>}</div><p>{viewScope.mode==='plr'?'PLR review':'In-season review'} · {viewScope.window} · {viewScope.population} · inventory {viewScope.stockAsOf} · range {viewScope.rangeAsOf}</p><small>Saved {view.createdAt.slice(0,10)} · data {view.sourceVersion}</small>{view.schema===2&&view.configuration.localSelection&&<small>Local selection: {view.configuration.localSelection.label}</small>}{view.schema!==2&&<small>This view predates full workspace capture. Remove it and save the current view to retain table settings and local selections.</small>}</div><div className={styles.savedActions}><Button disabled={view.schema!==2} onClick={()=>apply(view)}>Apply</Button>{problem&&view.schema===2&&<Button variant="ghost" disabled={!canEdit(view)||viewScope.mode!==mode} onClick={()=>{setSelected([...cardsFor(view)]);setEditingViewId(view.id);setSearch('');setTab('cards');setError(problem);}}>Review cards</Button>}<Button variant="ghost" disabled={!canEdit(view)} onClick={()=>{if(canEdit(view))saveViewState('saved-workspace-views',saved.filter(previous=>previous.id!==view.id));}}>Remove</Button></div></li>;
        })}</ul>:<div className={styles.empty}><strong>No saved views yet</strong><p>Set the filters and table or chart view you want to return to, then save it here.</p></div>}
      </>}
    </div>
  </ImpactModal>;
}
