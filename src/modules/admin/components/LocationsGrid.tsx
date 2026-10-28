import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import type { CellValueChangedEvent, GridReadyEvent } from 'ag-grid-community';
import { useAgGridThemeClass } from '@shared/components/visualization';
import type { AdminLocation } from '../types';
import { getLocationsColumnDefs } from '../services/gridColumnDefs';
import styles from './LocationsGrid.module.css';

export interface LocationsGridProps {
  rows: AdminLocation[];
  loading?: boolean;
  readOnly?: boolean;
  onCellCommit?: (id: string, field: keyof AdminLocation, value: unknown) => void;
}

export function LocationsGrid({
  rows,
  loading = false,
  readOnly = false,
  onCellCommit,
}: LocationsGridProps) {
  const { t } = useTranslation('admin');
  const themeClass = useAgGridThemeClass();
  const gridRef = useRef<AgGridReactType<AdminLocation>>(null);

  const columnDefs = useMemo(() => getLocationsColumnDefs(t, readOnly), [t, readOnly]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    [],
  );

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<AdminLocation>) => {
      if (!event.data || !event.colDef.field || readOnly) return;
      onCellCommit?.(
        event.data.id,
        event.colDef.field as keyof AdminLocation,
        event.newValue,
      );
    },
    [onCellCommit, readOnly],
  );

  const onGridReady = useCallback((event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  }, []);

  return (
    <div className={[themeClass, styles.grid].join(' ')}>
      <AgGridReact<AdminLocation>
        ref={gridRef}
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows
        loading={loading}
        onCellValueChanged={onCellValueChanged}
        onGridReady={onGridReady}
        domLayout="autoHeight"
        stopEditingWhenCellsLoseFocus
      />
    </div>
  );
}
