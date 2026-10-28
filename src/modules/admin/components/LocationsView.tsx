import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@shared/components';
import { TableGlobeToggle } from '@shared/components/visualization';
import type { AdminLocation } from '../types';
import type { ViewMode } from '../types/admin';
import { LocationsGrid } from './LocationsGrid';
import { LocationGlobePanel } from './LocationGlobePanel';
import styles from './LocationsView.module.css';

export interface LocationsViewProps {
  rows: AdminLocation[];
  loading?: boolean;
  readOnly?: boolean;
  viewMode: ViewMode;
  selectedId: string | null;
  customerType: string;
  searchQuery: string;
  onViewModeChange: (mode: ViewMode) => void;
  onSelect: (id: string) => void;
  onCellCommit?: (id: string, field: keyof AdminLocation, value: unknown) => void;
  onAttributeChange?: (id: string, field: keyof AdminLocation, value: string) => void;
  onCustomerTypeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function LocationsView({
  rows,
  loading = false,
  readOnly = false,
  viewMode,
  selectedId,
  customerType,
  searchQuery,
  onViewModeChange,
  onSelect,
  onCellCommit,
  onAttributeChange,
  onCustomerTypeChange,
  onSearchChange,
}: LocationsViewProps) {
  const { t } = useTranslation('admin');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesType = customerType === 'all' || row.customerType === customerType;
      const matchesSearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        (row.city?.toLowerCase().includes(q) ?? false);
      return matchesType && matchesSearch;
    });
  }, [rows, customerType, searchQuery]);

  return (
    <div className={styles.view}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
        <Input
          label={t('locations.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <label className={styles.selectLabel}>
          <span>{t('locations.customerTypeFilter')}</span>
          <select
            className={styles.select}
            value={customerType}
            onChange={(e) => onCustomerTypeChange(e.target.value)}
          >
            <option value="all">{t('locations.allCustomerTypes')}</option>
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
        <LocationsGrid
          rows={filtered}
          loading={loading}
          readOnly={readOnly}
          onCellCommit={onCellCommit}
        />
      ) : (
        <LocationGlobePanel
          items={filtered}
          selectedId={selectedId}
          readOnly={readOnly}
          onSelect={onSelect}
          onAttributeChange={onAttributeChange}
        />
      )}
    </div>
  );
}
