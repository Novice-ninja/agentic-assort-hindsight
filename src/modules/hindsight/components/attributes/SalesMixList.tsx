import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@shared/components/data';
import type { DataGridColumn } from '@shared/components/data';
import { ImpactBadge as Badge } from '@shared/components/vendor/impact-ui';
import {
  SALES_MIX_ROWS,
  VS_LY_ABOVE_COLOR,
  VS_LY_BELOW_COLOR,
  VS_LY_THRESHOLD,
  formatMultiple,
  formatPercent,
} from './salesMixData';
import type { SalesMixRow } from './salesMixData';
// Same grid chrome (header cells, borders, cell padding) as the breakdown table below.
import tableStyles from './AttributeBreakdownTable.module.css';
import styles from './SalesMixList.module.css';

const GRID_ROW_HEIGHT = 46;
const GRID_HEADER_HEIGHT = 48;

/** Below 1x reads as a shortfall (negative badge), above 1x as ahead (positive badge). */
function productivityColor(multiple: number): 'error' | 'success' | 'default' {
  if (multiple < 1) return 'error';
  if (multiple > 1) return 'success';
  return 'default';
}

export interface SalesMixListProps {
  rows?: SalesMixRow[];
  /** Row (by name) shown with the hover style, driven by the linked donut. */
  hoveredName?: string | null;
  onHoverChange?: (name: string | null) => void;
}

/**
 * List of the Sales Mix breakdown: five columns, no header menus and no toolbar (the card header
 * owns the download action). Hovering a row is reported out, and the row the donut is hovering
 * is painted with the same hover style.
 */
export function SalesMixList({
  rows = SALES_MIX_ROWS,
  hoveredName,
  onHoverChange,
}: SalesMixListProps) {
  const { t } = useTranslation('hindsight');

  // Moving between cells of one row fires a mouse-out then a mouse-over. Clearing a beat late (and
  // cancelling if a row is entered) stops the linked chart from flickering off between cells.
  const clearTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(clearTimer.current), []);
  const handleRowHover = useCallback(
    (row: SalesMixRow | null) => {
      window.clearTimeout(clearTimer.current);
      if (row) onHoverChange?.(row.name);
      else clearTimer.current = window.setTimeout(() => onHoverChange?.(null), 60);
    },
    [onHoverChange],
  );

  const columns = useMemo<DataGridColumn<SalesMixRow>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        flex: 1,
        value: (r) => r.name,
        // Dot in the row's donut-slice colour, so the list doubles as the chart's legend.
        render: (r) => (
          <span className={styles.nameCell}>
            <span
              className={styles.dot}
              style={{ backgroundColor: r.color }}
              aria-hidden="true"
            />
            {r.name}
          </span>
        ),
      },
      {
        id: 'totalSkus',
        header: 'Total SKUs',
        width: 110,
        align: 'end',
        value: (r) => r.totalSkus,
      },
      {
        id: 'share',
        header: 'Sales share %',
        width: 150,
        align: 'end',
        value: (r) => r.share,
        render: (r) => formatPercent(r.share),
      },
      {
        id: 'vsLy',
        header: 'Vs LY',
        width: 110,
        align: 'end',
        value: (r) => r.vsLy,
        render: (r) => (
          <span
            style={{
              color: r.vsLy < VS_LY_THRESHOLD ? VS_LY_BELOW_COLOR : VS_LY_ABOVE_COLOR,
            }}
          >
            {formatPercent(r.vsLy)}
          </span>
        ),
      },
      {
        id: 'productivity',
        header: 'Productivity',
        width: 130,
        align: 'end',
        value: (r) => r.productivity,
        render: (r) => (
          <Badge
            label={formatMultiple(r.productivity)}
            color={productivityColor(r.productivity)}
            variant="subtle"
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className={styles.list} data-testid="hindsight-sales-mix-list">
      <DataGrid
        className={tableStyles.grid}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.name}
        ariaLabel={t('tabs.byAttribute')}
        data-testid="hindsight-sales-mix-list-grid"
        status="succeeded"
        // No fixed height: the grid sizes itself to its rows, so the pane hugs them.
        rowHeight={GRID_ROW_HEIGHT}
        headerHeight={GRID_HEADER_HEIGHT}
        emptyLabel={t('attributes.tableEmpty')}
        errorLabel={t('states.error')}
        loadingLabel={t('states.loading')}
        retryLabel={t('states.retry')}
        onRowHover={onHoverChange ? handleRowHover : undefined}
        hoveredRowId={hoveredName}
      />
    </div>
  );
}
