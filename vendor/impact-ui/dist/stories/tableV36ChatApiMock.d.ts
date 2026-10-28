/**
 * Fully API-driven mock for TableV36 + Table Chat Storybook demos.
 * Every chatConfiguration key is wired to an async handler that logs the call
 * and reads/writes an in-memory store (simulates REST/WebSocket backends).
 */
export declare const tableV36ChatRowData: {
    id: number;
    make: string;
    model: string;
    price: number;
    year: number;
    status: string;
}[];
export declare const tableV36ChatColumnDefs: ({
    field: string;
    checkboxSelection: boolean;
    headerCheckboxSelection: boolean;
    suppressMenu: boolean;
    filter: boolean;
    sortable: boolean;
    pinned: string;
    minWidth: number;
    maxWidth: number;
    headerName?: undefined;
} | {
    field: string;
    headerName: string;
    filter: string;
    minWidth: number;
    checkboxSelection?: undefined;
    headerCheckboxSelection?: undefined;
    suppressMenu?: undefined;
    sortable?: undefined;
    pinned?: undefined;
    maxWidth?: undefined;
})[];
declare const seedChannels: () => ({
    id: number;
    title: string;
    time: string;
    unreadCount: number;
    owner: number;
} | {
    id: number;
    title: string;
    time: string;
    unreadCount: number;
    owner?: undefined;
} | {
    id: number;
    title: string;
    time: string;
    unreadCount?: undefined;
    owner?: undefined;
})[];
type ChatTopic = {
    id: string;
    user: string;
    text: string | null;
    title?: string;
    subtitle?: string | null;
    isChecked: boolean;
    isPinned: boolean;
    unreadCount: number;
    messageCount: number;
    timestamp: string;
    otherProps: Record<string, unknown>;
};
declare const seedChatsByChannel: () => Record<number, ChatTopic[]>;
declare const generateMessages: (chatId: string, page?: number, limit?: number) => {
    id: string;
    author: string;
    authorName: string;
    content: string;
    timestamp: string;
    date: string;
    showReplyBadge: boolean;
    replyText: string | null;
    priority: string;
    edited: boolean;
    deleted: boolean;
    isPinned: boolean;
    showActions: boolean;
    otherProps: {
        sender_id: number;
        created_at: string;
        sender_name: string;
    };
}[];
export type TableV36ChatApiStore = {
    channels: ReturnType<typeof seedChannels>;
    chatsByChannel: ReturnType<typeof seedChatsByChannel>;
    messagesByChat: Record<string, ReturnType<typeof generateMessages>>;
    pinnedByChat: Record<string, unknown[]>;
    participantsByChat: Record<string, unknown[]>;
    threadByParent: Record<string, unknown[]>;
    realTimeMessages: unknown[];
    pinStateByChat: Record<string, boolean>;
};
export declare const createTableV36ChatApiStore: () => TableV36ChatApiStore;
export type CreateTableV36ApiDrivenChatConfigurationOptions = {
    store: TableV36ChatApiStore;
    /** Bump when store mutates so React recomputes chatConfiguration */
    revision?: number;
    messagesClearedTrigger?: number;
    onStoreMutate?: () => void;
};
/**
 * Builds a chatConfiguration object with every key used by TableChatSidePanel /
 * TableChatRightSection. All data flows through async API handlers backed by `store`.
 */
