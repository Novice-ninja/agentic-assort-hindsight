import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ContributionCarousel.module.css';

const GAP = 16;

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.3461 4.15668C10.1272 3.94778 9.77415 3.94778 9.55518 4.15668L5.84165 7.69944C5.66737 7.86571 5.66737 8.13429 5.84165 8.30056L9.55518 11.8433C9.77415 12.0522 10.1272 12.0522 10.3461 11.8433C10.5651 11.6344 10.5651 11.2976 10.3461 11.0887L7.11077 7.99787L10.3506 4.90701C10.5651 4.70237 10.5651 4.36131 10.3461 4.15668Z"
      fill="#4259EE"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.72097 11.8419C5.61011 11.7365 5.55469 11.6117 5.55469 11.4675C5.55469 11.3236 5.61011 11.1989 5.72097 11.0935L8.96901 8.00527L5.70988 4.90646C5.60642 4.80808 5.55469 4.68511 5.55469 4.53755C5.55469 4.38999 5.61011 4.2635 5.72097 4.1581C5.83182 4.0527 5.96308 4 6.11472 4C6.26608 4 6.39718 4.0527 6.50804 4.1581L10.2327 7.71015C10.2771 7.75231 10.3086 7.79798 10.3272 7.84717C10.3455 7.89635 10.3547 7.94906 10.3547 8.00527C10.3547 8.06148 10.3455 8.11419 10.3272 8.16337C10.3086 8.21256 10.2771 8.25823 10.2327 8.30039L6.49695 11.8524C6.39349 11.9508 6.26608 12 6.11472 12C5.96307 12 5.83182 11.9473 5.72097 11.8419Z"
      fill="#4259EE"
    />
  </svg>
);

export interface ContributionCarouselProps {
  children: ReactNode;
  cardCount: number;
}

export function ContributionCarousel({ children, cardCount }: ContributionCarouselProps) {
  const { t } = useTranslation('hindsight');
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const threshold = 2;
    const nextLeft = el.scrollLeft > threshold;
    const nextRight = el.scrollLeft + el.clientWidth < el.scrollWidth - threshold;
    setCanScrollLeft((prev) => (prev === nextLeft ? prev : nextLeft));
    setCanScrollRight((prev) => (prev === nextRight ? prev : nextRight));
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [updateScrollState, cardCount]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState]);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    const step = firstChild ? firstChild.offsetWidth + GAP : el.clientWidth / 2;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  }, []);

  const showButtons = canScrollLeft || canScrollRight;

  const carouselClasses = [
    styles.carousel,
    canScrollLeft && styles.hasScrollLeft,
    canScrollRight && styles.hasScrollRight,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={carouselClasses} data-testid="hindsight-contribution-carousel">
      <div ref={trackRef} className={styles.track} onScroll={updateScrollState}>
        {children}
      </div>

      {showButtons && (
        <>
          <button
            type="button"
            aria-label={t('contribution.scrollLeft', 'Scroll left')}
            onClick={() => scrollBy(-1)}
            className={[styles.navBtn, styles.navBtnLeft, !canScrollLeft && styles.hidden]
              .filter(Boolean)
              .join(' ')}
            data-testid="hindsight-contribution-prev"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label={t('contribution.scrollRight', 'Scroll right')}
            onClick={() => scrollBy(1)}
            className={[styles.navBtn, styles.navBtnRight, !canScrollRight && styles.hidden]
              .filter(Boolean)
              .join(' ')}
            data-testid="hindsight-contribution-next"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  );
}
