import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  AIChatPanel,
  type ChatMessage,
  type ConversationPayload,
} from '@shared/components/primitives/AIChatPanel';
import {
  AgentActionChoices,
  isAgentActionMessage,
} from '@shared/components/primitives/AIChatPanel/AgentActionChoices';
import { AgentReplyBody } from '@shared/components/primitives/AIChatPanel/AgentReplyBody';
import { chatMessageTimeFields } from '@shared/components/primitives/AIChatPanel/chatTimeStamp';
import {
  FOLLOW_UP_MESSAGE_BODY_TYPE,
  FollowUpSendLockProvider,
  FollowUpSuggestions,
  isFollowUpMessage,
} from '@shared/components/primitives/AIChatPanel/FollowUpSuggestions';
import {
  buildInsightUserMessage,
  buildPlainUserMessage,
} from '@shared/components/primitives/AIChatPanel/InsightUserBubble';
import { ProcessSteps } from '@shared/components/primitives/AIChatPanel/ProcessSteps';
import { visuallyHiddenClass } from '@shared/a11y';
import {
  DescribeCopilotChrome,
  type CopilotPresentation,
} from '@shared/components/primitives/AIChatPanel/DescribeCopilotChrome';
import { applyIrisFeedbackButtonA11y } from '@shared/components/primitives/AIChatPanel/irisFeedbackA11y';
import {
  getSharedAgentWsClient,
  logAgentWsEvent,
  logAgentWsWarn,
  readIrisFeedbackSource,
  resetSharedAgentWsClient,
  resolveIrisFeedbackAction,
  submitIrisFeedback,
  summarizeAgentResult,
  writeIrisFeedbackSource,
  ROLLBACK_IRIS_FEEDBACK_ON_FAILURE,
  type AgentActionOption,
  type AgentInboundFrame,
  type IrisFeedbackChoice,
  type IrisFeedbackSource,
} from '@shared/services/agentWs';
import {
  AIChatContextProvider,
  useAIChat,
  useAIChatHostHandlers,
  type AskAboutInsightInput,
  type SubmitDescribeQueryInput,
} from './AIChatContext';
import { IRIS_SESSION_RESET_EVENT } from '@shared/services/irisSession';
import { AUTH_EXPIRED_EVENT } from '@shared/services/auth';

const THREAD_KEY = 'default';

type PendingAsk = {
  plainText: string;
  userMessage: ChatMessage;
  /** When false, the user bubble is already in the thread (Describe → Apply & Save). */
  echoUser?: boolean;
};

/** Drop the module-scoped socket so the next open uses a fresh auth token. */
export function resetAgentChatForTests(): void {
  resetSharedAgentWsClient();
}

function planIdFromLocation(state: unknown): string | undefined {
  if (typeof state !== 'object' || state === null) return undefined;
  const planId = (state as { planId?: unknown }).planId;
  return typeof planId === 'string' && planId.length > 0 ? planId : undefined;
}

function hasMessages(conv: ConversationPayload): boolean {
  const keys = Object.keys(conv.conversations ?? {});
  if (keys.length === 0) return false;
  const messages = conv.conversations?.[keys[0]]?.messages;
  return Array.isArray(messages) && messages.length > 0;
}

function withMessages(
  prev: ConversationPayload,
  updater: (messages: ChatMessage[]) => ChatMessage[],
): ConversationPayload {
  const existing = prev.conversations?.[THREAD_KEY]?.messages ?? [];
  return {
    conversations: {
      ...prev.conversations,
      [THREAD_KEY]: { messages: updater(existing) },
    },
  };
}

function withoutFollowUps(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter(
    (message) =>
      !isFollowUpMessage(message.bodyType) && !isAgentActionMessage(message.bodyType),
  );
}

