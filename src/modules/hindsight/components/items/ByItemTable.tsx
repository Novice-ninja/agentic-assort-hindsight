import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@shared/components/data';
import { ImpactCheckbox as Checkbox } from '@shared/components/vendor/impact-ui';
import type { DataGridColumn, DataGridHandle, DataGridVisibleRange } from '@shared/components/data';
import type { LoadStatus } from '@shared/types';
import { buildByItemColumns } from '../../services/byItemColumns';
import {
  buildByItemHierarchyRows,
  orderHierarchyLevels,
  type ByItemHierarchyNode,
} from '../../services/byItemHierarchy';
import { BY_ITEM_VIEWPORT_HEIGHT } from '../../services/byItemPaging';
import { formatKpiValue } from '../../services/formatKpiValue';
import { NO_COMPARISON } from '../../services/metricCatalog';
import { DEFAULT_LEVEL_HIERARCHIES } from '../../services/visualHierarchy';
import type {
  ByItemCell,
  ByItemColumnDef,
  ByItemComparisonCell,
  ByItemAiRecommendationCell,
  ByItemNumericCell,
  ByItemProductCell,
  ByItemSelectCell,
  ByItemTableRow,
  ByItemTextCell,
  ByItemVisualPageStatus,
} from '../../types';
import { AiInsightButton } from '../cells/AiInsightButton';
import { NarrationTooltip } from '../overview/NarrationTooltip';
import { ItemThumbnail } from '../cells/ItemThumbnail';
import { RecommendationControl } from '../cells/RecommendationControl';
import styles from './ByItemTable.module.css';

/**
 * Column floors for `DataGrid`'s `fitGridWidth` strategy: a declared `width` is also the
 * `minWidth`, so the grid scrolls horizontally once columns no longer fit.
 *
 * Width is the wider of the header and the loaded cell content (formatted value, change pill,
 * description). Header-only sizing clipped KPI text that was longer than the title.
 */
const HEADER_CHAR_PX = 8;
const HEADER_PAD_PX = 40;
const MIN_COLUMN_WIDTH = 110;
const PRODUCT_MIN_WIDTH = 160;
const PRODUCT_FLEX = 2;
/** Swatch + gap + thumbnail + gap, on top of the description text. */
const PRODUCT_CHROME_PX = 64;
/** Change-pill padding and the gap before the value. */
const COMPARISON_CHROME_PX = 32;
const VERDICT_MIN_WIDTH = 160;
/** Comparison cells show a change pill beside the value. */
const COMPARISON_MIN_WIDTH = 100;
/** Figma header 80 + body 46. Viewport height stays the shared paging constant. */
const GRID_HEADER_HEIGHT = 80;
const GRID_ROW_HEIGHT = 46;
const SELECTION_COLUMN_WIDTH = 48;
const PRODUCT_HIERARCHY_WIDTH = 220;

function widthForText(text: string, floor: number, extra = 0): number {
  return Math.max(floor, text.length * HEADER_CHAR_PX + HEADER_PAD_PX + extra);
}

function widthForHeader(header: string, floor = MIN_COLUMN_WIDTH): number {
  return widthForText(header, floor);
}

function widestText(lengths: number[], floor: number, extra = 0): number {
  const longest = lengths.reduce((max, length) => Math.max(max, length), 0);
  return Math.max(floor, longest * HEADER_CHAR_PX + HEADER_PAD_PX + extra);
}

type RowModel = ByItemHierarchyNode;

/**
 * Cell shapes are checked at the point of use rather than trusted from the payload: a column
 * whose field is missing, or arrives as something else, renders as absent instead of throwing.
 */
function isTextish(
  cell: ByItemCell | string | undefined,
): cell is ByItemTextCell | ByItemProductCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'string'
  );
}

function isNumeric(
  cell: ByItemCell | string | undefined,
): cell is ByItemComparisonCell | ByItemNumericCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'number'
  );
}

function isSelect(cell: ByItemCell | string | undefined): cell is ByItemSelectCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'options' in cell &&
    Array.isArray(cell.options)
  );
}

