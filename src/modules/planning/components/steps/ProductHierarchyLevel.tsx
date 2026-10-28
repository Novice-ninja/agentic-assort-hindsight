import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccordionModern,
  Button,
  ImpactCheckbox as Checkbox,
  ImpactInput as Input,
  Tag,
  ImpactTooltip as Tooltip,
} from '@shared/components/vendor/impact-ui';
import { useDebounce } from '@shared/hooks';
import { FILTER_SEARCH_DEBOUNCE_MS } from '../../types';
import { selectionSummary } from '../../services';
import type { ProductHierarchyNode } from '../../types';
import searchIcon from '@assets/icons/planning/search.svg';
import gridViewIcon from '@assets/icons/planning/grid-view.svg';
import listViewIcon from '@assets/icons/planning/list-view.svg';
import sortIcon from '@assets/icons/planning/sort.svg';
import noImageIcon from '@assets/icons/planning/no-image.svg';
import styles from './wizardSteps.module.css';

export interface ProductHierarchyLevelProps {
  title: string;
  /** Stable id for automation, typically the hierarchy `levelNo`. */
  levelId?: string;
  nodes: ProductHierarchyNode[];
  selectedIds: string[];
  /** True when universe Select All is active with no exceptions — header shows "All selected". */
  allSelected?: boolean;
  /** Committed Option B search needles — header shows "Matching …" instead of listing ids. */
  matchingNeedles?: string[];
  /** Committed Option B except_search needles — header shows "Except matching …". */
  exceptMatchingNeedles?: string[];
  enabled: boolean;
  onToggle: (id: string) => void;
  /** Dismiss a single-choice hierarchy section immediately after its option is chosen. */
  closeOnSelect?: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  /** SKU level renders the skuCode as primary label. */
  showCode?: boolean;
  /** Show grid/list view toggle (Sub Class + SKU). */
  showViewToggle?: boolean;
  /** Show sort button (SKU). */
  showSortButton?: boolean;
  /** 'radio' for single-select (Department), 'checkbox' for multi (Class/SubClass/SKU). */
  mode?: 'radio' | 'checkbox';
  /** Start expanded. Only Department should default to true. */
  defaultExpanded?: boolean;
  /** Called when the accordion transitions from collapsed to expanded. */
  onExpand?: () => void;
  /** When true, force the accordion closed (e.g. parent selection changed). */
  forceCollapsed?: boolean;
  /** When true, show skeleton cards instead of the real content. */
  loading?: boolean;
  /** Required level — shows an asterisk on the title. */
  mandatory?: boolean;
  /** Per-level fetch failure; shows retry when set. */
  error?: boolean;
  onRetry?: () => void;
  /** Hint when the level is locked behind an unselected parent. */
  disabledHint?: string;
  /** Server-side search callback (debounced by the component). */
  onSearch?: (query: string) => void;
  /** True when more pages are available on the server. */
  hasMore?: boolean;
  /** True while a "show more" append request is in flight. */
  loadingMore?: boolean;
  /** True while a server-side search replace is in flight. */
  searching?: boolean;
  /** Called when the infinite-scroll sentinel becomes visible. */
  onShowMore?: () => void;
}

const ACCORDION_VALUE = 'level';
const NAME_TOOLTIP_THRESHOLD = 16;

function HierarchyOptionName({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  const label = <span className={className}>{name}</span>;
  if (name.length <= NAME_TOOLTIP_THRESHOLD) return label;
  return (
    <Tooltip title={name} variant="tertiary">
      {label}
    </Tooltip>
  );
}

function SkeletonProductGrid() {
  return (
    <div className={styles.skeletonProductGrid} data-testid="product-skeleton" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={styles.skeletonProductCard}>
          <div className={styles.skeletonProductContent}>
            <div className={[styles.skeletonBone, styles.skeletonProductImage].join(' ')} />
            <div className={[styles.skeletonBone, styles.skeletonProductName].join(' ')} />
          </div>
          <div className={[styles.skeletonBone, styles.skeletonProductCheck].join(' ')} />
        </div>
      ))}
    </div>
  );
}

