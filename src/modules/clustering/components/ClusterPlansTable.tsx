import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  type DataGridColumn,
  type DataGridHandle,
} from '@shared/components/data';
import {
  Button,
  ImpactBadge,
  ImpactCheckbox as Checkbox,
  ImpactTooltip as Tooltip,
} from '@shared/components/vendor/impact-ui';
import { formatDate } from '@shared/utils';
import { ROUTES } from '@config/routes';
import type { ClusterPlan } from '../types';
import { planStepsBadge, type PlanStepsBadge } from '../types/plan';
import { createdByLabel } from '../services/createdByLabel';
import { formatClusterCount } from '../services/metricCatalog';
import styles from './dashboard.module.css';

const HEADER_HEIGHT = 80;
const FILTER_ROW_HEIGHT = 36;
const ROW_HEIGHT = 46;
const LOADING_ROW_COUNT = 6;

function ClusterPlanNameLink({ name, onOpen }: { name: string; onOpen: () => void }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const update = () => {
      const next = text.scrollWidth > text.clientWidth + 1;
      setTruncated((current) => (current === next ? current : next));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(text);
    return () => observer.disconnect();
  }, [name]);

  return (
    <Tooltip
      title={name}
      variant="tertiary"
      orientation="top-start"
      isHoverEnabled={truncated}
    >
      <Button className={styles.planName} variant="url" size="large" onClick={onOpen}>
        <span ref={textRef} className={styles.planNameText}>
          {name}
        </span>
      </Button>
    </Tooltip>
  );
}

function planStepsColor(badge: PlanStepsBadge): 'warning' | 'success' | undefined {
  if (badge === 'inputNeeded') return 'warning';
  if (badge === 'finalised') return 'success';
  return undefined;
}

export interface ClusterPlansTableProps {
  plans: ClusterPlan[];
  loading?: boolean;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  /** Opens AG Grid's column chooser from the page header ⋮. */
  gridRef?: Ref<DataGridHandle | null>;
  /** Shows floating text search under column headers (toggled from the page header). */
  showColumnFilters?: boolean;
}

function gridHeight(rowCount: number, showColumnFilters: boolean): number {
  return (
    HEADER_HEIGHT + (showColumnFilters ? FILTER_ROW_HEIGHT : 0) + rowCount * ROW_HEIGHT
  );
}

export function ClusterPlansTable({
  plans,
  loading,
  selectedIds,
  onSelectionChange,
  gridRef,
  showColumnFilters = false,
}: ClusterPlansTableProps) {
  const { t, i18n } = useTranslation('clustering');
  const navigate = useNavigate();

  const allSelected = plans.length > 0 && plans.every((plan) => selectedIds.includes(plan.id));
  const partial = !allSelected && plans.some((plan) => selectedIds.includes(plan.id));

  const toggleRow = useCallback(
    (id: string, checked: boolean) => {
      onSelectionChange(
        checked ? [...selectedIds, id] : selectedIds.filter((rowId) => rowId !== id),
      );
    },
    [onSelectionChange, selectedIds],
  );

  const toggleAll = useCallback(
    (checked: boolean) => {
      onSelectionChange(checked ? plans.map((plan) => plan.id) : []);
    },
    [onSelectionChange, plans],
  );

  const columns = useMemo<DataGridColumn<ClusterPlan>[]>(
    () => [
      {
        id: 'select',
        header: '',
        width: 48,
        flex: 0,
        sortable: false,
        lockVisible: true,
        filterable: false,
        headerRender: () => (
          <Checkbox
            checked={allSelected || partial}
            variant={partial ? 'dashed' : 'default'}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              toggleAll(partial ? true : event.target.checked)
            }
            withoutFormLabel
            aria-label={t('table.select', { name: t('dashboard.title') })}
            data-testid="cluster-plans-select-all"
          />
        ),
        render: (row) => (
          <Checkbox
            checked={selectedIds.includes(row.id)}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              toggleRow(row.id, event.target.checked)
            }
            withoutFormLabel
            aria-label={t('table.select', { name: row.name })}
            data-testid={`cluster-plans-select-${row.id}`}
          />
        ),
      },
      {
        id: 'name',
        header: t('columns.name'),
        flex: 2,
        width: 180,
        align: 'center',
        lockVisible: true,
        value: (row) => row.name,
        render: (row) => (
          <ClusterPlanNameLink
            name={row.name}
            onOpen={() =>
              navigate(ROUTES.clusteringPlan.replace(':planId', row.id), {
                state: { clusterPlan: row },
              })
            }
          />
        ),
      },
      {
        id: 'planSteps',
        header: t('columns.planSteps'),
        flex: 1,
        width: 140,
        value: (row) => row.statusDisplayName || planStepsBadge(row),
        render: (row) => {
          const badge = planStepsBadge(row);
          const label = row.statusDisplayName?.trim()
            ? row.statusDisplayName
            : t(`badge.${badge}`);
          return (
            <ImpactBadge
              label={label}
              variant="stroke"
              color={planStepsColor(badge)}
              size="small"
            />
          );
        },
      },
      {
        id: 'channel',
        header: t('columns.channel'),
        flex: 1,
        width: 120,
        value: (row) => row.channelDisplay || (row.channelLabelKey ? t(row.channelLabelKey) : '-'),
        render: (row) =>
          row.channelDisplay || (row.channelLabelKey ? t(row.channelLabelKey) : '-'),
      },
      {
        id: 'clusterCount',
        header: t('columns.clusterCount'),
        flex: 1,
        width: 110,
        align: 'end',
        value: (row) => row.clusterCount,
        render: (row) => formatClusterCount(row.clusterCount),
      },
      {
        id: 'createdBy',
        header: t('columns.createdBy'),
        flex: 1,
        width: 140,
        value: (row) => createdByLabel(row.createdBy, t('columns.createdByAgent')),
        render: (row) => createdByLabel(row.createdBy, t('columns.createdByAgent')),
      },
      {
        id: 'createdOn',
        header: t('columns.createdOn'),
        flex: 1,
        width: 140,
        align: 'end',
        value: (row) => row.createdOn ?? '',
        filterValue: (row) =>
          row.createdOn
            ? formatDate(row.createdOn, i18n.language, { dateStyle: 'medium' })
            : null,
        render: (row) =>
          row.createdOn ? formatDate(row.createdOn, i18n.language, { dateStyle: 'medium' }) : '-',
      },
    ],
    [allSelected, i18n.language, navigate, partial, selectedIds, t, toggleAll, toggleRow],
  );

  const rowCount = loading && plans.length === 0 ? LOADING_ROW_COUNT : plans.length;

  return (
    <DataGrid
      className={styles.plansGrid}
      columns={columns}
      rows={plans}
      getRowId={(row) => row.id}
      ariaLabel={t('dashboard.title')}
      status={loading ? 'loading' : 'succeeded'}
      emptyLabel={t('dashboard.empty')}
      loadingLabel={t('states.loading')}
      rowHeight={ROW_HEIGHT}
      headerHeight={HEADER_HEIGHT}
      height={plans.length === 0 && !loading ? undefined : gridHeight(rowCount, showColumnFilters)}
      columnChooser
      gridRef={gridRef}
      showColumnFilters={showColumnFilters}
    />
  );
}
