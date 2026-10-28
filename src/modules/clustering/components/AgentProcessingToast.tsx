import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './agentFlow.module.css';

export interface AgentProcessingToastProps {
  onDismiss: () => void;
}

const BANNER_CAP_PX = 640;
const STACK_FLAG = 'describeBannerStack';

function clearBannerStack(banner: HTMLElement): void {
  banner.classList.remove(styles.toastStacked);
  delete document.documentElement.dataset[STACK_FLAG];
  document.documentElement.style.removeProperty('--describe-banner-reserve');
  document.documentElement.style.removeProperty('--describe-banner-left');
}

/** Width of the banner when its sentence stays on one line. */
function oneLineWidth(banner: HTMLElement): number {
  const text = banner.querySelector('p');
  if (!(text instanceof HTMLElement)) return banner.scrollWidth;
  const previous = text.style.whiteSpace;
  text.style.whiteSpace = 'nowrap';
  const width = banner.scrollWidth;
  text.style.whiteSpace = previous;
  return width;
}

/**
 * Pin the banner along the bottom of the content card and lift the chat by the
 * banner's height. Used when the chat covers the footer and no readable gap
 * remains beside it.
 */
function stackBanner(banner: HTMLElement): void {
  banner.classList.add(styles.toastStacked);
  banner.style.maxWidth = '';
  const card = banner.closest('.dynamic-layout-container');
  const left = card ? Math.round(card.getBoundingClientRect().left) + 16 : 16;
  document.documentElement.style.setProperty('--describe-banner-left', `${left}px`);
  document.documentElement.dataset[STACK_FLAG] = 'true';
  const reserve = banner.offsetHeight + 24;
  document.documentElement.style.setProperty('--describe-banner-reserve', `${reserve}px`);
}

/**
 * Keep the findings banner clear of Cluster Copilot. When a readable gap remains
 * beside the chat, the banner stays above the footer and wraps to fit. When the
 * chat covers that gap, the banner moves to the bottom of the content column.
 */
function fitBannerToCopilot(banner: HTMLElement): void {
  const chat = document.querySelector<HTMLElement>('.chatbot-component-container');
  const host = banner.closest('.dynamic-layout-footer');
  if (!chat || !(host instanceof HTMLElement)) {
    banner.style.maxWidth = '';
    clearBannerStack(banner);
    return;
  }

  const chatBox = chat.getBoundingClientRect();
  const hostBox = host.getBoundingClientRect();
  if (chatBox.width < 8 || chatBox.height < 8) {
    banner.style.maxWidth = '';
    clearBannerStack(banner);
    return;
  }

  const besideFooter =
    chatBox.bottom > hostBox.top - 72 && chatBox.top < hostBox.bottom + 120;
  if (!besideFooter || chatBox.left >= hostBox.right - 8) {
    banner.style.maxWidth = '';
    clearBannerStack(banner);
    return;
  }

  const available = Math.floor(chatBox.left - hostBox.left - 12);
  banner.classList.remove(styles.toastStacked);
  banner.style.maxWidth = '';
  const preferred = oneLineWidth(banner);
  if (available >= preferred) {
    clearBannerStack(banner);
    return;
  }
  if (available >= Math.ceil(preferred / 2)) {
    clearBannerStack(banner);
    banner.style.maxWidth = `${Math.min(BANNER_CAP_PX, available)}px`;
    return;
  }
  stackBanner(banner);
}

/**
 * Footer notice shown while the clustering agent works on a described plan
 * (Figma I7672:284301;3331:226773). Sits in the wizard footer's start slot.
 */
export function AgentProcessingToast({ onDismiss }: AgentProcessingToastProps) {
  const { t } = useTranslation('clustering');
  const bannerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const banner = bannerRef.current;
    if (!banner || typeof ResizeObserver === 'undefined') return;

    const fit = () => fitBannerToCopilot(banner);
    fit();

    const chat = document.querySelector('.chatbot-component-container');
    const observer = new ResizeObserver(fit);
    if (chat) observer.observe(chat);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
      banner.style.maxWidth = '';
      clearBannerStack(banner);
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      className={styles.toast}
      role="status"
      data-testid="agent-processing-toast"
    >
      <div className={styles.toastBody}>
        <svg
          className={styles.toastIcon}
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M9 18a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-13.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM9 8.1a.9.9 0 0 0-.9.9v3.6a.9.9 0 1 0 1.8 0V9a.9.9 0 0 0-.9-.9Z"
          />
        </svg>
        <p className={styles.toastText}>{t('describe.processingToast')}</p>
      </div>
      <button
        type="button"
        className={styles.toastClose}
        aria-label={t('describe.processingToastDismiss')}
        onClick={onDismiss}
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path
            d="M5.5 5.5l9 9m0-9l-9 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