function isAiRecommendation(
  cell: ByItemCell | string | undefined,
): cell is ByItemAiRecommendationCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'narration' in cell &&
    typeof (cell as ByItemAiRecommendationCell).narration === 'string' &&
    'value' in cell &&
    typeof (cell as ByItemAiRecommendationCell).value === 'string'
  );
}

function isProduct(cell: ByItemCell | string | undefined): cell is ByItemProductCell {
  return isTextish(cell);
}

function isComparison(cell: ByItemCell | string | undefined): cell is ByItemComparisonCell {
  return isNumeric(cell);
}

function displayMetric(cell: ByItemComparisonCell | ByItemNumericCell): string {
  return formatKpiValue({
    value: cell.value,
    format: cell.format,
    displayValue: cell.formattedValue,
  });
}

export interface ByItemTableProps {
  rows?: readonly ByItemTableRow[];
  /** Column defs. Omit to derive metric columns from `rows[0]` via `buildByItemColumns`. */
  columns?: readonly ByItemColumnDef[];
  status?: LoadStatus;
  /** Status of a subsequent page while earlier rows stay visible. */
  pageStatus?: ByItemVisualPageStatus;
  /** True when another table-data page is available. */
  hasMore?: boolean;
  /** Called when the planner reaches the last bound row. */
  onLoadMore?: () => void;
  onRetry?: () => void;
  /**
   * Called with the row's **article** — the id the override endpoint keys on — when a planner
   * picks a different recommendation. The value is not held here: the row itself is the source of
   * truth, corrected in place once the backend answers.
   */
  onRecommendationChange?: (article: string, value: string) => void;
  /** Articles whose override is still in flight. Only those rows go pending. */
  pendingArticles?: Readonly<Record<string, unknown>>;
  /** False renders every recommendation read-only, whatever a row's own `editable` says. */
  overridesEnabled?: boolean;
  onAskAi?: (styleId: string) => void;
  /** Ref to open the Enterprise column chooser from the toolbar "…" control. */
  gridRef?: Ref<DataGridHandle | null>;
  /** Shows a floating text-search input under every column header. */
  showColumnFilters?: boolean;
  /** Articles currently checked for bulk edit. */
  selectedArticles?: ReadonlySet<string>;
  /** Called when a row checkbox is toggled. */
  onSelectedChange?: (article: string, selected: boolean) => void;
  /** Replace the selection with every article currently bound, or clear it. */
  onSelectAll?: (articles: readonly string[], selected: boolean) => void;
  /**
   * Selected product-hierarchy level keys (`l0_name` …). Empty / omitted keeps a flat table.
   * Order is normalised against `levelHierarchies` before the tree is built.
   */
  hierarchyLevels?: readonly string[];
  /** Configured level order from global config. Defaults to `l0`…`l3`. */
  levelHierarchies?: readonly string[];
}

/**
 * The By Item table.
 *
 * Columns: identity and Working Plan / Recommendation are fixed; metric columns are derived
 * from the first row (`buildByItemColumns`) unless the caller passes `columns`. Each column's
 * `type` picks the renderer. Display uses `formatKpiValue` (numeral `format` when present, else
 * `formattedValue`); raw `value` is what sorting compares — a compacted `$7.1M` must not sort
 * as text.
 *
 * When `hierarchyLevels` is non-empty, rows are nested under a Product Hierarchy tree column
 * driven by `l0_name`…`l3_name` on each leaf.
 *
 * Reaching the last bound row asks for the next page once. AG Grid's loading overlay covers the
 * grid and scrolling is locked until that page arrives, then the new rows append in place.
 */
