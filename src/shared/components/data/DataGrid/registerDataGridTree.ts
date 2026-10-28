import type { Module } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

/**
 * Enterprise modules DataGrid needs only when the host opts into tree data.
 * Supplied per grid through `AgGridProvider` so flat Community grids stay free of TreeData.
 */
export const DATA_GRID_TREE_MODULES: Module[] = [TreeDataModule];