function AIChatPanelHost() {
  const { t } = useTranslation('common');
  const { open, context, openChat, closeChat } = useAIChat();
  const { registerAskAboutInsight, registerSubmitDescribeQuery, registerSetPlanCode } =
    useAIChatHostHandlers();
  const location = useLocation();

  const [conversation, setConversation] = useState<ConversationPayload>({
    conversations: { [THREAD_KEY]: { messages: [] } },
  });
  const [thinking, setThinking] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [feedbackAnnouncement, setFeedbackAnnouncement] = useState('');
  const [feedbackPendingIds, setFeedbackPendingIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const lastPrefillSeedRef = useRef<string | undefined>(undefined);

  const client = getSharedAgentWsClient();
  const uiQueueRef = useRef<PendingAsk[]>([]);
  const inFlightRef = useRef(false);
  const activeBotIdRef = useRef<string | null>(null);
  const traceStepsRef = useRef<string[]>([]);
  const queryByBotIdRef = useRef(new Map<string, string>());
  const feedbackInFlightRef = useRef(new Set<string>());
  const startPendingRef = useRef<(pending: PendingAsk) => void>(() => undefined);
  const sendFollowUpRef = useRef<(question: string) => void>(() => undefined);
  const sendActionRef = useRef<(action: AgentActionOption) => void>(() => undefined);
  const actionSendLockRef = useRef(false);
  /** Describe Your Plan has no plan yet — socket opens without plan_code. */
  const describePlanlessRef = useRef(false);
  const presentedDescribeQueriesRef = useRef(new Set<string>());
  /** Same chat session; only the Describe Your Plan panel changes size. */
  const describeSessionRef = useRef(false);
  const describeAutoMinimizedRef = useRef(false);
  const [describeSession, setDescribeSession] = useState(false);
  const [presentation, setPresentation] = useState<CopilotPresentation>('expanded');

  const beginDescribePresentation = useCallback(() => {
    describeSessionRef.current = true;
    describeAutoMinimizedRef.current = false;
    setDescribeSession(true);
    setPresentation('expanded');
  }, []);

  const endDescribePresentation = useCallback(() => {
    describeSessionRef.current = false;
    describeAutoMinimizedRef.current = false;
    setDescribeSession(false);
    setPresentation('expanded');
  }, []);

  const togglePresentation = useCallback(() => {
    setPresentation((current) => (current === 'minimized' ? 'expanded' : 'minimized'));
  }, []);

  const formatProcessLabel = useCallback(
    (current: number, total: number) => t('iris.processSteps', { current, total }),
    [t],
  );

  const readingStatus = t('iris.readingRequest');

  const updateBotMessage = useCallback(
    (botId: string, patch: (msg: ChatMessage) => ChatMessage) => {
      setConversation((prev) =>
        withMessages(prev, (messages) =>
          messages.map((m) => (m.id === botId ? patch(m) : m)),
        ),
      );
    },
    [],
  );

  const buildStreamingBotMessage = useCallback(
    (botId: string, steps: readonly string[], complete: boolean): ChatMessage => ({
      id: botId,
      userType: 'bot',
      bodyType: 'jsx',
      ...chatMessageTimeFields(),
      jsx: createElement(
        'div',
        { 'data-testid': 'iris-streaming-reply' },
        createElement('p', null, readingStatus),
        createElement(ProcessSteps, {
          steps,
          complete,
          formatLabel: formatProcessLabel,
        }),
      ),
      thinkingResponse: {
        thinkingHeading:
          steps.length > 0 ? formatProcessLabel(steps.length, steps.length) : undefined,
      },
    }),
    [formatProcessLabel, readingStatus],
  );

  const finishInFlightAndDrain = useCallback(() => {
    inFlightRef.current = false;
    actionSendLockRef.current = false;
    setThinking(false);
    activeBotIdRef.current = null;
    traceStepsRef.current = [];
    const next = uiQueueRef.current.shift();
    if (next) {
      queueMicrotask(() => {
        startPendingRef.current(next);
      });
    }
  }, []);

  const startPending = useCallback(
    (pending: PendingAsk) => {
      inFlightRef.current = true;
      const botId = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      activeBotIdRef.current = botId;
      traceStepsRef.current = [];
      queryByBotIdRef.current.set(botId, pending.plainText);
      setThinking(true);
      setConversation((prev) =>
        withMessages(prev, (messages) => [
          ...withoutFollowUps(messages),
          ...(pending.echoUser === false ? [] : [pending.userMessage]),
          buildStreamingBotMessage(botId, [], false),
        ]),
      );
      client.sendQuery(pending.plainText);
    },
    [buildStreamingBotMessage, client],
  );

  startPendingRef.current = startPending;

  const enqueueOrStart = useCallback(
    (pending: PendingAsk) => {
      if (inFlightRef.current) {
        uiQueueRef.current.push(pending);
        return;
      }
      startPending(pending);
    },
    [startPending],
  );

  const handleFrame = useCallback(
    (frame: AgentInboundFrame) => {
      const botId = activeBotIdRef.current;

      if (frame.type === 'trace') {
        const nextSteps = [...traceStepsRef.current, frame.step];
        traceStepsRef.current = nextSteps;
        if (botId) {
          updateBotMessage(botId, () =>
            buildStreamingBotMessage(botId, nextSteps, false),
          );
        }
        return;
      }

      if (frame.type === 'done') {
        const steps = traceStepsRef.current;
        const followUps = frame.follow_up_questions ?? [];
        const actions = frame.actions ?? [];
        if (botId) {
          const summary = summarizeAgentResult(frame.result);
          const query = queryByBotIdRef.current.get(botId) ?? '';
          queryByBotIdRef.current.delete(botId);
          writeIrisFeedbackSource({
            messageId: botId,
            requestId: frame.request_id,
            sessionId: frame.session_id,
            conversationId: THREAD_KEY,
            planCode:
              frame.plan_code ||
              client.getPlanCode() ||
              planIdFromLocation(location.state) ||
              '',
            query,
            responseExcerpt: summary.excerpt,
            responseContentTypes: summary.contentTypes,
            usage: frame.usage,
            agents: frame.agents,
          });
          const reply: ChatMessage = {
            id: botId,
            userType: 'bot',
            bodyType: 'jsx',
            ...chatMessageTimeFields(),
            enableLikes: true,
            jsx: createElement(
              'div',
              { 'data-testid': 'iris-final-reply' },
              createElement(AgentReplyBody, {
                result: frame.result,
                feedback: frame.feedback,
                fallbackText: t('iris.emptyResult'),
                emptyChartLabel: t('iris.emptyChart'),
                emptyTableLabel: t('iris.emptyTable'),
                chartDataCaption: (title: string) =>
                  t('iris.chartDataCaption', { title: title || t('iris.untitledChart') }),
                replyId: botId,
              }),
              steps.length > 0
                ? createElement(ProcessSteps, {
                    steps,
                    complete: true,
                    formatLabel: formatProcessLabel,
                  })
                : null,
              actions.length > 0
                ? createElement(AgentActionChoices, {
                    actions,
                    label: t('iris.replyActions'),
                    onSelect: (action: AgentActionOption) =>
                      sendActionRef.current(action),
                  })
                : null,
            ),
            thinkingResponse:
              steps.length > 0
                ? { thinkingHeading: formatProcessLabel(steps.length, steps.length) }
                : undefined,
          };
          setConversation((prev) =>
            withMessages(prev, (messages) => {
              const patched = withoutFollowUps(messages).map((message) =>
                message.id === botId ? reply : message,
              );
              const withFollowUps =
                followUps.length === 0
                  ? patched
                  : [
                      ...patched,
                      {
                        id: `${botId}-followups`,
                        userType: 'bot',
                        bodyType: FOLLOW_UP_MESSAGE_BODY_TYPE,
                        enableLikes: false,
                        timeStamp: '',
                        timestamp: '',
                        jsx: createElement(FollowUpSuggestions, {
                          questions: followUps,
                          label: t('iris.suggestedAnalysis'),
                          onSelect: (question: string) =>
                            sendFollowUpRef.current(question),
                        }),
                      },
                    ];
              return withFollowUps;
            }),
          );
          if (describeSessionRef.current && !describeAutoMinimizedRef.current) {
            describeAutoMinimizedRef.current = true;
            setPresentation('minimized');
          }
        }
        finishInFlightAndDrain();
        return;
      }

      if (frame.type === 'ready' && frame.plan_error) {
        setConversation((prev) =>
          withMessages(prev, (messages) => [
            ...messages,
            {
              userType: 'bot',
              bodyType: 'text',
              bodyText: t('iris.planError', { message: frame.plan_error }),
              ...chatMessageTimeFields(),
            },
          ]),
        );
      }
    },
    [
      buildStreamingBotMessage,
      client,
      finishInFlightAndDrain,
      formatProcessLabel,
      location.state,
      t,
      updateBotMessage,
    ],
  );

  useEffect(() => {
    const unsubFrames = client.subscribeFrames(handleFrame);
    const unsubState = client.subscribeState((state) => {
      if (state === 'error' && inFlightRef.current) {
        const botId = activeBotIdRef.current;
        if (botId) {
          updateBotMessage(botId, (msg) => ({
            ...msg,
            bodyType: 'text',
            bodyText: t('iris.connectionError'),
            jsx: undefined,
          }));
        }
        finishInFlightAndDrain();
      }
    });
    return () => {
      unsubFrames();
      unsubState();
    };
  }, [client, finishInFlightAndDrain, handleFrame, t, updateBotMessage]);

  // StrictMode remount: close the socket only — keep plan_code so Ask Iris can reconnect.
  useEffect(
    () => () => {
      client.releaseSocket();
    },
    [client],
  );

  const handleAskAboutInsight = useCallback(
    (input: AskAboutInsightInput) => {
      describePlanlessRef.current = false;
      endDescribePresentation();
      const fromRoute = planIdFromLocation(location.state);
      const planCode = input.planCode?.trim() || fromRoute;

      logAgentWsEvent('askAboutInsight handler', {
        inputPlanCode: input.planCode,
        fromRoute,
        resolvedPlanCode: planCode,
        clientPlanCode: client.getPlanCode(),
        state: client.getState(),
      });

      if (!planCode) {
        logAgentWsWarn(
          'Ask Iris aborted — no plan_code (open a plan from All Plans so location.state.planId is set)',
        );
        setConversation((prev) =>
          withMessages(prev, (messages) => [
            ...withoutFollowUps(messages),
            input.displayHtml
              ? buildInsightUserMessage(input.displayHtml)
              : buildPlainUserMessage(input.plainText),
            {
              userType: 'bot',
              bodyType: 'text',
              bodyText: t('iris.missingPlan'),
              ...chatMessageTimeFields(),
            },
          ]),
        );
        return;
      }

      client.setPlanCode(planCode);
      client.connect();
      const userMessage = input.displayHtml
        ? buildInsightUserMessage(input.displayHtml)
        : buildPlainUserMessage(input.plainText);
      enqueueOrStart({ plainText: input.plainText, userMessage });
    },
    [client, enqueueOrStart, endDescribePresentation, location.state, t],
  );

  const handleSubmitDescribeQuery = useCallback(
    (input: SubmitDescribeQueryInput) => {
      const query = input.query.trim();
      if (!query) return false;
      if (presentedDescribeQueriesRef.current.has(query)) return false;
      describePlanlessRef.current = true;
      beginDescribePresentation();
      presentedDescribeQueriesRef.current.add(query);
      openChat({
        source: 'clustering',
        widgetId: 'describe-plan',
        showNewChat: false,
      });
      client.connectWithoutPlan();
      enqueueOrStart({
        plainText: query,
        userMessage: buildPlainUserMessage(query),
      });
      return true;
    },
    [beginDescribePresentation, client, enqueueOrStart, openChat],
  );

  const handleSetPlanCode = useCallback(
    (planCode: string | undefined) => {
      client.setPlanCode(planCode);
    },
    [client],
  );

  // Register during render so Ask Iris never hits a null handler (useEffect is too late /
  // StrictMode cleanup was clearing the ref between mounts).
  registerAskAboutInsight(handleAskAboutInsight);
  registerSubmitDescribeQuery(handleSubmitDescribeQuery);
  registerSetPlanCode(handleSetPlanCode);

  useEffect(() => {
    const fromRoute = planIdFromLocation(location.state);
    if (fromRoute) {
      describePlanlessRef.current = false;
      client.setPlanCode(fromRoute);
    }
  }, [client, location.state]);

  useEffect(() => {
    if (!open) {
      setComposerText('');
      lastPrefillSeedRef.current = undefined;
      return;
    }
    const seed = context?.prefillText;
    if (seed && seed !== lastPrefillSeedRef.current) {
      lastPrefillSeedRef.current = seed;
      setComposerText(seed);
    }
  }, [open, context?.prefillText]);

  useEffect(() => {
    if (!open) return;
    const root = document.querySelector('.chatbot-modal-wrapper');
    if (root == null) return;
    const likeableIds = (conversation.conversations?.[THREAD_KEY]?.messages ?? [])
      .filter(
        (message) =>
          message.userType === 'bot' && message.enableLikes && message.id != null,
      )
      .map((message) => String(message.id));
    applyIrisFeedbackButtonA11y(root, {
      likeLabel: t('iris.feedback.like'),
      dislikeLabel: t('iris.feedback.dislike'),
      pendingByIndex: likeableIds.map((id) => feedbackPendingIds.has(id)),
    });
  }, [conversation, feedbackPendingIds, open, t]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        openChat(context ?? undefined);
      } else {
        endDescribePresentation();
        closeChat();
      }
    },
    [context, openChat, closeChat, endDescribePresentation],
  );

  const handleClose = useCallback(() => {
    endDescribePresentation();
    closeChat();
  }, [closeChat, endDescribePresentation]);

  const handleSend = useCallback(
    (message: ChatMessage) => {
      const text =
        typeof message.bodyText === 'string'
          ? message.bodyText
          : typeof message.text === 'string'
            ? message.text
            : '';
      const plain = text.trim();
      if (!plain) return;

      setComposerText('');

      if (describePlanlessRef.current) {
        client.connectWithoutPlan();
        enqueueOrStart({
          plainText: plain,
          userMessage: buildPlainUserMessage(plain),
        });
        return;
      }

      const planCode = client.getPlanCode() || planIdFromLocation(location.state);
      if (!planCode) {
        logAgentWsWarn('composer send aborted — no plan_code');
        setConversation((prev) =>
          withMessages(prev, (messages) => [
            ...withoutFollowUps(messages),
            buildPlainUserMessage(plain),
            {
              userType: 'bot',
              bodyType: 'text',
              bodyText: t('iris.missingPlan'),
              ...chatMessageTimeFields(),
            },
          ]),
        );
        return;
      }

      client.setPlanCode(planCode);
      client.connect();
      enqueueOrStart({
        plainText: context?.meta?.hindsightScope ? `${plain}\n\nApplied Hindsight context (frozen when opened): ${JSON.stringify(context.meta.hindsightScope)}` : plain,
        userMessage: buildPlainUserMessage(plain),
      });
    },
    [client, enqueueOrStart, location.state, context, t],
  );

  const handleFeedback = useCallback(
    (chat: ChatMessage, clicked: IrisFeedbackChoice) => {
      const messageId = chat.id == null ? '' : String(chat.id);
      const previousStatus =
        typeof chat.extra?.status === 'string' ? chat.extra.status : undefined;
      const fallback: IrisFeedbackSource = {
        messageId,
        requestId: '',
        sessionId: '',
        conversationId: THREAD_KEY,
        planCode: client.getPlanCode() || planIdFromLocation(location.state) || '',
        query: '',
        responseExcerpt: '',
        responseContentTypes: [],
      };
      const source = readIrisFeedbackSource(messageId);
      if (!source) {
        logAgentWsWarn('feedback source missing; posting identifiers only', messageId);
      }
      const resolved = resolveIrisFeedbackAction({
        messageId,
        extraStatus: previousStatus,
        clicked,
        isInFlight: feedbackInFlightRef.current.has(messageId),
        source,
        fallback,
      });
      if (resolved.kind === 'ignored') return;

      feedbackInFlightRef.current.add(messageId);
      setFeedbackPendingIds((prev) => {
        const next = new Set(prev);
        next.add(messageId);
        return next;
      });
      updateBotMessage(messageId, (msg) => ({
        ...msg,
        extra: { ...msg.extra, status: resolved.extraStatus },
      }));
      setFeedbackAnnouncement(
        resolved.rating === 'like'
          ? t('iris.feedback.ratedLike')
          : resolved.rating === 'dislike'
            ? t('iris.feedback.ratedDislike')
            : t('iris.feedback.cleared'),
      );

      void submitIrisFeedback(resolved.payload)
        .catch((error: unknown) => {
          logAgentWsWarn('feedback POST failed (endpoint may be unshipped)', error);
          if (ROLLBACK_IRIS_FEEDBACK_ON_FAILURE) {
            updateBotMessage(messageId, (msg) => ({
              ...msg,
              extra: { ...msg.extra, status: previousStatus },
            }));
          }
        })
        .finally(() => {
          feedbackInFlightRef.current.delete(messageId);
          setFeedbackPendingIds((prev) => {
            const next = new Set(prev);
            next.delete(messageId);
            return next;
          });
        });
    },
    [client, location.state, t, updateBotMessage],
  );

  const handleLike = useCallback(
    (chat: ChatMessage) => handleFeedback(chat, 'like'),
    [handleFeedback],
  );

  const handleDislike = useCallback(
    (chat: ChatMessage) => handleFeedback(chat, 'dislike'),
    [handleFeedback],
  );

  sendFollowUpRef.current = (question: string) => {
    if (inFlightRef.current) return;
    handleSend(buildPlainUserMessage(question));
  };

  sendActionRef.current = (action: AgentActionOption) => {
    if (inFlightRef.current || actionSendLockRef.current) return;
    const actionId = action.id.trim();
    if (!actionId) return;
    actionSendLockRef.current = true;

    if (describePlanlessRef.current) {
      client.connectWithoutPlan();
      enqueueOrStart({
        plainText: actionId,
        userMessage: buildPlainUserMessage(action.label || actionId),
      });
      return;
    }

    const planCode = client.getPlanCode() || planIdFromLocation(location.state);
    if (!planCode) {
      actionSendLockRef.current = false;
      logAgentWsWarn('action send aborted — no plan_code');
      setConversation((prev) =>
        withMessages(prev, (messages) => [
          ...withoutFollowUps(messages),
          buildPlainUserMessage(action.label),
          {
            userType: 'bot',
            bodyType: 'text',
            bodyText: t('iris.missingPlan'),
            ...chatMessageTimeFields(),
          },
        ]),
      );
      return;
    }

    client.setPlanCode(planCode);
    client.connect();
    enqueueOrStart({
      plainText: actionId,
      userMessage: buildPlainUserMessage(action.label || actionId),
    });
  };

  const showCopilotChrome =
    describeSession && open && context?.widgetId === 'describe-plan';

  return (
    <div
      data-copilot-presentation={showCopilotChrome ? presentation : undefined}
      style={{ display: 'contents' }}
    >
      <FollowUpSendLockProvider locked={thinking}>
        <p className={visuallyHiddenClass} role="status" aria-live="polite">
          {feedbackAnnouncement}
        </p>
        <AIChatPanel
          open={open}
          onOpenChange={handleOpenChange}
          onClose={handleClose}
          userName=""
          conversation={conversation}
          thinking={thinking}
          onSend={handleSend}
          onLike={handleLike}
          onDislike={handleDislike}
          inputText={composerText}
          showNewChat={context?.showNewChat ?? !hasMessages(conversation)}
          showHistory={false}
          tabs={[]}
          hideModuleArrow
          // The thread pill bar is hidden, but these still pin the vendor's own defaults —
          // `threadList` falls back to ['Home', 'Thread 1', 'Thread 2'] when omitted.
          threads={['Home']}
          activeThread="Home"
          footerText={typeof context?.meta?.hindsightContextLabel==='string'?`Context: ${context.meta.hindsightContextLabel}`:undefined}
        />
        {showCopilotChrome ? (
          <DescribeCopilotChrome presentation={presentation} onToggle={togglePresentation} />
        ) : null}
      </FollowUpSendLockProvider>
    </div>
  );
}

