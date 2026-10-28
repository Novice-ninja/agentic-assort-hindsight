!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.table-chat-right-section-container{background:#fff;border-radius:10px;box-sizing:border-box;display:flex;flex:1 1 0;flex-direction:column;height:100%;max-width:100%;min-width:0;overflow:hidden;position:relative;width:100%}.table-chat-right-section-container .clear-chat-button-container{background:#fff;box-sizing:border-box;cursor:pointer;display:flex;justify-content:flex-end;padding:8px 16px;position:absolute;top:64px;width:100%;z-index:999}.table-chat-right-section-container-empty{background:#fff;border-radius:10px;display:flex;flex-direction:column;height:100%;max-width:640px;position:relative;width:100%}.table-chat-messages{background:#fff;box-sizing:border-box;display:flex;flex:1;flex-direction:column;gap:10px;justify-content:flex-start;margin-bottom:10px;min-width:0;overflow-x:hidden;overflow-y:auto;padding:16px 20px}.empty-state-container{justify-content:center}.message-wrapper{box-sizing:border-box;display:flex;flex-direction:column;gap:4px;min-width:0;position:relative;width:100%}.table-chat-empty-state{align-items:center;color:#7a8294;display:flex;flex-direction:column;font-size:14px;gap:20px;justify-content:center;max-width:641px;padding:0 60px;text-align:center}.table-chat-empty-state p{margin:0}.infinite-scroll-trigger{min-height:60px;padding:16px}.infinite-scroll-loading,.infinite-scroll-trigger{align-items:center;display:flex;justify-content:center}.infinite-scroll-loading{width:100%}.infinite-scroll-placeholder{height:1px;width:100%}.infinite-scroll-error{align-items:center;background:#e155541a;border-radius:8px;color:#e15554;display:flex;flex-direction:column;justify-content:center;margin:8px 0;padding:16px;text-align:center}.infinite-scroll-error p{font-size:12px;margin:0 0 8px}.add_member_btn{border-radius:25px!important;margin:0 auto;width:200px}.add_members_modal{width:320px!important}.modal-header-search-input-container{align-items:center;display:flex;margin-bottom:16px;width:100%}.modal-header-search-input-container .menu-header-search-icon{margin-top:4px;width:20px}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useRef, useState, useCallback, useEffect } from "react";
import { getAssetUrl } from "../../../../utils/assetBase.js";
import { ChatHeader } from "./ChatHeader/ChatHeader.js";
import { ChatInput } from "./ChatInput/ChatInput.js";
import { ChatMessage } from "./ChatMessages/ChatMessage.js";
import { DateSeparator } from "./DateSeparator/DateSeparator.js";
import { Avatar } from "../../../Avatar/index.js";
import { Button } from "../../../Button/index.js";
import { Checkbox } from "../../../Checkbox/index.js";
import { Input } from "../../../Input/index.js";
import { Loader } from "../../../Loader/index.js";
import { Modal } from "../../../Modal/index.js";
import { Prompt } from "../../../Prompt/index.js";
import { EmptyContainer } from "../../EmptyContainer.js";
import useInfiniteScroll from "../../hooks/useInfiniteScroll.js";
import ChatMessageListSkeleton from "../ChatMessageSkeleton/ChatMessageListSkeleton.js";

import { useTranslation } from "../../../../i18n/useTranslation.js";
const SearchIcon = getAssetUrl("icons/searchIcon.svg");
const TableChatRightSection = ({
  // Header props
  title,
  chatId,
  CreatedBy,
  createdAt,
  participants = [],
  participantsList = [],
  onParticipantsClick,
  // Messages props
  messages: propMessages = [],
  // Input props
  placeholder,
  showFormatting = true,
  maxLength = 5e3,
  // // Event handlers
  // onSend,
  onMessageReply,
  onMessageBookmark,
  onMessagePin,
  onMessageMore,
  onAttachFile,
  onImageUpload,
  onEmojiClick,
  setPinnedMessages,
  // Customization
  className = "",
  showDateSeparators = true,
  autoScroll = true,
  onThreadClick,
  // External configuration
  messageConfig = {},
  inputChatConfig = {},
  ...restProps
}) => {
  var _a, _b;
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t("tableChat.input.typeMessage");
  const messagesRef = useRef(null);
  const isLoadingRef = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(propMessages);
  const [showClearChat, setShowClearChat] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isClearChatLoading, setIsClearChatLoading] = useState(false);
  const [addMembers, setAddMembers] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showAddMembersLoading, setShowAddMembersLoading] = useState(false);
  const [externalSavingMembers, setExternalSavingMembers] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [filteredMemberList, setFilteredMemberList] = useState([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const searchCompletedRef = useRef(false);
  const currentChatIdRef = useRef(null);
  const lastHighlightedMessageIdRef = useRef(null);
  const realTimeMessages = messageConfig.realTimeMessages || [];
  messageConfig.isWebSocketConnected || false;
  const currentTopicId = messageConfig.currentTopicId || null;
  const onRealTimeMessageUpdate = messageConfig.onRealTimeMessageUpdate || null;
  const currentUserId = messageConfig.currentUserId || null;
  const selectedMessageId = messageConfig.selectedMessageId || null;
  const maxSearchPages = messageConfig.maxSearchPages || 3;
  const highlightDuration = messageConfig.highlightDuration || 3e3;
  const scrollBehavior = messageConfig.scrollBehavior || "smooth";
  const scrollBlock = messageConfig.scrollBlock || "center";
  const highlightColor = messageConfig.highlightColor || null;
  const highlightTrigger = messageConfig.highlightTrigger;
  const fetchMoreMessages = useCallback(
    async (page) => {
      if (!messageConfig.loadMessages || !chatId) {
        return [];
      }
      try {
        const result = await messageConfig.loadMessages(chatId, page);
        let newMessages, noMoreData;
        if (Array.isArray(result)) {
          newMessages = result;
          noMoreData = !result || result.length === 0;
        } else {
          newMessages = (result == null ? void 0 : result.messages) || [];
          noMoreData = (result == null ? void 0 : result.noMoreData) || false;
        }
        if (noMoreData) {
          return [];
        }
        if (!newMessages || newMessages.length === 0) {
          return [];
        }
        setMessages((prevMessages) => {
          const existingIds = new Set(prevMessages.map((msg) => msg.id));
          const uniqueNewMessages = newMessages.filter((msg) => !existingIds.has(msg.id));
          return [...uniqueNewMessages, ...prevMessages];
        });
        return newMessages;
      } catch (error) {
        console.error("[TableChatRightSection] Error fetching more messages:", error);
        return [];
      }
    },
    [messageConfig.loadMessages, chatId]
  );
  const [enableInfiniteScroll, setEnableInfiniteScroll] = useState(false);
  const {
    loadMoreRef,
    isLoading: isLoadingMore,
    hasMore,
    error: infiniteScrollError,
    reset: resetInfiniteScroll,
    updateHasMore,
    updateCurrentPage,
    // Update page when manually loading pages
    currentPage
    // Track current page for smart message searching
  } = useInfiniteScroll(fetchMoreMessages, {
    threshold: 0.1,
    rootMargin: "200px 0px 0px 0px",
    // Only trigger when scrolling near the top
    enabled: enableInfiniteScroll && !!chatId
  });
  useEffect(() => {
    if (chatId) {
      const timer = setTimeout(() => {
        setEnableInfiniteScroll(true);
      }, 2e3);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setEnableInfiniteScroll(false);
    }
  }, [chatId]);
  useEffect(() => {
    const trigger = messageConfig.messagesClearedTrigger;
    if (trigger && trigger > 0 && chatId) {
      setMessages([]);
      resetInfiniteScroll();
      updateHasMore(false);
      const reloadFromAPI = async () => {
        try {
          if (messageConfig.loadMessages && chatId) {
            const result = await messageConfig.loadMessages(
              chatId,
              1
              // Start with page 1
            );
            let reloadedMessages;
            if (Array.isArray(result)) {
              reloadedMessages = result;
            } else {
              reloadedMessages = (result == null ? void 0 : result.messages) || [];
            }
            if (reloadedMessages && reloadedMessages.length > 0) {
              setMessages(reloadedMessages);
              updateHasMore(true);
            }
          }
        } catch (error) {
          console.error("[TableChatRightSection] Error reloading messages after clear:", error);
        }
      };
      setTimeout(reloadFromAPI, 1e3);
    }
  }, [
    messageConfig.messagesClearedTrigger,
    chatId,
    messageConfig.loadMessages,
    resetInfiniteScroll,
    updateHasMore
  ]);
  useEffect(() => {
    const loadMessages = async () => {
      if (isLoadingRef.current) {
        return;
      }
      if (chatId && messageConfig.loadMessages) {
        isLoadingRef.current = true;
        if (currentChatIdRef.current !== chatId) {
          searchCompletedRef.current = false;
          lastHighlightedMessageIdRef.current = null;
          currentChatIdRef.current = chatId;
        }
        try {
          setEnableInfiniteScroll(false);
          resetInfiniteScroll();
          const result = await messageConfig.loadMessages(
            chatId,
            1
            // Start with page 1
          );
          let initialMessages;
          if (Array.isArray(result)) {
            initialMessages = result;
          } else {
            initialMessages = (result == null ? void 0 : result.messages) || [];
          }
          setMessages(initialMessages || []);
          if (!initialMessages || initialMessages.length === 0) {
            updateHasMore(false);
          }
        } catch (error) {
          console.error("[TableChatRightSection] Error loading messages:", error);
          setMessages([]);
        } finally {
          isLoadingRef.current = false;
        }
      } else {
        setMessages([]);
      }
    };
    loadMessages();
    return () => {
      isLoadingRef.current = false;
    };
  }, [chatId, resetInfiniteScroll, updateHasMore]);
  useEffect(() => {
    if (!selectedMessageId || !chatId) {
      return;
    }
    if (messages.length === 0) {
      return;
    }
    const isPinnedMessageHighlight = highlightTrigger !== null && highlightTrigger !== void 0;
    if (!isPinnedMessageHighlight && lastHighlightedMessageIdRef.current === selectedMessageId) {
      return;
    }
    const messageExistsImmediately = messages.some((msg) => msg.id === selectedMessageId);
    if (messageExistsImmediately) {
      if (!isPinnedMessageHighlight) {
        lastHighlightedMessageIdRef.current = selectedMessageId;
      }
      setEnableInfiniteScroll(false);
      setTimeout(() => {
        scrollToMessage(selectedMessageId);
        setHighlightedMessageId(selectedMessageId);
        setTimeout(() => {
          setHighlightedMessageId(null);
        }, highlightDuration);
        setTimeout(() => {
          setEnableInfiniteScroll(true);
        }, 2e3);
      }, 100);
      return;
    }
    setEnableInfiniteScroll(false);
    findAndHighlightMessage();
    async function findAndHighlightMessage() {
      if (searchCompletedRef.current) {
        setEnableInfiniteScroll(true);
        return;
      }
      searchCompletedRef.current = true;
      const startPage = currentPage + 1;
      if (currentPage >= maxSearchPages) {
        setEnableInfiniteScroll(true);
        return;
      }
      let messageFoundInSearch = false;
      try {
        for (let page = startPage; page <= maxSearchPages; page++) {
          if (messageFoundInSearch) {
            break;
          }
          if (!messageConfig.loadMessages) break;
          const result = await messageConfig.loadMessages(chatId, page);
          let pageMessages;
          if (Array.isArray(result)) {
            pageMessages = result;
          } else {
            pageMessages = (result == null ? void 0 : result.messages) || [];
          }
          if (!pageMessages || pageMessages.length === 0) {
            break;
          }
          const foundMessage = pageMessages.find((msg) => msg.id === selectedMessageId);
          if (foundMessage) {
            messageFoundInSearch = true;
            if (!isPinnedMessageHighlight) {
              lastHighlightedMessageIdRef.current = selectedMessageId;
            }
            updateCurrentPage(page);
            setMessages((prevMessages) => {
              const existingIds = new Set(prevMessages.map((msg) => msg.id));
              const uniqueNewMessages = pageMessages.filter((msg) => !existingIds.has(msg.id));
              return [...uniqueNewMessages, ...prevMessages];
            });
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  scrollToMessage(selectedMessageId);
                  setHighlightedMessageId(selectedMessageId);
                  setTimeout(() => {
                    setHighlightedMessageId(null);
                  }, highlightDuration);
                  setTimeout(() => {
                    setEnableInfiniteScroll(true);
                  }, 2e3);
                }, 300);
              });
            });
            break;
          }
        }
        if (!messageFoundInSearch) {
          setEnableInfiniteScroll(true);
        }
      } catch (error) {
        console.error("[TableChatRightSection] Error searching for message:", error);
        setEnableInfiniteScroll(true);
      }
    }
  }, [selectedMessageId, chatId, messages.length, highlightTrigger]);
  const scrollToMessage = (messageId) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement && messagesRef.current) {
      messageElement.scrollIntoView({
        behavior: scrollBehavior,
        block: scrollBlock
      });
    }
  };
  useEffect(() => {
    if (autoScroll && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages.length, autoScroll]);
  useEffect(() => {
    if (realTimeMessages.length > 0 && chatId === currentTopicId) {
      setMessages((prevMessages) => {
        const existingMessagesMap = new Map(prevMessages.map((msg) => [msg.id, msg]));
        const updatedMessages = [...prevMessages];
        let hasChanges = false;
        realTimeMessages.forEach((realTimeMsg) => {
          var _a2, _b2, _c, _d;
          const existingMsg = existingMessagesMap.get(realTimeMsg.id);
          if (existingMsg) {
            const msgIndex = updatedMessages.findIndex((msg) => msg.id === realTimeMsg.id);
            if (msgIndex !== -1) {
              updatedMessages[msgIndex] = {
                ...updatedMessages[msgIndex],
                ...realTimeMsg,
                // Preserve some original properties that shouldn't be overwritten
                author: realTimeMsg.author || updatedMessages[msgIndex].author,
                authorName: realTimeMsg.authorName || updatedMessages[msgIndex].authorName,
                senderId: realTimeMsg.senderId || updatedMessages[msgIndex].senderId,
                // Preserve deleted state
                deleted: realTimeMsg.deleted !== void 0 ? realTimeMsg.deleted : updatedMessages[msgIndex].deleted,
                otherProps: {
                  ...updatedMessages[msgIndex].otherProps,
                  ...realTimeMsg.otherProps,
                  sender_id: ((_a2 = realTimeMsg.otherProps) == null ? void 0 : _a2.sender_id) || ((_b2 = updatedMessages[msgIndex].otherProps) == null ? void 0 : _b2.sender_id),
                  // Preserve deleted state in otherProps as well
                  deleted: ((_c = realTimeMsg.otherProps) == null ? void 0 : _c.deleted) !== void 0 ? realTimeMsg.otherProps.deleted : (_d = updatedMessages[msgIndex].otherProps) == null ? void 0 : _d.deleted
                }
              };
              hasChanges = true;
            }
          } else {
            updatedMessages.push(realTimeMsg);
            hasChanges = true;
          }
        });
        if (hasChanges) {
          const sortedMessages = updatedMessages.sort((a, b) => {
            var _a2, _b2;
            const timeA = new Date(
              a.timestamp || a.date || a.created_at || ((_a2 = a.otherProps) == null ? void 0 : _a2.created_at)
            );
            const timeB = new Date(
              b.timestamp || b.date || b.created_at || ((_b2 = b.otherProps) == null ? void 0 : _b2.created_at)
            );
            return timeA - timeB;
          });
          if (autoScroll) {
            setTimeout(() => {
              if (messagesRef.current) {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
              }
            }, 100);
          }
          return sortedMessages;
        }
        return prevMessages;
      });
    }
  }, [realTimeMessages, chatId, currentTopicId, autoScroll]);
  const handleSend = async (payload) => {
    if (isEditMode && editingMessage) {
      await handleUpdateMessage(payload);
    } else if (inputChatConfig.onSend) {
      try {
        const response = await inputChatConfig.onSend(payload, chatId);
        if (onRealTimeMessageUpdate && response) {
          onRealTimeMessageUpdate(response);
        }
        setInputValue("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      setInputValue("");
    }
  };
  const handleUpdateMessage = async (updatedContent) => {
    var _a2;
    if (messageConfig.onMessageUpdate && editingMessage) {
      try {
        const response = await messageConfig.onMessageUpdate(editingMessage.id, updatedContent);
        exitEditMode();
        const isRealTimeMessage = editingMessage.isRealTime || ((_a2 = editingMessage.otherProps) == null ? void 0 : _a2.isRealTime);
        if (isRealTimeMessage) {
          if (onRealTimeMessageUpdate && response) {
            onRealTimeMessageUpdate(response);
          }
        } else {
          if (response) {
            setMessages((prevMessages) => {
              return prevMessages.map((msg) => {
                if (msg.id === editingMessage.id) {
                  return response;
                }
                return msg;
              });
            });
          }
        }
      } catch (error) {
        console.error("Error updating message:", error);
      }
    }
  };
  const handleEditMessage = (message) => {
    setIsEditMode(true);
    setEditingMessage(message);
    setInputValue(message.content || "");
  };
  const exitEditMode = () => {
    setIsEditMode(false);
    setEditingMessage(null);
    setInputValue("");
  };
  const handleReply = async (messageId) => {
    if (inputChatConfig.onMessageReply) {
      await inputChatConfig.onMessageReply(messageId, chatId);
    }
  };
  const handleBookmark = async (messageId) => {
    if (inputChatConfig.onMessageBookmark) {
      await inputChatConfig.onMessageBookmark(messageId, chatId);
    }
  };
  const handlePin = async (messageId, pinned, chatId2, item) => {
    var _a2;
    try {
      const response = await ((_a2 = messageConfig.onMessagePin) == null ? void 0 : _a2.call(messageConfig, messageId, pinned, chatId2, item));
      return response;
    } catch (error) {
      console.error("Error pinning message:", error);
    }
  };
  const handleMore = async (messageId) => {
    if (inputChatConfig.onMessageMore) {
      await inputChatConfig.onMessageMore(messageId, chatId);
    }
  };
  const markMessageAsDeleted = (messageId) => {
    setMessages((prevMessages) => {
      return prevMessages.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            deleted: true,
            // Keep original content for display purposes
            content: msg.content,
            // Preserve all important fields for proper rendering
            timestamp: msg.timestamp,
            date: msg.date,
            created_at: msg.created_at,
            author: msg.author,
            authorName: msg.authorName,
            senderId: msg.senderId,
            otherProps: {
              ...msg.otherProps,
              deleted: true
            }
          };
        }
        return msg;
      });
    });
  };
  const handleSearchMessage = useCallback(
    async (searchValue, chatId2) => {
      if (!searchValue || searchValue.trim() === "") {
        setSearchResults([]);
        setIsSearchActive(false);
        setSearchQuery("");
        setIsSearchLoading(false);
        return;
      }
      try {
        setIsSearchActive(true);
        setSearchQuery(searchValue);
        setIsSearchLoading(true);
        if (messageConfig.onSearchMessage) {
          const results = await messageConfig.onSearchMessage(searchValue, chatId2);
          setSearchResults(results || []);
        }
      } catch (error) {
        console.error("[TableChatRightSection] Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    },
    [messageConfig.onSearchMessage]
  );
  const handleSearchClear = useCallback(() => {
    setSearchResults([]);
    setIsSearchActive(false);
    setSearchQuery("");
    setIsSearchLoading(false);
  }, []);
  const groupMessagesByDate = (messages2) => {
    const grouped = [];
    let currentDate = null;
    messages2.forEach((msg) => {
      const raw = msg.date || msg.timestamp;
      const parsed = new Date(raw);
      if (isNaN(parsed)) return;
      const rawDate = parsed.toISOString().split("T")[0];
      if (rawDate !== currentDate) {
        currentDate = rawDate;
        grouped.push({
          type: "date-separator",
          id: `date-${rawDate}-${msg.id}`,
          date: parsed,
          // 👈 pass Date object
          pinned: msg.pinned
        });
      }
      grouped.push(msg);
    });
    return grouped;
  };
  const handleAllMessagesDelete = useCallback(async () => {
    try {
      if (messageConfig.onClearAllMessages && chatId) {
        setIsClearChatLoading(true);
        const response = await messageConfig.onClearAllMessages(chatId);
        setIsClearChatLoading(false);
        setMessages([]);
        setShowClearChat(false);
      }
    } catch (error) {
      console.error("Error clearing all messages:", error);
      setShowClearChat(false);
    }
  }, [
    messageConfig.onClearAllMessages,
    messageConfig.loadMessages,
    resetInfiniteScroll,
    updateHasMore
  ]);
  const handleMessageDelete = useCallback(
    async (messageId) => {
      var _a2, _b2;
      try {
        const response = await ((_a2 = messageConfig.onMessageDelete) == null ? void 0 : _a2.call(messageConfig, messageId));
        if (response == null ? void 0 : response.isPinned) {
          setPinnedMessages(
            (prevPinnedMessages) => prevPinnedMessages.map((msg) => msg.id === messageId ? { ...response } : msg)
          );
        }
        const messageToDelete = messages.find((msg) => msg.id === messageId);
        const isRealTimeMessage = (messageToDelete == null ? void 0 : messageToDelete.isRealTime) || ((_b2 = messageToDelete == null ? void 0 : messageToDelete.otherProps) == null ? void 0 : _b2.isRealTime);
        if (isRealTimeMessage) {
          if (onRealTimeMessageUpdate && response) {
            const deletedMessage = response;
            onRealTimeMessageUpdate(deletedMessage);
          }
        } else {
          markMessageAsDeleted(messageId);
        }
        return response;
      } catch (error) {
        console.error("[TableChatRightSection] Error deleting message:", error);
        throw error;
      }
    },
    [messages, messageConfig.onMessageDelete, onRealTimeMessageUpdate]
  );
  const loadMemberList = async () => {
    var _a2, _b2;
    const options = await ((_b2 = (_a2 = restProps.chatHeaderConfig) == null ? void 0 : _a2.loadParticipants) == null ? void 0 : _b2.call(_a2, "new", chatId));
    if (options) {
      setMemberList(options);
      setFilteredMemberList(options);
    }
  };
  const handleMemberSearch = useCallback(
    (searchValue) => {
      setMemberSearchQuery(searchValue);
      if (!searchValue || searchValue.trim() === "") {
        setFilteredMemberList(memberList);
      } else {
        const filtered = memberList.filter(
          (member) => {
            var _a2;
            return (_a2 = member.label) == null ? void 0 : _a2.toLowerCase().includes(searchValue.toLowerCase());
          }
        );
        setFilteredMemberList(filtered);
      }
    },
    [memberList]
  );
  useEffect(() => {
    if (memberSearchQuery.trim() === "") {
      setFilteredMemberList(memberList);
    } else {
      handleMemberSearch(memberSearchQuery);
    }
  }, [memberList, memberSearchQuery, handleMemberSearch]);
  useEffect(() => {
    if (showAddMembers) {
      loadMemberList();
    } else {
      setMemberSearchQuery("");
      setFilteredMemberList([]);
    }
  }, [showAddMembers, chatId]);
  const addInChat = (value) => {
    setAddMembers((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  const messagesToDisplay = isSearchActive ? searchResults : messages;
  const groupedItems = groupMessagesByDate(messagesToDisplay);
  const saveMembersInChat = async () => {
    var _a2, _b2, _c;
    if ((_a2 = restProps.chatHeaderConfig) == null ? void 0 : _a2.onParticipantAdd) {
      try {
        setShowAddMembersLoading(true);
        const response = await ((_c = (_b2 = restProps.chatHeaderConfig) == null ? void 0 : _b2.onParticipantAdd) == null ? void 0 : _c.call(
          _b2,
          addMembers,
          "new",
          chatId
        ));
        if (response === null) {
          setShowAddMembersLoading(false);
          setExternalSavingMembers(true);
          setShowAddMembers(false);
          setAddMembers([]);
          setMemberSearchQuery("");
          setFilteredMemberList([]);
        }
      } catch (error) {
        console.error("Error saving members in chat:", error);
      } finally {
        setShowAddMembersLoading(false);
        setExternalSavingMembers(false);
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `table-chat-right-section-container ${className}`, children: [
    chatId ? /* @__PURE__ */ jsx(
      ChatHeader,
      {
        chatHeaderConfig: {
          ...restProps.chatHeaderConfig,
          onSearchMessage: handleSearchMessage,
          onSearchClear: handleSearchClear,
          externalSavingMembers
        },
        chatId,
        createdAt,
        createdBy: CreatedBy,
        title
      }
    ) : null,
    messages.length > 0 && /* @__PURE__ */ jsx("div", { className: "clear-chat-button-container", children: /* @__PURE__ */ jsx(
      Button,
      {
        className: "clear-chat-button",
        size: "small",
        variant: "text",
        onClick: (event) => {
          event.stopPropagation();
          setShowClearChat(true);
        },
        children: t("tableChat.right.clearChat")
      }
    ) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: messagesRef,
        className: `table-chat-messages ${groupedItems.length === 0 && !hasMore ? "empty-state-container" : ""}`,
        children: [
          hasMore && /* @__PURE__ */ jsx("div", { ref: loadMoreRef, className: "infinite-scroll-trigger", children: isLoadingMore ? /* @__PURE__ */ jsx("div", { className: "infinite-scroll-loading", children: /* @__PURE__ */ jsx(Loader, { size: "medium" }) }) : /* @__PURE__ */ jsx("div", { className: "infinite-scroll-placeholder" }) }),
          isSearchLoading ? /* @__PURE__ */ jsx("div", { className: "table-chat-loading-state", children: /* @__PURE__ */ jsx(ChatMessageListSkeleton, { messageCount: 4 }) }) : groupedItems.length === 0 && !hasMore ? /* @__PURE__ */ jsx("div", { className: "table-chat-empty-state", children: isSearchActive ? /* @__PURE__ */ jsx(
            EmptyContainer,
            {
              subTitle: t("tableChat.right.tryDifferentKeyword"),
              title: t("tableChat.right.noMessagesFound", {
                query: searchQuery
              })
            }
          ) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              EmptyContainer,
              {
                subTitle: t("tableChat.right.noConversationSubtitle"),
                title: t("tableChat.right.noConversationTitle")
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                disabled: showAddMembersLoading,
                size: "large",
                type: "default",
                variant: "secondary",
                onClick: () => setShowAddMembers(true),
                className: "add_member_btn",
                iconPlacement: "right",
                children: showAddMembersLoading ? t("tableChat.right.adding") : t("tableChat.right.addMembers")
              }
            )
          ] }) }) : groupedItems.map((item) => {
            var _a2, _b2, _c;
            if (item.type === "date-separator") {
              return /* @__PURE__ */ jsx(DateSeparator, { date: item.date, format: "relative" }, item.id);
            }
            return /* @__PURE__ */ jsx("div", { className: "message-wrapper", "data-message-id": item.id, children: /* @__PURE__ */ jsx(
              ChatMessage,
              {
                author: item.author,
                authorAvatar: item.authorAvatar,
                authorName: item.authorName,
                content: item.content,
                deleted: item.deleted || ((_a2 = item.otherProps) == null ? void 0 : _a2.deleted) || false,
                edited: item.edited || false,
                isHighlighted: highlightedMessageId === item.id,
                isPinChatIconvisible: messageConfig == null ? void 0 : messageConfig.isPinChatIconVisible,
                isThreadIconVisible: messageConfig == null ? void 0 : messageConfig.isThreadIconVisible,
                messageId: item.id,
                pinned: item.isPinned,
                priority: item.priority,
                showActions: messageConfig.showActions ?? item.showActions !== false,
                timestamp: item.timestamp,
                type: item.type,
                onBookmark: () => {
                  handleBookmark(item.id);
                  onMessageBookmark == null ? void 0 : onMessageBookmark(item.id, chatId);
                },
                onEdit: () => handleEditMessage(item),
                onMessageDelete: handleMessageDelete,
                onMore: () => {
                  handleMore(item.id);
                  onMessageMore == null ? void 0 : onMessageMore(item.id, chatId);
                },
                onPin: async (pinned) => {
                  return await handlePin(item.id, pinned, chatId, item);
                },
                onRefetchMessages: async () => {
                  return messages;
                },
                onReply: () => {
                  handleReply(item.id);
                  onMessageReply == null ? void 0 : onMessageReply(item.id, chatId);
                },
                onThreadClick: () => {
                  var _a3;
                  onThreadClick == null ? void 0 : onThreadClick(item.id, chatId);
                  (_a3 = messageConfig == null ? void 0 : messageConfig.onThreadClick) == null ? void 0 : _a3.call(messageConfig, item.id, chatId);
                },
                highlightColor,
                isUser: currentUserId ? item.senderId === currentUserId || ((_b2 = item.otherProps) == null ? void 0 : _b2.sender_id) === currentUserId || item.senderId === String(currentUserId) || ((_c = item.otherProps) == null ? void 0 : _c.sender_id) === String(currentUserId) || item.author === "user" : item.author === "user"
              }
            ) }, item.id);
          }),
          /* @__PURE__ */ jsx(
            Modal,
            {
              className: "test-modal add_members_modal",
              loading: showAddMembersLoading,
              open: showAddMembers,
              primaryButtonLabel: showAddMembersLoading ? t("tableChat.right.adding") : t("tableChat.right.add"),
              primaryButtonProps: {
                disabled: !addMembers.length > 0 || showAddMembersLoading
              },
              secondaryButtonLabel: t("common.cancel"),
              size: "small",
              title: t("tableChat.right.addMembers"),
              onClose: () => {
                setShowAddMembers(false);
              },
              onPrimaryButtonClick: saveMembersInChat,
              onSecondaryButtonClick: () => {
                setShowAddMembers(false);
              },
              children: /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "modal-header-search-input-container", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: "modal-header-search-input",
                    leftIcon: /* @__PURE__ */ jsx("img", { alt: "search", className: "menu-header-search-icon", src: SearchIcon }),
                    placeholder: t("tableChat.right.searchMembers"),
                    value: memberSearchQuery,
                    onChange: (e) => {
                      handleMemberSearch(e.target.value);
                    }
                  }
                ) }),
                memberList.length > 0 ? filteredMemberList.length > 0 ? /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0 }, children: filteredMemberList.map((user, index) => /* @__PURE__ */ jsxs(
                  "li",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px"
                      //
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          defaultChecked: true,
                          checked: addMembers.includes(user.value),
                          variant: "default",
                          onChange: () => {
                            addInChat(user.value);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Avatar,
                        {
                          label: user.label,
                          size: "small",
                          src: "static/media/avatar_sample.b13b667a.jpeg",
                          type: "withoutPicture"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: user.label })
                    ]
                  },
                  user.id || index
                )) }) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      textAlign: "center",
                      padding: "20px",
                      color: "#666",
                      fontSize: "14px"
                    },
                    children: t("tableChat.right.noMembersFound", {
                      query: memberSearchQuery
                    })
                  }
                ) : t("common.loading")
              ] }, ".0")
            }
          ),
          infiniteScrollError && /* @__PURE__ */ jsxs("div", { className: "infinite-scroll-error", children: [
            /* @__PURE__ */ jsx("p", { children: t("tableChat.right.loadOlderFailed") }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "small",
                variant: "text",
                onClick: () => {
                  window.location.reload();
                },
                children: t("tableChat.right.retry")
              }
            )
          ] })
        ]
      }
    ),
    chatId ? /* @__PURE__ */ jsx(
      ChatInput,
      {
        chatId,
        editingMessage,
        isEditMode,
        maxLength,
        messageConfig,
        placeholder: resolvedPlaceholder,
        quickActionLabel: (_a = inputChatConfig.inputConfig) == null ? void 0 : _a.quickActionLabel,
        showFormatting,
        showQuickAction: (_b = inputChatConfig.inputConfig) == null ? void 0 : _b.showQuickAction,
        value: inputValue,
        onAttach: onAttachFile,
        onCancelEdit: exitEditMode,
        onChange: setInputValue,
        onEmojiClick,
        onImageUpload,
        onSend: handleSend
      }
    ) : null,
    /* @__PURE__ */ jsx(
      Prompt,
      {
        handleClose: () => {
          setShowClearChat(false);
        },
        isOpen: showClearChat,
        primaryButtonLabel: isClearChatLoading ? t("tableChat.right.clearing") : t("common.clear"),
        secondaryButtonLabel: t("common.cancel"),
        title: t("tableChat.right.clearConfirmTitle"),
        variant: "error",
        onPrimaryButtonClick: handleAllMessagesDelete,
        onSecondaryButtonClick: () => {
          setShowClearChat(false);
        },
        children: t("tableChat.right.clearConfirmMessage")
      }
    )
  ] });
};
export {
  TableChatRightSection as default
};
