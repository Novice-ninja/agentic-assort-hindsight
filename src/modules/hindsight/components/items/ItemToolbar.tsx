import { useCallback, useEffect, useState, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { RECOMMENDATION_FILTER_KEY, useControlFilter } from '@modules/appConfig';
import type { ControlFilter } from '@modules/appConfig';
import { Dropdown } from '@shared/components';
import {
  Button,
  ButtonGroup,
  ImpactTooltip as Tooltip,
} from '@shared/components/vendor/impact-ui';
import type { ItemViewMode } from '../../types';
import styles from './ItemToolbar.module.css';

/** The Recommendation filter dropdown in the toolbar is hidden for now; flip to bring it back. */
const SHOW_RECOMMENDATION_FILTER = false;

const VIEW_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'visual', label: 'Visuals View' },
  { value: 'table', label: 'Table View' },
];

/** Fallback scope when no external filter is provided. */
const DEFAULT_SCOPE = {
  module: 'hindsight',
  view: 'byItem',
  component: 'itemCardGrid',
} as const;

export interface HierarchyLevelOption {
  value: string;
  label: string;
}

export interface ItemToolbarProps {
  viewMode: ItemViewMode;
  onViewMode: (m: ItemViewMode) => void;
  overridesEnabled: boolean;
  onOverridesEnabled: (on: boolean) => void;
  includeLastYear: boolean;
  onIncludeLastYear: (on: boolean) => void;
  /** Page-owned recommendation filter. When supplied the toolbar is fully controlled. */
  recommendationFilter?: ControlFilter;
  /**
   * Hierarchy levels offered in table view (`l0_name` …). When omitted the Hierarchy dropdown
   * is hidden.
   */
  hierarchyOptions?: readonly HierarchyLevelOption[];
  /** Selected hierarchy level keys that drive Product Hierarchy grouping. */
  hierarchyLevels?: readonly string[];
  onHierarchyLevels?: (levels: string[]) => void;
  /** Expands every Product Hierarchy group (table view, when grouping is on). */
  onExpandAllGroups?: () => void;
  /** Collapses every Product Hierarchy group (table view, when grouping is on). */
  onCollapseAllGroups?: () => void;
  /** Opens Filter Settings for table hierarchy filters. */
  onOpenFilters?: () => void;
  /** True when Filter Settings is open (styles the funnel control as pressed). */
  filtersOpen?: boolean;
  onDownload?: () => void;
  downloadDisabled?: boolean;
  downloadLoading?: boolean;
  /** Names the loaded export population instead of implying an unbounded server export. */
  downloadLabel?: string;
  /** Opens the table column chooser (table view only). */
  onMore?: () => void;
  /** Whether per-column floating search inputs are visible on the table. */
  columnFiltersVisible?: boolean;
  /** Toggle per-column floating search inputs (table view only). */
  onColumnFiltersVisible?: (visible: boolean) => void;
  /** Opens the bulk recommendation editor for the current selection. */
  onBulkEdit?: () => void;
  /** Anchor for the bulk-edit popover. Set while the Bulk Edit button is mounted. */
  bulkEditAnchorRef?: Ref<HTMLSpanElement>;
  /**
   * True when at least one card/row is checked. Swaps the default filter/actions chrome for
   * Bulk Edit (and the reverse when the selection is cleared).
   */
  hasSelection?: boolean;
}

/**
 * The By Item controls.
 *
 * Table view exposes a Hierarchy multi-select (Product Hierarchy grouping), a search button that
 * shows/hides a floating filter under every column header, and export / column-chooser actions.
 * Recommendation options come from `global.controls.recommendation`.
 */