export function ByItemTable({
  rows = [],
  columns: columnsProp,
  status,
  pageStatus = 'idle',
  hasMore = false,
  onLoadMore,
  onRetry,
  onRecommendationChange,
  pendingArticles,
  overridesEnabled = true,
  onAskAi,
  gridRef,
  showColumnFilters,
  selectedArticles,
  onSelectedChange,
  onSelectAll,
  hierarchyLevels = [],
  levelHierarchies = DEFAULT_LEVEL_HIERARCHIES,
}: ByItemTableProps) {
  const { t } = useTranslation('hindsight');
  const [phoneLayout, setPhoneLayout] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 560px)').matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 560px)');
    const update = () => setPhoneLayout(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const orderedLevels = useMemo(
    () => orderHierarchyLevels(hierarchyLevels, levelHierarchies),
    [hierarchyLevels, levelHierarchies],
  );
  const treeActive = orderedLevels.length > 0;

  const columns = useMemo(() => {
    const built = columnsProp ?? buildByItemColumns(rows[0]);
    // Product Hierarchy replaces Style ID while the tree is on.
    if (!treeActive) return built;
    return built.filter((column) => column.field !== 'styleId');
  }, [columnsProp, rows, treeActive]);

  const models = useMemo<RowModel[]>(
    () => buildByItemHierarchyRows(rows, orderedLevels),
    [rows, orderedLevels],
  );

  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;
  const pageStatusRef = useRef(pageStatus);
  pageStatusRef.current = pageStatus;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const askedRef = useRef(false);

  useEffect(() => {
    askedRef.current = false;
  }, [models.length, orderedLevels.join('|')]);

  const rowClassName = useCallback(
    (row: RowModel) => {
      const classes: string[] = [];
      if (row.rowKind === 'group') classes.push(styles.rowGroup);
      const article = row.article?.trim();
      if (
        article !== undefined &&
        article.length > 0 &&
        selectedArticles?.has(article) === true
      ) {
        classes.push(styles.rowChecked);
      }
      return classes.length > 0 ? classes.join(' ') : undefined;
    },
    [selectedArticles],
  );

  const onVisibleRangeChange = useCallback(({ lastRow }: DataGridVisibleRange) => {
    if (askedRef.current) return;
    if (pageStatusRef.current !== 'idle' || !hasMoreRef.current) return;
    if (models.length === 0 || lastRow < models.length - 1) return;
    askedRef.current = true;
    onLoadMoreRef.current?.();
  }, [models.length]);

  const change = useCallback(
    (article: string, value: string) => {
      onRecommendationChange?.(article, value);
    },
    [onRecommendationChange],
  );

  const selectableArticles = useMemo(
    () =>
      models
        .filter((row) => row.rowKind === 'leaf')
        .map((row) => row.article)
        .filter((article): article is string => article !== undefined && article.length > 0),
    [models],
  );

  const allSelected =
    selectableArticles.length > 0 &&
    selectedArticles !== undefined &&
    selectableArticles.every((article) => selectedArticles.has(article));
  const someSelected =
    selectedArticles !== undefined &&
    !allSelected &&
    selectableArticles.some((article) => selectedArticles.has(article));

  const tree = useMemo(() => {
    if (!treeActive) return undefined;
    return {
      parentIdField: 'parentKey' as const,
      // Expand every hierarchy level on load (`-1`); planners can still collapse from the toolbar.
      defaultExpandedDepth: -1,
      groupColumn: {
        header: t('items.columns.productHierarchy', 'Product Hierarchy'),
        width: PRODUCT_HIERARCHY_WIDTH,
        pinned: phoneLayout ? null : ('left' as const),
        value: (row: RowModel) => row.hierarchyLabel,
      },
    };
  }, [t, treeActive, phoneLayout]);

  const gridColumns = useMemo<DataGridColumn<RowModel>[]>(() => {
    const dataColumns: DataGridColumn<RowModel>[] = columns.map((column) => {
        const headerWidth = widthForHeader(column.headerName);
        const base = { id: column.field, header: column.headerName };
        const cells = models.map((row) => row.cells[column.field]);

        switch (column.type) {
          case 'text':
            return {
              ...base,
              width: Math.max(
                headerWidth,
                widestText(
                  cells.map((cell) => (isTextish(cell) ? cell.value.length : 0)),
                  MIN_COLUMN_WIDTH,
                ),
              ),
              pinned: column.field === 'styleId' ? phoneLayout ? null : ('left' as const) : undefined,
              lockPinned: column.field === 'styleId' ? true : undefined,
              value: (row: RowModel) => {
                const cell = row.cells[column.field];
                return isTextish(cell) ? cell.value : null;
              },
              render: (row: RowModel) => {
                const cell = row.cells[column.field];
                return (
                  <span className={column.field === 'styleId' ? styles.style : undefined}>
                    {isTextish(cell) ? cell.value : NO_COMPARISON}
                  </span>
                );
              },
            };

          case 'product':
            return {
              ...base,
              width: Math.max(
                widthForHeader(column.headerName, PRODUCT_MIN_WIDTH),
                widestText(
                  cells.map((cell) => (isProduct(cell) ? cell.value.length : 0)),
                  PRODUCT_MIN_WIDTH,
                  PRODUCT_CHROME_PX,
                ),
              ),
              flex: PRODUCT_FLEX,
              value: (row: RowModel) => {
                const cell = row.cells[column.field];
                return isProduct(cell) ? cell.value : null;
              },
              render: (row: RowModel) => {
                const cell = row.cells[column.field];
                if (!isProduct(cell)) return NO_COMPARISON;
                return (
                  <span className={styles.product}>
                    {cell.color === undefined ? null : (
                      <span
                        className={styles.swatch}
                        style={{ backgroundColor: cell.color.value }}
                        aria-hidden="true"
                      />
                    )}
                    <span className={styles.description}>{cell.value}</span>
                    <ItemThumbnail
                      imageUrl={cell.image?.url ?? null}
                      description={cell.image?.alt ?? cell.value}
                      // Its style id, so a row and that item's card show the same photo.
                      itemId={row.cells.styleId?.value}
                    />
                  </span>
                );
              },
            };

          case 'kpiComparison':
          case 'kpiComparisonCurrency':
            return {
              ...base,
              width: Math.max(
                widthForHeader(column.headerName, COMPARISON_MIN_WIDTH),
                widestText(
                  cells.map((cell) => {
                    if (!isComparison(cell)) return 0;
                    const pill =
                      cell.change == null
                        ? ''
                        : `${cell.change.label} ${cell.change.metric}`.trim();
                    return displayMetric(cell).length + pill.length;
                  }),
                  COMPARISON_MIN_WIDTH,
                  COMPARISON_CHROME_PX,
                ),
              ),
              align: 'end' as const,
              value: (row: RowModel) => {
                const cell = row.cells[column.field];
                return isComparison(cell) ? cell.value : null;
              },
              // Search the formatted cell (+ change pill), not the raw number.
              filterValue: (row: RowModel) => {
                const cell = row.cells[column.field];
                if (!isComparison(cell)) return null;
                const movement = cell.change;
                const changeText =
                  movement === undefined || movement === null
                    ? ''
                    : `${movement.label} ${movement.metric}`.trim();
                return [changeText, displayMetric(cell)].filter(Boolean).join(' ');
              },
              render: (row: RowModel) => {
                const cell = row.cells[column.field];
                if (!isComparison(cell)) return NO_COMPARISON;
                const movement = cell.change ?? null;
                return (
                  <span className={styles.comparison}>
                    {movement === null ? null : (
                      <span className={styles.change} data-status={movement.status}>
                        {`${movement.label} ${movement.metric}`.trim()}
                      </span>
                    )}
                    <span className={styles.numeric}>
                      {displayMetric(cell)}
                    </span>
                  </span>
                );
              },
            };

          case 'percentage':
          case 'number':
            return {
              ...base,
              width: Math.max(
                headerWidth,
                widestText(
                  cells.map((cell) => (isNumeric(cell) ? displayMetric(cell).length : 0)),
                  MIN_COLUMN_WIDTH,
                ),
              ),
              align: 'end' as const,
              value: (row: RowModel) => {
                const cell = row.cells[column.field];
                return isNumeric(cell) ? cell.value : null;
              },
              filterValue: (row: RowModel) => {
                const cell = row.cells[column.field];
                return isNumeric(cell) ? displayMetric(cell) : null;
              },
              render: (row: RowModel) => {
                const cell = row.cells[column.field];
                if (!isNumeric(cell)) return NO_COMPARISON;
                const colour = 'color' in cell ? cell.color : undefined;
                return (
                  <span className={styles.numeric} data-color={colour}>
                    {displayMetric(cell)}
                  </span>
                );
              },
            };

          case 'select':
            return {
              ...base,
              width: Math.max(
                widthForHeader(column.headerName, VERDICT_MIN_WIDTH),
                widestText(
                  cells.map((cell) => (isSelect(cell) ? cell.value.length : 0)),
                  VERDICT_MIN_WIDTH,
                ),
              ),
              value: (row: RowModel) => {
                const cell = row.cells[column.field];
                return isSelect(cell) ? cell.value : null;
              },
              // Match the dropdown label ("Keep"), not only the wire key ("keep").
              filterValue: (row: RowModel) => {
                const cell = row.cells[column.field];
                if (!isSelect(cell)) return null;
                return t(`items.verdict.${cell.value}`, { defaultValue: cell.value });
              },
              render: (row: RowModel) => {
                if (row.rowKind === 'group') return NO_COMPARISON;
                const cell = row.cells[column.field];
                if (!isSelect(cell)) return NO_COMPARISON;

                return (
                  <RecommendationControl
                    article={row.article}
                    value={cell.value}
                    // Values as sent; the endpoint's own vocabulary is what a planner picks from.
                    options={cell.options.map((option) => ({
                      value: option,
                      label: t(`items.verdict.${option}`, { defaultValue: option }),
                    }))}
                    editable={overridesEnabled && cell.editable}
                    overridden={cell.overridden ?? false}
                    pending={
                      row.article !== undefined &&
                      pendingArticles?.[row.article] !== undefined
                    }
                    label={t('items.verdict.label', { style: row.styleId || row.id })}
                    className={styles.select}
                    onChange={change}
                    withPortal
                    portalContainer={typeof document !== 'undefined' ? document.body : undefined}
                    minWidth="120px"
                  />
                );
              },
            };

          case 'aiRecommendation':
            // `{ value, narration }` → "Keep" as text + sparkle tooltip (not a dropdown).
            return {
              ...base,
              width: Math.max(
                widthForHeader(column.headerName, VERDICT_MIN_WIDTH),
                widestText(
                  models.map((row) => {
                    const cell = row.cells.aiRecommendation;
                    return isAiRecommendation(cell) ? cell.value.length : 0;
                  }),
                  VERDICT_MIN_WIDTH,
                ),
              ),
              sortable: false,
              value: (row: RowModel) => {
                const cell = row.cells.aiRecommendation;
                return isAiRecommendation(cell) ? cell.value : null;
              },
              filterValue: (row: RowModel) => {
                const cell = row.cells.aiRecommendation;
                if (!isAiRecommendation(cell)) return null;
                const verdictKey = cell.value.trim().toLowerCase();
                if (verdictKey.length === 0) return null;
                return t(`items.verdict.${verdictKey}`, {
                  defaultValue: cell.value.replace(/_/g, ' '),
                });
              },
              render: (row: RowModel) => {
                if (row.rowKind === 'group') return NO_COMPARISON;
                // Always read the AI cell by name — never a sibling select (`workingPlan`).
                const cell = row.cells.aiRecommendation;
                if (!isAiRecommendation(cell)) return NO_COMPARISON;

                const verdictKey = cell.value.trim().toLowerCase();
                const label =
                  verdictKey.length > 0
                    ? t(`items.verdict.${verdictKey}`, {
                        defaultValue: cell.value.replace(/_/g, ' '),
                      })
                    : NO_COMPARISON;
                const askStyle = row.styleId || row.id;

                return (
                  <span className={styles.aiRecommendation}>
                    <span className={styles.aiRecommendationValue}>{label}</span>
                    <NarrationTooltip narration={cell.narration}>
                      <AiInsightButton
                        label={t('items.table.askAi', { style: askStyle })}
                        onClick={() => onAskAi?.(askStyle)}
                      />
                    </NarrationTooltip>
                  </span>
                );
              },
            };

          case 'iconButton':
            // Legacy sparkle-only column; prefer `aiRecommendation` for Recommendation.
            return {
              ...base,
              width: widthForHeader(column.headerName, VERDICT_MIN_WIDTH),
              align: 'center' as const,
              sortable: false,
              render: (row: RowModel) => {
                if (row.rowKind === 'group') return null;
                const cell = row.cells.aiRecommendation;
                if (!isAiRecommendation(cell)) return null;
                const askStyle = row.styleId || row.id;
                return (
                  <NarrationTooltip narration={cell.narration}>
                    <AiInsightButton
                      label={t('items.table.askAi', { style: askStyle })}
                      onClick={() => onAskAi?.(askStyle)}
                    />
                  </NarrationTooltip>
                );
              },
            };

          default:
            return base;
        }
      });

    if (onSelectedChange === undefined) return dataColumns;

    const selectionColumn: DataGridColumn<RowModel> = {
      id: '__select',
      header: '',
      width: SELECTION_COLUMN_WIDTH,
      pinned: phoneLayout ? null : 'left',
      lockPinned: true,
      // Stay leftmost even when the Product Hierarchy auto-group column is also left-pinned.
      lockPosition: 'left',
      lockVisible: true,
      filterable: false,
      sortable: false,
      headerRender: () => {
        const partial = someSelected && !allSelected;
        return (
          <span className={styles.selectionHeader}>
            <Checkbox
              checked={allSelected || partial}
              variant={partial ? 'dashed' : 'default'}
              withoutFormLabel
              aria-label={t('items.bulkEdit.selectAll')}
              onChange={(event) =>
                onSelectAll?.(selectableArticles, partial ? true : event.target.checked)
              }
            />
          </span>
        );
      },
      render: (row) => {
        if (row.rowKind === 'group') return null;
        const article = row.article;
        if (article === undefined || article.length === 0) return null;
        const selected = selectedArticles?.has(article) ?? false;
        return (
          <span className={styles.selectionCell} data-selected={selected ? 'true' : undefined}>
            <Checkbox
              checked={selected}
              withoutFormLabel
              aria-label={t('items.bulkEdit.selectItem', { style: row.styleId || row.id })}
              onChange={(event) => onSelectedChange(article, event.target.checked)}
            />
          </span>
        );
      },
    };

    return [selectionColumn, ...dataColumns];
  }, [
    allSelected,
    change,
    columns,
    models,
    onAskAi,
    onSelectAll,
    onSelectedChange,
    overridesEnabled,
    pendingArticles,
    phoneLayout,
    selectableArticles,
    selectedArticles,
    someSelected,
    t,
  ]);

  return (
    <div className={styles.viewport}>
      <DataGrid
        className={styles.grid}
        columns={gridColumns}
        rows={models}
        getRowId={(row) => row.id}
        ariaLabel={t('items.title')}
        data-testid="hindsight-by-item-table"
        status={status}
        height={BY_ITEM_VIEWPORT_HEIGHT}
        rowHeight={GRID_ROW_HEIGHT}
        headerHeight={GRID_HEADER_HEIGHT}
        emptyLabel={t('states.empty')}
        errorLabel={t('states.error')}
        loadingLabel={t('states.loading')}
        retryLabel={t('states.retry')}
        onRetry={onRetry}
        pageLoading={pageStatus === 'loading'}
        onVisibleRangeChange={onVisibleRangeChange}
        rowClassName={rowClassName}
        columnChooser
        gridRef={gridRef}
        showColumnFilters={showColumnFilters}
        tree={tree}
      />
    </div>
  );
}
