import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { AIChatPanel } from '@shared/components/primitives/AIChatPanel';
import { chatMessageTimeFields } from '@shared/components/primitives/AIChatPanel/chatTimeStamp';
import { Button as ImpactButton } from '@shared/components/vendor/impact-ui';
import { useAIChat } from '@shared/context';
import { computedEvidence, irisViewState, irisVisibleSelection, type FrozenContext } from '../context/irisEvidence';
import { permittedText, projectAuthoredValue, projectEvidenceDataset } from '../context/permissions';
import { clampIrisWidth, irisWidthBounds, IRIS_COMPACT_WIDTH, IRIS_EXPANDED_WIDTH } from '../context/irisPanelSizing';
import { resolveIrisQuestion, type IrisClarification, type IrisResolution } from '../context/irisAmbiguity';
import { useWorkspace } from '../context/WorkspaceContext';
import type { ExplainInput, LocalSelection, WorkspaceRoute } from '../context/types';
import type { WorkspaceContextValue } from '../context/types';
import { Button, DesignCheckbox, NativeDesignSelect } from './ui';
import styles from './iris.module.css';

interface Reply { createdAt: string; id: string; question: string; context: FrozenContext; state: 'thinking' | 'ready' | 'error' | 'restricted'; facts: string[]; hypothesis: string; requiresMargin: boolean; clarification?: string; clarificationRequest?: IrisClarification; resolution?: IrisResolution; evidenceIds?: string[]; }
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
/** Change detection is an opaque UI cache identity, never a copy of authored evidence. */
function irisContextSignature(value: WorkspaceContextValue): string {
  const text = value.contextVersion + JSON.stringify(value.route) + JSON.stringify(value.localSelection) + JSON.stringify(irisViewState(value));
  let first = 2166136261, second = 3335557771;
  for (let index = 0; index < text.length; index += 1) { const code = text.charCodeAt(index); first = Math.imul(first ^ code, 16777619); second = Math.imul(second ^ code, 2246822519); }
  return `iris-${(first >>> 0).toString(16)}-${(second >>> 0).toString(16)}`;
}
function projectFrozenContext(context: FrozenContext, access: FrozenContext['scope']['access']): FrozenContext {
  if (access === 'full') return context;
  const { dataset, ...metadata } = context;
  return { ...projectAuthoredValue(metadata, access), scope: { ...projectAuthoredValue(context.scope, access), access }, dataset: projectEvidenceDataset(dataset, access) };
}
function scopeText(context: FrozenContext) { const scope = context.scope; const localWeeks = context.selection?.weekIds?.length ?? (context.selection?.week ? 1 : 0); return `${scope.mode === 'plr' ? 'PLR Review · Original v1' : 'In-season Review'} · ${scope.weekIds?.length ? `${scope.weekIds.length} selected weeks` : scope.window} · ${({ly:'Matched LY',original:'Original plan',revision:'Named revision',previous:'Previous equal period',none:'No comparison'})[scope.comparison]} · ${({'exposure':'Assortment exposure','current-range':'Current range','all-candidates':'All candidates',original:'Original approved cohort'})[scope.population]}${localWeeks ? ` · selected interval ${localWeeks} weeks` : ''}`; }

