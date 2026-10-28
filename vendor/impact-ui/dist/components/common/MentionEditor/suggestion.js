import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { MentionList } from "./MentionList/index.js";
const suggestion = {
  items: async ({ query, editor }) => {
    console.log("🔍 [Suggestion] items called with query:", query);
    const { chatId, loadParticipantsAvatar } = editor.storage.mentionConfig || {};
    console.log("🔍 [Suggestion] chatId:", chatId);
    console.log("🔍 [Suggestion] loadParticipantsAvatar:", typeof loadParticipantsAvatar);
    if (!chatId || !loadParticipantsAvatar) {
      console.log("❌ [Suggestion] Missing chatId or loadParticipantsAvatar function");
      return [];
    }
    try {
      console.log("🔄 [Suggestion] Loading participants for chatId:", chatId);
      const participants = await loadParticipantsAvatar("existing", chatId);
      console.log("✅ [Suggestion] Participants loaded:", participants);
      if (participants && Array.isArray(participants)) {
        const users = participants.map((participant) => ({
          id: participant.id,
          name: participant.label,
          avatar: participant.avatar,
          status: participant.status
        }));
        console.log("🔄 [Suggestion] Transformed users:", users);
        const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        console.log("✅ [Suggestion] Filtered users:", filteredUsers);
        return filteredUsers;
      } else {
        console.log("❌ [Suggestion] No participants or invalid format");
        return [];
      }
    } catch (error) {
      console.error("❌ [Suggestion] Error loading participants for mentions:", error);
      return [];
    }
  },
  render: () => {
    let component;
    let popup;
    return {
      onStart: (props) => {
        console.log("🔄 [Suggestion] onStart called with props:", props);
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor
        });
        if (!props.clientRect) {
          return;
        }
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start"
        });
      },
      onUpdate(props) {
        console.log("🔄 [Suggestion] onUpdate called");
        component.updateProps(props);
        if (!props.clientRect) {
          return;
        }
        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        });
      },
      onKeyDown(props) {
        var _a;
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        return (_a = component.ref) == null ? void 0 : _a.onKeyDown(props);
      },
      onExit() {
        console.log("🔄 [Suggestion] onExit called");
        popup[0].destroy();
        component.destroy();
      }
    };
  }
};
export {
  suggestion as default
};
