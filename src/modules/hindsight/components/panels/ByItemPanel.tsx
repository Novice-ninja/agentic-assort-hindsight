import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@app/store/hooks';
import { useGlobalConfig } from '@modules/appConfig';
import { DEFINITION_STATUS, FLOORING_DEFINITIONS, FLOORING_DEMO_LABEL, getFlooringTotals } from '@mocks/flooringDemo';
import type { HierarchyScopeEntry } from '@modules/planning/types';
import { Button, ImpactBadge as Badge } from '@shared/components/vendor/impact-ui';
import type { DataGridHandle } from '@shared/components/data';
import { useExcelDownload } from '../../hooks/useExcelDownload';
import { useItemRecommendation } from '../../hooks/useItemRecommendation';
import { useItemSelection } from '../../hooks/useItemSelection';
import { usePlanFilterStrip } from '../../hooks/usePlanFilterStrip';
import { usePlanContext } from '../../hooks/usePlanContext';
import { buildByItemColumns } from '../../services/byItemColumns';
import type { ByItemHierarchyNode } from '../../services/byItemHierarchy';
import {
  filterStripFromHierarchyScope,
  hierarchyScopeFromFilterStrip,
  serializeHierarchyScopeKey,
} from '../../services/byItemTableFilters';
import {
  buildByItemExportColumns,
  inferByItemCurrency,
} from '../../services/export/byItemExportConfig';
import { DEFAULT_LEVEL_HIERARCHIES } from '../../services/visualHierarchy';
import {
  savePreferences,
  setItemViewMode,
  setOverridesEnabled,
  updatePreferences,
} from '../../store/hindsightSlice';
import { HindsightFilterStrip } from '../HindsightFilterStrip';
import { BulkEditModal } from '../items/BulkEditModal';
import { ByItemFilterPanel } from '../items/ByItemFilterPanel';
import { ByItemTable } from '../items/ByItemTable';
import { ItemCardGrid } from '../items/ItemCardGrid';
import { ItemToolbar } from '../items/ItemToolbar';
import type { ControlFilter } from '@modules/appConfig';
import type {
  ByItemSummaryCards,
  ByItemTableRow,
  ByItemVisualPageStatus,
  ItemViewMode,
  UserPreferences,
  VisualViewItem,
} from '../../types';
import type { LoadStatus } from '@shared/types';
import styles from './panels.module.css';
import ellipseStroke115 from '@assets/icons/hindsight/summary-card/ellipse-stroke-115.svg';
import ellipseNoise100 from '@assets/icons/hindsight/summary-card/ellipse-noise-100.svg';
import ellipseFill100 from '@assets/icons/hindsight/summary-card/ellipse-fill-100.svg';
import ellipseStroke116 from '@assets/icons/hindsight/summary-card/ellipse-stroke-116.svg';

export interface ByItemPanelProps {
  /** The plan a recommendation override is recorded against. No plan, no write. */
  planCode?: string;
  seasonCode?: number | null;
  preferences: UserPreferences;
  /** Load state of the visual view's own request, which is what the card view reports. */
  status: LoadStatus;
  search: string;
  onSearch: (query: string) => void;
  onRetry: () => void;
  /** Summary cards from the by-item summary API. Null until a plan and season are known. */
  summary?: ByItemSummaryCards | null;
  summaryStatus?: LoadStatus;
  onRetrySummary?: () => void;
  /** Items from the visual-view API, which is the only source the card view has. */
  visualItems?: VisualViewItem[];
  /** Rows from the table-data API, shown in the table view and on each card's back face. */
  tableRows?: readonly ByItemTableRow[];
  /**
   * Full table cache. Card backs look up by article in this list.
   * Falls back to `tableRows` when omitted.
   */
  cachedTableRows?: readonly ByItemTableRow[];
  tableStatus?: LoadStatus;
  onRetryTable?: () => void;
  /** Status of a subsequent table page while earlier rows stay visible. */
  tablePageStatus?: ByItemVisualPageStatus;
  /** True when another table-data page is available. */
  tableHasMore?: boolean;
  /** Called when the planner reaches the last bound table row. */
  onLoadMoreTable?: () => void;
  /** Recommendation filter state owned by the page so it drives both API payloads. */
  recommendationFilter?: ControlFilter;
  visualHasMore?: boolean;
  visualPageStatus?: ByItemVisualPageStatus;
  onLoadMoreVisual?: () => void;
  onRetryVisualPage?: () => void;
  /**
   * Applied product-hierarchy scope for table-data requests. Owned by the page so Apply refetches
   * through `useByItemTable`. When `onTableHierarchyScopeChange` is set, table view shows Filter
   * Settings.
   */
  tableHierarchyScope?: readonly HierarchyScopeEntry[];
  onTableHierarchyScopeChange?: (scope: HierarchyScopeEntry[]) => void;
}

