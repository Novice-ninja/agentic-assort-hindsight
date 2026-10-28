import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ClusterPlanLandingSection } from '../types';
import styles from './agentFlow.module.css';

const PILL_DOCK_FLAG = 'describePillDock';
const PILL_GAP_PX = 8;

function clearPillDock(pill: HTMLElement): void {
  pill.classList.remove(styles.statusPillDocked);
  delete document.documentElement.dataset[PILL_DOCK_FLAG];
  document.documentElement.style.removeProperty('--describe-pill-reserve');
  document.documentElement.style.removeProperty('--describe-pill-left');
  document.documentElement.style.removeProperty('--describe-pill-bottom');
}

/**
 * The section is completely under the dock, so the pill cannot sit on it.
 * Pin it to the visible band above the footer and the findings banner, and
 * lift the Describe chat by just enough to keep that band clear.
 */
function dockPill(pill: HTMLElement, section: HTMLElement): void {
  const card = section.closest('.dynamic-layout-container');
  const cardLeft = card instanceof HTMLElement ? card.getBoundingClientRect().left : 16;
  const left = Math.max(16, Math.round(cardLeft) + 16);
  const width = pill.offsetWidth || pill.scrollWidth || 160;
  const right = left + width;

  let limitTop = window.innerHeight - 12;
  const obstacles = [
    document.querySelector<HTMLElement>('.dynamic-layout-footer'),
    document.querySelector<HTMLElement>('[data-testid=agent-processing-toast]'),
  ];
  for (const node of obstacles) {
    if (!node) continue;
    const rect = node.getBoundingClientRect();
    const overlapsX = rect.left < right - 4 && rect.right > left + 4;
    if (rect.height >= 8 && rect.width >= 8 && overlapsX) {
      limitTop = Math.min(limitTop, rect.top);
    }
  }

  const bottom = Math.max(12, Math.round(window.innerHeight - limitTop + PILL_GAP_PX));
  const pillHeight = pill.offsetHeight || 30;
  const bannerReserve =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--describe-banner-reserve'),
    ) || 0;
  const reserve = Math.max(0, Math.ceil(bottom + pillHeight + PILL_GAP_PX - bannerReserve));

  document.documentElement.style.setProperty('--describe-pill-left', `${left}px`);
  document.documentElement.style.setProperty('--describe-pill-bottom', `${bottom}px`);
  document.documentElement.style.setProperty('--describe-pill-reserve', `${reserve}px`);
  document.documentElement.dataset[PILL_DOCK_FLAG] = 'true';
  pill.classList.add(styles.statusPillDocked);
  pill.style.left = '';
}

/**
 * Keep the status pill in view. When the chat only covers part of the section,
 * the pill stays on that section, in the slice left of the chat. When the
 * section is fully covered, the pill moves to the open band above the footer.
 */
function fitPillToCopilot(pill: HTMLElement): void {
  const section = pill.parentElement;
  const chat = document.querySelector<HTMLElement>('.chatbot-component-container');
  if (!(section instanceof HTMLElement) || !chat) {
    pill.style.left = '';
    clearPillDock(pill);
    return;
  }

  const sectionBox = section.getBoundingClientRect();
  const chatBox = chat.getBoundingClientRect();
  const coversSection =
    chatBox.width >= 8 &&
    chatBox.left < sectionBox.right - 8 &&
    chatBox.bottom > sectionBox.top &&
    chatBox.top < sectionBox.bottom;
  if (!coversSection) {
    pill.style.left = '';
    clearPillDock(pill);
    return;
  }

  const visibleWidth = Math.min(sectionBox.right, chatBox.left) - sectionBox.left;
  const width = pill.offsetWidth;
  const half = width / 2;
  // `left` is the pill center (`translate(-50%)`). Keep both rounded ends
  // inside the section and left of the chat. A center of 0 hangs the left
  // cap outside the step, and overflow:hidden squares that corner off.
  const minCenter = half;
  const maxCenter = chatBox.left - sectionBox.left - half - PILL_GAP_PX;
  if (visibleWidth < width + PILL_GAP_PX || maxCenter < minCenter) {
    dockPill(pill, section);
    return;
  }
  clearPillDock(pill);
  pill.style.left = `${Math.max(minCenter, Math.min(visibleWidth / 2, maxCenter))}px`;
}

/**
 * Sections with their own processing copy. Every other highlighted section
 * falls back to "Waiting for response".
 */
const SECTION_STATUS_KEYS: Partial<Record<ClusterPlanLandingSection, string>> = {
  attributes: 'describe.gatheringAttributes',
};

export interface AgentSectionStatusProps {
  /** Highlighted section. Omitted sections use the default waiting message. */
  section?: ClusterPlanLandingSection;
}

/** Floating status pill on the section the agent is filling. */
export function AgentSectionStatus({ section }: AgentSectionStatusProps) {
  const { t } = useTranslation('clustering');
  const configured = section ? SECTION_STATUS_KEYS[section] : undefined;
  const pillRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill || typeof ResizeObserver === 'undefined') return;

    const fit = () => fitPillToCopilot(pill);
    const fitAfterLayout = () => {
      fit();
      requestAnimationFrame(() => requestAnimationFrame(fit));
    };
    const sizeObserver = new ResizeObserver(fit);
    const presentationObserver = new MutationObserver(fitAfterLayout);
    const stackObserver = new MutationObserver(fitAfterLayout);
    let observed: Element | null = null;
    let presentation: Element | null = null;

    // Docked width changes do not always emit a resize, and minimize can swap the node.
    const watchChat = () => {
      const chat = document.querySelector('.chatbot-component-container');
      const host = document.querySelector('[data-copilot-presentation]');
      if (chat === observed && host === presentation) return;

      if (chat !== observed) {
        sizeObserver.disconnect();
        observed = chat;
        if (chat) sizeObserver.observe(chat);
      }
      if (host !== presentation) {
        presentationObserver.disconnect();
        presentation = host;
        if (host) {
          presentationObserver.observe(host, {
            attributes: true,
            attributeFilter: ['data-copilot-presentation'],
          });
        }
      }
      fit();
    };

    const mutations = new MutationObserver(watchChat);
    watchChat();
    mutations.observe(document.body, { childList: true, subtree: true });
    stackObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-describe-banner-stack'],
    });
    window.addEventListener('resize', fit);
    return () => {
      sizeObserver.disconnect();
      presentationObserver.disconnect();
      stackObserver.disconnect();
      mutations.disconnect();
      window.removeEventListener('resize', fit);
      pill.style.left = '';
      clearPillDock(pill);
    };
  }, []);

  return (
    <p
      ref={pillRef}
      className={styles.statusPill}
      role="status"
      data-testid="agent-section-status"
    >
      {t(configured ?? 'describe.waitingForResponse')}
    </p>
  );
}
