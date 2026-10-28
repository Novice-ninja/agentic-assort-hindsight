import {
  CellApiModule,
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  DragAndDropModule,
  EventApiModule,
  LocaleModule,
  PinnedRowModule,
  RenderApiModule,
  RowApiModule,
  RowSelectionModule,
  RowStyleModule,
  ScrollApiModule,
  TextEditorModule,
  TooltipModule,
  ValidationModule,
} from 'ag-grid-community';
import type { Module } from 'ag-grid-community';
import {
  AggregationModule,
  CellSelectionModule,
  ClipboardModule,
  PivotModule,
  RowGroupingModule,
  TreeDataModule,
} from 'ag-grid-enterprise';
import { isDev } from '@config/env';
import { AG_GRID_LICENSE_KEY } from '../agGridLicenseKey';

/**
 * The modules MatrixGrid needs, supplied per grid through `AgGridProvider` rather than registered
 * globally (research R11). Registering Enterprise globally would put it in the shell bundle and
 * hand its features to every other grid in the app, which is not what any of them asked for.
 *
 * Deliberately absent: `UndoRedoEditModule`. Under `readOnlyEdit` the grid never owns the data, so
 * its undo stack would replay against a dataset it does not control; `logic/editJournal.ts` owns
 * undo instead (research R5).
 *
 * The community modules are listed even though `registerAgGrid.ts` registers `AllCommunityModule`
 * globally today, so the grid stays correct in any host that has not done that — Storybook, a
 * test harness, or a future entry point. Column groups, pinning, resizing, and keyboard navigation
 * need no module in v36: they are part of the grid core.
 */
export const MATRIX_GRID_MODULES: Module[] = [
  // Row model and the api surface the adapter calls.
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  CellApiModule,
  ColumnApiModule,
  EventApiModule,
  RenderApiModule,
  RowApiModule,
  ScrollApiModule,
  // Structure: the pinned grand total row, and column reordering.
  PinnedRowModule,
  DragAndDropModule,
  // Presentation and interaction.
  CellStyleModule,
  RowStyleModule,
  RowSelectionModule,
  TooltipModule,
  // `getLocaleText` is what routes AG Grid's own chrome through react-i18next (research R12).
  LocaleModule,
  /*
   * Only the text editor. `agNumberCellEditor` would hand back a browser-parsed number, which reads
   * the Spanish `1.234,56` as 1.234 before the adapter ever sees it; every edit therefore arrives as
   * text and goes through `parseLocaleNumber` (research R14).
   */
  TextEditorModule,
  // Enterprise: hierarchy, aggregation, pivot, rectangular selection, clipboard.
  TreeDataModule,
  RowGroupingModule,
  AggregationModule,
  PivotModule,
  CellSelectionModule,
  ClipboardModule,
  /*
   * Development only. It turns a misconfigured grid into a console error naming the option, which
   * is worth its weight while this component is young — and worth nothing to a user in production.
   */
  ...(isDev ? [ValidationModule] : []),
];

/**
 * Temporary hardcoded AG Grid Enterprise licence (see `agGridLicenseKey.ts`).
 */
export const MATRIX_GRID_LICENSE_KEY: string = AG_GRID_LICENSE_KEY;