export declare const createTableV36ApiDrivenChatConfiguration: ({ store, revision, messagesClearedTrigger, onStoreMutate, }: CreateTableV36ApiDrivenChatConfigurationOptions) => {
    title: string;
    tooltipConfig: {
        title: string;
        description: string;
    };
    messageChatConfig: {
        realTimeMessages: unknown[];
        isWebSocketConnected: boolean;
        currentTopicId: null;
        isThreadIconVisible: boolean;
        isPinChatIconVisible: boolean;
        emptyChannelStateTitle: string;
        emptyChannelStateSubTitle: string;
        emptyChatStateTitle: string;
        emptyChatStateSubTitle: string;
        currentUserId: number;
        selectedMessageId: string;
        maxSearchPages: number;
        highlightDuration: number;
        scrollBehavior: string;
        scrollBlock: string;
        highlightColor: null;
        onRealTimeMessageUpdate: (newMessage: unknown) => void;
        onMessageReply: (messageId: string, message: unknown) => void;
        onMessageBookmark: (messageId: string, message: unknown) => void;
        onMessagePin: (messageId: string, pinned: boolean, _chatId: string, item: unknown, selectedChannelInfo?: unknown, selectedChatInfo?: unknown) => Promise<{
            id: string;
            isPinned: boolean;
        }>;
        onMessageUpdate: (messageId: string, updatedData: unknown) => Promise<{
            success: boolean;
            messageId: string;
            updatedData: unknown;
        }>;
        onMessageDelete: (messageId: string) => Promise<{
            success: boolean;
            messageId: string;
        }>;
        onThreadClick: (messageId: string, message: unknown) => void;
        loadThreadMessages: (parentMessageId: string) => Promise<unknown[]>;
        loadPinnedMsg: () => Promise<{
            user: string;
            userInitials: string;
            timestamp: string;
            text: string;
            isPinned: boolean;
        }[]>;
        onSearchMessage: (value: string, chatId: string) => Promise<{
            id: string;
            author: string;
            authorName: string;
            content: string;
            timestamp: string;
            date: string;
            showActions: boolean;
            searchHighlight: boolean;
        }[]>;
        onClearAllMessages: (chatId: string) => Promise<{
            success: boolean;
        }>;
        leaveCurrentTopic: () => void;
        markTopicAsDeleted: (topicId: string) => void;
        messageConfig: {
            showActions: boolean;
            priorityOptions: {
                value: string;
                label: string;
            }[];
            quickActionProps: {
                value: string;
                label: string;
                prefillText: string;
            }[];
            isMsgFormat: boolean;
        };
    };
    headerChatConfig: {
        participants: unknown[] | undefined;
        loadParticipants: (radioValue: string, selectedChannelInfo: unknown, selectedChatInfo: unknown) => Promise<({
            id: number;
            label: string;
            value: string;
            role: string;
            disabled: boolean;
        } | {
            id: number;
            label: string;
            value: string;
            role: string;
            disabled?: undefined;
        })[] | {
            id: number;
            label: string;
            value: number;
            otherProps: {
                user_name: string;
                user_code: number;
                email: string;
            };
        }[]>;
        loadParticipantsAvatar: (selectedRadioOption: string, chatId: string) => Promise<unknown[] | undefined>;
        onParticipantsClick: (radioValue: string) => Promise<{
            id: number;
            label: string;
            value: string;
            role: string;
        }[]>;
        onParticipantAdd: (participant: unknown, selectedRadioOption: string, chatId: string) => Promise<{
            success: boolean;
            participant: unknown;
        }>;
        onParticipantRemove: (participant: unknown) => Promise<{
            success: boolean;
            participant: unknown;
        }>;
        onPinnedClick: (chatId: string) => Promise<unknown[]>;
        onSearchChange: (value: string, radioValue: string, chatId: string) => Promise<{
            id: number;
            label: string;
            value: number;
            otherProps: {
                user_name: string;
                user_code: number;
            };
        }[]>;
        onNotificationSettingChange: (settings: unknown) => Promise<{
            success: boolean;
            settings: unknown;
        }>;
        onPinnedChatClick: (chatId: string, isPinned: boolean) => Promise<boolean>;
        onChatClick: (chatId: string, channelId: string) => Promise<void>;
        notificationSettings: {
            notificationSetting: string;
            includeChannelMentions: boolean;
            muteChannel: boolean;
            channelName: string;
        };
        headerConfig: {
            showSearch: boolean;
            showParticipants: boolean;
            showPinned: boolean;
            showNotifications: boolean;
            selectedRadioOptionMenu: string;
            maxAvatars: number;
            radioOptions: {
                label: string;
                value: string;
            }[];
            searchConfig: {
                placeholder: string;
                debounceMs: number;
                minChars: number;
            };
        };
    };
    inputChatConfig: {
        onSend: (payload: {
            content?: string;
        }, chatId: string) => Promise<{
            id: string;
            author: string;
            authorName: string;
            content: string;
            timestamp: string;
            date: string;
            showReplyBadge: boolean;
            replyText: string | null;
            priority: string;
            edited: boolean;
            deleted: boolean;
            isPinned: boolean;
            showActions: boolean;
            otherProps: {
                sender_id: number;
                created_at: string;
                sender_name: string;
            };
        }>;
        onMessageReply: (messageId: string, chatId: string) => void;
        onMessageBookmark: (messageId: string, chatId: string) => void;
        onMessageMore: (messageId: string, chatId: string) => void;
        onAttachFile: (file: unknown) => void;
        onImageUpload: (image: unknown) => void;
        onEmojiSelect: (emoji: unknown) => void;
        inputConfig: {
            placeholder: string;
            maxLength: number;
            showFormatting: boolean;
            showEmojiPicker: boolean;
            showAttachments: boolean;
            showQuickAction: boolean;
            quickActionLabel: string;
            allowedFileTypes: string[];
            quickActions: {
                label: string;
                action: string;
            }[];
        };
    };
    leftPanel: {
        leftHeaderPanel: {
            showAddChat: boolean;
        };
        leftChatPanel: {
            showCheckbox: boolean;
        };
        rightHeaderPanel: {
            showParticipants: boolean;
            showPinnedChat: boolean;
            showChatSearch: boolean;
            showActionBtn: boolean;
        };
        inputPanelConfig: {
            inputPlaceholder: string;
            textAreaPlaceholder: string;
        };
        loadChannelsList: () => Promise<({
            id: number;
            title: string;
            time: string;
            unreadCount: number;
            owner: number;
        } | {
            id: number;
            title: string;
            time: string;
            unreadCount: number;
            owner?: undefined;
        } | {
            id: number;
            title: string;
            time: string;
            unreadCount?: undefined;
            owner?: undefined;
        })[]>;
        loadChatList: (selectedChannelInfo: {
            id?: number;
        }) => Promise<ChatTopic[]>;
        handleChatName: (formData: {
            chatName?: string;
            chatDescription?: string;
        }, selectedChannelInfo: {
            id?: number;
        } | null) => Promise<{
            success: boolean;
            formattedChat: {
                id: string;
                user: string;
                text: null;
                title: string | undefined;
                subtitle: string | null;
                isChecked: boolean;
                isPinned: boolean;
                unreadCount: number;
                messageCount: number;
                timestamp: string;
                otherProps: {
                    topic_id: string;
                    name: string | undefined;
                    description: string | null;
                    object_type: string;
                    object_ids: string[];
                    is_pinned: boolean;
                };
            };
        }>;
        deleteChat: (topicId: string) => Promise<{
            success: boolean;
            topicId: string;
        }>;
        directChatList: never[];
        hasDirectChatList: boolean;
        selectedChatId: null;
        clearDirectChatList: () => void;
    };
    rightPanel: {
        messagesClearedTrigger: number;
        loadMessages: (chatId: string, page?: number) => Promise<{
            id: string;
            author: string;
            authorName: string;
            content: string;
            timestamp: string;
            date: string;
            showReplyBadge: boolean;
            replyText: string | null;
            priority: string;
            edited: boolean;
            deleted: boolean;
            isPinned: boolean;
            showActions: boolean;
            otherProps: {
                sender_id: number;
                created_at: string;
                sender_name: string;
            };
        }[]>;
        loadOlderMessages: (channelId: string) => Promise<{
            id: string;
            author: string;
            content: string;
            timestamp: string;
            date: string;
        }[]>;
    };
};
export {};
//# sourceMappingURL=tableV36ChatApiMock.d.ts.map