const MAX_SUMMARY_KPIS = 4;

const BADGE_COLOR: Record<string, 'info' | 'error' | 'warning' | 'success'> = {
  green: 'success',
  amber: 'warning',
  red: 'error',
};

function CardDecoration() {
  return (
    <span className={styles.cardDecoration} aria-hidden="true">
      <img
        className={styles.decorStroke115}
        src={ellipseStroke115}
        alt=""
        width={115}
        height={115}
      />
      <img
        className={styles.decorNoise100}
        src={ellipseNoise100}
        alt=""
        width={100}
        height={100}
      />
      <img
        className={styles.decorFill100}
        src={ellipseFill100}
        alt=""
        width={100}
        height={100}
      />
      <img
        className={styles.decorStroke116}
        src={ellipseStroke116}
        alt=""
        width={116}
        height={116}
      />
    </span>
  );
}

function ItemSummaryRow({
  summary,
  status,
  onRetry,
}: {
  summary: ByItemSummaryCards | null;
  status: LoadStatus;
  onRetry?: () => void;
}) {
  const { t } = useTranslation('hindsight');
  const kpis = (summary?.kpis ?? []).slice(0, MAX_SUMMARY_KPIS);
  const recommendation = summary?.recommendation ?? null;

  if (status === 'failed') {
    return (
      <section
        className={styles.itemSummaryState}
        aria-label="By item summary"
        data-testid="hindsight-item-summary"
      >
        <p className={styles.summaryStateText}>{t('states.error')}</p>
        {onRetry !== undefined && (
          <Button
            variant="secondary"
            size="large"
            onClick={onRetry}
            data-testid="hindsight-item-summary-retry"
          >
            {t('states.retry')}
          </Button>
        )}
      </section>
    );
  }

  if (status === 'loading') {
    return (
      <section
        className={styles.itemSummary}
        style={{ '--summary-stat-count': 4 } as CSSProperties}
        aria-label="By item summary"
        data-testid="hindsight-item-summary"
      >
        <p className={styles.srOnly} role="status">
          {t('states.loading')}
        </p>
        {[0, 1, 2, 3].map((i) => (
          <article key={i} className={styles.itemSummaryCard} aria-hidden="true">
            <CardDecoration />
            <span className={[styles.shimmerBone, styles.shimmerLabel].join(' ')} />
            <span className={[styles.shimmerBone, styles.shimmerValue].join(' ')} />
          </article>
        ))}
        <article
          className={[styles.itemSummaryCard, styles.recommendationCard].join(' ')}
          aria-hidden="true"
        >
          <CardDecoration />
          <span className={[styles.shimmerBone, styles.shimmerLabel].join(' ')} />
          <span className={[styles.shimmerBone, styles.shimmerRecRow].join(' ')} />
        </article>
      </section>
    );
  }

  if (kpis.length === 0 && recommendation === null) {
    return (
      <section
        className={styles.itemSummaryState}
        aria-label="By item summary"
        data-testid="hindsight-item-summary"
      >
        <p className={styles.summaryStateText}>{t('states.empty')}</p>
      </section>
    );
  }

  return (
    <section
      className={styles.itemSummary}
      style={{ '--summary-stat-count': kpis.length } as CSSProperties}
      aria-label="By item summary"
      data-testid="hindsight-item-summary"
    >
      {kpis.map((kpi) => (
        <article
          key={kpi.key}
          className={styles.itemSummaryCard}
          data-testid={`hindsight-item-summary-kpi-${kpi.key}`}
        >
          <CardDecoration />
          <span className={styles.summaryLabel}>{kpi.label}</span>
          <strong className={styles.summaryValue}>{kpi.formattedValue}</strong>
        </article>
      ))}

      {recommendation !== null && (
        <article
          className={[styles.itemSummaryCard, styles.recommendationCard].join(' ')}
          data-testid="hindsight-item-summary-recommendation"
        >
          <CardDecoration />
          <span className={styles.summaryLabel}>{recommendation.label}</span>
          <div className={styles.recommendationCounts}>
            {recommendation.items.flatMap((entry, idx) => {
              const items = [];
              if (idx > 0) {
                items.push(
                  <span
                    key={`div-${entry.key}`}
                    className={styles.recDivider}
                    role="separator"
                  />,
                );
              }
              items.push(
                <span key={entry.key} className={styles.recEntry}>
                  <strong className={styles.recCount}>{entry.formattedValue}</strong>
                  <Badge
                    label={entry.badge.text}
                    color={BADGE_COLOR[entry.badge.color]}
                    variant="subtle"
                  />
                </span>,
              );
              return items;
            })}
          </div>
        </article>
      )}
    </section>
  );
}

