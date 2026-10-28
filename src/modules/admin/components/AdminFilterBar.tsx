import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import { Button } from '@shared/components';
import { countFilterChips } from '../services/adminMappers';
import { resolveFacetLabel } from '../services/filterCascade';
import type { AdminFilterContext, FilterFacetOption } from '../types';
import styles from './AdminFilterBar.module.css';

export interface AdminFilterBarProps {
  filterContext: AdminFilterContext;
  facets: FilterFacetOption[];
  collapsed?: boolean;
  onOpenAllFilters: () => void;
  onToggleChip?: (facet: 'departments' | 'seasons' | 'regions', id: string) => void;
}

function FunnelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 5h16l-6.2 7v5.2L10.2 19v-7L4 5z" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={[styles.chevron, expanded && styles.chevronExpanded].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminFilterBar({
  filterContext,
  facets,
  collapsed = false,
  onOpenAllFilters,
  onToggleChip,
}: AdminFilterBarProps) {
  const { t } = useTranslation('admin');
  const [expanded, setExpanded] = useState(true);

  const count = countFilterChips(filterContext);

  const groups = useMemo(
    () => [
      {
        key: 'departments' as const,
        label: t('filters.groups.department'),
        ids: filterContext.departments,
      },
      {
        key: 'seasons' as const,
        label: t('filters.groups.season'),
        ids: filterContext.seasons,
      },
      {
        key: 'regions' as const,
        label: t('filters.groups.region'),
        ids: filterContext.regions,
      },
    ],
    [filterContext, t],
  );

  if (collapsed) return null;

  return (
    <section className={styles.wrap} aria-label={t('filters.barLabel')}>
      <div className={styles.bar}>
        <div className={styles.meta}>
          <span className={styles.metaLabel}>{t('filters.applied')}</span>
          <span className={styles.countBadge}>{count}</span>
          <button
            type="button"
            className={[styles.chevronBtn, focusRingClass].join(' ')}
            aria-expanded={expanded}
            aria-label={t('filters.barLabel')}
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronIcon expanded={expanded} />
          </button>
        </div>

        {expanded && (
          <div className={styles.groups}>
            {groups.map((group) =>
              group.ids.length > 0 ? (
                <Fragment key={group.key}>
                  <span className={styles.separator} aria-hidden />
                  <div className={styles.group}>
                    <span className={styles.groupLabel}>{group.label} :</span>
                    <div className={styles.chips}>
                      {group.ids.map((id) => (
                        <span key={`${group.key}-${id}`} className={styles.chip}>
                          {resolveFacetLabel(facets, id, t)}
                          {onToggleChip && (
                            <button
                              type="button"
                              className={[styles.chipRemove, focusRingClass].join(' ')}
                              aria-label={`Remove ${resolveFacetLabel(facets, id, t)}`}
                              onClick={() => onToggleChip(group.key, id)}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ) : null,
            )}
          </div>
        )}

        <Button
          variant="secondary"
          size="small"
          className={styles.allFiltersBtn}
          onClick={onOpenAllFilters}
        >
          <FunnelIcon />
          {t('filters.allFilters')}
        </Button>
      </div>
    </section>
  );
}
