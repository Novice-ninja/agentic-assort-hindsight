import type { ColDef, ColGroupDef, ValueFormatterParams } from 'ag-grid-community';
import type { TFunction } from 'i18next';
import type { AdminLocation, AdminProduct } from '../types';
import type { GlobalException } from '../types/exception';
import {
  CUSTOMER_TYPE_OPTIONS,
  FULFILLMENT_TYPE_OPTIONS,
  INCOME_LEVEL_OPTIONS,
  LOCATION_CLIMATE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
} from '../types/location';
import { ruleSummary } from './adminMappers';
import { BrandPillCell } from '../components/cells/BrandPillCell';
import { ColourSwatchCell } from '../components/cells/ColourSwatchCell';

const dashFormatter = (params: ValueFormatterParams) =>
  params.value == null || params.value === '' ? '--' : String(params.value);

function enumValues<T extends string>(options: T[]): string[] {
  return [...options];
}

export function getProductsColumnDefs(
  t: TFunction<'admin'>,
): (ColDef<AdminProduct> | ColGroupDef<AdminProduct>)[] {
  // Flat column set matching the reference products table (no header groups).
  return [
    {
      field: 'styleColourId',
      headerName: t('grid.products.id'),
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellClass: 'ag-cell-strong ag-cell-id',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'name',
      headerName: t('grid.products.name'),
      flex: 1,
      minWidth: 180,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'dept',
      headerName: t('grid.products.dept'),
      cellClass: 'ag-cell-strong',
      width: 120,
      filter: 'agTextColumnFilter',
    },
    { field: 'class', headerName: t('grid.products.class'), width: 120, filter: 'agTextColumnFilter' },
    {
      field: 'brand',
      headerName: t('grid.products.brand'),
      cellRenderer: BrandPillCell,
      width: 130,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'colour',
      headerName: t('grid.products.colour'),
      cellRenderer: ColourSwatchCell,
      width: 140,
      sortable: false,
      filter: false,
    },
    {
      field: 'collar',
      headerName: t('grid.products.collar'),
      valueFormatter: dashFormatter,
      width: 120,
    },
    { field: 'fit', headerName: t('grid.products.fit'), width: 110 },
    {
      field: 'sleeve',
      headerName: t('grid.products.sleeve'),
      valueFormatter: dashFormatter,
      width: 110,
    },
  ];
}

export function getLocationsColumnDefs(
  t: TFunction<'admin'>,
  readOnly: boolean,
): (ColDef<AdminLocation> | ColGroupDef<AdminLocation>)[] {
  const editable = !readOnly;

  const enumCol = (
    field: keyof AdminLocation,
    headerKey: string,
    options: string[],
  ): ColDef<AdminLocation> => ({
    field,
    headerName: t(headerKey as never),
    editable,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: enumValues(options) },
    valueFormatter: (params) =>
      params.value ? t(`enums.${String(params.value)}` as never) : '–',
    width: 150,
  });

  return [
    {
      headerName: t('grid.locations.groupLocation'),
      children: [
        {
          field: 'id',
          headerName: t('grid.locations.id'),
          pinned: 'left',
          width: 100,
          cellClass: 'ag-cell-link',
        },
        {
          field: 'name',
          headerName: t('grid.locations.name'),
          flex: 1,
          minWidth: 140,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'city',
          headerName: t('grid.locations.city'),
          width: 120,
          filter: 'agTextColumnFilter',
        },
      ],
    },
    {
      headerName: t('grid.locations.groupAttributes'),
      children: [
        enumCol('climate', 'grid.locations.climate', LOCATION_CLIMATE_OPTIONS),
        enumCol('customerType', 'grid.locations.customerType', CUSTOMER_TYPE_OPTIONS),
        enumCol('fulfillmentType', 'grid.locations.fulfillment', FULFILLMENT_TYPE_OPTIONS),
        enumCol('incomeLevel', 'grid.locations.income', INCOME_LEVEL_OPTIONS),
        enumCol('locationType', 'grid.locations.type', LOCATION_TYPE_OPTIONS),
      ],
    },
  ];
}

export function getExceptionsColumnDefs(t: TFunction<'admin'>): ColDef<GlobalException>[] {
  return [
    {
      field: 'geography.name',
      headerName: t('grid.exceptions.geography'),
      valueGetter: (params) => params.data?.geography.name,
      width: 140,
    },
    {
      field: 'id',
      headerName: t('grid.exceptions.id'),
      width: 90,
    },
    {
      field: 'type',
      headerName: t('grid.exceptions.type'),
      width: 100,
    },
    {
      field: 'customerType',
      headerName: t('grid.exceptions.customerType'),
      valueFormatter: (params) =>
        params.value ? t(`enums.${String(params.value)}` as never) : '–',
      width: 140,
    },
    {
      colId: 'summary',
      headerName: t('grid.exceptions.summary'),
      valueGetter: (params) => (params.data ? ruleSummary(params.data.rules) : ''),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'addedBy',
      headerName: t('grid.exceptions.owner'),
      width: 140,
    },
  ];
}
