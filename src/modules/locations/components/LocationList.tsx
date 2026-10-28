import { useTranslation } from 'react-i18next';
import { Badge, DataTable, FilterBar, FilterChip } from '@shared/components';
import type { Column } from '@shared/components';
import { formatDate } from '@shared/utils';
import type { Location } from '../types';
import { locationStatusVariant } from '../services/locationMapper';

export interface LocationListProps {
  locations: Location[];
  loading: boolean;
  regions: string[];
  activeRegions: string[];
  onToggleRegion: (region: string) => void;
}

export function LocationList({
  locations,
  loading,
  regions,
  activeRegions,
  onToggleRegion,
}: LocationListProps) {
  const { t, i18n } = useTranslation('locations');

  const columns: Column<Location>[] = [
    { key: 'name', header: t('locations.columns.name') },
    { key: 'region', header: t('locations.columns.region') },
    {
      key: 'status',
      header: t('locations.columns.status'),
      render: (row) => (
        <Badge variant={locationStatusVariant(row.status)}>
          {t(`locations.status.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: 'updatedAt',
      header: t('locations.columns.updatedAt'),
      render: (row) => formatDate(row.updatedAt, i18n.language),
    },
  ];

  return (
    <div>
      <FilterBar count={activeRegions.length}>
        {regions.map((region) => (
          <FilterChip
            key={region}
            label={region}
            selected={activeRegions.includes(region)}
            onToggle={() => onToggleRegion(region)}
          />
        ))}
      </FilterBar>
      <DataTable
        columns={columns}
        data={locations}
        getRowId={(row) => row.id}
        caption={t('locations.title')}
        loading={loading}
      />
    </div>
  );
}
