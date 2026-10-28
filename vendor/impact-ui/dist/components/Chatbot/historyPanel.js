import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, useState, useRef, useEffect } from "react";
import { getAssetUrl } from "../../utils/assetBase.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const CloseIcon = getAssetUrl("icons/close.svg");
const ACTION_LABEL_KEYS = {
  share: "chatBot.history.share",
  rename: "chatBot.history.rename",
  pin: "chatBot.history.pin",
  unpin: "chatBot.history.unpin",
  delete: "chatBot.history.delete"
};
function HistoryPanel({
  historyPanelData = [],
  onClose,
  onSearchChange,
  onSelectConversation,
  onToggleGroup,
  openGroups,
  onMenuAction
}) {
  const { t } = useTranslation();
  const baseGroups = useMemo(() => {
    if (Array.isArray(historyPanelData)) return historyPanelData;
    return historyPanelData.groups || [];
  }, [historyPanelData]);
  const pinnedItems = useMemo(() => {
    const fromObject = !Array.isArray(historyPanelData) && Array.isArray(historyPanelData.pinned) ? historyPanelData.pinned : [];
    const fromGroups = (baseGroups || []).flatMap(
      (g) => (g.conversation_list || []).filter((it) => !!it.pinned)
    );
    return [...fromObject, ...fromGroups];
  }, [historyPanelData, baseGroups]);
  const groupsData = useMemo(
    () => (baseGroups || []).map((g) => ({
      ...g,
      conversation_list: (g.conversation_list || []).filter((it) => !it.pinned)
    })),
    [baseGroups]
  );
  const [query, setQuery] = useState("");
  const [internalOpen, setInternalOpen] = useState({});
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  useEffect(() => {
    const init = {};
    (groupsData || []).forEach((g) => {
      if (g.group_name) init[g.group_name] = true;
    });
    setInternalOpen((prev) => ({ ...init, ...prev }));
  }, [groupsData]);
  const isControlledGroups = openGroups !== void 0 && openGroups !== null && Object.keys(openGroups).length > 0;
  const groupsState = useMemo(() => {
    if (!isControlledGroups) return internalOpen;
    const merged = {};
    (groupsData || []).forEach((g) => {
      const n = g.group_name;
      if (!n) return;
      merged[n] = openGroups[n] !== void 0 ? openGroups[n] : true;
    });
    return merged;
  }, [isControlledGroups, openGroups, internalOpen, groupsData]);
  const handleSearch = (e) => {
    const value = e.target.value ?? "";
    setQuery(value);
    onSearchChange == null ? void 0 : onSearchChange(value);
  };
  const handleToggle = (name) => {
    const next = !groupsState[name];
    if (openGroups == null) setInternalOpen((prev) => ({ ...prev, [name]: next }));
    onToggleGroup == null ? void 0 : onToggleGroup(name, next);
  };
  const filtered = useMemo(() => {
    if (!query) return groupsData || [];
    const q = query.toLowerCase();
    return (groupsData || []).map((g) => {
      const list = (g.conversation_list || []).filter((c) => {
        var _a, _b;
        const byName = (_a = c.name) == null ? void 0 : _a.toLowerCase().includes(q);
        const byModule = (_b = c.module_name) == null ? void 0 : _b.toLowerCase().includes(q);
        return byName || byModule;
      });
      return { ...g, conversation_list: list };
    }).filter((g) => (g.conversation_list || []).length > 0);
  }, [groupsData, query]);
  const filteredPinned = useMemo(() => {
    if (!pinnedItems || pinnedItems.length === 0) return [];
    if (!query) return pinnedItems;
    const q = query.toLowerCase();
    return pinnedItems.filter((item) => {
      var _a, _b;
      const byName = (_a = item.name) == null ? void 0 : _a.toLowerCase().includes(q);
      const byModule = (_b = item.module_name) == null ? void 0 : _b.toLowerCase().includes(q);
      return byName || byModule;
    });
  }, [pinnedItems, query]);
  const flatItems = useMemo(() => {
    const out = [];
    (filteredPinned || []).forEach((item) => {
      out.push({ groupName: "pinned", item });
    });
    (filtered || []).forEach((g) => {
      if (!groupsState[g.group_name]) return;
      (g.conversation_list || []).forEach((item) => {
        out.push({ groupName: g.group_name, item });
      });
    });
    return out;
  }, [filtered, filteredPinned, groupsState]);
  const currentFocused = flatItems[focusedIndex];
  useEffect(() => {
    const onDocClick = (e) => {
      const target = e.target;
      if (!containerRef.current) return;
      const isInsideMenu = target.closest(".history-item-menu");
      const isOnTrigger = target.closest(".item-menu-trigger");
      if (isInsideMenu || isOnTrigger) return;
      if (openMenuId != null) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [openMenuId]);
  const focusItemAt = (idx) => {
    if (!containerRef.current) return;
    const nodes = containerRef.current.querySelectorAll(".history-item");
    const clamped = Math.max(0, Math.min(idx, nodes.length - 1));
    const el = nodes[clamped];
    if (el) {
      setFocusedIndex(clamped);
      requestAnimationFrame(() => {
        el.focus();
      });
    }
  };
  const handleContainerKeyDown = (e) => {
    if (flatItems.length === 0) return;
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = focusedIndex < 0 ? 0 : Math.min(focusedIndex + 1, flatItems.length - 1);
        focusItemAt(next);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = focusedIndex <= 0 ? 0 : focusedIndex - 1;
        focusItemAt(prev);
        break;
      }
      case "Home":
        e.preventDefault();
        focusItemAt(0);
        break;
      case "End":
        e.preventDefault();
        focusItemAt(flatItems.length - 1);
        break;
      case "Enter":
        if (focusedIndex >= 0 && flatItems[focusedIndex]) {
          e.preventDefault();
          onSelectConversation == null ? void 0 : onSelectConversation(flatItems[focusedIndex].item);
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "history-panel-container", onKeyDown: handleContainerKeyDown, children: [
    /* @__PURE__ */ jsxs("div", { className: "history-panel-header", children: [
      /* @__PURE__ */ jsx("span", { children: t("chatBot.history.title") }),
      /* @__PURE__ */ jsx("img", { alt: t("chatBot.closeAlt"), src: CloseIcon, onClick: onClose })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "history-panel-search", children: /* @__PURE__ */ jsx(
      "input",
      {
        "aria-label": t("chatBot.history.searchAriaLabel"),
        placeholder: t("chatBot.history.searchPlaceholder"),
        type: "text",
        value: query,
        onChange: handleSearch,
        onKeyDown: (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            focusItemAt(0);
          }
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "history-panel-groups", children: [
      filteredPinned.length > 0 && /* @__PURE__ */ jsx("ul", { className: "history-pinned-list", children: filteredPinned.map((item, idx) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: "history-item history-pinned-item",
          role: "button",
          tabIndex: currentFocused && currentFocused.groupName === "pinned" && currentFocused.item === item ? 0 : -1,
          onClick: () => onSelectConversation == null ? void 0 : onSelectConversation(item),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") onSelectConversation == null ? void 0 : onSelectConversation(item);
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "history-item-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "history-item-name", children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "pin-icon", children: "📌" }),
                item.name
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  "aria-expanded": openMenuId === item.conversation_id,
                  "aria-haspopup": "menu",
                  className: "item-menu-trigger" + (openMenuId === item.conversation_id ? " always-visible open" : ""),
                  title: t("chatBot.history.moreActions"),
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    setOpenMenuId(
                      (prev) => prev === item.conversation_id ? null : item.conversation_id ?? null
                    );
                  },
                  children: "⋯"
                }
              )
            ] }),
            openMenuId === item.conversation_id && /* @__PURE__ */ jsx("div", { className: "history-item-menu", role: "menu", children: ["share", "rename", "unpin", "delete"].map((action) => /* @__PURE__ */ jsx(
              "button",
              {
                className: `menu-item ${action === "delete" ? "danger" : ""}`.trim(),
                role: "menuitem",
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  onMenuAction == null ? void 0 : onMenuAction(action, item);
                  setOpenMenuId(null);
                },
                children: t(ACTION_LABEL_KEYS[action] ?? action)
              },
              action
            )) })
          ]
        },
        `pinned-${item.conversation_id}-${idx}`
      )) }),
      filtered.map((group) => {
        const name = group.group_name ?? "";
        const isOpen = !!groupsState[name];
        return /* @__PURE__ */ jsxs("div", { className: "history-group", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              "aria-expanded": isOpen,
              className: "history-group-header",
              type: "button",
              onClick: () => {
                handleToggle(name);
              },
              children: [
                /* @__PURE__ */ jsx("span", { className: "chevron", children: isOpen ? "▾" : "▸" }),
                /* @__PURE__ */ jsx("span", { className: "group-title", children: name })
              ]
            }
          ),
          isOpen && /* @__PURE__ */ jsx("ul", { className: "history-group-list", children: (group.conversation_list || []).map((item, idx) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: "history-item",
              role: "button",
              tabIndex: currentFocused && currentFocused.groupName === name && currentFocused.item === item ? 0 : -1,
              onClick: () => onSelectConversation == null ? void 0 : onSelectConversation(item),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "history-item-row", children: [
                  /* @__PURE__ */ jsx("div", { className: "history-item-name", children: item.name }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      "aria-expanded": openMenuId === item.conversation_id,
                      "aria-haspopup": "menu",
                      className: "item-menu-trigger" + (openMenuId === item.conversation_id ? " always-visible open" : ""),
                      title: t("chatBot.history.moreActions"),
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          (prev) => prev === item.conversation_id ? null : item.conversation_id ?? null
                        );
                      },
                      children: "⋯"
                    }
                  )
                ] }),
                openMenuId === item.conversation_id && /* @__PURE__ */ jsx("div", { className: "history-item-menu", role: "menu", children: ["share", "rename", "pin", "delete"].map((action) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: `menu-item ${action === "delete" ? "danger" : ""}`.trim(),
                    role: "menuitem",
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      onMenuAction == null ? void 0 : onMenuAction(action, item);
                      setOpenMenuId(null);
                    },
                    children: t(ACTION_LABEL_KEYS[action] ?? action)
                  },
                  action
                )) })
              ]
            },
            `${name}-${item.conversation_id}-${idx}`
          )) })
        ] }, name);
      }),
      filtered.length === 0 && /* @__PURE__ */ jsx("div", { className: "history-empty-state", children: t("chatBot.history.noConversations") })
    ] })
  ] });
}
export {
  HistoryPanel
};
