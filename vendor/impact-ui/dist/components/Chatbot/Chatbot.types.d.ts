import { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

export interface DragHandleProps {
    onPointerDown: (e: PointerEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
}
export interface ThinkingResponse {
    thinkingHeading?: string;
    thinkingContent?: ReactNode;
}
export interface ChatMessageExtra {
    status?: 'liked' | 'disliked' | string;
}
export interface ChatMessage {
    id?: string | number;
    role?: 'user' | 'assistant' | string;
    userType?: 'bot' | 'user' | string;
    text?: ReactNode;
    bodyText?: ReactNode;
    bodyType?: 'text' | 'jsx' | 'form' | 'table' | 'questions' | string;
    type?: 'text' | 'jsx' | 'form' | 'table' | 'questions' | string;
    jsx?: ReactNode;
    formComponent?: ReactNode;
    tableComponent?: ReactNode;
    timestamp?: string;
    timeStamp?: string;
    firstMessage?: boolean;
    enableLikes?: boolean;
    enableSpeaker?: boolean;
    enableNewThread?: boolean;
    enableAddToPage?: boolean;
    thinkingResponse?: ThinkingResponse;
    isAnimateLike?: boolean;
    isAnimateDislike?: boolean;
    extra?: ChatMessageExtra;
}
export interface ConversationThread {
    messages?: ChatMessage[];
}
export interface ConversationPayload {
    conversations?: Record<string, ConversationThread>;
}
export interface SuggestionBanner {
    freeTextHeading?: string;
    freeTextContent?: string;
}
export interface ModuleItem {
    id?: string | number;
    key?: string;
    name?: string;
    label?: string;
    description?: string;
    icon?: ReactNode | string;
    iconClassName?: string;
    className?: string;
    isActive?: boolean;
    isInitialClickPresent?: boolean;
    tabName?: string;
    initialClick?: boolean;
    onClick?: (item?: TabItem) => void;
}
export interface TabItem {
    key?: string;
    name?: string;
    icon?: ReactNode | string;
    iconClassName?: string;
    className?: string;
    label?: string;
    isActive?: boolean;
    initialClick?: boolean;
    onClick?: (item?: TabItem) => void;
}
export interface UtilityItem {
    key: string;
    icon?: ReactNode | string;
    onClick?: () => void;
}
export interface BookmarkQuestion {
    question: string;
}
export interface HistoryConversationItem {
    conversation_id?: string | number;
    name?: string;
    module_name?: string;
    pinned?: boolean;
}
export interface HistoryPanelGroup {
    group_name: string;
    conversation_list: HistoryConversationItem[];
}
export interface HistoryPanelData {
    pinned?: HistoryConversationItem[];
    groups?: HistoryPanelGroup[];
}
export type HistoryPanelInput = HistoryPanelGroup[] | HistoryPanelData;
export interface ChatInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    setIsNewChat?: (value: boolean) => void;
    onSendIconClick?: (message: ChatMessage, activeList?: string, uniqueId?: string | number) => void;
    setUserChats: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    userChats: ChatMessage[];
    handleRefresh?: () => void;
    handleSaveChat?: () => void;
    handleMicClick?: () => void;
    activeList?: string;
    uniqueId?: string | number;
    suggestionBanner: SuggestionBanner;
    isStopIcon?: boolean;
    onStopIconClick?: (activeList?: string) => void;
    minRows?: number;
    newChatScreen?: boolean;
    customScreen?: boolean;
    onCloseSuggestionBanner?: () => void;
    showSuggestionBanner?: boolean;
    customInputComponent?: ReactNode;
}
export interface ChatbotModuleMenuProps {
    hideMenuArrow?: boolean;
    onModuleClick?: (moduleId?: string | number, moduleName?: string, activeList?: string) => void;
    moduleList: ModuleItem[];
    activeList?: string;
    hideChildren?: boolean;
    isModuleListLoading?: boolean;
    hideSmartBotIcon?: boolean;
    hideCenterOptions?: boolean;
    threadList?: string[];
    activeThread?: string | null;
    handleSavedChat?: () => void;
    onClose?: () => void;
    isFullWidth?: boolean;
    handleCloseThread?: (e: MouseEvent, idx: number) => void;
    handleThreadClick?: (thread: string, idx: number) => void;
    onMinimiseChatBot?: () => void;
    dragHandleProps?: DragHandleProps;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}
export interface ConversationScreenProps {
    userChats: ChatMessage[];
    setUserChats: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    onSendIconClick?: (message: ChatMessage, activeList?: string, uniqueId?: string | number) => void;
    conversation: ConversationPayload;
    solution?: unknown;
    formComponent?: ReactNode;
    tableComponent?: ReactNode;
    isAssistantThinking?: boolean;
    activeList?: string;
    onLikeClick?: (chat: ChatMessage, idx: number) => void;
    onDislikeClick?: (chat: ChatMessage, idx: number) => void;
    inputText?: string;
    handleRefresh?: () => void;
    handleSaveChat?: () => void;
    handleMicClick?: () => void;
    suggestionBanner: SuggestionBanner;
    isStopIcon?: boolean;
    onStopIconClick?: (activeList?: string) => void;
    onCloseSuggestionBanner?: () => void;
    showSuggestionBanner?: boolean;
    customInputComponent?: ReactNode;
    footerText: string;
    isCollapsed: boolean;
}
export interface NewChatComponentProps {
    onClose?: () => void;
    userName?: string;
    inputValue: string;
    setInputValue: (value: string) => void;
    setIsNewChat?: (value: boolean) => void;
    onSendIconClick?: (message: ChatMessage, activeList?: string, uniqueId?: string | number) => void;
    userChats: ChatMessage[];
    setUserChats: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    moduleList?: ModuleItem[];
    onModuleClick?: (moduleId?: string | number, moduleName?: string, activeList?: string) => void;
    activeList?: string;
    handleRefresh?: () => void;
    handleMicClick?: () => void;
    hideMenuArrow?: boolean;
    isModuleListLoading?: boolean;
    suggestionBanner: SuggestionBanner;
    isStopIcon?: boolean;
    onStopIconClick?: (activeList?: string) => void;
    onCloseSuggestionBanner?: () => void;
    showSuggestionBanner?: boolean;
    customInputComponent?: ReactNode;
    handleSaveChat?: () => void;
    footerText: string;
}
export interface CustomScreenProps {
    onClose?: () => void;
    customScreenJsx?: ReactNode;
    userChats: ChatMessage[];
    setUserChats: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    onSendIconClick?: (message: ChatMessage, activeList?: string, uniqueId?: string | number) => void;
    activeList?: string;
    handleRefresh?: () => void;
    handleMicClick?: () => void;
    suggestionBanner: SuggestionBanner;
    isStopIcon?: boolean;
    onStopIconClick?: (activeList?: string) => void;
    onCloseSuggestionBanner?: () => void;
    showSuggestionBanner?: boolean;
    customInputComponent?: ReactNode;
    isFullWidth?: boolean;
    onMinimiseChatBot?: () => void;
    handleSaveChat?: () => void;
    footerText: string;
}
export interface ChatBotLandingScreenProps {
    onClose?: () => void;
    isFullWidth?: boolean;
}
export interface ChatBotFooterProps {
    footerText?: string;
}
export interface BookMarkPanelProps {
    preDefinedQuestions?: BookmarkQuestion[];
    addedByYouQuestions?: BookmarkQuestion[];
    onClose?: () => void;
}
export interface HistoryPanelProps {
    historyPanelData?: HistoryPanelInput;
    isConversationLoading?: boolean;
    onClose?: () => void;
    onSearchChange?: (value: string) => void;
    onSelectConversation?: (item: HistoryConversationItem) => void;
    onToggleGroup?: (name: string, open: boolean) => void;
    openGroups?: Record<string, boolean>;
    onMenuAction?: (action: 'share' | 'rename' | 'pin' | 'unpin' | 'delete' | string, item: HistoryConversationItem) => void;
    activeConversationId?: string | number;
}
export interface ChatbotProps extends BaseComponentProps {
    onClose?: () => void;
    userName?: string;
    isChatBotOpen: boolean;
    setIsChatBotOpen: (open: boolean) => void;
    conversation?: ConversationPayload;
    solution?: unknown;
    formComponent?: ReactNode;
    tableComponent?: ReactNode;
    preDefinedQuestions?: BookmarkQuestion[];
    addedByYouQuestions?: BookmarkQuestion[];
    onSendIconClick?: (message: ChatMessage, activeList?: string, uniqueId?: string | number) => void;
    assistantChats?: ChatMessage[];
    isAssistantThinking?: boolean;
    moduleList?: ModuleItem[];
    onModuleClick?: (moduleId?: string | number, moduleName?: string, activeList?: string) => void;
    tabList?: TabItem[];
    handleSavedChat?: () => void;
    threadList?: string[];
    activeThread?: string | null;
    isCustomScreen?: boolean;
    customScreenJsx?: ReactNode;
    onLikeClick?: (chat: ChatMessage, idx: number) => void;
    onDislikeClick?: (chat: ChatMessage, idx: number) => void;
    handleNewChatClick?: (item?: TabItem) => {
        isInitialClickPresent?: boolean;
        tabName?: string;
    } | void;
    inputText?: string;
    handleRefresh?: () => void;
    handleMicClick?: () => void;
    hideMenuArrow?: boolean;
    newChatScreen?: boolean;
    isModuleListLoading?: boolean;
    suggestionBanner?: SuggestionBanner;
    isStopIcon?: boolean;
    onStopIconClick?: (activeList?: string) => void;
    landingScreen?: boolean;
    footerText?: string;
    onCloseSuggestionBanner?: () => void;
    showSuggestionBanner?: boolean;
    utilityList?: UtilityItem[];
    customInputComponent?: ReactNode;
    onHistoryPanelClick?: (item?: TabItem, open?: boolean) => void;
    historyPanelData?: HistoryPanelInput;
    onHistorySearchChange?: (value: string) => void;
    onHistorySelectConversation?: (item: HistoryConversationItem) => void;
    onHistoryToggleGroup?: (name: string, open: boolean) => void;
    historyOpenGroups?: Record<string, boolean>;
    onHistoryMenuAction?: (action: string, item: HistoryConversationItem) => void;
    isConversationLoading?: boolean;
    showHistoryPanel?: boolean;
    isFullWidth?: boolean;
    activeConversationId?: string | number;
    handleCloseThread?: (e: MouseEvent, idx: number) => void;
    handleThreadClick?: (thread: string, idx: number) => void;
    onMinimiseChatBot?: () => void;
    onChatBotResize?: (width: number) => void;
    handleSaveChat?: () => void;
}
//# sourceMappingURL=Chatbot.types.d.ts.map