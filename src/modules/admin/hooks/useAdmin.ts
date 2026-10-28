import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { hasPermission, type Role } from '@config/permissions';
import { useLocalStorage } from '@shared/hooks';
import type { AdminFilterContext, ModuleKey, ViewMode } from '../types';
import { EMPTY_FILTER_CONTEXT } from '../types/admin';
import {
  applyFilterContext,
  fetchAdminExceptions,
  fetchAdminLocations,
  fetchAdminProducts,
  fetchFilterFacets,
  fetchModuleStatus,
  patchException,
  patchLocation,
  removeException,
  resetFilters,
  setActiveModule,
  setFilterBarCollapsed,
  setFilterModalOpen,
  setLocalFilters,
  setSelectedId,
  setViewMode,
} from '../store/adminSlice';
import type { AdminLocalFilters } from '../store/adminSlice';
import type { GlobalException } from '../types/exception';
import type { AdminLocation } from '../types/location';

const FILTER_CONTEXT_KEY = 'admin:filterContext';
const FILTER_BAR_COLLAPSED_KEY = 'admin:filterBarCollapsed';

// Swap for real session/role resolution when authentication is introduced.
const CURRENT_ROLE: Role = 'admin';

export function useAdmin() {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.admin);
  const [persistedFilter, setPersistedFilter] = useLocalStorage<AdminFilterContext>(
    FILTER_CONTEXT_KEY,
    admin.filterContext,
  );
  const [persistedCollapsed, setPersistedCollapsed] = useLocalStorage<boolean>(
    FILTER_BAR_COLLAPSED_KEY,
    admin.filterBarCollapsed,
  );

  const canWrite = hasPermission(CURRENT_ROLE, 'admin:write');

  useEffect(() => {
    if (admin.statuses.moduleStatus === 'idle') {
      void dispatch(fetchModuleStatus());
    }
    if (admin.statuses.facets === 'idle') {
      void dispatch(fetchFilterFacets());
    }
  }, [dispatch, admin.statuses.moduleStatus, admin.statuses.facets]);

  useEffect(() => {
    if (JSON.stringify(persistedFilter) !== JSON.stringify(admin.filterContext)) {
      dispatch(applyFilterContext(persistedFilter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (admin.filterBarCollapsed !== persistedCollapsed) {
      dispatch(setFilterBarCollapsed(persistedCollapsed));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchActiveModule = useCallback(() => {
    switch (admin.activeModule) {
      case 'products':
        return dispatch(fetchAdminProducts());
      case 'locations':
        return dispatch(fetchAdminLocations());
      case 'exceptions':
        return dispatch(fetchAdminExceptions());
      default:
        return undefined;
    }
  }, [dispatch, admin.activeModule]);

  useEffect(() => {
    if (admin.activeModule === 'products' && admin.statuses.products === 'idle') {
      void dispatch(fetchAdminProducts());
    }
    if (admin.activeModule === 'locations' && admin.statuses.locations === 'idle') {
      void dispatch(fetchAdminLocations());
    }
    if (admin.activeModule === 'exceptions' && admin.statuses.exceptions === 'idle') {
      void dispatch(fetchAdminExceptions());
    }
  }, [
    dispatch,
    admin.activeModule,
    admin.statuses.products,
    admin.statuses.locations,
    admin.statuses.exceptions,
  ]);

  const selectModule = useCallback(
    (module: ModuleKey) => {
      dispatch(setActiveModule(module));
      if (module === 'products' && admin.statuses.products === 'idle') {
        void dispatch(fetchAdminProducts());
      }
      if (module === 'locations' && admin.statuses.locations === 'idle') {
        void dispatch(fetchAdminLocations());
      }
      if (module === 'exceptions' && admin.statuses.exceptions === 'idle') {
        void dispatch(fetchAdminExceptions());
      }
    },
    [dispatch, admin.statuses.products, admin.statuses.locations, admin.statuses.exceptions],
  );

  const changeViewMode = useCallback(
    (mode: ViewMode) => dispatch(setViewMode(mode)),
    [dispatch],
  );

  const selectItem = useCallback(
    (id: string | null) => dispatch(setSelectedId(id)),
    [dispatch],
  );

  const toggleFilterBar = useCallback(
    (collapsed: boolean) => {
      dispatch(setFilterBarCollapsed(collapsed));
      setPersistedCollapsed(collapsed);
    },
    [dispatch, setPersistedCollapsed],
  );

  const openFilterModal = useCallback(
    () => dispatch(setFilterModalOpen(true)),
    [dispatch],
  );

  const closeFilterModal = useCallback(
    () => dispatch(setFilterModalOpen(false)),
    [dispatch],
  );

  const applyFilters = useCallback(
    (ctx: AdminFilterContext) => {
      dispatch(applyFilterContext(ctx));
      setPersistedFilter(ctx);
      dispatch(setFilterModalOpen(false));
      void refetchActiveModule();
    },
    [dispatch, setPersistedFilter, refetchActiveModule],
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
    setPersistedFilter(EMPTY_FILTER_CONTEXT);
    void refetchActiveModule();
  }, [dispatch, setPersistedFilter, refetchActiveModule]);

  const updateLocalFilters = useCallback(
    (patch: Partial<AdminLocalFilters>) => dispatch(setLocalFilters(patch)),
    [dispatch],
  );

  const commitLocationPatch = useCallback(
    (id: string, patch: Partial<AdminLocation>) =>
      dispatch(patchLocation({ id, patch })),
    [dispatch],
  );

  const commitExceptionPatch = useCallback(
    (id: string, rules: GlobalException['rules']) =>
      dispatch(patchException({ id, rules })),
    [dispatch],
  );

  const deleteException = useCallback(
    (id: string) => dispatch(removeException(id)),
    [dispatch],
  );

  return {
    ...admin,
    canWrite,
    readOnly: !canWrite,
    selectModule,
    changeViewMode,
    selectItem,
    toggleFilterBar,
    openFilterModal,
    closeFilterModal,
    applyFilters,
    clearFilters,
    updateLocalFilters,
    commitLocationPatch,
    commitExceptionPatch,
    deleteException,
    refetchActiveModule,
  };
}
