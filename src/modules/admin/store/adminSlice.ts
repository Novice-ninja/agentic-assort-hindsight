import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoadStatus } from '@shared/types';
import { defaultFilterContext } from '@tests/fixtures/admin';
import {
  deleteAdminException,
  getAdminExceptions,
  getAdminLocations,
  getAdminProducts,
  getFilterFacets,
  getModuleStatus,
  patchAdminException,
  patchAdminLocation,
} from '../api';
import type {
  AdminFilterContext,
  AdminLocation,
  AdminProduct,
  FilterFacetOption,
  GlobalException,
  ModuleKey,
  ModuleStatusSummary,
  ViewMode,
} from '../types';
import { EMPTY_FILTER_CONTEXT } from '../types/admin';

export interface AdminLocalFilters {
  customerType: string;
  searchQuery: string;
}

export interface AdminState {
  filterContext: AdminFilterContext;
  filterBarCollapsed: boolean;
  activeModule: ModuleKey;
  viewMode: ViewMode;
  selectedId: string | null;
  moduleStatus: ModuleStatusSummary[];
  products: AdminProduct[];
  locations: AdminLocation[];
  exceptions: GlobalException[];
  facetOptions: FilterFacetOption[];
  localFilters: AdminLocalFilters;
  statuses: {
    moduleStatus: LoadStatus;
    products: LoadStatus;
    locations: LoadStatus;
    exceptions: LoadStatus;
    facets: LoadStatus;
    patch: LoadStatus;
  };
  error?: string;
  filterModalOpen: boolean;
}

const initialState: AdminState = {
  filterContext: defaultFilterContext,
  filterBarCollapsed: false,
  activeModule: 'products',
  viewMode: 'table',
  selectedId: null,
  moduleStatus: [],
  products: [],
  locations: [],
  exceptions: [],
  facetOptions: [],
  localFilters: { customerType: 'all', searchQuery: '' },
  statuses: {
    moduleStatus: 'idle',
    products: 'idle',
    locations: 'idle',
    exceptions: 'idle',
    facets: 'idle',
    patch: 'idle',
  },
  filterModalOpen: false,
};

export const fetchModuleStatus = createAsyncThunk('admin/fetchModuleStatus', getModuleStatus);
export const fetchFilterFacets = createAsyncThunk('admin/fetchFilterFacets', getFilterFacets);
export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { getState }) => {
    const { filterContext } = (getState() as { admin: AdminState }).admin;
    return getAdminProducts(filterContext);
  },
);
export const fetchAdminLocations = createAsyncThunk(
  'admin/fetchLocations',
  async (_, { getState }) => {
    const { filterContext, localFilters } = (getState() as { admin: AdminState }).admin;
    return getAdminLocations({
      filter: filterContext,
      customerType: localFilters.customerType,
      q: localFilters.searchQuery || undefined,
    });
  },
);
export const fetchAdminExceptions = createAsyncThunk(
  'admin/fetchExceptions',
  async (_, { getState }) => {
    const { filterContext, localFilters } = (getState() as { admin: AdminState }).admin;
    return getAdminExceptions({
      filter: filterContext,
      customerType: localFilters.customerType,
      q: localFilters.searchQuery || undefined,
    });
  },
);
export const patchLocation = createAsyncThunk(
  'admin/patchLocation',
  async ({ id, patch }: { id: string; patch: Partial<AdminLocation> }) =>
    patchAdminLocation(id, patch),
);
export const patchException = createAsyncThunk(
  'admin/patchException',
  async ({ id, rules }: { id: string; rules: GlobalException['rules'] }) =>
    patchAdminException(id, { rules }),
);
export const removeException = createAsyncThunk('admin/removeException', deleteAdminException);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveModule(state, action: PayloadAction<ModuleKey>) {
      state.activeModule = action.payload;
      state.selectedId = null;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setFilterBarCollapsed(state, action: PayloadAction<boolean>) {
      state.filterBarCollapsed = action.payload;
    },
    setFilterModalOpen(state, action: PayloadAction<boolean>) {
      state.filterModalOpen = action.payload;
    },
    applyFilterContext(state, action: PayloadAction<AdminFilterContext>) {
      state.filterContext = action.payload;
    },
    setLocalFilters(state, action: PayloadAction<Partial<AdminLocalFilters>>) {
      state.localFilters = { ...state.localFilters, ...action.payload };
    },
    resetFilters(state) {
      state.filterContext = EMPTY_FILTER_CONTEXT;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModuleStatus.pending, (state) => {
        state.statuses.moduleStatus = 'loading';
      })
      .addCase(fetchModuleStatus.fulfilled, (state, action) => {
        state.statuses.moduleStatus = 'succeeded';
        state.moduleStatus = action.payload.items;
      })
      .addCase(fetchModuleStatus.rejected, (state, action) => {
        state.statuses.moduleStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFilterFacets.fulfilled, (state, action) => {
        state.statuses.facets = 'succeeded';
        state.facetOptions = action.payload.items;
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.statuses.products = 'loading';
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.statuses.products = 'succeeded';
        state.products = action.payload.items;
      })
      .addCase(fetchAdminProducts.rejected, (state) => {
        state.statuses.products = 'failed';
      })
      .addCase(fetchAdminLocations.pending, (state) => {
        state.statuses.locations = 'loading';
      })
      .addCase(fetchAdminLocations.fulfilled, (state, action) => {
        state.statuses.locations = 'succeeded';
        state.locations = action.payload.items;
        if (!state.selectedId && action.payload.items[0]) {
          state.selectedId = action.payload.items[0].id;
        }
      })
      .addCase(fetchAdminLocations.rejected, (state) => {
        state.statuses.locations = 'failed';
      })
      .addCase(fetchAdminExceptions.pending, (state) => {
        state.statuses.exceptions = 'loading';
      })
      .addCase(fetchAdminExceptions.fulfilled, (state, action) => {
        state.statuses.exceptions = 'succeeded';
        state.exceptions = action.payload.items;
        if (!state.selectedId && action.payload.items[0]) {
          state.selectedId = action.payload.items[0].id;
        }
      })
      .addCase(fetchAdminExceptions.rejected, (state) => {
        state.statuses.exceptions = 'failed';
      })
      .addCase(patchLocation.fulfilled, (state, action) => {
        state.statuses.patch = 'succeeded';
        const idx = state.locations.findIndex((l) => l.id === action.payload.id);
        if (idx >= 0) state.locations[idx] = action.payload;
      })
      .addCase(patchException.fulfilled, (state, action) => {
        state.statuses.patch = 'succeeded';
        const idx = state.exceptions.findIndex((e) => e.id === action.payload.id);
        if (idx >= 0) state.exceptions[idx] = action.payload;
      })
      .addCase(removeException.fulfilled, (state, action) => {
        state.exceptions = state.exceptions.filter((e) => e.id !== action.meta.arg);
        if (state.selectedId === action.meta.arg) {
          state.selectedId = state.exceptions[0]?.id ?? null;
        }
      });
  },
});

export const {
  setActiveModule,
  setViewMode,
  setSelectedId,
  setFilterBarCollapsed,
  setFilterModalOpen,
  applyFilterContext,
  setLocalFilters,
  resetFilters,
} = adminSlice.actions;

export const adminReducer = adminSlice.reducer;
