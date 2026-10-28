import type { Module } from 'ag-grid-community';
import { ColumnMenuModule } from 'ag-grid-enterprise';
import { AG_GRID_LICENSE_KEY } from '../agGridLicenseKey';

/**
 * Enterprise modules DataGrid needs only when the host opts into the column chooser.
 * Supplied per grid through `AgGridProvider` so Community-only grids stay free of Enterprise
 * (same pattern as MatrixGrid — research R11).
 */
export const DATA_GRID_COLUMN_CHOOSER_MODULES: Module[] = [ColumnMenuModule];

export const DATA_GRID_LICENSE_KEY: string = AG_GRID_LICENSE_KEY;
