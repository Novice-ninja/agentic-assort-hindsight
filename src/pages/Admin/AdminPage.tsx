import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetBreadcrumbAction } from '@app/layouts';
import { Button } from '@shared/components';
import {
  AddFilterModal,
  AdminEmptyState,
  AdminFilterBar,
  CalendarMappingPlaceholder,
  ExceptionsView,
  LocationsView,
  MODULE_STEPPER_ITEMS,
  ModuleStepper,
  ProductsGrid,
  useAdmin,
} from '@modules/admin';
import type { AdminFilterContext } from '@modules/admin/types';
import type { AdminLocation } from '@modules/admin/types';
import type { ExceptionRule } from '@modules/admin/types/exception';
import { fetchAdminLocations, fetchAdminExceptions } from '@modules/admin/store/adminSlice';
import { useAppDispatch } from '@app/store/hooks';
import styles from './AdminPage.module.css';

function isEmptyFilter(ctx: AdminFilterContext): boolean {
  return (
    ctx.departments.length === 0 &&
    ctx.seasons.length === 0 &&
    ctx.regions.length === 0 &&
    !ctx.productGroupId &&
    !ctx.brandId &&
    !ctx.channelRegionIds?.length &&
    !ctx.customerTypeIds?.length &&
    !ctx.fulfillmentScopeIds?.length &&
    !ctx.calendarSeasonId &&
    !ctx.periodIds?.length
  );
}

export function AdminPage() {
  const { t } = useTranslation('admin');
  const dispatch = useAppDispatch();
  const setBreadcrumbAction = useSetBreadcrumbAction();
  const {
    filterContext,
    filterBarCollapsed,
    activeModule,
    viewMode,
    selectedId,
    moduleStatus,
    products,
    locations,
    exceptions,
    facetOptions,
    localFilters,
    statuses,
    filterModalOpen,
    readOnly,
    selectModule,
    changeViewMode,
    selectItem,
    toggleFilterBar,
    openFilterModal,
    closeFilterModal,
    applyFilters,
    updateLocalFilters,
    commitLocationPatch,
    commitExceptionPatch,
    deleteException,
  } = useAdmin();

  const showGlobalEmpty = isEmptyFilter(filterContext);

  const showModuleEmpty =
    !showGlobalEmpty &&
    ((activeModule === 'products' && products.length === 0 && statuses.products === 'succeeded') ||
      (activeModule === 'locations' && locations.length === 0 && statuses.locations === 'succeeded') ||
      (activeModule === 'exceptions' &&
        exceptions.length === 0 &&
        statuses.exceptions === 'succeeded'));

  useEffect(() => {
    setBreadcrumbAction(
      <Button
        variant="secondary"
        size="small"
        className={styles.hideFilterBtn}
        onClick={() => toggleFilterBar(!filterBarCollapsed)}
        aria-pressed={!filterBarCollapsed}
      >
        {filterBarCollapsed ? t('page.showFilters') : t('page.hideFilters')}
      </Button>,
    );
    return () => setBreadcrumbAction(null);
  }, [filterBarCollapsed, setBreadcrumbAction, t, toggleFilterBar]);

  const handleLocationCommit = useCallback(
    (id: string, field: keyof AdminLocation, value: unknown) => {
      void commitLocationPatch(id, { [field]: value } as Partial<AdminLocation>);
    },
    [commitLocationPatch],
  );

  const handleExceptionEditRule = useCallback(
    (exceptionId: string, ruleId: string, patch: Partial<ExceptionRule>) => {
      const exception = exceptions.find((e) => e.id === exceptionId);
      if (!exception) return;
      const rules = exception.rules.map((r) => (r.id === ruleId ? { ...r, ...patch } : r));
      void commitExceptionPatch(exceptionId, rules);
    },
    [exceptions, commitExceptionPatch],
  );

  const handleAddRule = useCallback(
    (exceptionId: string) => {
      const exception = exceptions.find((e) => e.id === exceptionId);
      if (!exception) return;
      const newRule: ExceptionRule = {
        id: `r${Date.now()}`,
        attribute: t('exceptions.card.newAttribute'),
        operator: 'equals',
        value: '',
      };
      void commitExceptionPatch(exceptionId, [...exception.rules, newRule]);
    },
    [exceptions, commitExceptionPatch, t],
  );

  const handleLocalFilterChange = useCallback(
    (patch: Partial<typeof localFilters>) => {
      updateLocalFilters(patch);
      if (activeModule === 'locations') {
        void dispatch(fetchAdminLocations());
      }
      if (activeModule === 'exceptions') {
        void dispatch(fetchAdminExceptions());
      }
    },
    [updateLocalFilters, activeModule, dispatch],
  );

  return (
    <div className={[styles.page, showGlobalEmpty && styles.pageCentered].filter(Boolean).join(' ')}>
      {!showGlobalEmpty && (
        <>
          <AdminFilterBar
            filterContext={filterContext}
            facets={facetOptions}
            collapsed={filterBarCollapsed}
            onOpenAllFilters={openFilterModal}
          />

          <ModuleStepper
            items={MODULE_STEPPER_ITEMS}
            activeModule={activeModule}
            statusSummaries={moduleStatus}
            onSelect={selectModule}
          />
        </>
      )}

      <main className={styles.content}>
        {showGlobalEmpty ? (
          <AdminEmptyState variant="global" onAddFilter={openFilterModal} />
        ) : showModuleEmpty ? (
          <AdminEmptyState variant="module" onAddFilter={openFilterModal} />
        ) : (
          <>
            {activeModule === 'products' && (
              <ProductsGrid
                rows={products}
                loading={statuses.products === 'loading'}
                readOnly={readOnly}
              />
            )}

            {activeModule === 'locations' && (
              <LocationsView
                rows={locations}
                loading={statuses.locations === 'loading'}
                readOnly={readOnly}
                viewMode={viewMode}
                selectedId={selectedId}
                customerType={localFilters.customerType}
                searchQuery={localFilters.searchQuery}
                onViewModeChange={changeViewMode}
                onSelect={selectItem}
                onCellCommit={handleLocationCommit}
                onAttributeChange={(id, field, value) => handleLocationCommit(id, field, value)}
                onCustomerTypeChange={(value) => handleLocalFilterChange({ customerType: value })}
                onSearchChange={(value) => handleLocalFilterChange({ searchQuery: value })}
              />
            )}

            {activeModule === 'exceptions' && (
              <ExceptionsView
                rows={exceptions}
                loading={statuses.exceptions === 'loading'}
                readOnly={readOnly}
                viewMode={viewMode}
                selectedId={selectedId}
                customerType={localFilters.customerType}
                searchQuery={localFilters.searchQuery}
                onViewModeChange={changeViewMode}
                onSelect={selectItem}
                onEditRule={handleExceptionEditRule}
                onAddRule={handleAddRule}
                onRemove={deleteException}
                onCustomerTypeChange={(value) => handleLocalFilterChange({ customerType: value })}
                onSearchChange={(value) => handleLocalFilterChange({ searchQuery: value })}
              />
            )}

            {activeModule === 'calendar' && <CalendarMappingPlaceholder />}
          </>
        )}
      </main>

      <AddFilterModal
        open={filterModalOpen}
        draft={filterContext}
        facets={facetOptions}
        onApply={applyFilters}
        onCancel={closeFilterModal}
        onClearTab={() => undefined}
      />
    </div>
  );
}