/**
 * The By Item tab.
 *
 * Recommendation changes go through one hook shared by the table and both faces of a card, so a
 * choice made anywhere is the same write and lands on every surface that shows that article.
 */
export function ByItemPanel({
  planCode,
  seasonCode,
  preferences,
  status,
  search: _search,
  onSearch: _onSearch,
  onRetry,
  summary = null,
  summaryStatus = 'idle',
  onRetrySummary,
  visualItems = [],
  tableRows = [],
  cachedTableRows,
  tableStatus = 'idle',
  onRetryTable,
  tablePageStatus = 'idle',
  tableHasMore = false,
  onLoadMoreTable,
  recommendationFilter,
  visualHasMore = false,
  visualPageStatus = 'idle',
  onLoadMoreVisual,
  onRetryVisualPage,
  tableHierarchyScope = [],
  onTableHierarchyScopeChange,
}: ByItemPanelProps) {
  const { t } = useTranslation('hindsight');
  const dispatch = useAppDispatch();
  const global = useGlobalConfig();
  const { planSeasonCode } = usePlanContext();
  const levelHierarchies = useMemo(
    () => global.hierarchy?.levelHierarchies ?? DEFAULT_LEVEL_HIERARCHIES,
    [global.hierarchy?.levelHierarchies],
  );
  const strip = usePlanFilterStrip(planCode);
  const tableGridRef = useRef<DataGridHandle | null>(null);
  const [columnFiltersVisible, setColumnFiltersVisible] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditAnchor, setBulkEditAnchor] = useState<HTMLSpanElement | null>(null);
  const [bulkApplying, setBulkApplying] = useState(false);
  const [hierarchyLevels, setHierarchyLevels] = useState<string[] | null>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  /** True after Filter Settings Apply commits a scope different from the plan defaults. */
  const [showTableAppliedFilters, setShowTableAppliedFilters] = useState(false);
  const tableFiltersEnabled = onTableHierarchyScopeChange !== undefined;
  const { pendingArticles, change: changeRecommendation, changeMany } =
    useItemRecommendation(planCode);
  const selection = useItemSelection();
  const columns = useMemo(() => buildByItemColumns(tableRows[0]), [tableRows]);
  const exportColumns = useMemo(() => buildByItemExportColumns(columns), [columns]);

  const hierarchyOptions = useMemo(() => {
    const labelByKey = new Map(strip.groups.map((group) => [group.key, group.label]));
    return levelHierarchies.map((key) => {
      const fromStrip = labelByKey.get(key)?.trim();
      if (fromStrip !== undefined && fromStrip.length > 0) {
        return { value: key, label: fromStrip };
      }
      return {
        value: key,
        label: t(`items.hierarchy.levels.${key}`, {
          defaultValue: key.replace(/_name$/, '').toUpperCase(),
        }),
      };
    });
  }, [levelHierarchies, strip.groups, t]);

  // Keep selection inside the current config keys. Null means "all levels" (first paint default).
  const hierarchySelection = useMemo(() => {
    const offered = new Set(levelHierarchies);
    if (hierarchyLevels === null) return [...levelHierarchies];
    return hierarchyLevels.filter((key) => offered.has(key));
  }, [hierarchyLevels, levelHierarchies]);

  const getExportRows = (): readonly ByItemTableRow[] => {
    if (!tableGridRef.current) return tableRows;
    // The grid contains tree wrapper nodes. Export original leaf cells only, in the
    // current filter/sort order; rolled-up parents are not additional products.
    return tableGridRef.current.getDisplayedRows<ByItemHierarchyNode>()
      .filter(row => row.rowKind === 'leaf')
      .map(row => row.cells);
  };

  const {
    download,
    downloading,
    disabled: downloadDisabled,
  } = useExcelDownload({
    getRows: getExportRows,
    columns: exportColumns,
    fileName: { view: 'by-item', planCode, seasonCode: 'SS26' },
    sheetName: t('export.sheetByItem', 'By Item'),
    currencyCode: inferByItemCurrency(tableRows),
    canExport: tableStatus === 'succeeded' && tableRows.length > 0,
    getMetadata: () => ({
      sourceLabel: FLOORING_DEMO_LABEL,
      sourceVersion: 'Priority fix list · 27 Oct 2026',
      scope: { season: 'SS26', planCode, planSeasonCode, referenceSeasonCode: seasonCode, hierarchyScope: tableHierarchyScope, recommendation: recommendationFilter?.selected },
      viewState: {
        ...tableGridRef.current?.getExportViewState(),
        hierarchyLevels: hierarchySelection,
        exportPopulation: 'Currently loaded filtered and sorted product leaf rows; not a full-population server export',
        loadedRows: tableRows.length,
        exportedRows: getExportRows().length,
        scopedItemsBeforeLocalTableFilters: getFlooringTotals({hierarchyScope:tableHierarchyScope}).itemCount,
        moreRowsAvailable: tableHasMore,
      },
      definitions: Object.entries(FLOORING_DEFINITIONS).map(([id, definition]) => ({ id, label:id, definition, status:DEFINITION_STATUS })),
    }),
  });

  const viewMode = preferences.itemViewMode ?? 'visual';
  const includeLastYear = preferences.tyLyEnabled ?? false;

  const changeViewMode = useCallback(
    (mode: ItemViewMode) => {
      setColumnFiltersVisible(false);
      setBulkEditOpen(false);
      setFilterPanelOpen(false);
      dispatch(setItemViewMode(mode));
      void dispatch(savePreferences({ itemViewMode: mode }));
    },
    [dispatch],
  );

  const openFilterPanel = useCallback(() => {
    setFilterPanelOpen(true);
  }, []);

  const closeFilterPanel = useCallback(() => {
    setFilterPanelOpen(false);
  }, []);

  const planScopeKey = useMemo(
    () => serializeHierarchyScopeKey(hierarchyScopeFromFilterStrip(strip.groups)),
    [strip.groups],
  );

  const tableAppliedFilterGroups = useMemo(() => {
    const labelByKey = new Map(strip.groups.map((group) => [group.key, group.label]));
    const mandatoryKeys = new Set(
      strip.groups.filter((group) => group.mandatory).map((group) => group.key),
    );
    return filterStripFromHierarchyScope(tableHierarchyScope, labelByKey, mandatoryKeys);
  }, [tableHierarchyScope, strip.groups]);

  useEffect(() => {
    setShowTableAppliedFilters(false);
  }, [planCode]);

  const applyTableFilters = useCallback(
    (scope: HierarchyScopeEntry[]) => {
      onTableHierarchyScopeChange?.(scope);
      setShowTableAppliedFilters(serializeHierarchyScopeKey(scope) !== planScopeKey);
    },
    [onTableHierarchyScopeChange, planScopeKey],
  );

  const changeOverrides = useCallback(
    (on: boolean) => {
      dispatch(setOverridesEnabled(on));
      void dispatch(savePreferences({ overridesEnabled: on }));
    },
    [dispatch],
  );

  const changeIncludeLastYear = useCallback(
    (on: boolean) => {
      dispatch(updatePreferences({ tyLyEnabled: on }));
      void dispatch(savePreferences({ tyLyEnabled: on }));
    },
    [dispatch],
  );

  const changeHierarchyLevels = useCallback((levels: string[]) => {
    setHierarchyLevels(levels);
  }, []);

  const cardTableRows = cachedTableRows ?? tableRows;

  const selectedRowCount = useMemo(() => {
    if (selection.selectedCount === 0) return 0;
    const matched = cardTableRows.filter((row) => {
      const article = row.article?.trim();
      return article !== undefined && article.length > 0 && selection.selectedArticles.has(article);
    }).length;
    return matched > 0 ? matched : selection.selectedCount;
  }, [cardTableRows, selection.selectedArticles, selection.selectedCount]);

  const onCardSelectedChange = useCallback(
    (article: string, selected: boolean) => {
      selection.setSelected([article], selected);
    },
    [selection],
  );

  const onRowSelectedChange = useCallback(
    (article: string, selected: boolean) => {
      selection.setSelected([article], selected);
    },
    [selection],
  );

  const onSelectAllRows = useCallback(
    (articles: readonly string[], selected: boolean) => {
      if (selected) selection.selectAll(articles);
      else selection.setSelected(articles, false);
    },
    [selection],
  );

  const closeBulkEdit = useCallback(() => {
    if (bulkApplying) return;
    setBulkEditOpen(false);
  }, [bulkApplying]);

  const applyBulkEdit = useCallback(
    async (choice: string) => {
      const articles = Array.from(selection.selectedArticles);
      if (articles.length === 0) return;

      setBulkApplying(true);
      const ok = await changeMany(articles, choice);
      setBulkApplying(false);

      if (ok) {
        selection.clear();
        setBulkEditOpen(false);
      }
    },
    [changeMany, selection],
  );

  return (
    <div className={styles.stack} data-testid="hindsight-by-item-panel">
      <p className={styles.demoSwatchNotice}>Synthetic SS26 data · Material swatches are illustrative. Rolling, area and PLR metrics: definition TBC.</p>
      <ItemSummaryRow summary={summary} status={summaryStatus} onRetry={onRetrySummary} />

      <div className={[styles.stack, styles.itemSurface].join(' ')}>
        <ItemToolbar
          viewMode={viewMode}
          onViewMode={changeViewMode}
          overridesEnabled={preferences.overridesEnabled}
          onOverridesEnabled={changeOverrides}
          includeLastYear={includeLastYear}
          onIncludeLastYear={changeIncludeLastYear}
          recommendationFilter={recommendationFilter}
          hierarchyOptions={hierarchyOptions}
          hierarchyLevels={hierarchySelection}
          onHierarchyLevels={changeHierarchyLevels}
          onExpandAllGroups={() => tableGridRef.current?.expandAllGroups()}
          onCollapseAllGroups={() => tableGridRef.current?.collapseAllGroups()}
          onOpenFilters={tableFiltersEnabled ? openFilterPanel : undefined}
          filtersOpen={filterPanelOpen}
          onDownload={() => {
            void download();
          }}
          downloadDisabled={downloadDisabled}
          downloadLoading={downloading}
          downloadLabel={`Download loaded rows (${tableRows.length} loaded)`}
          onMore={() => tableGridRef.current?.showColumnChooser()}
          columnFiltersVisible={columnFiltersVisible}
          onColumnFiltersVisible={setColumnFiltersVisible}
          onBulkEdit={() => setBulkEditOpen(true)}
          bulkEditAnchorRef={setBulkEditAnchor}
          hasSelection={selection.selectedCount > 0}
        />

        {viewMode === 'table' && showTableAppliedFilters && (
          <div
            className={styles.tableFiltersStrip}
            data-testid="hindsight-by-item-applied-filters"
          >
            <HindsightFilterStrip groups={tableAppliedFilterGroups} status="succeeded" />
          </div>
        )}

        {viewMode === 'table' ? (
          <ByItemTable
            rows={tableRows}
            columns={columns}
            status={tableStatus}
            pageStatus={tablePageStatus}
            hasMore={tableHasMore}
            onLoadMore={onLoadMoreTable}
            onRetry={onRetryTable}
            overridesEnabled={preferences.overridesEnabled}
            pendingArticles={pendingArticles}
            onRecommendationChange={changeRecommendation}
            gridRef={tableGridRef}
            showColumnFilters={columnFiltersVisible}
            selectedArticles={selection.selectedArticles}
            onSelectedChange={onRowSelectedChange}
            onSelectAll={onSelectAllRows}
            hierarchyLevels={hierarchySelection}
            levelHierarchies={levelHierarchies}
          />
        ) : (
          <ItemCardGrid
            visualItems={visualItems}
            tableRows={cardTableRows}
            overridesEnabled={preferences.overridesEnabled}
            status={status}
            pageStatus={visualPageStatus}
            hasMore={visualHasMore}
            onLoadMore={onLoadMoreVisual}
            pendingArticles={pendingArticles}
            onOverride={changeRecommendation}
            onRetry={onRetry}
            onRetryPage={onRetryVisualPage}
            selectedArticles={selection.selectedArticles}
            onSelectedChange={onCardSelectedChange}
          />
        )}
      </div>

      {tableFiltersEnabled && (
        <ByItemFilterPanel
          open={filterPanelOpen}
          onClose={closeFilterPanel}
          appliedScope={tableHierarchyScope}
          onApply={applyTableFilters}
        />
      )}

      <BulkEditModal
        open={bulkEditOpen}
        anchorEl={bulkEditAnchor}
        onClose={closeBulkEdit}
        selectedItemCount={selection.selectedCount}
        selectedRowCount={selectedRowCount}
        applying={bulkApplying}
        onApply={(choice) => {
          void applyBulkEdit(choice);
        }}
      />
    </div>
  );
}
