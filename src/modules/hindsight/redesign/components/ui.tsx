import { Children, Fragment, isValidElement, useEffect, useLayoutEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type ChangeEvent, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { useId } from '@shared/a11y';
import { Button as VendorButton, ImpactBadge, ImpactCheckbox, ImpactInput, ImpactSelect, Popover } from '@shared/components/vendor/impact-ui';
import { DataGrid } from '@shared/components/data';
import type { DataGridColumn } from '@shared/components/data';
import kpiStyles from '../../components/overview/ProductPerformanceKpiCards.module.css';
const kpiCardGridBg=new URL('../../../../assets/icons/hindsight/kpi-card-grid-bg.svg',import.meta.url).href;
const kpiCardEllipseBg=new URL('../../../../assets/icons/hindsight/kpi-card-ellipse-bg.svg',import.meta.url).href;
import styles from './ui.module.css';
import { reportIdForTitle, useReportLifecycle } from '../context/ReportStateContext';
import { ReportStateBoundary } from './ReportStateBoundary';

export { styles as uiStyles };
export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'purple';
export function Button({ variant = 'secondary', className, type: htmlType = 'button', ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <VendorButton htmlType={htmlType} type={variant === 'danger' ? 'destructive' : 'default'} size="large" variant={variant === 'primary' ? 'primary' : variant === 'ghost' ? 'text' : 'tertiary'} className={[styles.button, className].filter(Boolean).join(' ')} {...props} />;
}
export function WorkspaceCard({ title, subtitle, actions, children, className, id, reportId, reportTitle, rehearsable = true }: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; id?: string; reportId?: string; reportTitle?: string; rehearsable?: boolean }) {
  const headingId = useId('workspace-card');
  const componentTitle = reportTitle ?? (typeof title === 'string' ? title : '');
  const componentId = rehearsable && componentTitle ? reportId ?? id ?? reportIdForTitle(componentTitle) : undefined;
  const lifecycle = useReportLifecycle(componentId, componentTitle);
  const heading = useRef<HTMLHeadingElement>(null), retryFocus = useRef(false);
  useLayoutEffect(() => { if (lifecycle.phase === 'ready' && retryFocus.current) { retryFocus.current = false; heading.current?.focus({ preventScroll: true }); } }, [lifecycle.phase]);
  const hideActions = lifecycle.phase === 'loading' || lifecycle.phase === 'failure';
  return <section id={id} data-report-id={componentId} data-report-state={lifecycle.phase} className={[styles.card, className].filter(Boolean).join(' ')} aria-labelledby={title ? headingId : undefined}>
    {(title || actions) && <div className={styles.cardHeader}><div>{title && <h2 id={headingId} ref={heading} tabIndex={-1}>{title}</h2>}{subtitle && <div className={styles.muted} title={typeof subtitle==='string'?subtitle:undefined}>{subtitle}</div>}</div><div className={styles.actions} style={hideActions ? { visibility: 'hidden' } : undefined} aria-hidden={hideActions || undefined}>{actions}</div></div>}
    <ReportStateBoundary state={lifecycle} title={componentTitle} onRetry={() => { retryFocus.current = true; lifecycle.retry(); }}>{children}</ReportStateBoundary>
  </section>;
}
export function SectionHeading({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return <div className={styles.sectionHeading}><div><h2>{title}</h2>{description && <p>{description}</p>}</div><div className={styles.actions}>{actions}</div></div>;
}
export function Toolbar({ children, className, ariaLabel }: { children: ReactNode; className?: string; ariaLabel?: string }) {
  return <div className={[styles.toolbar, className].filter(Boolean).join(' ')} role="group" aria-label={ariaLabel}>{children}</div>;
}
export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <ImpactBadge label={children as string} color={tone === 'danger' ? 'error' : tone === 'warning' ? 'warning' : tone === 'success' ? 'success' : tone === 'purple' ? 'info' : undefined} variant="subtle" size="small"/>;
}
export function MetricCard({ label, value, comparison, helper, onClick, tone = 'neutral' }: { label: ReactNode; value: ReactNode; comparison?: ReactNode; helper?: ReactNode; onClick?: () => void; tone?: Tone }) {
  const content = <><div className={kpiStyles.decoration} aria-hidden="true"><img className={kpiStyles.gridBg} src={kpiCardGridBg} alt=""/><img className={kpiStyles.ellipseBg} src={kpiCardEllipseBg} alt=""/></div><div className={kpiStyles.content}><span className={kpiStyles.label}>{label}</span><div className={`${kpiStyles.valueRow} ${styles.metricValueRow}`}><strong className={kpiStyles.value}>{value}</strong>{comparison && <ImpactBadge label={comparison as string} color={tone === 'danger' ? 'error' : tone === 'warning' ? 'warning' : tone === 'success' ? 'success' : tone === 'purple' ? 'info' : undefined} variant="subtle" size="small"/>}</div>{helper && <span className={styles.metricHelper}>{helper}</span>}{onClick && <span className={styles.metricLink}>View evidence <span aria-hidden="true">↗</span></span>}</div></>;
  const className=`${kpiStyles.card} ${styles.metricCard}`;
  return onClick ? <button type="button" className={className} onClick={onClick}>{content}</button> : <div className={className}>{content}</div>;
}
type SelectOption={value:string|number;label:string;disabled?:boolean;isDisabled?:boolean};
export interface DesignSelectOption { value:string|number;label:string;disabled?:boolean; }
export interface DesignSelectProps { label?:string;value:string|number;options:readonly DesignSelectOption[];onChange:(value:string)=>void;disabled?:boolean;searchable?:boolean;placeholder?:string;width?:string|number;orientation?:'top'|'left';className?:string;id?:string;'aria-label'?:string;'aria-describedby'?:string;'data-testid'?:string;name?:string;required?:boolean; }
/** Controlled adapter over the exact recovered Impact Select used by SalesMixHeader. */
export function DesignSelect({label='',value,options,onChange,disabled=false,searchable=false,placeholder='Select',width=180,orientation='left',className,id,'aria-label':ariaLabel,'aria-describedby':describedBy,'data-testid':testId,name,required}:DesignSelectProps) {
  const generated=useId(),wrapper=useRef<HTMLDivElement>(null),[open,setOpen]=useState(false),[selectAll,setSelectAll]=useState(false);
  useLayoutEffect(()=>{const trigger=wrapper.current?.querySelector<HTMLElement>('[role=combobox]');if(!trigger)return;const name=ariaLabel??label;if(name)trigger.setAttribute('aria-label',name);if(describedBy)trigger.setAttribute('aria-describedby',describedBy);},[ariaLabel,label,describedBy]);
  const initial=useMemo<SelectOption[]>(()=>options.map(option=>({...option,isDisabled:option.disabled})),[options]);
  const controlled=useMemo(()=>initial.find(option=>String(option.value)===String(value))??[],[initial,value]);
  const [current,setCurrent]=useState<SelectOption[]>(initial),[selected,setSelected]=useState<SelectOption|SelectOption[]>(controlled);
  useEffect(()=>setCurrent(initial),[initial]);useEffect(()=>setSelected(controlled),[controlled]);
  return <div ref={wrapper} className={[styles.designSelect,className].filter(Boolean).join(' ')} style={{width,flexBasis:width}}><ImpactSelect label={label} labelOrientation={orientation} aria-label={ariaLabel??label} aria-describedby={describedBy} data-testid={testId} name={name} isRequired={required} selectId={id??`hindsight-select-${generated.replaceAll(':','')}`} initialOptions={initial} currentOptions={current} setCurrentOptions={setCurrent} selectedOptions={selected} setSelectedOptions={next=>setSelected(next??[])} isSelectAll={selectAll} setIsSelectAll={setSelectAll} isOpen={open} setIsOpen={setOpen} isMulti={false} isDisabled={disabled} isClearable={false} isWithSearch={searchable} placeholder={placeholder} isCloseWhenClickOutside withPortal portalContainer={typeof document!=='undefined'?document.body:undefined} width="100%" minWidth="100%" handleChange={next=>{const option=Array.isArray(next)?next[0]:next;if(option&&option.value!==undefined&&!option.disabled&&!option.isDisabled)onChange(String(option.value));setOpen(false);}}/></div>;
}
export interface DesignInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'size'> { label?:string;error?:string;helpText?:string; }
/** Actual Impact input; native field semantics and numeric constraints are forwarded. */
export function DesignInput({label='',error,helpText,className,onChange,disabled,id,'aria-label':ariaLabel,min,max,step,maxLength,readOnly,...props}:DesignInputProps) {
  const generated=useId(),inputId=id??`hindsight-input-${generated.replaceAll(':','')}`;
  return <div className={[styles.designInput,className].filter(Boolean).join(' ')}><ImpactInput {...props as any} id={inputId} htmlFor={inputId} label={label} size="large" isDisabled={disabled} isError={!!error} helperText={error??helpText} isHelperText={!!(error??helpText)} onChange={event=>onChange?.(event as ChangeEvent<HTMLInputElement>)} inputProps={{'aria-label':ariaLabel??label,'aria-invalid':!!error,min,max,step,maxLength,readOnly}}/></div>;
}
export interface DesignCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'type'|'size'|'onChange'> {label?:ReactNode;checked:boolean;onChange?:(event:ChangeEvent<HTMLInputElement>)=>void;onCheckedChange?:(checked:boolean)=>void;}
export function DesignCheckbox({label,checked,disabled,onChange,onCheckedChange,'aria-label':ariaLabel,className,...props}:DesignCheckboxProps){
  const wrapper=useRef<HTMLSpanElement>(null);
  // Recovered vendor Checkbox overwrites inputProps in both render branches. Restore the
  // supplied accessible name on its real input; the actual vendor visual/keyboard path stays intact.
  useLayoutEffect(()=>{const input=wrapper.current?.querySelector('input');if(!input)return;const name=ariaLabel??(typeof label==='string'?label:undefined);if(name)input.setAttribute('aria-label',name);if(props.id)input.id=props.id;if(props['aria-describedby'])input.setAttribute('aria-describedby',props['aria-describedby']);if(props.required)input.required=true;},[ariaLabel,label,props.id,props['aria-describedby'],props.required]);
  return <span ref={wrapper} className={[styles.designCheckbox,className].filter(Boolean).join(' ')}><ImpactCheckbox {...props as any} label={label} checked={checked} disabled={disabled} withoutFormLabel={!label} inputProps={{'aria-label':ariaLabel??(typeof label==='string'?label:undefined)}} onChange={event=>{onChange?.(event);onCheckedChange?.(event.target.checked);}}/></span>;
}
export interface NativeDesignSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>,'size'|'value'> {value:string|number;label?:string;width?:string|number;searchable?:boolean;options?:readonly DesignSelectOption[];orientation?:'top'|'left';}
/** Native event/option adapter for existing handlers; the visible control is ImpactSelect. */
export function NativeDesignSelect({children,options,value,onChange,label='',width=180,searchable=false,orientation='left',...props}:NativeDesignSelectProps){
  const parse=(nodes:ReactNode):DesignSelectOption[]=>Children.toArray(nodes).flatMap(node=>{if(!isValidElement(node))return[];if(node.type===Fragment||node.type==='optgroup')return parse((node.props as {children?:ReactNode}).children);const option=node.props as {value?:string|number;children?:ReactNode;label?:string;disabled?:boolean};const text=(value:ReactNode):string=>Children.toArray(value).map(child=>isValidElement(child)?text((child.props as {children?:ReactNode}).children):String(child)).join('');const name=option.label??text(option.children);return[{value:option.value??name,label:name,disabled:option.disabled}];});
  return <DesignSelect value={value} options={options??parse(children)} label={label} width={width} orientation={orientation} searchable={searchable} disabled={props.disabled} aria-label={props['aria-label']??label} className={props.className} id={props.id} name={props.name} required={props.required} aria-describedby={props['aria-describedby']} data-testid={(props as Record<string,unknown>)['data-testid'] as string|undefined} onChange={next=>{const target={value:next,name:props.name??'',id:props.id??''} as HTMLSelectElement;onChange?.({target,currentTarget:target} as ChangeEvent<HTMLSelectElement>);}}/>;
}
export interface DesignTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{label?:string;error?:string;helpText?:string;}
export function DesignTextarea({label='',error,helpText,className,onChange,disabled,id,'aria-label':ariaLabel,rows=3,...props}:DesignTextareaProps){
  const generated=useId(),inputId=id??`hindsight-textarea-${generated.replaceAll(':','')}`;
  return <div className={[styles.designInput,styles.designTextarea,className].filter(Boolean).join(' ')}><ImpactInput {...props as any} id={inputId} htmlFor={inputId} label={label} multiline rows={rows} size="large" isDisabled={disabled} isError={!!error} helperText={error??helpText} isHelperText={!!(error??helpText)} onChange={event=>onChange?.(event as ChangeEvent<HTMLTextAreaElement>)} inputProps={{'aria-label':ariaLabel??label,'aria-invalid':!!error}}/></div>;
}
export function DesignPopover({open,anchorEl,title,onClose,children}:{open:boolean;anchorEl:HTMLElement|null;title:string;onClose:()=>void;children:ReactNode}){
  return <Popover disableEnforceFocus open={open} anchorEl={anchorEl} onClose={onClose} title={title} anchorOrigin={{vertical:'bottom',horizontal:'right'}} transformOrigin={{vertical:'top',horizontal:'right'}} slotProps={{paper:{className:styles.popoverPaper}}}><div className={styles.popoverBody}>{children}</div></Popover>;
}
export function DataState({ state, title, description, onRetry, children }: { state: string; title?: ReactNode; description?: ReactNode; onRetry?: () => void; children?: ReactNode }) {
  const labels: Record<string, string> = { loading: 'Loading this view', missing: 'Data not connected', restricted: 'Restricted field', unknown: 'History unavailable', empty: 'No matching results', error: 'This view could not load', stale: 'Source is not current', 'no-positive-demand': 'No positive demand', 'no-positive-base': 'No positive comparison base', 'negative-base': 'Negative comparison base', 'not-applicable': 'Not applicable to this measure', reconcile: 'Source facts need reconciliation' };
  if (state === 'ready' || state === 'succeeded') return <>{children}</>;
  return <div className={styles.dataState} role={state === 'error' ? 'alert' : 'status'}><span className={styles.stateMark} aria-hidden="true">{state === 'loading' ? '◌' : 'ⓘ'}</span><strong>{title ?? labels[state] ?? state}</strong>{description && <p>{description}</p>}{onRetry && <Button onClick={onRetry}>Retry this view</Button>}{children}</div>;
}
export function EvidenceMenu({ title, definition, onExport, onExplain }: { title: string; definition?: ReactNode; onExport?: () => void; onExplain?: () => void }) {
  const [anchor,setAnchor]=useState<HTMLElement|null>(null),[showDefinition,setShowDefinition]=useState(false);
  return <><Button variant="ghost" aria-label={`${title} options`} aria-haspopup="dialog" aria-expanded={!!anchor} onClick={event=>setAnchor(event.currentTarget)}>•••</Button><DesignPopover open={!!anchor} anchorEl={anchor} title={`${title} options`} onClose={()=>{setAnchor(null);setShowDefinition(false);}}><div className={styles.evidenceActions}><Button variant="ghost" onClick={()=>setShowDefinition(value=>!value)}>Definition</Button>{showDefinition&&<div className={styles.definition}>{definition??'Proposed definition. See the metric register for source labels, grain and approval status.'}</div>}<Button variant="ghost" disabled={!onExport} onClick={()=>{setAnchor(null);onExport?.();}}>Export contributing rows</Button><Button variant="ghost" disabled={!onExplain} onClick={()=>{setAnchor(null);setShowDefinition(false);onExplain?.();}}>Explain this view</Button></div></DesignPopover></>;
}
export interface WorkspaceColumn<Row> { key: string; label: ReactNode; align?: 'left' | 'right' | 'center'; render?: (row: Row) => ReactNode; value?: (row: Row) => string | number | null | undefined; width?: number; sortable?: boolean; }
export function WorkspaceTable<Row>({ rows, columns, rowKey, onRowClick, caption, emptyMessage='No rows match this scope.',sort,onSort }: {rows:readonly Row[];columns:readonly WorkspaceColumn<Row>[];rowKey:(row:Row)=>string;onRowClick?:(row:Row)=>void;caption?:string;emptyMessage?:string;sort?:{key:string;direction:'asc'|'desc'};onSort?:(sort:{key:string;direction:'asc'|'desc'})=>void}){
  const defs:DataGridColumn<Row>[]=columns.map(column=>({id:column.key,header:typeof column.label==='string'?column.label:column.key,width:column.width??180,flex:column.width===undefined?1:undefined,align:column.align==='right'?'end':column.align==='center'?'center':'start',sortable:false,filterable:false,value:column.value,render:column.render??(row=>String(column.value?.(row)??'—')),...(onSort&&column.sortable!==false?{headerRender:()=> <button className={styles.gridSort} aria-pressed={sort?.key===column.key} onClick={()=>onSort({key:column.key,direction:sort?.key===column.key&&sort.direction==='asc'?'desc':'asc'})}>{column.label}<span aria-hidden="true">{sort?.key===column.key?sort.direction==='asc'?'↑':'↓':'↕'}</span></button>}:typeof column.label!=='string'?{headerRender:()=>column.label}:{})}));
  return <DataGrid rows={[...rows]} columns={defs} getRowId={rowKey} ariaLabel={caption??'Evidence table'} onRowClick={onRowClick} status="succeeded" emptyLabel={emptyMessage} height={Math.max(160,Math.min(560,48+rows.length*46))} rowHeight={46} headerHeight={48} columnChooser={false}/>;
}
