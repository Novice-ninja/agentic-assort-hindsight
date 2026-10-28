import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid, type DataGridColumn, type DataGridHandle } from '@shared/components/data';
import { AIStrip } from '@shared/components/primitives';
import { Button, ImpactBadge, ImpactTooltip as Tooltip } from '@shared/components/vendor/impact-ui';
import type { LoadStatus } from '@shared/types';
import type { ClusterPlanKpiColumn, ClusterPlanRow } from '../api/getClusterPlans';
import type { KpiBreakdownColumn, KpiBreakdownRow } from '../api/getKpiBreakdown';
import { downloadCsv } from '../services/exportPlansCsv';
import {
  CLUSTER_PLANS_CSV_FILENAME,
  KPI_BREAKDOWN_CSV_FILENAME,
  exportClusterPlanKpiCsv,
  exportKpiBreakdownTableCsv,
  formatClusterPlanCell,
  formatKpiBreakdownValue,
  visibleClusterPlanColumns,
  kpiBreakdownClusterLabel,
} from '../services/exportClusterSummaryCsv';
import { ClusterNameCell } from './ClusterNameCell';
import styles from './wizard.module.css';

const HEADER_HEIGHT = 80;
const BREAKDOWN_HEADER_HEIGHT = 48;
const FILTER_ROW_HEIGHT = 36;
const ROW_HEIGHT = 46;
const LOADING_ROW_COUNT = 6;
const EMPTY_REGION = '-';

function DownloadIcon() {
  return (
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
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="14" height="4" viewBox="0 0 14 4" fill="none" aria-hidden="true">
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      <circle cx="7" cy="2" r="1.5" fill="currentColor" />
      <circle cx="12" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 4.00714L11.9929 3L8 6.99286L4.00714 3L3 4.00714L6.99286 8L3 11.9929L4.00714 13L8 9.00714L11.9929 13L13 11.9929L9.00714 8L13 4.00714Z"
        fill="#60697D"
      />
    </svg>
  );
}

export interface ClusterSummaryTableProps {
  rows: ClusterPlanRow[];
  kpiColumns: ClusterPlanKpiColumn[];
  isLoading?: boolean;
  locked?: boolean;
  onRename: (clusterName: string, suggestedName: string) => void;
  breakdownRows?: KpiBreakdownRow[];
  breakdownColumns?: KpiBreakdownColumn[];
  breakdownLoading?: boolean;
  /**
   * AI narration from `POST /v1/summarize` (`cardType: 'cluster_performance'`). `idle` renders
   * no strip; `loading` the gathering state; `failed` the unavailable copy with a retry.
   */
  summary?: string | null;
  summaryStatus?: LoadStatus;
  onRetrySummary?: () => void;
}

function gridHeight(
  rowCount: number,
  headerHeight = HEADER_HEIGHT,
  showColumnFilters = false,
): number {
  return (
    headerHeight +
    (showColumnFilters ? FILTER_ROW_HEIGHT : 0) +
    Math.max(rowCount, 1) * ROW_HEIGHT
  );
}

function columnAlign(key: string, sample: ClusterPlanRow | undefined): 'start' | 'end' {
  if (key === 'stores' || /pct$/i.test(key)) return 'end';
  if (sample !== undefined && typeof sample[key] === 'number') return 'end';
  return 'start';
}

