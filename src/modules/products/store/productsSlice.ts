import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoadStatus } from '@shared/types';
import { getProducts } from '../api';
import type { Product, ProductQuery } from '../types';
import type { SortState } from '@shared/components';

export interface ProductsState {
  items: Product[];
  total: number;
  status: LoadStatus;
  error?: string;
  filters: { category: string[]; q: string };
  sort?: SortState;
  selectedIds: string[];
}

const initialState: ProductsState = {
  items: [],
  total: 0,
  status: 'idle',
  filters: { category: [], q: '' },
  selectedIds: [],
};

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  (query: ProductQuery = {}) => getProducts(query),
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<SortState>) {
      state.sort = action.payload;
    },
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    setCategoryFilter(state, action: PayloadAction<string[]>) {
      state.filters.category = action.payload;
    },
    clearFilters(state) {
      state.filters = { category: [], q: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSort, setSelectedIds, setCategoryFilter, clearFilters } =
  productsSlice.actions;
export const productsReducer = productsSlice.reducer;
