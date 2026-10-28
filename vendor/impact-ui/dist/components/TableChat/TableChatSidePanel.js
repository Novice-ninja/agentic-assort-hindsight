!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}#table-chat-side-panel .impact_drawer_container{background:#fff}#table-chat-side-panel .impact_drawer_header{background:#eceefd;border-bottom:1px solid #d9dde7}#table-chat-side-panel .impact_drawer_body{padding:0}.table-chat-container{box-sizing:border-box;display:flex;flex-direction:row;gap:10px;height:100%;overflow:hidden;width:100%}.table-chat-container .table-left-panel-container{flex:0 0 350px;flex-shrink:0;max-width:350px;width:350px}.table-chat-container .table-chat-right-section-container{flex:1 1 0;max-width:100%;min-width:0;width:auto}.empty-container{align-items:center;display:flex;justify-content:center}.empty-container img{height:197px;width:190px}.empty-container p:first-of-type{color:#1f2b4d;font-size:20px;font-style:normal;font-weight:800;line-height:30px}.empty-container p:nth-of-type(2){color:#7a8294;font-size:16px;font-style:normal;font-weight:500;line-height:125%;text-align:center}.loader-padding{padding:16px;width:100%}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Panel } from "../Panel/index.js";
import { Prompt } from "../Prompt/index.js";
import { Toast } from "../Toast/index.js";
import ChatMessageListSkeleton from "./components/ChatMessageSkeleton/ChatMessageListSkeleton.js";
import ChatSkeleton from "./components/ChatMessageSkeleton/ChatSkeleton.js";
import TableChatChannelHeader from "./components/TableChatLeftSection/TableChatChannelHeader.js";
import { PinnedPanel } from "./components/TableChatRightSection/PinedChatPanel/PinedChatPanel.js";
import TableChatRightSection from "./components/TableChatRightSection/TableChatRightSection.js";
import { EmptyContainer } from "./EmptyContainer.js";
import { formatChatHeaderTimestamp } from "./utils/formatChatTimestamp.js";

