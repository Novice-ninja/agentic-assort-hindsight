import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImpactTooltip as Tooltip, Button } from '@shared/components/vendor/impact-ui';
import { WidgetCard } from '../WidgetCard';
import { SalesMixDonut } from './SalesMixDonut';
import { SalesMixList } from './SalesMixList';
import { makeSalesMixRows, formatMultiple, formatPercent } from './salesMixData';
import type { SalesMixRow } from './salesMixData';
import { useExcelDownload } from '../../hooks/useExcelDownload';
import { usePlanContext } from '../../hooks/usePlanContext';
import type { ExcelExportColumn } from '@shared/components/data/excelExport';
import styles from './SalesMixChartCard.module.css';
import { useFlooringScope } from '../../priority/flooringScope';
import { DEFINITION_STATUS, FLOORING_DEFINITIONS, FLOORING_DEMO_LABEL } from '@mocks/flooringDemo';

const EXPORT_COLUMNS: ExcelExportColumn<SalesMixRow>[] = [
  { id: 'name', header: 'Name', format: 'text', value: (r) => r.name },
  { id: 'totalSkus', header: 'Total SKUs', format: 'integer', value: (r) => r.totalSkus },
  {
    id: 'share',
    header: 'Sales share %',
    format: 'percent',
    value: (r) => r.share,
  },
  { id: 'vsLy', header: 'Vs LY', format: 'percent', value: (r) => r.vsLy },
  {
    id: 'productivity',
    header: 'Productivity',
    format: 'number',
    value: (r) => r.productivity,
  },
];

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

/**
 * White container above the Sales Mix table. Placeholder: the header matches the table's
 * (title left, actions right) but carries only a download action, which exports the list in the second pane.
 */
export function SalesMixChartCard({ attributeId, attributeLabel }: { attributeId: string | null; attributeLabel: string }) {
  const { t } = useTranslation('hindsight');
  // One hover state links the donut and the table: hovering either side lights up the other.
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const { planCode, referenceSeasonCode } = usePlanContext();
  const { scope } = useFlooringScope(planCode);
  const rows = useMemo(() => makeSalesMixRows(attributeId ?? 'brand', { hierarchyScope: scope }), [attributeId, scope]);
  const {
    download,
    downloading,
    disabled: downloadDisabled,
  } = useExcelDownload({
    getRows: () => rows,
    columns: EXPORT_COLUMNS,
    fileName: { view: 'sales-mix-SS26', planCode },
    sheetName: t('tabs.byAttribute'),
    canExport: rows.length > 0,
    getMetadata: () => ({
      sourceLabel: FLOORING_DEMO_LABEL,
      sourceVersion: 'Priority fix list · 27 Oct 2026',
      scope: { season: 'SS26', planCode, attribute: attributeId, hierarchyScope: scope },
      definitions: Object.entries(FLOORING_DEFINITIONS).map(([id, definition]) => ({ id, label: id, definition, status: DEFINITION_STATUS })),
    }),
  });
  const downloadLabel = t('actions.download', 'Download');

  return (
    <WidgetCard
      title={`${t('tabs.byAttribute')} · ${attributeLabel}`}
      className={styles.card}
      data-testid="hindsight-sales-mix-container"
      action={
        <Tooltip title={downloadLabel} variant="tertiary">
          <Button
            variant="text"
            size="large"
            aria-label={downloading ? t('states.loading') : downloadLabel}
            aria-busy={downloading}
            icon={<DownloadIcon />}
            disabled={downloadDisabled}
            onClick={() => {
              void download();
            }}
            data-testid="hindsight-sales-mix-download"
          />
        </Tooltip>
      }
    >
      <div className={styles.panes}>
        <div className={styles.pane} data-testid="hindsight-sales-mix-pane-chart">
          <SalesMixDonut
            rows={rows}
            hoveredName={hoveredName}
            onHoverChange={setHoveredName}
          />
        </div>
        <div className={styles.paneFill} data-testid="hindsight-sales-mix-pane-detail">
          <SalesMixList
            rows={rows}
            hoveredName={hoveredName}
            onHoverChange={setHoveredName}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
