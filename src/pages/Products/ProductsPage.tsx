import { useTranslation } from 'react-i18next';
import { ProductTable, useProducts } from '@modules/products';
import styles from './ProductsPage.module.css';

export function ProductsPage() {
  const { t } = useTranslation('products');
  const { items, status, sort, selectedIds, changeSort, changeSelection } = useProducts();

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('products.title')}</h1>
        <p className={styles.subtitle}>{t('products.subtitle')}</p>
      </header>
      <ProductTable
        products={items}
        loading={status === 'loading'}
        sort={sort}
        selectedIds={selectedIds}
        onSortChange={changeSort}
        onSelectionChange={changeSelection}
      />
    </div>
  );
}