import { useTranslation } from "../../i18n/useTranslation.js";
const TableChatSidePanel = ({ isOpen, handleClose, chatConfiguration }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L;
  const { t } = useTranslation();
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [selectedChannelInfo, setSelectedChannelInfo] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChatInfo, setSelectedChatInfo] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [pinnedMsg, setShowPinnedMsg] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const [channelsList, setChannelsList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [loadingChannelsOrChats, setLoadingChannelsOrChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [originalChatList, setOriginalChatList] = useState([]);
  const [originalChannelList, setOriginalChanelList] = useState([]);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [loadingPinned, setLoadingPinned] = useState(false);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("info");
  const [selectedChat, setSelectedChat] = useState([]);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateNewChatOpen, setIsCreateNewChatOpen] = useState(false);
  const [currentSelectedScreen, setCurrentSelectedScreen] = useState("channels");
  const [highlightMessageId, setHighlightMessageId] = useState(null);
  const [highlightTrigger, setHighlightTrigger] = useState(0);
  const isChannelsScreen = currentSelectedScreen === "channels";
  const selectedChannelOrChatId = isChannelsScreen ? selectedChannelId : selectedChatId;
  const realTimeMessages = ((_a = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _a.realTimeMessages) || [];
  const isWebSocketConnected = ((_b = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _b.isWebSocketConnected) || false;
  const currentTopicId = ((_c = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _c.currentTopicId) || null;
  const onRealTimeMessageUpdate = ((_d = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _d.onRealTimeMessageUpdate) || null;
  const currentUserId = ((_e = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _e.currentUserId) || null;
  const handleThreadClick = useCallback(
    async (messageId) => {
      var _a2;
      setLoadingThread(true);
      setShowThread(true);
      try {
        const data = await ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _a2.loadThreadMessages(messageId));
        setThreadMessages(data);
      } catch (err) {
        console.error("Error loading thread messages:", err);
      } finally {
        setLoadingThread(false);
      }
    },
    [(_f = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _f.loadThreadMessages]
  );
  const handlePinMessage = useCallback(
    async (messageId, isPinned, chatId, item) => {
      var _a2;
      try {
        const response = await ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _a2.onMessagePin(
          messageId,
          isPinned,
          chatId,
          item
        ));
        if (pinnedMessages.some((message) => message.id === messageId)) {
          const filteredPinnedMessages = pinnedMessages.filter(
            (message) => message.id !== messageId
          );
          setPinnedMessages((prev) => [...filteredPinnedMessages]);
        } else {
          setPinnedMessages((prev) => [...prev, { ...response }]);
        }
        return response;
      } catch (err) {
        console.error("Error while pinning:", err);
      } finally {
      }
    },
    [(_g = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _g.onMessagePin, pinnedMessages]
  );
  const memoizedMessageConfig = useMemo(
    () => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2;
      return {
        ...(chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) || {},
        // Real-time message props
        realTimeMessages,
        isWebSocketConnected,
        currentTopicId,
        onRealTimeMessageUpdate,
        currentUserId,
        // Message loading
        loadMessages: (_a2 = chatConfiguration == null ? void 0 : chatConfiguration.rightPanel) == null ? void 0 : _a2.loadMessages,
        // Message cleared trigger
        messagesClearedTrigger: (_b2 = chatConfiguration == null ? void 0 : chatConfiguration.rightPanel) == null ? void 0 : _b2.messagesClearedTrigger,
        // Selected message ID for highlighting and scrolling
        // Prioritize dynamic highlightMessageId from pinned click over config
        selectedMessageId: highlightMessageId || ((_c2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _c2.selectedMessageId),
        // Trigger for pinned message re-highlighting (increment to force re-highlight)
        highlightTrigger: highlightMessageId ? highlightTrigger : null,
        // Only pass trigger for pinned messages
        // Highlight configuration options
        maxSearchPages: (_d2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _d2.maxSearchPages,
        highlightDuration: (_e2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _e2.highlightDuration,
        scrollBehavior: (_f2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _f2.scrollBehavior,
        scrollBlock: (_g2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _g2.scrollBlock,
        highlightColor: (_h2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _h2.highlightColor,
        // Message action handlers
        onMessagePin: handlePinMessage,
        onClearAllMessages: (_i2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _i2.onClearAllMessages,
        onThreadClick: (messageId, messageItem) => {
          var _a3, _b3;
          setShowPinnedMsg(false);
          setShowThread(true);
          handleThreadClick(messageId);
          (_b3 = (_a3 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _a3.onThreadClick) == null ? void 0 : _b3.call(_a3, messageId, messageItem);
        },
        // Load participants for mentions
        loadParticipantsAvatar: (_j2 = chatConfiguration == null ? void 0 : chatConfiguration.headerChatConfig) == null ? void 0 : _j2.loadParticipantsAvatar
      };
    },
    [
      chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig,
      realTimeMessages,
      isWebSocketConnected,
      currentTopicId,
      onRealTimeMessageUpdate,
      currentUserId,
      (_h = chatConfiguration == null ? void 0 : chatConfiguration.rightPanel) == null ? void 0 : _h.loadMessages,
      (_i = chatConfiguration == null ? void 0 : chatConfiguration.rightPanel) == null ? void 0 : _i.messagesClearedTrigger,
      highlightMessageId,
      // Dynamic highlight from pinned message click
      highlightTrigger,
      // Trigger to force re-highlight
      (_j = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _j.selectedMessageId,
      (_k = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _k.maxSearchPages,
      (_l = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _l.highlightDuration,
      (_m = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _m.scrollBehavior,
      (_n = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _n.scrollBlock,
      (_o = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _o.highlightColor,
      handlePinMessage,
      handleThreadClick,
      (_p = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _p.onThreadClick,
      (_q = chatConfiguration == null ? void 0 : chatConfiguration.headerChatConfig) == null ? void 0 : _q.loadParticipantsAvatar
    ]
  );
  const handleToast = (isOpen2, message = "", variant = "info") => {
    if (isOpen2) {
      setOpenToast(isOpen2);
      setToastMessage(message);
      setToastVariant(variant);
    } else {
      setOpenToast(false);
      setToastMessage("");
      setToastVariant("info");
    }
  };
  const handleChatClick = async (chatId, selectedChatData) => {
    var _a2;
    setCurrentSelectedScreen("chats");
    setLoadingMessages(true);
    setSelectedChatId(chatId);
    setSelectedChatInfo(selectedChatData);
    setHighlightMessageId(null);
    try {
      if ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.headerChatConfig) == null ? void 0 : _a2.onChatClick) {
        await chatConfiguration.headerChatConfig.onChatClick(chatId, selectedChannelId);
      }
    } catch (err) {
      console.error("[TableChatSidePanel] [handleChatClick] [error]:", err);
      handleToast(true, t("tableChat.sidePanel.errorLoadingChat"), "error");
    } finally {
      setLoadingMessages(false);
    }
  };
  const fetchChatList = async (currentActiveChannelInfo) => {
    var _a2;
    setCurrentSelectedScreen("chats");
    setSelectedChat([]);
    if ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _a2.loadChatList) {
      setLoadingChannelsOrChats(true);
      try {
        const chatList2 = await chatConfiguration.leftPanel.loadChatList(currentActiveChannelInfo);
        setChatList(chatList2);
        setOriginalChatList(chatList2);
        return chatList2;
      } catch (err) {
        console.error("[TableChatSidePanel] [fetchChatList] [error]:", err);
        handleToast(true, t("tableChat.sidePanel.errorLoadingChats"), "error");
      } finally {
        setLoadingChannelsOrChats(false);
      }
    }
  };
  const handleChatName = async (formData, selectedChannelId2) => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
    try {
      const response = await ((_b2 = (_a2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _a2.handleChatName) == null ? void 0 : _b2.call(
        _a2,
        formData,
        selectedChannelId2
      ));
      if (response == null ? void 0 : response.success) {
        setIsCreateNewChatOpen(false);
        if (response == null ? void 0 : response.formattedChat) {
          const newChat = response.formattedChat;
          const newChannelInfo = {
            id: (_d2 = (_c2 = newChat == null ? void 0 : newChat.otherProps) == null ? void 0 : _c2.object_ids) == null ? void 0 : _d2[0],
            title: t("tableChat.sidePanel.chatList"),
            objectType: (_e2 = newChat == null ? void 0 : newChat.otherProps) == null ? void 0 : _e2.object_type
          };
          await fetchChatList(newChannelInfo);
          setSelectedChannelInfo(newChannelInfo);
          setSelectedChannelId((_g2 = (_f2 = newChat == null ? void 0 : newChat.otherProps) == null ? void 0 : _f2.object_ids) == null ? void 0 : _g2[0]);
          await handleChatClick(newChat.id, newChat);
        } else if (selectedChannelId2) {
          await fetchChatList(selectedChannelId2);
        }
      }
      return response;
    } catch (error) {
      console.error("[TableChatSidePanel] [handleChatName] [error]:", error);
      throw error;
    }
  };
  const fetchChannelList = async () => {
    setCurrentSelectedScreen("channels");
    setLoadingChannelsOrChats(true);
    try {
      const channelList = await chatConfiguration.leftPanel.loadChannelsList();
      setChannelsList(channelList);
      setOriginalChanelList(channelList);
    } catch (error) {
      console.error("[TableChatSidePanel] [fetchChannelList] [error]:", error);
      handleToast(true, t("tableChat.sidePanel.errorLoadingChannels"), "error");
    } finally {
      setLoadingChannelsOrChats(false);
    }
  };
  const fetchChannelsOrChats = async () => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2;
    setLoadingChannelsOrChats(true);
    try {
      if (((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _a2.hasDirectChatList) && ((_c2 = (_b2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _b2.directChatList) == null ? void 0 : _c2.length) > 0) {
        setCurrentSelectedScreen("chats");
        const directChatList = chatConfiguration.leftPanel.directChatList;
        setChatList(directChatList);
        setOriginalChatList(directChatList);
        const channelInfo = {
          id: (_f2 = (_e2 = (_d2 = directChatList == null ? void 0 : directChatList[0]) == null ? void 0 : _d2.otherProps) == null ? void 0 : _e2.object_ids) == null ? void 0 : _f2[0],
          title: t("tableChat.sidePanel.chatList"),
          objectType: (_h2 = (_g2 = directChatList == null ? void 0 : directChatList[0]) == null ? void 0 : _g2.otherProps) == null ? void 0 : _h2.object_type
          // or get from configuration
        };
        setSelectedChannelId((_k2 = (_j2 = (_i2 = directChatList == null ? void 0 : directChatList[0]) == null ? void 0 : _i2.otherProps) == null ? void 0 : _j2.object_ids) == null ? void 0 : _k2[0]);
        setSelectedChannelInfo(channelInfo);
        if (directChatList.length > 0) {
          const selectedChatId2 = (_l2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _l2.selectedChatId;
          let chatToSelect;
          if (selectedChatId2) {
            chatToSelect = directChatList.find((chat) => chat.id === selectedChatId2);
            if (!chatToSelect) {
              chatToSelect = directChatList == null ? void 0 : directChatList[0];
            }
          } else {
            chatToSelect = directChatList == null ? void 0 : directChatList[0];
          }
          await handleChatClick(chatToSelect == null ? void 0 : chatToSelect.id, chatToSelect);
        }
      } else if (((_m2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _m2.hasDirectChatList) && ((_o2 = (_n2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _n2.directChatList) == null ? void 0 : _o2.length) === 0) {
        setCurrentSelectedScreen("chats");
        setIsCreateNewChatOpen(true);
      } else {
        await fetchChannelList();
      }
    } catch (error) {
      console.error("[TableChatSidePanel] [fetchChannels] [error]:", error);
      handleToast(true, t("tableChat.sidePanel.errorLoadingChannelsList"), "error");
    } finally {
      setLoadingChannelsOrChats(false);
    }
  };
  const clearnupLocalStates = () => {
    setSelectedChannelId(null);
    setSelectedChannelInfo(null);
    setSelectedChatInfo(null);
    setSelectedChatId(null);
    setChatList([]);
    setOriginalChatList([]);
    setSelectedChat([]);
    setShowPinnedMsg(false);
    setShowThread(false);
    setPinnedMessages([]);
    setThreadMessages([]);
    setIsSearchOpen(false);
    setIsMoreOpen(false);
    setHighlightMessageId(null);
    setIsCreateNewChatOpen(false);
  };
  const handleBackToChannels = async () => {
    var _a2;
    if ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _a2.clearDirectChatList) {
      chatConfiguration.leftPanel.clearDirectChatList();
    }
    clearnupLocalStates();
    await fetchChannelList();
  };
  useEffect(() => {
    if (isOpen) {
      fetchChannelsOrChats();
    }
  }, [isOpen]);
  useEffect(() => {
    var _a2;
    if (!isOpen) {
      clearnupLocalStates();
      if ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _a2.clearDirectChatList) {
        chatConfiguration.leftPanel.clearDirectChatList();
      }
    }
  }, [isOpen]);
  useEffect(() => {
    var _a2;
    if (highlightMessageId) {
      const highlightDuration = ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _a2.highlightDuration) || 3e3;
      const timeoutId = setTimeout(() => {
        setHighlightMessageId(null);
      }, highlightDuration);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [highlightMessageId, (_r = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _r.highlightDuration]);
  const toggleMenu = () => {
    setIsMoreOpen(!isMoreOpen);
  };
  const openSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  const showMore = () => {
    setIsMoreOpen(true);
  };
  const handlePinnedClick = async (chatId) => {
    var _a2;
    setLoadingPinned(true);
    try {
      const data = await ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.headerChatConfig) == null ? void 0 : _a2.onPinnedClick(chatId));
      setPinnedMessages(data);
    } catch (err) {
      console.error("[TableChatSidePanel] [handlePinnedClick] [error]:", err);
    } finally {
      setLoadingPinned(false);
    }
  };
  const handlePinnedMessageClick = (messageId) => {
    setHighlightMessageId(messageId);
    setHighlightTrigger((prev) => prev + 1);
  };
  const handleChannelClick = async (selectedChannelId2, selectedChannelInfo2) => {
    setSelectedChannelId(selectedChannelId2);
    setSelectedChannelInfo(selectedChannelInfo2);
    const chatList2 = await fetchChatList(selectedChannelInfo2);
    if (chatList2 && chatList2.length > 0) {
      const firstChat = chatList2 == null ? void 0 : chatList2[0];
      await handleChatClick(firstChat == null ? void 0 : firstChat.id, firstChat);
    }
  };
  const handleChatSelect = (selectedChatId2) => {
    setSelectedChat(
      (prev) => prev.includes(selectedChatId2) ? prev.filter((id) => id !== selectedChatId2) : [...prev, selectedChatId2]
      // add
    );
  };
  const filterChannelsByTitle = useCallback(
    (searchText) => {
      const targetList = isChannelsScreen ? originalChannelList : originalChatList;
      if (!searchText) {
        if (isChannelsScreen) {
          setChannelsList(originalChannelList);
        } else {
          setChatList(originalChatList);
        }
        return;
      }
      const filtered = targetList.filter((ch) => ch.title.toLowerCase().includes(searchText.toLowerCase())) || [];
      if (isChannelsScreen) {
        setChannelsList([...filtered]);
      } else {
        setChatList([...filtered]);
      }
    },
    [isChannelsScreen, originalChannelList, originalChatList]
  );
  const handleDeletePromptOpen = () => {
    if (!selectedChat || selectedChat.length === 0) {
      handleToast(true, t("tableChat.sidePanel.noChatsSelected"), "error");
      return;
    }
    setShowDeletePrompt(true);
  };
  const handleDeleteChat = async () => {
    var _a2, _b2, _c2;
    if (!selectedChat || selectedChat.length === 0) {
      handleToast(true, t("tableChat.sidePanel.noChatsSelected"), "error");
      return;
    }
    try {
      setIsDeleting(true);
      const isActiveTopicDeleted = selectedChat.includes(selectedChatId);
      const deletePromises = selectedChat.map(
        (topicId) => {
          var _a3, _b3;
          return (_b3 = (_a3 = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _a3.deleteChat) == null ? void 0 : _b3.call(_a3, topicId);
        }
      );
      await Promise.all(deletePromises);
      setShowDeletePrompt(false);
      setIsDeleting(false);
      setSelectedChat([]);
      if ((_a2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _a2.markTopicAsDeleted) {
        selectedChat.forEach((topicId) => {
          var _a3;
          (_a3 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _a3.markTopicAsDeleted(topicId);
        });
      }
      if (isActiveTopicDeleted) {
        if ((_b2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _b2.leaveCurrentTopic) {
          (_c2 = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _c2.leaveCurrentTopic();
        }
        setPinnedMessages([]);
        setThreadMessages([]);
        setSelectedChatInfo(null);
        setSelectedChatId(null);
      }
      if (selectedChannelInfo) {
        const updatedChatList = await fetchChatList(selectedChannelInfo);
        if (isActiveTopicDeleted && updatedChatList && updatedChatList.length > 0) {
          const firstChat = updatedChatList == null ? void 0 : updatedChatList[0];
          await handleChatClick(firstChat.id, firstChat);
        }
      }
    } catch (error) {
      console.error("[TableChatSidePanel] [handleDeleteChat] [error]:", error);
      handleToast(true, t("tableChat.sidePanel.errorDeletingTopics"), "error");
    } finally {
      setIsDeleting(false);
      setLoadingChannelsOrChats(false);
    }
  };
  return /* @__PURE__ */ jsxs("aside", { id: "table-chat-side-panel", children: [
    /* @__PURE__ */ jsx(
      Panel,
      {
        anchor: "right",
        className: "table-chat-panel",
        open: isOpen,
        setIsOpen: () => {
          setIsChatOpen(!isChatOpen);
        },
        size: "medium",
        title: chatConfiguration == null ? void 0 : chatConfiguration.title,
        width: pinnedMsg || showThread ? 1450 : 985,
        onClose: handleClose,
        children: /* @__PURE__ */ jsxs("div", { className: "table-chat-container", children: [
          /* @__PURE__ */ jsx(
            TableChatChannelHeader,
            {
              channels: isChannelsScreen ? channelsList : chatList,
              filterChannelsByTitle,
              handleChatName,
              handleChatSelect,
              handleToast,
              headerConfig: (_s = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _s.leftHeaderPanel,
              isCreateNewChatOpen,
              isSearchOpen,
              loadingChannels: loadingChannelsOrChats,
              selectedChannelInfo,
              selectedChannelOrChatId,
              selectedChat,
              setIsCreateNewChatOpen,
              showAddChatBtn: (_u = (_t = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _t.leftHeaderPanel) == null ? void 0 : _u.showAddChat,
              showChannelList: isChannelsScreen,
              showCheckbox: (_w = (_v = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _v.leftChatPanel) == null ? void 0 : _w.showCheckbox,
              title: isChannelsScreen ? t("tableChat.sidePanel.channelsList") : selectedChannelInfo == null ? void 0 : selectedChannelInfo.title,
              onBack: handleBackToChannels,
              onChannelSelect: (id, selectedChannelOrChat) => {
                if (isChannelsScreen) {
                  handleChannelClick(id, selectedChannelOrChat);
                } else {
                  handleChatClick(id, selectedChannelOrChat);
                }
              },
              onDeleteTopics: handleDeletePromptOpen,
              onMenuClick: toggleMenu,
              onMoreClick: showMore,
              onPinnedChatClick: (_x = chatConfiguration == null ? void 0 : chatConfiguration.headerChatConfig) == null ? void 0 : _x.onPinnedChatClick,
              onSearchClick: openSearch
            }
          ),
          loadingMessages ? /* @__PURE__ */ jsx(ChatSkeleton, { text: t("tableChat.loadingMessages") }) : /* @__PURE__ */ jsx(Fragment, { children: !selectedChannelId || !selectedChatId ? /* @__PURE__ */ jsx(
            EmptyContainer,
            {
              subTitle: !selectedChannelId ? (_y = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _y.emptyChannelStateSubTitle : !selectedChatId ? (_z = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _z.emptyChatStateSubTitle : "",
              title: !selectedChannelId ? (_A = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _A.emptyChannelStateTitle : !selectedChatId ? (_B = chatConfiguration == null ? void 0 : chatConfiguration.messageChatConfig) == null ? void 0 : _B.emptyChatStateTitle : ""
            }
          ) : /* @__PURE__ */ jsx(
            TableChatRightSection,
            {
              chatHeaderConfig: {
                ...chatConfiguration == null ? void 0 : chatConfiguration.headerChatConfig,
                onPinnedClick: (chatId) => {
                  setShowThread(false);
                  setShowPinnedMsg(true);
                  handlePinnedClick(chatId);
                }
              },
              chatId: selectedChatId,
              CreatedBy: (selectedChatInfo == null ? void 0 : selectedChatInfo.createdBy) || (selectedChatInfo == null ? void 0 : selectedChatInfo.user) || ((_C = selectedChatInfo == null ? void 0 : selectedChatInfo.otherProps) == null ? void 0 : _C.created_by_user),
              handleToast,
              inputChatConfig: {
                ...chatConfiguration.inputChatConfig
              },
              messageConfig: memoizedMessageConfig,
              setPinnedMessages,
              showActionBtn: (_E = (_D = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _D.rightHeaderPanel) == null ? void 0 : _E.showActionBtn,
              showParticipantsList: (_G = (_F = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _F.rightHeaderPanel) == null ? void 0 : _G.showParticipants,
              showPinnedChat: (_I = (_H = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _H.rightHeaderPanel) == null ? void 0 : _I.showPinnedChat,
              showSearch: (_K = (_J = chatConfiguration == null ? void 0 : chatConfiguration.leftPanel) == null ? void 0 : _J.rightHeaderPanel) == null ? void 0 : _K.showChatSearch,
              createdAt: (selectedChatInfo == null ? void 0 : selectedChatInfo.createdAt) || formatChatHeaderTimestamp((_L = selectedChatInfo == null ? void 0 : selectedChatInfo.otherProps) == null ? void 0 : _L.created_at),
              title: selectedChatInfo == null ? void 0 : selectedChatInfo.title
            }
          ) }),
          loadingPinned ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(ChatMessageListSkeleton, { className: "thread-skeleton", messageCount: 5 }) }) : /* @__PURE__ */ jsx(Fragment, { children: pinnedMsg && /* @__PURE__ */ jsx(
            PinnedPanel,
            {
              handleToast,
              messages: pinnedMessages,
              onClose: () => {
                setShowPinnedMsg(!pinnedMsg);
              },
              onMessageClick: handlePinnedMessageClick
            }
          ) }),
          loadingThread ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(ChatMessageListSkeleton, { className: "thread-skeleton", messageCount: 5 }) }) : /* @__PURE__ */ jsx(Fragment, { children: showThread && /* @__PURE__ */ jsx(
            PinnedPanel,
            {
              handleToast,
              messages: threadMessages,
              type: "thread",
              onClose: () => {
                setShowThread(!showThread);
              }
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      Prompt,
      {
        handleClose: () => {
          if (!isDeleting) {
            setShowDeletePrompt(false);
          }
        },
        isOpen: showDeletePrompt || isDeleting,
        primaryButtonLabel: isDeleting ? t("commentsPanel.deleting") : t("commentsPanel.delete"),
        primaryButtonProps: {
          disabled: isDeleting,
          loading: isDeleting
        },
        secondaryButtonLabel: t("common.cancel"),
        title: t("tableChat.sidePanel.deleteChatsTitle"),
        variant: "error",
        onPrimaryButtonClick: () => {
          if (!isDeleting) {
            handleDeleteChat();
          }
        },
        onSecondaryButtonClick: () => {
          if (!isDeleting) {
            setShowDeletePrompt(false);
          }
        },
        children: selectedChat.length > 1 ? t("tableChat.deleteChats.confirmMany", {
          count: selectedChat.length
        }) : t("tableChat.deleteChats.confirmOne", {
          count: selectedChat.length
        })
      }
    ),
    /* @__PURE__ */ jsx(
      Toast,
      {
        isOpen: openToast,
        message: toastMessage,
        position: "top-right",
        variant: toastVariant,
        onClose: () => {
          setOpenToast(!openToast);
        }
      }
    )
  ] });
};
export {
  TableChatSidePanel as default
};
