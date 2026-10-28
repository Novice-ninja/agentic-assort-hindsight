import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoadStatus } from '@shared/types';
import { getLocations } from '../api';
import type { Location, LocationQuery } from '../types';

export interface LocationsState {
  items: Location[];
  total: number;
  status: LoadStatus;
  error?: string;
  filters: { region: string[] };
}

const initialState: LocationsState = {
  items: [],
  total: 0,
  status: 'idle',
  filters: { region: [] },
};

export const fetchLocations = createAsyncThunk(
  'locations/fetch',
  (query: LocationQuery = {}) => getLocations(query),
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setRegionFilter(state, action: PayloadAction<string[]>) {
      state.filters.region = action.payload;
    },
    clearFilters(state) {
      state.filters = { region: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setRegionFilter, clearFilters } = locationsSlice.actions;
export const locationsReducer = locationsSlice.reducer;
