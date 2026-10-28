import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, DataTable } from '@shared/components';
import type { Column, SortState } from '@shared/components';
import { formatCurrency, formatDate } from '@shared/utils';
import type { Product } from '../types';
import { sortProducts, statusToBadgeVariant } from '../services/productMapper';

export interface ProductTableProps {
  products: Product[];
  loading: boolean;
  sort?: SortState;
  selectedIds: string[];
  onSortChange: (sort: SortState) => void;
  onSelectionChange: (ids: string[]) => void;
}

export function ProductTable({
  products,
  loading,
  sort,
  selectedIds,
  onSortChange,
  onSelectionChange,
}: ProductTableProps) {
  const { t, i18n } = useTranslation('products');

  const data = useMemo(
    () => (sort ? sortProducts(products, sort.key, sort.direction) : products),
    [products, sort],
  );

  const columns: Column<Product>[] = [
    { key: 'name', header: t('products.columns.name'), sortable: true },
    { key: 'category', header: t('products.columns.category'), sortable: true },
    {
      key: 'status',
      header: t('products.columns.status'),
      render: (row) => (
        <Badge variant={statusToBadgeVariant(row.status)}>
          {t(`products.status.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: t('products.columns.price'),
      align: 'end',
      sortable: true,
      render: (row) => formatCurrency(row.price, i18n.language),
    },
    {
      key: 'updatedAt',
      header: t('products.columns.updatedAt'),
      render: (row) => formatDate(row.updatedAt, i18n.language),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(row) => row.id}
      caption={t('products.title')}
      loading={loading}
      selectable
      sort={sort}
      onSortChange={onSortChange}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
    />
  );
}