export interface AIChatProviderProps {
  children: ReactNode;
}

/**
 * Mounts the AI Chat panel at app level.
 * Wrap inside `BrowserRouter` so plan_code can sync from `location.state`.
 *
 * Remounts only the panel host after logout / auth expiry / Firebase sign-out so the
 * vendor ChatBot and shared WebSocket client cannot stay stuck until a hard reload.
 */
export function AIChatProvider({ children }: AIChatProviderProps) {
  const [hostEpoch, setHostEpoch] = useState(0);
  const onReset = useCallback(() => {
    resetSharedAgentWsClient();
    setHostEpoch((epoch) => epoch + 1);
  }, []);

  return (
    <AIChatContextProvider>
      <IrisSessionResetBridge onReset={onReset} />
      {children}
      <AIChatPanelHost key={hostEpoch} />
    </AIChatContextProvider>
  );
}

/** Closes the panel and bumps the host when auth/session is cleared. */
function IrisSessionResetBridge({ onReset }: { onReset: () => void }) {
  const { closeChat } = useAIChat();

  useEffect(() => {
    const resetSession = () => {
      closeChat();
      onReset();
    };

    window.addEventListener(IRIS_SESSION_RESET_EVENT, resetSession);
    window.addEventListener(AUTH_EXPIRED_EVENT, resetSession);
    return () => {
      window.removeEventListener(IRIS_SESSION_RESET_EVENT, resetSession);
      window.removeEventListener(AUTH_EXPIRED_EVENT, resetSession);
    };
  }, [closeChat, onReset]);

  return null;
}
