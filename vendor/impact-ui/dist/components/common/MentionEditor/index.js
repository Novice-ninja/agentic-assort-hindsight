!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.ProseMirror-focused{outline:none}.tiptap :first-child{margin-top:0}.tiptap p{margin:0!important;word-wrap:break-word;-webkit-hyphens:auto;hyphens:auto;overflow-wrap:break-word}.tiptap h1{font-size:2em;margin:1em 0 .5em}.tiptap h1,.tiptap h2{color:#1a202c;font-weight:600}.tiptap h2{font-size:1.5em;margin:.83em 0 .5em}.tiptap h3{color:#1a202c;font-size:1.17em;font-weight:600;margin:.67em 0 .5em}.tiptap h4{font-size:1em}.tiptap h4,.tiptap h5{color:#1a202c;font-weight:600;margin:.5em 0}.tiptap h5{font-size:.83em}.tiptap h6{color:#1a202c;font-size:.67em;margin:.5em 0}.tiptap h6,.tiptap strong{font-weight:600}.tiptap em{font-style:italic}.tiptap s{color:#666;text-decoration:line-through;text-decoration-thickness:.1em}.tiptap .highlight{background-color:#fef3c7!important}.tiptap .highlight,.tiptap mark{border-radius:4px;margin:0 2px;padding:2px 4px}.tiptap mark{background-color:#fef3c7}.tiptap a{border-bottom:1px solid #2b6cb0;color:#2b6cb0;text-decoration:none;transition:all .2s ease}.tiptap a:hover{border-bottom-color:#1a4971;color:#1a4971}.tiptap img{border-radius:4px;height:auto;margin:.5em 0;max-width:100%}.tiptap .mention{background-color:#f0f4f8;border-radius:4px;-webkit-box-decoration-break:clone;box-decoration-break:clone;color:#2b6cb0;font-weight:500;padding:2px 6px;text-decoration:none;transition:background-color .2s ease;white-space:nowrap}.tiptap .mention:hover{background-color:#e2e8f0;cursor:pointer}.tiptap .is-active{background-color:#f0f4f8}.tiptap ol,.tiptap ul{margin:.5em 0;padding-left:1.2em}.tiptap ol li,.tiptap ul li{line-height:1.2;margin:.2em 0;padding-left:0}.tiptap ol li p,.tiptap ul li p{display:inline-block;margin:0}.tiptap ul li{list-style-type:disc}.tiptap ol li{list-style-type:decimal}.tiptap ol ol,.tiptap ol ul,.tiptap ul ol,.tiptap ul ul{margin:.2em 0 .2em .5em}.tiptap ul ul li{list-style-type:circle}.tiptap ul ul ul li{list-style-type:square}.tiptap ol ol li{list-style-type:lower-alpha}.tiptap ol ol ol li{list-style-type:lower-roman}.tiptap ol[data-type=orderedList] li,.tiptap ul[data-type=bulletList] li{position:relative}.tiptap ol[data-type=orderedList] li:before,.tiptap ul[data-type=bulletList] li:before{border-radius:50%;content:"";height:4px;left:-1em;position:absolute;top:50%;transform:translateY(-50%);width:4px}.tiptap .highlight{background-color:#fef3c7;border-radius:2px;padding:0 2px}.tiptap code{background-color:#f7fafc;border-radius:4px;font-family:monospace;padding:.2em .4em}.tiptap blockquote{border-left:3px solid #e2e8f0;color:#4a5568;margin:.5em 0;padding-left:1em}.character-count{align-items:center;color:var(--gray-5);display:flex;font-size:.75rem;gap:.5rem;margin:1.5rem}.character-count svg{color:var(--purple)}.character-count--warning,.character-count--warning svg{color:var(--red)}.tiptap-editor{background:#0000;border:none;color:#1f2b4d;flex:1;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;line-height:160%;max-height:130px;min-height:20px;outline:none;overflow-y:auto;padding:0;resize:none;transition:all .2s ease-in-out;width:100%}.tiptap-editor::placeholder{color:#b4bac7}.tiptap-editor .ProseMirror{max-height:100px;min-height:40px;outline:none;overflow-y:auto;word-wrap:break-word}.tiptap-editor .ProseMirror::-webkit-scrollbar{width:4px}.tiptap-editor .ProseMirror::-webkit-scrollbar-track{background:#0000}.tiptap-editor .ProseMirror::-webkit-scrollbar-thumb{background:#0003;border-radius:2px}.tiptap-editor .ProseMirror::-webkit-scrollbar-thumb:hover{background:#0000004d}.single-line .tiptap{line-height:24px}.tiptap-editor div.ProseMirror{padding:0!important}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx } from "react/jsx-runtime";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import { Placeholder } from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import suggestion from "./suggestion.js";
import { useTranslation } from "../../../i18n/useTranslation.js";
const MentionEditor = forwardRef(
  ({
    value,
    onChange,
    onSend,
    disabled = false,
    maxLength = 5e3,
    placeholder,
    chatId,
    loadParticipantsAvatar,
    isMultiLine = false,
    ...restConfig
  }, ref) => {
    const { t } = useTranslation();
    const resolvedPlaceholder = placeholder ?? t("mentionEditor.placeholder");
    const editor = useEditor({
      ...restConfig,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: resolvedPlaceholder
        }),
        Mention.configure({
          HTMLAttributes: {
            class: "mention"
          },
          suggestion
        }),
        Image.configure({
          inline: true,
          allowBase64: true
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            rel: "noopener noreferrer",
            class: "link"
          }
        }),
        Strike,
        Highlight.configure({
          multicolor: true
        })
      ],
      content: value || "",
      editable: !disabled,
      onUpdate: ({ editor: editor2 }) => {
        const html = editor2.getHTML();
        onChange == null ? void 0 : onChange(html);
      },
      onCreate: ({ editor: editor2 }) => {
        editor2.storage.mentionConfig = {
          chatId,
          loadParticipantsAvatar
        };
      },
      editorProps: {
        handleKeyDown: (view, event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            const { state } = view;
            const { selection } = state;
            const isInList = (editor == null ? void 0 : editor.isActive("bulletList")) || (editor == null ? void 0 : editor.isActive("orderedList"));
            const isMentionActive = state.doc.resolve(selection.from).parent.type.name === "mention" || selection.$from.nodeBefore && selection.$from.nodeBefore.type.name === "mention";
            const textBefore = state.doc.textBetween(
              Math.max(0, selection.from - 20),
              selection.from
            );
            const isTypingMention = /@\w*$/.test(textBefore);
            if (isInList || isMentionActive || isTypingMention) {
              return false;
            }
            event.preventDefault();
            onSend == null ? void 0 : onSend(event);
            return true;
          }
          return false;
        },
        attributes: {
          class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
          style: "max-height: 100px; overflow-y: auto; padding: 8px 12px; min-height: 10px;"
        }
      }
    });
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    }, [value, editor]);
    useEffect(() => {
      if (editor) {
        editor.storage.mentionConfig = {
          chatId,
          loadParticipantsAvatar
        };
      }
    }, [editor, chatId, loadParticipantsAvatar]);
    useImperativeHandle(ref, () => ({
      focus: () => editor == null ? void 0 : editor.commands.focus(),
      toggleBold: () => editor == null ? void 0 : editor.chain().focus().toggleBold().run(),
      toggleItalic: () => editor == null ? void 0 : editor.chain().focus().toggleItalic().run(),
      toggleLink: () => {
        const previousUrl = editor == null ? void 0 : editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return;
        if (url === "") {
          editor == null ? void 0 : editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor == null ? void 0 : editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      },
      addImage: (url, alt) => {
        if (url) {
          editor == null ? void 0 : editor.chain().focus().setImage({ src: url, alt: alt || "" }).run();
        }
      },
      getHTML: () => (editor == null ? void 0 : editor.getHTML()) || "",
      getJSON: () => editor == null ? void 0 : editor.getJSON(),
      clearContent: () => editor == null ? void 0 : editor.commands.clearContent(),
      isEmpty: () => editor ? editor.isEmpty : true,
      insertEmoji: (emoji) => {
        editor == null ? void 0 : editor.chain().focus().insertContent(emoji).run();
      },
      toggleStrike: () => editor == null ? void 0 : editor.chain().focus().toggleStrike().run(),
      toggleHighlight: () => {
        const result = editor == null ? void 0 : editor.chain().focus().toggleHighlight().run();
        return result;
      },
      toggleBulletList: () => editor == null ? void 0 : editor.chain().focus().toggleBulletList().run(),
      toggleOrderedList: () => editor == null ? void 0 : editor.chain().focus().toggleOrderedList().run(),
      toggleH1: () => editor == null ? void 0 : editor.chain().focus().toggleHeading({ level: 1 }).run(),
      toggleH2: () => editor == null ? void 0 : editor.chain().focus().toggleHeading({ level: 2 }).run(),
      toggleH3: () => editor == null ? void 0 : editor.chain().focus().toggleHeading({ level: 3 }).run(),
      toggleH4: () => editor == null ? void 0 : editor.chain().focus().toggleHeading({ level: 4 }).run(),
      toggleH5: () => editor == null ? void 0 : editor.chain().focus().toggleHeading({ level: 5 }).run(),
      toggleH6: () => editor == null ? void 0 : editor.chain().focus().toggleHeading({ level: 6 }).run(),
      editor
    }));
    useEffect(() => {
      if (editor) {
        const updateHandler = () => {
          onChange == null ? void 0 : onChange(editor.getHTML());
        };
        editor.on("selectionUpdate", updateHandler);
        return () => {
          editor.off("selectionUpdate", updateHandler);
        };
      }
    }, [editor, onChange]);
    if (!editor) {
      return null;
    }
    return /* @__PURE__ */ jsx("div", { className: `tiptap-editor ${!isMultiLine ? "single-line" : ""}`, style: {}, children: /* @__PURE__ */ jsx(EditorContent, { editor }) });
  }
);
export {
  MentionEditor
};
