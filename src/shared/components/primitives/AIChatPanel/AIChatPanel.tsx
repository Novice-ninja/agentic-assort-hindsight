import { type ReactNode, useCallback, useMemo } from 'react';
import {
  ChatBotComponent,
  type BookmarkQuestion,
  type ChatbotModuleItem,
  type ChatbotProps,
  type ChatbotTabItem,
  type ChatbotUtilityItem,
  type ChatMessage,
  type ConversationPayload,
  type HistoryConversationItem,
  type HistoryPanelData,
  type HistoryPanelGroup,
  type SuggestionBanner,
} from '@shared/components/vendor/impact-ui';
// Imported after the vendor barrel so these overrides land after the stylesheet the vendor
// injects on import. See the file header for why they also carry extra specificity.
import './chatPanelChrome.css';

// ─── Public Types ────────────────────────────────────────────────────────────

export type {
  BookmarkQuestion,
  ChatbotModuleItem,
  ChatbotTabItem,
  ChatbotUtilityItem,
  ChatMessage,
  ConversationPayload,
  HistoryConversationItem,
  HistoryPanelData,
  HistoryPanelGroup,
  SuggestionBanner,
};

export interface AIChatPanelProps {
  /** Whether the chat panel is open/visible */
  open: boolean;
  /** Callback to change the open state */
  onOpenChange: (open: boolean) => void;
  /** Called when the panel is explicitly closed */
  onClose?: () => void;
  /** Display name shown in the greeting */
  userName?: string;

  // ─── Layout ────────────────────────────────────────────────────────────────

  /** Full-width mode — disables drag/resize, takes near-viewport width */
  fullWidth?: boolean;
  /** Called when the minimise button is clicked */
  onMinimise?: () => void;
  /** Called when the user resizes the panel */
  onResize?: (width: number) => void;

  // ─── Screen Modes ──────────────────────────────────────────────────────────

  /** Show the landing/splash screen */
  showLanding?: boolean;
  /** Show the new-chat screen (module picker + greeting) */
  showNewChat?: boolean;
  /** Show a fully custom screen (replaces header + content) */
  showCustomScreen?: boolean;
  /** JSX rendered when `showCustomScreen` is true */
  customContent?: ReactNode;

  // ─── Conversation ──────────────────────────────────────────────────────────

  /** Conversation payload with messages keyed by thread */
  conversation?: ConversationPayload;
  /** Pre-loaded assistant messages */
  assistantMessages?: ChatMessage[];
  /** Show the "thinking" typing indicator */
  thinking?: boolean;
  /** Controlled input text value */
  inputText?: string;
  /** Called when the user sends a message */
  onSend?: (message: ChatMessage, activeList?: string, uniqueId?: string | number) => void;
  /** Called when user likes a message */
  onLike?: (message: ChatMessage, index: number) => void;
  /** Called when user dislikes a message */
  onDislike?: (message: ChatMessage, index: number) => void;
  /** Show a stop/cancel button instead of send */
  showStop?: boolean;
  /** Called when stop is clicked */
  onStop?: (activeList?: string) => void;

  // ─── Modules ───────────────────────────────────────────────────────────────

  /** Available modules for the module selector */
  modules?: ChatbotModuleItem[];
  /** Called when a module is selected */
  onModuleSelect?: (moduleId?: string | number, moduleName?: string, activeList?: string) => void;
  /** Module list loading state */
  modulesLoading?: boolean;
  /** Hide the module dropdown arrow */
  hideModuleArrow?: boolean;

  // ─── Sidebar Tabs & Utilities ──────────────────────────────────────────────

  /** Custom sidebar tabs (replaces defaults if provided) */
  tabs?: ChatbotTabItem[];
  /** Utility icons at the bottom of the sidebar */
  utilities?: ChatbotUtilityItem[];
  /** Called when "New Chat" is clicked */
  onNewChat?: (item?: ChatbotTabItem) => { isInitialClickPresent?: boolean; tabName?: string } | void;

  // ─── Threads ───────────────────────────────────────────────────────────────

  /** Thread names shown in the header */
  threads?: string[];
  /** Currently active thread */
  activeThread?: string | null;
  /** Called when a thread tab is clicked */
  onThreadSelect?: (thread: string, index: number) => void;
  /** Called when a thread close button is clicked */
  onThreadClose?: (e: React.MouseEvent, index: number) => void;

  // ─── History Panel ─────────────────────────────────────────────────────────

  /** Show the history tab in sidebar */
  showHistory?: boolean;
  /** Data for the history panel */
  historyData?: HistoryPanelGroup[] | HistoryPanelData;
  /** Called when history panel is toggled */
  onHistoryToggle?: (item?: unknown, open?: boolean) => void;
  /** Called when search changes in history */
  onHistorySearch?: (value: string) => void;
  /** Called when a conversation is selected from history */
  onHistorySelect?: (item: HistoryConversationItem) => void;
  /** Called when a history group is expanded/collapsed */
  onHistoryGroupToggle?: (name: string, open: boolean) => void;
  /** Controlled open state for history groups */
  historyOpenGroups?: Record<string, boolean>;
  /** Called for actions (share/rename/pin/delete) on history items */
  onHistoryAction?: (action: string, item: HistoryConversationItem) => void;
  /** ID of the currently active conversation (highlights in history) */
  activeConversationId?: string | number;

  // ─── Bookmarks ─────────────────────────────────────────────────────────────

  /** Pre-defined bookmarked questions */
  predefinedBookmarks?: BookmarkQuestion[];
  /** User-added bookmarked questions */
  userBookmarks?: BookmarkQuestion[];
  /** Called when saved chat action is triggered */
  onSavedChat?: () => void;

