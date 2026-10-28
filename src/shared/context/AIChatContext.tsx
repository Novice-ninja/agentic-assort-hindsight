import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ─── Public Types ────────────────────────────────────────────────────────────

export interface AIChatOpenContext {
  /** Which module triggered the panel */
  source?: 'header' | 'hindsight' | 'planning' | 'admin' | 'dashboard' | string;
  /** Widget identifier for deeper context */
  widgetId?: string;
  /** Pre-fill the input with this text */
  prefillText?: string;
  /** Pre-select a module in the module picker */
  moduleId?: string | number;
  /** Show the new-chat screen vs jumping straight to conversation */
  showNewChat?: boolean;
  /** Any extra metadata for downstream handlers */
  meta?: Record<string, unknown>;
}

export interface SubmitDescribeQueryInput {
  /** Exact query to show in the thread and send to the planless agent socket. */
  query: string;
}

/** Payload for Season Narrative (and similar) Ask Iris → auto-send on the shared panel. */
export interface AskAboutInsightInput {
  /** Plain text for the WS `{ type: "query", query }` frame. */
  plainText: string;
  /** Optional rich user bubble (sanitized HTML). */
  displayHtml?: { titleHtml: string; bodyHtml: string };
  source?: AIChatOpenContext['source'];
  widgetId?: string;
  /** Overrides the socket plan when provided. */
  planCode?: string;
}

export interface AIChatContextValue {
  /** Whether the AI chat panel is currently open */
  open: boolean;
  /** Contextual payload passed when the panel was opened */
  context: AIChatOpenContext | null;
  /** Open the AI chat panel, optionally with contextual data */
  openChat: (ctx?: AIChatOpenContext) => void;
  /** Close the AI chat panel and clear context */
  closeChat: () => void;
  /**
   * Open the shared panel, append a user bubble, and enqueue a WS query.
   * Mid-stream calls queue until the in-flight reply finishes.
   */
  askAboutInsight: (input: AskAboutInsightInput) => void;
  /** Open the shared panel and send `query` without a plan_code. */
  submitDescribeQuery: (input: SubmitDescribeQueryInput) => boolean;
  /** Sync plan_code for the agent socket (reconnects on change; messages preserved). */
  setPlanCode: (planCode: string | undefined) => void;
  /** A mounted workspace can supply its contextual panel while retaining one global header entry. */
  registerOpenChatInterceptor: (handler: ((context?: AIChatOpenContext) => boolean) | null) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AIChatContext = createContext<AIChatContextValue | null>(null);

export type AskAboutInsightHandler = (input: AskAboutInsightInput) => void;
export type SubmitDescribeQueryHandler = (input: SubmitDescribeQueryInput) => boolean;
export type SetPlanCodeHandler = (planCode: string | undefined) => void;

export interface AIChatHostHandlers {
  registerAskAboutInsight: (handler: AskAboutInsightHandler | null) => void;
  registerSubmitDescribeQuery: (handler: SubmitDescribeQueryHandler | null) => void;
  registerSetPlanCode: (handler: SetPlanCodeHandler | null) => void;
}

const AIChatHostHandlersContext = createContext<AIChatHostHandlers | null>(null);

export function useAIChatHostHandlers(): AIChatHostHandlers {
  const ctx = useContext(AIChatHostHandlersContext);
  if (!ctx) {
    throw new Error('useAIChatHostHandlers must be used within an AIChatProvider');
  }
  return ctx;
}

export function useAIChat(): AIChatContextValue {
  const ctx = useContext(AIChatContext);
  if (!ctx) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return ctx;
}

export function AIChatContextProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [chatContext, setChatContext] = useState<AIChatOpenContext | null>(null);
  const askHandlerRef = useRef<AskAboutInsightHandler | null>(null);
  const submitDescribeRef = useRef<SubmitDescribeQueryHandler | null>(null);
  const planHandlerRef = useRef<SetPlanCodeHandler | null>(null);
  const openInterceptorRef = useRef<((context?: AIChatOpenContext) => boolean) | null>(null);
  const registerOpenChatInterceptor = useCallback((handler: ((context?: AIChatOpenContext) => boolean) | null) => { openInterceptorRef.current = handler; }, []);

  const openChat = useCallback((ctx?: AIChatOpenContext) => {
    if (openInterceptorRef.current?.(ctx)) return;
    setChatContext(ctx ?? null);
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setOpen(false);
    setChatContext(null);
  }, []);

  const askAboutInsight = useCallback((input: AskAboutInsightInput) => {
    setChatContext({
      source: input.source ?? 'hindsight',
      widgetId: input.widgetId,
      showNewChat: false,
    });
    setOpen(true);

    const handler = askHandlerRef.current;
    if (!handler) {
      // eslint-disable-next-line no-console
      console.warn(
        '[iris] askAboutInsight: host handler not registered — WebSocket will not start',
        { planCode: input.planCode, widgetId: input.widgetId },
      );
      return;
    }
    // eslint-disable-next-line no-console
    console.info('[iris] askAboutInsight', {
      planCode: input.planCode,
      widgetId: input.widgetId,
      queryPreview: input.plainText.slice(0, 80),
    });
    handler(input);
  }, []);

  const submitDescribeQuery = useCallback((input: SubmitDescribeQueryInput) => {
    setChatContext({
      source: 'clustering',
      widgetId: 'describe-plan',
      showNewChat: false,
    });
    setOpen(true);
    const handler = submitDescribeRef.current;
    if (!handler) {
      // eslint-disable-next-line no-console
      console.warn(
        '[iris] submitDescribeQuery: host handler not registered — query will not send',
      );
      return false;
    }
    return handler(input);
  }, []);

  const setPlanCode = useCallback((planCode: string | undefined) => {
    planHandlerRef.current?.(planCode);
  }, []);

  const hostHandlers = useMemo<AIChatHostHandlers>(
    () => ({
      registerAskAboutInsight: (handler) => {
        askHandlerRef.current = handler;
      },
      registerSubmitDescribeQuery: (handler) => {
        submitDescribeRef.current = handler;
      },
      registerSetPlanCode: (handler) => {
        planHandlerRef.current = handler;
      },
    }),
    [],
  );

  const value = useMemo<AIChatContextValue>(
    () => ({
      open,
      context: chatContext,
      openChat,
      closeChat,
      askAboutInsight,
      submitDescribeQuery,
      setPlanCode,
      registerOpenChatInterceptor,
    }),
    [
      open,
      chatContext,
      openChat,
      closeChat,
      askAboutInsight,
      submitDescribeQuery,
      setPlanCode,
      registerOpenChatInterceptor,
    ],
  );

  return (
    <AIChatHostHandlersContext.Provider value={hostHandlers}>
      <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>
    </AIChatHostHandlersContext.Provider>
  );
}
