import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import type { GridReadyEvent } from 'ag-grid-community';
import { IconButton } from '@shared/components';
import { useAgGridThemeClass } from '@shared/components/visualization';
import type { AdminProduct } from '../types';
import { getProductsColumnDefs } from '../services/gridColumnDefs';
import styles from './ProductsGrid.module.css';

export interface ProductsGridProps {
  rows: AdminProduct[];
  loading?: boolean;
  readOnly?: boolean;
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="6" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="18" r="1.8" />
    </svg>
  );
}

export function ProductsGrid({ rows, loading = false, readOnly = false }: ProductsGridProps) {
  const { t } = useTranslation('admin');
  const themeClass = useAgGridThemeClass();
  const gridRef = useRef<AgGridReactType<AdminProduct>>(null);

  const columnDefs = useMemo(() => getProductsColumnDefs(t), [t]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      suppressMovable: readOnly,
    }),
    [readOnly],
  );

  const onGridReady = useCallback((event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  }, []);

  return (
    <section className={styles.card} aria-label={t('modules.products')}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t('modules.products')}</h2>
        <div className={styles.actions}>
          <IconButton aria-label={t('grid.moreActions')} className={styles.moreBtn}>
            <MoreIcon />
          </IconButton>
        </div>
      </header>

      <div className={[themeClass, styles.grid].join(' ')}>
        <AgGridReact<AdminProduct>
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection
          animateRows
          rowHeight={40}
          headerHeight={40}
          loading={loading}
          onGridReady={onGridReady}
          domLayout="autoHeight"
        />
      </div>
    </section>
  );
}
