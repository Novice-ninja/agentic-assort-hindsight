import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ImpactInput as Input,
  ImpactSelect,
  ImpactTabs as Tabs,
  Panel,
  Skeleton,
  type SelectOption,
} from '@shared/components/vendor/impact-ui';
import { DataTable, type Column } from '@shared/components/data';
import { useToast } from '@shared/components/primitives/Toast';
import { decodeIaString } from '@shared/utils/format';
import searchIcon from '@assets/icons/planning/search.svg';
import type {
  StoreAssignmentCluster,
  StoreAssignmentRow,
  StoreAssignmentsResponse,
} from '../api/getStoreAssignments';
import type { StoreAssignmentsEntry } from '../store/clusteringSlice';
import { candidateVariantCode } from '../services/candidateVariantCode';
import { variantCardTitle } from '../services/reviewVariantDisplay';
import {
  applyMovesToCompareRows,
  buildCompareRows,
  clusterTone,
  COMPARE_ALL_TAB,
  compareLoadState,
  countMoves,
  filterAssignments,
  filterCompareRows,
  findClusterByLabel,
  type CompareRow,
  type StoreMoves,
} from '../services/storeAssignmentsView';
import type { ClusterResultCandidate } from '../types';
import styles from './storeAssignments.module.css';

export { COMPARE_ALL_TAB } from '../services/storeAssignmentsView';

/** Width that fits Store · Cluster · Move To… (and up to four compare columns) comfortably. */
const PANEL_WIDTH = 860;
const SKELETON_ROWS = [0, 1, 2, 3, 4, 5] as const;

function variantPanelName(candidate: ClusterResultCandidate, fallback: string): string {
  return variantCardTitle(decodeIaString(candidate.name), {
    fallback,
    variantId: candidate.variantId,
  });
}

export interface StoreAssignmentsPanelProps {
  open: boolean;
  onClose: () => void;
  /** The "3 Best" cards, in display order — one tab each, plus "Compare All". */
  candidates: ClusterResultCandidate[];
  /** Active tab: a candidate `id`, or `COMPARE_ALL_TAB`. */
  activeTab: string;
  onTabChange: (tab: string) => void;
  /** `POST …/store_assignments` state per `variantId`. */
  assignments: Record<string, StoreAssignmentsEntry | undefined>;
  /** Requests a variant's assignments (no-op while loading or already loaded). */
  onLoad: (variantId: string) => void;
  /** Persist a store's new cluster, then reload that variant. */
  onMoveStore: (
    variantId: string,
    storeCode: string,
    cluster: StoreAssignmentCluster,
  ) => Promise<void> | void;
}

function ClusterPill({ label }: { label: string }) {
  return (
    <span className={styles.clusterPill} data-tone={clusterTone(label)}>
      {decodeIaString(label)}
    </span>
  );
}

function clusterSelectOptions(clusters: readonly StoreAssignmentCluster[]) {
  return clusters.map((cluster) => ({
    value: cluster.label,
    label: `${decodeIaString(cluster.label)} - ${decodeIaString(cluster.clusterName)}`,
  }));
}

function MoveToSelect({
  selectId,
  ariaLabel,
  options,
  value,
  disabled,
  onChange,
}: {
  selectId: string;
  ariaLabel: string;
  options: { value: string; label: string }[];
  value: string;
  disabled?: boolean;
  onChange: (label: string) => void;
}) {
  const { t } = useTranslation('clustering');
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const impactOptions = useMemo<SelectOption[]>(
    () => options.map((option) => ({ label: option.label, value: option.value })),
    [options],
  );
  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>(impactOptions);
  const controlledSelection = useMemo(
    () => impactOptions.find((option) => option.value === value) ?? [],
    [impactOptions, value],
  );
  const [selectedOptions, setSelectedOptions] = useState<SelectOption | SelectOption[]>(
    controlledSelection,
  );

  useEffect(() => {
    setCurrentOptions(impactOptions);
  }, [impactOptions]);

  useEffect(() => {
    setSelectedOptions(controlledSelection);
  }, [controlledSelection]);

  return (
    <ImpactSelect
      aria-label={ariaLabel}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      label=""
      placeholder={t('finalize.storeAssignmentsMoveToPlaceholder')}
      isMulti={false}
      isClearable
      isDisabled={disabled}
      isSelectAll={isSelectAll}
      setIsSelectAll={setIsSelectAll}
      initialOptions={impactOptions}
      currentOptions={currentOptions}
      setCurrentOptions={setCurrentOptions}
      selectedOptions={selectedOptions}
      setSelectedOptions={(next) => setSelectedOptions(next ?? [])}
      handleChange={(next) => {
        const chosen = Array.isArray(next) ? next[0] : next;
        const nextValue = chosen?.value != null ? String(chosen.value) : '';
        if (nextValue && nextValue !== value) onChange(nextValue);
        setIsOpen(false);
      }}
      withPortal
      portalContainer={typeof document !== 'undefined' ? document.body : undefined}
      isCloseWhenClickOutside
      selectId={selectId}
    />
  );
}