export function ItemToolbar({
  viewMode,
  onViewMode,
  onDownload,
  downloadDisabled = false,
  downloadLoading = false,
  downloadLabel,
  recommendationFilter,
  hierarchyOptions = [],
  hierarchyLevels = [],
  onHierarchyLevels,
  onExpandAllGroups,
  onCollapseAllGroups,
  onOpenFilters,
  filtersOpen = false,
  onMore,
  columnFiltersVisible = false,
  onColumnFiltersVisible,
  onBulkEdit,
  bulkEditAnchorRef,
  hasSelection = false,
}: ItemToolbarProps) {
  const { t } = useTranslation('hindsight');
  const isTable = viewMode === 'table';
  const showBulkEdit = hasSelection && onBulkEdit !== undefined;
  const showDefaultControls = !hasSelection;
  const showHierarchy =
    isTable && hierarchyOptions.length > 0 && onHierarchyLevels !== undefined;
  const showHierarchyExpand =
    showHierarchy &&
    hierarchyLevels.length > 0 &&
    onExpandAllGroups !== undefined &&
    onCollapseAllGroups !== undefined;

  const local = useControlFilter(DEFAULT_SCOPE, RECOMMENDATION_FILTER_KEY);
  const recommendation = recommendationFilter ?? local;

  // Draft selection so checking levels does not rebuild the tree until the menu closes.
  const [hierarchyDraft, setHierarchyDraft] = useState<string[] | null>(null);

  useEffect(() => {
    if ((!isTable || hasSelection) && columnFiltersVisible) {
      onColumnFiltersVisible?.(false);
    }
  }, [isTable, hasSelection, columnFiltersVisible, onColumnFiltersVisible]);

  const openHierarchyMenu = useCallback(() => {
    setHierarchyDraft([...hierarchyLevels]);
  }, [hierarchyLevels]);

  const changeHierarchyDraft = useCallback(
    (values: string[]) => {
      setHierarchyDraft(values);
      // Clear (X) fires while the menu is closed — commit immediately so the grid flattens.
      if (values.length === 0) {
        setHierarchyDraft(null);
        if (hierarchyLevels.length > 0) onHierarchyLevels?.([]);
      }
    },
    [hierarchyLevels.length, onHierarchyLevels],
  );

  const commitHierarchySelection = useCallback(() => {
    if (hierarchyDraft === null) return;
    const next = hierarchyDraft;
    setHierarchyDraft(null);
    const current = hierarchyLevels;
    if (
      next.length === current.length &&
      next.every((value, index) => value === current[index])
    ) {
      return;
    }
    onHierarchyLevels?.(next);
  }, [hierarchyDraft, hierarchyLevels, onHierarchyLevels]);

  const recommendationDropdown = SHOW_RECOMMENDATION_FILTER && showDefaultControls ? (
    <Dropdown
      label="Recommendation"
      labelOrientation="left"
      aria-label="Recommendation"
      options={recommendation.options}
      value={recommendation.selected}
      isMulti={recommendation.multi}
      isClearable={false}
      onChange={recommendation.select}
      withPortal
      portalContainer={typeof document !== 'undefined' ? document.body : undefined}
      width="120px"
      minWidth="120px"
      data-testid="hindsight-item-recommendation-filter"
    />
  ) : null;

  const hierarchyDropdown = showHierarchy ? (
    <Dropdown
      className={styles.hierarchyDropdown}
      label={t('items.hierarchy.label', 'Hierarchy')}
      labelOrientation="left"
      aria-label={t('items.hierarchy.label', 'Hierarchy')}
      options={[...hierarchyOptions]}
      value={hierarchyDraft ?? [...hierarchyLevels]}
      isMulti
      isWithSelectAll
      isClearable
      onChange={changeHierarchyDraft}
      onDropdownOpen={openHierarchyMenu}
      onDropdownClose={commitHierarchySelection}
      selectionLabels={{
        selectAll: t('items.hierarchy.selectAll', 'Select All'),
        deselectAll: t('items.hierarchy.deselectAll', 'Deselect All'),
      }}
      placeholder={t('items.hierarchy.placeholder', 'Select')}
      withPortal
      portalContainer={typeof document !== 'undefined' ? document.body : undefined}
      minWidth="160px"
      data-testid="hindsight-item-hierarchy-filter"
    />
  ) : null;

  return (
    <div className={styles.toolbar} data-testid="hindsight-item-toolbar">
      <div className={styles.titleGroup}>
        <h2 className={styles.title} data-testid="hindsight-item-toolbar-title">
          By Item
        </h2>
        {showHierarchyExpand && (
          <div
            className={styles.hierarchyExpand}
            role="group"
            aria-label={t('items.hierarchy.expandGroup', 'Hierarchy expand')}
          >
            <Tooltip title={t('items.hierarchy.expandAll', 'Expand all')} variant="tertiary">
              <Button
                variant="text"
                size="large"
                aria-label={t('items.hierarchy.expandAll', 'Expand all')}
                data-testid="hindsight-item-expand-all"
                onClick={onExpandAllGroups}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 3.75V14.25M9 3.75L5.25 7.5M9 3.75L12.75 7.5M3.75 14.25H14.25"
                      stroke="#394960"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </Tooltip>
            <Tooltip title={t('items.hierarchy.collapseAll', 'Collapse all')} variant="tertiary">
              <Button
                variant="text"
                size="large"
                aria-label={t('items.hierarchy.collapseAll', 'Collapse all')}
                data-testid="hindsight-item-collapse-all"
                onClick={onCollapseAllGroups}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 14.25V3.75M9 14.25L5.25 10.5M9 14.25L12.75 10.5M3.75 3.75H14.25"
                      stroke="#394960"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </Tooltip>
          </div>
        )}
        {hierarchyDropdown}
      </div>

      <ButtonGroup
        options={VIEW_OPTIONS}
        selectedOption={viewMode}
        onChange={(_e, value) => {
          if (value) onViewMode(value as ItemViewMode);
        }}
        className={styles.views}
        data-testid="hindsight-item-view-toggle"
      />

      <div className={styles.controls}>
        {showDefaultControls && (
          <>
            <div className={styles.dropdowns}>
              {recommendationDropdown}
            </div>
            {isTable && (
              <>
                <span className={styles.divider} aria-hidden="true" />
                {onOpenFilters !== undefined && (
                  <Tooltip
                    title={t('items.filters.open', 'Filter Settings')}
                    variant="tertiary"
                  >
                    <Button
                      variant="text"
                      size="large"
                      aria-label={t('items.filters.open', 'Filter Settings')}
                      aria-pressed={filtersOpen}
                      data-testid="hindsight-item-filters"
                      onClick={onOpenFilters}
                      className={filtersOpen ? styles.filterActive : undefined}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.25 3.75H15.75L10.5 9.75V13.5L7.5 15V9.75L2.25 3.75Z"
                            stroke="#394960"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    />
                  </Tooltip>
                )}
                <Tooltip
                  title={t('actions.searchColumns', 'Search columns')}
                  variant="tertiary"
                >
                  <Button
                    variant="text"
                    size="large"
                    aria-label={t('actions.searchColumns', 'Search columns')}
                    aria-pressed={columnFiltersVisible}
                    data-testid="hindsight-item-search"
                    onClick={() => onColumnFiltersVisible?.(!columnFiltersVisible)}
                    disabled={downloadDisabled}
                    icon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_7209_105530)">
                          <path
                            d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
                            fill="#394960"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_7209_105530">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    }
                  />
                </Tooltip>
                <Tooltip title={downloadLabel ?? t('actions.download', 'Download Items')} variant="tertiary">
                  <Button
                    variant="text"
                    size="large"
                    aria-label={downloadLabel ?? t('actions.download', 'Download Items')}
                    aria-busy={downloadLoading}
                    disabled={downloadDisabled || downloadLoading}
                    onClick={onDownload}
                    data-testid="hindsight-item-download"
                    icon={
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 11L4.25 7.25L5.3 6.1625L7.25 8.1125V2H8.75V8.1125L10.7 6.1625L11.75 7.25L8 11ZM3.5 14C3.0875 14 2.73438 13.8531 2.44063 13.5594C2.14687 13.2656 2 12.9125 2 12.5V10.25H3.5V12.5H12.5V10.25H14V12.5C14 12.9125 13.8531 13.2656 13.5594 13.5594C13.2656 13.8531 12.9125 14 12.5 14H3.5Z"
                          fill="#60697D"
                        />
                      </svg>
                    }
                  />
                </Tooltip>
                <Tooltip
                  title={t('actions.chooseColumns', 'Choose columns')}
                  variant="tertiary"
                >
                  <Button
                    variant="text"
                    size="large"
                    aria-label={t('actions.chooseColumns', 'Choose columns')}
                    data-testid="hindsight-item-more"
                    onClick={onMore}
                    disabled={downloadDisabled}
                    icon={
                      <svg
                        width="14"
                        height="4"
                        viewBox="0 0 14 4"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                        <circle cx="7" cy="2" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="2" r="1.5" fill="currentColor" />
                      </svg>
                    }
                  />
                </Tooltip>
              </>
            )}
          </>
        )}
        {showBulkEdit && (
          <span ref={bulkEditAnchorRef} className={styles.bulkEditAnchor}>
            <Button
              variant="primary"
              size="large"
              onClick={onBulkEdit}
              data-testid="hindsight-item-bulk-edit"
            >
              {t('items.bulkEdit.action')}
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}
