import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@shared/components';
import { TableGlobeToggle } from '@shared/components/visualization';
import type { GlobalException } from '../types/exception';
import type { ViewMode } from '../types/admin';
import { ExceptionsGrid } from './ExceptionsGrid';
import { ExceptionGlobePanel } from './ExceptionGlobePanel';
import styles from './ExceptionsView.module.css';

export interface ExceptionsViewProps {
  rows: GlobalException[];
  loading?: boolean;
  readOnly?: boolean;
  viewMode: ViewMode;
  selectedId: string | null;
  customerType: string;
  searchQuery: string;
  onViewModeChange: (mode: ViewMode) => void;
  onSelect: (id: string) => void;
  onEditRule?: (exceptionId: string, ruleId: string, patch: Partial<GlobalException['rules'][0]>) => void;
  onAddRule?: (exceptionId: string) => void;
  onRemove?: (exceptionId: string) => void;
  onCustomerTypeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function ExceptionsView({
  rows,
  loading = false,
  readOnly = false,
  viewMode,
  selectedId,
  customerType,
  searchQuery,
  onViewModeChange,
  onSelect,
  onEditRule,
  onAddRule,
  onRemove,
  onCustomerTypeChange,
  onSearchChange,
}: ExceptionsViewProps) {
  const { t } = useTranslation('admin');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesType = customerType === 'all' || row.customerType === customerType;
      const matchesSearch =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.geography.name.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [rows, customerType, searchQuery]);

  return (
    <div className={styles.view}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
        <Input
          label={t('exceptions.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <label className={styles.selectLabel}>
          <span>{t('exceptions.customerTypeFilter')}</span>
          <select
            className={styles.select}
            value={customerType}
            onChange={(e) => onCustomerTypeChange(e.target.value)}
          >
            <option value="all">{t('exceptions.allCustomerTypes')}</option>
            <option value="premium">{t('enums.premium')}</option>
            <option value="mainstream">{t('enums.mainstream')}</option>
            <option value="conservative">{t('enums.conservative')}</option>
            <option value="value">{t('enums.value')}</option>
          </select>
        </label>
        </div>
        <TableGlobeToggle value={viewMode} onChange={onViewModeChange} />
      </div>

      {viewMode === 'table' ? (
        <ExceptionsGrid rows={filtered} loading={loading} />
      ) : (
        <ExceptionGlobePanel
          items={filtered}
          selectedId={selectedId}
          readOnly={readOnly}
          onSelect={onSelect}
          onEditRule={onEditRule}
          onAddRule={onAddRule}
          onRemove={onRemove}
        />
      )}
    </div>
  );
}
