!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.chat-input{background:#fff;box-sizing:border-box;margin:0 16px 12px;min-width:0}.chat-input.focused{border-top-color:#4259ee}.chat-input .edit-mode-indicator{background-color:#fff3cd;border:1px solid #ffeaa7;border-radius:8px;margin-bottom:8px;padding:8px 12px}.chat-input .edit-mode-indicator .edit-mode-text{align-items:center;color:#856404;display:flex;font-size:14px;justify-content:space-between}.chat-input .edit-mode-indicator .edit-mode-text span{align-items:center;display:flex;font-weight:500;gap:6px}.chat-input .edit-mode-indicator .edit-mode-text .cancel-edit-btn{background:none;border:1px solid #ffeaa7;border-radius:4px;color:#856404;cursor:pointer;font-size:12px;padding:4px 8px;transition:all .2s ease}.chat-input .edit-mode-indicator .edit-mode-text .cancel-edit-btn:hover{background-color:#ffeaa7;color:#6c5400}.chat-input .quick-action-container{align-items:center;display:flex;justify-content:flex-end;margin-bottom:6px}.chat-input .show-formatting-enabled{justify-content:space-between}.chat-input .formatting-toolbar{align-items:center}.chat-input .formatting-toolbar .format-button{align-items:center;background:none;border:none;color:#7a8294;cursor:pointer;display:flex;justify-content:center;padding:6px}.chat-input .formatting-toolbar .format-button:hover{background:#eceefd;color:#4259ee}.chat-input .input-container{position:relative}.chat-input .input-container .input-wrapper{align-items:flex-end;background:#fff;border:1px solid #d9dde7;border-radius:12px;box-shadow:0 0 12px 8px #0000000f;display:flex;gap:8px;padding:12px 16px;transition:border-color .2s ease}.chat-input .input-container .input-wrapper:focus-within{border-color:#4259ee}.chat-input .input-container .input-wrapper .message-input{background:none;border:none;color:#1f2b4d;flex:1;font-family:Manrope,sans-serif;font-size:14px;line-height:1.4;outline:none}.chat-input .input-container .input-wrapper .message-input::placeholder{color:#7a8294}.chat-input .input-container .input-wrapper .image-input-container{display:flex;flex-direction:column;gap:2px;width:100%}.chat-input .input-container .character-count{bottom:-22px;color:#b4bac7;font-size:11px;position:absolute;right:-5px}.chat-input .formatting-toolbar{display:flex;gap:4px;padding:4px}.chat-input .formatting-toolbar .format-button{border-radius:4px;padding:4px;transition:all .2s ease}.chat-input .formatting-toolbar .format-button:hover{background-color:#f5f5f5}.chat-input .formatting-toolbar .format-button.is-active{background-color:#e2f4ff;color:#4259ee}.chat-input .upload-container{display:flex;flex-direction:column;width:100%}.chat-input .upload-container .image-preview-container{display:flex;flex-wrap:wrap;gap:8px}.chat-input .upload-container .image-preview-container img{border-radius:8px;object-fit:cover}.chat-input .upload-container .file-preview-container{display:flex;flex-direction:column;gap:4px}.chat-input .message-input{border:1px solid #f0f0f0;border-radius:4px;font-size:14px;line-height:1.5;padding:8px;width:100%}.chat-input .message-input:focus{border-color:#4259ee;outline:none}.chat-input .chat-input-section{border-radius:12px;display:flex;flex-direction:column;gap:6px;position:static;width:100%}.chat-input .chat-input-section.new-chat-screen{bottom:0;position:relative;width:100%}.chat-input .chat-input-section.custom-screen{bottom:15px;width:95%}.chat-input .chat-input-textarea{border:none;max-height:500px;min-height:10px;outline:none;overflow-y:auto;resize:none;width:100%}.chat-input .chat-input-container{background:#fff;border:1px solid #d9dde7;border-radius:12px;box-shadow:0 0 12px 8px #0000000f;padding:12px;position:relative;width:100%}.chat-input .chat-input-container:focus-within,.chat-input .chat-input-container:hover{border:1px solid #b3bdf8}.chat-input .chat-input-wrapper{align-items:flex-end;display:flex;max-height:182px;transition:all .2s ease-in-out;width:100%}.chat-input .chat-input-wrapper.stacked{align-items:stretch;flex-direction:column}.chat-input .chat-input-wrapper.empty{align-items:flex-end;flex-direction:row}.chat-input .chat-input-wrapper.single-line-textarea{align-items:center}.chat-input .message-input-container{display:flex;flex-direction:column;gap:4px;width:100%}.chat-input .chat-textarea{background:#0000;border:none;color:#1f2b4d;flex:1;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;line-height:160%;max-height:142px;outline:none;overflow-y:hidden;padding:0;resize:none;width:100%}.chat-input .chat-textarea::placeholder{color:#b4bac7}.chat-input .chat-textarea{transition:all .2s ease-in-out}.chat-input .chat-textarea.scrollable{overflow-y:auto}.chat-input .chat-actions{align-items:flex-end;display:flex;gap:12px;height:32px;justify-content:flex-end}.chat-input .chat-actions.fixed{height:36px}.chat-input .chat-actions.not-fixed{height:32px}.chat-input .input-actions{align-items:center;display:flex;gap:8px}.chat-input .input-actions .send-actions{align-items:center;display:flex;gap:8px;height:30px}.chat-input .input-actions .send-actions .ia-btn-icon{height:28px;margin-bottom:-4px}.chat-input .input-actions .send-actions img{width:12px}.chat-input .input-actions .send-actions .check-button{background:none;border:3px solid #eceefd;border-radius:8px;color:#7a8294;cursor:pointer;height:32px;padding:8px;width:32px}.chat-input .input-actions .send-actions .check-button .check-icon{width:12px}.chat-input .input-actions .send-actions .send-button{align-items:center!important;background:#0000!important;border:none!important;border-radius:6px!important;color:#fff!important;display:flex!important;height:32px!important;justify-content:center!important;min-width:32px!important;padding:0!important;width:32px!important}.tiptap p.is-editor-empty:first-child:before{color:#d9dde7;content:attr(data-placeholder);float:left;height:0;pointer-events:none}.quick-action-menu.MuiPopover-root .MuiPaper-root{margin-bottom:8px!important}.ia-styles.ia-menu.quick-action-container .MuiList-root{min-width:214px!important}.ia-styles.ia-menu.quick-action-container .MuiPaper-root{margin-left:6px!important;margin-top:-10px!important}.ia-styles.ia-menu.priority-action-container .MuiList-root{min-width:214px!important}.ia-styles.ia-menu.priority-action-container .MuiPaper-root{margin-left:36px!important;margin-top:-6px!important}.input-actions .send-actions .ia-btn-icon-loading{margin-bottom:0;padding-top:7px}.selected_action_priority{border:1px solid #3649c6!important}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React__default, { useState, useRef, useEffect } from "react";
import { getAssetUrl } from "../../../../../utils/assetBase.js";
import { Button } from "../../../../Button/index.js";
import { Menu } from "../../../../Menu/index.js";
import { EditorToolbar } from "../../TextEditor/EditorToolbar.js";
import { MentionEditor } from "../../TextEditor/Mention.js";
import TableChatEmojiPicker from "../EmojiPicker/EmojiPicker.js";
import FileUploader from "../FileUploader/FileUploader.js";
import ImageUploader from "../ImageUploader/ImageUploader.js";

import { useTranslation } from "../../../../../i18n/useTranslation.js";
const ListIcon = getAssetUrl("icons/listIcon.svg");
const ThumbsUpIcon = getAssetUrl("icons/thumbsupBlueIcon.svg");
const CheckGreenIcon = getAssetUrl("icons/checkGreeIcon.svg");
const EditYellowIcon = getAssetUrl("icons/editYellowIcon.svg");
const DeleteRedIcon = getAssetUrl("icons/deleteRedIcon.svg");
const CheckBlueIcon = getAssetUrl("icons/checkBlueIcon.svg");
const WarningRedIcon = getAssetUrl("icons/warningRedIcon.svg");
const ThumbsUpYellowIcon = getAssetUrl("icons/thumbsUpYellowIcon.svg");
const NotAllowedGreenIcon = getAssetUrl("icons/notAllowedGreenIcon.svg");
const SendIcon = getAssetUrl("icons/sendIcon.svg");
const CheckIcon = getAssetUrl("icons/checkIcon.svg");
const ChatInput = ({
  placeholder,
  value,
  onChange,
  onSend,
  onAttach,
  onImageUpload,
  onEmojiClick,
  showFormatting = true,
  showQuickAction = true,
  quickActionLabel,
  disabled = false,
  maxLength = 5e3,
  className = "chat-input",
  messageConfig = {},
  isEditMode = false,
  editingMessage = null,
  onCancelEdit,
  chatId
}) => {
  var _a, _b, _c, _d, _e, _f;
  const { t } = useTranslation();
  const [message, setMessage] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const [quickActionAnchorEl, setQuickActionAnchorEl] = useState(null);
  const [quickActionMenuOpen, setQuickActionMenuOpen] = useState(false);
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [height, setHeight] = useState("auto");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);
  const [isFormatActive, setIsFormatActive] = useState({
    bold: false,
    italic: false,
    link: false,
    bulletList: false,
    orderedList: false,
    strike: false,
    highlight: false,
    h1: false,
    h2: false,
    h3: false,
    h4: false,
    h5: false,
    h6: false
  });
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const priorityOptions = [
    {
      value: "normal",
      label: t("tableChat.priority.normal"),
      icon: /* @__PURE__ */ jsx("img", { src: CheckBlueIcon })
      // onClick: (data) => {
      //   setSelectedPriority(data);
      // },
    },
    {
      value: "high",
      label: t("tableChat.priority.high"),
      icon: /* @__PURE__ */ jsx("img", { src: WarningRedIcon })
      // onClick: (data) => {
      //   setSelectedPriority(data);
      // },
    },
    {
      value: "medium",
      label: t("tableChat.priority.medium"),
      icon: /* @__PURE__ */ jsx("img", { src: ThumbsUpYellowIcon })
      // onClick: (data) => {
      //   setSelectedPriority(data);
      // },
    },
    {
      value: "low",
      label: t("tableChat.priority.low"),
      icon: /* @__PURE__ */ jsx("img", { src: NotAllowedGreenIcon })
      // onClick: (data) => {
      //   setSelectedPriority(data);
      // },
    }
  ];
  const getPlainText = (html) => {
    var _a2;
    return (_a2 = html == null ? void 0 : html.replace(/<[^>]+>/g, "")) == null ? void 0 : _a2.trim();
  };
  const getMentionedUsers = () => {
    var _a2;
    if (!((_a2 = editorRef.current) == null ? void 0 : _a2.editor)) return [];
    const editor = editorRef.current.editor;
    const mentions = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "mention") {
        mentions.push({
          id: node.attrs.id,
          label: node.attrs.label || node.attrs.id,
          position: pos
        });
      }
    });
    return mentions;
  };
  useEffect(() => {
    setMessage(value || "");
  }, [value]);
  const defaultQuickActionMenuOptions = [
    {
      value: "requestReview",
      label: t("tableChat.input.requestReview"),
      icon: /* @__PURE__ */ jsx("img", { src: ThumbsUpIcon }),
      // onClick: (data) => {
      //   const text = getPrefillText(data);
      //   onChange?.(text);
      // },
      prefillText: t("tableChat.input.requestReviewText")
    },
    {
      value: "finalOffer",
      label: t("tableChat.input.finalOffer"),
      icon: /* @__PURE__ */ jsx("img", { src: CheckGreenIcon }),
      // onClick: (data) => {
      //   const text = getPrefillText(data);
      //   onChange?.(text);
      // },
      prefillText: t("tableChat.input.finalOfferText")
    },
    {
      value: "editRequest",
      label: t("tableChat.input.editRequest"),
      icon: /* @__PURE__ */ jsx("img", { src: EditYellowIcon }),
      // onClick: (data) => {
      //   const text = getPrefillText(data);
      //   onChange?.(text);
      // },
      prefillText: t("tableChat.input.editRequestText")
    },
    {
      value: "deleteRequest",
      label: t("tableChat.input.deleteRequest"),
      icon: /* @__PURE__ */ jsx("img", { src: DeleteRedIcon }),
      // onClick: (data) => {
      //   const text = getPrefillText(data);
      //   onChange?.(text);
      // },
      prefillText: t("tableChat.input.deleteRequestText")
    }
  ];
  const getPrefillText = (value2, selectedArray) => {
    const action = selectedArray == null ? void 0 : selectedArray.find((item) => (item == null ? void 0 : item.value) === value2);
    return action ? action : "";
  };
  const quickActionMenuOptions = ((_b = (_a = messageConfig.messageConfig) == null ? void 0 : _a.quickActionProps) == null ? void 0 : _b.length) > 0 ? (_c = messageConfig.messageConfig) == null ? void 0 : _c.quickActionProps : defaultQuickActionMenuOptions;
  const priorityMenuOptions = ((_e = (_d = messageConfig.messageConfig) == null ? void 0 : _d.priorityOptions) == null ? void 0 : _e.length) > 0 ? (_f = messageConfig.messageConfig) == null ? void 0 : _f.priorityOptions : priorityOptions;
  const updateFormatState = React__default.useCallback(() => {
    var _a2;
    if ((_a2 = editorRef.current) == null ? void 0 : _a2.editor) {
      const editor = editorRef.current.editor;
      setIsFormatActive((prev) => {
        const next = {
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          link: editor.isActive("link"),
          bulletList: editor.isActive("bulletList"),
          orderedList: editor.isActive("orderedList"),
          strike: editor.isActive("strike"),
          highlight: editor.isActive("highlight"),
          h1: editor.isActive("heading", { level: 1 }),
          h2: editor.isActive("heading", { level: 2 }),
          h3: editor.isActive("heading", { level: 3 }),
          h4: editor.isActive("heading", { level: 4 }),
          h5: editor.isActive("heading", { level: 5 }),
          h6: editor.isActive("heading", { level: 6 })
        };
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    }
  }, []);
  const getDisplayValue = () => {
    const plainText = getPlainText(message);
    if (plainText && plainText.trim() !== "") {
      return message;
    }
    if ((selectedQuickAction == null ? void 0 : selectedQuickAction.prefillText) && selectedQuickAction.prefillText.trim() !== "") {
      setSelectedQuickAction(null);
      return "";
    }
    return "";
  };
  const getTrimmedValue = () => {
    var _a2;
    const plainText = getPlainText(message);
    if (plainText == null ? void 0 : plainText.trim()) {
      return message;
    }
    return ((_a2 = selectedQuickAction == null ? void 0 : selectedQuickAction.prefillText) == null ? void 0 : _a2.trim()) || "";
  };
  const handleInputChange = React__default.useCallback(
    (htmlContent) => {
      setMessage(htmlContent);
      onChange == null ? void 0 : onChange(htmlContent);
    },
    [onChange]
  );
  useEffect(() => {
    let timeoutId;
    const handleSelectionUpdate = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(updateFormatState, 100);
    };
    const setupTimeout = setTimeout(() => {
      var _a2;
      if ((_a2 = editorRef.current) == null ? void 0 : _a2.editor) {
        const editor = editorRef.current.editor;
        editor.on("selectionUpdate", handleSelectionUpdate);
        editor.on("update", handleSelectionUpdate);
        updateFormatState();
      }
    }, 100);
    return () => {
      var _a2;
      clearTimeout(setupTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if ((_a2 = editorRef.current) == null ? void 0 : _a2.editor) {
        const editor = editorRef.current.editor;
        editor.off("selectionUpdate", handleSelectionUpdate);
        editor.off("update", handleSelectionUpdate);
      }
    };
  }, [updateFormatState]);
  const handleEmojiClick = (emoji) => {
    var _a2;
    if ((_a2 = editorRef.current) == null ? void 0 : _a2.insertEmoji) {
      editorRef.current.insertEmoji(emoji);
    }
    setEmojiPickerOpen(false);
  };
  const handleSend = async () => {
    var _a2, _b2;
    const htmlContent = getTrimmedValue();
    if (!htmlContent || disabled) return;
    const mentionedUsers = getMentionedUsers();
    const taggedUsers = mentionedUsers.map((user) => user.id);
    if (onSend) {
      setIsSending(true);
      try {
        await onSend({
          content: htmlContent,
          selectedPriority,
          taggedUsers
        });
        setMessage("");
        setSelectedQuickAction(null);
        setSelectedPriority("");
        if ((_a2 = editorRef.current) == null ? void 0 : _a2.clearContent) {
          editorRef.current.clearContent();
        }
        onChange == null ? void 0 : onChange("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false);
      }
    } else {
      setMessage("");
      setSelectedQuickAction(null);
      if ((_b2 = editorRef.current) == null ? void 0 : _b2.clearContent) {
        editorRef.current.clearContent();
      }
      onChange == null ? void 0 : onChange("");
    }
  };
  const handleQuickActionClick = (event) => {
    setQuickActionMenuOpen(true);
    setQuickActionAnchorEl(event.currentTarget);
  };
  const handlePriorityClick = (event) => {
    setPriorityMenuOpen(true);
    setPriorityAnchorEl(event.currentTarget);
  };
  const handleUpload = (file) => {
    setIsLoading(true);
    setIsError(false);
    const isSuccess = Math.random() > 0.3;
    const apiResponseTime = 1500;
    setTimeout(() => {
      setIsLoading(false);
      if (isSuccess) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
      } else {
        setIsError(true);
        console.error("Simulated API Error: Failed to upload image.");
      }
    }, apiResponseTime);
  };
  const handleFileRetry = () => {
    if (uploadedFile) {
      setFileUploadLoading(true);
      setFileUploadError(false);
      setTimeout(() => {
        const isSuccess = Math.random() > 0.3;
        setFileUploadLoading(false);
        if (isSuccess) {
          const mockFileUrl = `https://api.example.com/files/${uploadedFile.name}`;
          setFileUrl(mockFileUrl);
          console.log("File upload retry successful:", mockFileUrl);
        } else {
          setFileUploadError(true);
          console.error("File upload retry failed");
        }
      }, 1500);
    }
  };
  const handleFileClear = () => {
    setUploadedFile(null);
    setFileUrl(null);
    setFileUploadError(false);
    setFileUploadLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleClear = () => {
    setImage(null);
    setIsLoading(false);
    setIsError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleRetry = () => {
    var _a2;
    if ((_a2 = fileInputRef.current) == null ? void 0 : _a2.files[0]) {
      handleUpload(fileInputRef.current.files[0]);
    }
  };
  const handleFileDownload = (url, fileName) => {
    console.log(`Downloading file ${fileName} from ${url}`);
  };
  const handleEmojiPickerClose = () => {
    setEmojiPickerOpen(false);
    setEmojiAnchorEl(null);
  };
  const handleEmojiPickerOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setEmojiAnchorEl(event.currentTarget);
    setEmojiPickerOpen(!emojiPickerOpen);
  };
  useEffect(() => {
    if (message === "") {
      setHeight("auto");
      setIsFixed(false);
    }
  }, [message]);
  return /* @__PURE__ */ jsxs("div", { className: `${className} ${isFocused ? "focused" : ""}`, children: [
    isEditMode && editingMessage && /* @__PURE__ */ jsx("div", { className: "edit-mode-indicator", children: /* @__PURE__ */ jsxs("div", { className: "edit-mode-text", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "✏️ ",
        t("tableChat.input.editingMessage")
      ] }),
      /* @__PURE__ */ jsx("button", { className: "cancel-edit-btn", type: "button", onClick: onCancelEdit, children: t("common.cancel") })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: `quick-action-container ${showFormatting ? "show-formatting-enabled" : ""}`, children: [
      showFormatting && /* @__PURE__ */ jsx(
        EditorToolbar,
        {
          ref: toolbarRef,
          activeStates: isFormatActive,
          className: "formatting-toolbar",
          enabledItems: [
            "bold",
            "italic",
            "link",
            // "bulletList", // Enabled if required (functionality implemented)
            // "orderedList",
            "strike",
            "highlight"
            // "h1",
            // "h2",
            // "h3",
            // "h4",
            // "h5",
            // "h6",
          ],
          editor: editorRef.current,
          onEmojiSelect: handleEmojiPickerOpen
        }
      ),
      showQuickAction && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className: `${(selectedQuickAction == null ? void 0 : selectedQuickAction.value) && "selected_action_priority"} quick-action-button `,
            icon: /* @__PURE__ */ jsx("img", { src: ListIcon }),
            variant: "tertiary",
            onClick: handleQuickActionClick,
            children: quickActionLabel || t("tableChat.input.quickAction")
          }
        ),
        /* @__PURE__ */ jsx(
          Menu,
          {
            anchorEl: quickActionAnchorEl,
            iconPlacement: "top",
            menuContainerClassName: "quick-action-container",
            MenuProps: {
              anchorOrigin: {
                vertical: "top",
                horizontal: "left"
              },
              transformOrigin: {
                vertical: "bottom",
                horizontal: "center"
              }
            },
            open: quickActionMenuOpen,
            options: quickActionMenuOptions,
            selected: selectedQuickAction,
            onClick: (option) => {
              var _a2;
              const text = getPrefillText(option.value, quickActionMenuOptions);
              if ((selectedQuickAction == null ? void 0 : selectedQuickAction.value) === option.value) {
                setSelectedQuickAction(null);
                setMessage("");
                if ((_a2 = editorRef.current) == null ? void 0 : _a2.clearContent) {
                  editorRef.current.clearContent();
                }
              } else {
                setSelectedQuickAction(text);
                const prefillText = (text == null ? void 0 : text.prefillText) || "";
                setMessage(prefillText);
              }
              setQuickActionMenuOpen(false);
            },
            onClose: () => {
              setQuickActionMenuOpen(false);
            }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "chat-input-section", children: /* @__PURE__ */ jsx("div", { className: "chat-input-container", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: `chat-input-wrapper ${isFixed ? "stacked" : ""} ${!isFixed || message === "" ? "empty" : ""} ${!isFixed ? "single-line-textarea" : ""}`,
        style: { height },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "message-input-container", children: [
            /* @__PURE__ */ jsxs("div", { className: "upload-container", children: [
              /* @__PURE__ */ jsx("div", { className: "image-preview-container", children: image || isLoading || isError ? /* @__PURE__ */ jsx(
                ImageUploader,
                {
                  handleClear,
                  handleRetry,
                  image,
                  isError,
                  isLoading
                }
              ) : null }),
              /* @__PURE__ */ jsx("div", { className: "file-preview-container", children: (uploadedFile || fileUploadLoading || fileUploadError) && /* @__PURE__ */ jsx(
                FileUploader,
                {
                  file: uploadedFile,
                  fileUrl,
                  isError: fileUploadError,
                  isLoading: fileUploadLoading,
                  onClear: handleFileClear,
                  onDownload: handleFileDownload,
                  onRetry: handleFileRetry
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(
              MentionEditor,
              {
                ref: editorRef,
                chatId,
                disabled,
                loadParticipantsAvatar: messageConfig.loadParticipantsAvatar,
                maxLength,
                placeholder: t("tableChat.input.mentionPlaceholder"),
                value: getDisplayValue(),
                onChange: handleInputChange,
                onSend: handleSend
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: `chat-actions ${isFixed ? "fixed" : ""}`, children: /* @__PURE__ */ jsx("div", { className: "input-actions", children: /* @__PURE__ */ jsxs("div", { className: "send-actions", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                ariaLabel: t("tableChat.input.markAsDone"),
                className: `${selectedPriority.value && "selected_action_priority"} check-button`,
                icon: /* @__PURE__ */ jsx("img", { className: "check-icon", src: CheckIcon }),
                variant: "tertiary",
                onClick: handlePriorityClick
              }
            ),
            /* @__PURE__ */ jsx(
              Menu,
              {
                anchorEl: priorityAnchorEl,
                iconPlacement: "top",
                menuContainerClassName: "priority-action-container",
                MenuProps: {
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  },
                  transformOrigin: {
                    vertical: "bottom",
                    horizontal: "right"
                  }
                },
                open: priorityMenuOpen,
                options: priorityMenuOptions,
                selected: selectedPriority,
                onClick: (option) => {
                  const text = getPrefillText(option.value, priorityMenuOptions);
                  if (selectedPriority.value === option.value) {
                    setSelectedPriority("");
                  } else {
                    setSelectedPriority(text);
                  }
                  setPriorityMenuOpen(false);
                },
                onClose: () => {
                  setPriorityMenuOpen(false);
                }
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                "aria-label": isEditMode ? t("tableChat.input.updateMessage") : t("tableChat.input.sendMessage"),
                disabled: !getTrimmedValue(),
                icon: /* @__PURE__ */ jsx("img", { src: SendIcon }),
                loading: isSending,
                title: isEditMode ? t("tableChat.input.updateMessage") : t("tableChat.input.sendMessage"),
                variant: "primary",
                onClick: handleSend
              }
            )
          ] }) }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      TableChatEmojiPicker,
      {
        anchorEl: emojiAnchorEl,
        open: emojiPickerOpen,
        onClose: handleEmojiPickerClose,
        onEmojiClick: handleEmojiClick
      }
    )
  ] });
};
export {
  ChatInput
};
