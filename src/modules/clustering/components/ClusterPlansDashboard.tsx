import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@app/store/hooks';
import type { DataGridHandle } from '@shared/components/data';
import {
  Button,
  ImpactBadge,
  ImpactTooltip as Tooltip,
  Prompt,
} from '@shared/components/vendor/impact-ui';
import { useToast } from '@shared/components/primitives/Toast';
import { visuallyHiddenClass } from '@shared/a11y';
import { useSetBreadcrumbs } from '@app/layouts';
import { ROUTES } from '@config/routes';
import listing from '@shared/styles/listingPage.module.css';
import { downloadCsv, exportPlansCsv } from '../services/exportPlansCsv';
import { useClustering } from '../hooks/useClustering';
import { deleteClusterPlans, fetchPlans, resetWizard } from '../store/clusteringSlice';
import { ClusterStatusCards } from './ClusterStatusCards';
import { ClusterPlansEmptyState } from './ClusterPlansEmptyState';
import { ClusterPlansTable } from './ClusterPlansTable';
import { CreateClusterPlanButton } from './CreateClusterPlanButton';

// function TableViewIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//       <path
//         d="M2.481 14.33c-.407 0-.756-.145-1.046-.435A1.427 1.427 0 0 1 1 12.849V2.481c0-.407.145-.756.435-1.046C1.725 1.145 2.074 1 2.481 1h10.368c.407 0 .756.145 1.046.435.29.29.435.639.435 1.046v10.368c0 .407-.145.756-.435 1.046-.29.29-.639.435-1.046.435H2.481Zm4.443-4.443H2.481v2.962h4.443V9.887Zm1.481 0v2.962h4.444V9.887H8.406Zm-1.481-1.481V5.443H2.481v2.963h4.443Zm1.481 0h4.444V5.443H8.406v2.963ZM2.481 3.962h10.368V2.481H2.481v1.481Z"
//         fill="currentColor"
//       />
//     </svg>
//   );
// }

// function MapViewIcon() {
//   return (
//     <svg
//       width="16"
//       height="16"
//       viewBox="0 0 16 16"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M10 14L6 12.6L2.9 13.8C2.67778 13.8889 2.47222 13.8639 2.28333 13.725C2.09444 13.5861 2 13.4 2 13.1667V3.83333C2 3.68889 2.04167 3.56111 2.125 3.45C2.20833 3.33889 2.32222 3.25556 2.46667 3.2L6 2L10 3.4L13.1 2.2C13.3222 2.11111 13.5278 2.13611 13.7167 2.275C13.9056 2.41389 14 2.6 14 2.83333V12.1667C14 12.3111 13.9583 12.4389 13.875 12.55C13.7917 12.6611 13.6778 12.7444 13.5333 12.8L10 14ZM9.33333 12.3667V4.56667L6.66667 3.63333V11.4333L9.33333 12.3667ZM10.6667 12.3667L12.6667 11.7V3.8L10.6667 4.56667V12.3667ZM3.33333 12.2L5.33333 11.4333V3.63333L3.33333 4.3V12.2Z"
//         fill="#1F2B4D"
//       />
//     </svg>
//   );
// }

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 11L4.25 7.25L5.3 6.1625L7.25 8.1125V2H8.75V8.1125L10.7 6.1625L11.75 7.25L8 11ZM3.5 14C3.0875 14 2.73438 13.8531 2.44063 13.5594C2.14687 13.2656 2 12.9125 2 12.5V10.25H3.5V12.5H12.5V10.25H14V12.5C14 12.9125 13.8531 13.2656 13.5594 13.5594C13.2656 13.8531 12.9125 14 12.5 14H3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.66602 14C4.29935 14 3.98557 13.8696 3.72468 13.6087C3.46335 13.3473 3.33268 13.0333 3.33268 12.6667V4C3.14379 4 2.98535 3.93622 2.85735 3.80867C2.72979 3.68067 2.66602 3.52222 2.66602 3.33333C2.66602 3.14444 2.72979 2.986 2.85735 2.858C2.98535 2.73044 3.14379 2.66667 3.33268 2.66667H5.99935C5.99935 2.47778 6.06335 2.31933 6.19135 2.19133C6.3189 2.06378 6.47713 2 6.66602 2H9.33268C9.52157 2 9.68002 2.06378 9.80802 2.19133C9.93557 2.31933 9.99935 2.47778 9.99935 2.66667H12.666C12.8549 2.66667 13.0131 2.73044 13.1407 2.858C13.2687 2.986 13.3327 3.14444 13.3327 3.33333C13.3327 3.52222 13.2687 3.68067 13.1407 3.80867C13.0131 3.93622 12.8549 4 12.666 4V12.6667C12.666 13.0333 12.5356 13.3473 12.2747 13.6087C12.0133 13.8696 11.6993 14 11.3327 14H4.66602ZM4.66602 4V12.6667H11.3327V4H4.66602ZM5.99935 10.6667C5.99935 10.8556 6.06335 11.0138 6.19135 11.1413C6.3189 11.2693 6.47713 11.3333 6.66602 11.3333C6.8549 11.3333 7.01335 11.2693 7.14135 11.1413C7.2689 11.0138 7.33268 10.8556 7.33268 10.6667V6C7.33268 5.81111 7.2689 5.65267 7.14135 5.52467C7.01335 5.39711 6.8549 5.33333 6.66602 5.33333C6.47713 5.33333 6.3189 5.39711 6.19135 5.52467C6.06335 5.65267 5.99935 5.81111 5.99935 6V10.6667ZM8.66602 10.6667C8.66602 10.8556 8.73002 11.0138 8.85802 11.1413C8.98557 11.2693 9.14379 11.3333 9.33268 11.3333C9.52157 11.3333 9.68002 11.2693 9.80802 11.1413C9.93557 11.0138 9.99935 10.8556 9.99935 10.6667V6C9.99935 5.81111 9.93557 5.65267 9.80802 5.52467C9.68002 5.39711 9.52157 5.33333 9.33268 5.33333C9.14379 5.33333 8.98557 5.39711 8.85802 5.52467C8.73002 5.65267 8.66602 5.81111 8.66602 6V10.6667Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="14" height="4" viewBox="0 0 14 4" fill="none" aria-hidden="true">
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      <circle cx="7" cy="2" r="1.5" fill="currentColor" />
      <circle cx="12" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}