  // ─── Input & Footer ────────────────────────────────────────────────────────

  /** Replace the default chat input with custom JSX */
  customInput?: ReactNode;
  /** Called when refresh button is clicked */
  onRefresh?: () => void;
  /** Called when save chat button is clicked */
  onSaveChat?: () => void;
  /** Called when microphone button is clicked */
  onMicClick?: () => void;
  /** Footer disclaimer text */
  footerText?: string;
  /** Suggestion banner content */
  suggestionBanner?: SuggestionBanner;
  /** Whether to show the suggestion banner */
  showSuggestionBanner?: boolean;
  /** Called when suggestion banner is dismissed */
  onCloseSuggestionBanner?: () => void;
}

/**
 * Generic AI Chat Panel.
 *
 * A reusable wrapper around Impact UI's `ChatBotComponent` providing a clean,
 * consistently-named prop surface for use across any module. Import it from
 * `@shared/components` and pass only the props your use-case requires.
 */
export function AIChatPanel({
  open,
  onOpenChange,
  onClose,
  userName,
  fullWidth = false,
  onMinimise,
  onResize,
  showLanding = false,
  showNewChat = false,
  showCustomScreen = false,
  customContent,
  conversation,
  assistantMessages,
  thinking = false,
  inputText,
  onSend,
  onLike,
  onDislike,
  showStop = false,
  onStop,
  modules,
  onModuleSelect,
  modulesLoading = false,
  hideModuleArrow = false,
  tabs,
  utilities,
  onNewChat,
  threads,
  activeThread,
  onThreadSelect,
  onThreadClose,
  showHistory = true,
  historyData,
  onHistoryToggle,
  onHistorySearch,
  onHistorySelect,
  onHistoryGroupToggle,
  historyOpenGroups,
  onHistoryAction,
  activeConversationId,
  predefinedBookmarks,
  userBookmarks,
  onSavedChat,
  customInput,
  onRefresh,
  onSaveChat,
  onMicClick,
  footerText,
  suggestionBanner,
  showSuggestionBanner = false,
  onCloseSuggestionBanner,
}: AIChatPanelProps) {
  const handleSend = useCallback(
    (message: ChatMessage, activeList?: string, uniqueId?: string | number) => {
      onSend?.(message, activeList, uniqueId);
    },
    [onSend],
  );

  const handleLike = useCallback(
    (chat: ChatMessage, idx: number) => { onLike?.(chat, idx); },
    [onLike],
  );

  const handleDislike = useCallback(
    (chat: ChatMessage, idx: number) => { onDislike?.(chat, idx); },
    [onDislike],
  );

  const chatbotProps: ChatbotProps = useMemo(
    () => ({
      isChatBotOpen: open,
      setIsChatBotOpen: onOpenChange,
      onClose,
      userName,
      isFullWidth: fullWidth,
      onMinimiseChatBot: onMinimise,
      onChatBotResize: onResize,

      landingScreen: showLanding,
      newChatScreen: showNewChat,
      isCustomScreen: showCustomScreen,
      customScreenJsx: customContent,

      conversation,
      assistantChats: assistantMessages,
      isAssistantThinking: thinking,
      inputText,
      onSendIconClick: handleSend,
      onLikeClick: handleLike,
      onDislikeClick: handleDislike,
      isStopIcon: showStop,
      onStopIconClick: onStop,

      moduleList: modules,
      onModuleClick: onModuleSelect,
      isModuleListLoading: modulesLoading,
      hideMenuArrow: hideModuleArrow,
      tabList: tabs,
      utilityList: utilities,
      handleNewChatClick: onNewChat,

      threadList: threads,
      activeThread,
      handleThreadClick: onThreadSelect,
      handleCloseThread: onThreadClose,

      showHistoryPanel: showHistory,
      historyPanelData: historyData,
      onHistoryPanelClick: onHistoryToggle,
      onHistorySearchChange: onHistorySearch,
      onHistorySelectConversation: onHistorySelect,
      onHistoryToggleGroup: onHistoryGroupToggle,
      historyOpenGroups,
      onHistoryMenuAction: onHistoryAction,
      activeConversationId,

      preDefinedQuestions: predefinedBookmarks,
      addedByYouQuestions: userBookmarks,
      handleSavedChat: onSavedChat,

      customInputComponent: customInput,
      handleRefresh: onRefresh,
      handleSaveChat: onSaveChat,
      handleMicClick: onMicClick,
      footerText,
      suggestionBanner,
      showSuggestionBanner,
      onCloseSuggestionBanner,
    }),
    [
      open, onOpenChange, onClose, userName, fullWidth, onMinimise, onResize,
      showLanding, showNewChat, showCustomScreen, customContent,
      conversation, assistantMessages, thinking, inputText,
      handleSend, handleLike, handleDislike, showStop, onStop,
      modules, onModuleSelect, modulesLoading, hideModuleArrow,
      tabs, utilities, onNewChat,
      threads, activeThread, onThreadSelect, onThreadClose,
      showHistory, historyData, onHistoryToggle, onHistorySearch,
      onHistorySelect, onHistoryGroupToggle, historyOpenGroups,
      onHistoryAction, activeConversationId,
      predefinedBookmarks, userBookmarks, onSavedChat,
      customInput, onRefresh, onSaveChat, onMicClick,
      footerText, suggestionBanner, showSuggestionBanner, onCloseSuggestionBanner,
    ],
  );

  return <ChatBotComponent {...chatbotProps} />;
}