function SkeletonRows({ columns }: { columns: number }) {
  const { t } = useTranslation('clustering');
  return (
    <div
      className={styles.skeletonList}
      role="status"
      aria-busy="true"
      aria-label={t('finalize.storeAssignmentsLoading')}
      data-testid="store-assignments-skeleton"
    >
      {SKELETON_ROWS.map((row) => (
        <div key={row} className={styles.skeletonRow}>
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton
              key={column}
              variant={column === 0 ? 'text' : 'pill'}
              width={column === 0 ? 140 : 56}
              height={column === 0 ? 20 : 24}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function LoadError({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  const { t } = useTranslation('clustering');
  return (
    <div className={styles.errorState} role="alert">
      <span>{message ?? t('errors.storeAssignmentsFailed')}</span>
      <Button variant="tertiary" size="small" onClick={onRetry}>
        {t('states.retry')}
      </Button>
    </div>
  );
}

interface VariantViewProps {
  candidate: ClusterResultCandidate;
  entry: StoreAssignmentsEntry | undefined;
  query: string;
  moves: Record<string, string | null> | undefined;
  moving: Record<string, string | null> | undefined;
  onMove: (storeCode: string, label: string) => void;
  onRetry: () => void;
}

/** One variant's "List view": Store · Cluster · Move To…, filtered by the toolbar search. */
function VariantView({
  candidate,
  entry,
  query,
  moves,
  moving,
  onMove,
  onRetry,
}: VariantViewProps) {
  const { t } = useTranslation('clustering');
  const data = entry?.data ?? null;
  const rows = useMemo(
    () => filterAssignments(data?.assignments ?? [], query),
    [data, query],
  );
  const clusterOptions = useMemo(
    () => clusterSelectOptions(data?.clusters ?? []),
    [data],
  );

  if (entry?.status === 'failed' && !data)
    return <LoadError message={entry.error} onRetry={onRetry} />;
  if (!data) return <SkeletonRows columns={3} />;

  const columns: Column<StoreAssignmentRow>[] = [
    {
      key: 'store',
      header: t('finalize.storeAssignmentsStore'),
      render: (row) => (
        <span className={styles.storeName}>{decodeIaString(row.storeName)}</span>
      ),
    },
    {
      key: 'cluster',
      header: t('finalize.storeAssignmentsCluster'),
      render: (row) => {
        const pick = moves?.[row.storeCode];
        const label = typeof pick === 'string' ? pick : row.label;
        return <ClusterPill label={label} />;
      },
    },
    {
      key: 'moveTo',
      header: t('finalize.storeAssignmentsMoveTo'),
      render: (row) => {
        const pick = moves?.[row.storeCode];
        const value = typeof pick === 'string' ? pick : row.label;
        return (
          <MoveToSelect
            selectId={`move-to-${candidate.variantId}-${row.storeCode}`}
            ariaLabel={t('finalize.storeAssignmentsMoveToLabel', {
              store: decodeIaString(row.storeName),
            })}
            options={clusterOptions}
            value={value}
            disabled={Boolean(moving?.[row.storeCode])}
            onChange={(label) => onMove(row.storeCode, label)}
          />
        );
      },
    },
  ];

  return (
    <div className={[styles.tableFrame, styles.variantTable].join(' ')}>
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.storeCode}
        caption={t('finalize.storeAssignmentsTitle', {
          option: variantPanelName(candidate, t('review.customVariant')),
          k: candidate.k,
          code: candidateVariantCode(candidate),
        })}
        emptyMessage={
          data.assignments.length === 0
            ? t('finalize.storeAssignmentsNone')
            : t('finalize.storeAssignmentsEmpty')
        }
      />
    </div>
  );
}

interface CompareViewProps {
  candidates: ClusterResultCandidate[];
  entries: Record<string, StoreAssignmentsEntry | undefined>;
  query: string;
  moves: StoreMoves;
  optionLabel: (candidate: ClusterResultCandidate) => string;
  onRetry: (variantIds: string[]) => void;
}

/** "Compare All": Store, then one cluster-pill column per variant. */
function CompareView({
  candidates,
  entries,
  query,
  moves,
  optionLabel,
  onRetry,
}: CompareViewProps) {
  const { t } = useTranslation('clustering');
  const state = compareLoadState(candidates, entries);
  const responses = useMemo(() => {
    const out: Record<string, StoreAssignmentsResponse | null> = {};
    for (const candidate of candidates) {
      out[candidate.variantId] = entries[candidate.variantId]?.data ?? null;
    }
    return out;
  }, [candidates, entries]);
  const rows = useMemo(
    () =>
      filterCompareRows(
        applyMovesToCompareRows(buildCompareRows(candidates, responses), moves),
        query,
      ),
    [candidates, responses, query, moves],
  );

  if (state.failed.length > 0) {
    const first = entries[state.failed[0].variantId];
    return (
      <LoadError
        message={first?.error ?? null}
        onRetry={() => onRetry(state.failed.map((candidate) => candidate.variantId))}
      />
    );
  }
  if (!state.ready) return <SkeletonRows columns={candidates.length + 1} />;

  const columns: Column<CompareRow>[] = [
    {
      key: 'store',
      header: t('finalize.storeAssignmentsStore'),
      render: (row) => (
        <span className={styles.storeName}>{decodeIaString(row.storeName)}</span>
      ),
    },
    ...candidates.map((candidate) => ({
      key: candidate.id,
      header: t('finalize.storeAssignmentsCompareColumn', {
        option: optionLabel(candidate),
        k: candidate.k,
        code: candidateVariantCode(candidate),
      }),
      render: (row: CompareRow) => {
        const label = row.labels[candidate.variantId];
        return label ? (
          <ClusterPill label={label} />
        ) : (
          <span
            className={styles.notAssigned}
            title={t('finalize.storeAssignmentsNotAssigned')}
          >
            —
          </span>
        );
      },
    })),
  ];

  return (
    <div className={[styles.tableFrame, styles.compareTable].join(' ')}>
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.storeCode}
        caption={t('finalize.storeAssignmentsCompareTitle')}
        emptyMessage={t('finalize.storeAssignmentsEmpty')}
      />
    </div>
  );
}

export function StoreAssignmentsPanel({
  open,
  onClose,
  candidates,
  activeTab,
  onTabChange,
  assignments,
  onLoad,
  onMoveStore,
}: StoreAssignmentsPanelProps) {
  const { t } = useTranslation('clustering');
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [moves, setMoves] = useState<StoreMoves>({});
  const [moving, setMoving] = useState<StoreMoves>({});

  const optionLabel = (candidate: ClusterResultCandidate) =>
    variantPanelName(candidate, t('review.customVariant'));
  const activeCandidate =
    candidates.find((candidate) => candidate.id === activeTab) ?? null;
  const isCompare = activeTab === COMPARE_ALL_TAB || activeCandidate === null;

  // Fetch what the active tab needs: one variant, or every variant for "Compare All". The
  // thunk ignores variants that are loading or already loaded, so this never double-fetches.
  useEffect(() => {
    if (!open) return;
    const wanted = isCompare ? candidates : activeCandidate ? [activeCandidate] : [];
    wanted.forEach((candidate) => onLoad(candidate.variantId));
  }, [open, isCompare, activeCandidate, candidates, onLoad]);

  // The search is per panel session; moves survive closing so a re-open shows them again.
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const title = activeCandidate
    ? t('finalize.storeAssignmentsTitle', {
        option: optionLabel(activeCandidate),
        k: activeCandidate.k,
        code: candidateVariantCode(activeCandidate),
      })
    : t('finalize.storeAssignmentsCompareTitle');

  const moveCount = isCompare
    ? candidates.reduce(
        (sum, candidate) =>
          sum +
          countMoves(
            assignments[candidate.variantId]?.data?.assignments ?? [],
            moves[candidate.variantId],
          ),
        0,
      )
    : countMoves(
        assignments[activeCandidate.variantId]?.data?.assignments ?? [],
        moves[activeCandidate.variantId],
      );

  const setStoreFlag = (
    setter: typeof setMoves,
    variantId: string,
    storeCode: string,
    label: string | null,
  ) => {
    setter((current) => {
      const nextForVariant = { ...current[variantId], [storeCode]: label };
      if (label === null) delete nextForVariant[storeCode];
      return { ...current, [variantId]: nextForVariant };
    });
  };

  const onMove = (variantId: string) => async (storeCode: string, label: string) => {
    const data = assignments[variantId]?.data;
    const row = data?.assignments.find(
      (assignment) => assignment.storeCode === storeCode,
    );
    if (!data || !row) return;
    if (label === row.label) {
      setStoreFlag(setMoves, variantId, storeCode, null);
      return;
    }
    const destination = findClusterByLabel(data.clusters, label);
    if (!destination) return;
    setStoreFlag(setMoves, variantId, storeCode, label);
    setStoreFlag(setMoving, variantId, storeCode, label);
    try {
      await onMoveStore(variantId, storeCode, destination);
      showToast({ message: t('finalize.storeMoveSuccess'), variant: 'success' });
    } catch {
      setStoreFlag(setMoves, variantId, storeCode, null);
      showToast({ message: t('errors.storeMoveFailed'), variant: 'error' });
    } finally {
      setStoreFlag(setMoving, variantId, storeCode, null);
    }
  };

  const tabNames = [
    ...candidates.map((candidate) => ({
      value: candidate.id,
      label: optionLabel(candidate),
    })),
    { value: COMPARE_ALL_TAB, label: t('finalize.storeAssignmentsCompareAll') },
  ];

  const toolbar = (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLead}>
        <span className={styles.listViewLabel}>
          {t('finalize.storeAssignmentsListView')}
        </span>
        <span className={styles.movesPill} data-testid="store-assignments-moves">
          {moveCount === 0
            ? t('finalize.storeAssignmentsNoMoves')
            : t('finalize.storeAssignmentsMoves', { count: moveCount })}
        </span>
      </div>
      <div className={styles.searchField}>
        <Input
          id="store-assignments-search"
          name="storeAssignmentsSearch"
          type="search"
          size="large"
          placeholder={t('finalize.storeAssignmentsSearch')}
          leftIcon={
            <img
              src={searchIcon}
              alt=""
              aria-hidden="true"
              className={styles.searchIcon}
            />
          }
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setQuery(event.target.value)
          }
          inputProps={{ 'aria-label': t('finalize.storeAssignmentsSearchLabel') }}
        />
      </div>
    </div>
  );

  const renderPanel = (content: ReactNode) => (
    <section className={styles.content}>
      {toolbar}
      {content}
    </section>
  );

  // Real Impact Tabs keep every panel mounted. Only the active table gets dropdowns so
  // duplicate selectIds and dozens of Selects cannot freeze the drawer.
  const tabPanels = [
    ...candidates.map((candidate) =>
      renderPanel(
        activeTab === candidate.id ? (
          <VariantView
            candidate={candidate}
            entry={assignments[candidate.variantId]}
            query={query}
            moves={moves[candidate.variantId]}
            moving={moving[candidate.variantId]}
            onMove={onMove(candidate.variantId)}
            onRetry={() => onLoad(candidate.variantId)}
          />
        ) : null,
      ),
    ),
    renderPanel(
      isCompare ? (
        <CompareView
          candidates={candidates}
          entries={assignments}
          query={query}
          moves={moves}
          optionLabel={optionLabel}
          onRetry={(variantIds) => variantIds.forEach(onLoad)}
        />
      ) : null,
    ),
  ];

  return (
    <Panel
      open={open}
      setIsOpen={(next) => {
        if (!next) onClose();
      }}
      anchor="right"
      width={PANEL_WIDTH}
      className={styles.panel}
      title={title}
    >
      <div className={styles.body} data-testid="store-assignments-panel">
        <Tabs
          className={styles.tabs}
          data-testid="store-assignments-tabs"
          tabNames={tabNames}
          tabPanels={tabPanels}
          value={isCompare ? COMPARE_ALL_TAB : activeTab}
          onChange={(_event, next) => onTabChange(next)}
        />
      </div>
    </Panel>
  );
}
