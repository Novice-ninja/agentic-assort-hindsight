import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersStrip } from '@shared/components/vendor/impact-ui';
import type { LoadStatus } from '@shared/types';
import { summarizeFilterStrip, toFilterTags } from '../services/filterStripGroups';
import type { FilterStripGroup } from '../types/filterStrip';
import styles from './HindsightFilterStrip.module.css';

export interface HindsightFilterStripProps {
  /** Resolved groups. This component never fetches or persists — it only renders what it is given. */
  groups: FilterStripGroup[];
  status: LoadStatus;
  /** Decoded plan season, shown ahead of the hierarchy tags and never treated as a hierarchy level. */
  planSeasonName?: string;
  /** Fired by the "All filters" button at the end of the strip. */
  onAllFiltersClick?: () => void;
}

/** Placeholder groups in the loading row, sized to a typical product hierarchy. */
const SKELETON_GROUPS = [0, 1, 2, 3, 4];

/**
 * The "Filters Applied" strip above the Hindsight tabs.
 *
 * Presentational. The vendor `FiltersStrip` owns the layout, the chips, and the `+N` overflow, so
 * the only thing built here is the loading row (matched to the vendor's 48px height so data
 * arriving shifts nothing) and a text summary for assistive technology.
 *
 * That summary is load-bearing, not decoration: the vendor renders the mandatory marker as a bare
 * red `*` with no accessible name, and its `+N` popover is click-only, capped at five values, and
 * unreachable by keyboard. The summary is therefore the only place a screen reader can learn which
 * groups are required and what the hidden values are.
 */
export function HindsightFilterStrip({
  groups,
  status,
  planSeasonName,
  onAllFiltersClick,
}: HindsightFilterStripProps) {
  const { t } = useTranslation('hindsight');
  const season = planSeasonName?.trim() ?? '';
  const visibleGroups = useMemo(
    () => groups.filter((group) => group.values.length > 0),
    [groups],
  );

  const filterTags = useMemo(() => {
    const hierarchy = toFilterTags(visibleGroups);
    if (season.length === 0) return hierarchy;
    return [
      {
        id: 'planSeasonName',
        label: t('filters.season'),
        required: true,
        values: [{ id: season, label: season }],
      },
      ...hierarchy,
    ];
  }, [visibleGroups, season, t]);

  const summary = useMemo(() => {
    const hierarchy = summarizeFilterStrip(visibleGroups, {
      required: t('filters.required'),
      none: t('filters.noneSelected'),
    });
    if (season.length === 0) return hierarchy;
    const seasonSummary = `${t('filters.season')} (${t('filters.required')}): ${season}`;
    return hierarchy.length > 0 ? `${seasonSummary}. ${hierarchy}` : seasonSummary;
  }, [visibleGroups, season, t]);

  if (status === 'loading') {
    return (
      <div className={styles.row} aria-busy="true" data-testid="hindsight-filter-strip">
        <span className={`${styles.bone} ${styles.boneHeading}`} />
        <span className={styles.divider} aria-hidden="true" />
        {SKELETON_GROUPS.map((index) => (
          <div className={styles.group} key={index}>
            <span className={`${styles.bone} ${styles.boneLabel}`} />
            <span className={`${styles.bone} ${styles.boneChip}`} />
            <span className={`${styles.bone} ${styles.boneChip}`} />
          </div>
        ))}
        <span className={styles.visuallyHidden} role="status">
          {t('filters.loadingStrip')}
        </span>
      </div>
    );
  }

  // `status === 'failed'` lands here too: with nothing to show, an empty strip is closer to the
  // truth than an error banner in a 48px row, and the plan's own error surfaces are elsewhere.
  if (visibleGroups.length === 0 && season.length === 0) {
    return (
      <div className={styles.row} data-testid="hindsight-filter-strip">
        <span className={styles.emptyText}>{t('filters.emptyStrip')}</span>
      </div>
    );
  }

  return (
    <div data-testid="hindsight-filter-strip">
      <p className={styles.visuallyHidden}>{summary}</p>
      <FiltersStrip
        filterTags={filterTags}
        hideSelectedFilterBadge
        filterDropDownLabel={t('filters.applied')}
        filterButtonLabel={t('filters.allFilters')}
        filterButtonProps={{ variant: 'tertiary' }}
        filterButtonClick={onAllFiltersClick}
      />
    </div>
  );
}