export function ClusterSummaryTable({
  rows,
  kpiColumns,
  isLoading = false,
  locked,
  onRename,
  breakdownRows = [],
  breakdownColumns = [],
  breakdownLoading = false,
  summary = null,
  summaryStatus = 'idle',
  onRetrySummary,
}: ClusterSummaryTableProps) {
  const { t, i18n } = useTranslation(['clustering', 'common']);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [plansFiltersVisible, setPlansFiltersVisible] = useState(false);
  const [breakdownFiltersVisible, setBreakdownFiltersVisible] = useState(false);
  const plansGridRef = useRef<DataGridHandle | null>(null);
  const breakdownGridRef = useRef<DataGridHandle | null>(null);
  const emptyLabel = t('common:states.empty');
  const showBreakdown = breakdownLoading || breakdownRows.length > 0;
  const showGrid = isLoading || rows.length > 0;
  const visible = useMemo(() => visibleClusterPlanColumns(kpiColumns), [kpiColumns]);
  const numericKeySignature = rows[0]
    ? Object.entries(rows[0])
        .filter(([, value]) => typeof value === 'number')
        .map(([key]) => key)
        .join('|')
    : '';

  const columns = useMemo<DataGridColumn<ClusterPlanRow>[]>(
    () =>
      visible.map((column) => {
        const key = column.value;
        if (key === 'clusterName') {
          return {
            id: key,
            header: column.label,
            flex: 2,
            width: 180,
            lockVisible: true,
            value: (row) => row.clusterName,
            render: (row) => (
              <ClusterNameCell
                clusterId={row.originalClusterName || row.clusterName}
                name={row.clusterName}
                locked={locked}
                ariaLabel={column.label}
                onRename={onRename}
              />
            ),
          };
        }
        return {
          id: key,
          header: column.label,
          align: columnAlign(
            key,
            numericKeySignature.split('|').includes(key)
              ? ({ [key]: 0 } as ClusterPlanRow)
              : undefined,
          ),
          flex: 1,
          width: 96,
          value: (row) => row[key] ?? null,
          filterValue: (row) => formatClusterPlanCell(key, row, i18n.language),
          render: (row) => formatClusterPlanCell(key, row, i18n.language),
        };
      }),
    [i18n.language, locked, numericKeySignature, onRename, visible],
  );

  const breakdownGridColumns = useMemo<DataGridColumn<KpiBreakdownRow>[]>(() => {
    const identity: DataGridColumn<KpiBreakdownRow>[] = [
      {
        id: 'cluster',
        header: t('finalize.kpiCluster'),
        flex: 1.1,
        width: 110,
        lockVisible: true,
        value: (row) => kpiBreakdownClusterLabel(row),
        render: (row) => kpiBreakdownClusterLabel(row),
      },
      {
        id: 'displayName',
        header: t('finalize.clusterDisplayName'),
        flex: 1.4,
        width: 150,
        value: (row) => row.clusterName,
        render: (row) => row.clusterName,
      },
      {
        id: 'stores',
        header: t('finalize.stores'),
        align: 'end',
        flex: 0.8,
        width: 80,
        value: (row) => row.stores,
        render: (row) => String(row.stores),
      },
      {
        id: 'storeCode',
        header: t('finalize.storeCode'),
        flex: 1,
        width: 110,
        value: (row) => row.stores,
        filterValue: (row) => t('finalize.storeCodeCount', { count: row.stores }),
        render: (row) => t('finalize.storeCodeCount', { count: row.stores }),
      },
      {
        id: 'region',
        header: t('finalize.region'),
        flex: 0.8,
        width: 90,
        value: () => EMPTY_REGION,
        render: () => EMPTY_REGION,
      },
    ];
    const metrics: DataGridColumn<KpiBreakdownRow>[] = breakdownColumns.map((column) => ({
      id: column.value,
      header: column.label,
      align: 'end',
      flex: 1,
      width: 110,
      value: (row) => {
        const cell = row[column.value];
        return Array.isArray(cell) ? null : (cell ?? null);
      },
      filterValue: (row) => {
        const cell = row[column.value];
        return formatKpiBreakdownValue(
          column.value,
          Array.isArray(cell) ? undefined : cell,
          i18n.language,
        );
      },
      render: (row) => {
        const cell = row[column.value];
        return formatKpiBreakdownValue(
          column.value,
          Array.isArray(cell) ? undefined : cell,
          i18n.language,
        );
      },
    }));
    return [...identity, ...metrics];
  }, [breakdownColumns, i18n.language, t]);

  const download = useCallback(
    (filename: string) => {
      if (rows.length === 0) return;
      downloadCsv(filename, exportClusterPlanKpiCsv(rows, kpiColumns, i18n.language));
    },
    [i18n.language, kpiColumns, rows],
  );

  const downloadBreakdown = useCallback(() => {
    if (breakdownRows.length === 0) return;
    downloadCsv(
      KPI_BREAKDOWN_CSV_FILENAME,
      exportKpiBreakdownTableCsv(breakdownRows, breakdownColumns, {
        locale: i18n.language,
        displayName: t('finalize.clusterDisplayName'),
        stores: t('finalize.stores'),
        storeCode: t('finalize.storeCode'),
        region: t('finalize.region'),
        storeCodeCount: (count) => t('finalize.storeCodeCount', { count }),
        emptyRegion: EMPTY_REGION,
      }),
    );
  }, [breakdownColumns, breakdownRows, i18n.language, t]);

  return (
    <section className={styles.clusterPlansCard}>
      <div className={styles.clusterPlansToolbar}>
        <div className={styles.clusterTableTitle}>
          <span className={styles.clusterPlansTitle}>{t('finalize.clusterPlansTitle')}</span>
          <ImpactBadge label={String(rows.length)} variant="subtle" color="info" size="small" />
        </div>
        <div className={styles.clusterPlansActions}>
          {/* TODO: Add add/remove stores button functionality later */}
          {/* <Button variant="outlined" size="large" disabled>
            {t('finalize.addRemoveStores')}
          </Button> */}
          <Button
            variant="secondary"
            size="large"
            onClick={() => setBreakdownOpen((open) => !open)}
            aria-expanded={breakdownOpen}
          >
            {breakdownOpen ? t('finalize.kpiBreakdownHide') : t('finalize.kpiBreakdown')}
          </Button>
          <span className={styles.gridToolbarDivider} aria-hidden="true" />
          <Tooltip title={t('dashboard.searchColumns')} variant="tertiary">
            <Button
              variant="text"
              size="large"
              aria-label={t('dashboard.searchColumns')}
              aria-pressed={plansFiltersVisible}
              icon={<SearchIcon />}
              disabled={rows.length === 0}
              onClick={() => setPlansFiltersVisible((visible) => !visible)}
              data-testid="cluster-summary-search-button"
            />
          </Tooltip>
          <Tooltip title={t('finalize.downloadClusterPlans')} variant="tertiary">
            <Button
              variant="text"
              size="large"
              aria-label={t('finalize.downloadClusterPlans')}
              icon={<DownloadIcon />}
              onClick={() => download(CLUSTER_PLANS_CSV_FILENAME)}
              disabled={rows.length === 0}
            />
          </Tooltip>
          <Tooltip title={t('dashboard.chooseColumns')} variant="tertiary">
            <Button
              variant="text"
              size="large"
              aria-label={t('dashboard.chooseColumns')}
              icon={<MoreIcon />}
              disabled={rows.length === 0}
              onClick={() => plansGridRef.current?.showColumnChooser()}
              data-testid="cluster-summary-more-button"
            />
          </Tooltip>
        </div>
      </div>
      {summaryStatus === 'loading' ? (
        <AIStrip className={styles.clusterPlansAiStrip} text="" loading />
      ) : null}
      {summaryStatus === 'succeeded' && summary ? (
        <AIStrip
          className={styles.clusterPlansAiStrip}
          text={summary}
          showAskButton={false}
        />
      ) : null}
      {summaryStatus === 'failed' ? (
        <div
          className={[styles.insightFallbackRow, styles.clusterPlansAiStrip].join(' ')}
          role="status"
        >
          <AIStrip
            className={styles.reviewAiStrip}
            text={t('finalize.insightUnavailable')}
            showTooltip={false}
          />
          {onRetrySummary ? (
            <button type="button" className={styles.viewAssignment} onClick={onRetrySummary}>
              {t('finalize.insightRetry')}
            </button>
          ) : null}
        </div>
      ) : null}
      {showGrid ? (
        <DataGrid
          className={styles.clusterPlansGrid}
          columns={columns}
          rows={rows}
          getRowId={(row) => row.originalClusterName || row.clusterName}
          ariaLabel={t('finalize.clusterPlansTitle')}
          status={isLoading ? 'loading' : 'succeeded'}
          loadingLabel={t('common:states.loading')}
          emptyLabel={emptyLabel}
          rowHeight={ROW_HEIGHT}
          headerHeight={HEADER_HEIGHT}
          height={
            isLoading && rows.length === 0
              ? gridHeight(LOADING_ROW_COUNT, HEADER_HEIGHT, plansFiltersVisible)
              : gridHeight(rows.length, HEADER_HEIGHT, plansFiltersVisible)
          }
          columnChooser
          gridRef={plansGridRef}
          showColumnFilters={plansFiltersVisible}
        />
      ) : (
        <p className={styles.clusterPlansEmpty} role="status">
          {emptyLabel}
        </p>
      )}
      {breakdownOpen ? (
        <div className={styles.kpiBreakdownContainer}>
          <div className={styles.kpiBreakdownCard}>
            <div className={styles.clusterPlansToolbar}>
              <span className={styles.clusterPlansTitle}>{t('finalize.kpiTitle')}</span>
              <div className={styles.clusterPlansActions}>
                <Tooltip title={t('dashboard.searchColumns')} variant="tertiary">
                  <Button
                    variant="text"
                    size="large"
                    aria-label={t('dashboard.searchColumns')}
                    aria-pressed={breakdownFiltersVisible}
                    icon={<SearchIcon />}
                    disabled={breakdownRows.length === 0}
                    onClick={() => setBreakdownFiltersVisible((visible) => !visible)}
                    data-testid="kpi-breakdown-search-button"
                  />
                </Tooltip>
                <Tooltip title={t('finalize.downloadKpiBreakdown')} variant="tertiary">
                  <Button
                    variant="text"
                    size="large"
                    aria-label={t('finalize.downloadKpiBreakdown')}
                    icon={<DownloadIcon />}
                    onClick={downloadBreakdown}
                    disabled={breakdownRows.length === 0}
                  />
                </Tooltip>
                <Tooltip title={t('dashboard.chooseColumns')} variant="tertiary">
                  <Button
                    variant="text"
                    size="large"
                    aria-label={t('dashboard.chooseColumns')}
                    icon={<MoreIcon />}
                    disabled={breakdownRows.length === 0}
                    onClick={() => breakdownGridRef.current?.showColumnChooser()}
                    data-testid="kpi-breakdown-more-button"
                  />
                </Tooltip>
                <span className={styles.gridToolbarDivider} aria-hidden="true" />
                <Tooltip title={t('finalize.kpiClose', 'Close')} variant="tertiary">
                  <Button
                    variant="text"
                    size="large"
                    aria-label={t('finalize.kpiClose', 'Close')}
                    icon={<CloseIcon />}
                    onClick={() => setBreakdownOpen(false)}
                  >
                    {t('finalize.kpiClose', 'Close')}
                  </Button>
                </Tooltip>
              </div>
            </div>
            {showBreakdown ? (
              <DataGrid
                className={`${styles.clusterPlansGrid} ${styles.kpiBreakdownGrid}`}
                columns={breakdownGridColumns}
                rows={breakdownRows}
                getRowId={(row) => row.clusterName}
                ariaLabel={t('finalize.kpiTitle')}
                status={breakdownLoading ? 'loading' : 'succeeded'}
                loadingLabel={t('common:states.loading')}
                emptyLabel={emptyLabel}
                rowHeight={ROW_HEIGHT}
                headerHeight={BREAKDOWN_HEADER_HEIGHT}
                height={
                  breakdownLoading && breakdownRows.length === 0
                    ? gridHeight(
                        LOADING_ROW_COUNT,
                        BREAKDOWN_HEADER_HEIGHT,
                        breakdownFiltersVisible,
                      )
                    : gridHeight(
                        breakdownRows.length,
                        BREAKDOWN_HEADER_HEIGHT,
                        breakdownFiltersVisible,
                      )
                }
                columnChooser
                gridRef={breakdownGridRef}
                showColumnFilters={breakdownFiltersVisible}
              />
            ) : (
              <p className={styles.clusterPlansEmpty} role="status">
                {emptyLabel}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
