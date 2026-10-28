import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@shared/components/data';
import type { DataGridColumn, DataGridHandle } from '@shared/components/data';
import type { ExcelExportColumn } from '@shared/components/data/excelExport';
import {
  ImpactBadge as Badge,
  ImpactTooltip as Tooltip,
  Button,
} from '@shared/components/vendor/impact-ui';
import { useExcelDownload } from '../../hooks/useExcelDownload';
import { usePlanContext } from '../../hooks/usePlanContext';
import { WidgetCard } from '../WidgetCard';
import { DEFINITION_STATUS, FLOORING_DEFINITIONS, FLOORING_DEMO_LABEL, getFlooringMixRows } from '@mocks/flooringDemo';
import { useFlooringScope } from '../../priority/flooringScope';
import type { SalesMixAction, SalesMixBreakdownRow } from './salesMixBreakdownData';
import { formatMultiple, formatPercent } from './salesMixData';
// Same card, header and grid chrome as the By Attribute breakdown table this replaces.
import styles from './AttributeBreakdownTable.module.css';

const GRID_HEIGHT = 360;
const GRID_ROW_HEIGHT = 46;
const GRID_HEADER_HEIGHT = 48;

const PRODUCTIVITY_TOOLTIP =
  'Productivity index = sales share \u00f7 SKU share. Above 1.0 means sales share is greater than SKU share.';

const formatSales = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const formatGrowth = (value: number) => `${value.toFixed(1)}% vs LY`;

const ACTION_COLOR: Record<SalesMixAction, 'success' | 'default' | 'error'> = {
  Expand: 'success',
  Hold: 'default',
  Rationalize: 'error',
};

/** Above 1.0 the attribute earns more sales share than the SKU share it takes: positive. */
function productivityColor(index: number): 'success' | 'error' | 'default' {
  if (index > 1) return 'success';
  if (index < 1) return 'error';
  return 'default';
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 11L4.25 7.25L5.3 6.1625L7.25 8.1125V2H8.75V8.1125L10.7 6.1625L11.75 7.25L8 11ZM3.5 14C3.0875 14 2.73438 13.8531 2.44063 13.5594C2.14687 13.2656 2 12.9125 2 12.5V10.25H3.5V12.5H12.5V10.25H14V12.5C14 12.9125 13.8531 13.2656 13.5594 13.5594C13.2656 13.8531 12.9125 14 12.5 14H3.5Z"
        fill="#60697D"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="3.5" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="12.5" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
        fill="#394960"
      />
    </svg>
  );
}

const EXPORT_COLUMNS: ExcelExportColumn<SalesMixBreakdownRow>[] = [
  { id: 'name', header: 'Sales Mix', format: 'text', value: (r) => r.name },
  {
    id: 'sellingSkus',
    header: 'Selling SKUs',
    format: 'integer',
    value: (r) => r.sellingSkus,
  },
  { id: 'sales', header: 'Sales', format: 'currency', value: (r) => r.sales },
  ...(['lyRevenue', 'planRevenue', 'plrBaseline', 'r4Sales', 'r13Sales', 'r52Sales', 'salesPerSqFt'] as const).map((id) => ({
    id,
    header: {lyRevenue: 'LY sales', planRevenue: 'Plan', plrBaseline: 'PLR baseline · definition TBC', r4Sales: 'R4 sales · definition TBC', r13Sales: 'R13 sales · definition TBC', r52Sales: 'R52 sales · definition TBC', salesPerSqFt: 'Sales per sq ft · definition TBC'}[id],
    format: 'currency' as const,
    value: (r: SalesMixBreakdownRow) => r[id],
  })),
  { id: 'definitionStatus', header: 'Definition status', format: 'text', value: (r) => r.definitionStatus },
  {
    id: 'growth',
    header: 'Growth',
    format: 'percent',
    value: (r) => r.growth,
  },
  {
    id: 'salesShare',
    header: 'Sales Share',
    format: 'percent',
    value: (r) => r.salesShare,
  },
  {
    id: 'skuShare',
    header: 'SKU Share',
    format: 'percent',
    value: (r) => r.skuShare,
  },
  {
    id: 'productivity',
    header: 'Productivity',
    format: 'number',
    value: (r) => r.productivity,
  },
  { id: 'gm', header: 'GM %', format: 'percent', value: (r) => r.gm },
  {
    id: 'returns',
    header: 'Returns',
    format: 'percent',
    value: (r) => r.returns,
  },
  { id: 'action', header: 'Action', format: 'text', value: (r) => r.action },
];

