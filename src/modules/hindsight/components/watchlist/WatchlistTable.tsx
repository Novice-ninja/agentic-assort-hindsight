import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ImpactBadge as Badge,
  ImpactTooltip as Tooltip,
  Button,
} from '@shared/components/vendor/impact-ui';
import { DataGrid } from '@shared/components/data';
import type { DataGridColumn, DataGridHandle } from '@shared/components/data';
import type { ExcelExportColumn } from '@shared/components/data/excelExport';
import { useExcelDownload } from '../../hooks/useExcelDownload';
import { usePlanContext } from '../../hooks/usePlanContext';
import { WidgetCard } from '../WidgetCard';
import { WATCHLIST_ROWS } from './watchlistData';
import type { WatchlistRow } from './watchlistData';
import styles from './WatchlistTable.module.css';

const GRID_ROW_HEIGHT = 46;
const GRID_HEADER_HEIGHT = 48;
/** Card max is 700px; minus 24px padding, 32px header and 16px gap leaves 628px for the grid. */
const GRID_MAX_HEIGHT = 628;
const GRID_HEIGHT = Math.min(
  WATCHLIST_ROWS.length * GRID_ROW_HEIGHT + GRID_HEADER_HEIGHT,
  GRID_MAX_HEIGHT,
);

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

/** "Velocity; GM floor" -> ["Velocity", "GM floor"]. */
const splitReasons = (why: string) =>
  why
    .split(';')
    .map((reason) => reason.trim())
    .filter((reason) => reason.length > 0);

const EXPORT_COLUMNS: ExcelExportColumn<WatchlistRow>[] = [
  { id: 'productId', header: 'Product ID', format: 'text', value: (r) => r.productId },
  {
    id: 'description',
    header: 'Product Description',
    format: 'text',
    value: (r) => r.description,
  },
  { id: 'priority', header: 'Priority', format: 'text', value: () => 'Critical' },
  { id: 'sales', header: 'Sales', format: 'text', value: (r) => r.sales },
  {
    id: 'growthVsLy',
    header: 'Growth vs LY',
    format: 'text',
    value: (r) => r.growthVsLy,
  },
  { id: 'gm', header: 'GM', format: 'text', value: (r) => r.gm },
  { id: 'dos', header: 'DOS', format: 'text', value: (r) => r.dos },
  { id: 'why', header: 'Why', format: 'text', value: (r) => r.why },
];

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

/**
 * Watchlist table. Placeholder: columns and rows are local to this file (see `watchlistData`),
 * independent of the By Attribute table, and will be reworked with the final design.
 */
export function WatchlistTable() {
  const { t } = useTranslation('hindsight');
  const { planCode, referenceSeasonCode } = usePlanContext();
  const {
    download,
    downloading,
    disabled: downloadDisabled,
  } = useExcelDownload({
    getRows: () => WATCHLIST_ROWS,
    columns: EXPORT_COLUMNS,
    fileName: { view: 'watchlist', planCode, seasonCode: referenceSeasonCode },
    sheetName: t('watchlist.tableTitle'),
    canExport: WATCHLIST_ROWS.length > 0,
  });
  const gridRef = useRef<DataGridHandle | null>(null);
  const [columnFiltersVisible, setColumnFiltersVisible] = useState(false);

  const columns = useMemo<DataGridColumn<WatchlistRow>[]>(
    () => [
      {
        id: 'productId',
        header: 'Product ID',
        width: 120,
        pinned: 'left',
        value: (row) => row.productId,
      },
      {
        id: 'description',
        header: 'Product Description',
        width: 360,
        value: (row) => row.description,
      },
      {
        id: 'priority',
        header: 'Priority',
        width: 120,
        value: (row) => row.priority,
        render: () => <Badge label="Critical" color="error" variant="subtle" />,
      },
      {
        id: 'sales',
        header: 'Sales',
        width: 110,
        align: 'end',
        value: (row) => row.sales,
      },
      {
        id: 'growthVsLy',
        header: 'Growth vs LY',
        width: 150,
        align: 'end',
        value: (row) => row.growthVsLy,
      },
      { id: 'gm', header: 'GM', width: 100, align: 'end', value: (row) => row.gm },
      { id: 'dos', header: 'DOS', width: 100, align: 'end', value: (row) => row.dos },
      {
        id: 'why',
        header: 'Why',
        width: 460,
        value: (row) => row.why,
        render: (row) => (
          <span className={styles.reasons}>
            {splitReasons(row.why).map((reason) => (
              <Badge key={reason} label={reason} color="default" variant="subtle" />
            ))}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <WidgetCard
      title={t('watchlist.tableTitle')}
      data-testid="watchlist-table"
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
              data-testid="hindsight-watchlist-table-search"
              onClick={() => setColumnFiltersVisible((visible) => !visible)}
            />
          </Tooltip>
          <Tooltip
            title={t('actions.downloadWatchlist', 'Download watchlist')}
            variant="tertiary"
          >
            <Button
              variant="text"
              size="large"
              aria-label={
                downloading
                  ? t('states.loading')
                  : t('actions.downloadWatchlist', 'Download watchlist')
              }
              aria-busy={downloading}
              disabled={downloadDisabled}
              icon={<DownloadIcon />}
              data-testid="hindsight-watchlist-table-download"
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
              data-testid="hindsight-watchlist-table-more"
              onClick={() => gridRef.current?.showColumnChooser()}
            />
          </Tooltip>
        </div>
      }
    >
      <DataGrid
        className={styles.grid}
        columns={columns}
        rows={WATCHLIST_ROWS}
        getRowId={(row) => row.productId}
        ariaLabel={t('watchlist.tableTitle')}
        data-testid="hindsight-watchlist-table-grid"
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
