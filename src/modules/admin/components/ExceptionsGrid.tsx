import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import type { GridReadyEvent } from 'ag-grid-community';
import { useAgGridThemeClass } from '@shared/components/visualization';
import type { GlobalException } from '../types/exception';
import { getExceptionsColumnDefs } from '../services/gridColumnDefs';
import styles from './ExceptionsGrid.module.css';

export interface ExceptionsGridProps {
  rows: GlobalException[];
  loading?: boolean;
}

export function ExceptionsGrid({ rows, loading = false }: ExceptionsGridProps) {
  const { t } = useTranslation('admin');
  const themeClass = useAgGridThemeClass();
  const gridRef = useRef<AgGridReactType<GlobalException>>(null);

  const columnDefs = useMemo(() => getExceptionsColumnDefs(t), [t]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    [],
  );

  const onGridReady = useCallback((event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  }, []);

  return (
    <div className={[themeClass, styles.grid].join(' ')}>
      <AgGridReact<GlobalException>
        ref={gridRef}
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows
        loading={loading}
        onGridReady={onGridReady}
        domLayout="autoHeight"
      />
    </div>
  );
}