function Divider() {
  return <div className={listing.divider} aria-hidden="true" />;
}

export function ClusterPlansDashboard() {
  const { t } = useTranslation(['clustering', 'common']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToasts } = useToast();
  const toastedFailure = useRef(false);
  const tableGridRef = useRef<DataGridHandle | null>(null);
  const [columnFiltersVisible, setColumnFiltersVisible] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const {
    plans,
    visiblePlans,
    tabCounts,
    activeTab,
    listStatus,
    selectedPlanIds,
    canWrite,
    changeTab,
    changeSelection,
  } = useClustering();

  useSetBreadcrumbs([
    {
      type: 'home',
      label: t('common:breadcrumb.home'),
      onClick: () => {
        window.location.href = `${window.location.origin}/home`;
      },
    },
    { type: 'clustering', label: t('clustering:breadcrumb.locationClustering') },
  ]);

  const goCreate = useCallback(() => {
    dispatch(resetWizard());
    navigate(ROUTES.createClusterPlan);
  }, [dispatch, navigate]);

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedPlanIds.length === 0 || deleting) return;
    setDeleting(true);
    try {
      const deleted = await dispatch(deleteClusterPlans(selectedPlanIds)).unwrap();
      showToasts([
        {
          message: t('clustering:toasts.deleteSuccess', { count: deleted.length }),
          variant: 'success',
          position: 'top-right',
          autoHideDuration: 2000,
        },
      ]);
      setDeleteConfirmOpen(false);
      changeSelection([]);
      void dispatch(fetchPlans());
    } catch {
      showToasts([
        {
          message: t('clustering:toasts.deleteError'),
          variant: 'error',
          position: 'top-right',
          autoHideDuration: 3000,
        },
      ]);
      void dispatch(fetchPlans());
    } finally {
      setDeleting(false);
    }
  }, [changeSelection, deleting, dispatch, selectedPlanIds, showToasts, t]);

  const download = () => {
    const csv = exportPlansCsv(visiblePlans, {
      badge: {
        draft: t('clustering:badge.draft'),
        inputNeeded: t('clustering:badge.inputNeeded'),
        awaitingApproval: t('clustering:badge.awaitingApproval'),
        finalised: t('clustering:badge.finalised'),
      },
      channel: (key) => t(`clustering:${key}`),
    });
    downloadCsv('cluster-plans.csv', csv);
  };

  useEffect(() => {
    if (listStatus !== 'failed') {
      toastedFailure.current = false;
      return;
    }
    if (toastedFailure.current) return;
    toastedFailure.current = true;
    showToasts([
      {
        message: t('clustering:toasts.loadError'),
        variant: 'error',
        position: 'top-right',
        autoHideDuration: 3000,
      },
    ]);
  }, [listStatus, showToasts, t]);

  const loading = listStatus === 'loading';
  const failed = listStatus === 'failed';
  const noPlans = listStatus === 'succeeded' && plans.length === 0;
  const noneForStage =
    listStatus === 'succeeded' && plans.length > 0 && visiblePlans.length === 0;
  const empty = !loading && visiblePlans.length === 0;
  const hasSelection = selectedPlanIds.length > 0;
  const toolbarDisabled = loading || empty;

  return (
    <div className={listing.page}>
      <h1 className={visuallyHiddenClass}>{t('clustering:title')}</h1>
      <ClusterStatusCards activeTab={activeTab} counts={tabCounts} onChange={changeTab} />
      <section
        className={`${listing.container}${empty ? ` ${listing.containerEmpty}` : ''}`}
      >
        <div className={listing.containerHeader}>
          <div className={listing.headerLeft}>
            <div className={listing.heading}>
              <span className={listing.headingTitle}>
                {t('clustering:dashboard.title')}
              </span>
              <ImpactBadge
                label={String(tabCounts[activeTab] ?? 0)}
                variant="subtle"
                color="info"
                size="small"
              />
            </div>
          </div>
          <div className={listing.headerRight}>
            {/* <Tooltip title={t('clustering:dashboard.mapView')} variant="tertiary">
              <Button
                variant="tertiary"
                size="large"
                aria-label={t('clustering:dashboard.mapView')}
                aria-pressed="true"
                icon={<MapViewIcon />}
                disabled={listStatus === 'loading' || empty}
              />
            </Tooltip>
            {canWrite && <Divider />} */}
            {!hasSelection && <CreateClusterPlanButton canWrite={canWrite} />}
            {hasSelection && (
              <Tooltip title={t('clustering:dashboard.delete')} variant="tertiary">
                <Button
                  variant="secondary"
                  type="destructive"
                  size="large"
                  icon={<DeleteIcon />}
                  aria-label={t('clustering:dashboard.delete')}
                  data-testid="cluster-plans-delete-button"
                  disabled={deleting}
                  onClick={() => setDeleteConfirmOpen(true)}
                />
              </Tooltip>
            )}
            <Divider />
            <Tooltip title={t('clustering:dashboard.searchColumns')} variant="tertiary">
              <Button
                variant="text"
                size="large"
                aria-label={t('clustering:dashboard.searchColumns')}
                aria-pressed={columnFiltersVisible}
                icon={<SearchIcon />}
                disabled={toolbarDisabled}
                onClick={() => setColumnFiltersVisible((visible) => !visible)}
                data-testid="cluster-plans-search-button"
              />
            </Tooltip>
            <Tooltip title={t('clustering:dashboard.download')} variant="tertiary">
              <Button
                variant="text"
                size="large"
                aria-label={t('clustering:dashboard.download')}
                icon={<DownloadIcon />}
                onClick={download}
                disabled={toolbarDisabled}
              />
            </Tooltip>
            <Tooltip title={t('clustering:dashboard.chooseColumns')} variant="tertiary">
              <Button
                variant="text"
                size="large"
                aria-label={t('clustering:dashboard.chooseColumns')}
                icon={<MoreIcon />}
                disabled={toolbarDisabled}
                onClick={() => tableGridRef.current?.showColumnChooser()}
                data-testid="cluster-plans-more-button"
              />
            </Tooltip>
          </div>
        </div>
        <main className={`${listing.body}${empty ? ` ${listing.bodyEmpty}` : ''}`}>
          {loading ? (
            <ClusterPlansTable
              plans={[]}
              loading
              selectedIds={selectedPlanIds}
              onSelectionChange={changeSelection}
              gridRef={tableGridRef}
              showColumnFilters={columnFiltersVisible}
            />
          ) : failed ? null : noPlans ? (
            <ClusterPlansEmptyState
              variant="noPlans"
              canCreate={canWrite}
              onCreate={goCreate}
            />
          ) : noneForStage ? (
            <ClusterPlansEmptyState
              variant="filtered"
              canCreate={canWrite}
              onCreate={goCreate}
            />
          ) : (
            <ClusterPlansTable
              plans={visiblePlans}
              loading={false}
              selectedIds={selectedPlanIds}
              onSelectionChange={changeSelection}
              gridRef={tableGridRef}
              showColumnFilters={columnFiltersVisible}
            />
          )}
        </main>
      </section>
      <Prompt
        isOpen={deleteConfirmOpen}
        variant="error"
        title={t('clustering:dashboard.deleteConfirm.title')}
        primaryButtonLabel={t('clustering:dashboard.deleteConfirm.confirm')}
        secondaryButtonLabel={t('clustering:dashboard.deleteConfirm.cancel')}
        handleClose={() => {
          if (!deleting) setDeleteConfirmOpen(false);
        }}
        onSecondaryButtonClick={() => {
          if (!deleting) setDeleteConfirmOpen(false);
        }}
        onPrimaryButtonClick={() => {
          void handleDeleteConfirm();
        }}
        primaryButtonProps={{
          disabled: deleting,
          loading: deleting,
          'data-testid': 'cluster-plans-delete-confirm-button',
        }}
        secondaryButtonProps={{
          disabled: deleting,
          'data-testid': 'cluster-plans-delete-cancel',
        }}
        data-testid="cluster-plans-delete-confirm"
      >
        {t('clustering:dashboard.deleteConfirm.body', { count: selectedPlanIds.length })}
      </Prompt>
    </div>
  );
}
