import { useTranslation } from 'react-i18next';
import { Dropdown, type DropdownOption } from '@shared/components';
import { NO_COMPARISON } from '../../services/metricCatalog';
import { isSupportedChoice } from '../../services/recommendationOverridePayload';
import styles from './RecommendationControl.module.css';

export interface RecommendationControlProps {
  /**
   * The article id, which is the only identifier the override endpoint accepts. A row without one
   * cannot be saved, so it renders read-only rather than offering a control that would fail.
   */
  article?: string;
  /** The recommendation in effect, which after a save is the backend's `effectiveReco`. */
  value: string;
  /** Options as the backend sent them. Unsupported choices (e.g. Grow/Reduce) are hidden. */
  options: readonly DropdownOption[];
  editable: boolean;
  overridden: boolean;
  /** True while this article's own write is in flight. Other articles stay interactive. */
  pending: boolean;
  /** Accessible name for the control, e.g. "Recommendation for MD005". */
  label: string;
  className?: string;
  onChange: (article: string, value: string) => void;
  withPortal?: boolean;
  portalContainer?: HTMLElement;
  dropDownPortalClassName?: string;
  minWidth?: string;
}

/**
 * The recommendation control, shared by the table's rows and both faces of a card.
 *
 * One component for all three surfaces is what makes them one item: they read the same value from
 * the same place and send the same change, so a choice made on a card's back face is already what
 * its front and its table row show.
 *
 * Only choices the override endpoint has a bucket for are offered. Grow/Reduce stay hidden until
 * the contract gains matching arrays — selecting them would be a write that cannot succeed.
 */
export function RecommendationControl({
  article,
  value,
  options,
  editable,
  overridden,
  pending,
  label,
  className,
  onChange,
  withPortal = false,
  portalContainer,
  dropDownPortalClassName,
  minWidth: minWidthProp,
}: RecommendationControlProps) {
  const { t } = useTranslation('hindsight');

  const choosable = options.filter((option) => isSupportedChoice(option.value));

  if (value.length === 0 && options.length === 0) {
    return <span className={styles.absent}>{NO_COMPARISON}</span>;
  }

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? (value || NO_COMPARISON);

  // No article, no supported options, or overrides off: show the current label rather than a
  // control that cannot save. An unsupported current value (legacy Grow/Reduce) is also read-only.
  if (
    !editable ||
    article === undefined ||
    article.length === 0 ||
    choosable.length === 0 ||
    !isSupportedChoice(value)
  ) {
    return (
      <span
        className={[styles.readOnly, className].filter(Boolean).join(' ')}
        data-testid="hindsight-recommendation-readonly"
      >
        {selectedLabel}
      </span>
    );
  }

  return (
    <span
      className={styles.wrap}
      aria-busy={pending || undefined}
      data-no-flip
      data-testid="hindsight-recommendation-control"
    >
      <Dropdown
        aria-label={label}
        data-testid="hindsight-recommendation-dropdown"
        options={choosable.map((option) => ({ ...option }))}
        value={[value]}
        onChange={(selected) => {
          const [next] = selected;
          if (next !== undefined && next !== value) onChange(article, next);
        }}
        disabled={pending}
        isLoading={pending}
        isClearable={false}
        className={[styles.select, className].filter(Boolean).join(' ')}
        minWidth={minWidthProp ?? '80px'}
        withPortal={withPortal}
        portalContainer={portalContainer}
        dropDownPortalClassName={dropDownPortalClassName}
      />
      {/* Announced rather than only spun: a disabled control with no explanation reads as broken. */}
      {pending && (
        <span role="status" className={styles.visuallyHidden}>
          {t('items.recommendation.saving')}
        </span>
      )}
      {overridden && !pending && (
        <>
          <span
            className={styles.overriddenDot}
            title={t('items.overridden')}
            aria-hidden="true"
          />
          <span className={styles.visuallyHidden}>{t('items.overridden')}</span>
        </>
      )}
    </span>
  );
}