export function IrisWorkspace() {
  const workspace = useWorkspace(); const current = useRef(workspace); current.current = workspace;
  const { registerOpenChatInterceptor, closeChat } = useAIChat();
  const [open, setOpen] = useState(false); const epoch = useRef(0);
  const [frozen, setFrozen] = useState<FrozenContext | null>(null); const frozenRef = useRef(frozen); frozenRef.current = frozen;
  const [incoming, setIncoming] = useState<FrozenContext | null>(null);
  const [keptSignature, setKeptSignature] = useState('');
  const [openedAt, setOpenedAt] = useState(() => new Date());
  const [prompt, setPrompt] = useState(''); const [replies, setReplies] = useState<Reply[]>([]);
  const [offline, setOffline] = useState(false); const [clarificationChoices, setClarificationChoices] = useState<Record<string,string>>({});
  const host = useRef<HTMLDivElement>(null);
  const [preferredWidth, setPreferredWidth] = useState(() => workspace.getViewState<number>('iris-panel-width', IRIS_COMPACT_WIDTH));
  const [viewportWidth, setViewportWidth] = useState(() => typeof window === 'undefined' ? 1440 : window.innerWidth);
  const width = clampIrisWidth(preferredWidth, viewportWidth), bounds = irisWidthBounds(viewportWidth);
  const drag = useRef<{ x: number; width: number } | null>(null);
  const liveWidth = useRef(width); liveWidth.current = width;
  const persistWidth = useCallback((next: number) => { const value = clampIrisWidth(next, window.innerWidth); setPreferredWidth(value); current.current.saveViewState('iris-panel-width', value); }, []);
  useEffect(() => { setPreferredWidth(current.current.getViewState<number>('iris-panel-width', IRIS_COMPACT_WIDTH)); }, [workspace.mode]);
  useEffect(() => { const resize = () => setViewportWidth(window.innerWidth); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
  const input = useRef<HTMLTextAreaElement>(null); const previousFocus = useRef<HTMLElement | null>(null);
  const capture = useCallback((explain?: ExplainInput): FrozenContext => {
    const value = current.current;
    return projectFrozenContext({ scope: clone(value.scope), route: clone(value.route), selection: clone((explain?.selection ?? irisVisibleSelection(value)) as LocalSelection | null), title: explain?.title ?? 'Current assortment workspace', metricId: explain?.metricId, signature: irisContextSignature(value), dataVersion: value.dataset.version, definitionVersion: 'proposed-base-v2', viewState: clone(irisViewState(value)), dataset: value.dataset }, value.scope.access);
  }, []);
  const openPanel = useCallback((explain?: ExplainInput) => {
    previousFocus.current = document.activeElement as HTMLElement;
    closeChat(); current.current.setActivePanel(null); setOpen(true); setKeptSignature('');
    const next = capture(explain);
    if (!frozenRef.current || replies.length === 0) { setOpenedAt(new Date()); setFrozen(next); setIncoming(null); }
    else if (explain && (next.metricId !== frozenRef.current.metricId || next.title !== frozenRef.current.title || JSON.stringify(next.selection) !== JSON.stringify(frozenRef.current.selection))) setIncoming(next);
    if (explain) setPrompt(`Explain ${explain.title.toLowerCase()}`);

  }, [capture, closeChat, replies.length]);
  const close = useCallback(() => { setOpen(false); previousFocus.current?.focus(); }, []);
  useEffect(() => {
    registerOpenChatInterceptor(context => { if (!context || context.source === 'header' || context.source === 'hindsight') { openPanel(); return true; } return false; });
    const explain = (event: Event) => openPanel((event as CustomEvent<ExplainInput>).detail);
    const reset = () => { epoch.current += 1; setOpen(false); setReplies([]); setFrozen(null); setIncoming(null); setPrompt(''); setOffline(false); setKeptSignature(''); setClarificationChoices({}); };
    window.addEventListener('hindsight-redesign-iris-open', explain);
    window.addEventListener('hindsight-redesign-reset', reset);
    return () => { registerOpenChatInterceptor(null); window.removeEventListener('hindsight-redesign-iris-open', explain); window.removeEventListener('hindsight-redesign-reset', reset); };
  }, [registerOpenChatInterceptor, openPanel]);
  useEffect(() => {
    if (workspace.scope.access !== 'restricted-margin') return;
    const redact = (context: FrozenContext): FrozenContext => projectFrozenContext(context, 'restricted-margin');
    setFrozen(context => context ? redact(context) : null); setIncoming(context => context ? redact(context) : null);
    setPrompt(value => permittedText(value, 'restricted-margin'));
    setReplies(previous => previous.map(reply => { const { context, ...metadata } = reply; return { ...projectAuthoredValue(metadata, 'restricted-margin'), context: redact(context) }; }));
  }, [workspace.scope.access]);
  useEffect(() => { if (workspace.activePanel) setOpen(false); }, [workspace.activePanel]);
  useEffect(() => { if (!open) return; const frame = requestAnimationFrame(() => input.current?.focus()); return () => cancelAnimationFrame(frame); }, [open]);
  useEffect(() => {
    if (!open) return;
    const handle = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') { event.stopPropagation(); close(); } };
    document.addEventListener('keydown', handle); return () => document.removeEventListener('keydown', handle);
  }, [open, close]);
  const currentSignature = irisContextSignature(workspace);
  const changed = !!incoming || (!!frozen && frozen.signature !== currentSignature && keptSignature !== currentSignature);
  const buildReply = (question: string, context: FrozenContext, id: string, forceAvailable = false, resolution: IrisResolution = {}, createdAt = new Date().toISOString()): Reply => {
    if (current.current.scope.access === 'restricted-margin') { context = projectFrozenContext(context, 'restricted-margin'); question = permittedText(question, 'restricted-margin'); }
    const requiresMargin = resolution.denominator === 'gross-margin' || /margin|gross|\bgm\b/i.test(question) || /gm|margin/i.test(context.metricId ?? '');
    const base: Reply = { createdAt, id, question, context, state: 'ready', facts: [], hypothesis: '', requiresMargin, resolution };
    if (requiresMargin && (context.scope.access !== 'full' || current.current.scope.access !== 'full')) return { ...base, state: 'restricted', facts: ['Gross-margin detail is restricted for this view. The same access rule applies to tables, exports and assistant responses.'] };
    if (offline && !forceAvailable) return { ...base, state: 'error' };
    try {
      const resolved = resolveIrisQuestion(context, question, resolution);
      if (resolved.clarification) return { ...base, context: resolved.context, clarification: resolved.clarification.prompt, clarificationRequest: resolved.clarification };
      return { ...base, context: resolved.context, ...computedEvidence(resolved.context, resolved.questionForEvidence) };
    } catch { return { ...base, state: 'error' }; }
  };
  const send = (question = prompt) => {
    if (!question.trim() || changed || replies.some(reply => reply.state === 'thinking')) return;
    const context = frozenRef.current ?? capture(); setFrozen(context);
    const id = `iris-${Date.now()}-${Math.random()}`; const requestEpoch = epoch.current, createdAt = new Date().toISOString();
    setReplies(previous => [...previous, { createdAt, id, question: question.trim(), context, state: 'thinking', facts: [], hypothesis: '', requiresMargin: false }]);
    if (!offline) setPrompt('');
    setTimeout(() => { if (epoch.current !== requestEpoch) return; const reply = buildReply(question.trim(), context, id, false, {}, createdAt); setReplies(previous => previous.map(item => item.id === id ? reply : item)); }, 450);
  };
  const evidence = (context: FrozenContext, destination?: WorkspaceRoute) => {
    const route = destination ?? (context.route.view === 'pair' ? context.route : { view: context.scope.mode === 'plr' ? 'overview' : 'items' } as WorkspaceRoute);
    workspace.navigate(route, { scope: { ...context.scope, access: workspace.scope.access }, localSelection: context.selection }); close();
  };
  const draftFollowUp = (context: FrozenContext) => {
    let itemId = context.route.view === 'pair' || context.route.view === 'item' ? context.route.id : context.selection?.itemIds?.[0];
    let storeId = context.route.view === 'pair' ? context.route.storeId : context.route.view === 'store' ? context.route.id : context.selection?.storeIds?.[0];
    if (context.selection?.pairIds?.length === 1) [itemId, storeId] = context.selection.pairIds[0].split(':');
    if (context.selection?.pairIds && context.selection.pairIds.length !== 1 || context.selection?.itemIds && context.selection.itemIds.length !== 1 || context.selection?.storeIds && context.selection.storeIds.length !== 1) { workspace.addNotice('Select exactly one canonical pair before drafting a follow-up.', 'warning'); evidence(context); return; }
    if (!itemId || !storeId) { workspace.addNotice('Choose one product–store pair in the evidence before drafting a scoped follow-up.', 'warning'); evidence(context); return; }
    const record = workspace.createCase({ itemId, storeId, title: 'Review from Iris evidence', observation: 'Merchant opened a review from frozen illustrative evidence; no causal conclusion is asserted.' });
    if (record) { workspace.saveViewState('iris-draft-suggestion', { caseId: record.id, reason: 'Review the linked evidence before choosing a response.', source: 'Iris design-session suggestion', dataVersion: context.dataVersion }); evidence(context, { view: 'case', id: record.id }); }
  };
  useLayoutEffect(() => {
    if (!open) return;
    const panel = host.current?.querySelector<HTMLElement>('.chatbot-component-container');
    if (panel) { panel.setAttribute('role', 'complementary'); panel.setAttribute('aria-label', 'Iris assortment assistant'); }
    const handle = host.current?.querySelector<HTMLElement>('.resizer-w');
    if (handle) { handle.tabIndex = 0; handle.setAttribute('role', 'separator'); handle.setAttribute('aria-orientation', 'vertical'); handle.setAttribute('aria-label', 'Resize Iris panel'); handle.setAttribute('aria-valuemin', String(bounds.minimum)); handle.setAttribute('aria-valuemax', String(bounds.maximum)); handle.setAttribute('aria-valuenow', String(width)); handle.setAttribute('title', 'Resize Iris. Left and Right arrows adjust width; Home is compact and End is expanded.'); }
    const toggle = host.current?.querySelector<HTMLButtonElement>('.collapse_icon_container button');
    if (toggle) { const label = preferredWidth >= 560 ? 'Use compact Iris panel' : 'Expand Iris panel'; toggle.setAttribute('aria-label', label); toggle.setAttribute('title', label); toggle.disabled = bounds.maximum <= IRIS_COMPACT_WIDTH; }
    const minimise = host.current?.querySelector<HTMLButtonElement>('.minimise_icon_container button');
    if (minimise) { minimise.setAttribute('aria-label', 'Minimize Iris'); minimise.setAttribute('title', 'Minimize Iris'); }
  }, [open, width, bounds.minimum, bounds.maximum, preferredWidth]);
  useEffect(() => {
    if (!open) return;
    const move = (event: globalThis.PointerEvent) => { if (!drag.current) return; setPreferredWidth(clampIrisWidth(drag.current.width + drag.current.x - event.clientX, window.innerWidth)); };
    const finish = () => { if (!drag.current) return; drag.current = null; persistWidth(liveWidth.current); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
    return () => { drag.current = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish); };
  }, [open, persistWidth]);
  const startResize = (event: PointerEvent<HTMLDivElement>) => { if (!(event.target as Element).closest('.resizer-w')) return; event.preventDefault(); event.stopPropagation(); drag.current = { x: event.clientX, width }; };
  const keyboardResize = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target as Element).closest('.resizer-w')) return;
    const next = event.key === 'ArrowLeft' ? width + (event.shiftKey ? 32 : 16) : event.key === 'ArrowRight' ? width - (event.shiftKey ? 32 : 16) : event.key === 'Home' ? IRIS_COMPACT_WIDTH : event.key === 'End' ? IRIS_EXPANDED_WIDTH : null;
    if (next === null) return; event.preventDefault(); event.stopPropagation(); persistWidth(next);
  };
  if (!open) return null;
  const confirmClarification = (reply: Reply) => {
    const option = reply.clarificationRequest?.options.find(option => option.id === clarificationChoices[reply.id] && !option.disabled && !(option.resolution.denominator === 'gross-margin' && current.current.scope.access !== 'full'));
    if (!option) return;
    const resolution = { ...reply.resolution, ...option.resolution }, requestEpoch = epoch.current;
    setReplies(previous => previous.map(item => item.id === reply.id ? { ...item, state: 'thinking', clarification: undefined, clarificationRequest: undefined } : item));
    setTimeout(() => { if (epoch.current !== requestEpoch) return; const next = buildReply(reply.question, reply.context, reply.id, true, resolution, reply.createdAt); setReplies(previous => previous.map(item => item.id === reply.id ? next : item)); setClarificationChoices(previous => { const result = {...previous}; delete result[reply.id]; return result; }); }, 300);
  };
  const contextBody = <div className={styles.context} data-testid="redesign-iris">
    <details><summary>Context · {frozen ? scopeText(frozen) : 'Current view'}</summary><div>{frozen?.title}<br />Products: {frozen?.scope.productIds.join(', ') || (frozen?.scope.productSelection === 'none' ? 'None' : 'All permitted products')}<br />Stores: {frozen?.scope.storeIds.join(', ') || (frozen?.scope.storeSelection === 'none' ? 'None' : 'All permitted stores')}<br />Stock {frozen?.scope.stockAsOf} · Range {frozen?.scope.rangeAsOf}<br />Source {frozen?.dataVersion} · {frozen?.definitionVersion}<br />Selected evidence: {frozen?.selection?.label ?? 'Applied view'}<br />{frozen?.selection?.pairIds?.length ?? 'Applied'} contributing pairs</div></details>
    {changed && <div className={styles.changed}><strong>View context changed</strong><p>Keep the previous evidence, or use the current view for your next question.</p><div><Button onClick={() => { setFrozen(incoming ? capture({ title: incoming.title, metricId: incoming.metricId, selection: incoming.selection ?? undefined }) : capture()); setIncoming(null); setKeptSignature(''); }}>Use current view</Button><Button variant="ghost" onClick={() => { setKeptSignature(currentSignature); setIncoming(null); }}>Keep previous context</Button></div></div>}
    {!replies.length && <div className={styles.welcome}><h3>What would you like to understand?</h3><p>Ask about this assortment. Evidence and possible explanations stay separate.</p><Button onClick={() => setPrompt('What should I investigate in this assortment?')}>What needs attention? ↗</Button><Button onClick={() => setPrompt('Which productivity denominator applies to this view?')}>Explain productivity ↗</Button></div>}
    <details className={styles.tools}><summary>Conversation options</summary><DesignCheckbox label="Demonstrate unavailable assistant" checked={offline} onCheckedChange={setOffline} /><Button variant="ghost" onClick={() => { epoch.current += 1; setReplies([]); setFrozen(capture()); setKeptSignature(''); }}>Start a new contextual conversation</Button></details>
  </div>;
  const replyBody = (reply: Reply) => <div className={styles.reply} data-iris-reply={reply.id}>
    {reply.state === 'thinking' ? <p role="status">Reading the selected evidence…</p> : reply.state === 'error' ? <div role="alert"><strong>Iris is unavailable</strong><p>Your question and context are retained. Continue with the evidence while Iris is unavailable.</p><div className={styles.replyActions}><Button onClick={() => { setOffline(false); setReplies(previous => previous.map(item => item.id === reply.id ? buildReply(reply.question, reply.context, reply.id, true, reply.resolution, reply.createdAt) : item)); }}>Retry</Button><Button onClick={() => evidence(reply.context)}>Open evidence</Button><Button variant="ghost" onClick={close}>Continue manually</Button></div></div> : reply.requiresMargin && workspace.scope.access !== 'full' ? <p>Margin evidence is restricted under your current access.</p> : <>
      <small className={styles.responseStatus}>{reply.clarificationRequest ? 'Clarification required · no broader answer substituted' : 'Computed demo response · observed facts'}</small>
      {reply.facts.map((fact,index) => <p key={index}>{fact}</p>)}
      {reply.clarification && <p>{reply.clarification}</p>}
      {reply.clarificationRequest && <div className={styles.clarification} data-iris-clarification={reply.clarificationRequest.kind}><NativeDesignSelect orientation="top" width="100%" searchable label={`Confirm ${reply.clarificationRequest.kind === 'item' ? 'SKU' : reply.clarificationRequest.kind}`} aria-label={`Clarify ${reply.clarificationRequest.kind}`} value={clarificationChoices[reply.id] ?? ''} onChange={event => setClarificationChoices(previous => ({...previous,[reply.id]:event.target.value}))}><option value="">Choose an exact reference</option>{reply.clarificationRequest.options.map(option=><option key={option.id} value={option.id} disabled={option.disabled || option.resolution.denominator === 'gross-margin' && workspace.scope.access !== 'full'}>{option.label}</option>)}</NativeDesignSelect><div className={styles.replyActions}><Button disabled={!reply.clarificationRequest.options.some(option=>option.id===clarificationChoices[reply.id]&&!option.disabled&&!(option.resolution.denominator==='gross-margin'&&workspace.scope.access!=='full'))} onClick={()=>confirmClarification(reply)}>Use this answer context</Button><Button onClick={()=>evidence(reply.context)}>Open frozen evidence</Button><Button variant="ghost" onClick={close}>Continue manually</Button></div><small>Deterministic demo reference checks. The original question is retained; this choice applies only to this answer.</small></div>}
      {reply.hypothesis && <div className={styles.hypothesis}><strong>Possible explanation</strong><p>{reply.hypothesis}</p><small>A hypothesis, not a measured cause.</small></div>}
      {!reply.clarificationRequest && <div className={styles.replyActions}><Button onClick={() => evidence(reply.context)}>Open contributing evidence</Button><Button variant="ghost" disabled={!workspace.can('draft')} onClick={() => draftFollowUp(reply.context)}>Draft follow-up</Button><Button variant="ghost" onClick={() => evidence(reply.context,{view:'decisions'})}>Review cases</Button></div>}
    </>}
    <details className={styles.answerScope}><summary>Scope and sources</summary><div>{scopeText(reply.context)}<br />Answer selection: {reply.context.selection?.label ?? 'Applied frozen view'}<br />{reply.context.selection?.weekIds?.length ? `Answer weeks: ${reply.context.dataset.weeks.filter(week=>reply.context.selection!.weekIds!.includes(week.id)).map(week=>`${week.start} – ${week.end}`).join('; ')}` : ''}<br />Stock {reply.context.scope.stockAsOf} · Range {reply.context.scope.rangeAsOf}<br />{reply.context.dataVersion} · {reply.context.definitionVersion}<br />Evidence: {reply.evidenceIds?.slice(0,12).join(', ') || 'No contributing rows'}{(reply.evidenceIds?.length ?? 0)>12 ? ` · ${reply.evidenceIds?.length} total` : ''}<br />Proposed and inferred definitions require client validation.</div></details>
  </div>;
  const messages = [{...chatMessageTimeFields(openedAt),id:'frozen-context',userType:'bot',bodyType:'jsx',jsx:contextBody,enableLikes:false}, ...replies.flatMap(reply => [{...chatMessageTimeFields(new Date(reply.createdAt)),id:`${reply.id}-question`,userType:'user',bodyType:'text',bodyText:reply.question,enableLikes:false},{...chatMessageTimeFields(new Date(reply.createdAt)),id:reply.id,userType:'bot',bodyType:'jsx',jsx:replyBody(reply),enableLikes:false,enableSpeaker:false,enableNewThread:false,enableAddToPage:false}])];
  const composer = <form className="chat-input-box" onSubmit={event => { event.preventDefault(); send(); }}><div className="chat-input-container"><div className="chat-input-wrapper"><textarea className="chat-textarea" id="redesign-iris-prompt" aria-label="Ask Iris about the selected context" ref={input} value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Ask Iris…" rows={2} onKeyDown={event => { if(event.key === 'Enter' && !event.shiftKey){event.preventDefault();send();} }}/><div className="chat-actions"><ImpactButton htmlType="submit" size="large" variant="primary" aria-label="Send Iris question" disabled={changed || !prompt.trim() || replies.some(reply => reply.state === 'thinking')} icon={<img src="/vendor/chatBotSendIcon.svg" width={18} height={18} alt=""/>}/></div></div></div>{changed && <small className={styles.composerHelp}>Choose the context before sending.</small>}</form>;
  return <div ref={host} className={styles.host} style={{'--iris-panel-width': `${width}px`} as CSSProperties} data-iris-panel-width={width} onPointerDownCapture={startResize} onKeyDownCapture={keyboardResize} onClickCapture={event => { if (!(event.target as Element).closest('.collapse_icon_container button')) return; event.preventDefault(); event.stopPropagation(); persistWidth(preferredWidth >= 560 ? IRIS_COMPACT_WIDTH : IRIS_EXPANDED_WIDTH); }}><AIChatPanel open={open} onOpenChange={next => { if(!next) close(); }} onClose={close} onMinimise={close} userName="" showNewChat={false} showHistory={false} hideModuleArrow tabs={[]} threads={['Home']} activeThread="Home" conversation={{conversations:{default:{messages}}}} customInput={composer} footerText="Demo responses · Definitions require validation" /></div>;
}