export function ProductHierarchyLevel({
  title,
  levelId,
  nodes,
  selectedIds,
  allSelected = false,
  matchingNeedles = [],
  exceptMatchingNeedles = [],
  enabled,
  onToggle,
  closeOnSelect = false,
  onSelectAll,
  onClear,
  showCode = false,
  showViewToggle = false,
  showSortButton = false,
  mode = 'checkbox',
  defaultExpanded = false,
  onExpand,
  forceCollapsed,
  loading = false,
  mandatory = false,
  error = false,
  onRetry,
  disabledHint,
  onSearch,
  hasMore = false,
  loadingMore = false,
  searching = false,
  onShowMore,
}: ProductHierarchyLevelProps) {
  const { t } = useTranslation('planning');
  const [expanded, setExpanded] = useState<string>(
    defaultExpanded ? ACCORDION_VALUE : '',
  );
  const [query, setQuery] = useState('');
  const [listView, setListView] = useState(false);
  const selectNode = useCallback((id: string) => { onToggle(id); if(closeOnSelect)setExpanded(''); },[onToggle,closeOnSelect]);

  const debouncedQuery = useDebounce(query, FILTER_SEARCH_DEBOUNCE_MS);
  const mountedRef = useRef(false);
  const lastEmittedSearch = useRef<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  /** Search replace keeps the toolbar; only the option grid shows a skeleton. */
  const showOptionsSkeleton = searching;

  useEffect(() => {
    const next = debouncedQuery.trim();
    if (!mountedRef.current) {
      mountedRef.current = true;
      lastEmittedSearch.current = next;
      return;
    }
    if (lastEmittedSearch.current === next) return;
    lastEmittedSearch.current = next;
    onSearch?.(next);
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || !onShowMore || loadingMore || searching) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onShowMore();
      },
      { root: null, rootMargin: '80px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onShowMore, loadingMore, searching, nodes.length]);

  const prevForceCollapsed = useRef(forceCollapsed);
  useEffect(() => {
    if (forceCollapsed && !prevForceCollapsed.current) {
      setExpanded('');
      setQuery('');
    }
    prevForceCollapsed.current = forceCollapsed;
  }, [forceCollapsed]);

  const filtered = useMemo(
    () =>
      query
        ? nodes.filter(
            (n) =>
              n.label.toLowerCase().includes(query.toLowerCase()) ||
              n.skuCode?.toLowerCase().includes(query.toLowerCase()),
          )
        : nodes,
    [nodes, query],
  );

  const preview = selectionSummary(nodes, selectedIds, 6);
  const hasMatchingSelection = matchingNeedles.length > 0;
  const hasExceptMatching = exceptMatchingNeedles.length > 0;
  const hasNeedleSummary = hasMatchingSelection || hasExceptMatching;
  const previewText = !enabled
    ? (disabledHint ?? t('scope.notSelected'))
    : allSelected
      ? t('scope.allSelected')
      : hasMatchingSelection && hasExceptMatching
        ? t('scope.matchingAndExceptSelected', {
            matching: matchingNeedles.join(', '),
            except: exceptMatchingNeedles.join(', '),
          })
        : hasMatchingSelection
          ? t('scope.matchingSelected', { needles: matchingNeedles.join(', ') })
          : hasExceptMatching
            ? t('scope.exceptMatchingSelected', {
                needles: exceptMatchingNeedles.join(', '),
              })
            : selectedIds.length === 0
              ? t('scope.noneSelected')
              : preview.names.join(', ');

  const handleSetExpanded = useCallback(
    (val: string | string[]) => {
      if (typeof val === 'string') {
        setExpanded(val);
        if (val === ACCORDION_VALUE && onExpand) onExpand();
      }
    },
    [onExpand],
  );

  const searchLeftIcon = (
    <img src={searchIcon} alt="" aria-hidden="true" className={styles.iconSm} />
  );
  const sortingIcon = (
    <img src={sortIcon} alt="" aria-hidden="true" className={styles.iconSm} />
  );

  const toggleIcon = (
    <img
      src={listView ? gridViewIcon : listViewIcon}
      alt=""
      className={styles.iconSm}
      aria-hidden="true"
    />
  );

  const previewTooltip =
    hasNeedleSummary || allSelected
      ? previewText
      : `${previewText}${preview.overflow > 0 ? ` (+${preview.overflow})` : ''}`;

  const accordionHeader = (
    <div
      className={styles.accordionHeader}
      role="button"
      tabIndex={enabled ? 0 : -1}
      aria-label={`${title} options`}
      aria-expanded={expanded === ACCORDION_VALUE}
      aria-disabled={!enabled}
      onClick={(event) => {
        event.stopPropagation();
        if (enabled) handleSetExpanded(expanded === ACCORDION_VALUE ? '' : ACCORDION_VALUE);
      }}
      onKeyDown={(event) => {
        if (enabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          handleSetExpanded(expanded === ACCORDION_VALUE ? '' : ACCORDION_VALUE);
        }
      }}
    >
      <span className={styles.accordionLevelTitle}>
        {title}
        {mandatory ? (
          <span className={styles.mandatoryMark} aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      <div className={styles.accordionHeaderRight}>
        <Tooltip title={previewTooltip} variant="tertiary" orientation="top-end">
          <span className={styles.previewText}>{previewText}</span>
        </Tooltip>
        {enabled && !allSelected && !hasNeedleSummary && preview.overflow > 0 && (
          <Tag
            label={t('scope.overflowCount', { count: preview.overflow })}
            variant="solid"
            size="small"
          />
        )}
      </div>
    </div>
  );

  const skeletonContent = (
    <div className={styles.accordionContentInner}>
      <SkeletonProductGrid />
    </div>
  );

  const accordionContent = loading ? (
    skeletonContent
  ) : error ? (
    <div className={styles.accordionContentInner}>
      <p className={styles.emptyStateText} role="alert">
        {t('scope.levelLoadError')}
      </p>
      {onRetry ? (
        <Button
          variant="url"
          size="large"
          onClick={onRetry}
          data-testid={`create-plan-hierarchy-retry-${levelId ?? title}`}
        >
          {t('scope.retry')}
        </Button>
      ) : null}
    </div>
  ) : (
    <div className={styles.accordionContentInner} aria-busy={showOptionsSkeleton || undefined}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('scope.searchPlaceholder')}
            leftIcon={searchLeftIcon}
            size="large"
            isHelperText={false}
            aria-label={t('scope.searchLabel', { level: title })}
            data-testid={`create-plan-hierarchy-search-${levelId ?? title}`}
          />
          {showViewToggle && (
            <Tooltip title={listView ? 'Grid view' : 'List view'} variant="tertiary">
              <Button
                variant="tertiary"
                size="large"
                icon={toggleIcon}
                onClick={() => setListView((v) => !v)}
                data-testid={`create-plan-hierarchy-view-toggle-${levelId ?? title}`}
              />
            </Tooltip>
          )}
          {showSortButton && (
            <Tooltip title="Sort" variant="tertiary">
              <Button
                variant="tertiary"
                size="large"
                icon={sortingIcon}
                onClick={() => {}}
                data-testid={`create-plan-hierarchy-sort-${levelId ?? title}`}
              />
            </Tooltip>
          )}
        </div>
        {mode === 'checkbox' && (
          <div className={styles.toolbarActions}>
            <Button
              variant="url"
              size="large"
              disabled={
                showOptionsSkeleton ||
                (filtered.length === 0 && !allSelected && !query.trim())
              }
              onClick={() => { onSelectAll(); if(closeOnSelect)setExpanded(''); }}
              aria-label={
                query.trim()
                  ? t('scope.selectAllMatchingAccessible', { level: title })
                  : t('scope.selectAllAccessible', { level: title })
              }
            >
              {t('scope.selectAll')}
            </Button>
            <Button
              variant="url"
              size="large"
              disabled={
                (selectedIds.length === 0 &&
                  !allSelected &&
                  !hasNeedleSummary) ||
                showOptionsSkeleton
              }
              onClick={onClear}
              data-testid={`create-plan-hierarchy-clear-${levelId ?? title}`}
            >
              {t('scope.clear')}
            </Button>
          </div>
        )}
      </div>
      {showOptionsSkeleton ? (
        <SkeletonProductGrid />
      ) : filtered.length === 0 ? (
        <p className={styles.emptyStateText}>{t('scope.noOptions')}</p>
      ) : listView ? (
        <div className={styles.listGrid}>
          {filtered.map((node) => {
            const isSelected = selectedIds.includes(node.id);
            const primaryLabel = showCode && node.skuCode ? node.skuCode : node.label;
            return (
              <div
                key={node.id}
                className={styles.listItem}
                data-testid={`create-plan-product-${node.id}`}
                onClick={() => selectNode(node.id)}
                role={mode === 'radio' ? 'radio' : 'checkbox'}
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    selectNode(node.id);
                  }
                }}
              >
                <div className={styles.listItemCheck}>
                  {mode === 'radio' ? (
                    <div
                      className={[styles.radioCircle, isSelected && styles.checked]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  ) : (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => selectNode(node.id)}
                      withoutFormLabel
                    />
                  )}
                </div>
                {node.imageUrl ? (
                  <img
                    src={node.imageUrl}
                    alt=""
                    className={styles.listItemImage}
                    aria-hidden="true"
                  />
                ) : (
                  <div className={styles.listItemImage} aria-hidden="true">
                    <img src={noImageIcon} alt="" className={styles.noImageIcon} />
                  </div>
                )}
                <HierarchyOptionName name={primaryLabel} className={styles.listItemName} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.productCardGrid}>
          {filtered.map((node) => {
            const isSelected = selectedIds.includes(node.id);
            const primaryLabel = showCode && node.skuCode ? node.skuCode : node.label;
            const secondaryLabel =
              showCode && node.skuCode
                ? node.label
                : node.styleCount !== undefined
                  ? t('scope.styles', { count: node.styleCount })
                  : null;
            return (
              <div
                key={node.id}
                className={[styles.productCard, isSelected && styles.productCardSelected]
                  .filter(Boolean)
                  .join(' ')}
                data-testid={`create-plan-product-${node.id}`}
                onClick={() => selectNode(node.id)}
                role={mode === 'radio' ? 'radio' : 'checkbox'}
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    selectNode(node.id);
                  }
                }}
              >
                <div className={styles.productCardContent}>
                  {node.imageUrl ? (
                    <img
                      src={node.imageUrl}
                      alt=""
                      className={styles.productImage}
                      aria-hidden="true"
                    />
                  ) : (
                    <div className={styles.productImage} aria-hidden="true">
                      <img src={noImageIcon} alt="" className={styles.noImageIcon} />
                    </div>
                  )}
                  <div className={styles.productInfo}>
                    <HierarchyOptionName name={primaryLabel} className={styles.productName} />
                    {secondaryLabel !== null ? (
                      <HierarchyOptionName
                        name={secondaryLabel}
                        className={styles.productStyleCount}
                      />
                    ) : null}
                  </div>
                </div>
                <div className={styles.productCardCheck}>
                  {mode === 'radio' ? (
                    <div
                      className={[styles.radioCircle, isSelected && styles.checked]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  ) : (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => selectNode(node.id)}
                      withoutFormLabel
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {loadingMore ? (
        <>
          <SkeletonProductGrid />
          <span className="sr-only" role="status">
            {t('scope.loadingMore')}
          </span>
        </>
      ) : null}
      {hasMore && onShowMore && !showOptionsSkeleton && !loadingMore ? (
        <div
          ref={sentinelRef}
          className={styles.loadMoreSentinel}
          data-testid="load-more-sentinel"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  const accordionData = [
    {
      id: ACCORDION_VALUE,
      value: ACCORDION_VALUE,
      header: accordionHeader,
      content: accordionContent,
      disabled: !enabled,
    },
  ];

  return (
    <div data-testid={`create-plan-hierarchy-level-${levelId ?? title}`}>
      <AccordionModern
        data={accordionData}
        expanded={expanded}
        setExpanded={handleSetExpanded}
      />
    </div>
  );
}