export interface SalesMixBreakdownTableProps {
  /** Names the table, e.g. the selected attribute ("Brands"). */
  attributeLabel: string;
  attributeId: string | null;
}

/**
 * The Sales Mix breakdown table: one row per attribute value, with its SKUs, sales, growth,
 * sales and SKU share, productivity index, margin, returns and recommended action.
 */
export function SalesMixBreakdownTable({ attributeLabel, attributeId }: SalesMixBreakdownTableProps) {
  const { t } = useTranslation('hindsight');
  const gridRef = useRef<DataGridHandle | null>(null);
  const [columnFiltersVisible, setColumnFiltersVisible] = useState(false);
  const { planCode, referenceSeasonCode } = usePlanContext();
  const { scope } = useFlooringScope(planCode);
  const rows = useMemo(() => getFlooringMixRows(attributeId ?? 'brand', { hierarchyScope: scope }), [attributeId, scope]);

  const {
    download,
    downloading,
    disabled: downloadDisabled,
  } = useExcelDownload({
    getRows: () => gridRef.current?.getDisplayedRows<SalesMixBreakdownRow>() ?? rows,
    columns: EXPORT_COLUMNS,
    fileName: { view: 'sales-mix-breakdown-SS26', planCode },
    sheetName: t('tabs.byAttribute'),
    canExport: rows.length > 0,
    getMetadata: () => ({
      sourceLabel: FLOORING_DEMO_LABEL,
      sourceVersion: 'Priority fix list · 27 Oct 2026',
      scope: { season: 'SS26', planCode, attribute: attributeId, hierarchyScope: scope },
      viewState: gridRef.current?.getExportViewState(),
      definitions: Object.entries(FLOORING_DEFINITIONS).map(([id, definition]) => ({ id, label: id, definition, status: DEFINITION_STATUS })),
    }),
  });

  const columns = useMemo<DataGridColumn<SalesMixBreakdownRow>[]>(
    () => [
      {
        id: 'name',
        header: 'Sales Mix',
        width: 220,
        pinned: 'left',
        lockPinned: true,
        value: (r) => r.name,
      },
      {
        id: 'sellingSkus',
        header: 'Selling SKUs',
        width: 130,
        align: 'end',
        value: (r) => r.sellingSkus,
      },
      {
        id: 'sales',
        header: 'Sales',
        width: 110,
        align: 'end',
        value: (r) => r.sales,
        render: (r) => formatSales(r.sales),
        filterValue: (r) => formatSales(r.sales),
      },
      {
        id: 'growth',
        header: 'Growth',
        width: 150,
        align: 'end',
        value: (r) => r.growth,
        render: (r) => formatGrowth(r.growth),
        filterValue: (r) => formatGrowth(r.growth),
      },
      ...(['lyRevenue', 'planRevenue', 'plrBaseline', 'r4Sales', 'r13Sales', 'r52Sales', 'salesPerSqFt'] as const).map((id): DataGridColumn<SalesMixBreakdownRow> => ({
        id,
        header: { lyRevenue: 'LY sales', planRevenue: 'Plan', plrBaseline: 'PLR baseline · TBC', r4Sales: 'R4 sales · TBC', r13Sales: 'R13 sales · TBC', r52Sales: 'R52 sales · TBC', salesPerSqFt: 'Sales per sq ft · TBC' }[id],
        headerTooltip: id === 'lyRevenue' ? 'Same season last year, synthetic USD.' : 'Synthetic value · definition TBC with F&D. See provisional metric definitions in Overview Summary.',
        width: id === 'salesPerSqFt' ? 200 : 175,
        align: 'end',
        value: (r) => r[id],
        render: (r) => id === 'salesPerSqFt' ? `$${r[id].toFixed(2)}` : formatSales(r[id]),
      })),
      {
        id: 'salesShare',
        header: 'Sales Share',
        width: 130,
        align: 'end',
        value: (r) => r.salesShare,
        render: (r) => formatPercent(r.salesShare),
        filterValue: (r) => formatPercent(r.salesShare),
      },
      {
        id: 'skuShare',
        header: 'SKU Share',
        width: 120,
        align: 'end',
        value: (r) => r.skuShare,
        render: (r) => formatPercent(r.skuShare),
        filterValue: (r) => formatPercent(r.skuShare),
      },
      {
        id: 'productivity',
        header: 'Productivity',
        headerTooltip: PRODUCTIVITY_TOOLTIP,
        width: 140,
        align: 'end',
        value: (r) => r.productivity,
        render: (r) => (
          <Badge
            label={formatMultiple(r.productivity)}
            color={productivityColor(r.productivity)}
            variant="subtle"
          />
        ),
        filterValue: (r) => formatMultiple(r.productivity),
      },
      {
        id: 'gm',
        header: 'GM',
        width: 100,
        align: 'end',
        value: (r) => r.gm,
        render: (r) => formatPercent(r.gm),
        filterValue: (r) => formatPercent(r.gm),
      },
      {
        id: 'returns',
        header: 'Returns',
        width: 110,
        align: 'end',
        value: (r) => r.returns,
        render: (r) => formatPercent(r.returns),
        filterValue: (r) => formatPercent(r.returns),
      },
      {
        id: 'action',
        header: 'Action',
        width: 140,
        value: (r) => r.action,
        render: (r) => (
          <Badge label={r.action} color={ACTION_COLOR[r.action]} variant="subtle" />
        ),
      },
    ],
    [],
  );

  const title = (
    <>
      {`${attributeLabel} - `}
      <span className={styles.subtitle}>{t('attributes.breakdownSubtitle')}</span>
    </>
  );
  const titleAccessible = `${attributeLabel} - ${t('attributes.breakdownSubtitle')}`;

  return (
    <WidgetCard
      title={title}
      data-testid="sales-mix-breakdown"
      className={styles.card}
      action={
        <div className={styles.actions}>
          <Tooltip
            title={t('actions.searchColumns', 'Search columns')}
            variant="tertiary"
          >
            <Button
              variant="text"
              size="large"
              aria-label={t('actions.searchColumns', 'Search columns')}
              aria-pressed={columnFiltersVisible}
              icon={<SearchIcon />}
              data-testid="hindsight-sales-mix-breakdown-search"
              onClick={() => setColumnFiltersVisible((visible) => !visible)}
            />
          </Tooltip>
          <Tooltip title={t('actions.download', 'Download')} variant="tertiary">
            <Button
              variant="text"
              size="large"
              aria-label={
                downloading ? t('states.loading') : t('actions.download', 'Download')
              }
              aria-busy={downloading}
              disabled={downloadDisabled}
              icon={<DownloadIcon />}
              data-testid="hindsight-sales-mix-breakdown-download"
              onClick={() => {
                void download();
              }}
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
              icon={<MoreIcon />}
              data-testid="hindsight-sales-mix-breakdown-more"
              onClick={() => gridRef.current?.showColumnChooser()}
            />
          </Tooltip>
        </div>
      }
    >
      <p className={styles.prototypeNotice}>Synthetic values · R4, R13, R52, sales per sq ft and PLR baseline: definition TBC.</p>
      <DataGrid
        className={styles.grid}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.name}
        ariaLabel={titleAccessible}
        data-testid="hindsight-sales-mix-breakdown-grid"
        status="succeeded"
        height={GRID_HEIGHT}
        rowHeight={GRID_ROW_HEIGHT}
        headerHeight={GRID_HEADER_HEIGHT}
        emptyLabel={t('attributes.tableEmpty')}
        errorLabel={t('states.error')}
        loadingLabel={t('states.loading')}
        retryLabel={t('states.retry')}
        columnChooser
        gridRef={gridRef}
        showColumnFilters={columnFiltersVisible}
      />
    </WidgetCard>
  );
}
